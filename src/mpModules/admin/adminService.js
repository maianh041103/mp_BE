const Sequelize = require("sequelize");
const {Op} = Sequelize;
const models = require("../../../database/models");
const {HttpStatusCode} = require("../../helpers/errorCodes");
const {customerStatus, customerType, customerTypeOptions} = require("../customer/customerConstant");
const {generateCode} = require("../../helpers/codeGenerator");

module.exports.createAgencyService = async (result)=>{
    try {
        const {ids, storeId} = result;
        const t = await models.sequelize.transaction(async (t)=>{
            for(const id of ids) {
                const branchExists = await models.Branch.findOne({
                    where: {
                        id,
                        storeId
                    }
                });
                if (!branchExists) {
                    throw new Error(`Không tìm thấy chi nhánh có id = ${id} thuộc cửa hàng có id = ${storeId}`);
                }

                await models.Branch.update({
                    isAgency: true
                }, {
                    where: {
                        id
                    },
                    transaction: t
                });
            }
        });

        return{
            success:true,
            data:null
        }
    }catch(error){
        return{
            error:true,
            message:`Lỗi ${error}`,
            code:HttpStatusCode.BAD_REQUEST
        }
    }
}

