import moment from "moment";
import { orderStatuses } from "../order/orderConstant";
const { hashPassword } = require("../auth/authService");
const { createUserTracking } = require("../behavior/behaviorService");
// const {
//   sendNotificationThroughSms,
// } = require("../notification/smsIntegrationService");
const _ = require("lodash");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const models = require("../../../database/models");
const sequelize = models.sequelize
const { checkUniqueValue, randomString } = require("../../helpers/utils");
const { customerStatus } = require("./customerConstant");
const { HttpStatusCode } = require("../../helpers/errorCodes");
const { addFilterByDate } = require("../../helpers/utils");
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
  "note",
  [Sequelize.literal(`(SELECT COALESCE(SUM(debtAmount), 0) 
  FROM customer_debts 
  WHERE Customer.id = customer_debts.customerId and customer_debts.debtAmount >= 0)`), 'totalDebt'],
  [Sequelize.literal(`(SELECT COALESCE(SUM(totalPrice), 0) 
  FROM orders 
  WHERE Customer.id = orders.customerId and status = 'SUCCEED')`), 'totalOrderPay'],
  [Sequelize.literal(`(SELECT COUNT(id) FROM orders
    WHERE Customer.id = orders.customerId)`), 'totalOrder']
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
  }
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

  const rows = await models.Customer.findAll(query);
  for (const row of rows) {
    row.dataValues.totalOrder = parseInt(row.dataValues.totalOrder);
  }

  return rows;
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
    isDefault,
    createdBy,
    createdAtRange = {},
    birthdayRange = {},
    totalDebtRange = {},
    totalOrderPayRange = {},
    pointRange = {},
    type,
    gender,
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
  if (isDefault !== null) {
    if (isDefault === true) {
      conditions.isDefault = true;
    } else {
      conditions.isDefault = { [Op.or]: [false, null] }
    }
  }
  if (_.isArray(listCustomer) && listCustomer.length) {
    conditions.id = listCustomer;
  }

  if (createdBy) {
    conditions.createdBy = createdBy;
  }

  if (createdAtRange) {
    let {
      createdAtStart,
      createdAtEnd
    } = createdAtRange;
    conditions.createdAt = addFilterByDate([createdAtStart, createdAtEnd]);
  }

  if (birthdayRange) {
    let {
      birthdayStart,
      birthdayEnd
    } = birthdayRange;
    conditions.birthday = addFilterByDate([birthdayStart, birthdayEnd]);
  }

  if (pointRange) {
    let {
      pointStart = 0,
      pointEnd = 10 ** 9
    } = pointRange;

    conditions.point = {
      [Op.between]: [pointStart, pointEnd]
    }
  }

  if (type) {
    conditions.type = type;
  }

  if (gender) {
    conditions.gender = gender;
  }


  let {
    totalDebtStart = -(10 ** 99),
    totalDebtEnd = 10 ** 99
  } = totalDebtRange;
  let {
    totalOrderPayStart = -(10 ** 99),
    totalOrderPayEnd = 10 ** 99
  } = totalOrderPayRange;

  let query = {
    attributes: customerAttributes,
    include: customerIncludes,
    distinct: true,
    where: conditions,
    having: {
      totalDebt: {
        [Op.and]: {
          [Op.lte]: totalDebtEnd,
          [Op.gte]: totalDebtStart
        }
      },
      totalOrderPay: {
        [Op.and]: {
          [Op.gte]: totalOrderPayStart,
          [Op.lte]: totalOrderPayEnd
        }
      }
    },
    limit: +limit,
    offset: +limit * (+page - 1),
    order: [["id", "DESC"]]
  };
  console.log(query)
  const [rows, count] = await Promise.all([
    models.Customer.findAll(query),
    models.Customer.count(query)
  ]);

  const point = await models.Point.findOne({
    where: {
      storeId: filter.storeId,
      status: "active"
    }
  });
  if (point)
    for (const row of rows) {
      row.dataValues.totalOrder = parseInt(row.dataValues.totalOrder);
      let check = 0;
      if (row.dataValues.totalOrder >= point.afterByTime) {
        if (point.isAllCustomer == true) {
          check = 1;
        } else {
          if (row.groupCustomerId != null) {
            const isExists = await models.PointCustomer.findOne({
              where: {
                groupCustomerId: row.groupCustomerId
              }
            });
            if (isExists) {
              check = 1;
            }
          }
        }
      }
      if (check)
        row.dataValues.isPointPayment = true;
      else
        row.dataValues.isPointPayment = false;
    }

  return {
    success: true,
    data: {
      items: rows,
      totalItem: count || 0
    },
  };
}

export async function getTotalDebt(customerId) {
  const orders = await models.Order.findOne({
    attributes: []
  })
}

export async function readCustomer(id, loginUser) {
  if (!id) {
    console.log("Test")
    const defaultCust = await readDefaultCustomer(loginUser.storeId)
    return {
      success: true,
      data: defaultCust.data,
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
  findCustomer.dataValues.totalOrder = parseInt(findCustomer.dataValues.totalOrder);

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

  findCustomer.dataValues.totalOrder = parseInt(findCustomer.dataValues.totalOrder);
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
  if (!findCustomer.code && !payload.code) {
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

export async function indexPaymentCustomer(params, loginUser) {
  let {
    page,
    limit,
    customerId
  } = params
  const where = {};
  if (customerId) {
    where.customerId = customerId;
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

const historyPointInclude = [
  {
    model: models.Order,
    as: "order",
    attributes: [
      "code",
      "totalPrice",
      "paymentPoint",
    ]
  },
  {
    model: models.Customer,
    as: "customer",
    attributes: ["fullName"]
  },
  {
    model: models.SaleReturn,
    as: "saleReturn",
    attributes: [
      "code",
      "totalPrice"
    ]
  }
]

export async function historyPointService(customerId, query) {
  const limit = parseInt(query.limit) || 20;
  const page = parseInt(query.page) || 1;
  const { rows, count } = await models.PointHistory.findAndCountAll({
    attributes: [
      "point",
      "code",
      "note",
      [sequelize.literal(`(
        SELECT IFNULL(SUM(point), 0)
        FROM point_history AS sub
        WHERE sub.customerId = ${customerId} AND sub.id <= PointHistory.id AND sub.deletedAt IS NULL
      )`), 'postTransactionPoint']
    ],
    include: historyPointInclude,
    where: {
      customerId,
    },
    order: [['id', 'DESC']],
    limit,
    offset: (page - 1) * limit
  });

  for (const row of rows) {
    row.dataValues.postTransactionPoint = parseInt(row.dataValues.postTransactionPoint);
    if (row.order) {
      if (!row.code) {
        row.dataValues.code = row.order.code;
      }
      row.dataValues.totalPrice = row.order.totalPrice;
      row.dataValues.type = "Bán hàng";
    }
    else if (row.saleReturn) {
      if (!row.code) {
        row.dataValues.code = row.saleReturn.code;
      }
      row.dataValues.totalPrice = row.saleReturn.totalPrice;
      row.dataValues.type = "Trả hàng";
    }
    else {
      row.dataValues.type = "Cân bằng điểm";
    }
  }
  return {
    success: true,
    data: {
      items: rows,
      totalItem: count || 0
    },
  }
}