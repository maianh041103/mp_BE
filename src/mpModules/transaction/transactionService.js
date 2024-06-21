const transactionContant = require("./transactionContant");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const models = require("../../../database/models");
const { HttpStatusCode } = require("../../helpers/errorCodes");
const utils = require("../../helpers/utils");
const orderPaymentService = require("../order/OrderPaymentService");

const transactionAttributes = [
    "id", "code", "ballotType", "paymentDate", "typeId", "value", "createdBy",
    "userId", "target", "targetId", "note", "isDebt", "branchId", "createdAt",
    "updatedAt", "deletedAt", "isPaymentOrder"
];
const transactionIncludes = [
    {
        model: models.TypeTransaction,
        as: "typeTransaction",
        attributes: ["name"],
    },
    {
        model: models.UserTransaction,
        as: "targetOther",
        attributes: ["name", "phone"]
    },
    {
        model: models.User,
        as: "userCreated",
        attributes: ["fullName", "phone"]
    },
    {
        model: models.User,
        as: "user",
        attributes: ["fullName", "phone"]
    },
    {
        model: models.Customer,
        as: "targetCustomer",
        attributes: ["fullName", "phone"]
    },
    {
        model: models.Supplier,
        as: "targetSupplier",
        attributes: ["name", "phone"]
    },
    {
        model: models.User,
        as: "targetUser",
        attributes: ["fullName", "phone"]
    },
    {
        model: models.Branch,
        as: "targetBranch",
        attributes: ["name", "phone"]
    },
    {
        model: models.Branch,
        as: "branch",
        attributes: ["name", "phone"]
    }
];
const paymentAttributes = [
    "id", "code", "amount", "customerId",
    "createdBy", "orderId", "paymentMethod",
    "status", "transactionId", "createdAt",
    [Sequelize.literal(`(
        SELECT IFNULL(SUM(amount), 0)
        FROM payments AS sub
        WHERE sub.orderId = Payment.orderId AND sub.id < Payment.id
      )`), 'amountCollected']
]
const paymentIncludes = [
    {
        model: models.Order,
        as: "order",
        attributes: { exclude: ["orderId"] }
    }
]

const generateCode = (id, ballotType) => {
    const idString = id.toString();
    const paddedId = idString.padStart(9, '0');
    if (ballotType == transactionContant.BALLOTTYPE.EXPENSES) {
        return `CTM${paddedId}`;
    }
    return `TTM${paddedId}`;
}

module.exports.createTransaction = async (params) => {
    let { storeId, ballotType, code, paymentDate, typeId, value, userId, createdBy, target, targetId, isDebt, branchId, note, isPaymentOrder, orderPayment } = params;
    if (!paymentDate) {
        paymentDate = new Date();
    }
    if (value == 0) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Vui lòng nhập số tiền thu/chi lớn hơn 0`
        }
    }
    const typeExist = await models.TypeTransaction.findOne({
        where: {
            id: typeId,
            ballotType: ballotType,
            storeId
        }
    });
    if (!typeExist) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Mã loại thu/chi không tồn tại`
        }
    }
    const userCreatedExists = await models.User.findOne({
        where: {
            id: userId,
            storeId
        }
    });
    if (!userCreatedExists) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Mã nhân viên thu/chi không tồn tại`
        }
    }
    let newTransaction;
    const t = await models.sequelize.transaction(async (t) => {
        newTransaction = await models.Transaction.create({
            ballotType, code, paymentDate, typeId, value, userId, createdBy, target, targetId, isDebt, branchId, note, isPaymentOrder, orderPayment
        }, {
            transaction: t
        });

        if (!code) {
            await models.Transaction.update({
                code: generateCode(newTransaction.id, ballotType)
            }, {
                where: {
                    id: newTransaction.id,
                },
                transaction: t
            });
        }

    });
    //Thanh toán hóa đơn
    if (isPaymentOrder == true && orderPayment.length > 0) {
        if (target == transactionContant.TARGET.CUSTOMER) {
            for (const item of orderPayment) {
                await orderPaymentService.indexCreatePayment({
                    amount: item.amount,
                    orderId: item.orderId,
                    paymentMethod: "CASH",
                    createdBy: createdBy,
                    transactionId: newTransaction.id
                })
            }
        }
    }
    return {
        success: 1,
        data: {
            "id": newTransaction.id
        }
    }
}

module.exports.getAllTransaction = async (params) => {
    const { storeId, code, note, branchId, limit = 20, page = 1, ballotType, paymentDate, typeId, createdBy, userId, target, targetId, phone } = params;
    let where = {};
    if (phone) {
        where = {
            [Op.or]: [
                {
                    [Op.and]: [
                        { target: `${transactionContant.TARGET.CUSTOMER}` },
                        Sequelize.literal(`targetCustomer.phone LIKE '%${phone}%'`)
                    ]
                },
                {
                    [Op.and]: [
                        { target: `${transactionContant.TARGET.SUPPLIER}` },
                        Sequelize.literal(`targetSupplier.phone LIKE '%${phone}%'`)
                    ]
                },
                {
                    [Op.and]: [
                        { target: `${transactionContant.TARGET.OTHER}` },
                        Sequelize.literal(`targetOther.phone LIKE '%${phone}%'`)
                    ]
                },
                {
                    [Op.and]: [
                        { target: `${transactionContant.TARGET.USER}` },
                        Sequelize.literal(`targetUser.phone LIKE '%${phone}%'`)
                    ]
                },
                {
                    target: { [Op.eq]: `${transactionContant.TARGET.BRANCH}` }
                }
            ]
        }

    }
    if (code) {
        where.code = {
            [Op.like]: `%${code}%`
        }
    }
    if (note) {
        where.note = {
            [Op.like]: `%${note}%`
        }
    }
    if (branchId) {
        where.branchId = branchId;
    }
    if (ballotType) {
        where.ballotType = ballotType;
    }
    if (paymentDate) {
        where.paymentDate = utils.addFilterByDate([paymentDate["start"], paymentDate["end"]]);
    }
    if (typeId) {
        where.typeId = typeId;
    }
    if (createdBy) {
        where.createdBy = createdBy;
    }
    if (userId) {
        where.userId = userId;
    }
    if (target) {
        where.target = target;
    }
    if (targetId) {
        where.targetId = targetId;
    }

    const { rows, count } = await models.Transaction.findAndCountAll({
        where,
        attributes: transactionAttributes,
        include: transactionIncludes,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [["id", "DESC"]]
    });

    for (const row of rows) {
        const payments = await models.Payment.findAll({
            where: {
                transactionId: row.id
            }
        });
        row.dataValues.listOrderCode = [];
        if (payments && payments.length > 0) {
            for (const payment of payments) {
                const order = await models.Order.findOne({
                    where: {
                        id: payment.dataValues.orderId
                    },
                    attributes: ["id", "code"]
                });
                if (order) {
                    row.dataValues.listOrderCode.push(order.code);
                }
            }
        }
    }

    return {
        success: true,
        data: {
            items: rows,
            totalItem: count
        }
    }
}

module.exports.getDetailTransaction = async (params) => {
    const { storeId, id } = params;
    const transactionExists = await models.Transaction.findOne({
        where: {
            id: id
        },
        attributes: transactionAttributes,
        include: transactionIncludes
    });
    if (!transactionExists) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Mã giao dịch không chính xác`
        }
    }
    let listPayment = await models.Payment.findAll({
        where: {
            transactionId: id
        },
        include: paymentIncludes,
        attributes: paymentAttributes
    });
    listPayment.forEach(payment => {
        payment.dataValues.amountCollected = parseInt(payment.dataValues.amountCollected);
    });
    transactionExists.dataValues.listOrder = listPayment;
    return {
        success: true,
        data: transactionExists
    }
}

module.exports.updateTransaction = async (params) => {
    let { storeId, id = -1, paymentDate, value, note } = params;
    const transactionExists = await models.Transaction.findOne({
        where: {
            id
        }
    });
    if (!transactionExists) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Mã phiếu không tồn tại`
        }
    }
    let { ballotType, target, targetId, isDebt, isPaymentOrder } = transactionExists;
    if (isPaymentOrder) {
        if (value != transactionExists.value) {
            return {
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: `Mã giao dịch gắn với hóa đơn không thể thay đổi giá trị`
            }
        }
    }
    if (!paymentDate) {
        paymentDate = transactionExists.paymentDate;
    }
    if (!value && value != 0) {
        value = transactionExists.value;
    }
    if (!note) {
        note = transactionExists.note;
    }

    const t = await models.sequelize.transaction(async (t) => {
        await models.Transaction.update({
            paymentDate, value, note
        }, {
            where: {
                id
            },
            transaction: t
        });
    });
    return {
        success: true,
        data: null
    }
}

module.exports.deleteTransaction = async (params) => {
    let { id = -1 } = params;
    const transactionExists = await models.Transaction.findOne({
        where: {
            id
        }
    });
    if (!transactionExists) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Mã phiếu không tồn tại`
        }
    }
    let { isPaymentOrder } = transactionExists;
    const t = await models.sequelize.transaction(async (t) => {
        if (isPaymentOrder) {
            const payments = await models.Payment.findAll({
                where: {
                    transactionId: id
                }
            });
            for (const payment of payments) {
                await models.sequelize.transaction(async (t) => {
                    await models.Order.decrement({
                        cashOfCustomer: payment.amount
                    }, { where: { id: payment.orderId } })
                    await models.Payment.destroy({
                        where: {
                            id: payment.id
                        }
                    });
                    await models.CustomerDebt.decrement({
                        debtAmount: -payment.amount
                    }, { where: { orderId: payment.orderId }, transaction: t })
                })
            }
        }
        await models.Transaction.destroy({
            where: {
                id
            },
            transaction: t
        });
    });
    return {
        success: true,
        data: null
    }
}
