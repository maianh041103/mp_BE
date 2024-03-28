import {getNextValue} from "./productCodeService";

const moment = require("moment");
const {
  promotionProgramToCustomerFilter,
} = require("../promotionProgram/promotionToCustomerService");
const {
  promotionProgramToProductFilter,
} = require("../promotionProgram/promotionToProductService ");
const {
  productToCustomerPercentDiscountFilter,
} = require("../promotionProgram/productToCustomerPercentDiscountService");
const {
  productStatisticFilter,
} = require("../productStatistic/productStatisticService");
const { createUserTracking } = require("../behavior/behaviorService");
const Sequelize = require("sequelize");
const _ = require("lodash");
const { Op } = Sequelize;
const models = require("../../../database/models");
const {
  checkUniqueValue,
  formatEndDateTime,
  removeDiacritics,
} = require("../../helpers/utils");
const {
  productStatuses,
  productTypes,
  productTypeCharacters,
} = require("./productConstant");
const {
  customerType,
  customerStatus,
} = require("../customer/customerConstant");
const { HttpStatusCode } = require("../../helpers/errorCodes");
const { accountTypes, logActions } = require("../../helpers/choices");

export const productIncludes = [
  {
    model: models.Image,
    as: "image",
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
  {
    model: models.Manufacture,
    as: "productManufacture",
    attributes: ["id", "name"],
  },
  {
    model: models.Dosage,
    as: "productDosage",
    attributes: ["id", "name"],
  },
  {
    model: models.Position,
    as: "productPosition",
    attributes: ["id", "name"],
  },
  {
    model: models.CountryProduce,
    as: "country",
    attributes: ["id", "name"],
  },
  {
    model: models.GroupProduct,
    as: "groupProduct",
    attributes: ["id", "name"],
  },
  {
    model: models.ProductCategory,
    as: "productCategory",
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
      "productId",
      "quantity",
      "code",
      "barCode",
      "isDirectSale",
      "isBaseUnit",
      "point",
    ],
  },
  // {
  //   model: models.Image,
  //   as: "images",
  //   through: {
  //     attributes: ["isThumbnail"],
  //     where: {
  //       modelName: "product",
  //     },
  //   },
  //   attributes: ["id", "originalName", "fileName", "filePath", "path"],
  // },
];

export const productAttributes = [
  "id",
  "name",
  "shortName",
  "code",
  "barCode",
  "groupProductId",
  "productCategoryId",
  "imageId",
  "dosageId",
  "manufactureId",
  "positionId",
  "countryId",
  "primePrice",
  "price",
  "weight",
  "warningExpiryDate",
  "warningExpiryText",
  "isDirectSale",
  "registerNumber",
  "activeElement",
  "content",
  "packingSpecification",
  "minInventory",
  "maxInventory",
  "description",
  "note",
  "baseUnit",
  "inventory",
  "quantitySold",
  "storeId",
  "branchId",
  "type",
  "isLoyaltyPoint",
  "isBatchExpireControl",
  "expiryPeriod",
  "status",
  "createdAt",
  "drugCode"
];

export async function queryFilter(params) {
  const {
    page = 1,
    limit = 20,
    keyword = "",
    name = "",
    type,
    status,
    productCategoryId,
    groupProductId,
    statusArray = [],
    unitId,
    manufactureId,
    notEqualManufactureId,
    listProductId = [],
    notEqualId,
    order = [["id", "DESC"]],
    tag,
    newest,
    bestseller,
    az,
    za,
    price,
    include = productIncludes,
    attributes = productAttributes,
    raw = false,
    branchId,
    storeId,
    isSale,
  } = params;

  const query = {
    offset: +limit * (+page - 1),
    limit: +limit,
    order,
  };

  if (raw) query.raw = true;

  if (_.isArray(include) && include.length) {
    query.include = include;
    if (!isSale) {
      for (const item of query.include) {
        if (item.as === "productUnit") {
          query.order = [
            [models.ProductUnit, "exchangeValue", "DESC"],
            ...query.order,
          ];
        }
      }
    }
  }

  if (_.isArray(attributes) && attributes.length) {
    query.attributes = attributes;
  }

  if (_.isArray(order) && order.length) {
    query.order = order;
  }

  const where = {};

  if (storeId) {
    where.storeId = storeId;
  }

  if (branchId) {
    where.branchId = branchId;
  }

  if (type) {
    where.type = type;
  }

  if (status) {
    where.status = status;
  }

  if (groupProductId) {
    where.groupProductId = groupProductId;
  }

  if (productCategoryId) {
    where.productCategoryId = productCategoryId;
  }

  if (notEqualId) {
    where.id = {
      [Op.ne]: notEqualId,
    };
  }

  if (notEqualManufactureId) {
    where.manufactureId = {
      [Op.ne]: notEqualManufactureId,
    };
  }

  if (_.isArray(statusArray) && statusArray.length) {
    where.status = {
      [Op.in]: statusArray,
    };
  }

  if (_.isArray(unitId) && unitId.length) {
    where.unitId = {
      [Op.in]: unitId,
    };
  }

  if (_.isArray(manufactureId) && manufactureId.length) {
    where.manufactureId = {
      [Op.in]: manufactureId,
    };
  }

  if (_.isArray(listProductId) && listProductId.length) {
    where.id = listProductId;
  }

  if (tag) {
    const tagToProducts = await tagToProductFilter({ tag });
    where.id = tagToProducts;
  }

  if (keyword) {
    where[Op.or] = {
      name: {
        [Op.like]: `%${keyword.trim()}%`,
      },
      slug: {
        [Op.like]: `%${keyword.trim()}%`,
      },
      code: {
        [Op.like]: `%${keyword.trim()}%`,
      },
    };
  }

  if (name) {
    where[Op.or] = {
      name: {
        [Op.like]: `%${keyword.trim()}%`,
      },
    };
  }

  if (newest) {
    query.order = [["id", "DESC"]];
  } else if (bestseller) {
    where.id = _.get(
      await productStatisticFilter({
        limit: 20,
        orderBy: [["sold", "DESC"]],
      }),
      "statistics",
      []
    ).map((o) => o.productId);
  } else if (az) {
    query.order = [["name", "ASC"]];
  } else if (za) {
    query.order = [["name", "DESC"]];
  } else if (price == "desc") {
    query.order = [["cost", "DESC"]];
  } else if (price == "asc") {
    query.order = [["cost", "ASC"]];
  }

  query.where = where;

  return query;
}

export async function productFilter(params) {
  try {
    return await models.Product.findAll(await queryFilter(params));
  } catch (e) {
    console.log(e);
    return [];
  }
}

export async function countProduct(query) {
  try {
    delete query.order;
    delete query.include;
    query.attributes = ["id"];
    query.raw = true;
    return await models.Product.count(query);
  } catch (e) {
    console.log(e);
    return 0;
  }
}

export async function indexProducts(params) {
  const query = await queryFilter(params);
  const [items, count] = await Promise.all([
    models.Product.findAll(query),
    countProduct(query),
  ]);
  for (const item of items) {
    if (!params.isSale) {
      item.dataValues.batches = [];
      continue;
    }
    const productBatches = await models.ProductToBatch.findAll({
      attributes: [
        "id",
        "storeId",
        "branchId",
        "productId",
        "batchId",
        "productUnitId",
        "quantity",
        "expiryDate",
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
            "quantity",
            "isBaseUnit",
          ],
          where: {
            branchId: item.branchId,
            storeId: item.storeId,
          },
        },
      ],
      where: {
        productId: item.id,
      },
      order: [["expiryDate", "ASC"]],
    });
    const batches = [];
    for (const pb of productBatches) {
      batches.push({
        id: pb.id,
        storeId: pb.storeId,
        batchId: pb.batchId,
        name: pb.dataValues.batch.name,
        productUnit: pb.dataValues.productUnit,
        productId: pb.productId,
        quantity: pb.quantity,
        expiryDate: pb.expiryDate,
      });
    }
    item.dataValues.batches = batches;
  }
  return {
    success: true,
    data: {
      items,
      totalItem: count,
    },
  };
}
function getCode(type) {
  switch (type) {
    case productTypes.THUOC:
      return  productTypeCharacters.THUOC;
    case productTypes.HANGHOA:
      return  productTypeCharacters.HANGHOA;
    case productTypes.COMBO:
      return  productTypeCharacters.COMBO;
    case productTypes.DONTHUOC:
      return  productTypeCharacters.DONTHUOC;
    default:
      return  "";
  }
}
function generateProductCode(type, no) {
  const code = getCode(type);
  if (no <= 0) return `${code}000000000`;
  if (no < 10) return `${code}00000000${no}`;
  if (no < 100) return `${code}0000000${no}`;
  if (no < 1000) return `${code}000000${no}`;
  if (no < 10000) return `${code}00000${no}`;
  if (no < 100000) return `${code}0000${no}`;
  if (no < 1000000) return `${code}000${no}`;
  if (no < 10000000) return `${code}00${no}`;
  if (no < 100000000) return `${code}0${no}`;
  if (no < 1000000000) return `${code}${no}`;
  return no;
}

export async function createProduct(product, loginUser) {
  if (product.code) {
    const checkUniqueCode = await checkUniqueValue("Product", {
      code: product.code,
      branchId: product.branchId,
      storeId: product.storeId,
    });
    if (!checkUniqueCode) {
      return {
        error: true,
        code: HttpStatusCode.BAD_REQUEST,
        message: `Mã hàng ${product.code} đã tồn tại.`,
      };
    }
  }

  if (product.barCode) {
    product.barCode = removeDiacritics(product.barCode);
    const checkUniqueBarCode = await checkUniqueValue("Product", {
      barCode: product.barCode,
      branchId: product.branchId,
      storeId: product.storeId,
    });
    if (!checkUniqueBarCode) {
      return {
        error: true,
        code: HttpStatusCode.BAD_REQUEST,
        message: `Mã vạch ${product.barCode} đã tồn tại.`,
      };
    }
  }

  const findBranch = await models.Branch.findOne({
    attributes: ["id", "storeId"],
    where: {
      id: product.branchId,
      storeId: product.storeId,
    },
  });
  if (!findBranch) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: `Branch có id = ${product.branchId} không tồn tại.`,
    };
  }

  const newProduct = await models.Product.create({
    ...product,
    ...(product.type === productTypeCharacters.THUOC && {
      isBatchExpireControl: true,
    }),
  });

  if (!product.code) {
    const nextValue = await getNextValue(product.storeId, product.type)
    const code = generateProductCode(product.type, nextValue)
    product.code = code
    if (!product.barCode) {
        product.barCode = code
    }
    await models.Product.update(
      { code: code, barCode: product.barCode },
      { where: { id: newProduct.id } }
    );
  }

  // add product units
  const productUnits = _.get(product, "productUnits", []).map((item) => ({
    productId: newProduct.id,
    unitName: item.unitName,
    exchangeValue: item.exchangeValue,
    price: item.price,
    isDirectSale: item.isDirectSale || false,
    isBaseUnit: item.isBaseUnit || false,
    quantity: item.quantity || 0,
    code: item.code || item.code,
    barCode: item.barCode || "",
    point: item.point || 0,
    branchId: product.branchId,
    storeId: product.storeId,
    createdBy: loginUser.id,
  }));
  for (const productUnit of productUnits) {
    if (productUnit.isBaseUnit) {
      if (!productUnit.code) {
        productUnit.code = product.code
        if (!productUnit.barCode) {
          productUnit.barCode = productUnit.code
        }
      }
    } else {
      if (!productUnit.code) {
        const nextValue = await getNextValue(product.storeId, product.type)
        productUnit.code = generateProductCode(product.type, nextValue)
        if (!productUnit.barCode) {
          productUnit.barCode = productUnit.code
        }
      }
    }
  }
  await models.ProductUnit.bulkCreate(productUnits);
  // sendTelegram({ message: 'Tạo thành công sản phẩm:' + JSON.stringify(newProduct) });

  createUserTracking({
    accountId: loginUser.id,
    type: accountTypes.USER,
    objectId: newProduct.id,
    action: logActions.product_create.value,
    data: product,
  });

  return {
    success: true,
    data: newProduct,
  };
}

export async function indexProductCombo(params, loginUser) {
  const { siteId, siteIds = [] } = params;
  const where = {};
  if (_.isArray(siteIds) && siteIds.length) {
    let isNull = false;
    for (let i = 0; i < siteIds.length; i++) {
      if (siteIds[i] == 0) {
        isNull = true;
      }
    }
    let whereSiteId = {
      [Op.in]: siteIds,
    };
    if (isNull) {
      whereSiteId = {
        [Op.or]: {
          [Op.in]: siteIds,
          [Op.eq]: null,
        },
      };
    }
    where.siteId = whereSiteId;
  } else if (siteId) {
    where.siteId = {
      [Op.or]: [
        {
          [Op.eq]: siteId,
        },
        {
          [Op.eq]: null,
        },
      ],
    };
  }
  // get list of product and combo
  const p = models.Product.findAll({
    include: [
      {
        model: models.ProductGroup,
        as: "group",
        attributes: ["id", "name"],
      },
    ],
    attributes: [
      "id",
      "name",
      "code",
      "price",
      "siteId",
      "endMonth",
      "endDate",
    ],
    where: {
      ...where,
      status: productStatuses.ACTIVE,
    },
  });
  const c = models.Combo.findAll({
    include: [
      {
        model: models.Product,
        as: "products",
        attributes: [
          "id",
          "name",
          "code",
          "endMonth",
          "endDate",
          [Sequelize.literal("`products->ProductCombo`.price"), "price"],
        ],
        include: [
          {
            model: models.ProductGroup,
            as: "group",
            attributes: ["id", "name"],
          },
        ],
        through: {
          attributes: ["price"],
        },
      },
    ],
    attributes: ["id", "name", "code", "siteId"],
    where: {
      ...where,
      status: productStatuses.ACTIVE,
    },
  });
  const [products = [], combos = []] = await Promise.all([p, c]);
  return {
    products,
    combos,
  };
}

// update one product
export async function updateProduct(id, product, loginUser) {
  const findProduct = await models.Product.findOne({
    where: {
      id,
      storeId: loginUser.storeId,
    },
  });

  if (!findProduct) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Không tồn tại sản phẩm.",
    };
  }

  if (product.code) {
    const checkUniqueCode = await checkUniqueValue("Product", {
      code: product.code,
      branchId: product.branchId,
      storeId: product.storeId,
      id: {
        [Op.ne]: findProduct.id,
      },
    });
    if (!checkUniqueCode) {
      return {
        error: true,
        code: HttpStatusCode.BAD_REQUEST,
        message: `Mã hàng ${product.code} đã tồn tại.`,
      };
    }
  }

  if (product.barCode) {
    product.barCode = removeDiacritics(product.barCode);
    const checkUniqueBarCode = await checkUniqueValue("Product", {
      barCode: product.barCode,
      branchId: product.branchId,
      storeId: product.storeId,
      id: {
        [Op.ne]: findProduct.id,
      },
    });
    if (!checkUniqueBarCode) {
      return {
        error: true,
        code: HttpStatusCode.BAD_REQUEST,
        message: `Mã vạch ${product.barCode} đã tồn tại.`,
      };
    }
  }

  await models.Product.update(product, {
    where: {
      id,
    },
  });

  // upsert product units
  const productUnits = _.get(product, "productUnits", []);
  const updatedProductUnits = [];
  for (const item of productUnits) {
    const upsertPayload = {
      productId: id,
      unitName: item.unitName,
      exchangeValue: item.exchangeValue,
      price: item.price,
      isDirectSale: item.isDirectSale || false,
      isBaseUnit: item.isBaseUnit || false,
      code: item.code || "",
      barCode: item.barCode || "",
      point: item.point || 0,
      branchId: findProduct.branchId,
      storeId: findProduct.storeId,
      createdBy: loginUser.id,
    };
    if (item.id) {
      await models.ProductUnit.update(upsertPayload, {
        where: {
          id: item.id,
        },
      });
    } else {
      const instance = await models.ProductUnit.create(upsertPayload);
      item.id = instance.id;
    }
    if (item.isBaseUnit) {
      await models.ProductUnit.update(
        {
          isBaseUnit: false,
        },
        {
          where: {
            id: {
              [Op.ne]: item.id,
            },
            productId: id,
            branchId: findProduct.branchId,
            storeId: findProduct.storeId,
          },
        }
      );
    }
    updatedProductUnits.push(item.id);
  }

  if (updatedProductUnits.length) {
    await models.ProductUnit.update(
      {
        deletedAt: new Date(),
      },
      {
        where: {
          id: {
            [Op.notIn]: updatedProductUnits,
          },
          productId: id,
          branchId: findProduct.branchId,
          storeId: findProduct.storeId,
        },
      }
    );
  }

  createUserTracking({
    accountId: loginUser.id,
    type: accountTypes.USER,
    objectId: id,
    action: logActions.product_update.value,
    data: { id, ...product },
  });

  return {
    success: true,
  };
}

// get product detail
export async function getProductDetail(id) {
  const instance = await models.Product.findByPk(id, {
    include: productIncludes,
    attributes: productAttributes,
    raw: true,
  });
  if (!instance) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: "Không tồn tại sản phẩm",
    };
  }
  return {
    success: true,
    data: instance,
  };
}

export async function readProduct(id, loginUser) {
  const instance = await models.Product.findOne({
    include: productIncludes,
    attributes: productAttributes,
    where: {
      id: id,
      ...(loginUser && { storeId: loginUser.storeId }),
    },
  });

  if (!instance) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: "Không tồn tại sản phẩm",
    };
  }

  return {
    success: true,
    data: instance,
  };
}

export async function deleteProductById(id, loginUser) {
  // Chú ý xóa sản phẩm đang nằm trong chương trình chiết khấu diễn ra
  const product = await models.Product.findByPk(id, {
    attributes: ["id", "name"],
    // include: [{
    //     model: models.Combo,
    //     as: 'combos',
    //     through: {
    //         attributes: [],
    //     },
    // }],
  });

  if (!product) {
    return {
      error: true,
      id,
      code: HttpStatusCode.NOT_FOUND,
      message: "Không tồn tại sản phẩm",
    };
  }

  const { combos = [] } = product;
  if (!_.isEmpty(combos)) {
    return {
      error: true,
      id,
      code: HttpStatusCode.BAD_REQUEST,
      message: "Sản phẩm đang được sử dụng ở combo, không thể xóa",
    };
  }

  // Kiểm tra trong đơn hàng
  const findOrderProduct = await models.OrderProduct.findOne({
    include: [
      {
        model: models.Order,
        as: "order",
        attributes: ["id", "status"],
        where: {
          deletedAt: {
            [Op.ne]: null,
          },
        },
      },
    ],
    where: {
      // "$order.status$": {
      //   [Op.notIn]: [orderStatuses.CANCELLED, orderStatuses.SUCCEED],
      // },
      productId: product.id,
    },
  });
  if (findOrderProduct) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: "Sản phẩm đang được sử dụng ở đơn hàng, không thể xóa",
    };
  }

  // Kiểm tra phần nhập hàng
  const findProductInbound = await models.InboundToProduct.findOne({
    where: {
      productId: product.id,
    },
  });
  if (findProductInbound) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: "Sản phẩm đang được sử dụng ở nhập hàng, không thể xóa",
    };
  }

  // Kiểm tra phần trả hàng
  const findProductPurchase = await models.PurchaseReturnToProduct.findOne({
    where: {
      productId: product.id,
    },
  });
  if (findProductPurchase) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: "Sản phẩm đang được sử dụng ở nhập hàng, không thể xóa",
    };
  }

  await Promise.all([
    models.Product.destroy({ where: { id } }),
    models.ProductUnit.destroy({ where: { productId: id } }),
  ]);

  createUserTracking({
    accountId: loginUser.id,
    type: accountTypes.USER,
    objectId: product.id,
    action: logActions.product_delete.value,
    data: {
      id,
      name: product.name,
      storeId: loginUser.storeId,
      branchId: loginUser.branchId,
    },
  });

  return {
    success: true,
  };
}

export async function deleteManyProducts(ids = [], loginUser) {
  const processes = [];
  ids.forEach((id) => processes.push(deleteProductById(id)));
  const results = await Promise.all(processes);
  const errors = results.filter((r) => r.error);
  if (errors && errors.length) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: `Không xóa được các sản phẩm có id = ${errors
        .map((e) => e.id)
        .join()}`,
    };
  }
  return {
    success: true,
  };
}

// update product status
export async function updateproductStatuses(id, product, loginUser) {
  const findProduct = await models.Product.findOne({
    attributes: ["id", "status"],
    where: {
      id,
      storeId: loginUser.storeId,
    },
  });
  if (!findProduct) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Không tồn tại sản phẩm.",
    };
  }
  await models.Product.update(product, {
    where: {
      id,
    },
  });

  createUserTracking({
    accountId: loginUser.id,
    type: accountTypes.USER,
    objectId: id,
    action: logActions.product_update.value,
    data: { id, ...product },
  });

  return {
    success: true,
  };
}

export async function updateEndDateManyProducts(
  ids = [],
  endDate,
  endMonth,
  updatedBy
) {
  let formatEndDate = null;
  if (endDate) {
    // check and format endDate
    formatEndDate = formatEndDateTime(endDate);
    if (!formatEndDate) {
      return {
        error: true,
        code: HttpStatusCode.BAD_REQUEST,
        message: `Sai định dạng thời gian`,
      };
    }
  }
  ids = _.uniq(ids);
  if (ids.length == 0) {
    return {
      success: true,
    };
  }
  let dataUpdate = {
    updatedBy,
    endDate: formatEndDate,
    endMonth: endMonth,
  };
  if (endDate === "") {
    delete dataUpdate.endDate;
  }
  if (endMonth === "") {
    delete dataUpdate.endMonth;
  }
  await models.Product.update(dataUpdate, {
    where: {
      id: {
        [Op.in]: ids,
      },
    },
  });
  return {
    success: true,
  };
}

export async function hashProductPrice(params) {
  const { loginCustomer = {} } = params;
  try {
    const customerId = loginCustomer.id;
    if (
      !customerId ||
      !(
        loginCustomer.position === customerType.Company ||
        loginCustomer.position === customerType.Pharmacy ||
        loginCustomer.position === customerType.Clinic
      ) ||
      loginCustomer.status !== customerStatus.ACTIVE
    ) {
      return {};
    }

    const currentTime = moment();

    const promotionToCustomer = (
      await promotionProgramToCustomerFilter({
        customerId,
        time: currentTime,
      })
    ).map((o) => o.promotionId);

    const promotions = [...new Set(promotionToCustomer)];

    if (!promotions.length) {
      return {};
    }

    const products = (
      await promotionProgramToProductFilter({
        promotionId: promotions,
      })
    ).map((o) => o.productId);

    if (!products.length) {
      return {};
    }

    const productPriceToCustomer = {};
    const productPrice = await productToCustomerPercentDiscountFilter({
      customerId,
      productId: products,
      time: currentTime,
    });

    for (let item of productPrice) {
      if (productPriceToCustomer[item.productId]) continue;
      productPriceToCustomer[item.productId] = item.percentDiscount;
    }

    return productPriceToCustomer;
  } catch (e) {
    console.log(e);
    return {};
  }
}

/*
    Xác định 2 loại giá:
    KH thường: 
        + Giá bán lẻ đề xuất 
    KH vip: 
        + Giá gốc 
        + Giảm giá or giá chiết khấu 
    Note: Giá bán lẻ đề xuất > Giá gốc  > Giảm giá or giá chiết khấu 
*/
export async function extractFieldProduct(
  products,
  hashPrice,
  loginCustomer = {}
) {
  try {
    let items = [];
    for (let item of products) {
      // if (
      //   loginCustomer.status === customerStatus.ACTIVE &&
      //   (loginCustomer.position === customerType.Company ||
      //     loginCustomer.position === customerType.Pharmacy ||
      //     loginCustomer.position === customerType.Clinic)
      // ) {
      //   if (hashPrice[item.dataValues.id]) {
      //     item.dataValues.price =
      //       Math.round(
      //         (+item.dataValues.cost -
      //           +item.dataValues.cost *
      //             (+hashPrice[item.dataValues.id] / 100)) /
      //           1000,
      //         2
      //       ) * 1000;
      //     item.dataValues.percentDiscount = +hashPrice[item.dataValues.id];
      //   } else {
      //     item.dataValues.price = item.dataValues.discountPrice
      //       ? +item.dataValues.discountPrice
      //       : +item.dataValues.cost;
      //     item.dataValues.percentDiscount = 0;
      //   }
      // } else {
      //   item.dataValues.price = +item.dataValues.cost;
      //   item.dataValues.retailPrice = null;
      //   item.dataValues.percentDiscount = 0;
      //   item.dataValues.cost = null;
      // }
      item.dataValues.price = +item.dataValues.cost;
      item.dataValues.retailPrice = null;
      item.dataValues.percentDiscount = 0;
      item.dataValues.cost = null;
      delete item.dataValues.discountPrice;
      items.push(item.dataValues);
    }
    return items;
  } catch (e) {
    console.log("PRICE ===================>", e);
    return [];
  }
}

export async function randomProducts(params) {
  const { limit = 24, notEqualId } = params;
  const where = {};
  if (notEqualId) {
    where.id = {
      [Op.ne]: notEqualId,
    };
  }
  const products = (
    await models.Product.findAll({
      attributes: ["id"],
      where,
      raw: true,
    })
  ).map((o) => o.id);
  const arr = [];
  for (let i = 0; i < +limit; i++) {
    let index = Math.floor(Math.random() * products.length);
    if (arr.indexOf(products[index]) === -1) arr.push(products[index]);
  }

  return arr;
}