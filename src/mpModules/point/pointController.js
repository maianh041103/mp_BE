const {
    respondWithError,
    respondItemSuccess,
} = require("../../helpers/response");
const { HttpStatusCode } = require('../../helpers/errorCodes');
const pointService = require("./pointService");

//[POST] /mp/api/point
module.exports.create = async (req, res) => {
    try {
        const { loginUser = {} } = req;
        const result = await pointService.createPoint({
            ...req.body,
            storeId: loginUser.storeId,
        });
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (error) {
        res.json(
            respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
        );
    }
}

//[GET] /mp/api/point
module.exports.detail = async (req, res) => {
    try {
        const { loginUser = {} } = req;
        const result = await pointService.detailPoint({ storeId: loginUser.storeId });
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (error) {
        res.json(
            respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
        );
    }
}

//[PATCH] /mp/api/point
module.exports.changeStatus = async (req, res) => {
    try {
        const { loginUser = {} } = req;
        const result = await pointService.changeStatus({ storeId: loginUser.storeId });
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (error) {
        res.json(
            respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
        );
    }
}

//[DELETE] /mp/api/point
module.exports.delete = async (req, res) => {
    try {
        const { loginUser = {} } = req;
        const result = await pointService.deletePoint({ storeId: loginUser.storeId });
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (error) {
        res.json(
            respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
        );
    }
}

