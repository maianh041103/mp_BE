const Sequelize = require("sequelize");
const { Op } = Sequelize;
const models = require("../../../database/models");
const { HttpStatusCode } = require("../../helpers/errorCodes");
const axios = require('axios');
const tripContant = require("./tripContant");
const { generateCode } = require("../../helpers/codeGenerator");

const tripAttributes = [
    "id",
    "code",
    "name",
    "lat",
    "lng",
    "time",
    "createdBy",
    "userId",
    "note"
];
const tripIncludes = [
    {
        model: models.User,
        as: "userCreated",
        attributes: ["id", "fullName"]
    },
    {
        model: models.User,
        as: "userManager",
        attributes: ["id", "fullName"]
    },
    {
        model: models.TripCustomer,
        as: "tripCustomer",
        attributes: ["id", "customerId", "status"],
        include: [{
            model: models.Customer,
            as: "customer",
            attributes: ["fullName", "lat", "lng"]
        }]
    }
]

const sortMap = async (listPoint) => {
    let points = listPoint.join("&point=");
    let API_KEY = tripContant.KEY.API_KEY;
    points = "point=" + points;
    const apiUrl = `https://maps.vietmap.vn/api/matrix?api-version=1.1&apikey=${API_KEY}&${points}`;
    const response = await axios.get(apiUrl);
    const data = response.data;
    let res = travel(data);
    return res;
}

const travel = (data) => {
    let X = []; //X[i] là số thứ tự thành phố thứ i đi qua 
    let d = 0; //Tính khoảng cách đi lại
    let ans = 999999999; //lưu chi phí đường đi tối ưu
    let cmin = 999999999; //lưu chi phí 1 quãng đường ngắn nhất
    X[1] = 1;
    let c = data.distances; //Mảng giá trị
    c.unshift([0]);
    for (let i = 0; i < c.length; i++) {
        c[i].unshift(0);
    }
    for (const row of c) {
        for (const col of row) {
            if (col != 0) {
                cmin = Math.min(cmin, col);
            }
        }
    }
    let n = c.length; //n thành phố
    let visited = Array(n).fill(0); //mảng đánh dấu
    n--;
    visited[1] = 1;
    let X_best = []; //Lưu kết quả đi tốt nhất

    const Try = (i) => {
        for (let j = 1; j <= n; j++) {
            if (visited[j] == 0) {
                visited[j] = 1;
                X[i] = j;
                d += c[X[i - 1]][X[i]];
                if (i == n) {
                    if (ans > d + c[X[n]][1]) {
                        ans = d + c[X[n]][1];
                        X_best = [...X];
                    }
                }
                else if (d + (n - i + 1) * cmin < ans) {
                    Try(i + 1);
                }
                //backtrack
                visited[j] = 0;
                d -= c[X[i - 1]][X[i]];
            }
        }
    }
    Try(2);
    return X_best;
}

module.exports.createTrip = async (params) => {
    const { name, lat, lng, time, userId, note, listCustomer, createdBy, storeId } = params;
    const userExists = await models.User.findOne({
        where: {
            storeId: storeId,
            id: userId
        }
    });

    if (!userExists) {
        return {
            error: true,
            message: "Không tìm thấy nhân viên phụ trách",
            code: HttpStatusCode.BAD_REQUEST
        }
    }
    let newTrip;
    //Trong transaction sử dụng return chỉ thoát ra khỏi hàm hiện tại trong transaction
    const t = await models.sequelize.transaction(async (t) => {
        newTrip = await models.Trip.create({
            name, lat, lng, time, createdBy, userId, note, storeId
        }, {
            transaction: t
        });
        const code = generateCode("TOUR", newTrip.id);
        await models.Trip.update({
            code
        }, {
            where: {
                id: newTrip.id
            },
            transaction: t
        })
        newTrip.code = code;
        for (const id of listCustomer) {
            const customer = await models.Customer.findOne({
                where: {
                    id: id,
                    lat: {
                        [Op.ne]: null
                    },
                    lng: {
                        [Op.ne]: null
                    },
                    storeId: storeId
                }
            });
            if (!customer) {
                throw new Error("Không tồn tại khách hàng hoặc địa chỉ không hợp lệ");
            }
            await models.TripCustomer.create({
                tripId: newTrip.id,
                customerId: id,
                status: tripContant.TRIPSTATUS.NOT_VISITED
            }, {
                transaction: t
            });
        }
    })

    return {
        success: true,
        data: {
            trip: newTrip
        },
    }
}

module.exports.getListTrip = async (params) => {
    const { storeId, page = 1, limit = 20, keyword } = params;
    let where = {};
    if (keyword) {
        where = {
            [Op.or]: {
                name: {
                    [Op.like]: `%${keyword}%`
                },
                code: {
                    [Op.like]: `%${keyword}%`
                }
            }
        }
    }
    where.storeId = storeId;

    const rows = await models.Trip.findAll({
        attributes: tripAttributes,
        include: tripIncludes,
        where,
        orderBy: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(parseInt(limit) * (parseInt(page) - 1))
    });
    const count = await models.Trip.count({
        where: {
            storeId
        }
    })
    return {
        success: true,
        data: {
            items: rows,
            totalItem: count,
        },

    }
}

module.exports.getDetailTrip = async (params) => {
    const { storeId, id } = params;
    const trip = await models.Trip.findOne({
        attributes: tripAttributes,
        include: tripIncludes,
        where: {
            storeId,
            id
        }
    });
    let tripCustomer = trip.tripCustomer || [];
    let listPoint = tripCustomer.map(item => {
        return `${item.customer.lat},${item.customer.lng}`;
    });

    let res = await sortMap(listPoint);
    let newTripCustomer = [];
    for (let i = 1; i < res.length; i++) {
        newTripCustomer.push(tripCustomer[res[i] - 1])
    }
    trip.dataValues.tripCustomer = newTripCustomer;
    return {
        success: true,
        data: trip
    }
}

module.exports.updateTrip = async (params) => {
    const { name, lat, lng, time, userId, note, listCustomer, id, storeId } = params;
    const userExists = await models.User.findOne({
        where: {
            storeId: storeId,
            id: userId
        }
    });

    if (!userExists) {
        return {
            error: true,
            message: "Không tìm thấy nhân viên phụ trách",
            code: HttpStatusCode.BAD_REQUEST
        }
    }

    const t = await models.sequelize.transaction(async (t) => {
        await models.Trip.update({
            name, lat, lng, time, userId, note
        }, {
            where: {
                id
            },
            transaction: t
        });
        await models.TripCustomer.destroy({
            where: {
                customerId: {
                    [Op.notIn]: listCustomer
                },
                tripId: id
            },
            transaction: t
        })
        for (const customerId of listCustomer) {
            const isExists = await models.TripCustomer.findOne({
                where: {
                    customerId,
                    tripId: id
                }
            });

            if (!isExists) {
                const customer = await models.Customer.findOne({
                    where: {
                        id: customerId,
                        lat: {
                            [Op.ne]: null
                        },
                        lng: {
                            [Op.ne]: null
                        },
                        storeId: storeId
                    }
                });
                if (!customer) {
                    throw new Error("Không tồn tại khách hàng hoặc địa chỉ không hợp lệ");
                }
                await models.TripCustomer.create({
                    tripId: id,
                    customerId: customerId,
                    status: tripContant.TRIPSTATUS.NOT_VISITED
                }, {
                    transaction: t
                });
            }
        }
    })
    return {
        success: true,
        data: null
    }
}

module.exports.changeStatusTrip = async (params) => {
    const { tripCustomerId, status, storeId } = params;
    await models.TripCustomer.update({
        status
    }, {
        where: {
            id: tripCustomerId
        }
    });
    return {
        success: true,
        data: null
    }
}

module.exports.searchMap = async (params) => {
    const { keyword } = params;
    let API_KEY = tripContant.KEY.API_KEY;
    const apiUrl = `https://maps.vietmap.vn/api/search/v3?apikey=${API_KEY}&text=${keyword}`;
    const response = await axios.get(apiUrl);
    const data = response.data;
    return {
        success: true,
        data
    }
}

module.exports.getPlace = async (params) => {
    const { refId } = params;
    let API_KEY = tripContant.KEY.API_KEY;
    const apiUrl = `https://maps.vietmap.vn/api/place/v3?apikey=${API_KEY}&refid=${refId}`;
    const response = await axios.get(apiUrl);
    const data = response.data;
    return {
        success: true,
        data
    }
}