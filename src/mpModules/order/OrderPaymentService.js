const models = require("../../../database/models");

export async function indexPayment() {

}

export async function createPayment(payment, transaction) {
    await models.Payment.create(payment, {transaction: transaction})
}

export async function createOrderPayment(order, amount, transaction) {
    await models.Payment.create({
        code: order.code,
        amount: order.cashOfCustomer,
        totalAmount: order.totalPrice,
        customerId: order.customerId,
        orderId: order.id,
        paymentMethod: order.paymentType,

    }, {transaction: transaction})
}