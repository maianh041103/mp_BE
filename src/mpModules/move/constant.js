import {productAttributes, productIncludes} from "../product/constant";
const models = require("../../../database/models");

export const moveStatus = {
    MOVING: "MOVING",
    RECEIVED: "RECEIVED",
    TRASH: "TRASH",
};

export const moveAttributes = ["id", "code", "fromBranchId", "toBranchId", "movedAt", "movedBy", "receivedAt", "receivedBy", "status", "note", "totalItem"]
export const moveInclude = [
    {
        model: models.Branch,
        as: 'fromBranch',
        attributes: ['id', 'name'],
    },
    {
        model: models.Branch,
        as: 'toBranch',
        attributes: ['id', 'name'],
    },
    {
        model: models.MoveItem,
        as: 'items',
        attributes: ['id', 'quantity'],
        include: [
            {
                model: models.ProductUnit,
                as: 'productUnit',
                attributes: ['id', 'unitName', 'exchangeValue', 'isBaseUnit'],
            },
            {
                model: models.Product,
                as: 'product',
                attributes: productAttributes,
                include: productIncludes
            },
            {
                model: models.MoveItemBatch,
                as: 'fromBatches',
                attributes: ['id', 'quantity'],
                include: [
                    {
                        model: models.Batch,
                        as: 'batch',
                        attributes: ['id', 'name', 'quantity', 'expiryDate']
                    },
                ]
            },
            {
                model: models.MoveItemToBatch,
                as: 'toBatches',
                attributes: ['id', 'quantity'],
                include: [
                    {
                        model: models.Batch,
                        as: 'batch',
                        attributes: ['id', 'name', 'quantity', 'expiryDate']
                    },
                ]
            },
        ]
    },
]
