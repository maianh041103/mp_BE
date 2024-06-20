const Sequelize = require("sequelize");
const { Op } = Sequelize;
const models = require("../../../database/models");
const { HttpStatusCode } = require("../../helpers/errorCodes");
const { warehouseStatus } = require("../warehouse/constant");

const inventoryCheckingAttributes = [
    "code",
    "userCreateId",
    "note",
    "branchId",
    "createdAt"
]

const inventoryCheckingIncludes = [
    {
        model: models.InventoryCheckingProduct,
        as: "inventoryCheckingProduct",
        attributes: ["realQuantity", "difference"],
        include: [
            {
                model: models.InventoryCheckingBatch,
                as: "inventoryCheckingBatch",
                attributes: ["batchId", "realQuantity", "difference"],
                include: [
                    {
                        model: models.Batch,
                        as: "batch",
                    }
                ],
                paranoid: false,
            },
            {
                model: models.ProductUnit,
                as: "productUnit",
                attributes: ["unitName", "exchangeValue", "price", "isBaseUnit"],
                include: [
                    {
                        model: models.Product,
                        as: "product",
                        paranoid: false,
                        include: {
                            model: models.Inventory,
                            as: "inventories",
                        }
                    }
                ],
                paranoid: false,
            }
        ],
        paranoid: false,
    },
    {
        model: models.User,
        as: "userCreate",
        attributes: ["id", "fullName"],
    }
]

const generateCode = (id) => {
    // Chuyển id thành chuỗi
    const idString = id.toString();
    // Điền đầy bằng số 0 để đạt tổng cộng 9 chữ số
    const paddedId = idString.padStart(9, '0');
    // Thêm tiền tố "KM"
    const result = `KK${paddedId}`;
    return result;
}

module.exports.create = async (params) => {
    const { branchId, products, userCreateId, note } = params;
    let newInventoryChecking;
    const t = await models.sequelize.transaction(async (t) => {
        newInventoryChecking = await models.InventoryChecking.create({
            userCreateId, note, branchId, code: " "
        }, {
            transaction: t
        });

        const code = generateCode(newInventoryChecking.id);
        await models.InventoryChecking.update({
            code: code
        }, {
            where: {
                id: newInventoryChecking.id
            },
            transaction: t
        })

        for (const item of products) {
            const { productUnitId, inventoryCheckingBatch, realQuantity } = item;
            const productUnitExists = await models.ProductUnit.findOne({
                where: {
                    id: productUnitId
                }
            });
            if (!productUnitExists) {
                return {
                    error: true,
                    code: HttpStatusCode.BAD_REQUEST,
                    message: `Mã đơn vị hàng hóa không tồn tại`
                }
            }
            const userExists = await models.User.findOne({
                where: {
                    id: userCreateId,
                    branchId: branchId
                }
            });
            if (!userExists) {
                return {
                    error: true,
                    code: HttpStatusCode.BAD_REQUEST,
                    message: `Mã người kiểm hàng không tồn tại`
                }
            }
            const product = await models.Product.findOne({
                where: {
                    id: productUnitExists.productId
                }
            });
            if (!product) {
                return {
                    error: true,
                    code: HttpStatusCode.BAD_REQUEST,
                    message: `Mã hàng hóa không tồn tại`
                }
            }
            const newInventoryCheckingProduct = await models.InventoryCheckingProduct.create({
                inventoryCheckingId: newInventoryChecking.id,
                productUnitId,
                realQuantity
            }, {
                transaction: t
            });

            //Tính quantity base unit
            if (inventoryCheckingBatch && inventoryCheckingBatch.length > 0) {
                for (const row of inventoryCheckingBatch) {
                    let oldQuantity = 0;
                    const realQuantityBaseUnit = row.realQuantity * (productUnitExists.exchangeValue || 1);
                    const batch = await models.Batch.findOne({
                        where: {
                            id: row.batchId,
                            productId: product.id
                        }
                    })
                    if (!batch) {
                        return {
                            error: true,
                            code: HttpStatusCode.BAD_REQUEST,
                            message: `Mã lô không hợp lệ`
                        }
                    }
                    oldQuantity = batch.quantity;
                    if (realQuantityBaseUnit != batch.quantity) {
                        await models.Inventory.increment({
                            quantity: (realQuantityBaseUnit - batch.quantity)
                        }, {
                            where: {
                                productId: product.id,
                                branchId
                            },
                            transaction: t
                        })

                        await models.Batch.update({
                            quantity: realQuantityBaseUnit
                        }, {
                            where: {
                                id: batch.id
                            },
                            transaction: t
                        });

                        await models.WarehouseCard.create({
                            code: code,
                            type: warehouseStatus.ADJUSTMENT,
                            partner: "",
                            productId: product.id,
                            branchId: branchId,
                            changeQty: realQuantityBaseUnit - oldQuantity,
                            remainQty: realQuantityBaseUnit,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }, {
                            transaction: t
                        });
                    }
                    await models.InventoryCheckingBatch.create({
                        inventoryCheckingProductId: newInventoryCheckingProduct.id,
                        realQuantity: row.realQuantity,
                        batchId: row.batchId,
                        difference: (realQuantityBaseUnit - oldQuantity) / (productUnitExists.exchangeValue || 1)
                    }, {
                        transaction: t
                    });
                }
            }
            else {
                const realQuantityBaseUnit = realQuantity * (productUnitExists.exchangeValue || 1);
                const inventory = await models.Inventory.findOne({
                    where: {
                        productId: product.id,
                        branchId
                    }
                })

                let oldQuantity = inventory.quantity;
                await models.InventoryCheckingProduct.update({
                    realQuantity: realQuantity,
                    difference: realQuantity - oldQuantity / (productUnitExists.exchangeValue || 1)
                }, {
                    where: {
                        id: newInventoryCheckingProduct.id
                    },
                    transaction: t
                })
                if (realQuantityBaseUnit != inventory.quantity) {
                    await models.Inventory.update({
                        quantity: realQuantityBaseUnit,
                    }, {
                        where: {
                            productId: product.id,
                            branchId
                        },
                        transaction: t
                    })

                    await models.WarehouseCard.create({
                        code: code,
                        type: warehouseStatus.ADJUSTMENT,
                        partner: "",
                        productId: product.id,
                        branchId: branchId,
                        changeQty: realQuantityBaseUnit - oldQuantity,
                        remainQty: realQuantityBaseUnit,
                        createdAt: new Date(),
                        updatedAt: new Date()
                    }, {
                        transaction: t
                    })
                }
            }
        }
    });


    return {
        success: true,
        data: {
            "id": newInventoryChecking.id
        },
    }
}

module.exports.getAll = async (params) => {
    const { branchId, limit = 20, page = 1 } = params;

    const { rows, count } = await models.InventoryChecking.findAndCountAll({
        attributes: inventoryCheckingAttributes,
        include: inventoryCheckingIncludes,
        where: {
            branchId: branchId
        },
        limit: parseInt(limit),
        offset: parseInt((page - 1) * limit),
        order: [["id", "DESC"]],
    });

    for (const row of rows) {
        if (row.dataValues.productUnit && row.dataValues.productUnit.dataValues.product) {
            row.dataValues.productUnit.dataValues.product.dataValues.inventoryQuantity = ((await models.Inventory.findOne({
                where: {
                    productId: row.dataValues.productUnit.dataValues.product.id,
                    branchId
                }
            })) || {}).id
        }
    }
    return {
        success: true,
        data: {
            items: rows,
            totalItem: count
        }
    }
}

module.exports.detail = async (params) => {
    const { branchId, id } = params;
    const inventoryChecking = await models.InventoryChecking.findOne({
        attributes: inventoryCheckingAttributes,
        include: inventoryCheckingIncludes,
        where: {
            id: id,
            branchId: branchId
        }
    });

    if (!inventoryChecking || !inventoryChecking.code) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Mã kiểm kho không tồn tại`
        }
    }

    if (inventoryChecking.dataValues.productUnit && inventoryChecking.dataValues.productUnit.dataValues.product) {
        inventoryChecking.dataValues.productUnit.dataValues.product.dataValues.inventoryQuantity = ((await models.Inventory.findOne({
            where: {
                productId: inventoryChecking.dataValues.productUnit.dataValues.product.id,
                branchId
            }
        })) || {}).quantity;
    }
    return {
        success: true,
        data: inventoryChecking
    }
}

module.exports.delete = async (params) => {
    const { id, branchId } = params;
    const inventoryChecking = await models.InventoryChecking.findOne({
        where: {
            id: id,
            branchId: branchId
        }
    });
    if (!inventoryChecking) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Mã kiểm kho không tồn tại`
        }
    }
    const listProduct = await models.InventoryCheckingProduct.findAll({
        where: {
            inventoryCheckingId: id
        }
    });
    for (const product of listProduct) {
        await models.InventoryCheckingBatch.destroy({
            where: {
                inventoryCheckingProductId: product.id
            }
        });
    }
    await models.InventoryCheckingProduct.destroy({
        where: {
            inventoryCheckingId: id
        }
    });
    await models.InventoryChecking.destroy({
        where: {
            id: id,
            branchId: branchId
        }
    })

    return {
        success: true,
        data: null
    }
}