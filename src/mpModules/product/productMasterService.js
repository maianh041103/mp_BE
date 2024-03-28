const { PAGE_LIMIT } = require("../../helpers/choices");
const Sequelize = require("sequelize");
const _ = require("lodash");
const { Op } = Sequelize;
const models = require("../../../database/models");
const {
  productIncludes,
  productAttributes,
  queryFilter,
} = require("./productService");
const { formatDecimalTwoAfterPoint } = require("../../helpers/utils");

const ignoreAliasModels = ["store", "branch"];

export const productMasterIncludes = [
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
  },
];

export async function cumulativeQuantityTotal(storeId, branchId, productId) {
  const [findAllProductMasters, findAllProductUnits] = await Promise.all([
    models.ProductMaster.findAll({
      attributes: [
        "storeId",
        "branchId",
        "productId",
        "productUnitId",
        "quantity",
      ],
      where: {
        storeId,
        branchId,
        productId,
      },
    }),
    models.ProductUnit.findAll({
      where: {
        storeId,
        branchId,
        productId,
      },
    }),
  ]);
  const productUnitMapping = {};
  findAllProductUnits.forEach((item) => {
    productUnitMapping[`${productId}_${item.id}`] = item.exchangeValue;
  });

  let totalQuantityBaseUnits = 0;
  findAllProductMasters.forEach((item) => {
    totalQuantityBaseUnits +=
      item.quantity *
      (productUnitMapping[`${productId}_${item.productUnitId}`] || 1);
  });
  return totalQuantityBaseUnits;
}

export async function indexMasterSaleProducts(params) {
  const limit = +params.limit || 10;
  const page = +params.page || 1;
  const { storeId, branchId } = params;
  const where = {};
  if (storeId) {
    where.storeId = storeId;
  }

  if (branchId) {
    where.branchId = branchId;
  }
  if (params.keyword) {
    const keyword = params.keyword
    where.code = {[Op.like]: `%${keyword.trim()}%`}
    const _products = await models.Product.findAll({
      attributes: ['id'],
      where: {
        [Op.or]: {
          name: {
            [Op.like]: `%${keyword.trim()}%`,
          },
          slug: {
            [Op.like]: `%${keyword.trim()}%`,
          }
        }
      }
    })
    const productIds = _products.map(x => x.id)
    where[Op.or] = {
      code: {
        [Op.like]: `%${keyword.trim()}%`,
      },
      productId: {
        [Op.in]: productIds
      }
    } }

  const [items, count] = await Promise.all([
    models.ProductUnit.findAll({
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
        "storeId",
        "branchId",
      ],
      include: [
        {
          model: models.Product,
          as: "product",
          attributes: productAttributes,
          include: [
            ...productIncludes.filter(
              (productInclude) => !ignoreAliasModels.includes(productInclude.as)
            ),
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
          ],
        },
        ...productMasterIncludes,
      ],
      where,
      offset: limit * (page - 1),
      limit,
      order: [
        ["productId", "DESC"],
        ["exchangeValue", "DESC"],
      ],
    }),
    models.ProductUnit.count({ where }),
  ]);

  for (const item of items) {
    item.dataValues.productUnit = {
      id: item.id,
      unitName: item.unitName,
      exchangeValue: item.exchangeValue,
      price: item.price,
      productId: item.productId,
      code: item.code,
      barCode: item.barCode,
      isDirectSale: item.isDirectSale,
      isBaseUnit: item.isBaseUnit,
      point: item.point,
    };
    item.dataValues.quantity = parseInt(
      item.product.inventory / item.exchangeValue
    );

    if (!params.isSale) {
      item.dataValues.batches = [];
      continue;
    }
    // Trả về tất cả lô của sản phẩm
    const findAllProductToBatches = await models.ProductToBatch.findAll({
      attributes: ["batchId", "productUnitId", "quantity", "expiryDate"],
      include: [
        {
          model: models.Batch,
          as: "batch",
          attributes: ["id", "name"],
        },
        {
          model: models.ProductUnit,
          as: "productUnit",
          attributes: [
            "id",
            "unitName",
            "exchangeValue",
            "price",
            "isBaseUnit",
          ],
        },
      ],
      where: {
        storeId: item.storeId,
        branchId: item.branchId,
        productId: item.productId,
      },
      order: [["expiryDate", "ASC"]],
    });

    const batchInfoMapping = {};
    const batchInfos = [];
    for (const batchInstance of findAllProductToBatches) {
      if (batchInfoMapping[batchInstance.batchId]) {
        batchInfoMapping[batchInstance.batchId].quantity +=
          +formatDecimalTwoAfterPoint(
            (batchInstance.quantity * batchInstance.productUnit.exchangeValue) /
              batchInfoMapping[batchInstance.batchId].productUnit.exchangeValue
          );
      } else {
        batchInfoMapping[batchInstance.batchId] = {
          batchId: batchInstance.batchId,
          productUnitId: batchInstance.productUnitId,
          quantity: batchInstance.quantity,
          expiryDate: batchInstance.expiryDate,
          batch: batchInstance.batch,
          productUnit: batchInstance.productUnit,
        };
        batchInfos.push(batchInstance);
      }
    }

    item.dataValues.batches =
      batchInfos.map((obj) => {
        return batchInfoMapping[obj.batchId];
      }) || [];
  }

  return {
    success: true,
    data: {
      items,
      totalItem: count,
    },
  };
}

export async function indexMasterSaleProductsOld(params) {
  const queryProduct = await queryFilter(params);
  delete queryProduct.include;
  queryProduct.attributes = ["id"];
  const products = await models.Product.findAll(queryProduct);
  const whereInProducts = products.map((prod) => prod.id);
  if (!whereInProducts.length) {
    return {
      success: true,
      data: {
        items: [],
        totalItem: 0,
      },
    };
  }

  const { storeId, branchId } = params;
  const where = {
    productId: {
      [Op.in]: whereInProducts,
    },
  };
  if (storeId) {
    where.storeId = storeId;
  }

  if (branchId) {
    where.branchId = branchId;
  }

  const items = await models.ProductMaster.findAll({
    attributes: [
      "id",
      "storeId",
      "branchId",
      "productId",
      "productUnitId",
      "quantity",
    ],
    include: [
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
        attributes: productAttributes,
        include: productIncludes.filter(
          (productInclude) => !ignoreAliasModels.includes(productInclude.as)
        ),
      },
      ...productMasterIncludes,
    ],
    where,
  });

  for (const item of items) {
    if (!params.isSale) {
      item.dataValues.batches = [];
      continue;
    }
    // Trả về tất cả lô của sản phẩm
    const batches = await models.ProductToBatch.findAll({
      attributes: ["batchId", "productUnitId", "quantity", "expiryDate"],
      include: [
        {
          model: models.Batch,
          as: "batch",
          attributes: ["id", "name"],
        },
        {
          model: models.ProductUnit,
          as: "productUnit",
          attributes: [
            "id",
            "unitName",
            "exchangeValue",
            "price",
            "isBaseUnit",
          ],
        },
      ],
      where: {
        storeId: item.storeId,
        branchId: item.branchId,
        productId: item.productId,
      },
      order: [["expiryDate", "ASC"]],
    });
    item.dataValues.batches = batches || [];
  }
  return {
    success: true,
    data: {
      items,
      totalItem: whereInProducts.length,
    },
  };
}

export async function indexMasterInboundProducts(params) {
  const limit = +params.limit || 10;
  const page = +params.page || 1;
  const { storeId, branchId } = params;
  const where = {};
  if (storeId) {
    where.storeId = storeId;
  }

  if (branchId) {
    where.branchId = branchId;
  }
  if (params.keyword) {
    const keyword = params.keyword
    where.code = {[Op.like]: `%${keyword.trim()}%`}
    const _products = await models.Product.findAll({
      attributes: ['id'],
      where: {
        [Op.or]: {
          name: {
            [Op.like]: `%${keyword.trim()}%`,
          },
          slug: {
            [Op.like]: `%${keyword.trim()}%`,
          }
        }
      }
    })
    const productIds = _products.map(x => x.id)
    where[Op.or] = {
      code: {
        [Op.like]: `%${keyword.trim()}%`,
      },
      productId: {
        [Op.in]: productIds
      }
  } }
  const {rows, count} = await models.ProductUnit.findAndCountAll({
      attributes: ["id",
        "unitName",
        "exchangeValue",
        "price",
        "productId",
        "code",
        "barCode",
        "isDirectSale",
        "isBaseUnit",
        "point",
        "storeId",
        "branchId",
          "createdAt"
      ],
      include: [
        {
          model: models.Product,
          as: "product",
          attributes: productAttributes,
          include: productIncludes.filter(
              (productInclude) => !ignoreAliasModels.includes(productInclude.as)
          ),
        },
        ...productMasterIncludes,
      ],
      where: where,
      offset: +limit * (+page - 1),
      limit: +limit,
    order: [["createdAt", "DESC"]]
    });
  for (const item of rows) {
    const totalQuantityBaseUnits = item.product.inventory
    item.dataValues.quantity = parseInt(totalQuantityBaseUnits / item.exchangeValue)
  }

  return {
    success: true,
    data: {
      items: rows
    },
  };
}

export async function detailMaster(query) {
  return  await models.ProductMaster.findOne({
    attributes: [
      "storeId",
      "branchId",
      "productId",
      "productUnitId",
      "quantity",
    ],
    where: {
      productUnitId: query.productUnitId
    }
  })
}
