const { createUserTracking } = require("../behavior/behaviorService");
const Sequelize = require("sequelize");
const _ = require("lodash");
const { Op } = Sequelize;
const models = require("../../../database/models");
const { accountTypes, logActions, ACTIVE } = require("../../helpers/choices");
const { HttpStatusCode } = require("../../helpers/errorCodes");
const attributes = [
  "id",
  "name",
  "phone",
  "email",
  "provinceId",
  "districtId",
  "wardId",
  "logoId",
  "address",
  "createdAt",
  "businessRegistrationNumber",
];

const include = [
  {
    model: models.Image,
    as: "businessRegistrationImage",
    attributes: ["id", "path"],
  },
  {
    model: models.Image,
    as: "logo",
    attributes: ["id", "path"],
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
    provinceId,
    districtId,
    wardId,
    storeId,
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
      field: {
        [Op.like]: `%${keyword.trim()}%`,
      },
    };
  }
  if (storeId) {
    where.id = storeId;
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

export async function storeFilter(params) {
  try {
    return await models.Store.findAll(processQuery(params));
  } catch (e) {
    return [];
  }
}

export async function indexStores(params) {
  const { rows, count } = await models.Store.findAndCountAll(
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

export async function createStore(payload) {
  const newStore = await models.Store.create(payload);
  const createBranchInput = {
    name: "Chi nhánh mặc định",
    phone: payload.phone,
    code: "",
    zipCode: "",
    wardId: payload.wardId || null,
    districtId: payload.districtId || null,
    provinceId: payload.provinceId || null,
    address1: payload.address || "",
    address2: "",
    isDefaultBranch: true,
    createdBy: payload.createdBy,
    createdAt: new Date(),
    storeId: newStore.id,
  };

  const newBranch = await models.Branch.create(createBranchInput);

  const logObject = {
    accountId: newStore.createdBy,
    type: accountTypes.USER,
  };

  [
    {
      ...logObject,
      objectId: newStore.id,
      action: logActions.store_create.value,
      data: payload,
    },
    {
      ...logObject,
      objectId: newBranch.id,
      action: logActions.branch_create.value,
      data: createBranchInput,
    },
  ].forEach((obj) => createUserTracking(obj));

  return {
    success: true,
    data: newStore,
  };
}

export async function updateStore(id, payload, loginUser) {
  if (loginUser.storeId != id) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Store không tồn tại",
    };
  }

  const findStore = await models.Store.findByPk(id, {
    attributes: ["id"],
  });

  if (!findStore) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Store không tồn tại",
    };
  }

  await models.Store.update(payload, {
    where: {
      id,
    },
  });

  createUserTracking({
    accountId: payload.updatedBy,
    type: accountTypes.USER,
    objectId: id,
    action: logActions.store_update.value,
    data: payload,
  });

  return {
    success: true,
  };
}

export async function isExistStore(id) {
  return !!(await models.Store.findOne({ where: { id } }, { status: ACTIVE }));
}

export async function countStore(query) {
  try {
    delete query.order;
    delete query.include;
    query.attributes = ["id"];
    query.raw = true;
    return await models.Store.count(query);
  } catch (e) {
    return 0;
  }
}

export async function readStore(id, loginUser) {
  if (loginUser.storeId != id) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Cửa hàng có không tồn tại",
    };
  }
  const findStore = await models.Store.findByPk(id, {
    attributes,
    include,
  });
  if (!findStore) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Cửa hàng có không tồn tại",
    };
  }
  return {
    success: true,
    data: findStore,
  };
}

// export async function deleteStore(id, userId) {
//   const instance = await models.Store.findByPk(id, {
//     attributes: ["id", "name"],
//   });

//   if (!instance) {
//     return {
//       error: true,
//       code: HttpStatusCode.NOT_FOUND,
//       message: "Store không tồn tại",
//     };
//   }

//   await models.Store.destroy({
//     where: {
//       id,
//     },
//   });

//   createUserTracking({
//     accountId: userId,
//     type: accountTypes.USER,
//     objectId: instance.id,
//     action: logActions.store_delete.value,
//     data: { id, name: instance.name },
//   });

//   return {
//     success: true,
//   };
// }