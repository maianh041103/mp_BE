import {customerAttributes} from "../customer/attributes";

const models = require("../../../database/models");
const {userAttributes} = require("../user/attributes");

const productAttributes = [
    "name",
    "shortName",
    "code",
    "barCode",
    "imageId",
    "isBatchExpireControl",
];


const saleReturnItemAttributes = [
    "id", "quantity", "price", "discount", "totalPrice"
]

const saleReturnItemBatchAttributes = ["id", "quantity"]

const batchAttributes = ["id", "quantity", "name", "expiryDate"]

const productUnitAttributes = [
    "id",
    "unitName",
    "exchangeValue",
    "code",
    "barCode",
    "isBaseUnit",
]

export const saleReturnIncludes = [
    {
        model: models.Store,
        as: "store",
        attributes: ["id", "name", "phone"],
    },
    {
        model: models.Branch,
        as: "branch",
        attributes: ["id", "name", "code"],
    },
    {
        model: models.User,
        as: "user",
        attributes: userAttributes,
    },
    {
        model: models.User,
        as: "creator",
        attributes: userAttributes,
    },
    {
        model: models.Customer,
        as: "customer",
        attributes: customerAttributes,
    },
    {
        model: models.SaleReturnItem,
        as: "items",
        attributes: saleReturnItemAttributes,
        include: [
            {
                model: models.SaleReturnBatch,
                as: "batches",
                attributes: saleReturnItemBatchAttributes,
                include: [{
                    model: models.Batch,
                    attributes: batchAttributes,
                    as: "batch"
                }]
            },
            {
                model: models.ProductUnit,
                as: "productUnit",
                attributes: productUnitAttributes,
                include: [
                    {
                        model: models.Product,
                        attributes: productAttributes,
                        as: "product",
                    },
                ],
            }
        ],
    },
];

export const saleReturnAttributes = [
    "id",
    "code",
    "userId",
    "storeId",
    "branchId",
    "customerId",
    "totalPrice",
    "paid",
    "debt",
    "discount",
    "returnFee",
    "paymentType",
    "status",
    "createdAt",
];

