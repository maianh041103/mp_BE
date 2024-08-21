const Sequelize = require("sequelize");
const {Op} = Sequelize;
const models = require("../../../database/models");
const {HttpStatusCode} = require("../../helpers/errorCodes");
const {customerStatus, customerType, customerTypeOptions} = require("../customer/customerConstant");
const {generateCode} = require("../../helpers/codeGenerator");

module.exports.createAgencyService = async (result)=>{
    try {
        const {id} = result;
        const branchExists = await models.Branch.findOne({
            where:{
                id
            }
        });
        if(!branchExists) {
            return {
                error: true,
                message:`Không tìm thấy chi nhánh có id = ${id}`,
                code:HttpStatusCode.BAD_REQUEST
            }
        }
        const t = await models.sequelize.transaction(async (t)=>{
            await models.Branch.update({
                isAgency:true
            },{
                where:{
                    id
                },
                transaction: t
            });
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

