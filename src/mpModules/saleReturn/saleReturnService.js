import { createWarehouseCard } from '../warehouse/warehouseService'
import { warehouseStatus } from '../warehouse/constant'
import { addInventory, getInventory } from '../inventory/inventoryService'
import { readCustomer } from '../customer/customerService'
import { getOrder } from '../order/orderService'
import { saleReturnAttributes, saleReturnIncludes } from './attributes'
import { getFilter } from './filter'
import { moveAttributes, moveInclude } from '../move/constant'

const Sequelize = require('sequelize')
const { Op } = Sequelize
const models = require('../../../database/models')
const { readUser } = require('../user/userService')
const { readBranch } = require('../branch/branchService')
const { readSupplier } = require('../supplier/supplierService')
const { readBatch } = require('../batch/batchService')
const { readProductUnit } = require('../product/productUnitService')
const { SaleReturnStatus } = require('../saleReturn/saleReturnConstant')
const {
  addFilterByDate,
  formatDecimalTwoAfterPoint
} = require('../../helpers/utils')
const { HttpStatusCode } = require('../../helpers/errorCodes')
const { accountTypes, logActions } = require('../../helpers/choices')
const { createUserTracking } = require('../behavior/behaviorService')

export async function indexList(params, loginUser) {
  const filter = getFilter(params, loginUser)
  const { limit, page } = params
  const [items, totalItem] = await Promise.all([
    models.SaleReturn.findAll({
      attributes: saleReturnAttributes,
      include: saleReturnIncludes,
      ...filter,
      offset: +limit * (+page - 1),
      limit: +limit,
      order: [['id', 'desc']]
    }),
    models.SaleReturn.count(filter)
  ])

  return {
    success: true,
    data: {
      items,
      totalItem
    }
  }
}

export async function indexDetail(id, loginUser) {
  const findSaleReturn = await models.SaleReturn.findOne({
    include: saleReturnIncludes,
    attributes: saleReturnAttributes,
    where: {
      id,
      storeId: loginUser.storeId
    }
  })

  if (!findSaleReturn) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: 'Phiếu trả hàng không tồn tại'
    }
  }

  return {
    success: true,
    data: {
      saleReturn: findSaleReturn
    }
  }
}

function generatesaleReturnCode(no) {
  if (no <= 0) return 'TSP000000000'
  if (no < 10) return `TSP00000000${no}`
  if (no < 100) return `TSP0000000${no}`
  if (no < 1000) return `TSP000000${no}`
  if (no < 10000) return `TSP00000${no}`
  if (no < 100000) return `TSP0000${no}`
  if (no < 1000000) return `TSP000${no}`
  if (no < 10000000) return `TSP00${no}`
  if (no < 100000000) return `TSP0${no}`
  if (no < 1000000000) return `TSP${no}`
  return no
}

function calculateTotalItemPrice(products) {
  let sumPrice = 0
  for (var i = 0; i < products.length; i++) {
    const product = products[i]
    const totalProductPrice = product.price * product.totalQuantity
    sumPrice += totalProductPrice
  }
  return sumPrice
}

export async function indexCreate(saleReturn, loginUser) {
  if (!saleReturn.products || !saleReturn.products.length) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: `Bạn cần chọn sản phẩm để tiến hành trả hàng`
    }
  }

  // Validate thông tin nhà cung cấp, nhân viên, chi nhánh
  const [responseReadCustomer, responseReadUser, responseReadBranch, order] =
    await Promise.all([
      readCustomer(saleReturn.customerId, loginUser),
      readUser(saleReturn.userId, loginUser),
      readBranch(saleReturn.branchId, loginUser),
      getOrder(saleReturn.orderId)
    ])
  if (responseReadCustomer.error) {
    return responseReadCustomer
  }
  if (responseReadUser.error) {
    return responseReadUser
  }
  if (responseReadBranch.error) {
    return responseReadBranch
  }

  // Validate thông tin sản phẩm, lô
  const customer = responseReadCustomer.data

  var newSaleReturn
  await models.sequelize.transaction(async t => {
    const itemPrice = calculateTotalItemPrice(saleReturn.products)
    const discount = saleReturn.discount || 0
    const returnFee = saleReturn.returnFee || 0
    const totalPrice = itemPrice - discount - returnFee
    const paid = saleReturn.paid || 0
    // Tạo nháp phiếu trả hàng
    newSaleReturn = await models.SaleReturn.create(
      {
        storeId: loginUser.storeId,
        branchId: saleReturn.branchId,
        userId: saleReturn.userId,
        customerId: saleReturn.customerId,
        orderId: saleReturn.orderId,
        returnFee: returnFee,
        paymentType: saleReturn.paymentType,
        description: saleReturn.description,
        discount: discount,
        itemPrice: itemPrice,
        totalPrice: totalPrice,
        debt: totalPrice - paid,
        paid: paid,
        status: SaleReturnStatus.SUCCEED,
        createdBy: loginUser.id
      },
      { transaction: t }
    )
    const code = generatesaleReturnCode(newSaleReturn.id)
    await models.SaleReturn.update(
      {
        code: code
      },
      {
        where: {
          id: newSaleReturn.id
        },
        transaction: t
      }
    )

    let pointDecrement = 0;
    for (const item of saleReturn.products) {
      const findProduct = await models.Product.findOne({
        where: {
          id: item.productId,
          storeId: loginUser.storeId
        }
      })
      const orderProduct = await models.OrderProduct.findOne({
        where: {
          orderId: saleReturn.orderId,
          productId: item.productId,
          productUnitId: item.productUnitId,
          customerId: saleReturn.customerId
        }
      })

      if (orderProduct) {
        if (orderProduct.quantity <= orderProduct.quantityLast) {
          throw new Error(
            `Hàng đã trả hết,bạn không thể thực hiện được hành động trả hàng`
          )
        }
        if (item.quantity + orderProduct.quantityLast > orderProduct.quantity) {
          throw new Error(`Số lượng hàng trả nhiều hơn số lượng hàng đang có`)
        }

        const newQuantityLast = orderProduct.quantityLast + item.quantity
        pointDecrement += orderProduct.point * item.quantity / orderProduct.quantity;

        // await orderProduct.update({ quantityLast: newQuantityLast })
        await models.OrderProduct.update(
          {
            quantityLast: newQuantityLast
          },
          {
            where: {
              orderId: saleReturn.orderId,
              productId: item.productId,
              productUnitId: item.productUnitId,
              customerId: saleReturn.customerId
            },
            transaction: t
          }
        )

        if (
          orderProduct.quantity ==
          orderProduct.quantityLast + item.quantity
        ) {
          let id = saleReturn.orderId
          console.log(id)
          await models.Order.update(
            {
              canReturn: false
            },
            { where: { id: saleReturn.orderId } }
          )
        }
      }

      if (!findProduct) {
        return {
          error: true,
          code: HttpStatusCode.BAD_REQUEST,
          message: `Sản phẩm có id = ${item.productId} không tồn tại`
        }
      }
      const responseReadProductUnit = await readProductUnit(
        item.productUnitId,
        loginUser
      )
      if (responseReadProductUnit.error) {
        return responseReadProductUnit
      }
      const productUnit = responseReadProductUnit.data

      await createWarehouseCard(
        {
          code: code,
          type: warehouseStatus.SALE_RETURN,
          partner: customer.fullName,
          productId: item.productId,
          branchId: saleReturn.branchId,
          changeQty: item.quantity * productUnit.exchangeValue,
          remainQty:
            (await getInventory(saleReturn.branchId, item.productId)) +
            item.quantity * productUnit.exchangeValue,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        t
      )
      await addInventory(
        saleReturn.branchId,
        item.productId,
        item.quantity * productUnit.exchangeValue,
        t
      )
      const saleReturnItem = await models.SaleReturnItem.create(
        {
          storeId: loginUser.storeId,
          branchId: saleReturn.branchId,
          saleReturnId: newSaleReturn.id,
          productUnitId: item.productUnitId,
          quantity: item.quantity,
          discount: item.discount || 0,
          createdBy: loginUser.id,
          price: item.price,
          totalPrice: item.price * item.totalQuantity
        },
        { transaction: t }
      )
      console.log()
      const paymentSaleReturn = await models.Payment.create(
        {
          isReturn: true,
          amount: item.quantity * item.price,
          code: code,
          orderId: saleReturn.orderId,
          createdBy: loginUser.id,
          paymentMethod: saleReturn.paymentType,
          status: 'DONE',
          customerId: saleReturn.customerId,
          totalAmount: item.quantity * item.price
        },
        { transaction: t }
      )
      if (findProduct.isBatchExpireControl) {
        for (const _batch of item.batches) {
          const responseReadBatch = await readBatch(_batch.id, loginUser)
          if (responseReadBatch.error) {
            return responseReadBatch
          }
          await models.SaleReturnBatch.create(
            {
              saleReturnItemId: saleReturnItem.id,
              batchId: _batch.id,
              quantity: _batch.quantity
            },
            { transaction: t }
          )
          const batch = responseReadBatch.data
          await models.Batch.increment(
            {
              quantity: _batch.quantity * productUnit.exchangeValue
            },
            {
              where: {
                id: _batch.id
              },
              transaction: t
            }
          )
        }
      }
    }

    //Trừ điểm tích lũy
    await models.Customer.decrement({
      point: pointDecrement
    }, {
      where: {
        id: saleReturn.customerId
      }
    })
    //End trừ điểm tích lũy
  })
  const refresh = await indexDetail(newSaleReturn.id, loginUser)
  return {
    success: true,
    data: refresh.data
  }
}
export async function indexPayment(params, loginUser) {
  let { page, limit, orderId, code } = params
  const payments = await models.Payment.findAll({
    offset: +limit * (+page - 1),
    limit: +limit,
    include: orderIncludes,
    order: [['id', 'DESC']],
    where: {
      orderId: orderId,
      code: code,
      isReturn: true
    }
  })
  return {
    success: true,
    data: payments
  }
}
const orderIncludes = [
  {
    model: models.User,
    as: 'fullnameCreator',
    attributes: ['id', 'fullName']
  }
]
export async function indexUpdate(id, payload, loginUser) {
  const findsaleReturn = await models.saleReturn.findOne({
    where: {
      id,
      storeId: loginUser.storeId
    }
  })

  if (!findsaleReturn) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: 'Phiếu trả hàng không tồn tại'
    }
  }

  await models.saleReturn.update(
    {
      status: payload.status
    },
    {
      where: {
        id
      }
    }
  )

  // TODO::Xử lý case từ lưu tạm sang hoàn thành và ngược lại

  createUserTracking({
    accountId: loginUser.id,
    type: accountTypes.USER,
    objectId: id,
    action: logActions.purchase_return_update.value,
    data: { id, ...payload }
  })

  return {
    success: true
  }
}

export async function indexDelete(id, loginUser) {
  const findsaleReturn = await models.saleReturn.findByPk(id, {
    attributes: ['id']
  })
  if (!findsaleReturn) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: 'Không tìm thấy phiếu trả hàng'
    }
  }
  await models.saleReturn.destroy({
    where: {
      id
    }
  })
  createUserTracking({
    accountId: loginUser.id,
    type: accountTypes.USER,
    objectId: id,
    action: logActions.purchase_return_delete.value,
    data: {
      id
    }
  })

  return {
    success: true
  }
}

const paymentAttributes = ["code", "amount", "createdAt", "createdBy", "paymentMethod", "customerId", "status", "totalAmount"]
const paymentIncludes = [
  {
    model: models.User,
    as: "fullnameCreator",
    attributes: ["username"],
  }
]
export async function readHistory(query, saleReturnId) {
  const saleReturn = await models.SaleReturn.findOne({
    where: {
      id: saleReturnId
    }
  });
  if (!saleReturn) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: 'Phiếu trả hàng không tồn tại'
    }
  }
  const { limit = 20, page = 1 } = query
  const [items, totalItem] = await Promise.all([
    models.Payment.findAll({
      attributes: paymentAttributes,
      include: paymentIncludes,
      offset: +limit * (+page - 1),
      limit: +limit,
      where: {
        code: saleReturn.code,
        isReturn: 1
      },
      order: [['id', 'desc']]
    }),
    models.Payment.count({
      where: {
        code: saleReturn.code,
        isReturn: 1
      }
    })
  ])

  return {
    success: true,
    data: {
      items,
      totalItem
    }
  }
}
