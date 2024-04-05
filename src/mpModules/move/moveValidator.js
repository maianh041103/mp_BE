const { respondWithError } = require("../../helpers/response");
const BaseJoi = require("@hapi/joi");
const Extension = require("@hapi/joi-date");
const Joi = BaseJoi.extend(Extension);
const { HttpStatusCode } = require("../../helpers/errorCodes");
const { moveStatus } = require("./constant");
const _ = require("lodash");

const createSchema = Joi.object().keys({
    code: Joi.string().max(255).allow(null).allow(""),
    fromBranchId: Joi.number().integer().required(),
    toBranchId: Joi.number().integer().required(),
    movedBy: Joi.number().integer().required(),
    totalItem: Joi.number().integer().min(0).required(),
    note: Joi.string().allow(null).allow(""),
    products: Joi.array()
        .items(
            Joi.object()
                .keys({
                    productId: Joi.number().integer().required(),
                    quantity: Joi.number().integer().required(),
                    productUnitId: Joi.number().integer().required(),
                    batches: Joi.array()
                        .items(
                            Joi.object()
                                .keys({
                                    id: Joi.number().integer().required(),
                                    quantity: Joi.number().integer().required(),
                                    expiryDate: Joi.string().allow(null).allow(""),
                                })
                                .allow(null).allow("")
                        )
                        .allow([]),
                })
                .unknown(true)
        )
        .required([]),
});

export function createValidator(req, res, next) {
    const { body } = req;
    const result = Joi.validate(body, createSchema);
    if (result.error) {
        res.json(
            respondWithError(
                HttpStatusCode.BAD_REQUEST,
                result.error.message,
                result.error.details
            )
        );
        return;
    }
    next();
}

// const updateStatusSchema = Joi.object().keys({
//     status: Joi.string().valid([purchaseReturnStatus.DRAFT, purchaseReturnStatus.SUCCEED, purchaseReturnStatus.CANCELLED]).required(),
// });
//
// export function updateStatusValidator(req, res, next) {
//     const { body } = req;
//     const result = Joi.validate(body, updateStatusSchema);
//     if (result.error) {
//         res.json(
//             respondWithError(
//                 HttpStatusCode.BAD_REQUEST,
//                 result.error.message,
//                 result.error.details
//             )
//         );
//         return;
//     }
//     next();
// }
