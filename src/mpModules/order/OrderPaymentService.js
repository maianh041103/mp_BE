const models = require("../../../database/models");

export async function indexPayment(params, loginUser) {
    let {
        page,
        limit,
        orderId,
    } = params
    const payments = await models.Payment.findAll({
        offset: +limit * (+page - 1),
        limit: +limit,
        order: [["id", "DESC"]],
        where: {
            orderId: orderId,
        }
    })
    return {
        success: true,
        data: payments
    }
}

export async function createPayment(payment, transaction) {
    await models.Payment.create(payment, {transaction: transaction})
}

export async function createOrderPayment(order, amount, transaction) {
    await models.Payment.create({
        code: order.code,
        amount: order.totalPrice <= order.cashOfCustomer ? order.totalPrice : order.cashOfCustomer,
        totalAmount: order.totalPrice ,
        customerId: order.customerId,
        orderId: order.id,
        paymentMethod: order.paymentType,
        createdBy: order.createdBy,
        status: 'DONE'
    }, {transaction: transaction})
}