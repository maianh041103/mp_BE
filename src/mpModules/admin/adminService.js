const Sequelize = require("sequelize");
const {Op} = Sequelize;
const models = require("../../../database/models");
const {HttpStatusCode} = require("../../helpers/errorCodes");
const {customerStatus, customerType, customerTypeOptions} = require("../customer/customerConstant");
const {generateCode} = require("../../helpers/codeGenerator");

const handlerCreateCustomer = async ({branchExists,t})=>{
    const newCustomer = await models.Customer.create({
        fullName: branchExists.name,
        phone: branchExists.phone,
        code:branchExists.code,
        address: branchExists.address1,
        type: customerType.Agency,
        status: branchExists.status === 1 ? customerStatus.ACTIVE : customerStatus.INACTIVE,
        wardId: branchExists.wardId,
        districtId: branchExists.districtId,
        provinceId: branchExists.provinceId,
        createdAt: new Date(),
        storeId:branchExists.storeId,
        branchId:branchExists.id
    },{
        transaction:t
    });
    const code = generateCode("KH",newCustomer.id);
    await models.Customer.update({
        code,
    },{
        where:{
            id:newCustomer.id
        },
        transaction:t
    })
}

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

            await handlerCreateCustomer({branchExists,t});

            await models.Address.create({
                fullName: branchExists.name,
                phone: branchExists.phone,
                wardId: branchExists.wardId,
                districtId: branchExists.districtId,
                provinceId: branchExists.provinceId,
                address:branchExists.address1,
                isDefaultAddress:true,
                branchId:branchExists.id,
                createdAt:new Date()
            },{
                transaction:t
            })
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

