import {readDefaultCustomer} from "./customerService";
import {indexOrderDebt} from "./CustomerDebtService";

const _ = require("lodash");
const moment = require("moment");
const {
  respondWithError,
  respondItemSuccess,
} = require("../../helpers/response");
const {
  updateCustomer,
  createCustomer,
  indexCustomers,
  deleteCustomerById,
  updatePassword,
  indexCustomersByGroup,
  readCustomer,
  updateCustomerStatus,
} = require("./customerService");
const { hashPassword } = require("../auth/authService");
const { formatMobileToSave } = require("../../helpers/utils");
const { HttpStatusCode } = require("../../helpers/errorCodes");
const { customerStatus } = require("./customerConstant");

export async function indexCustomersController(req, res) {
  try {
    const { loginUser = {} } = req;
    const result = await indexCustomers({
      ...req.query,
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

export async function getTotalDebtController(req, res) {
  try {
    const { loginUser = {} } = req;
    const { id } = req.params;
    const result = await indexOrderDebt({
      ...req.query,
      storeId: loginUser.storeId,
      customerId: id
    });
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
        respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function getDefaultCustomer(req, res) {
  try {
    const { loginUser = {} } = req;
    const result = await readDefaultCustomer(loginUser.storeId);
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
        respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}



export async function readController(req, res) {
  try {
    const { id } = req.params;
    const { loginUser = {} } = req;
    const result = await readCustomer(id, loginUser);
    if (result.success)
      res.json(respondItemSuccess(result.data, result.message));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function createController(req, res) {
  try {
    const { loginUser = {} } = req;
    const customer = {
      fullName: _.get(req, "body.fullName", ""),
      birthday: _.get(req, "body.birthday", moment().format("YYYY-MM-DD")),
      gender: _.get(req, "body.gender", ""),
      phone: formatMobileToSave(_.get(req, "body.phone", "")),
      email: _.get(req, "body.email", ""),
      taxCode: _.get(req, "body.taxCode", ""),
      address: _.get(req, "body.address", ""),
      position: _.get(req, "body.position", null),
      avatarId: _.get(req, "body.avatarId", null),
      groupCustomerId: _.get(req, "body.groupCustomerId", null),
      type: _.get(req.body, "type", null),
      status: _.get(req.body, "status", customerStatus.ACTIVE),
      wardId: _.get(req.body, "wardId", null),
      districtId: _.get(req.body, "districtId", null),
      provinceId: _.get(req.body, "provinceId", null),
      password: hashPassword(_.get(req, "body.password", "")),
      storeId: loginUser.storeId,
      createdBy: loginUser.id,
      createdAt: new Date(),
      note: _.get(req.body, "note", "")
    };
    const result = await createCustomer(customer, loginUser);
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function updateController(req, res) {
  try {
    console.log(req)
    const { id } = req.params;
    const { loginUser = {} } = req;
    const status = _.get(req.body, "status", null);
    const customer = {
      fullName: _.get(req, "body.fullName", ""),
      birthday: _.get(req, "body.birthday", moment().format("YYYY-MM-DD")),
      gender: _.get(req, "body.gender", ""),
      email: _.get(req, "body.email", ""),
      taxCode: _.get(req, "body.taxCode", ""),
      type: _.get(req.body, "type", null),
      address: _.get(req, "body.address", ""),
      position: _.get(req, "body.position", null),
      avatarId: _.get(req, "body.avatarId", null),
      groupCustomerId: _.get(req, "body.groupCustomerId", null),
      password: hashPassword(_.get(req, "body.password", "")),
      wardId: _.get(req.body, "wardId", null),
      districtId: _.get(req.body, "districtId", null),
      provinceId: _.get(req.body, "provinceId", null),
      note: _.get(req.body, "note", null),
      ...(status && { status }),
      updatedBy: loginUser.id,
      updatedAt: new Date(),
    };
    const result = await updateCustomer(id, customer, loginUser);
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function deleteController(req, res) {
  try {
    const { id } = req.params;
    const { loginUser = {} } = req;
    const result = await deleteCustomerById(id, loginUser);
    if (result.success) res.json(respondItemSuccess());
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function resetPassword(req, res) {
  try {
    const { loginUser = {} } = req;
    const { customerId, newPassword } = req.body;
    const result = await updatePassword(customerId, newPassword, loginUser);
    if (result.success) res.json(respondItemSuccess());
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { loginUser = {} } = req;
    const user = {
      status: _.get(req, "body.status", ""),
      updatedBy: loginUser.id,
    };
    const result = await updateCustomerStatus(id, user);
    if (result.success) res.json(respondItemSuccess());
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function getCustomerListByGroup(req, res) {
  try {
    const result = await indexCustomersByGroup(req.query);
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}
