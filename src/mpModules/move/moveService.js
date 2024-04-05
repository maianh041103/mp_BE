import {moveAttributes, moveInclude, moveStatus} from "./constant";
import {generateCode} from "../../helpers/codeGenerator";
import {getProductUnit} from "../product/productUnitService";
import {addInventory, getInventory} from "../inventory/inventoryService";
import {raiseBadRequestError} from "../../helpers/exception";
import {getProduct} from "../product/productService";
import {createWarehouseCard} from "../warehouse/warehouseService";
import {warehouseStatus} from "../warehouse/constant";
import {addBatchQty, getBatch} from "../batch/batchService";
import {getFilter} from "./filter";
const _ = require("lodash");

const models = require("../../../database/models");
export async function indexList(params, loginUser) {
    const filter = getFilter(params, loginUser)
    const {limit, page} = params;
    const [moves, count] = await Promise.all([
        models.Move.findAll({
            attributes: moveAttributes,
            include: moveInclude,
            ...filter,
            offset: +limit * (+page - 1),
            limit: +limit,
            order: [["id", "desc"]]
        }),
        models.Move.count(filter)
    ])
    return {
        success: true,
        data: {
            items: moves,
            totalItem: count,
        },
    };
}


export async function indexCreate(moveReq, loginUser) {
    let move;
    await models.sequelize.transaction(async (t) => {
        move = await createMove(moveReq, t)
        const moveItems = await createMoveItem(move, moveReq.products, t)
    })
    return {
        success: true,
        data: move
    }
}

async function createMove(moveReq, transaction) {
    const move = await models.Move.create({
        storeId: moveReq.storeId,
        fromBranchId: moveReq.fromBranchId,
        toBranchId: moveReq.toBranchId,
        movedAt: new Date(),
        movedBy: moveReq.movedBy,
        status: moveStatus.MOVING,
        note: moveReq.note,
        totalItem: moveReq.totalItem
    },
        {transaction: transaction}
    )
    move.code = moveReq.code || generateCode("MV", move.id)
    await models.Move.update({code: move.code},
        {where: {id: move.id}, transaction: transaction})
    return move
}

async function createMoveItem(move, productsReq, t) {
    for (const item of productsReq) {
        const productUnit = await getProductUnit(item.productUnitId)
        const product = await getProduct(item.productId)
        const inventory = await getInventory(move.fromBranchId, item.productId)
        const totalQuantity = item.quantity * productUnit.exchangeValue
        if (inventory < totalQuantity) {
            raiseBadRequestError(`Sản phẩm ${product.name} không đủ số lượng để chuyển`)
        }
        const moveItem = await models.MoveItem.create({
            moveId: move.id,
            productUnitId: item.productUnitId,
            productId: item.productId,
            quantity: item.quantity
        }, {transaction: t})

        await createWarehouseCard({
            code: move.code,
            type: warehouseStatus.MOVE,
            partner: "",
            productId: item.productId,
            branchId: move.fromBranchId,
            changeQty: -totalQuantity,
            remainQty: inventory - totalQuantity,
            createdAt: new Date(),
            updatedAt: new Date()
        }, t)
        await addInventory(move.fromBranchId, item.productId, -totalQuantity, t)
        if (product.isBatchExpireControl) {
            if (!item.batches) {
                raiseBadRequestError("Lô hàng không được để trống")
            }
            for (const batchReq of item.batches) {
                const batch = await getBatch(batchReq.id)
                if (batch.quantity < batchReq.quantity * productUnit.exchangeValue) {
                    raiseBadRequestError(`Lô sản phẩm ${batch.name} không đủ số lượng`)
                }
                await models.MoveItemBatch.create({
                    moveItemId: moveItem.id,
                    fromBatchId: batchReq.id,
                    quantity: batchReq.quantity
                }, {transaction: t})
                await addBatchQty(batchReq.id, -batchReq.quantity*productUnit.exchangeValue, t)
            }
        }

    }
}

export async function readMove(id, loginUser) {

}

export async function getDetail(id) {
    const move = await models.Move.findByPk(id, {
        attributes: ['id', 'fromBranchId', 'toBranchId', 'code', 'status'],
        include: [{
            model: models.Branch,
            as: 'fromBranch',
            attributes: ['id', 'name'],
        },
            {
                model: models.Branch,
                as: 'toBranch',
                attributes: ['id', 'name'],
            },]
    })
    if (!move) {
        raiseBadRequestError("Không tìm thấy phiếu chuyển haàng")
    }
    return move
}

export async function getMoveItem(id) {
    const moveItem = await models.MoveItem.findByPk(id,
        {
            attributes: ['id', 'quantity', 'productId'],
            include: [
                {
                    model: models.ProductUnit,
                    as: 'productUnit',
                    attributes: ['id', 'unitName', 'exchangeValue'],
                },
            ]})
    if (!moveItem) {
        raiseBadRequestError("Đơn vị sản phẩm không tồn tại")
    }
    return moveItem
}
export async function receiveMove(id, payload, loginUser) {
    const {branchId, receivedBy, items} = payload
    const move = await getDetail(id)
    if (branchId !== move.toBranchId) {
        raiseBadRequestError("Chi nhánh không phù hợp để nhận hàng")
    }
    if (move.status === 'RECEIVED') {
        raiseBadRequestError("Đã nhận được hàng")
    }
    await models.sequelize.transaction(async (t) => {
        await models.Move.update({
            receivedBy: receivedBy,
            receivedAt: new Date(),
            status: moveStatus.RECEIVED
        }, {
            where: {id: id}, transaction: t
        })
        for (const item of items) {
            const moveItem = await getMoveItem(item.id)
            const exchangeValue = moveItem.productUnit.exchangeValue
            const totalQuantity = moveItem.quantity * exchangeValue
            await createWarehouseCard({
                code: move.code,
                type: warehouseStatus.MOVE_RECEIVE,
                partner: move.fromBranch.name,
                productId: moveItem.productId,
                branchId: move.toBranchId,
                changeQty: totalQuantity,
                remainQty: await getInventory(move.toBranchId, moveItem.productId) + totalQuantity,
                createdAt: new Date(),
                updatedAt: new Date()
            }, t)
            await addInventory(move.toBranchId, moveItem.productId, totalQuantity, t)
            if (item.batches) {
                for (const batchReq of item.batches) {
                    await models.MoveItemToBatch.create({
                        moveItemId: moveItem.id,
                        fromBatchId: batchReq.id,
                        quantity: batchReq.quantity
                    }, {transaction: t})
                    await addBatchQty(batchReq.id, batchReq.quantity * exchangeValue, t)
                }
            }
        }
    })
    return {
        success: true,
        data: null
    }
}