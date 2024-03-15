const moment = require("moment");
const { addFilterByDate } = require("../../helpers/utils");
const Sequelize = require("sequelize");
const _ = require("lodash");
const { Op } = Sequelize;
const models = require("../../../database/models");
const { userPositions } = require("../user/userConstant");
const {
  paymentTypes,
  orderStatusOptions,
  orderStatuses,
} = require("../order/orderConstant");
const { productIncludes } = require("../product/productService");

export async function indexProductsReport(params, loginUser) {
  const {
    status = orderStatuses.SUCCEED,
    branchId = loginUser.branchId,
    productType,
    groupProductId,
    limit = 10,
    page = 1,
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
  const { startDate, endDate } = dateRange;
  if (
    startDate &&
    moment(startDate).isValid() &&
    endDate &&
    moment(endDate).isValid()
  ) {
    conditions.createdAt = addFilterByDate([startDate, endDate]);
  }

  const queryProductHistory = {
    attributes: [
      "id",
      "quantity",
      "initQuantity",
      "totalPrice",
      "importPrice",
      "discount",
      "expiryDate",
      "createdAt",
    ],
    include: [
      {
        model: models.Batch,
        as: "batch",
        attributes: ["id", "name", "quantity", "expiryDate"],
        order: [["expiryDate", "ASC"]],
      },
      {
        model: models.ProductUnit,
        as: "productUnit",
        attributes: [
          "id",
          "unitName",
          "exchangeValue",
          "price",
          "productId",
          "code",
          "barCode",
          "isDirectSale",
          "isBaseUnit",
          "point",
        ],
      },
      {
        model: models.Product,
        as: "product",
        attributes: [
          "name",
          "shortName",
          "code",
          "barCode",
          "imageId",
          "isBatchExpireControl",
        ],
        include: productIncludes.filter((obj) => obj.as !== "productUnit"),
        where: {
          ...(productType && { type: productType }),
          ...(groupProductId && { groupProductId: groupProductId }),
        },
      },
    ],
    offset: +limit * (+page - 1),
    limit: +limit,
    order: [["id", "DESC"]],
  };

  const items = await models.ProductBatchHistory.findAll(queryProductHistory);

  return {
    success: true,
    data: {
      items,
    },
  };
}
