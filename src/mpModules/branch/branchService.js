const Sequelize = require("sequelize");
const _ = require("lodash");
const { Op } = Sequelize;
const models = require("../../../database/models");
const { accountTypes, logActions, ACTIVE } = require("../../helpers/choices");
const { HttpStatusCode } = require("../../helpers/errorCodes");
const { createUserTracking } = require("../behavior/behaviorService");
const { isExistStore } = require("../store/storeService");

const attributes = [
  "id",
  "name",
  "phone",
  "code",
  "zipCode",
  "provinceId",
  "districtId",
  "wardId",
  "storeId",
  "address1",
  "address2",
  "isDefaultBranch",
  "status",
  "createdAt",
];

const include = [
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
    branchId,
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
      address1: {
        [Op.like]: `%${keyword.trim()}%`,
      },
      address2: {
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
  if (branchId) {
    where.id = branchId;
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

export async function branchFilter(params) {
  try {
    return await models.Branch.findAll(processQuery(params));
  } catch (e) {
    return [];
  }
}

export async function isExistBranch(id) {
  return !!(await models.Branch.findOne({ where: { id } }, { status: ACTIVE }));
}

export async function isExistBranchStore(branchId, storeId) {
  return !!(await models.Branch.findOne(
    { where: { id: branchId, storeId } },
    { status: ACTIVE }
  ));
}

export async function indexBranches(params) {
  const { rows, count } = await models.Branch.findAndCountAll(
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

export async function createBranch(payload) {
  const existedStore = await isExistStore(payload.storeId);
  if (!existedStore) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: `Store có id = ${payload.storeId} không tồn tại`,
    };
  }
  const newBranch = await models.Branch.create(payload);
  createUserTracking({
    accountId: newBranch.createdBy,
    type: accountTypes.USER,
    objectId: newBranch.id,
    action: logActions.branch_create.value,
    data: payload,
  });
  return {
    success: true,
    data: newBranch,
  };
}

export async function updateBranch(id, payload) {
  const findBranch = await models.Branch.findByPk(id, {
    attributes: ["id", "storeId"],
  });

  if (!findBranch) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Branch không tồn tại",
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

  if (payload.isDefaultBranch) {
    await models.Branch.update(
      {
        isDefaultBranch: false,
      },
      {
        where: {
          id: {
            [Op.ne]: id,
          },
          storeId: findBranch.storeId,
        },
      }
    );
  }

  await models.Branch.update(payload, {
    where: {
      id,
    },
  });

  createUserTracking({
    accountId: payload.updatedBy,
    type: accountTypes.USER,
    objectId: id,
    action: logActions.branch_update.value,
    data: payload,
  });

  return {
    success: true,
  };
}

export async function readBranch(id, loginUser) {
  const findBranch = await models.Branch.findOne({
    attributes,
    include,
    where: {
      id: id,
      storeId: loginUser.storeId,
    },
  });
  if (!findBranch) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Branch không tồn tại",
    };
  }
  return {
    success: true,
    data: findBranch,
  };
}

export async function deleteBranch(id, loginUser) {
  const findBranch = await models.Branch.findOne({
    attributes: ["id", "name", "storeId"],
    where: {
      id,
      storeId: loginUser.storeId,
    },
  });

  if (!findBranch) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Branch không tồn tại",
    };
  }

  await models.Branch.destroy({
    where: {
      id,
    },
  });

  createUserTracking({
    accountId: loginUser.id,
    type: accountTypes.USER,
    objectId: findBranch.id,
    action: logActions.branch_delete.value,
    data: { id, name: findBranch.name, storeId: findBranch.storeId },
  });

  return {
    success: true,
  };
}

export async function getAllBranchFromStore(storeId) {
  return await models.Branch.findAll({attributes: ["id"], where: {storeId: storeId}})
}
