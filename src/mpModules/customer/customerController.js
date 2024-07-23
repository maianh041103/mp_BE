import { readDefaultCustomer } from "./customerService";
import { indexOrderDebt } from "./CustomerDebtService";

const uploadFile = require('../../helpers/upload')
const _ = require("lodash");
const xlsx = require('xlsx');
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
  indexPaymentCustomer,
  historyPointService,
  historyVisitedService
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
      note: _.get(req.body, "note", ""),
      lat: _.get(req.body, "lat", "").trim(),
      lng: _.get(req.body, "lng", "").trim()
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
      lat: _.get(req.body, "lat", ""),
      lng: _.get(req.body, "lng", ""),
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

export async function readPaymentCustomerController(req, res) {
  try {
    const { id: customerId } = req.params;
    const result = await indexPaymentCustomer({ ...req.query, customerId });
    if (result.success) res.json(respondItemSuccess(_.get(result, "data", {})));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function historyPoint(req, res) {
  try {
    const customerId = req.params.customerId;
    const query = req.query;
    const result = await historyPointService(customerId, query);
    if (result.success) res.json(respondItemSuccess(_.get(result, "data", {})));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function historyVisited(req, res) {
  try {
    const customerId = req.params.id;
    const query = req.query;
    const result = await historyVisitedService(customerId, query);
    if (result.success) res.json(respondItemSuccess(_.get(result, "data", {})));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function createCustomerByUploadController(req, res) {
  try {
    const { loginUser = {} } = req;

    await uploadFile(req, res);

    if (req.file === undefined) {
      return res.status(400).send({ message: 'Please upload a file!' });
    }
    // Đường dẫn tạm thời của tệp Excel đã tải lên
    const excelFilePath = req.file.path;

    // Đọc dữ liệu từ tệp Excel
    const workbook = xlsx.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    const results = await Promise.all(
      data.map(async item => {
        const customer = {
          fullName: _.get(item, 'fullName', ''),
          birthday: _.get(item, 'birthday', moment().format('YYYY-MM-DD')),
          gender: _.get(item, 'gender', ''),
          phone: formatMobileToSave(_.get(item, 'phone', '')),
          email: _.get(item, 'email', ''),
          taxCode: _.get(item, 'taxCode', null),
          address: _.get(item, 'address', ''),
          position: _.get(item, 'position', null),
          avatarId: _.get(item, 'avatarId', null),
          groupCustomerId: _.get(item, 'groupCustomerId', null),
          status: _.get(item, 'status', customerStatus.ACTIVE),
          wardId: _.get(item, 'wardId', null),
          districtId: _.get(item, 'districtId', null),
          provinceId: _.get(item, 'provinceId', null),
          password: hashPassword(_.get(item, 'password', '')),
          storeId: loginUser.storeId,
          createdBy: loginUser.id,
          createdAt: new Date(),
          note: _.get(item, 'note', '')
        };
        return await createCustomer(customer, loginUser);
      })
    );
    const successResults = results.filter(result => result.success);
    const errorResults = results.filter(result => !result.success);

    if (successResults.length > 0) {
      res.json(respondItemSuccess(successResults.map(result => result.data)));
    } else {
      res.json(
        respondWithError(
          HttpStatusCode.BAD_REQUEST,
          'Failed to create customers',
          errorResults
        )
      );
    }
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}


