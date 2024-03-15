const _ = require("lodash");
const { hashPassword } = require("../auth/authService");
const { createUserTracking } = require("../behavior/behaviorService");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const models = require("../../../database/models");
const { checkUniqueValue, formatMobileToSave } = require("../../helpers/utils");
const { HttpStatusCode } = require("../../helpers/errorCodes");
const { accountTypes, logActions } = require("../../helpers/choices");
const { isExistStore } = require("../store/storeService");
const { isExistBranchStore } = require("../branch/branchService");
const { isExistRole } = require("../role/roleService");
const { userPositions } = require("../user/userConstant.js");

const userAttributes = [
  "id",
  "username",
  "email",
  "fullName",
  "avatarId",
  "birthday",
  "gender",
  "phone",
  "roleId",
  "position",
  "lastLoginAt",
  "createdAt",
  "status",
];

const userIncludes = [
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
    model: models.Branch,
    as: "branch",
    attributes: [
      "id",
      "name",
      "phone",
      "code",
      "zipCode",
      "provinceId",
      "districtId",
      "wardId",
      "isDefaultBranch",
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
    model: models.Role,
    as: "role",
    attributes: ["id", "name", "description"],
  },
];

export async function indexUsers(filter) {
  const {
    page = 1,
    limit = 10,
    keyword = "",
    roleId,
    position = "",
    status = "",
    phone = "",
    storeId,
    branchId,
    listUser = [],
    raw = false,
  } = filter;

  const userWhere = {};
  if (keyword) {
    userWhere[Op.or] = [
      {
        username: {
          [Op.like]: `%${keyword.trim()}%`,
        },
      },
      {
        email: {
          [Op.like]: `%${keyword.trim()}%`,
        },
      },
      {
        phone: {
          [Op.like]: `%${keyword.trim()}%`,
        },
      },
      {
        address: {
          [Op.like]: `%${keyword.trim()}%`,
        },
      },
    ];
  }

  if (roleId) userWhere.roleId = roleId;
  if (storeId) userWhere.storeId = storeId;
  if (branchId) userWhere.branchId = branchId;
  if (phone) userWhere.phone = phone;
  if (position) userWhere.position = position;
  if (status) userWhere.status = status;
  if (_.isArray(listUser) && listUser.length) {
    userWhere.id = listUser;
  }

  const offset = +limit * (+page - 1);
  const query = {
    attributes: userAttributes,
    include: userIncludes,
    distinct: true,
    where: userWhere,
    limit: +limit,
    offset,
    order: [["id", "DESC"]],
  };
  if (raw) {
    query.raw = true;
  }
  const { rows, count } = await models.User.findAndCountAll(query);
  return {
    success: true,
    data: {
      items: rows,
      totalItem: count,
    },
  };
}

export async function createUser(credentials) {
  const {
    username,
    fullName,
    password,
    email,
    storeId,
    branchId,
    roleId,
    position,
    gender,
    address,
    birthday,
    avatarId,
  } = credentials;

  const existedStore = await isExistStore(storeId);
  if (!existedStore) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: `Store có id = ${storeId} không tồn tại`,
    };
  }

  const existedBranch = await isExistBranchStore(branchId, storeId);
  if (!existedBranch) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: `Branch có id = ${branchId} không tồn tại hoặc không thuộc Store có id = ${storeId}.`,
    };
  }

  const existedRole = await isExistRole(roleId);
  if (!existedRole) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: `Role có id = ${roleId} không tồn tại`,
    };
  }

  const phone = formatMobileToSave(credentials.phone);
  const findUserByPhone = await models.User.findOne({
    where: {
      phone,
      storeId,
    },
    raw: true,
  });

  if (findUserByPhone) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: "Số điện thoại đã được đăng ký",
    };
  }

  const isExistedUsername = await models.User.findOne({
    where: {
      username,
    },
    raw: true,
  });

  if (isExistedUsername) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: "Tên tài khoản đã được sử dụng",
    };
  }

  const newUser = await models.User.create({
    username,
    fullName,
    email,
    phone,
    birthday,
    gender,
    password: hashPassword(password),
    position,
    storeId,
    branchId,
    roleId,
    avatarId,
    address,
  });

  return {
    success: true,
    data: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      phone: newUser.phone,
      fullName: newUser.fullName,
      position: newUser.position,
      address: newUser.address,
      birthday: newUser.birthday,
      storeId: newUser.storeId,
      branchId: newUser.branchId,
      roleId: newUser.roleId,
    },
  };
}

export async function updateUser(id, user, loginUser) {
  const findUser = await models.User.findOne({
    where: {
      id,
      storeId: loginUser.storeId
    },
  });
  if (!findUser) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "User không tồn tại",
    };
  }
  await models.User.update(user, {
    where: {
      id,
    },
  });
  createUserTracking({
    accountId: user.updatedBy,
    type: accountTypes.USER,
    objectId: id,
    action: logActions.user_update.value,
    data: user,
  });
  return {
    success: true,
  };
}

export async function updatePassword(id, password, loginUser) {
  const findUser = await models.User.findByPk(id, {
    attributes: ["id"],
  });

  if (findUser) {
    await models.User.update(
      {
        password: hashPassword(password),
        timeTokenInactive: new Date(),
      },
      {
        where: {
          id,
        },
      }
    );

    createUserTracking({
      accountId: loginUser.id,
      type: accountTypes.USER,
      objectId: id,
      action: logActions.user_update_password.value,
      data: { id, password: "***" },
    });

    return {
      success: true,
    };
  }

  return {
    error: true,
    code: HttpStatusCode.NOT_FOUND,
    message: "User không tồn tại",
  };
}

export async function readUser(id, loginUser) {
  const findUser = await models.User.findOne({
    attributes: userAttributes,
    include: userIncludes,
    where: {
      id,
      storeId: loginUser.storeId
    }
  });
  if (!findUser) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Người dùng không tồn tại",
    };
  }
  return {
    success: true,
    data: findUser,
  };
}

export async function deleteUserById(id, loginUser) {
  const findUser = await models.User.findByPk(id, {
    attributes: ["id"],
  });

  if (!findUser) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "User không tồn tại",
    };
  }

  await models.User.destroy({
    where: {
      id,
    },
  });

  createUserTracking({
    accountId: loginUser.id,
    type: accountTypes.USER,
    objectId: id,
    action: logActions.user_delete.value,
    data: { id },
  });

  return {
    success: true,
  };
}

// update user status
export async function updateUserStatus(id, user) {
  const findUser = await models.User.findByPk(id, {
    attributes: ["id", "status"],
  });

  if (findUser) {
    await models.User.update(user, {
      where: {
        id,
      },
    });
    return {
      success: true,
    };
  }

  return {
    error: true,
    code: HttpStatusCode.NOT_FOUND,
    message: "Nhân viên không tồn tại",
  };
}
