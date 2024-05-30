const models = require('../../../database/models/index');
const discountContant = require('./discountContant');
const { HttpStatusCode } = require('../../helpers/errorCodes');
const Discount = require('../../../database/models/mp_models/Discount');
const { Sequelize, Op, where } = require("sequelize");
const { getISOWeek } = require('date-fns');

const discountAttributes = [
    "id",
    "code",
    "name",
    "status",
    "note",
    "target",
    "type",
    "isMultiple",
    "createdAt",
    "updatedAt",
    "deletedAt"
];

const discountIncludes = [
    {
        model: models.DiscountItem,
        as: "discountItem",
        attributes: ["id", "orderFrom", "fromQuantity", "maxQuantity", "discountValue", "discountType", "pointType", "isGift", "pointValue"],
        include: [
            {
                model: models.ProductDiscountItem,
                as: "productDiscount",
                attributes: ["productUnitId", "groupId", "isCondition"],
            }
        ]
    },
    {
        model: models.DiscountTime,
        as: "discountTime",
        attributes: ["id", "dateFrom", "dateTo", "byDay", "byMonth", "byHour", "byWeekDay", "isWarning", "isBirthday", "birthdayType"]
    },
    {
        model: models.DiscountBranch,
        as: "discountBranch",
        attributes: ["branchId"]
    },
    {
        model: models.DiscountCustomer,
        as: "discountCustomer",
        attributes: ["customerId"]
    }
]

const generateDiscountCode = (id) => {
    // Chuyển id thành chuỗi
    const idString = id.toString();
    // Điền đầy bằng số 0 để đạt tổng cộng 9 chữ số
    const paddedId = idString.padStart(9, '0');
    // Thêm tiền tố "KM"
    const result = `KM${paddedId}`;
    return result;
}

const checkExistsCode = async (id, code) => {
    const discount = await models.Discount.findOne({
        where: {
            code: code,
            id: {
                [Op.ne]: id
            }
        }
    });
    if (discount)
        return true;
    return false;
}

module.exports.create = async (discount, loginUser) => {
    var newDiscountId;
    //Check mã code
    if (discount.code != "" && (await checkExistsCode(-1, discount.code))) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Mã code ${discount.code} đã tồn tại`
        }
    }

    if (discount.name == "") {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Name không được để trống`
        }
    }
    const t = await models.sequelize.transaction(async (t) => {
        //Tạo bảng discount
        const { code, name, status, note, target, type, isMultiple, createdAt } = discount;
        const newDiscount = await models.Discount.create({
            code, name, status, note, target, type, isMultiple, createdAt
        }, { transaction: t })

        newDiscountId = newDiscount.id;

        //Update code
        if (discount.code == "") {
            await newDiscount.update(
                { code: generateDiscountCode(newDiscount.id) },
                { where: { id: newDiscountId }, transaction: t },
            )
        }

        //Thêm bảng discount item
        const { items } = discount || [];
        for (const item of items) {
            const orderFrom = (item.condition.order || {}).from;
            const fromQuantity = (item.condition.product || {}).from;
            const maxQuantity = (item.apply || {}).maxQuantity;
            const discountValue = (item.apply || {}).discountValue;
            const discountType = (item.apply || {}).discountType;
            const pointType = (item.apply || {}).pointType;
            const isGift = (item.apply || {}).isGift;
            const pointValue = (item.apply || {}).pointValue;
            const changeType = (item.apply || {}).changeType;
            const fixedPrice = (item.apply || {}).fixedPrice;

            const newDiscountItem = await models.DiscountItem.create({
                discountId: newDiscountId,
                orderFrom, fromQuantity, maxQuantity, discountValue,
                discountType, pointType, isGift, pointValue,
                changeType, fixedPrice
            }, { transaction: t });

            const productCondition = (item.condition || {}).productUnitId || [];
            const groupCondition = (item.condition || {}).groupId || [];
            const productApply = (item.apply || {}).productUnitId || [];
            const groupApply = (item.apply || {}).groupId || [];
            if (productCondition) {
                for (const item of productCondition) {
                    await models.ProductDiscountItem.create({
                        discountItemId: newDiscountItem.id,
                        productUnitId: item,
                        isCondition: true
                    }, { transaction: t });
                }
            }

            if (groupCondition) {
                for (const item of groupCondition) {
                    await models.ProductDiscountItem.create({
                        discountItemId: newDiscountItem.id,
                        groupId: item,
                        isCondition: true
                    }, { transaction: t });
                }
            }

            if (productApply) {
                for (const item of productApply) {
                    await models.ProductDiscountItem.create({
                        discountItemId: newDiscountItem.id,
                        productUnitId: item,
                        isCondition: false
                    }, { transaction: t });
                }
            }

            if (groupApply) {
                for (const item of groupApply) {
                    await models.ProductDiscountItem.create({
                        discountItemId: newDiscountItem.id,
                        groupId: item,
                        isCondition: false
                    }, { transaction: t });
                }
            }
        }

        //Thêm vào bảng discount time
        const { time } = discount || {};
        let { dateFrom, dateTo, byDay, byMonth, byHour, byWeekDay, isWarning, isBirthday, birthdayType } = time;
        byDay = (byDay != "" && byDay != null) ? `//${byDay.join("//")}//` : "";
        byHour = (byHour != "" && byHour != null) ? `//${byHour.join("//")}//` : "";
        byMonth = (byMonth != "" && byMonth != null) ? `//${byMonth.join("//")}//` : "";
        byWeekDay = (byWeekDay != "" && byWeekDay != null) ? `//${byWeekDay.join("//")}//` : "";

        await models.DiscountTime.create({
            discountId: newDiscountId,
            dateFrom, dateTo, byDay, byMonth,
            byHour, byWeekDay, isWarning, isBirthday, birthdayType
        }, { transaction: t });

        //Thêm vào bảng discountBranch
        const { branch, customer } = discount.scope || {};
        if (branch) {
            let { isAll, ids } = branch;
            if (isAll == true) {
                //Tìm tất cả branch thuộc cùng 1 storeId
                let objectIds = await models.Branch.findAll({
                    where: {
                        storeId: loginUser.storeId
                    },
                    attributes: ["id"],
                    raw: true
                });

                ids = objectIds.map((item, index) => {
                    return item.id
                })

            }
            for (const id of ids) {
                await models.DiscountBranch.create({
                    discountId: newDiscountId,
                    branchId: id
                }, { transaction: t });
            }
        }

        //Thêm vào bảng discountCustomer
        if (customer) {
            let { isAll, ids } = customer;
            if (isAll == true) {
                //Tạo tất cả customer thuộc 1 storeId
                let objectIds = await models.Customer.findAll({
                    where: {
                        storeId: loginUser.storeId
                    },
                    attributes: ["id"],
                    raw: true
                });

                ids = objectIds.map((item, index) => item.id)
            }
            for (const id of ids) {
                await models.DiscountCustomer.create({
                    discountId: newDiscountId,
                    customerId: id
                }, { transaction: t });
            }
        }
    });

    return {
        success: true,
        data: {
            "id": newDiscountId
        },
    }

}

module.exports.getAll = async (filter, loginUser) => {
    const {
        page, limit, keyword, effective, target, type, status
    } = filter;

    let where = {};
    if (keyword) {
        where = {
            [Op.or]: {
                name: {
                    [Op.like]: `%${keyword.trim()}%`
                },
                code: {
                    [Op.like]: `%${keyword.trim()}%`
                }
            }
        }
    }

    if (effective) {
        let tmp = {};
        if (effective == 1) {
            discountIncludes[1] = {
                model: models.DiscountTime,
                as: "discountTime",
                where: {
                    [Op.and]: {
                        dateFrom: {
                            [Op.gt]: Date.now(),
                        }
                    }
                },
                attributes: ["id", "dateFrom", "dateTo", "byDay", "byMonth", "byHour", "byWeekDay", "isWarning", "isBirthday", "birthdayType"]
            }
        }
        else if (effective == 2) {
            discountIncludes[1] = {
                model: models.DiscountTime,
                as: "discountTime",
                where: {
                    [Op.and]: {
                        dateFrom: {
                            [Op.lte]: Date.now(),
                        },
                        dateTo: {
                            [Op.gte]: Date.now(),
                        }
                    }
                },
                attributes: ["id", "dateFrom", "dateTo", "byDay", "byMonth", "byHour", "byWeekDay", "isWarning", "isBirthday", "birthdayType"]
            }
        }
        else if (effective == 3) {
            discountIncludes[1] = {
                model: models.DiscountTime,
                as: "discountTime",
                where: {
                    [Op.and]: {
                        dateTo: {
                            [Op.lt]: Date.now(),
                        }
                    }
                },
                attributes: ["id", "dateFrom", "dateTo", "byDay", "byMonth", "byHour", "byWeekDay", "isWarning", "isBirthday", "birthdayType"]
            }
        }
    }

    if (target) {
        where.target = target.trim();
    }

    if (type) {
        where.type = type.trim()
    }

    if (status) {
        where.status = status.trim();
    }

    const rows = await models.Discount.findAll({
        where,
        attributes: discountAttributes,
        include: discountIncludes,
        limit: parseInt(limit),
        order: [['createdAt', 'DESC']],
        offset: (page - 1) * limit
    });

    const count = await models.Discount.count({
        where,
        attributes: ["id"],
        include: [discountIncludes[1]],
        raw: true
    });

    return {
        success: true,
        data: {
            items: rows,
            totalItem: count
        }
    }
}

module.exports.update = async (discount, discountId, loginUser) => {
    //Check mã code
    if (discount.code && (await checkExistsCode(discountId, discount.code))) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Mã code ${discount.code} đã tồn tại`
        }
    }

    const discountExists = await models.Discount.findOne({
        where: {
            id: discountId
        }
    });
    if (!discountExists) {
        return {
            error: true,
            code: HttpStatusCode.NOT_FOUND,
            message: "Mã giảm giá không tồn tại",
        };
    }

    const t = await models.sequelize.transaction(async (t) => {
        //Update bảng discount
        const discountUpdate = await models.Discount.update(
            discount, {
            where: {
                id: discountId
            },
            transaction: t
        })

        //Update bảng discount item
        //Xoá
        const { items } = discount || [];
        let listOldDiscountItem = await models.DiscountItem.findAll({
            attributes: ["id"],
            where: {
                discountId: discountId
            },
            raw: true
        });
        listOldDiscountItem = listOldDiscountItem.map(item => item.id);

        const listDiscountItemId = items.map(item => item.id)
            .filter(item => item != undefined);

        await models.ProductDiscountItem.destroy({
            where: {
                discountItemId: {
                    [Op.and]: {
                        [Op.in]: listOldDiscountItem,
                        [Op.notIn]: listDiscountItemId
                    }
                },
            },
            transaction: t
        })

        await models.DiscountItem.destroy({
            where: {
                id: {
                    [Op.and]: {
                        [Op.in]: listOldDiscountItem,
                        [Op.notIn]: listDiscountItemId
                    }
                }
            },
            transaction: t
        })

        //End xóa
        for (const item of items) {
            const id = item.id;
            const orderFrom = (item.condition.order || {}).from;
            const fromQuantity = (item.condition.product || {}).from;
            const maxQuantity = (item.apply || {}).maxQuantity;
            const discountValue = (item.apply || {}).discountValue;
            const discountType = (item.apply || {}).discountType;
            const pointType = (item.apply || {}).pointType;
            const isGift = (item.apply || {}).isGift;
            const pointValue = (item.apply || {}).pointValue;
            const changeType = (item.apply || {}).changeType;
            const fixedPrice = (item.apply || {}).fixedPrice;

            let discountItemId = item.id;
            if (id) {
                await models.DiscountItem.update({
                    discountId, orderFrom, fromQuantity, maxQuantity, discountValue,
                    discountType, pointType, isGift, pointValue, changeType, fixedPrice
                }, {
                    where: {
                        id: id
                    },
                    transaction: t
                });
            }
            else {
                discountItemId = (await models.DiscountItem.create({
                    discountId, orderFrom, fromQuantity, maxQuantity, discountValue,
                    discountType, pointType, isGift, pointValue, changeType, fixedPrice
                }, {
                    transaction: t
                })).id;
            }

            const productCondition = (item.condition || {}).productUnitId || [];
            const groupCondition = (item.condition || {}).groupId || [];
            const productApply = (item.apply || {}).productUnitId || [];
            const groupApply = (item.apply || {}).groupId || [];

            if (productCondition) {
                for (const item of productCondition) {
                    const itemExists = await models.ProductDiscountItem.findOne({
                        where: {
                            discountItemId: discountItemId,
                            productUnitId: item,
                            isCondition: true
                        },
                        attributes: ["discountItemId"]
                    })
                    if (!itemExists) {
                        const newProductDiscount = await models.ProductDiscountItem.create({
                            discountItemId: discountItemId,
                            productUnitId: item,
                            isCondition: true
                        }, {
                            transaction: t
                        });
                    }
                }
            }
            await models.ProductDiscountItem.destroy({
                where: {
                    discountItemId: discountItemId,
                    productUnitId: {
                        [Op.notIn]: productCondition
                    },
                    groupId: {
                        [Op.notIn]: groupCondition
                    },
                    isCondition: true
                },
                transaction: t
            })

            if (groupCondition) {
                for (const item of groupCondition) {
                    const itemExists = await models.ProductDiscountItem.findOne({
                        where: {
                            discountItemId: discountItemId,
                            groupId: item,
                            isCondition: true
                        }
                    })
                    if (!itemExists) {
                        await models.ProductDiscountItem.create({
                            discountItemId: discountItemId,
                            groupId: item,
                            isCondition: true
                        }, { transaction: t });
                    }
                }
            }
            await models.ProductDiscountItem.destroy({
                where: {
                    discountItemId: discountItemId,
                    groupId: {
                        [Op.notIn]: groupCondition
                    },
                    productUnitId: {
                        [Op.notIn]: productCondition
                    },
                    isCondition: true
                },
                transaction: t
            })

            if (productApply) {
                for (const item of productApply) {
                    const itemExists = await models.ProductDiscountItem.findOne({
                        where: {
                            discountItemId: discountItemId,
                            productUnitId: item,
                            isCondition: false
                        }
                    })
                    if (!itemExists) {
                        for (const item of productApply) {
                            await models.ProductDiscountItem.create({
                                discountItemId: discountItemId,
                                productUnitId: item,
                                isCondition: false
                            }, {
                                transaction: t
                            });
                        }
                    }
                }
            }
            await models.ProductDiscountItem.destroy({
                where: {
                    discountItemId: discountItemId,
                    productUnitId: {
                        [Op.notIn]: productApply
                    },
                    groupId: {
                        [Op.notIn]: groupApply
                    },
                    isCondition: false
                },
                transaction: t
            })

            if (groupApply) {
                for (const item of productApply) {
                    const itemExists = await models.ProductDiscountItem.findOne({
                        where: {
                            discountItemId: discountItemId,
                            groupId: item,
                            isCondition: false
                        }
                    })
                    if (!itemExists) {
                        for (const item of groupApply) {
                            await models.ProductDiscountItem.create({
                                discountItemId: discountItemId,
                                groupId: item,
                                isCondition: false
                            }, {
                                transaction: t
                            });
                        }
                    }
                }
            }
            await models.ProductDiscountItem.destroy({
                where: {
                    discountItemId: discountItemId,
                    groupId: {
                        [Op.notIn]: groupApply
                    },
                    productUnitId: {
                        [Op.notIn]: productApply
                    },
                    isCondition: false
                },
                transaction: t
            })
        }

        //Thêm vào bảng discount time
        const { time } = discount || {};
        let { dateFrom, dateTo, byDay, byMonth, byHour, byWeekDay, isWarning, isBirthday, birthdayType } = time;

        byDay = (byDay != "" && byDay != null) ? `//${byDay.join("//")}//` : "";
        byHour = (byHour != "" && byHour != null) ? `//${byHour.join("//")}//` : "";
        byMonth = (byMonth != "" && byMonth != null) ? `//${byMonth.join("//")}//` : "";
        byWeekDay = (byWeekDay != "" && byWeekDay != null) ? `//${byWeekDay.join("//")}//` : "";

        await models.DiscountTime.update({
            discountId: discountId,
            dateFrom, dateTo, byDay, byMonth,
            byHour, byWeekDay, isWarning, isBirthday, birthdayType
        }, {
            where: {
                discountId: discountId
            },
            transaction: t
        });

        //Thêm vào bảng discountBranch
        const { branch, customer } = discount.scope || {};
        if (branch) {
            let { isAll, ids } = branch;
            if (isAll == true) {
                //Tìm tất cả branch thuộc cùng 1 storeId
                let objectIds = await models.Branch.findAll({
                    where: {
                        storeId: loginUser.storeId
                    },
                    attributes: ["id"],
                    raw: true
                });

                ids = objectIds.map((item, index) => {
                    return item.id
                })
            }

            await models.DiscountBranch.destroy({
                where: {
                    branchId: {
                        [Op.notIn]: ids
                    },
                    discountId: discountId
                },
                transaction: t
            })

            let listoldDiscountBrand = await models.DiscountBranch.findAll({
                where: {
                    discountId: discountId
                },
                attributes: ["branchId"],
                raw: true
            });

            listoldDiscountBrand = listoldDiscountBrand.map(item => item.branchId);

            for (const id of ids) {
                if (!listoldDiscountBrand.includes(id)) {
                    await models.DiscountBranch.create({
                        discountId: discountId,
                        branchId: id
                    }, {
                        transaction: t
                    });
                }
            }
        }

        //Thêm vào bảng discountCustomer
        if (customer) {
            let { isAll, ids } = customer;
            if (isAll == true) {
                //Tạo tất cả customer thuộc 1 storeId
                let objectIds = await models.Customer.findAll({
                    where: {
                        storeId: loginUser.storeId
                    },
                    attributes: ["id"],
                    raw: true
                });

                ids = objectIds.map((item, index) => item.id)
            }

            await models.DiscountCustomer.destroy({
                where: {
                    customerId: {
                        [Op.notIn]: ids
                    },
                    discountId: discountId
                },
                transaction: t
            })

            let listoldDiscountCustomer = await models.DiscountCustomer.findAll({
                where: {
                    discountId: discountId
                },
                attributes: ["customerId"],
                raw: true
            });

            listoldDiscountCustomer = listoldDiscountCustomer.map(item => item.customerId)

            for (const id of ids) {
                if (!listoldDiscountCustomer.includes(id)) {
                    await models.DiscountCustomer.create({
                        discountId: discountId,
                        customerId: id
                    }, {
                        transaction: t
                    });
                }
            }
        }
    });

    return {
        success: true,
        data: null
    }
}

module.exports.delete = async (discountId, loginUser) => {
    const findDiscount = await models.Discount.findOne({
        id: discountId
    }, {
        attributes: ["id"],
    });
    if (!findDiscount) {
        return {
            error: true,
            code: HttpStatusCode.NOT_FOUND,
            message: "Mã giảm giá không tồn tại",
        };
    }
    //Kiểm tra mã đã được áp dụng
    const discountUsed = await models.DiscountApply.findOne({
        where: {
            discountId: discountId
        }
    });

    if (discountUsed) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: "Mã giảm giá đã được sử dụng, không thể xóa",
        };
    }
    //Hết kiểm tra mã đã được áp dụng

    const t = await models.sequelize.transaction(async (t) => {
        //Xoá discountTime
        await models.DiscountTime.destroy({
            where: {
                discountId: discountId
            },
            transaction: t
        });

        //Xóa discountBranch
        await models.DiscountBranch.destroy({
            where: {
                discountId: discountId
            },
            transaction: t
        });

        //Xóa discountCustomer
        await models.DiscountCustomer.destroy({
            where: {
                discountId: discountId
            }, transaction: t
        });

        //Xóa productDiscountItem
        let listDiscountItem = await models.DiscountItem.findAll({
            where: {
                discountId: discountId
            },
            attributes: ["id"]
        });
        listDiscountItem = listDiscountItem.map(item => item.id);
        await models.ProductDiscountItem.destroy({
            where: {
                discountItemId: {
                    [Op.in]: listDiscountItem
                }
            }, transaction: t
        });

        //Xóa discountItem
        await models.DiscountItem.destroy({
            where: {
                discountId: discountId
            }, transaction: t
        });

        //Xóa discount
        await models.Discount.destroy({
            where: {
                id: discountId,
            },
            transaction: t
        });
    })

    return {
        success: true,
        data: null
    }
}

module.exports.getDetail = async (discountId, loginUser) => {
    const findDiscount = await models.Discount.findOne({
        where: {
            id: discountId
        },
        attributes: discountAttributes,
        include: discountIncludes
    });

    if (!findDiscount) {
        return {
            error: true,
            code: HttpStatusCode.NOT_FOUND,
            message: "Mã giảm giá không tồn tại",
        };
    }

    return {
        success: true,
        data: findDiscount
    }
}

const getDiscountApplyIncludes = (order, filter, loginUser) => {
    const {
        customerId, branchId
    } = order;

    const moment = new Date();
    const dayMoment = moment.getDate();
    const monthMoment = moment.getMonth() + 1;
    const hourMoment = moment.getHours();
    const weekDayMoment = moment.getDay() + 1;
    const yearMoment = moment.getFullYear();
    const currentDate = `${yearMoment}-${monthMoment}-${dayMoment}`;
    const currentWeek = getISOWeek(moment);

    const discountApplyIncludes = []

    const discountTime = {
        model: models.DiscountTime,
        as: "discountTime",
        attributes: ["id", "dateFrom", "dateTo", "byDay", "byMonth", "byHour", "byWeekDay", "isWarning", "isBirthday", "birthdayType",
            [Sequelize.literal(`(SELECT birthday from customers where customers.id = ${customerId})`), 'birthday']
        ],
        where: {
            dateFrom: {
                [Op.lte]: moment
            },
            dateTo: {
                [Op.gte]: moment
            },
            byDay: {
                [Op.or]: {
                    [Op.eq]: "",
                    [Op.like]: `%//${dayMoment}//%`
                }
            },
            byMonth: {
                [Op.or]: {
                    [Op.eq]: "",
                    [Op.like]: `%//${monthMoment}//%`
                }
            },
            byHour: {
                [Op.or]: {
                    [Op.eq]: "",
                    [Op.like]: `%//${hourMoment}//%`
                }
            },
            byWeekDay: {
                [Op.or]: {
                    [Op.eq]: "",
                    [Op.like]: `%//${weekDayMoment}//%`
                }
            },
            isBirthday: {
                [Op.or]: {
                    [Op.eq]: 0,
                    [Op.and]: [
                        // Sequelize.literal(`(
                        //     SELECT MONTH(birthday) 
                        //     FROM customers 
                        //     WHERE customers.id = ${customerId}
                        // ) = ${monthMoment}`),
                        // Sequelize.literal(`(
                        //     SELECT birthdayType
                        //     FROM discount_times 
                        // ) = 'month'`)

                        Sequelize.literal(`
                        CASE
                            WHEN birthdayType = 'month' THEN
                                MONTH((SELECT birthday FROM customers WHERE customers.id = ${customerId})) = ${monthMoment}
                            WHEN birthdayType = 'week' THEN
                                WEEK((SELECT birthday FROM customers WHERE customers.id = ${customerId}),1) = ${currentWeek}
                            WHEN birthdayType = 'day' THEN
                                MONTH((SELECT birthday FROM customers WHERE customers.id = ${customerId})) = ${monthMoment}
                                AND DAY((SELECT birthday FROM customers WHERE customers.id = ${customerId})) = ${dayMoment}
                            ELSE
                                false
                        END
                        `)
                    ]
                }
            }
        }
    }
    discountApplyIncludes.push(discountTime);

    const discountBranch = {
        model: models.DiscountBranch,
        as: "discountBranch",
        attributes: ["branchId"],
        where: {
            branchId: {
                [Op.eq]: branchId
            }
        }
    }
    discountApplyIncludes.push(discountBranch);

    const discountCustomer = {
        model: models.DiscountCustomer,
        as: "discountCustomer",
        attributes: ["customerId"],
        where: {
            customerId: {
                [Op.eq]: customerId
            }
        }
    }
    discountApplyIncludes.push(discountCustomer);

    return discountApplyIncludes;
}

module.exports.getDiscountByOrder = async (order, filter, loginUser) => {
    const discountByOrderIncludes = getDiscountApplyIncludes(order, filter, loginUser);

    const {
        products, totalPrice
    } = order;

    const discountItem = {
        model: models.DiscountItem,
        as: "discountItem",
        attributes: ["id", "orderFrom", "fromQuantity", "maxQuantity", "discountValue", "discountType", "pointType", "isGift", "pointValue"],
        include: [
            {
                model: models.ProductDiscountItem,
                as: "productDiscount",
                attributes: ["productUnitId", "groupId", "isCondition"],
            }
        ],
        where: {
            orderFrom: {
                [Op.lte]: totalPrice
            }
        }
    }
    discountByOrderIncludes.push(discountItem);

    const {
        page, limit
    } = filter;

    const where = {
        target: discountContant.discountTarget.ORDER,
        status: discountContant.discountStatus.ACTIVE
    }

    const rows = await models.Discount.findAll({
        attributes: discountAttributes,
        include: discountByOrderIncludes,
        order: [['createdAt', 'DESC']],
        where,
        limit: parseInt(limit),
        offset: (page - 1) * limit
    });

    const count = await models.Discount.aggregate('Discount.id', 'count', {
        attributes: discountAttributes,
        include: discountByOrderIncludes,
        where,
        distinct: true // nếu bạn muốn đếm các giá trị khác nhau
    })

    return {
        success: true,
        data: {
            items: rows,
            totalItem: count
        }
    }
}

module.exports.getDiscountByProduct = async (order, filter, loginUser) => {
    const {
        productUnitId, quantity
    } = order;

    const {
        page, limit
    } = filter;

    const discountByProductIncludes = getDiscountApplyIncludes(order, filter, loginUser);
    const discountItem = {
        model: models.DiscountItem,
        as: "discountItem",
        attributes: ["id", "orderFrom", "fromQuantity", "maxQuantity", "discountValue", "discountType", "pointType", "isGift", "pointValue"],
        include: [
            {
                model: models.ProductDiscountItem,
                as: "productDiscount",
                attributes: ["productUnitId", "groupId", "isCondition"],
                where: {
                    isCondition: 1,
                    productUnitId: productUnitId
                }
            }
        ],
        where: {
            fromQuantity: {
                [Op.lte]: quantity
            }
        }
    }
    discountByProductIncludes.push(discountItem);

    const where = {
        target: discountContant.discountTarget.PRODUCT,
        status: discountContant.discountStatus.ACTIVE
    }

    let rows = await models.Discount.findAll({
        attributes: discountAttributes,
        include: discountByProductIncludes,
        order: [['createdAt', 'DESC']],
        where,
        limit: parseInt(limit),
        offset: (page - 1) * limit
    });

    for (let row of rows) {
        const listItem = row.discountItem;
        for (let item of listItem) {
            const listProduct = await models.ProductDiscountItem.findAll({
                where: {
                    discountItemId: item.id
                }
            });
            item.dataValues.productDiscount = listProduct;
        }
    }

    const count = await models.Discount.aggregate('Discount.id', 'count', {
        attributes: discountAttributes,
        include: discountByProductIncludes,
        where,
        distinct: true // nếu bạn muốn đếm các giá trị khác nhau
    })

    return {
        success: true,
        data: {
            items: rows,
            totalItem: count
        }
    }
}