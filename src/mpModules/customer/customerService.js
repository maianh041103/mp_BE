import {orderStatuses} from "../order/orderConstant";

const { hashPassword } = require("../auth/authService");
const { createUserTracking } = require("../behavior/behaviorService");
// const {
//   sendNotificationThroughSms,
// } = require("../notification/smsIntegrationService");
const _ = require("lodash");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const models = require("../../../database/models");
const { checkUniqueValue, randomString } = require("../../helpers/utils");
const { customerStatus } = require("./customerConstant");
const { HttpStatusCode } = require("../../helpers/errorCodes");
const {
  accountTypes,
  logActions,
  PAGE_LIMIT,
  userStatus,
} = require("../../helpers/choices");

const customerAttributes = [
  "id",
  "code",
  "phone",
  "email",
  "fullName",
  "address",
  "avatarId",
  "birthday",
  "gender",
  "groupCustomerId",
  "position",
  "taxCode",
  "type",
  "status",
  "point",
  "debt",
  "storeId",
  "createdAt",
  "createdBy",
  "note"
];

const customerIncludes = [
  {
    model: models.Image,
    as: "avatar",
    attributes: ["id", "originalName", "fileName", "filePath", "path"],
  },
  {
    model: models.GroupCustomer,
    as: "groupCustomer",
    attributes: ["id", "name", "description", "type", "discount"],
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

export async function customerFilter(params) {
  const {
    customerId,
    groupCustomerId,
    groupCustomerIds = [],
    keyword,
    phone,
    order = [],
  } = params;

  const conditions = { status: customerStatus.ACTIVE };

  if (phone) {
    conditions.phone = {
      [Op.like]: `%${phone.trim()}%`,
    };
  }
  if (customerId) {
    conditions.id = customerId;
  }
  if (groupCustomerId) {
    conditions.groupCustomerId = groupCustomerId;
  }
  if (type) {
    conditions.type = type;
  }
  if (_.isArray(groupCustomerIds) && groupCustomerIds.length) {
    conditions.groupCustomerId = groupCustomerIds;
  }
  if (keyword) {
    conditions[Op.or] = [
      {
        fullName: {
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
    ];
  }
  const query = {
    attributes: customerAttributes,
    include: customerIncludes,
    where: conditions,
    raw: true,
  };
  if (_.isArray(order) && order.length) {
    query.order = order;
  }
  return await models.Customer.findAll(query);
}

export async function indexCustomers(filter) {
  const {
    page = 1,
    limit = 10,
    keyword = "",
    groupCustomerId,
    position = "",
    status = "",
    phone = "",
    listCustomer = [],
    storeId,
  } = filter;

  const conditions = {};
  if (keyword) {
    conditions[Op.or] = [
      {
        fullName: {
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
        code: {
          [Op.like]: `%${keyword.trim()}%`,
        },
      },
    ];
  }

  if (storeId) conditions.storeId = storeId;
  if (phone) conditions.phone = phone;
  if (groupCustomerId) conditions.groupCustomerId = groupCustomerId;
  if (position) conditions.position = position;
  if (status) conditions.status = status;

  if (_.isArray(listCustomer) && listCustomer.length) {
    conditions.id = listCustomer;
  }

  const query = {
    attributes: customerAttributes,
    include: customerIncludes,
    distinct: true,
    where: conditions,
    limit: +limit,
    offset: +limit * (+page - 1),
    order: [["id", "DESC"]],
  };

  const { rows, count } = await models.Customer.findAndCountAll(query);
  for (const item of rows) {
    item.dataValues.totalDebt  = await models.CustomerDebt.sum('debtAmount',{
      where: {
        customerId: item.id,
        debtAmount: {[Op.gt]: 0}
      }
    })
    item.dataValues.totalOrderPay  = await models.Order.sum('totalPrice',{
      where: {
        customerId: item.id,
        status: orderStatuses.SUCCEED
      }
    })
  }
  return {
    success: true,
    data: {
      items: rows,
      totalItem: count,
    },
  };
}

export async function getTotalDebt(customerId) {
  const orders = await models.Order.findOne({
    attributes: []
  })
}

export async function readCustomer(id, loginUser) {
  if (id == null) {
    return {
      success: true,
      data: await readDefaultCustomer(loginUser.storeId),
    };
  }

  const findCustomer = await models.Customer.findOne({
    attributes: customerAttributes,
    include: customerIncludes,
    where: {
      id,
      storeId: loginUser.storeId,
    },
  });
  if (!findCustomer) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Khách hàng không tồn tại",
    };
  }
  return {
    success: true,
    data: findCustomer,
  };
}

export async function readDefaultCustomer(storeId) {
  let findCustomer = await models.Customer.findOne({
    attributes: customerAttributes,
    include: customerIncludes,
    where: {
      storeId,
      isDefault: true
    },
  });
  if (!findCustomer) {
    await createDefaultCustomer(storeId)
    findCustomer = await models.Customer.findOne({
      attributes: customerAttributes,
      include: customerIncludes,
      where: {
        storeId,
        isDefault: true
      },
    });
  }
  return {
    success: true,
    data: findCustomer,
  };
}

// update one customer
export async function updateCustomer(id, payload, loginUser) {
  const findCustomer = await models.Customer.findOne({
    attributes: customerAttributes,
    include: customerIncludes,
    where: {
      id,
      storeId: loginUser.storeId,
    },
  });
  if (!findCustomer) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Khách hàng không tồn tại",
    };
  }
  if(!findCustomer.code && !payload.code){
    payload.code = `${generateCustomerCode(findCustomer.id)}`;
  }
  await models.Customer.update(payload, {
    where: {
      id,
    },
  });
  return {
    success: true,
  };
}

function generateCustomerCode(no) {
  if (no <= 0) return "KH000000";
  if (no < 10) return `KH00000${no}`;
  if (no < 100) return `KH0000${no}`;
  if (no < 1000) return `KH000${no}`;
  if (no < 10000) return `KH00${no}`;
  if (no < 100000) return `KH0${no}`;
  if (no < 1000000) return `KH${no}`;
  return no;
}

export async function createCustomer(payload, loginUser) {
  const checkPhone = await checkUniqueValue("Customer", {
    phone: payload.phone,
    storeId: loginUser.storeId,
  });
  if (!checkPhone) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: `Số điện thoại ${payload.phone} đã được đăng ký`,
    };
  }

  const newCustomer = await models.Customer.create(payload);

  if (!payload.code) {
    payload.code = `${generateCustomerCode(newCustomer.id)}`;
    await models.Customer.update(
      { code: payload.code },
      { where: { id: newCustomer.id } }
    );
  }

  createUserTracking({
    accountId: loginUser.id,
    type: accountTypes.USER,
    objectId: newCustomer.id,
    action: logActions.customer_create.value,
    data: payload,
  });
  //   sendNotificationThroughSms({
  //     phone: newCustomer.phone,
  //     content: `Dang ki thanh cong. Tai khoan cua ban dang duoc cho kich hoat.`,
  //   });
  return {
    success: true,
    data: await models.Customer.findByPk(newCustomer.id, {
      attributes: customerAttributes,
      include: customerIncludes,
    }),
  };
}

export async function createDefaultCustomer(storeId) {
  const payload = {
    storeId,
    fullName: "Khách lẻ",
    status: 'active',
    isDefault: true
  }
  const newCustomer = await models.Customer.create(payload);

  if (!payload.code) {
    payload.code = `${generateCustomerCode(newCustomer.id)}`;
    await models.Customer.update(
        { code: payload.code },
        { where: { id: newCustomer.id } }
    );
  }
}

export async function indexCustomersByGroup(filter) {
  const departments = await departmentFilter({
    ...filter,
    limit: PAGE_LIMIT,
  });

  const infoDepartment = {};
  for (let item of departments) {
    if (infoDepartment[item.id]) continue;
    infoDepartment[item.id] = {
      groupCustomerId: item.id,
      departmentName: item.name,
      listCustomer: [],
    };
  }

  const customers = await customerFilter(filter);

  for (let item of customers) {
    if (!infoDepartment[item.groupCustomerId]) continue;
    infoDepartment[item.groupCustomerId].listCustomer.push({
      id: item.id,
      fullName: item.fullName,
      phone: item.phone,
    });
  }

  return {
    success: true,
    data: {
      list_department: Object.values(infoDepartment),
    },
  };
}

export async function deleteCustomerById(id, loginUser) {
  const findCustomer = await models.Customer.findByPk(id, {
    attributes: ["id", "fullName", "phone"],
  });
  if (!findCustomer) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Khách hàng không tồn tại",
    };
  }
  await models.Customer.destroy({
    where: {
      id,
    },
  });
  createUserTracking({
    accountId: loginUser.id,
    type: accountTypes.USER,
    objectId: id,
    action: logActions.customer_delete.value,
    data: {
      id,
      fullName: findCustomer.fullName,
      phone: findCustomer.phone,
    },
  });

  return {
    success: true,
  };
}

// update password
export async function updatePassword(id, password, loginUser) {
  const findCustomer = await models.Customer.findByPk(id, {
    attributes: ["id"],
  });
  if (findCustomer) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Khách hàng không tồn tại",
    };
  }
  await models.Customer.update(
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
    action: logActions.customer_update_password.value,
    data: { id, password: "***" },
  });

  return {
    success: true,
  };
}

// update user status
export async function updateCustomerStatus(id, customer) {
  const findCustomer = await models.Customer.findByPk(id, {
    attributes: ["id", "status", "phone"],
  });

  if (!findCustomer) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Khách hàng không tồn tại",
    };
  }
  await models.Customer.update(customer, {
    where: {
      id,
    },
  });
  // if (customer.status == userStatus.ACTIVE) {
  //   // Thông báo tài khoản đã được kích hoạt
  //   sendNotificationThroughSms({
  //     phone: findCustomer.phone,
  //     content: `Tai khoan cua ban da duoc kich hoat. Ban hay dang nhap de nhan duoc gia uu dai tot hon nhe!`,
  //   });
  // }
  return {
    success: true,
  };
}

export async function getCustomer(customerId) {
  if (!customerId) return {};
  const customer = await customerFilter({ customerId });
  if (customer.length) return customer[0];
  return {};
}
