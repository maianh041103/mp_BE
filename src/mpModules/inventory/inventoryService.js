import {getAllBranchFromStore} from "../branch/branchService";
import {Op} from "sequelize";

const models = require("../../../database/models");
export async function createNewInventory(storeId, productId, transaction) {
    const branches = await getAllBranchFromStore(storeId)
    const inventories = branches.map( x => ({
        productId: productId,
        branchId: x.id,
        quantity: 0
    }))
    await models.Inventory.bulkCreate(inventories, {transaction: transaction})
}

export async function newInventory(branchId, productId, quantity, transaction) {
    if (!quantity) quantity = 0
    await models.Inventory.create({
        branchId, productId, quantity
    }, {transaction: transaction})
}

export async function addInventory(branchId, productId, quantity, transaction) {
    const inventory = await models.Inventory.findOne({
        where: {
            productId: productId,
            branchId: branchId
        }
    })
    if (!inventory) {
        return await models.Inventory.create({productId, branchId, quantity}, {transaction: transaction})
    } else {
        return await models.Inventory.increment({quantity: quantity},
            {
            where: {
                productId: productId,
                branchId: branchId
            }, transaction:  transaction
        })
    }
}

export async function getInventory(branchId, productId) {
    const inv = await models.Inventory.findOne({
        attributes: ['quantity'],
        where: {
            branchId: branchId,
            productId: productId
        }
    })
    if (!inv) {
        return 0
    }
    console.log(inv.quantity)
    return inv.quantity
}

