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
    "note",
    "status",
    "currentAddress",
    [Sequelize.literal(`(SELECT COUNT(trip_customer.id) FROM trip_customer WHERE tripId = Trip.id
        AND status = '${tripContant.TRIPSTATUS.VISITED}')`), 'countVisited'],
    [Sequelize.literal(`(SELECT COUNT(trip_customer.id) FROM trip_customer WHERE tripId = Trip.id
        AND status <> '${tripContant.TRIPSTATUS.SKIP}')`), 'total'],
    "createdAt",
];

let tripIncludes = [
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
        attributes: ["id", "customerId", "lat", "lng", "status", "stt"],
        where: {
            status: {
                [Op.ne]: tripContant.TRIPSTATUS.SKIP
            }
        },
        include: [{
            model: models.Customer,
            as: "customer",
            attributes: ["id", "code", "fullName", "phone", "status"]
        }]
    },
    {
        model: models.TripCustomer,
        as: "customerCurrent",
        attributes: ["id", "stt", "status", "customerId", "lat", "lng"]
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
    const { name, lat, lng, time, userId, note, listCustomer, createdBy, storeId, status = tripContant.TRIPSTATUS.PENDING } = params;
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
            name, lat, lng, time, createdBy, userId, note, storeId, status
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
        let listPoint = [];
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
            listPoint.push(`${customer.lat},${customer.lng}`);
        }
        let res = await sortMap(listPoint);
        for (let i = 0; i < listCustomer.length; i++) {
            const customer = await models.Customer.findOne({
                where: {
                    id: listCustomer[i]
                }
            });
            const index = res.findIndex(item => item == i + 1);
            await models.TripCustomer.create({
                tripId: newTrip.id,
                customerId: listCustomer[i],
                lat: customer.lat,
                lng: customer.lng,
                status: tripContant.TRIPSTATUS.NOT_VISITED,
                stt: index
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
    const { storeId, page = 1, limit = 20, keyword, status } = params;
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
    if (status) {
        where.status = status;
    }

    const rows = await models.Trip.findAll({
        attributes: tripAttributes,
        include: tripIncludes,
        where,
        order: [
            ['createdAt', 'DESC'],
            [{ model: models.TripCustomer, as: "tripCustomer" }, "stt", "ASC"]
        ],
        limit: parseInt(limit),
        offset: parseInt(parseInt(limit) * (parseInt(page) - 1))
    });
    for (let row of rows) {
        if (row.status != tripContant.TRIPSTATUS.DONE) {
            const nextCustomer = row.tripCustomer.find(item => {
                return item.stt == row.customerCurrent.stt + 1;
            });
            row.dataValues.nextCustomer = nextCustomer;
        }
    }
    const count = await models.Trip.count({
        where
    });
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
        },
        order: [[{ model: models.TripCustomer, as: "tripCustomer" }, "stt", "ASC"]]
    });
    let result = await getDistance(trip, id, trip.currentAddress);
    for (let i = 0; i < trip.dataValues.tripCustomer.length; i++) {
        trip.dataValues.tripCustomer[i].dataValues.duration = result.durations[0][i];
        trip.dataValues.tripCustomer[i].dataValues.distances = result.distances[0][i];
    }
    return {
        success: true,
        data: trip
    }
}

const getDistance = async (trip, tripId, current) => {
    const listTripCustomer = await models.TripCustomer.findAll({
        where: {
            tripId: tripId,
            status: {
                [Op.ne]: tripContant.TRIPSTATUS.SKIP
            }
        },
        order: [["stt", "ASC"]]
    });
    let currentIndex;
    let listPoint = listTripCustomer.map((item, index) => {
        if (item.id == current) {
            currentIndex = index;
        }
        return `${item.lat},${item.lng}`;
    });
    if (!current) {
        currentIndex = 0;
        listPoint.unshift(`${trip.lat},${trip.lng}`);
    }
    let points = listPoint.join("&point=");
    let API_KEY = tripContant.KEY.API_KEY;
    points = "point=" + points;
    const apiUrl = `https://maps.vietmap.vn/api/matrix?api-version=1.1&apikey=${API_KEY}&${points}&sources=${currentIndex}`;
    const response = await axios.get(apiUrl);
    const data = response.data;
    return data;
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
                    lat: customer.lat,
                    lng: customer.lng,
                    status: tripContant.TRIPSTATUS.NOT_VISITED
                }, {
                    transaction: t
                });
            }
        }
    });
    await updateIndex(id);
    return {
        success: true,
        data: {

        }
    }
}

module.exports.changeStatus = async (params) => {
    const { tripCustomerId, status, isUpdateAddress, note } = params;
    const tripCustomer = await models.TripCustomer.findOne({
        where: {
            id: tripCustomerId
        }
    });
    const t = await models.sequelize.transaction(async (t) => {
        if (isUpdateAddress == true) {
            await models.Trip.update({
                currentAddress: tripCustomerId
            }, {
                where: {
                    id: tripCustomer.tripId
                },
                transaction: t
            })
        }
        //Nếu là quay lại sau => đưa xuống cuối
        if (status == tripContant.TRIPSTATUS.WAITED) {
            await models.TripCustomer.decrement({
                stt: 1
            }, {
                where: {
                    tripId: tripCustomer.tripId,
                    status: tripContant.TRIPSTATUS.WAITED
                },
                transaction: t
            });

            await models.TripCustomer.update({
                status: tripContant.TRIPSTATUS.WAITED
            }, {
                where: {
                    id: tripCustomerId
                },
                transaction: t
            });
        }
        if (status == tripContant.TRIPSTATUS.VISITED) {
            await models.TripCustomer.update({
                status: tripContant.TRIPSTATUS.VISITED,
            }, {
                where: {
                    id: tripCustomerId
                },
                transaction: t
            });
        }
        //Bỏ qua
        if (status == tripContant.TRIPSTATUS.SKIP) {
            await models.TripCustomer.update({
                status: tripContant.TRIPSTATUS.SKIP,
            }, {
                where: {
                    id: tripCustomerId
                },
                transaction: t
            });
        }
    });
    if (isUpdateAddress == true) {
        await updateIndex(tripCustomer.tripId);
    }
    if (status == tripContant.TRIPSTATUS.WAITED) {
        let count = await models.TripCustomer.count({
            where: {
                status: {
                    [Op.ne]: tripContant.TRIPSTATUS.SKIP
                },
                tripId: tripCustomer.tripId
            }
        });
        await models.TripCustomer.update({
            stt: count
        }, {
            where: {
                id: tripCustomerId
            },
            transaction: t
        });
    }
    if (status == tripContant.TRIPSTATUS.SKIP) {
        await models.TripCustomer.update({
            stt: null
        }, {
            where: {
                id: tripCustomerId
            },
            transaction: t
        });
    }
    return {
        success: true,
        data: null
    }
}

module.exports.updateTripCustomer = async (params) => {
    const { tripCustomerId, lng, lat, storeId } = params;
    const tripCustomer = await models.TripCustomer.findOne({
        where: {
            id: tripCustomerId
        }
    });
    if (tripCustomer.status == tripContant.TRIPSTATUS.VISITED) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: "Không thể thay đổi khi ở trạng thái đã đi thăm"
        };
    }

    let data = {
        lng: lng || tripCustomer.lng,
        lat: lat || tripCustomer.lat
    };
    const t = await models.sequelize.transaction(async (t) => {
        await models.TripCustomer.update(data, {
            where: {
                id: tripCustomerId
            },
            transaction: t
        });
        await updateIndex(tripCustomer.tripId);
    })
    return {
        success: true,
        data: null
    }
}

const updateIndex = async (tripId) => {
    let listTripCustomer = await models.TripCustomer.findAll({
        where: {
            tripId,
            status: tripContant.TRIPSTATUS.NOT_VISITED
        }
    });
    const trip = await models.Trip.findOne({
        where: {
            id: tripId
        }
    });
    if (trip.currentAddress) {
        const tripCustomerCurrent = await models.TripCustomer.findOne({
            where: {
                id: trip.currentAddress
            }
        });
        listTripCustomer.unshift(tripCustomerCurrent);
    }

    let listPoint = [];
    for (const customer of listTripCustomer) {
        listPoint.push(`${customer.lat},${customer.lng}`);
    }
    if (!trip.currentAddress) {
        listPoint.unshift(`${trip.lat},${trip.lng}`);
    }
    if (listPoint.length > 1) {
        let res = await sortMap(listPoint);
        console.log(res);
        const countVisted = await models.TripCustomer.count({
            where: {
                status: tripContant.TRIPSTATUS.VISITED,
                tripId: tripId
            }
        });

        for (let i = 0; i < listTripCustomer.length; i++) {
            const index = res.findIndex(item => item == i + 1);
            if (index - 1 + countVisted != listTripCustomer[i].stt) {
                await models.TripCustomer.update({
                    stt: index - 1 + countVisted
                }, {
                    where: {
                        id: listTripCustomer[i].id
                    }
                })
            }
        }
    }
    const countNotVisited = await models.TripCustomer.count({
        where: {
            tripId: tripId,
            status: tripContant.TRIPSTATUS.NOT_VISITED
        }
    });
    if (countNotVisited == 0) {
        await models.Trip.update({
            status: tripContant.TRIPSTATUS.DONE
        }, {
            where: {
                id: tripId
            }
        });
    }
}

module.exports.searchMap = async (params) => {
    let { keyword } = params;
    let API_KEY = tripContant.KEY.API_KEY;
    keyword = encodeURIComponent(keyword);
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
