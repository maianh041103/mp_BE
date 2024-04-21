import {PRODUCTS_CONCERN, SALES_CONCERN} from "./contant";
import {groupByField} from "./util";

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

export async function indexProductsReport(params) {
  switch (params.concern) {
    case PRODUCTS_CONCERN.SALE:
      return await getReportBySale(params);
    case PRODUCTS_CONCERN.WAREHOUSE_VALUE:
      return await getReportBySale(params);
    case PRODUCTS_CONCERN.INVENTORY:
      return await getReportBySale(params);
    case PRODUCTS_CONCERN.INVENTORY_DETAIL:
      return await getReportBySale(params);
    case PRODUCTS_CONCERN.CANCEL:
      return await getReportBySale(params);
    case PRODUCTS_CONCERN.CUSTOMER:
      return await getReportBySale(params);
  }
}

export async function getReportBySale(params) {
  const {
    limit = 20,
    page = 1,
    branchId,
    storeId,
    from,
    to,
    productIds
  } = params;
  let productWhere = {}
  let orderWhere = {}
  if (productIds) {
    productWhere.productId = {[Op.in]: productIds}
  }
  if (storeId) {
    productWhere.storeId = storeId
  }
  if (from && to) {
    orderWhere.createdAt = {
      [Op.and]: {
        [Op.gte]: moment(from).startOf("day"),
        [Op.lte]: moment(to).endOf("day")
      }
    }
  }
  const attributes = [
    [models.sequelize.literal('product.code'), 'title'],
    [models.sequelize.literal('product.code'), 'productCode'],
    [models.sequelize.literal('product.name'), 'productName'],
    [models.sequelize.literal('product.id'), 'productId'],
    [models.sequelize.literal('SUM(OrderProduct.quantity * productUnit.exchangeValue)'), 'totalSell'],
    [models.sequelize.literal('SUM(OrderProduct.price)-SUM(OrderProduct.discount)'), 'totalOrderPrice'],
    [models.sequelize.literal('0'), 'returnQuality'],
    [models.sequelize.literal('0'), 'returnValue'],
    [models.sequelize.literal('SUM(OrderProduct.price)-SUM(OrderProduct.discount)'), 'totalRevenue'],
  ]
  const summaryAttribute = [
    [models.sequelize.literal('SUM(OrderProduct.quantity * productUnit.exchangeValue)'), 'totalSell'],
    [models.sequelize.literal('SUM(OrderProduct.price)-SUM(OrderProduct.discount)'), 'totalOrderPrice'],
    [models.sequelize.literal('0'), 'returnQuality'],
    [models.sequelize.literal('0'), 'returnValue'],
    [models.sequelize.literal('SUM(OrderProduct.price)-SUM(OrderProduct.discount)'), 'totalRevenue'],
  ]
  const includes = [
    {
      model: models.ProductUnit,
      attributes: [],
      as: 'productUnit'
    },
    {
      model: models.Product,
      attributes: [],
      as: 'product'
    },
    {
      model: models.Order,
      attributes: [],
      as: 'order',
      where: {
        branchId
      }
    },
  ]
  const [items, count] = await Promise.all([
    models.OrderProduct.findAll({
      attributes: attributes,
      include: includes,
      group: ['product.code'],
      offset: +limit * (+page - 1),
      limit: +limit,
      where: orderWhere,
      order: [[models.sequelize.literal('SUM(OrderProduct.price)-SUM(OrderProduct.discount)'), 'DESC']]
    }),
    await models.OrderProduct.count({
      include: includes,
      where: orderWhere,
      group: ['product.code']
    })
  ])
  const summaryObj = await models.OrderProduct.findAll({
    attributes: summaryAttribute,
    include: includes,
    where: orderWhere,
  })
  const summary = summaryObj[0]
  return {
    success: true,
    data: {
      items: items,
      summary: {totalCount: count.length, ...summary.dataValues}
    }
  };
}

export async function getReportByWarehouseValue(params) {
  const {
    limit = 20,
    page = 1,
    branchId,
    storeId,
    from,
    to,
    productIds
  } = params;
  let productWhere = {}
  let orderWhere = {}
  if (productIds) {
    productWhere.productId = {[Op.in]: productIds}
  }
  if (storeId) {
    productWhere.storeId = storeId
  }
  if (from && to) {
    orderWhere.createdAt = {
      [Op.and]: {
        [Op.gte]: moment(from).startOf("day"),
        [Op.lte]: moment(to).endOf("day")
      }
    }
  }
  const attributes = [
    [models.sequelize.literal('product.code'), 'title'],
    [models.sequelize.literal('product.code'), 'productCode'],
    [models.sequelize.literal('product.name'), 'productName'],
    [models.sequelize.literal('product.id'), 'productId'],
    [models.sequelize.literal('SUM(OrderProduct.quantity * productUnit.exchangeValue)'), 'totalSell'],
    [models.sequelize.literal('SUM(OrderProduct.price)-SUM(OrderProduct.discount)'), 'totalOrderPrice'],
    [models.sequelize.literal('0'), 'returnQuality'],
    [models.sequelize.literal('0'), 'returnValue'],
    [models.sequelize.literal('SUM(OrderProduct.price)-SUM(OrderProduct.discount)'), 'totalRevenue'],
  ]
  const summaryAttribute = [
    [models.sequelize.literal('SUM(OrderProduct.quantity * productUnit.exchangeValue)'), 'totalSell'],
    [models.sequelize.literal('SUM(OrderProduct.price)-SUM(OrderProduct.discount)'), 'totalOrderPrice'],
    [models.sequelize.literal('0'), 'returnQuality'],
    [models.sequelize.literal('0'), 'returnValue'],
    [models.sequelize.literal('SUM(OrderProduct.price)-SUM(OrderProduct.discount)'), 'totalRevenue'],
  ]
  const includes = [
    {
      model: models.ProductUnit,
      attributes: [],
      as: 'productUnit'
    },
    {
      model: models.Product,
      attributes: [],
      as: 'product'
    },
    {
      model: models.Order,
      attributes: [],
      as: 'order',
      where: {
        branchId
      }
    },
  ]
  const [items, count] = await Promise.all([
    models.OrderProduct.findAll({
      attributes: attributes,
      include: includes,
      group: ['product.code'],
      offset: +limit * (+page - 1),
      limit: +limit,
      where: orderWhere,
      order: [[models.sequelize.literal('SUM(OrderProduct.price)-SUM(OrderProduct.discount)'), 'DESC']]
    }),
    await models.OrderProduct.count({
      include: includes,
      where: orderWhere,
      group: ['product.code']
    })
  ])
  const summaryObj = await models.OrderProduct.findAll({
    attributes: summaryAttribute,
    include: includes,
    where: orderWhere,
  })
  const summary = summaryObj[0]
  return {
    success: true,
    data: {
      items: items,
      summary: {totalCount: count.length, ...summary.dataValues}
    }
  };
}