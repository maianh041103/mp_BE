import {SALES_CONCERN} from "./contant";
import {groupByField, getFilter} from "./util";

const moment = require("moment");
const { addFilterByDate } = require("../../helpers/utils");
const Sequelize = require("sequelize");
const _ = require("lodash");
const { Op } = Sequelize;
const models = require("../../../database/models");
const sequelize = models.sequelize
const { HttpStatusCode } = require("../../helpers/errorCodes");
const { orderStatuses } = require("../order/orderConstant");

export async function indexRevenuesReport(params, loginUser) {
  const {
    status = orderStatuses.SUCCEED,
    branchId = loginUser.branchId,
    type = "date", // "day"
  } = params;

  const conditions = {
    storeId: loginUser.storeId,
  };
  if (branchId) conditions.branchId = branchId;
  if (status) conditions.status = status;
  let { dateRange = {} } = params;
  let {
    startDate = moment().startOf("month"),
    endDate = moment().endOf("month"),
  } = dateRange;
  startDate = moment(startDate).format("YYYY-MM-DD")
  endDate = moment(endDate).format("YYYY-MM-DD")
  if (
    startDate &&
    moment(startDate).isValid() &&
    endDate &&
    moment(endDate).isValid()
  ) {
    conditions.createdAt = addFilterByDate([startDate, endDate]);
  } else {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: "Vui lòng chọn khoảng thời gian",
    };
  }

  const orderIds = (
    await models.Order.findAll({
      attributes: ["id"],
      where: conditions,
      raw: true,
    })
  ).map((o) => o.id);

  if (!orderIds.length) {
    return {
      success: true,
      data: {
        items: [],
      },
    };
  }

  const queryOrderProduct = {
    attributes: ["quantity", "price", "productId", "createdAt"],
    where: {
      orderId: orderIds,
    },
  };

  const orderProducts = await models.OrderProduct.findAll(queryOrderProduct);

  const hashMapProduct = {};
  for (const item of orderProducts) {
    const timeKey = item.createdAt
      ? moment(item.createdAt).format("DD-MM-YYYY")
      : null;
    if (!timeKey) continue;

    if (!hashMapProduct[timeKey]) {
      hashMapProduct[timeKey] = { revenue: +item.quantity * +item.price };
      continue;
    }
    hashMapProduct[timeKey].revenue += +item.quantity * +item.price;
  }

  let items = [];
  while (moment(startDate).isSameOrBefore(moment(endDate))) {
    const timeKey = moment(startDate).format("DD-MM-YYYY");
    const day = moment(startDate).date();
    items.push({
      startDate: startDate,
      date: timeKey,
      label: `${day < 10 ? "0" + day : day}`,
      revenue:
        hashMapProduct[timeKey] && hashMapProduct[timeKey].revenue
          ? hashMapProduct[timeKey].revenue
          : 0,
    });
    startDate = moment(startDate).add(1, "day");
  }

  if (type === "day") {
    const mapDays = {
      0: "CN",
      1: "T2",
      2: "T3",
      3: "T4",
      4: "T5",
      5: "T6",
      6: "T7",
    }
    const result = {};
    for(const obj of items){
      if(result[mapDays[moment(obj.startDate).day() % 7]]){
        result[mapDays[moment(obj.startDate).day() % 7]] += obj.revenue;
        continue;
      }
      result[mapDays[moment(obj.startDate).day() % 7]] = obj.revenue;
    }
    items = [
      {
        "label": "T2",
        "revenue": result["T2"] || 0
      },
      {
        "label": "T3",
        "revenue": result["T3"] || 0
      },
      {
        "label": "T4",
        "revenue": result["T4"] || 0
      },
      {
        "label": "T5",
        "revenue": result["T5"] || 0
      },
      {
        "label": "T6",
        "revenue": result["T6"] || 0
      },
      {
        "label": "T7",
        "revenue": result["T7"] || 0
      },
      {
        "label": "CN",
        "revenue": result["CN"] || 0
      },
    ]
  }

  return {
    success: true,
    data: {
      items,
    },
  };
}


async function getReportByTime(from, to, branchId) {
  const groupBy = groupByField('Order.createdAt', from, to);
  const res = await models.Order.findAll({
    attributes: [
      [sequelize.literal(groupBy), 'title'],
      [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalRevenue'],
      [sequelize.literal('0'), 'saleReturn'],
      [sequelize.fn('SUM', sequelize.col('totalPrice')), 'realRevenue'],
    ],
    where: getFilter(from, to, branchId),
    group: sequelize.literal(groupBy)
  })
  return {
    success: true,
    data: {
      items: res,
      summary: calculateSummary(res, ['totalRevenue', 'saleReturn', 'realRevenue'])
    }
  };
}
async function getReportByRevenue(from, to, branchId) {
  const groupBy = groupByField('Order.createdAt', from, to);
  const res = await models.Order.findAll({
    attributes: [
      [sequelize.literal(groupBy), 'title'],
      [sequelize.fn('SUM', sequelize.col('orderProducts.price')), 'totalPrice'],
      [sequelize.fn('SUM', sequelize.col('discountAmount')), 'totalDiscount'],
      [sequelize.fn('SUM', sequelize.col('totalPrice')), 'totalRevenue'],
      [sequelize.fn('SUM', sequelize.col('orderProducts.primePrice')), 'totalPrime'],
      [sequelize.literal('SUM(totalPrice) - SUM(orderProducts.primePrice)'), 'profit']
    ],
    include: [
      {
        model: models.OrderProduct,
        as: 'orderProducts',
        attributes: []
      }
    ],
    where: getFilter(from, to, branchId),
    group: sequelize.literal(groupBy)
  })
  return {
    success: true,
    data: {
      items: res,
      summary: calculateSummary(res, ['totalPrice', 'totalDiscount', 'totalRevenue', 'totalPrime', 'profit'])
    }
  };
}

async function getReportByDiscount(from, to, branchId) {
  const groupBy = groupByField('Order.createdAt', from, to);
  const res = await models.Order.findAll({
    attributes: [
      [sequelize.literal(groupBy), 'title'],
      [sequelize.fn('COUNT', sequelize.col('Order.id')), 'totalOrder'],
      [sequelize.fn('SUM', sequelize.col('discountAmount')), 'totalDiscount'],
      [sequelize.fn('SUM', sequelize.col('orderProducts.price')), 'totalPrice'],
    ],
    include: [
      {
        model: models.OrderProduct,
        as: 'orderProducts',
        attributes: []
      }
    ],
    where: getFilter(from, to, branchId),
    group: sequelize.literal(groupBy)
  })
  return {
    success: true,
    data: {
      items: res,
      summary: calculateSummary(res, ['totalPrice', 'totalDiscount', 'totalRevenue', 'totalPrime', 'profit'])
    }
  };
}

export async function indexSalesReport(params, loginUser) {
  const {
    branchId,
    from,
    to,
    concern
  } = params;

  switch (concern) {
    case SALES_CONCERN.TIME:
      return await getReportByTime(from, to, branchId);
    case SALES_CONCERN.REVENUE:
      return await getReportByRevenue(from, to, branchId)
    case SALES_CONCERN.DISCOUNT:
      return await getReportByDiscount(from, to, branchId)
    case SALES_CONCERN.SALE_RETURN:
      return await getReportByTime(from, to, branchId)
    case SALES_CONCERN.EMPLOYEE:
      return await getReportByTime(from, to, branchId)
    default:
      return await getReportByTime(from, to, branchId);
  }


}

function calculateSummary(res, properties) {
  // Khởi tạo đối tượng chứa tổng của mỗi thuộc tính
  const summary = properties.reduce((acc, property) => {
    acc[property] = 0; // Khởi tạo tổng của mỗi thuộc tính bằng 0
    return acc;
  }, {});

  // Tính tổng của các thuộc tính trong mảng res
  res.forEach(item => {
    properties.forEach(property => {
      summary[property] += parseInt(item.dataValues[property]) || 0;
    });
  });

  return summary;
}