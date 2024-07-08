const {
    respondWithError,
    respondItemSuccess,
} = require("../../helpers/response");
const { HttpStatusCode } = require('../../helpers/errorCodes');
const tripService = require("./tripService");

module.exports.createTrip = async (req, res) => {
    try {
        const { loginUser = {} } = req;
        const body = req.body;
        const result = await tripService.createTrip({ createdBy: loginUser.id, storeId: loginUser.storeId, ...body });
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (error) {
        res.json(
            respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
        );
    }
}

module.exports.getTrips = async (req, res) => {
    try {
        const { loginUser = {} } = req;
        const { limit, page, keyword } = req.query;
        const result = await tripService.getListTrip({ storeId: loginUser.storeId, limit, page, keyword });
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (error) {
        res.json(
            respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
        );
    }
}

module.exports.getDetailTrip = async (req, res) => {
    try {
        const { loginUser = {} } = req;
        const { id } = req.params;
        const result = await tripService.getDetailTrip({ storeId: loginUser.storeId, id });
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (error) {
        res.json(
            respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
        );
    }
}

module.exports.updateTrip = async (req, res) => {
    try {
        const body = req.body;
        const id = req.params.id;
        const { loginUser } = req;
        const result = await tripService.updateTrip({ ...body, id, storeId: loginUser.storeId });
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (error) {
        res.json(
            respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
        );
    }
}

module.exports.changeStatusTrip = async (req, res) => {
    try {
        const { tripCustomerId, status } = req.params;
        const { loginUser } = req;
        const result = await tripService.changeStatusTrip({ storeId: loginUser.storeId, tripCustomerId, status });
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (error) {
        res.json(
            respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
        );
    }
}