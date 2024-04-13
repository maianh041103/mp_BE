import {createWarehouseCard} from "../warehouse/warehouseService";
import {warehouseStatus} from "../warehouse/constant";
import {addInventory, getInventory} from "../inventory/inventoryService";
import {createOrderPayment} from "./OrderPaymentService";
import {raiseBadRequestError} from "../../helpers/exception";

const moment = require("moment");
const {
  addFilterByDate,
  randomString,
  formatDecimalTwoAfterPoint,
} = require("../../helpers/utils");
const {
  getCustomer,
  customerFilter,
  readCustomer,
} = require("../customer/customerService");
const { orderProductFilter } = require("./orderProductService");
const {
  productFilter,
  hashProductPrice,
  extractFieldProduct,
} = require("../product/productService");
const { createOrderLog } = require("./orderHistoryService");
const { createUserTracking } = require("../behavior/behaviorService");
const { createNotificationVersion1 } = require("../notification/notifyService");
const {
  sendNotificationThroughSms,
} = require("../notification/smsIntegrationService");
const { indexUsers, readUser } = require("../user/userService");
readBranch;
const { readBranch } = require("../branch/branchService");
const {
  updateProductStatistic,
} = require("../productStatistic/productStatisticService");
const Sequelize = require("sequelize");
const _ = require("lodash");
const { Op } = Sequelize;
const models = require("../../../database/models");
const {
  orderStatuses,
  orderStatusOptions,
  paymentTypes,
  thresholdPercentDiscount,
  discountTypes,
} = require("./orderConstant");
const { iconOrderNotificationId } = require("../notification/notifyConstant");
const {
  PAGE_LIMIT,
  accountTypes,
  logActions,
} = require("../../helpers/choices");
const { HttpStatusCode } = require("../../helpers/errorCodes");
const { productTypes } = require("../product/productConstant");
const { readBatch } = require("../batch/batchService");
const { readProductUnit } = require("../product/productUnitService");

const userAttributes = [
  "id",
  "username",
  "email",
  "fullName",
  "avatarId",
  "birthday",
  "gender",
  "phone",
  "roleId",
  "position",
  "lastLoginAt",
  "status",
];

const userIncludes = [
  {
    model: models.Image,
    as: "avatar",
    attributes: ["id", "originalName", "fileName", "filePath", "path"],
  },
];

const orderIncludes = [
  {
    model: models.Prescription,
    as: "prescription",
    include: [
      {
        model: models.Doctor,
        as: "doctor",
        attributes: ["name", "phone", "code", "email", "gender"],
      },
      {
        model: models.HealthFacility,
        as: "healthFacility",
        attributes: ["id", "name", "storeId"],
      },
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
    ]
  },
  {
    model: models.User,
    as: "user",
    attributes: userAttributes
  },
  {
    model: models.Customer,
    as: "customer",
    attributes: [
      "id",
      "fullName",
      "phone",
      "email",
      "address",
      "groupCustomerId",
    ]
  },

];

const orderAttributes = [
  "id",
  "code",
  "description",
  "userId",
  "customerId",
  "storeId",
  "branchId",
  "paymentType",
  "point",
  "totalPrice",
  "cashOfCustomer",
  "customerOwes",
  "refund",
  "discount",
  "discountType",
  "isVatInvoice",
  "status",
  "createdAt",
    "createdBy"
];

const productAttributes = ["name", "shortName", "code", "barCode", "imageId"];

const orderProductIncludes = [
  {
    model: models.ProductUnit,
    as: "productUnit",
    attributes: ["id", "unitName", "exchangeValue", "price", "isBaseUnit"],
  },
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
];

export async function indexOrders(params, loginUser) {
  let {
    page = 1,
    limit = 10,
    keyword,
    code = "",
    phone = "",
    userId,
    branchId,
    storeId,
    status,
    userIds = [],
    statusIds = [],
    customerId,
    customerIds = [],
    productIds = [],
    groupCustomerId,
    groupCustomerIds = [],
    paymentType = "",
    positions = [],
    dateRange = {},
  } = params;
  const query = {
    attributes: orderAttributes,
    offset: +limit * (+page - 1),
    include: orderIncludes,
    limit: +limit,
    order: [["id", "DESC"]],
    distinct: true,
  };

  const where = {
    status: {
      [Op.ne]: orderStatuses.DRAFT,
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
    where.code = {
      [Op.like]: `%${code.trim()}%`,
    };
  }

  if (keyword) {
      where.code = {
        [Op.like]: `%${keyword.trim()}%`,
      };
  }

  // Tìm kiếm theo trạng thái đơn hàng
  if (_.isArray(statusIds) && statusIds.length) {
    where.status = {
      [Op.in]: statusIds,
    };
  }

  // Tìm kiếm theo ngày tạo đơn hàng
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
    where.createdAt = addFilterByDate([startDate, endDate]);
  }

  // Tìm kiếm theo phương thức thanh toán
  if (paymentType) {
    where.paymentType = paymentType;
  }

  // Tìm kiếm theo khách hàng
  if (customerId) {
    customerIds.push(customerId);
  }

  if (_.isArray(customerIds) && customerIds.length) {
    where.customerId = {[Op.in]: customerIds}
  }

  // Tìm kiếm theo nhóm khách hàng
  if (groupCustomerId) {
    groupCustomerIds.push(groupCustomerId);
  }
  if (_.isArray(groupCustomerIds) && groupCustomerIds.length) {
    where.groupCustomerId = groupCustomerIds;
  }

  // Tìm kiếm sản phẩm có trong đơn hàng
  if (_.isArray(productIds) && productIds.length) {
    const tempOrderProducts = await orderProductFilter({
      productId: productIds,
    });
    const orderIds = tempOrderProducts.map((o) => o.orderId);
    if (orderIds.length) {
      where.id = {
        [Op.in]: orderIds,
      };
    } else {
      return {
        success: true,
        data: {
          items: [],
          totalItem: 0,
          totalPrice: 0,
        },
      };
    }
  }

  // Tìm kiếm theo người phụ trách, dựa vào lịch sử duyệt đơn để nâng cấp chức năng này
  if (userId) {
    userIds.push(userId);
  }
  if (_.isArray(userIds) && userIds.length) {
    where.createdBy = {
      [Op.in]: userIds,
    };
  }

  query.where = where;

  const [items, totalItem] = await Promise.all([
    models.Order.findAll(query),
    models.Order.count(query),
  ]);

  for (const item of items) {
    const products = await models.OrderProduct.findAll({
      include: orderProductIncludes,
      where: {
        orderId: item.id,
        comboId: {
          [Op.eq]: null,
        },
      },
    });
    item.dataValues.products = products;
    item.dataValues.totalProducts = products.length;
    let totalQuantities = 0;
    products.forEach((product) => {
      totalQuantities += +product.quantity;
    });
    item.dataValues.totalQuantities = totalQuantities;
  }

  const totalPrices = await models.Order.findAll({
    attributes: [
      [Sequelize.fn("sum", Sequelize.col("totalPrice")), "totalPrice"],
    ],
    raw: true,
    where,
  });

  const [totalPrice = {}] = totalPrices;

  return {
    success: true,
    data: {
      items,
      totalItem,
      totalPrice: _.get(totalPrice, "totalPrice", 0) || 0,
    },
  };
}

export async function readOrder(id) {
  const order = await models.Order.findByPk(id, {
    include: orderIncludes,
    attributes: orderAttributes,
  });

  const products = await models.OrderProduct.findAll({
    attributes: ["productId", "comboId", "quantity", "customerId", "price"],
    include: orderProductIncludes,
    where: {
      orderId: id,
      comboId: {
        [Op.eq]: null,
      },
    },
  });

  order.dataValues.products = products;
  order.dataValues.totalProducts = products.length;
  let totalQuantities = 0;
  products.forEach((product) => {
    totalQuantities += +product.quantity;
  });
  order.dataValues.totalQuantities = totalQuantities;

  return {
    success: true,
    data: {
      order,
      products,
    },
  };
}

function generateOrderCode(no) {
  if (no <= 0) return "DH000000000";
  if (no < 10) return `DH00000000${no}`;
  if (no < 100) return `DH0000000${no}`;
  if (no < 1000) return `DH000000${no}`;
  if (no < 10000) return `DH00000${no}`;
  if (no < 100000) return `DH0000${no}`;
  if (no < 1000000) return `DH000${no}`;
  if (no < 10000000) return `DH00${no}`;
  if (no < 100000000) return `DH0${no}`;
  if (no < 1000000000) return `DH${no}`;
  return no;
}

// Đơn hàng tạo trên quầy
// discountType = 1 => %
// discountType = 2 => VND
async function handleCreateOrder(order, loginUser) {
  if (!order.products || !order.products.length) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: `Bạn cần chọn sản phẩm để tiến hành thanh toán`,
    };
  }
  const [responseReadCustomer, responseReadUser, responseReadBranch] =
    await Promise.all([
      readCustomer(order.customerId, loginUser),
      readUser(order.userId, loginUser),
      readBranch(order.branchId, loginUser),
    ]);

  if (responseReadCustomer.error) {
    return responseReadCustomer;
  }
  if (responseReadUser.error) {
    return responseReadUser;
  }
  if (responseReadBranch.error) {
    return responseReadBranch;
  }

  const findCustomer = responseReadCustomer.data;

  let newOrder;
  await models.sequelize.transaction(async (t) => {
    newOrder = await models.Order.create(
      {
        code: `${loginUser.storeId || ""}S${randomString(12)}`,
        description: order.description,
        userId: order.userId,
        customerId: order.customerId,
        prescriptionId: order.prescriptionId,
        groupCustomerId: findCustomer.groupCustomerId,
        totalPrice: 0,
        paymentType: order.paymentType,
        cashOfCustomer: order.cashOfCustomer,
        customerOwes: 0,
        refund: 0,
        discount: 0,
        discountType: order.discountType,
        status: orderStatuses.DRAFT,
        storeId: loginUser.storeId,
        branchId: order.branchId,
        createdBy: loginUser.id,
      },
      { transaction: t }
    );

    let totalPrice = 0;
    for (const item of order.products) {
      const findProduct = await models.Product.findOne({
        where: {
          id: item.productId,
          storeId: loginUser.storeId,
        },
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
              "createdBy",
              "createdAt",
            ],
            where: {
              id: item.productUnitId,
            },
          },
        ],
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

      const productProductToBatchConditions = {
        productId: item.productId,
        storeId: loginUser.storeId,
      };

      const productUnit = await models.ProductUnit.findOne({
        where: {
          id: item.productUnitId,
          ...productProductToBatchConditions,
        },
      });
      if (!productUnit) {
        throw Error(
          JSON.stringify({
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Đơn vị sản phẩm không tồn tại`,
          })
        );
      }
      totalPrice += +productUnit.price * +item.quantity;
      const inventory = await getInventory(order.branchId, item.productId)
      if (inventory < item.totalQuantity * productUnit.exchangeValue) {
        throw Error(
            JSON.stringify({
              error: true,
              code: HttpStatusCode.BAD_REQUEST,
              message: `Sản phẩm ${findProduct.name} không đủ số lượng`,
            })
        );
      }

      await createWarehouseCard({
        code: generateOrderCode(newOrder.id),
        type: warehouseStatus.ORDER,
        partner: findCustomer.fullName,
        productId: item.productId,
        branchId: order.branchId,
        changeQty: -item.quantity * productUnit.exchangeValue,
        remainQty: inventory - item.quantity * productUnit.exchangeValue,
        createdAt: new Date(),
        updatedAt: new Date()
      }, t)
      await addInventory(order.branchId, item.productId, -item.quantity * productUnit.exchangeValue, t)

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

        const batchInfoMapping = {};
        for (const batchInstance of batches) {
          if (batchInfoMapping[batchInstance.batchId]) {
            batchInfoMapping[batchInstance.batchId].quantity +=
              +formatDecimalTwoAfterPoint(
                (batchInstance.quantity *
                  batchInstance.productUnit.exchangeValue) /
                  productUnit.exchangeValue
              );
          } else {
            batchInfoMapping[batchInstance.batchId] = {
              batchId: batchInstance.batchId,
              productUnitId: batchInstance.productUnitId,
              quantity: +formatDecimalTwoAfterPoint(
                (batchInstance.quantity *
                  batchInstance.productUnit.exchangeValue) /
                  productUnit.exchangeValue
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
                message: `Thông tin lô bán theo sản phẩm không tồn tại`,
              })
            );
          }

          totalQuantityOfProduct += batch.quantity;
          const responseReadBatch = await readBatch(batch.id, loginUser);
          if (responseReadBatch.error) {
            return responseReadBatch;
          }
          const findBatch = responseReadBatch.data;
          if (batch.quantity > batchInfoMapping[batch.id].quantity) {
            throw Error(
              JSON.stringify({
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: `Số lượng sản phẩm trong lô "${findBatch.name}"(${
                  batchInfoMapping[batch.id].quantity || 0
                } ${productUnit.name}) không đủ`,
              })
            );
          }

          await models.Batch.increment({
            quantity: -productUnit.exchangeValue * batch.quantity
          }, {where: {id: batch.id}, transaction: t})

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
                (remainQuantity * productUnit.exchangeValue) /
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
                productUnit.exchangeValue
            );
          }
        }


    }
      await models.OrderProduct.create(
          {
            orderId: newOrder.id,
            productId: item.productId,
            productUnitId: productUnit.id,
            productUnitData: JSON.stringify(productUnit),
            price: +productUnit.price * +item.quantity,
            quantityBaseUnit: +productUnit.exchangeValue * +item.quantity,
            quantity: item.quantity,
            discount: 0,
            primePrice: findProduct.primePrice,
            userId: newOrder.userId,
            customerId: newOrder.customerId,
            groupCustomerId: newOrder.groupCustomerId,
            createdBy: newOrder.createdBy,
            updatedBy: newOrder.createdBy,
            createdAt: new Date(),
            comboId: null,
          },
          { transaction: t } );
      let discountAmount = 0;
    if (order.discountType === discountTypes.MONEY) {
      discountAmount = order.discount
      totalPrice = totalPrice - discountAmount;
    } else if (order.discountType === discountTypes.PERCENT) {
      discountAmount = Math.floor((order.discount * totalPrice) / 100)
      totalPrice = totalPrice - discountAmount;
    }

    if (
      order.paymentType === paymentTypes.CASH &&
      order.cashOfCustomer < totalPrice
    ) {
      throw Error(
        JSON.stringify({
          error: true,
          code: HttpStatusCode.BAD_REQUEST,
          message: `Tiền khách trả đang nhỏ hơn số tiền phải thanh toán với hình thức thanh toán là Tiền mặt`,
        })
      );
    }

    if (
      order.paymentType === paymentTypes.BANK &&
      order.cashOfCustomer < totalPrice
    ) {
      throw Error(
        JSON.stringify({
          error: true,
          code: HttpStatusCode.BAD_REQUEST,
          message: `Tiền khách trả đang nhỏ hơn số tiền phải thanh toán với hình thức thanh toán là Chuyển khoản`,
        })
      );
    }
    console.log(order.cashOfCustomer)
      console.log(totalPrice)
    if (
      order.paymentType === paymentTypes.DEBT &&
      order.cashOfCustomer >= totalPrice
    ) {
      throw Error(
        JSON.stringify({
          error: true,
          code: HttpStatusCode.BAD_REQUEST,
          message: `Tiền khách trả đang lớn hoặc bằng số tiền phải thanh toán với hình thức thanh toán là Khách nợ`,
        })
      );
    }

    let refund = 0;
    if (
      order.cashOfCustomer > totalPrice &&
      [paymentTypes.CASH, paymentTypes.BANK].includes(order.paymentType)
    ) {
      refund = order.cashOfCustomer - totalPrice;
    }

    let customerOwes = 0;
    if (order.paymentType === paymentTypes.DEBT) {
      customerOwes = totalPrice - (order.cashOfCustomer || 0);
      await models.CustomerDebt.create({
        totalAmount: totalPrice,
        debtAmount: customerOwes,
        customerId: newOrder.customerId,
        orderId: newOrder.id,
        type: 'ORDER'
      }, {transaction: t})
    }
    const code = generateOrderCode(newOrder.id)
    // Update total price
    await models.Order.update(
      {
        totalPrice,
        refund,
        discountAmount,
        customerOwes,
        discount: order.discount || 0,
        code: code,
        status: orderStatuses.SUCCEED,
      },
      {
        where: {
          id: newOrder.id,
        },
        transaction: t,
      }
    );
    newOrder.totalPrice = totalPrice
    newOrder.code = code
    await createOrderPayment(newOrder, t)
  }});

  const { data: refreshOrder } = await readOrder(newOrder.id);

  return {
    success: true,
    data: refreshOrder,
  };
}

export async function createOrder(order, loginUser) {
  try {
    return await handleCreateOrder(order, loginUser);
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

export async function updateOrder(id, order)  {
  const findOrder = await models.Order.findByPk(id);
  if (findOrder) {
    if (
      [orderStatuses.SUCCEED, orderStatuses.CANCELLED].includes(
        findOrder.status
      )
    ) {
      return {
        error: true,
        code: HttpStatusCode.BAD_REQUEST,
        message:
          "Không được thay đổi đơn hàng ở trạng thái đã hủy hoặc thành công",
      };
    }

    const { products = [], shippingAddress = {} } = order;

    if (order.paymentType == paymentTypes.BANK) {
      order.thresholdPercentDiscount = thresholdPercentDiscount;
    } else {
      order.thresholdPercentDiscount = 0;
    }

    // Cập nhật đơn hàng
    const dataUpdate = {
      status: order.statusId,
      paymentType: order.paymentType,
      thresholdPercentDiscount: order.thresholdPercentDiscount,
      description: order.description,
      note: order.note,
      customerId: findOrder.customerId,
      isVatInvoice: order.isVatInvoice,
      storeName: order.isVatInvoice ? order.storeName : "",
      storeTax: order.isVatInvoice ? order.storeTax : "",
      storeAddress: order.isVatInvoice ? order.storeAddress : "",
      name: shippingAddress.receiver,
      phone: shippingAddress.phone,
      address: shippingAddress.detailAddress,
      paidAmount: order.paidAmount,
      email: shippingAddress.email,
      provinceId: shippingAddress.provinceId,
      districtId: shippingAddress.districtId,
      wardId: shippingAddress.wardId,
      updatedBy: order.updatedBy,
      updatedAt: new Date(),
    };

    if (typeof order.totalPrice != "undefined") {
      dataUpdate.totalPrice = order.totalPrice;
    }

    await Promise.all([
      createOrderLog({ orderId: id, newOrder: dataUpdate }),
      models.Order.update(dataUpdate, {
        where: {
          id,
        },
        individualHooks: true,
      }),
      models.OrderProduct.destroy({
        where: {
          orderId: id,
        },
      }),
    ]);

    let totalPrice = 0;
    for (let item of products) {
      await models.OrderProduct.create({
        orderId: findOrder.id,
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        oldPrice: item.oldPrice,
        percentDiscount: +formatDecimalTwoAfterPoint(
          ((+item.oldPrice - +item.price) / +item.oldPrice) * 100
        ),
        customerId: findOrder.customerId,
        groupCustomerId: findOrder.groupCustomerId,
        createdBy: findOrder.createdBy,
        updatedBy: findOrder.createdBy,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      totalPrice += item.price * item.quantity;
    }

    if (typeof order.totalPrice == "undefined") {
      await models.Order.update(
        {
          totalPrice,
        },
        {
          where: {
            id: findOrder.id,
          },
        }
      );
    }

    createUserTracking({
      accountId: order.updatedBy,
      type: accountTypes.USER,
      objectId: findOrder.id,
      action: logActions.order_update.value,
      data: { id, products, dataUpdate },
    });

    // Thông báo đến khách hàng

    // Tăng sản phẩm đã bán nếu đơn hàng được xác nhận "đơn hàng thành công"
    if (dataUpdate.status === orderStatuses.SUCCEED) {
      for (let item of products) {
        await updateProductStatistic({
          productId: item.productId,
          sold: item.quantity,
        });
      }
    }

    return {
      success: true,
    };
  }

  return {
    error: true,
    code: HttpStatusCode.NOT_FOUND,
    message: "Đơn hàng không tồn tại",
  };
}

export async function updateOrderStatus(id, order) {
  const findOrder = await models.Order.findByPk(id);

  if (!findOrder) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Đơn hàng không tồn tại",
    };
  }

  if (
    [orderStatuses.SUCCEED, orderStatuses.CANCELLED].includes(findOrder.status)
  ) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message:
        "Không được thay đổi đơn hàng ở trạng thái đã hủy hoặc thành công",
    };
  }

  await Promise.all([
    createOrderLog({ orderId: id, newOrder: order }),
    models.Order.update(order, {
      where: {
        id,
      },
      individualHooks: true,
    }),
    createUserTracking({
      accountId: order.updatedBy,
      type: accountTypes.USER,
      objectId: id,
      action: logActions.order_update.value,
      data: { id, ...order },
    }),
  ]);

  return {
    success: true,
  };
}

export async function indexProductCustomers(id) {
  const findOrder = await models.Order.findByPk(id, {
    attributes: ["id", "customerId"],
    raw: true,
  });

  if (!findOrder) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Đơn hàng không tồn tại",
    };
  }

  const customer = await getCustomer(findOrder.customerId);

  const hashPrice = _.isEmpty(customer)
    ? {}
    : await hashProductPrice({ loginCustomer: customer });

  return {
    success: true,
    data: {
      items: await extractFieldProduct(
        await productFilter({
          limit: PAGE_LIMIT,
        }),
        hashPrice,
        customer
      ),
    },
  };
}

export async function getOrder(orderId) {
  const order = await models.Order.findOne({
    attributes: ["id", "totalPrice", "customerId", "cashOfCustomer"],
    where: {id: orderId}
  })
  if (!order) {
    raiseBadRequestError("Đơn hàng không tồn tại")
  }
  return order
}
