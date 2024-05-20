import { getCustomer } from "../customer/customerService";
import {getOrder, readOrder} from "./orderService";

const models = require("../../../database/models");
function generatePaymentCode(no) {
    if (no <= 0) return "TTDH000000000";
    if (no < 10) return `TTDH00000000${no}`;
    if (no < 100) return `TTDH0000000${no}`;
    if (no < 1000) return `TTDH000000${no}`;
    if (no < 10000) return `TTDH00000${no}`;
    if (no < 100000) return `TTDH0000${no}`;
    if (no < 1000000) return `TTDH000${no}`;
    if (no < 10000000) return `TTDH00${no}`;
    if (no < 100000000) return `TTDH0${no}`;
    if (no < 1000000000) return `TTDH${no}`;
    return no;
}

export async function indexPayment(params, loginUser) {
    let {
        page,
        limit,
        orderId,
    } = params
    const payments = await models.Payment.findAll({
        offset: +limit * (+page - 1),
        limit: +limit,
        include: orderIncludes,
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
const orderIncludes = [
    {
      model: models.User,
      as: "fullnameCreator",
      attributes: ["id", "fullName", ],
    
}
];
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
    "createdAt",
    "status",
  ];
export async function indexCreatePayment(payment) {
    const order = await getOrder(payment.orderId)
    await models.sequelize.transaction(async (t) => {
        await models.Order.update({
            cashOfCustomer: order.cashOfCustomer + payment.amount
        }, {where: {id: order.id}})
        await createPayment({
            amount: payment.amount,
            totalAmount: order.totalPrice ,
            customerId: order.customerId,
            orderId: order.id,
            paymentMethod: payment.paymentMethod,
            createdBy: payment.createdBy,
            status: 'DONE'
        }, t)
        await models.CustomerDebt.increment({
            debtAmount: -payment.amount
        }, {where: {orderId: order.id}, transaction: t})
    })
    return {
        success: true
    }
}

export async function createPayment(payment, transaction) {
    const newPayment = await models.Payment.create({...payment, code: ''}, {transaction: transaction})
    console.log(newPayment)
    const code = generatePaymentCode(newPayment.id)
    await models.Payment.update({
        code: code
    }, {where: {id: newPayment.id}, transaction: transaction})
}

export async function createOrderPayment(order, amount, transaction) {
    if (order.cashOfCustomer > 0) {
        await createPayment({
            amount: order.totalPrice <= order.cashOfCustomer ? order.totalPrice : order.cashOfCustomer,
            totalAmount: order.totalPrice,
            customerId: order.customerId,
            orderId: order.id,
            paymentMethod: order.paymentType,
            createdBy: order.createdBy,
            status: 'DONE'
        }, transaction)
    }
}

