const Sequelize = require("sequelize");
const { Op } = Sequelize;
const models = require("../../../database/models");
const pointContant = require("./pointContant");
const { HttpStatusCode } = require("../../helpers/errorCodes");

module.exports.createPoint = async (params) => {
    let { isConvertDefault = false, type, convertMoneyBuy, isPointPayment, convertPoint, convertMoneyPayment,
        afterByTime, isDiscountProduct, isDiscountOrder, isPointBuy, isAllCustomer = false, storeId, status, groupCustomers } = params;
    let newPoint;
    const t = await models.sequelize.transaction(async (t) => {
        const pointExists = await models.Point.findOne({
            where: {
                storeId: storeId,
                type: type
            }
        }, {
            raw: true
        });
        if (!pointExists) {
            //Chuyển trạng thái 
            await models.Point.update({
                status: pointContant.statusPoint.INACTIVE
            }, {
                where: {
                    storeId: storeId,
                    type: {
                        [Op.ne]: type
                    }
                }
            })
            //Tạo mới
            newPoint = await models.Point.create({
                isConvertDefault, type, convertMoneyBuy, isPointPayment, convertPoint, convertMoneyPayment,
                afterByTime, isDiscountProduct, isDiscountOrder, isPointBuy, isAllCustomer, storeId, status
            }, {
                transaction: t
            });
            if (isAllCustomer == false) {
                for (const item of groupCustomers) {
                    await models.PointCustomer.create({
                        pointId: newPoint.id,
                        groupCustomerId: item
                    }, {
                        transaction: t
                    })
                }
            }
        }
        else {
            newPoint = pointExists;
            await models.Point.update({
                isConvertDefault, type, convertMoneyBuy, isPointPayment, convertPoint, convertMoneyPayment,
                afterByTime, isDiscountProduct, isDiscountOrder, isPointBuy, isAllCustomer, storeId, status
            }, {
                where: {
                    storeId: storeId,
                    type: {
                        [Op.eq]: type
                    }
                },
                transaction: t
            });

            //Update trạng thái của loại còn lại
            await models.Point.update({
                status: pointContant.statusPoint.INACTIVE
            }, {
                where: {
                    storeId: storeId,
                    type: {
                        [Op.ne]: type
                    }
                },
                transaction: t
            })

            if (isAllCustomer == false) {
                for (const item of groupCustomers) {
                    const itemExists = await models.PointCustomer.findOne({
                        where: {
                            pointId: newPoint.id,
                            groupCustomerId: item
                        }
                    });
                    if (!itemExists) {
                        await models.PointCustomer.create({
                            pointId: newPoint.id,
                            groupCustomerId: item
                        }, {
                            transaction: t
                        })
                    }
                }
            } else {
                await models.PointCustomer.destroy({
                    where: {
                        pointId: newPoint.id
                    },
                    transaction: t
                })
            }
        }
    });

    return {
        success: true,
        data: {
            "id": newPoint.id
        },
    }
}

module.exports.detailPoint = async (params) => {
    const { storeId, type } = params;
    const pointExists = await models.Point.findOne({
        where: { storeId, type }
    }, {
        raw: true
    });
    if (!pointExists) {
        return {
            error: true,
            code: HttpStatusCode.NOT_FOUND,
            message: "Cấu hình tích điểm không tồn tại",
        };
    }
    let listGroupCustomer = await models.PointCustomer.findAll({
        where: {
            pointId: pointExists.id
        }
    });
    listGroupCustomer = listGroupCustomer.map(item => {
        return item.groupCustomerId;
    })
    pointExists.dataValues.listGroupCustomer = listGroupCustomer;

    return {
        success: true,
        data: pointExists,
    }
}

module.exports.changeStatus = async (params) => {
    const { storeId } = params;
    const pointExists = await models.Point.findOne({
        where: { storeId }
    }, {
        raw: true
    });
    if (!pointExists) {
        return {
            error: true,
            code: HttpStatusCode.NOT_FOUND,
            message: "Cấu hình tích điểm không tồn tại",
        };
    }
    const statusChange = pointExists.status == pointContant.statusPoint.ACTIVE ?
        pointContant.statusPoint.INACTIVE : pointContant.statusPoint.ACTIVE;
    await models.Point.update({
        status: statusChange
    }, {
        where: {
            storeId
        }
    });

    return {
        success: true,
        data: null,
    }
}

module.exports.deletePoint = async (params) => {
    const { storeId } = params;
    const pointExists = await models.Point.findOne({
        where: { storeId }
    }, {
        raw: true
    });
    if (!pointExists) {
        return {
            error: true,
            code: HttpStatusCode.NOT_FOUND,
            message: "Cấu hình tích điểm không tồn tại",
        };
    }

    const t = await models.sequelize.transaction(async (t) => {
        await models.PointCustomer.destroy({
            where: {
                pointId: pointExists.id
            }
        })
        await models.Point.destroy({
            where: {
                storeId
            }
        });
    })

    return {
        success: true,
        data: null,
    }
}

module.exports.checkStatus = async (params) => {
    const storeId = params.storeId;
    const checkStatus = await models.Point.findOne({
        where: {
            storeId, status: pointContant.statusPoint.ACTIVE
        }
    });
    if (checkStatus) {
        return {
            success: true,
            data: "active",
        }
    } else {
        return {
            success: true,
            data: "inactive",
        }
    }
}