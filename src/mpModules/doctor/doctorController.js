const _ = require("lodash");
const {
  respondItemSuccess,
  respondWithError,
} = require("../../helpers/response");
const {
  readDoctor,
  indexDoctors,
  updateDoctor,
  createDoctor,
  deleteDoctor,
} = require("./doctorService");
const { HttpStatusCode } = require("../../helpers/errorCodes");

export async function indexDoctorsController(req, res) {
  try {
    const { loginUser = {} } = req;
    const result = await indexDoctors({...req.query, storeId: loginUser.storeId});
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
  }
}

export async function createDoctorController(req, res) {
  try {
    const { loginUser = {} } = req;
    const result = await createDoctor({
      name: _.get(req.body, "name", ""),
      phone: _.get(req.body, "phone", ""),
      code: _.get(req.body, "code", ""),
      email: _.get(req.body, "email", ""),
      gender: _.get(req.body, "gender", ""),
      specialistId: _.get(req.body, "specialistId", null),
      levelId: _.get(req.body, "levelId", null),
      workPlaceId: _.get(req.body, "workPlaceId", null),
      avatarId: _.get(req.body, "avatarId", null),
      wardId: _.get(req.body, "wardId", null),
      districtId: _.get(req.body, "districtId", null),
      provinceId: _.get(req.body, "provinceId", null),
      storeId: loginUser.storeId,
      address: _.get(req.body, "address", ""),
      status: _.get(req.body, "status", null),
      note: _.get(req.body, "note", ""),
      createdBy: _.get(req, "loginUser.id", null),
      createdAt: new Date(),
    });
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
  }
}

export async function readDoctorController(req, res) {
  try {
    const { id } = req.params;
    const { loginUser = {} } = req;
    const result = await readDoctor(id, loginUser);
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
  }
}

export async function updateDoctorController(req, res) {
  try {
    const { id } = req.params;
    const { loginUser = {} } = req;
    const status = _.get(req.body, "status", null);
    const doctor = {
      name: _.get(req.body, "name", ""),
      phone: _.get(req.body, "phone", ""),
      email: _.get(req.body, "email", ""),
      gender: _.get(req.body, "gender", ""),
      specialistId: _.get(req.body, "specialistId", null),
      levelId: _.get(req.body, "levelId", null),
      workPlaceId: _.get(req.body, "workPlaceId", null),
      avatarId: _.get(req.body, "avatarId", null),
      wardId: _.get(req.body, "wardId", null),
      districtId: _.get(req.body, "districtId", null),
      provinceId: _.get(req.body, "provinceId", null),
      storeId: loginUser.storeId,
      address: _.get(req.body, "address", ""),
      status: _.get(req.body, "status", null),
      note: _.get(req.body, "note", ""),
      ...(status !== null && { status }),
      updatedBy: _.get(req, "loginUser.id", null),
      updatedAt: new Date(),
    };
    const result = await updateDoctor(id, doctor, loginUser);
    if (result.success) res.json(respondItemSuccess());
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
  }
}

export async function deleteDoctorController(req, res) {
  try {
    const { id } = req.params;
    const { loginUser = {} } = req;
    const result = await deleteDoctor(id, loginUser);
    if (result.success) res.json(respondItemSuccess());
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
  }
}
