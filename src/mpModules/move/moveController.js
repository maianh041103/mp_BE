import {indexCreate, readMove, indexList, receiveMove} from "./moveService";
import {respondWithClientError} from "../../helpers/response";

const _ = require("lodash");
const {
    respondItemSuccess,
    respondWithError,
} = require("../../helpers/response");
const { HttpStatusCode } = require("../../helpers/errorCodes");

export async function indexController(req, res) {
    try {
        const { loginUser = {} } = req;
        const result = await indexList(
            {
                ...req.query,
                storeId: loginUser.storeId,
            },
            loginUser
        );
        if (result.success) res.json(respondItemSuccess(_.get(result, "data", {})));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

export async function createController(req, res) {
    try {
        const { loginUser = {} } = req;
        const result = await indexCreate(
            {
                ...req.body,
                storeId: loginUser.storeId,
            },
            loginUser
        );
        console.log(result)
        if (result.success) res.json(respondItemSuccess(_.get(result, "data", {})));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

export async function readController(req, res) {
    try {
        const { id } = req.params;
        const { loginUser = {} } = req;
        const result = await readMove(id, loginUser);
        if (result.success) res.json(respondItemSuccess(_.get(result, "data", {})));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

export async function receiveController(req, res) {
    try {
        const { id } = req.params;
        const { loginUser = {} } = req;
        const result = await receiveMove(id, req.body, loginUser);
        if (result.success) res.json(respondItemSuccess(result));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (error) {
        res.json(
            respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
        );
    }
}
