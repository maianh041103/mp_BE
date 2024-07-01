import { getNextValue } from "./productCodeService";
import { addInventory, getInventory, newInventory } from "../inventory/inventoryService";
import { raiseBadRequestError } from "../../helpers/exception";
import { createWarehouseCard } from "../warehouse/warehouseService";
import { warehouseStatus } from "../warehouse/constant";

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
const { productIncludes, productAttributes } = require("./constant")
const { queryFilter } = require("./filter")
const generateCode = require("../../helpers/codeGenerator");

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
    const invInclude = query.include.find(x => x.as === 'inventories')
    delete query.order
    delete query.include
    if (invInclude) {
      query.include = [invInclude];
    }
    query.attributes = ["id"]
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
    countProduct(query)
  ]);
  for (const item of items) {
    item.dataValues.inventory = parseInt(await getInventory(params.branchId, item.id));
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
      return productTypeCharacters.THUOC;
    case productTypes.HANGHOA:
      return productTypeCharacters.HANGHOA;
    case productTypes.COMBO:
      return productTypeCharacters.COMBO;
    case productTypes.DONTHUOC:
      return productTypeCharacters.DONTHUOC;
    default:
      return "";
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
  let newProduct
  await models.sequelize.transaction(async (t) => {

    newProduct = await models.Product.create({
      ...product,
      ...(product.type === productTypeCharacters.THUOC && {
        isBatchExpireControl: true,
      }),
    }, { transaction: t });
    await newInventory(product.branchId, newProduct.id, product.inventory, t)
    if (product.inventory) {
      await createWarehouseCard({
        code: "",
        type: warehouseStatus.ADJUSTMENT,
        partner: "",
        productId: newProduct.id,
        branchId: product.branchId,
        changeQty: product.inventory,
        remainQty: product.inventory,
        createdAt: new Date(),
        updatedAt: new Date()
      }, t)
    }
    if (!product.code) {
      const nextValue = await getNextValue(product.storeId, product.type)
      const code = generateProductCode(product.type, nextValue)
      product.code = code
      if (!product.barCode) {
        product.barCode = code
      }
      await models.Product.update(
        { code: code, barCode: product.barCode },
        { where: { id: newProduct.id }, transaction: t }
      );
    }

    //Tạo mới kiểm kho
    let newInventoryCheking = await models.InventoryChecking.create({
      userCreateId: product.createdBy,
      branchId: product.branchId
    }, {
      transaction: t
    });
    await models.InventoryChecking.update({
      code: generateCode.generateCode("KK", newInventoryCheking.id)
    }, {
      where: {
        id: newInventoryCheking.id
      },
      transaction: t
    });
    //End tạo mới kiểm kho

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
      storeId: product.storeId,
      createdBy: loginUser.id,
    }));
    for (const productUnit of productUnits) {
      if (productUnit.isBaseUnit) {
        productUnit.code = product.code
        productUnit.barCode = product.barCode
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
    for (const productUnit of productUnits) {
      const newProductUnit = await models.ProductUnit.create(productUnit, {
        transaction: t
      });
      if (newProductUnit.isBaseUnit == true) {
        await models.InventoryCheckingProduct.create({
          inventoryCheckingId: newInventoryCheking.id,
          productUnitId: newProductUnit.id,
          realQuantity: product.inventory,
          difference: product.inventory
        }, {
          transaction: t
        })
      }
    }
    // sendTelegram({ message: 'Tạo thành công sản phẩm:' + JSON.stringify(newProduct) });
  })
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
  await models.sequelize.transaction(async (t) => {
    if (product.inventory) {
      const inventory = await getInventory(product.branchId, id)
      const change = product.inventory - inventory;
      if (change) {
        await addInventory(product.branchId, id, change, t)
        if (product.inventory) {
          await createWarehouseCard({
            code: "",
            type: warehouseStatus.ADJUSTMENT,
            partner: "",
            productId: id,
            branchId: product.branchId,
            changeQty: product.inventory,
            remainQty: product.inventory,
            createdAt: new Date(),
            updatedAt: new Date()
          }, t)
        }
      }

    }
    await models.Product.update(product, {
      where: {
        id,
      }, transaction: t
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
        code: item.isBaseUnit ? product.code : (item.code || ""),
        barCode: item.isBaseUnit ? product.barCode : (item.barCode || ""),
        point: item.point || 0,
        branchId: findProduct.branchId,
        storeId: findProduct.storeId,
        createdBy: loginUser.id,
      };
      if (item.id) {
        await models.ProductUnit.update(upsertPayload, {
          where: {
            id: item.id,
          }, transaction: t
        });
      } else {
        const instance = await models.ProductUnit.create(upsertPayload);
        item.id = instance.id;
        if (!instance.code) {
          const nextValue = await getNextValue(product.storeId, product.type)
          item.code = generateProductCode(product.type, nextValue)
        }
        if (!instance.barCode) {
          item.barCode = item.code
        }
        await models.ProductUnit.update({ code: item.code, barCode: item.barCode }, { where: { id: item.id }, transaction: t })
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
            }, transaction: t
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
          }, transaction: t
        }
      );
    }

  })

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

export async function indexInventory(id, storeId) {
  const inventories = await models.Inventory.findAll({
    where: { productId: id },
    attributes: ["id", "quantity", "productId", "branchId"],
    include: [
      {
        model: models.Branch,
        as: "branch",
        attributes: ["id", "name", "code"]
      }
    ]
  })
  return {
    success: true,
    data: inventories
  }
}

export async function getProduct(id) {
  const product = await models.Product.findOne({
    where: {
      id: id
    }
  })
  if (!product) {
    raiseBadRequestError("Không tìm thấy sản phẩm")
  }
  return product
}

export async function findProduct(keyword, page, limit) {
  const where = {}
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

  return await models.Product.findAll({
    where: where,
    offset: +limit * (+page - 1),
    limit: +limit,
    order: [["id", "DESC"]],
  })
}