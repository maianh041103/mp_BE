const moment = require("moment");
const { addFilterByDate } = require("../../helpers/utils");
const Sequelize = require("sequelize");
const _ = require("lodash");
const { Op } = Sequelize;
const models = require("../../../database/models");
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
  try {
    dateRange = JSON.parse(dateRange);
  } catch (e) {
    dateRange = {};
  }
  let {
    startDate = moment().startOf("month").format("YYYY-MM-DD"),
    endDate = moment().endOf("month").format("YYYY-MM-DD"),
  } = dateRange;
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
      if(result[mapDays[moment(startDate).day() % 7]]){
        result[mapDays[moment(startDate).day() % 7]] += obj.revenue;
        continue;
      }
      result[mapDays[moment(startDate).day() % 7]] = obj.revenue;
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
