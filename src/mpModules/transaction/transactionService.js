const transactionContant = require("./transactionContant");
const Sequelize = require("sequelize");
const { Op } = Sequelize;
const models = require("../../../database/models");
const { HttpStatusCode } = require("../../helpers/errorCodes");

const generateCode = (id, ballotType) => {
    const idString = id.toString();
    const paddedId = idString.padStart(9, '0');
    if (ballotType == transactionContant.BALLOTTYPE.EXPENSES) {
        return `CTM${paddedId}`;
    }
    return `TTM${paddedId}`;
}

module.exports.createTransaction = async (params) => {
    let { storeId, ballotType, code, timeCreate, typeId, value, userId, object, peopleId, isDebt, branchId, note } = params;
    if (!timeCreate) {
        timeCreate = new Date().toISOString();
    }
    let newCashBook;
    const t = await models.sequelize.transaction(async (t) => {
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
        const userExists = await models.User.findOne({
            where: {
                id: userId,
                storeId
            }
        });
        if (!userExists) {
            return {
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: `Mã nhân viên không tồn tại`
            }
        }

        //Thu/chi tiền từ chi nhánh khác

        //End

        newTransaction = await models.Transaction.create({
            ballotType, code, timeCreate, typeId, value, userId, object, peopleId, isDebt, branchId, note
        });
        if (!code) {
            await models.CashBook.update({
                code: generateCode(newCashBook.id, ballotType)
            }, {
                where: {
                    id: newCashBook.id,
                },
                transaction: t
            });
        }
    });
    return {
        success: true,
        data: {
            "id": newTransaction.id
        }
    }
}