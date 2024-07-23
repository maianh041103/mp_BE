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
  uploadFileCreateDoctor
} = require("./doctorService");
const { HttpStatusCode } = require("../../helpers/errorCodes");

const fs = require('fs')
const uploadFile = require('../../helpers/upload');
const xlsx = require('xlsx');


export async function indexDoctorsController(req, res) {
  try {
    const { loginUser = {} } = req;
    const result = await indexDoctors({ ...req.query, storeId: loginUser.storeId });
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

export async function createDoctorByUploadController(req, res) {
  try {
    const { loginUser = {} } = req

    await uploadFile(req, res)

    if (req.file == undefined) {
      return res.status(400).send({ message: 'Please upload a file!' })
    }

    // Đường dẫn tạm thời của tệp Excel đã tải lên
    const excelFilePath = req.file.path

    // Đọc dữ liệu từ tệp Excel
    const workbook = xlsx.readFile(excelFilePath)
    const sheetName = workbook.SheetNames[0]
    const worksheet = workbook.Sheets[sheetName]
    const data = xlsx.utils.sheet_to_json(worksheet)
    const result = await uploadFileCreateDoctor(data,loginUser);
    if (result.success) res.json(respondItemSuccess());
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    )
  }
}
