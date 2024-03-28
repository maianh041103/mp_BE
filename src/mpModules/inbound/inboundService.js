import {createWarehouseCard} from "../warehouse/warehouseService";
import {warehouseStatus} from "../warehouse/constant";

const _ = require("lodash");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const models = require("../../../database/models");
const { readUser } = require("../user/userService");
const { readBranch } = require("../branch/branchService");
const { readSupplier } = require("../supplier/supplierService");
const { readBatch } = require("../batch/batchService");
const { readProductUnit } = require("../product/productUnitService");
const { inboundStatus } = require("../inbound/inboundConstant");
const { addFilterByDate } = require("../../helpers/utils");
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

const userIncludes = [
  {
    model: models.Image,
    as: "avatar",
    attributes: ["id", "originalName", "fileName", "filePath", "path"],
  },
];

const inboundIncludes = [
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

const inboundAttributes = [
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

const productAttributes = ["name", "shortName", "code", "barCode", "imageId", "isBatchExpireControl"];

const inboundProductIncludes = [
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

export async function indexInbounds(params, loginUser) {
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
    attributes: inboundAttributes,
    offset: +limit * (+page - 1),
    include: inboundIncludes,
    limit: +limit,
    order: [["id", "DESC"]],
  };

  const where = {
    status: {
      [Op.ne]: inboundStatus.TRASH,
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
    models.Inbound.findAll(query),
    models.Inbound.count(query),
  ]);

  return {
    success: true,
    data: {
      items,
      totalItem,
    },
  };
}

export async function readInbound(id, loginUser) {
  const findInbound = await models.Inbound.findOne({
    include: inboundIncludes,
    attributes: inboundAttributes,
    where: {
      id,
      storeId: loginUser.storeId,
    },
  });

  if (!findInbound) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Phiếu nhập hàng không tồn tại",
    };
  }

  const products = await models.InboundToProduct.findAll({
    attributes: ["id", "productId", "inboundId"],
    include: inboundProductIncludes,
    where: {
      inboundId: id,
    },
  });

  return {
    success: true,
    data: {
      inbound: findInbound,
      products,
    },
  };
}

function generateInboundCode(no) {
  if (no <= 0) return "NSP000000000";
  if (no < 10) return `NSP00000000${no}`;
  if (no < 100) return `NSP0000000${no}`;
  if (no < 1000) return `NSP000000${no}`;
  if (no < 10000) return `NSP00000${no}`;
  if (no < 100000) return `NSP0000${no}`;
  if (no < 1000000) return `NSP000${no}`;
  if (no < 10000000) return `NSP00${no}`;
  if (no < 100000000) return `NSP0${no}`;
  if (no < 1000000000) return `NSP${no}`;
  return no;
}

export async function createInbound(inbound, loginUser) {
  try {
    return await handleCreateInbound(inbound, loginUser);
  } catch (e) {
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

export async function handleCreateInbound(inbound, loginUser) {
  if (!inbound.products || !inbound.products.length) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: `Bạn cần chọn sản phẩm để tiến hành nhập hàng`,
    };
  }
  let itemQty = []
  // Validate thông tin nhà cung cấp, nhân viên, chi nhánh
  const [responseReadSupplier, responseReadUser, responseReadBranch] =
    await Promise.all([
      readSupplier(inbound.supplierId, loginUser),
      readUser(inbound.userId, loginUser),
      readBranch(inbound.branchId, loginUser),
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
  for (const item of inbound.products) {
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

  let newInbound;
  await models.sequelize.transaction(async (t) => {
    // Tạo nháp phiếu nhập hàng
    newInbound = await models.Inbound.create(
      {
        userId: inbound.userId,
        supplierId: inbound.supplierId,
        totalPrice: inbound.totalPrice || 0,
        discount: inbound.discount || 0,
        debt: inbound.debt || 0,
        paid: inbound.paid || 0,
        status: inboundStatus.TRASH,
        description: inbound.description,
        storeId: loginUser.storeId,
        branchId: inbound.branchId,
        createdBy: loginUser.id,
      },
      { transaction: t }
    );
    const supplier = await models.Supplier.findOne({
      attributes: ["name"],
      where: {
        id: inbound.supplierId,
        storeId: loginUser.storeId,
      },
    });
    if (!supplier) {
      throw Error(
          JSON.stringify({
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Nhà cung cấp không hợp lệ`,
          })
      );
    }

    let sumPrice = 0;
    for (const item of inbound.products) {
      var findProduct = await models.Product.findOne({
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

      // Tiền sản phẩm = Giá nhập * Số lượng - Giảm giá
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
      const newInboundProduct = await models.InboundToProduct.create(
        {
          storeId: loginUser.storeId,
          branchId: inbound.branchId,
          inboundId: newInbound.id,
          productId: item.productId,
          createdBy: newInbound.createdBy,
        },
        { transaction: t }
      );
      let totalProductQuantity = 0;

      if (findProduct.isBatchExpireControl) {
        for (const batch of item.batches) {
          const responseReadBatch = await readBatch(batch.id, loginUser);
          if (responseReadBatch.error) {
            return responseReadBatch;
          }
          totalProductQuantity += batch.quantity;

          const isExistProductBatch = await models.ProductToBatch.findOne({
            where: {
              storeId: loginUser.storeId,
              branchId: inbound.branchId,
              productId: item.productId,
              batchId: batch.id,
              productUnitId: item.productUnitId,
            },
          });

          const newProductBatchPayload = {
            storeId: loginUser.storeId,
            branchId: inbound.branchId,
            productId: item.productId,
            batchId: batch.id,
            productUnitId: item.productUnitId,
            expiryDate: batch.expiryDate,
            createdBy: loginUser.id,

            importPrice: item.importPrice,
            totalPrice: item.totalPrice,
            discount: item.discount,
          };

          // Tồn tại thì cộng số lượng sản phẩm
          if (isExistProductBatch) {
            await models.ProductToBatch.increment("quantity", {
              by: batch.quantity,
              where: { id: isExistProductBatch.id },
              transaction: t,
            });
          } else {
            // Chưa tồn tại, thêm mới record
            await models.ProductToBatch.create(
              {
                ...newProductBatchPayload,
                quantity: batch.quantity,
              },
              { transaction: t }
            );
          }

          await models.ProductBatchHistory.create(
            {
              ...newProductBatchPayload,
              inboundProductId: newInboundProduct.id,
              quantity: batch.quantity,
              initQuantity: isExistProductBatch
                ? isExistProductBatch.quantity
                : batch.quantity,
            },
            { transaction: t }
          );
        }

        if (totalProductQuantity !== item.totalQuantity) {
          throw Error(
            JSON.stringify({
              error: true,
              code: HttpStatusCode.BAD_REQUEST,
              message: `Sản phẩm có mã ${findProduct.code} có tổng ${totalProductQuantity} sản phẩm trong lô không bằng tổng sổ lượng sản phẩm đã nhập (${item.totalQuantity})`,
            })
          );
        }
      }
      else{
        // Đối với sản phẩm (hàng hóa) không có lô
        await models.ProductBatchHistory.create(
          {
            storeId: loginUser.storeId,
            branchId: inbound.branchId,
            productId: item.productId,
            batchId: null,
            productUnitId: item.productUnitId,
            expiryDate: null,
            createdBy: loginUser.id,

            importPrice: item.importPrice,
            totalPrice: item.totalPrice,
            discount: item.discount,

            inboundProductId: newInboundProduct.id,
            quantity: item.totalQuantity,
            initQuantity: item.totalQuantity,
          },
          { transaction: t }
        );
      }

      sumPrice += totalProductPrice;
    }

    // Validate Tổng tiền = Tổng tiền tất cả sản phẩm + Tiền được chiết khấu
    if (inbound.totalPrice + (inbound.discount || 0) !== sumPrice) {
      throw Error(
        JSON.stringify({
          error: true,
          code: HttpStatusCode.BAD_REQUEST,
          message: `Số tiền tổng thanh toán không hợp lệ`,
        })
      );
    }

    if (inbound.paid && inbound.paid > sumPrice) {
      throw Error(
        JSON.stringify({
          error: true,
          code: HttpStatusCode.BAD_REQUEST,
          message: `Số tiền trả cần nhỏ hơn hoặc bằng tổng số tiền thanh toán`,
        })
      );
    }

    if (inbound.paid && inbound.totalPrice - inbound.paid !== inbound.debt) {
      throw Error(
        JSON.stringify({
          error: true,
          code: HttpStatusCode.BAD_REQUEST,
          message: `Số tiền cần trả và số tiền nợ phải bằng tổng số tiền thanh toán`,
        })
      );
    }

    // Update total price
    await models.Inbound.update(
      {
        totalPrice: sumPrice,
        discount: inbound.discount || 0,
        code: generateInboundCode(newInbound.id),
        ...(inbound.status && { status: inbound.status }),
      },
      {
        where: {
          id: newInbound.id,
        },
        transaction: t,
      }
    );

    if (inbound.status === inboundStatus.SUCCEED) {
      for (const item of inbound.products) {
        const productUnit = await models.ProductUnit.findOne({
          attributes: ["exchangeValue"],
          where: {
            id: item.productUnitId
          }
        })
        if (!productUnit) {
          throw Error(
              JSON.stringify({
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: `Không tìm thấy đơn vị thuốc`,
              })
          );
        }
        await createWarehouseCard({
          code: generateInboundCode(newInbound.id),
          type: warehouseStatus.INBOUND,
          partner: supplier.name,
          productId: item.productId,
          branchId: inbound.branchId,
          changeQty: item.totalQuantity,
          remainQty: findProduct.inventory + item.totalQuantity * productUnit.exchangeValue,
          createdAt: new Date(),
          updatedAt: new Date()
        })
        await models.Product.increment(
            {inventory: item.totalQuantity * productUnit.exchangeValue},
            {where: { id: item.productId}}
        )
      }
    }
  });

  const { data: refreshInbound } = await readInbound(newInbound.id, loginUser);

  if (refreshInbound.status === inboundStatus.TRASH) {
    return {
      error: true,
      code: HttpStatusCode.SYSTEM_ERROR,
      message: `Không thể tạo phiếu nhập hàng`,
    };
  }

  return {
    success: true,
    data: refreshInbound,
  };
}

export async function updateInboundStatus(id, payload, loginUser) {
  const findInbound = await models.Inbound.findOne({
    where: {
      id,
      storeId: loginUser.storeId,
    },
  });

  if (!findInbound) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Phiếu nhập hàng không tồn tại",
    };
  }

  await models.Inbound.update(
    {
      status: payload.status,
    },
    {
      where: {
        id,
      },
    }
  );

  // Xử lý case từ lưu tạm sang hoàn thành và ngược lại

  createUserTracking({
    accountId: loginUser.id,
    type: accountTypes.USER,
    objectId: id,
    action: logActions.inbound_update.value,
    data: { id, ...payload },
  });
  return {
    success: true,
  };
}
