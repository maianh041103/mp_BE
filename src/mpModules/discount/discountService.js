const models = require('../../../database/models/index');
const discountContant = require('./discountContant');
const { HttpStatusCode } = require('../../helpers/errorCodes');
const Discount = require('../../../database/models/mp_models/Discount');
const { Sequelize, Op, where } = require("sequelize");

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
                attributes: ["productId", "groupId", "isCondition"],
            }
        ]
    },
    {
        model: models.DiscountTime,
        as: "discountTime",
        attributes: ["id", "dateFrom", "dateTo", "byDay", "byMonth", "byHour", "byWeekDay", "isWarning", "isBirthday"]
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
    //Check mã code
    if (discount.code != "" && (await checkExistsCode(-1, discount.code))) {
        return {
            error: true,
            status: HttpStatusCode.BAD_REQUEST,
            message: `Mã code ${discount.code} đã tồn tại`
        }
    }

    //Tạo bảng discount
    const { code, name, status, note, target, type, isMultiple, createdAt } = discount;
    const newDiscount = await models.Discount.create({
        code, name, status, note, target, type, isMultiple, createdAt
    })

    const newDiscountId = newDiscount.id;

    //Update code
    if (discount.code == "") {
        await newDiscount.update(
            { code: generateDiscountCode(newDiscount.id) },
            { where: { id: newDiscountId } })
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
        });

        const productCondition = (item.condition || {}).productId || [];
        const groupCondition = (item.condition || {}).groupId || [];
        const productApply = (item.apply || {}).productId || [];
        const groupApply = (item.apply || {}).groupId || [];
        if (productCondition) {
            for (const item of productCondition) {
                await models.ProductDiscountItem.create({
                    discountItemId: newDiscountItem.id,
                    productId: item,
                    isCondition: true
                });
            }
        }

        if (groupCondition) {
            for (const item of groupCondition) {
                await models.ProductDiscountItem.create({
                    discountItemId: newDiscountItem.id,
                    groupId: item,
                    isCondition: true
                });
            }
        }

        if (productApply) {
            for (const item of productApply) {
                await models.ProductDiscountItem.create({
                    discountItemId: newDiscountItem.id,
                    productId: item,
                    isCondition: false
                });
            }
        }

        if (groupApply) {
            for (const item of groupApply) {
                await models.ProductDiscountItem.create({
                    discountItemId: newDiscountItem.id,
                    groupId: item,
                    isCondition: false
                });
            }
        }
    }

    //Thêm vào bảng discount time
    const { time } = discount || {};
    let { dateFrom, dateTo, byDay, byMonth, byHour, byWeekDay, isWarning, isBirthday } = time;
    if (byDay) {
        byDay = byDay.join("//");
        byHour = byHour.join("//");
        byMonth = byMonth.join("//");
        byWeekDay = byWeekDay.join("//")
    }

    await models.DiscountTime.create({
        discountId: newDiscountId,
        dateFrom, dateTo, byDay, byMonth,
        byHour, byWeekDay, isWarning, isBirthday
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
        for (const id of ids) {
            await models.DiscountBranch.create({
                discountId: newDiscountId,
                branchId: id
            });
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
            });
        }
    }

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
                attributes: ["id", "dateFrom", "dateTo", "byDay", "byMonth", "byHour", "byWeekDay", "isWarning", "isBirthday"]
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
                attributes: ["id", "dateFrom", "dateTo", "byDay", "byMonth", "byHour", "byWeekDay", "isWarning", "isBirthday"]
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
                attributes: ["id", "dateFrom", "dateTo", "byDay", "byMonth", "byHour", "byWeekDay", "isWarning", "isBirthday"]
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
        offset: (page - 1) * limit
    });

    const count = await models.Discount.count({
        where,
        attributes: ["id"],
        include: [discountIncludes[1]],
        limit: parseInt(limit),
        offset: (page - 1) * limit,
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
            status: HttpStatusCode.BAD_REQUEST,
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

    //Update bảng discount
    const discountUpdate = await models.Discount.update(
        discount, {
        where: { id: discountId }
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
            }
        }
    })

    const countDiscountItemDestroy = await models.DiscountItem.destroy({
        where: {
            id: {
                [Op.and]: {
                    [Op.in]: listOldDiscountItem,
                    [Op.notIn]: listDiscountItemId
                }
            }
        }
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
                }
            });
        }
        else {
            discountItemId = (await models.DiscountItem.create({
                discountId, orderFrom, fromQuantity, maxQuantity, discountValue,
                discountType, pointType, isGift, pointValue, changeType, fixedPrice
            })).id;
        }

        const productCondition = (item.condition || {}).productId || [];
        const groupCondition = (item.condition || {}).groupId || [];
        const productApply = (item.apply || {}).productId || [];
        const groupApply = (item.apply || {}).groupId || [];

        if (productCondition) {
            for (const item of productCondition) {
                const itemExists = await models.ProductDiscountItem.findOne({
                    where: {
                        discountItemId: discountItemId,
                        productId: item,
                        isCondition: true
                    },
                    attributes: ["discountItemId"]
                })
                if (!itemExists) {
                    const newProductDiscount = await models.ProductDiscountItem.create({
                        discountItemId: discountItemId,
                        productId: item,
                        isCondition: true
                    });
                }
            }
        }
        await models.ProductDiscountItem.destroy({
            where: {
                discountItemId: discountItemId,
                productId: {
                    [Op.notIn]: productCondition
                },
                groupId: {
                    [Op.notIn]: groupCondition
                },
                isCondition: true
            }
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
                    });
                }
            }
        }
        await models.ProductDiscountItem.destroy({
            where: {
                discountItemId: discountItemId,
                groupId: {
                    [Op.notIn]: groupCondition
                },
                productId: {
                    [Op.notIn]: productCondition
                },
                isCondition: true
            }
        })

        if (productApply) {
            for (const item of productApply) {
                const itemExists = await models.ProductDiscountItem.findOne({
                    where: {
                        discountItemId: discountItemId,
                        productId: item,
                        isCondition: false
                    }
                })
                if (!itemExists) {
                    for (const item of productApply) {
                        await models.ProductDiscountItem.create({
                            discountItemId: discountItemId,
                            productId: item,
                            isCondition: false
                        });
                    }
                }
            }
        }
        await models.ProductDiscountItem.destroy({
            where: {
                discountItemId: discountItemId,
                productId: {
                    [Op.notIn]: productApply
                },
                groupId: {
                    [Op.notIn]: groupApply
                },
                isCondition: false
            }
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
                productId: {
                    [Op.notIn]: productApply
                },
                isCondition: false
            }
        })
    }

    //Thêm vào bảng discount time
    const { time } = discount || {};
    let { dateFrom, dateTo, byDay, byMonth, byHour, byWeekDay, isWarning, isBirthday } = time;
    if (byDay) {
        byDay = byDay.join("//");
        byHour = byHour.join("//");
        byMonth = byMonth.join("//");
        byWeekDay = byWeekDay.join("//")
    }

    await models.DiscountTime.update({
        discountId: discountId,
        dateFrom, dateTo, byDay, byMonth,
        byHour, byWeekDay, isWarning, isBirthday
    }, {
        where: {
            discountId: discountId
        }
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
            }
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
            }
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
                });
            }
        }
    }

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
    //Kiểm tra mã đã được áp chưa

    //Xoá discountTime
    await models.DiscountTime.destroy({
        where: {
            discountId: discountId
        }
    });

    //Xóa discountBranch
    await models.DiscountBranch.destroy({
        where: {
            discountId: discountId
        }
    });

    //Xóa discountCustomer
    await models.DiscountCustomer.destroy({
        where: {
            discountId: discountId
        }
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
        }
    });

    //Xóa discountItem
    await models.DiscountItem.destroy({
        where: {
            discountId: discountId
        }
    });

    //Xóa discount
    await models.Discount.destroy({
        where: {
            id: discountId,
        },
    });

    return {
        success: true,
        data: null
    }
}