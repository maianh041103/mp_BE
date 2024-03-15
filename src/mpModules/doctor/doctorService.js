const Sequelize = require("sequelize");
const _ = require("lodash");
const { Op } = Sequelize;
const models = require("../../../database/models");
const { accountTypes, logActions } = require("../../helpers/choices");
const { HttpStatusCode } = require("../../helpers/errorCodes");
const { createUserTracking } = require("../behavior/behaviorService");
const { isExistStore } = require("../store/storeService");
const { randomString } = require("../../helpers/utils");

const attributes = [
  "id",
  "name",
  "phone",
  "code",
  "email",
  "gender",
  "specialistId",
  "levelId",
  "workPlaceId",
  "provinceId",
  "districtId",
  "wardId",
  "storeId",
  "address",
  "note",
  "status",
  "createdAt",
];

const include = [
  {
    model: models.Image,
    as: "avatar",
    attributes: ["id", "originalName", "fileName", "filePath", "path"],
  },
  {
    model: models.Store,
    as: "store",
    attributes: [
      "id",
      "name",
      "phone",
      "provinceId",
      "districtId",
      "wardId",
      "address",
      "createdAt",
    ],
    include: [
      {
        model: models.Province,
        as: "province",
        attributes: ["id", "name"],
      },
      {
        model: models.District,
        as: "district",
        attributes: ["id", "name"],
      },
      {
        model: models.Ward,
        as: "ward",
        attributes: ["id", "name"],
      },
    ],
  },
  {
    model: models.Specialist,
    as: "specialist",
    attributes: ["id", "name"],
  },
  {
    model: models.Level,
    as: "level",
    attributes: ["id", "name"],
  },
  {
    model: models.WorkPlace,
    as: "workPlace",
    attributes: ["id", "name"],
  },
  {
    model: models.Province,
    as: "province",
    attributes: ["id", "name"],
  },
  {
    model: models.District,
    as: "district",
    attributes: ["id", "name"],
  },
  {
    model: models.Ward,
    as: "ward",
    attributes: ["id", "name"],
  },
];

function processQuery(params) {
  const {
    page = 1,
    limit = 10,
    keyword = "",
    phone,
    provinceId,
    districtId,
    wardId,
    storeId,
    specialistId,
    levelId,
    workPlaceId,
    status,
  } = params;
  const query = {
    attributes,
    include,
    offset: +limit * (+page - 1),
    limit: +limit,
    order: [["createdAt", "DESC"]],
  };
  const where = {};
  if (keyword) {
    where[Op.or] = {
      name: {
        [Op.like]: `%${keyword.trim()}%`,
      },
      phone: {
        [Op.like]: `%${keyword.trim()}%`,
      },
      email: {
        [Op.like]: `%${keyword.trim()}%`,
      },
      note: {
        [Op.like]: `%${keyword.trim()}%`,
      },
    };
  }
  if (phone) {
    where.phone = phone;
  }
  if (storeId) {
    where.storeId = storeId;
  }
  if (specialistId) {
    where.specialistId = specialistId;
  }
  if (levelId) {
    where.levelId = levelId;
  }
  if (workPlaceId) {
    where.workPlaceId = workPlaceId;
  }
  if (provinceId) {
    where.provinceId = provinceId;
  }
  if (districtId) {
    where.districtId = districtId;
  }
  if (wardId) {
    where.wardId = wardId;
  }
  if (typeof status !== "undefined") {
    where.status = status;
  }
  query.where = where;
  return query;
}

export async function doctorFilter(params) {
  try {
    return await models.Doctor.findAll(processQuery(params));
  } catch (e) {
    return [];
  }
}

export async function indexDoctors(params) {
  const { rows, count } = await models.Doctor.findAndCountAll(
    processQuery(params)
  );
  return {
    success: true,
    data: {
      items: rows,
      totalItem: count,
    },
  };
}

function generateDoctorCode(no) {
  if (no <= 0) return "BS000000";
  if (no < 10) return `BS00000${no}`;
  if (no < 100) return `BS0000${no}`;
  if (no < 1000) return `BS000${no}`;
  if (no < 10000) return `BS00${no}`;
  if (no < 100000) return `BS0${no}`;
  if (no < 1000000) return `BS${no}`;
  return no;
}

export async function createDoctor(payload) {
  const existedStore = await isExistStore(payload.storeId);
  if (!existedStore) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: `Store có id = ${payload.storeId} không tồn tại`,
    };
  }
  if(payload.code){
    const isExistCode = await models.Doctor.findOne({
      where: {
        storeId: payload.storeId,
        code: payload.code
      }
    });
    if(isExistCode){
      return {
        error: true,
        code: HttpStatusCode.BAD_REQUEST,
        message: `Mã bác sĩ ${payload.code} đã tồn tại`,
      };
    }
  }
  const newDoctor = await models.Doctor.create(payload);
  if (!payload.code) {
    payload.code = generateDoctorCode(newDoctor.id);
    await models.Doctor.update(
      { code: payload.code },
      { where: { id: newDoctor.id } }
    );
  }
  createUserTracking({
    accountId: newDoctor.createdBy,
    type: accountTypes.USER,
    objectId: newDoctor.id,
    action: logActions.doctor_create.value,
    data: payload,
  });
  return {
    success: true,
    data: newDoctor,
  };
}

export async function updateDoctor(id, payload, loginUser) {
  const findDoctor = await models.Doctor.findOne({
    attributes,
    include,
    where: {
      id: id,
      storeId: loginUser.storeId,
    },
  });
  if (!findDoctor) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Bác sĩ không tồn tại",
    };
  }

  const existedStore = await isExistStore(payload.storeId);
  if (!existedStore) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: `Store có id = ${payload.storeId} không tồn tại`,
    };
  }

  if(payload.code){
    const isExistCode = await models.Doctor.findOne({
      where: {
        id: {
          [Op.ne]: findDoctor.id,
        },
        storeId: payload.storeId,
        code: payload.code
      }
    });
    if(isExistCode){
      return {
        error: true,
        code: HttpStatusCode.BAD_REQUEST,
        message: `Mã bác sĩ ${payload.code} đã tồn tại`,
      };
    }
  }

  await models.Doctor.update(payload, {
    where: {
      id,
    },
  });

  createUserTracking({
    accountId: payload.updatedBy,
    type: accountTypes.USER,
    objectId: id,
    action: logActions.doctor_update.value,
    data: payload,
  });

  return {
    success: true,
  };
}

export async function readDoctor(id, loginUser) {
  const findDoctor = await models.Doctor.findOne({
    attributes,
    include,
    where: {
      id: id,
      storeId: loginUser.storeId,
    },
  });
  if (!findDoctor) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Doctor không tồn tại",
    };
  }
  return {
    success: true,
    data: findDoctor,
  };
}

export async function deleteDoctor(id, loginUser) {
  const findDoctor = await models.Doctor.findOne({
    attributes: ["id", "name", "storeId"],
    where: {
      id,
      storeId: loginUser.storeId,
    },
  });

  if (!findDoctor) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Doctor không tồn tại",
    };
  }

  await models.Doctor.destroy({
    where: {
      id,
    },
  });

  createUserTracking({
    accountId: loginUser.id,
    type: accountTypes.USER,
    objectId: findDoctor.id,
    action: logActions.doctor_delete.value,
    data: { id, name: findDoctor.name, storeId: findDoctor.storeId },
  });

  return {
    success: true,
  };
}
