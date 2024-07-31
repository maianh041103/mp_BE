const Sequelize = require("sequelize");
const {Op} = Sequelize;
const models = require("../../../database/models");
const {HttpStatusCode} = require("../../helpers/errorCodes");
const {getImages} = require("../../helpers/getImages");
const marketConfigContant = require("../marketConfig/marketConfigContant")
const marketSellContant = require("./marketSellContant");
const {generateCode} = require("../../helpers/codeGenerator");

const marketProductInclude = [
    {
        model: models.Product,
        as: "product",
        include: [{
            model: models.GroupProduct,
            as: "groupProduct",
            attributes: ["id", "name"],
        }]
    },
    {
        model: models.MarketProductAgency,
        as: "agencys",
        attributes: ["id", "agencyId", "groupAgencyId", "price", "discountPrice"],
    },
    {
        model: models.User,
        as: "userCreated",
        attributes: ["id", "fullName"]
    },
    {
        model: models.User,
        as: "userUpdated",
        attributes: ["id", "fullName"]
    },
    {
        model: models.MarketProductBatch,
        as: "batches",
        attributes: ["id", "batchId", "quantity", "quantitySold"]
    },
    {
        model: models.Store,
        as: "store",
        include: [{
            model: models.Image,
            as: "logo"
        }]
    },
    {
        model: models.Branch,
        as: "branch",
        attributes: ["id", "name", "phone"]
    }
]
const marketAddressInclude = [
    {
        model: models.Ward,
        as: "ward",
        attributes: ["id", "name", "name2"]
    },
    {
        model: models.District,
        as: "district",
        attributes: ["id", "name", "name2"]
    },
    {
        model: models.Province,
        as: "province",
        attributes: ["id", "name", "name2"]
    },
    {
        model: models.Branch,
        as: "branch",
        attributes: ["id", "name"]
    }
];
const storeInclude = [
    {
        model: models.MarketProduct,
        as: "marketProduct",
        attributes: [],
        required: true
    },
    {
        model: models.Image,
        as: "logo"
    }
]
const cartInclude = [
    {
        model:models.MarketProduct,
        as: "marketProduct",
        attributes: ["id", "productId","images"],
        include:[{
            model:models.Product,
            as:"product",
            attributes:["id","name"]
        }]
    }
]
const marketOrderInclude = [
    {
        model:models.MarketOrderProduct,
        as:"marketOrderProduct",
        include:[
            {
                model:models.MarketProduct,
                as:"marketProduct"
            }
        ]
    },

]
module.exports.createAddressService = async (result) => {
    try {
        let {phone, wardId, districtId, provinceId, address, storeId, isDefaultAddress, branchId} = result;
        let newAddress;
        const branchExists = await models.Branch.findOne({
            where: {
                id: branchId,
                storeId
            }
        });
        if (!branchExists) {
            return {
                error: true,
                message: `Không tồn tại chi nhánh có id = ${branchId} trong cửa hàng id = ${storeId}`,
                code: HttpStatusCode.BAD_REQUEST
            }
        }
        const t = await models.sequelize.transaction(async (t) => {
            const store = await models.Store.findOne({
                where: {
                    id: storeId
                }
            });
            if (!phone) {
                phone = store.phone;
            }
            newAddress = await models.Address.create({
                phone, wardId, districtId, provinceId, address, branchId, isDefaultAddress
            }, {
                transaction: t
            });
            if (isDefaultAddress) {
                await models.Address.update({
                    isDefaultAddress: false
                }, {
                    where: {
                        branchId,
                        isDefaultAddress: true,
                        id: {
                            [Op.ne]: newAddress.id
                        }
                    },
                    transaction: t
                });
            }
        });
        return {
            success: true,
            data: {
                item: newAddress.id
            }
        }
    } catch (e) {
        return {
            error: true,
            message: `${e}`,
            code: HttpStatusCode.BAD_REQUEST
        }
    }
}

module.exports.getAllAddressService = async (result) => {
    try {
        const {branchId, isDefaultAddress, limit = 20, page = 1} = result;
        if (!branchId) {
            return {
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: "Vui lòng chọn chi nhánh"
            }
        }
        let where = {
            branchId
        };
        if (isDefaultAddress) {
            where.isDefaultAddress = isDefaultAddress;
        }
        const listAddress = await models.Address.findAll({
            where,
            include: marketAddressInclude,
            order: [["createdAt", "DESC"]],
            limit: parseInt(limit),
            offset: (parseInt(limit) * (parseInt(page) - 1))
        });
        const count = await models.Address.count({
            where,
            attributes: ["id"]
        });
        return {
            success: true,
            data: {
                items: listAddress,
                totalItem: count
            }
        }
    } catch (e) {
        return {
            error: true,
            message: `Lỗi ${e}`,
            code: HttpStatusCode.BAD_REQUEST
        }
    }
}

module.exports.getDetailAddressService = async (result) => {
    try {
        const {id, branchId} = result;
        const addressExists = await models.Address.findOne({
            where: {
                id, branchId
            },
            include: marketAddressInclude
        });
        if (!addressExists) {
            return {
                error: true,
                message: `Không tồn tại địa chỉ có id = ${id}`,
                code: HttpStatusCode.BAD_REQUEST
            }
        }
        return {
            success: true,
            data: {
                item: addressExists
            }
        }
    } catch (e) {
        return {
            error: true,
            message: `Lỗi ${e}`,
            code: HttpStatusCode.BAD_REQUEST
        }
    }
}

module.exports.updateAddressService = async (result) => {
    try {
        let {id, storeId, phone, wardId, districtId, provinceId, address, isDefaultAddress, branchId} = result;
        const addressExists = await models.Address.findOne({
            where: {
                id
            }
        });
        if (!branchId) {
            branchId = addressExists.branchId;
        }
        const branchExists = await models.Branch.findOne({
            where: {
                storeId,
                id: branchId
            }
        });
        if (!branchExists) {
            return {
                error: true,
                message: `Không tồn tại chi nhánh có id = ${branchId} trong cửa hàng id = ${storeId}`,
                code: HttpStatusCode.BAD_REQUEST
            }
        }
        if (!addressExists) {
            return {
                error: true,
                message: `Không tồn tại địa chỉ có id = ${id} của cửa hàng ${storeId}`,
                code: HttpStatusCode.BAD_REQUEST
            }
        }
        await models.Address.update({
            phone, wardId, districtId, provinceId, address, isDefaultAddress
        }, {
            where: {
                id
            }
        });
        if (isDefaultAddress) {
            await models.Address.update({
                isDefaultAddress: false
            }, {
                where: {
                    id: {
                        [Op.ne]: id
                    },
                    storeId,
                }
            })
        }
        return {
            success: true,
            data: null
        }
    } catch (e) {
        return {
            error: true,
            message: `Lỗi ${e}`,
            code: HttpStatusCode.BAD_REQUEST
        }
    }
}

module.exports.deleteAddressService = async (result) => {
    try {
        const {id} = result;
        const addressExists = await models.Address.findOne({
            where: {
                id
            }
        });
        if (!addressExists) {
            return {
                error: true,
                message: `Không tồn tại địa chỉ có id = ${id}`,
                code: HttpStatusCode.BAD_REQUEST
            }
        }
        await models.Address.destroy({
            where: {
                id
            }
        });
        return {
            success: true,
            data: null
        }
    } catch (e) {
        return {
            error: true,
            message: `Lỗi ${e}`,
            code: HttpStatusCode.BAD_REQUEST
        }
    }
}

module.exports.getDetailProductService = async (result) => {
    try {
        const {id, storeId} = result;
        const marketProduct = await models.MarketProduct.findOne({
            where: {
                id,
                storeId
            },
            include: marketProductInclude
        });
        if (!marketProduct) {
            return {
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: `Không tìm thấy sản phẩm có id = ${id} trên chợ`
            }
        }
        if (marketProduct.images) {
            marketProduct.dataValues.images = await getImages(marketProduct.images);
        }
        const listProduct = await models.MarketProduct.findAll({
            where: {
                marketType: marketConfigContant.MARKET_TYPE.COMMON,
                storeId: {
                    [Op.ne]: storeId
                }
            },
            include: [
                {
                    model: models.Product,
                    as: "product",
                    where: {
                        name: {
                            [Op.like]: marketProduct.product.name
                        }
                    }
                }
            ]
        });
        marketProduct.dataValues.productWillCare = listProduct;
        return {
            success: true,
            data: {
                item: marketProduct
            }
        }
    } catch (e) {
        return {
            error: true,
            message: `Lỗi ${e}`,
            code: HttpStatusCode.BAD_REQUEST
        }
    }
}

module.exports.getAllStoreService = async (result) => {
    try {
        const {storeId, limit = 10, page = 1} = result;
        const listStore = await models.Store.findAll({
            where: {
                id: {
                    [Op.ne]: storeId
                }
            },
            attributes: [
                "id", "name", "phone", "email", "field", "address", "wardId", "districtId", "provinceId", "logoId",
                [Sequelize.literal(`(SELECT COUNT(*) FROM market_products
    WHERE market_products.storeId = Store.id and market_products.deletedAt IS NULL)`), 'totalProduct'],
                [Sequelize.literal(`(SELECT SUM(market_products.quantitySold) FROM market_products
    WHERE market_products.storeId = Store.id and market_products.deletedAt IS NULL)`), 'totalQuantitySold']
            ],
            include: storeInclude,
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit)
        });
        for (let item of listStore) {
            item.dataValues.totalProduct = parseInt(item.dataValues.totalProduct);
            item.dataValues.totalQuantitySold = parseInt(item.dataValues.totalQuantitySold);
        }
        return {
            success: true,
            data: listStore
        }
    } catch (e) {
        return {
            error: true,
            message: `Lỗi ${e}`,
            code: HttpStatusCode.BAD_REQUEST
        }
    }
}

module.exports.addProductToCartService = async (result) => {
    try {
        let {storeId, branchId, marketProductId, quantity, price} = result;
        const branchExists = await models.Branch.findOne({
            where: {
                id: branchId,
                storeId
            }
        });
        if (!branchExists) {
            return {
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: `Không tồn tại chi nhánh có id = ${branchId} trong cửa hàng id = ${storeId}`
            }
        }
        const marketProductExists = await models.MarketProduct.findOne({
            where: {
                id: marketProductId
            }
        });
        if (!marketProductExists) {
            return {
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: `Không tồn tại sản phẩm có id = ${marketProductId} trên chợ`
            }
        }
        if (!price) {
            price = marketProductExists.price;
        }
        const productInCart = await models.Cart.findOne({
            where:{
                branchId,marketProductId
            }
        });
        let totalQuantity = productInCart.quantity + quantity;
        if (totalQuantity > marketProductExists.quantity - marketProductExists.quantitySold) {
            return {
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: `Số lượng thêm vào giỏ hàng không được lớn hơn số lượng bán`
            }
        }
        let resultId;
        if(!productInCart) {
            let newProductInCart = await models.Cart.create({
                branchId,
                marketProductId,
                quantity,
                price
            });
            resultId = newProductInCart.id;
        }else{
            resultId = productInCart.id;
            await models.Cart.update({
                quantity:totalQuantity
            },{
                where:{
                    branchId,marketProductId
                }
            });
        }
        return {
            success: true,
            data: {
                id:resultId
            }
        }
    } catch (e) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Lỗi ${e}`
        }
    }

}

module.exports.getProductInCartService = async (result)=>{
    try {
        const {branchId, storeId, limit = 20, page = 1} = result;
        if (!branchId) {
            return {
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: "Vui lòng chọn chi nhánh"
            }
        }
        const branchExists = await models.Branch.findOne({
            where:{
                id:branchId,storeId
            }
        });
        if(!branchExists){
            return{
                error:true,
                code:HttpStatusCode.BAD_REQUEST,
                message:`Không tồn tại chi nhánh có id = ${branchId} trong cửa hàng có id = ${storeId}`
            }
        }
        let where = {
            branchId
        };
        const listProductInCart = await models.Cart.findAll({
            where,
            include:cartInclude
        });
        for(let item of listProductInCart){
            let images = (item?.marketProduct?.images || "").split("/");
            if(images.length > 0){
                item.dataValues.image = (await models.Image.findOne({
                    where:{
                        id:images[0]
                    }
                }));
            }
        }
        return{
            success: true,
            data:{
                item: listProductInCart
            }
        }
    } catch (e) {
        return {
            error: true,
            message: `Lỗi ${e}`,
            code: HttpStatusCode.BAD_REQUEST
        }
    }
}

module.exports.updateQuantityProductInCartService = async (result)=>{
    try {
        const {id,storeId,quantity} = result;
        const cartExists = await models.Cart.findOne({
            where:{
                id
            }
        });
        if(!cartExists){
            return{
                error:true,
                code:HttpStatusCode.BAD_REQUEST,
                message: `Không tồn tai sản phẩm trong giỏ hàng`
            }
        }
        const marketProduct = await models.MarketProduct.findOne({
            where:{
                id:cartExists.marketProductId
            }
        });
        if(quantity > marketProduct.quantity - marketProduct.quantitySold){
            return{
                error:true,
                code:HttpStatusCode.BAD_REQUEST,
                message:"Số lượng thêm vào giỏ hàng không được lớn hơn số lượng bán"
            }
        }
        if(quantity === 0){
            await models.Cart.destroy({
                where:{
                    id
                }
            })
        }
        else {
            await models.Cart.update({
                quantity
            }, {
                where: {
                    id
                }
            });
        }
        return{
            success:true,
            data:null
        }
    }catch(e){
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message: `Lỗi ${e}`
        }
    }
}

module.exports.deleteProductInCartService = async (result)=>{
    try{
        const {id} = result;
        const productInCartExists = await models.Cart.findOne({
            where:{
                id
            }
        });
        if(!productInCartExists){
            return{
                error:true,
                code:HttpStatusCode.BAD_REQUEST,
                message:`Không tồn tại sản phẩm trong giỏ hàng`
            }
        }
        await models.Cart.destroy({
            where:{
                id
            }
        });
        return{
            success:true,
            data:null
        }
    }catch(e){

    }
}

module.exports.createMarketOrderService = async (result)=>{
    try{
        const {branchId, addressId, listProduct} = result;
        const addressExists = await models.Address.findOne({
            where:{
                id:addressId
            }
        });
        if(!addressExists){
            return{
                error:true,
                message:`Không tồn tại địa chỉ giao hàng có id = ${addressId}`,
                code:HttpStatusCode.BAD_REQUEST
            }
        }
        let newMarketOrder;
        const t = await models.sequelize.transaction(async (t)=>{
            newMarketOrder = await models.MarketOrder.create({
                branchId,addressId,
                address: addressExists.address,
                status:marketSellContant.STATUS_ORDER.PENDING
            },{
                transaction:t
            });
            const code = generateCode("DH",newMarketOrder.id);
            await models.MarketOrder.update({
                code
            },{
                where:{
                    id:newMarketOrder.id
                },
                transaction:t
            });
            for(const item of listProduct){
                const marketProductExists = await models.MarketProduct.findOne({
                    where:{
                        id:item.marketProductId
                    }
                });
                if(!marketProductExists){
                    throw new Error(`Không tồn tại sản phẩm trên chợ`);
                }
                await models.MarketOrderProduct.create({
                    marketProductId:item.marketProductId,
                    marketOrderId:newMarketOrder.id,
                    quantity:item.quantity,
                    price:marketProductExists.price
                },{
                    transaction:t
                });
            }
        })
        return {
            success:true,
            data:{
                item:newMarketOrder
            }
        }
    }catch(e){
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:`Lỗi ${e}`
        }
    }
}

module.exports.getMarketOrderService = async (result)=>{
    try{
        const {id,loginUser} = result;
        const marketOrder = await models.MarketOrder.findOne({

        })
    }catch(e){
        return{
            error:true,
            message:`Lỗi ${e}`,
            code:HttpStatusCode.BAD_REQUEST
        }
    }
}