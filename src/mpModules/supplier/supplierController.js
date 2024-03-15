const _ = require("lodash");
const {
  respondItemSuccess,
  respondWithError,
} = require("../../helpers/response");
const {
  readSupplier,
  indexSuppliers,
  updateSupplier,
  createSupplier,
  deleteSupplier,
} = require("./supplierService");
const { HttpStatusCode } = require("../../helpers/errorCodes");

export async function indexSuppliersController(req, res) {
  try {
    const { loginUser = {} } = req;
    const result = await indexSuppliers({...req.query, storeId: loginUser.storeId});
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
  }
}

export async function createSupplierController(req, res) {
  try {
    const { loginUser = {} } = req;
    const result = await createSupplier({
      name: _.get(req.body, "name", ""),
      phone: _.get(req.body, "phone", ""),
      email: _.get(req.body, "email", ""),
      code: _.get(req.body, "code", ""),
      taxCode: _.get(req.body, "taxCode", ""),
      wardId: _.get(req.body, "wardId", null),
      districtId: _.get(req.body, "districtId", null),
      provinceId: _.get(req.body, "provinceId", null),
      storeId: loginUser.storeId,
      branchId: _.get(req.body, "branchId", null),
      groupSupplierId: _.get(req.body, "groupSupplierId", null),
      address: _.get(req.body, "address", ""),
      companyName: _.get(req.body, "companyName", ""),
      note: _.get(req.body, "note", ""),
      createdBy: loginUser.id,
      createdAt: new Date(),
    });
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
  }
}

export async function readSupplierController(req, res) {
  try {
    const { id } = req.params;
    const { loginUser = {} } = req;
    const result = await readSupplier(id, loginUser);
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
  }
}

export async function updateSupplierController(req, res) {
  try {
    const { id } = req.params;
    const { loginUser = {} } = req;
    const status = _.get(req.body, "status", null);
    const supplier = {
      name: _.get(req.body, "name", ""),
      phone: _.get(req.body, "phone", ""),
      email: _.get(req.body, "email", ""),
      code: _.get(req.body, "code", ""),
      taxCode: _.get(req.body, "taxCode", ""),
      wardId: _.get(req.body, "wardId", null),
      districtId: _.get(req.body, "districtId", null),
      provinceId: _.get(req.body, "provinceId", null),
      branchId: _.get(req.body, "branchId", null),
      storeId: loginUser.storeId,
      groupSupplierId: _.get(req.body, "groupSupplierId", null),
      address: _.get(req.body, "address", ""),
      companyName: _.get(req.body, "companyName", ""),
      note: _.get(req.body, "note", ""),
      ...(status !== null && { status }),
      updatedBy: loginUser.id,
      updatedAt: new Date(),
    };
    const result = await updateSupplier(id, supplier);
    if (result.success) res.json(respondItemSuccess());
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
  }
}

export async function deleteSupplierController(req, res) {
  try {
    const { id } = req.params;
    const { loginUser = {} } = req;
    const result = await deleteSupplier(id, loginUser);
    if (result.success) res.json(respondItemSuccess());
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
  }
}
