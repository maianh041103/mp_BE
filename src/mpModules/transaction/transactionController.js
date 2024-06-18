const transactionService = require("./transactionService");
const {
    respondWithError,
    respondItemSuccess,
} = require("../../helpers/response");
const { HttpStatusCode } = require('../../helpers/errorCodes');

//[POST] /mp/api/cash-book
module.exports.createTransaction = async (req, res) => {
    try {
        const { loginUser = {} } = req;
        const result = await transactionService.createTransaction({
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