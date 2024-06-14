const Sequelize = require("sequelize");
const { Op } = Sequelize;
const models = require("../../../database/models");
const { HttpStatusCode } = require("../../helpers/errorCodes");

const inventoryCheckingAttributes = [
    "code",
    "productUnitId",
    "realQuantity",
    "userCreateId",
    "note",
    "branchId"
]

const inventoryCheckingIncludes = [
    {
        model: models.ProductUnit,
        as: "productUnit",
        attributes: ["unitName", "exchangeValue", "price", "isBaseUnit"],
        include: [
            {
                model: models.Product,
                as: "product",
                attributes: ["name", "price"],
                include: [
                    {
                        model: models.Inventory,
                        as: "inventories",
                        attributes: [[Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity']],
                    }
                ],
                paranoid: false
            }
        ],
        paranoid: false
    },
    {
        model: models.User,
        as: "userCreate",
        attributes: ["id", "fullName"]
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
    const { branchId, productUnitId, realQuantity, userCreateId, note } = params;
    const productUnitExists = await models.ProductUnit.findOne({
        id: productUnitId,
        branchId: branchId
    });
    if (!productUnitExists) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Mã hàng hóa không tồn tại`
        }
    }

    const userExists = await models.User.findOne({
        id: userCreateId,
        branchId: branchId
    });
    if (!userExists) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Mã khách hàng không tồn tại`
        }
    }

    const newInventoryChecking = await models.InventoryChecking.create({
        productUnitId, realQuantity, userCreateId, note, branchId,
        code: " "
    });

    const code = generateCode(newInventoryChecking.id);
    await models.InventoryChecking.update({
        code: generateCode(newInventoryChecking.id)
    }, {
        where: {
            id: newInventoryChecking.id
        }
    })

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
        limit: limit,
        offset: (page - 1) * limit
    });

    for (const row of rows) {
        if (row.dataValues.productUnit && row.dataValues.productUnit.dataValues.product && row.dataValues.productUnit.dataValues.product.dataValues.inventories) {
            row.dataValues.productUnit.dataValues.product.dataValues.inventories = parseInt(row.dataValues.productUnit.dataValues.product.dataValues.inventories[0].dataValues.totalQuantity)
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
    return {
        success: true,
        data: inventoryChecking
    }
}

module.exports.edit = async (params) => {
    const { branchId, id, productUnitId, realQuantity, userCreateId, note } = params;
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

    await models.InventoryChecking.update({
        productUnitId, realQuantity, userCreateId, note
    }, {
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