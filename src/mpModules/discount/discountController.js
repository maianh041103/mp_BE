const discountContaint = require('./discountContant');
const discountService = require('./discountService');
const {
    respondWithError,
    respondItemSuccess,
} = require("../../helpers/response");
const { HttpStatusCode } = require('../../helpers/errorCodes');
//[POST] /mp/api/discount
module.exports.create = async (req, res) => {
    try {
        const { loginUser = {} } = req;
        const body = req.body;
        const discount = {
            code: body.code || "",
            name: body.name || "",
            status: body.status || discountContaint.discountStatus.ACTIVE,
            note: body.note || null,
            target: body.target || discountContaint.discountTarget.ORDER,
            type: body.type || discountContaint.discountType.ORDER_PRICE,
            createdAt: new Date(),
            isMultiple: body.isMultiple,
            items: body.items || [],
            time: body.time || {},
            scope: body.scope || {},
        }

        const result = await discountService.create(discount, loginUser);
        if (result.success) {
            res.json(respondItemSuccess(result));
        }
        else
            res.json(respondWithError(result.code, result.message, {}));
    } catch (error) {
        console.log(error);
        res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
    }
}

//[GET] /mp/api/discount
module.exports.getAll = async (req, res) => {
    try {
        const { loginUser = {} } = req;

        const condition = req.query;
        const filter = {
            page: condition.page || 1,
            limit: condition.limit || 20,
            keyword: condition.keyword || "",
            effective: condition.effective,
            target: condition.target,
            type: condition.method,
            status: condition.status
        }

        const result = await discountService.getAll(filter, loginUser);
        if (result.success) {
            res.json(respondItemSuccess(result));
        }
        else
            res.json(respondWithError(result.code, result.message, {}));
    } catch (error) {
        console.log(error);
        res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
    }
}