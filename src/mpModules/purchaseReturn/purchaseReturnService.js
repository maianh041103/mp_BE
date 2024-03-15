const _ = require("lodash");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const models = require("../../../database/models");
const { readUser } = require("../user/userService");
const { readBranch } = require("../branch/branchService");
const { readSupplier } = require("../supplier/supplierService");
const { readBatch } = require("../batch/batchService");
const { readProductUnit } = require("../product/productUnitService");
const {
  purchaseReturnStatus,
} = require("../purchaseReturn/purchaseReturnConstant");
const {
  addFilterByDate,
  formatDecimalTwoAfterPoint,
} = require("../../helpers/utils");
const { HttpStatusCode } = require("../../helpers/errorCodes");
const { accountTypes, logActions } = require("../../helpers/choices");
const { createUserTracking } = require("../behavior/behaviorService");

const userAttributes = [
  "id",
  "username",
  "email",
  "fullName",
  "avatarId",
  "phone",
];

const purchaseReturnIncludes = [
  {
    model: models.Store,
    as: "store",
    attributes: ["id", "name", "phone", "address"],
  },
  {
    model: models.Branch,
    as: "branch",
    attributes: ["id", "name", "phone", "code", "zipCode", "isDefaultBranch"],
  },
  {
    model: models.User,
    as: "user",
    attributes: userAttributes,
  },
  {
    model: models.User,
    as: "creator",
    attributes: userAttributes,
  },
  {
    model: models.Supplier,
    as: "supplier",
    attributes: [
      "id",
      "name",
      "phone",
      "email",
      "code",
      "taxCode",
      "provinceId",
      "districtId",
      "wardId",
      "address",
      "companyName",
      "groupSupplierId",
      "storeId",
      "note",
      "createdAt",
    ],
    include: [
      {
        model: models.GroupSupplier,
        as: "groupSupplier",
        attributes: ["id", "name", "description", "storeId"],
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
    ],
  },
];

const purchaseReturnAttributes = [
  "id",
  "code",
  "description",
  "userId",
  "storeId",
  "branchId",
  "totalPrice",
  "paid",
  "debt",
  "discount",
  "supplierId",
  "status",
  "createdAt",
];

const productAttributes = [
  "name",
  "shortName",
  "code",
  "barCode",
  "imageId",
  "isBatchExpireControl",
];

const purchaseReturnProductIncludes = [
  {
    model: models.Product,
    as: "product",
    attributes: productAttributes,
    include: [
      {
        model: models.Image,
        as: "image",
        attributes: ["id", "originalName", "fileName", "filePath", "path"],
      },
    ],
  },
  {
    model: models.ProductBatchHistory,
    as: "productBatchHistories",
    attributes: [
      "id",
      "storeId",
      "branchId",
      "productId",
      "batchId",
      "productUnitId",
      "quantity",
      "expiryDate",
      "importPrice",
      "discount",
      "totalPrice",
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
        attributes: ["id", "unitName", "exchangeValue", "price", "isBaseUnit"],
      },
    ],
  },
];

export async function indexPurchaseReturns(params, loginUser) {
  const {
    page = 1,
    limit = 10,
    keyword = "",
    code = "",
    userId,
    branchId,
    storeId,
    createdAt = [],
    status,
    statuses = [],
    paymentType,
    creatorId,
    supplierId,
  } = params;

  const query = {
    attributes: purchaseReturnAttributes,
    offset: +limit * (+page - 1),
    include: purchaseReturnIncludes,
    limit: +limit,
    order: [["id", "DESC"]],
  };

  const where = {
    status: {
      [Op.ne]: purchaseReturnStatus.TRASH,
    },
  };

  if (storeId) {
    where.storeId = storeId;
  }

  if (branchId) {
    where.branchId = branchId;
  }

  if (status) {
    where.status = status;
  }

  if (code) {
    where.code = status;
  }

  if (keyword) {
    where.code = {
      [Op.like]: `%${keyword.trim()}%`,
    };
  }

  if (_.isArray(statuses) && statuses.length) {
    where.status = {
      [Op.in]: statuses,
    };
  }

  if (_.isArray(createdAt) && createdAt.length) {
    where.createdAt = addFilterByDate(createdAt);
  }

  if (paymentType) {
    where.paymentType = paymentType;
  }

  if (userId) {
    where.userId = userId;
  }

  if (creatorId) {
    where.createdBy = creatorId;
  }

  if (supplierId) {
    where.supplierId = supplierId;
  }

  if (params.dateRange) {
    try {
      const dateRange = JSON.parse(params.dateRange);
      const { startDate, endDate } = dateRange;
      where.createdAt = addFilterByDate([startDate, endDate]);
    } catch (e) {}
  }

  query.where = where;

  const [items, totalItem] = await Promise.all([
    models.PurchaseReturn.findAll(query),
    models.PurchaseReturn.count(query),
  ]);

  return {
    success: true,
    data: {
      items,
      totalItem,
    },
  };
}

export async function readPurchaseReturn(id, loginUser) {
  const findPurchaseReturn = await models.PurchaseReturn.findOne({
    include: purchaseReturnIncludes,
    attributes: purchaseReturnAttributes,
    where: {
      id,
      storeId: loginUser.storeId,
    },
  });

  if (!findPurchaseReturn) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Phiếu trả hàng không tồn tại",
    };
  }

  const products = await models.PurchaseReturnToProduct.findAll({
    attributes: ["id", "productId", "purchaseReturnId"],
    include: purchaseReturnProductIncludes,
    where: {
      purchaseReturnId: id,
    },
  });

  return {
    success: true,
    data: {
      purchaseReturn: findPurchaseReturn,
      products,
    },
  };
}

function generatePurchaseReturnCode(no) {
  if (no <= 0) return "TSP000000000";
  if (no < 10) return `TSP00000000${no}`;
  if (no < 100) return `TSP0000000${no}`;
  if (no < 1000) return `TSP000000${no}`;
  if (no < 10000) return `TSP00000${no}`;
  if (no < 100000) return `TSP0000${no}`;
  if (no < 1000000) return `TSP000${no}`;
  if (no < 10000000) return `TSP00${no}`;
  if (no < 100000000) return `TSP0${no}`;
  if (no < 1000000000) return `TSP${no}`;
  return no;
}

export async function createPurchaseReturn(purchaseReturn, loginUser) {
  try {
    return await handleCreatePurchaseReturn(purchaseReturn, loginUser);
  } catch (e) {
    console.log(e);
    let errorRes = {};
    try {
      errorRes = JSON.parse(e.message);
    } catch {
      errorRes = {};
    }
    if (errorRes.error) {
      return errorRes;
    }

    const { errors = [] } = e;
    const [error = {}] = errors;
    return {
      error: true,
      code: HttpStatusCode.SYSTEM_ERROR,
      message: `${e.message}: ${_.get(error, "message", "")}`,
    };
  }
}

export async function handleCreatePurchaseReturn(purchaseReturn, loginUser) {
  if (!purchaseReturn.products || !purchaseReturn.products.length) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: `Bạn cần chọn sản phẩm để tiến hành trả hàng`,
    };
  }

  // Validate thông tin nhà cung cấp, nhân viên, chi nhánh
  const [responseReadSupplier, responseReadUser, responseReadBranch] =
    await Promise.all([
      readSupplier(purchaseReturn.supplierId, loginUser),
      readUser(purchaseReturn.userId, loginUser),
      readBranch(purchaseReturn.branchId, loginUser),
    ]);
  if (responseReadSupplier.error) {
    return responseReadSupplier;
  }
  if (responseReadUser.error) {
    return responseReadUser;
  }
  if (responseReadBranch.error) {
    return responseReadBranch;
  }

  // Validate thông tin sản phẩm, lô
  for (const item of purchaseReturn.products) {
    const findProduct = await models.Product.findOne({
      where: {
        id: item.productId,
        storeId: loginUser.storeId,
      },
    });
    if (!findProduct) {
      return {
        error: true,
        code: HttpStatusCode.BAD_REQUEST,
        message: `Sản phẩm có id = ${item.productId} không tồn tại`,
      };
    }
    for (const batch of item.batches) {
      const [responseReadBatch, responseReadProductUnit] = await Promise.all([
        readBatch(batch.id, loginUser),
        readProductUnit(item.productUnitId, loginUser),
      ]);
      if (responseReadBatch.error) {
        return responseReadBatch;
      }
      if (responseReadProductUnit.error) {
        return responseReadProductUnit;
      }
    }
  }

  let newPurchaseReturn;
  await models.sequelize.transaction(async (t) => {
    // Tạo nháp phiếu trả hàng
    newPurchaseReturn = await models.PurchaseReturn.create(
      {
        userId: purchaseReturn.userId,
        supplierId: purchaseReturn.supplierId,
        totalPrice: purchaseReturn.totalPrice || 0,
        discount: purchaseReturn.discount || 0,
        debt: purchaseReturn.debt || 0,
        paid: purchaseReturn.paid || 0,
        status: purchaseReturnStatus.TRASH,
        description: purchaseReturn.description,
        storeId: loginUser.storeId,
        branchId: purchaseReturn.branchId,
        createdBy: loginUser.id,
      },
      { transaction: t }
    );

    let sumPrice = 0;
    for (const item of purchaseReturn.products) {
      const findProduct = await models.Product.findOne({
        where: {
          id: item.productId,
        },
      });
      if (!findProduct) {
        throw Error(
          JSON.stringify({
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Sản phẩm (${item.productId}) không tồn tại`,
          })
        );
      }

      // Tiền sản phẩm = Giá trả * Số lượng - Giảm giá
      const totalProductPrice =
        item.importPrice * item.totalQuantity - (item.discount || 0);
      if (totalProductPrice !== item.totalPrice) {
        throw Error(
          JSON.stringify({
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Sản phẩm (${item.productId}) có mã ${findProduct.code} sai thông tin về số lượng, đơn giá, giảm giá và thành tiền`,
          })
        );
      }

      const newPurchaseReturnProduct =
        await models.PurchaseReturnToProduct.create(
          {
            storeId: loginUser.storeId,
            branchId: purchaseReturn.branchId,
            purchaseReturnId: newPurchaseReturn.id,
            productId: item.productId,
            createdBy: newPurchaseReturn.createdBy,
          },
          { transaction: t }
        );

      const productProductToBatchConditions = {
        productId: item.productId,
        storeId: loginUser.storeId,
        branchId: purchaseReturn.branchId,
      };

      const findNewProductUnit = await models.ProductUnit.findOne({
        where: {
          id: item.productUnitId,
          ...productProductToBatchConditions,
        },
      });

      if (!findNewProductUnit) {
        throw Error(
          JSON.stringify({
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Đơn vị sản phẩm không tồn tại`,
          })
        );
      }

      // Đối với sản phẩm bắt buộc quản lý theo lô
      if (findProduct.isBatchExpireControl) {
        // Trả về tất cả lô của sản phẩm
        const batches = await models.ProductToBatch.findAll({
          attributes: ["batchId", "productUnitId", "quantity", "expiryDate"],
          include: [
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
          where: productProductToBatchConditions,
          order: [["expiryDate", "ASC"]],
        });

        // Tính tổng tất cả số lượng sản phẩm theo từng lô, nhóm lại theo lô
        // Lấy đơn vị mua làm mẫu
        // Chuyển đổi các đơn vị sau về đơn vị này
        const batchInfoMapping = {};
        for (const batchInstance of batches) {
          if (batchInfoMapping[batchInstance.batchId]) {
            batchInfoMapping[batchInstance.batchId].quantity +=
              +formatDecimalTwoAfterPoint(
                (batchInstance.quantity *
                  batchInstance.productUnit.exchangeValue) /
                  findNewProductUnit.exchangeValue
              );
          } else {
            batchInfoMapping[batchInstance.batchId] = {
              batchId: batchInstance.batchId,
              productUnitId: batchInstance.productUnitId,
              quantity: +formatDecimalTwoAfterPoint(
                (batchInstance.quantity *
                  batchInstance.productUnit.exchangeValue) /
                  findNewProductUnit.exchangeValue
              ),
              expiryDate: batchInstance.expiryDate,
              productUnit: batchInstance.productUnit,
            };
          }
        }

        let totalQuantityOfProduct = 0;
        for (const batch of item.batches) {
          if (!batchInfoMapping[batch.id]) {
            throw Error(
              JSON.stringify({
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: `Sản phẩm ${findProduct.name} chưa nhập hàng`,
              })
            );
          }

          totalQuantityOfProduct += batch.quantity;

          if (batch.quantity > batchInfoMapping[batch.id].quantity) {
            const responseReadBatch = await readBatch(batch.id, loginUser);
            if (responseReadBatch.error) {
              return responseReadBatch;
            }
            const findBatch = responseReadBatch.data;
            throw Error(
              JSON.stringify({
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: `Số lượng sản phẩm trong lô "${findBatch.name}"(${
                  batchInfoMapping[batch.id].quantity || 0
                } ${
                  findNewProductUnit ? findNewProductUnit.name : ""
                }) không đủ`,
              })
            );
          }

          // Trừ số lượng sản phẩm trong lô
          const findProductBatches = await models.ProductToBatch.findAll({
            where: {
              ...productProductToBatchConditions,
              batchId: batch.id,
            },
            order: [["expiryDate", "ASC"]],
          });

          let remainQuantity = batch.quantity;
          const selectedProductUnitQuantityMapping = {};
          for (const productBatch of findProductBatches) {
            let productBatchInstance;
            if (item.productUnitId !== productBatch.productUnitId) {
              productBatchInstance = await models.ProductUnit.findOne({
                where: {
                  id: productBatch.productUnitId,
                  ...productProductToBatchConditions,
                },
              });
              if (!productBatchInstance) {
                throw Error(
                  JSON.stringify({
                    error: true,
                    code: HttpStatusCode.BAD_REQUEST,
                    message: `Đơn vị sản phẩm id = ${productBatch.productUnitId} không tồn tại`,
                  })
                );
              }
              remainQuantity = +formatDecimalTwoAfterPoint(
                (remainQuantity * findNewProductUnit.exchangeValue) /
                  productBatchInstance.exchangeValue
              );
            }

            if (remainQuantity <= productBatch.quantity) {
              // Trừ số lượng sản phẩm trong product to batch
              await models.ProductToBatch.increment("quantity", {
                by: -remainQuantity,
                where: { id: productBatch.id },
                transaction: t,
              });
              // Ghi log đã trừ đi số lượng của productUnitId nào?
              selectedProductUnitQuantityMapping[productBatch.productUnitId] =
                remainQuantity;
              remainQuantity = 0;
            } else {
              await models.ProductToBatch.increment("quantity", {
                by: -productBatch.quantity,
                where: { id: productBatch.id },
                transaction: t,
              });
              // Ghi log đã trừ đi số lượng của productUnitId nào?
              selectedProductUnitQuantityMapping[productBatch.productUnitId] =
                productBatch.quantity;
              remainQuantity -= productBatch.quantity;
            }

            if (remainQuantity <= 0) break;

            remainQuantity = +formatDecimalTwoAfterPoint(
              (remainQuantity * productBatchInstance.exchangeValue) /
                findNewProductUnit.exchangeValue
            );
          }

          for (const selectedProductUnitId of Object.keys(
            selectedProductUnitQuantityMapping
          )) {
            // Trừ số lượng sản phẩm trong product master
            await models.ProductMaster.increment("quantity", {
              by: -selectedProductUnitQuantityMapping[selectedProductUnitId],
              where: {
                ...productProductToBatchConditions,
                productUnitId: selectedProductUnitId,
              },
              transaction: t,
            });
          }
        }

        if (totalQuantityOfProduct !== item.totalQuantity) {
          throw Error(
            JSON.stringify({
              error: true,
              code: HttpStatusCode.BAD_REQUEST,
              message: `Số lượng sản phẩm "${findProduct.name}" (=${item.totalQuantity}) không bằng tổng số lượng sản phẩm chọn từ các lô (=${totalQuantityOfProduct})`,
            })
          );
        }
      } else {
        const findAllProductMasters = await models.ProductMaster.findAll({
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
          ],
          where: {
            ...productProductToBatchConditions,
            quantity: {
              [Op.gte]: 0,
            },
          },
        });

        const productMasterInfoMapping = {};
        for (const productMasterItem of findAllProductMasters) {
          if (productMasterInfoMapping[productMasterItem.productId]) {
            productMasterInfoMapping[productMasterItem.productId].quantity +=
              +formatDecimalTwoAfterPoint(
                (productMasterItem.quantity *
                  productMasterItem.productUnit.exchangeValue) /
                  findNewProductUnit.exchangeValue
              );
          } else {
            productMasterInfoMapping[productMasterItem.productId] = {
              quantity: +formatDecimalTwoAfterPoint(
                (productMasterItem.quantity *
                  productMasterItem.productUnit.exchangeValue) /
                  findNewProductUnit.exchangeValue
              ),
            };
          }
        }

        if (productMasterInfoMapping[item.productId].quantity < item.quantity) {
          throw Error(
            JSON.stringify({
              error: true,
              code: HttpStatusCode.BAD_REQUEST,
              message: `Số lượng sản phẩm ${findProduct.name} (${
                productMasterInfoMapping[item.productId].quantity || 0
              } không đủ`,
            })
          );
        }

        let remainQuantity = item.totalQuantity;
        for (const productMasterItem of findAllProductMasters) {
          const convertQuantity = +formatDecimalTwoAfterPoint(
            (productMasterItem.quantity *
              productMasterItem.productUnit.exchangeValue) /
              findNewProductUnit.exchangeValue
          );
          if (convertQuantity >= remainQuantity) {
            // Trừ số lượng sản phẩm trong product master
            const qtyMinus = +formatDecimalTwoAfterPoint(
              (remainQuantity * findNewProductUnit.exchangeValue) /
                productMasterItem.productUnit.exchangeValue
            );
            await models.ProductMaster.increment("quantity", {
              by: -qtyMinus,
              where: { id: productMasterItem.id },
              transaction: t,
            });
            remainQuantity = 0;
          } else {
            // Trừ số lượng sản phẩm trong product master
            await models.ProductMaster.increment("quantity", {
              by: -productMasterItem.quantity,
              where: { id: productMasterItem.id },
              transaction: t,
            });
            remainQuantity -= convertQuantity;
          }

          if (remainQuantity <= 0) break;
        }
      }

      sumPrice += totalProductPrice;
    }

    // Validate Tổng tiền = Tổng tiền tất cả sản phẩm + Tiền được chiết khấu
    if (
      purchaseReturn.totalPrice + (purchaseReturn.discount || 0) !==
      sumPrice
    ) {
      throw Error(
        JSON.stringify({
          error: true,
          code: HttpStatusCode.BAD_REQUEST,
          message: `Số tiền tổng thanh toán không hợp lệ`,
        })
      );
    }

    if (purchaseReturn.paid && purchaseReturn.paid > sumPrice) {
      throw Error(
        JSON.stringify({
          error: true,
          code: HttpStatusCode.BAD_REQUEST,
          message: `Số tiền trả cần nhỏ hơn hoặc bằng tổng số tiền thanh toán`,
        })
      );
    }

    if (
      purchaseReturn.paid &&
      purchaseReturn.totalPrice - purchaseReturn.paid !== purchaseReturn.debt
    ) {
      throw Error(
        JSON.stringify({
          error: true,
          code: HttpStatusCode.BAD_REQUEST,
          message: `Số tiền cần trả và số tiền nợ phải bằng tổng số tiền thanh toán`,
        })
      );
    }

    // Update total price
    await models.PurchaseReturn.update(
      {
        totalPrice: sumPrice,
        discount: purchaseReturn.discount || 0,
        code: generatePurchaseReturnCode(newPurchaseReturn.id),
        ...(purchaseReturn.status && { status: purchaseReturn.status }),
      },
      {
        where: {
          id: newPurchaseReturn.id,
        },
        transaction: t,
      }
    );
  });

  const { data: refreshPurchaseReturn } = await readPurchaseReturn(
    newPurchaseReturn.id,
    loginUser
  );

  if (refreshPurchaseReturn.status === purchaseReturnStatus.TRASH) {
    return {
      error: true,
      code: HttpStatusCode.SYSTEM_ERROR,
      message: `Không thể tạo phiếu trả hàng`,
    };
  }

  return {
    success: true,
    data: refreshPurchaseReturn,
  };
}

export async function updatePurchaseReturnStatus(id, payload, loginUser) {
  const findPurchaseReturn = await models.PurchaseReturn.findOne({
    where: {
      id,
      storeId: loginUser.storeId,
    },
  });

  if (!findPurchaseReturn) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Phiếu trả hàng không tồn tại",
    };
  }

  await models.PurchaseReturn.update(
    {
      status: payload.status,
    },
    {
      where: {
        id,
      },
    }
  );

  // TODO::Xử lý case từ lưu tạm sang hoàn thành và ngược lại

  createUserTracking({
    accountId: loginUser.id,
    type: accountTypes.USER,
    objectId: id,
    action: logActions.purchase_return_update.value,
    data: { id, ...payload },
  });

  return {
    success: true,
  };
}
