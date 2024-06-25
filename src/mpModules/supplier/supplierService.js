const Sequelize = require("sequelize");
const _ = require("lodash");
const { Op } = Sequelize;
const models = require("../../../database/models");
const { accountTypes, logActions } = require("../../helpers/choices");
const { HttpStatusCode } = require("../../helpers/errorCodes");
const { createUserTracking } = require("../behavior/behaviorService");
const { isExistStore } = require("../store/storeService");
const {
  isExistGroupSupplier,
} = require("../groupSupplier/groupSupplierService");

const attributes = [
  "id",
  "name",
  "phone",
  "email",
  "code",
  "taxCode",
  "provinceId",
  "districtId",
  "wardId",
  "storeId",
  "address",
  "companyName",
  "groupSupplierId",
  "storeId",
  "note",
  "createdAt",
  "createdBy"
];

const include = [
  {
    model: models.GroupSupplier,
    as: "groupSupplier",
    attributes: ["id", "name", "description", "storeId"],
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
    model: models.Branch,
    as: "branch",
    attributes: ["id", "name", "provinceId", "districtId", "wardId"],
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
  {
    model: models.User,
    as: "created_by",
    attributes: ["id", "username"],
  },
];

function processQuery(params) {
  const {
    page = 1,
    limit = 10,
    keyword = "",
    phone,
    email,
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
      address: {
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
  if (email) {
    where.email = email;
  }
  if (storeId) {
    where.storeId = storeId;
  }
  if (branchId) {
    where.branchId = branchId;
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

export async function supplierFilter(params) {
  try {
    return await models.Supplier.findAll(processQuery(params));
  } catch (e) {
    return [];
  }
}

export async function indexSuppliers(params) {
  const { rows, count } = await models.Supplier.findAndCountAll(
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

function generateSupplierCode(no) {
  if (no <= 0) return "NCC000000";
  if (no < 10) return `NCC00000${no}`;
  if (no < 100) return `NCC0000${no}`;
  if (no < 1000) return `NCC000${no}`;
  if (no < 10000) return `NCC00${no}`;
  if (no < 100000) return `NCC0${no}`;
  if (no < 1000000) return `NCC${no}`;
  return no;
}


export async function createSupplier(payload) {
  const existedStore = await isExistStore(payload.storeId);
  if (!existedStore) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: `Store có id = ${payload.storeId} không tồn tại`,
    };
  }

  const existedGroupSupplier = await isExistGroupSupplier(
    payload.groupSupplierId
  );
  if (!existedGroupSupplier) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: `Nhóm nhà cung cấp có id = ${payload.groupSupplierId} không tồn tại`,
    };
  }
  const newSupplier = await models.Supplier.create(payload);

  if (!payload.code) {
    payload.code = `${generateSupplierCode(newSupplier.id)}`;
    await models.Supplier.update(
      { code: payload.code },
      { where: { id: newSupplier.id } }
    );
  }

  createUserTracking({
    accountId: newSupplier.createdBy,
    type: accountTypes.USER,
    objectId: newSupplier.id,
    action: logActions.supplier_create.value,
    data: payload,
  });
  return {
    success: true,
    data: newSupplier,
  };
}

export async function updateSupplier(id, payload) {
  const findSupplier = await models.Supplier.findByPk(id, {
    attributes: ["id", "storeId", "code"],
  });

  if (!findSupplier) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Nhà cung cấp không tồn tại",
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

  if (payload.groupSupplierId) {
    const existedGroupSupplier = await isExistGroupSupplier(
      payload.groupSupplierId
    );
    if (!existedGroupSupplier) {
      return {
        error: true,
        code: HttpStatusCode.BAD_REQUEST,
        message: `Nhóm nhà cung cấp có id = ${payload.groupSupplierId} không tồn tại`,
      };
    }
  }

  if (!findSupplier.code && !payload.code) {
    payload.code = `${generateSupplierCode(findSupplier.id)}`;
  }

  await models.Supplier.update(payload, {
    where: {
      id,
    },
  });

  createUserTracking({
    accountId: payload.updatedBy,
    type: accountTypes.USER,
    objectId: id,
    action: logActions.supplier_update.value,
    data: payload,
  });

  return {
    success: true,
  };
}

export async function readSupplier(id, loginUser) {
  const findSupplier = await models.Supplier.findOne({
    attributes,
    include,
    where: {
      id: id,
      storeId: loginUser.storeId,
    },
  });
  if (!findSupplier) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Nhà cung cấp không tồn tại",
    };
  }
  return {
    success: true,
    data: findSupplier,
  };
}

export async function deleteSupplier(id, loginUser) {
  const findSupplier = await models.Supplier.findOne({
    attributes: ["id", "name", "storeId"],
    where: {
      id,
      storeId: loginUser.storeId,
    },
  });

  if (!findSupplier) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Nhà cung cấp không tồn tại",
    };
  }

  await models.Supplier.destroy({
    where: {
      id,
    },
  });

  createUserTracking({
    accountId: loginUser.id,
    type: accountTypes.USER,
    objectId: findSupplier.id,
    action: logActions.supplier_delete.value,
    data: { id, name: findSupplier.name, storeId: findSupplier.storeId },
  });

  return {
    success: true,
  };
}

export async function indexPaymentSupplier(params, loginUser) {
  let {
    page = 1,
    limit = 20,
    supplierId
  } = params
  const where = {};
  if (supplierId) {
    where.supplierId = supplierId;
  }
  const payments = await models.Payment.findAll({
    offset: +limit * (+page - 1),
    limit: +limit,
    include: {
      model: models.User,
      as: "fullnameCreator",
      attributes: ["id", "fullName",],
    },
    order: [["id", "DESC"]],
    where
  })
  return {
    success: true,
    data: payments
  }
}
