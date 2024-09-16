const Sequelize = require("sequelize");
const {Op} = Sequelize;
const models = require("../../../database/models");
const {HttpStatusCode} = require("../../helpers/errorCodes");
const marketConfigContant = require("./marketConfigContant");
const utils = require("../../helpers/utils");
const {getImages} = require("../../helpers/getImages");

const marketProductInclude = [
    {
        model: models.Product,
        as: "product",
        attributes: ["id", "name", "shortName", "code", "groupProductId","description"],
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
        include:[{
            model:models.RequestAgency,
            as:"agency",
            attributes: ["id"],
            include:[{
                model:models.Branch,
                as:"branch",
                attributes:["name","phone"]
            }]
        },{
            model:models.GroupAgency,
            as:"groupAgency",
            attributes: ["name"]
        }],
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
        model:models.Image,
        as:"imageCenter"
    },
    {
        model:models.ProductUnit,
        as:"productUnit",
        attributes: ["id","unitName","exchangeValue","code"]
    }
]

module.exports.createProductService = async (result) => {
    let {
        productId,
        marketType,
        price,
        discountPrice,
        quantity,
        status,
        description,
        images = [],
        isDefaultPrice,
        id,
        storeId,
        batches,
        agencys,
        branchId,
        thumbnail,
        productUnitId
    } = result;
    if(!productUnitId){
        return{
            error:true,
            message:"Vui lòng nhập đơn vị",
            code:HttpStatusCode.BAD_REQUEST
        }
    }
    const product = await models.Product.findOne({
        where: {
            id: productId,
            storeId
        }
    });
    if (!product) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: "Sản phẩm không tồn tại"
        }
    }
    const productUnitExists = await models.ProductUnit.findOne({
        where:{
            id:productUnitId,
            productId
        }
    });
    if(!productUnitExists){
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:"Không tìm thấy đơn vị của sản phẩm"
        }
    }
    if(!branchId){
        return {
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:"Vui lòng nhập thông tin chi nhánh"
        }
    }
    const branchExists = await models.Branch.findOne({
        where:{
            id:branchId,
            storeId
        }
    });
    if(!branchExists){
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:`Không tồn tại chi nhánh có id = ${branchId} thuộc cửa hàng id = ${storeId}`
        }
    }
    if(branchExists.isAgency === false && marketType === marketConfigContant.MARKET_TYPE.PRIVATE){
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:"Bạn không có quyền tạo sản phẩm trên chợ riêng. Vui lòng đăng ký làm đại lý"
        }
    }
    const marketProductExists = await models.MarketProduct.findOne({
        where:{
            branchId,
            productUnitId
        }
    });
    if(marketProductExists){
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:`Sản phẩm đã tồn tại trên chợ`
        }
    }
    if(!discountPrice || discountPrice <= 0){
        discountPrice = price;
    }
    let newMarketProduct;
    const t = await models.sequelize.transaction(async (t) => {
        const imageString = images.join("/");
        newMarketProduct = await models.MarketProduct.create({
            productId,productUnitId, quantity, marketType, price, discountPrice, status, description, isDefaultPrice, storeId,branchId,
            thumbnail,images: imageString, createdBy: id, updatedBy: id
        }, {
            transaction: t
        });
        if (product.isBatchExpireControl == 1) {
            if (!batches || batches.length == 0) {
                throw Error(
                    JSON.stringify({
                        error: true,
                        code: HttpStatusCode.BAD_REQUEST,
                        message: `Vui lòng nhập lô của sản phẩm`
                    })
                )
            } else {
                let totalQuantity = 0;
                for (const item of batches) {
                    totalQuantity += item.quantity;
                    await models.MarketProductBatch.create({
                        marketProductId: newMarketProduct.id,
                        batchId: item.batchId,
                        quantity: item.quantity,
                        storeId
                    }, {
                        transaction: t
                    });
                }
                if (totalQuantity != quantity) {
                    await models.MarketProduct.update({
                        quantity: totalQuantity
                    }, {
                        where: {
                            id: newMarketProduct.id
                        },
                        transaction: t
                    })
                }
            }
        }
        if (marketType === marketConfigContant.MARKET_TYPE.PRIVATE && isDefaultPrice === false) {
            for (const item of agencys) {
                if (item.groupId) {
                    const groupAgencyExists = await models.GroupAgency.findOne({
                        where: {
                            id: item.groupId,
                            branchId
                        }
                    });
                    if (!groupAgencyExists) {
                        throw Error(
                            JSON.stringify({
                                error: true,
                                code: HttpStatusCode.BAD_REQUEST,
                                message: `Không tồn tại nhóm đại lý có id = ${item.groupId}`
                            }));
                    }
                } else {
                    const agencyExists = await models.RequestAgency.findOne({
                        where: {
                            id: item.agencyId,
                            branchId
                        }
                    });
                    if (!agencyExists) {
                        throw Error(
                            JSON.stringify({
                                error: true,
                                code: HttpStatusCode.BAD_REQUEST,
                                message: `Không tồn tại đại lý có id = ${item.agencyId}`
                            }));
                    }
                }
                await models.MarketProductAgency.create({
                    marketProductId: newMarketProduct.id,
                    agencyId: item.agencyId,
                    groupAgencyId: item.groupId,
                    price: item.price,
                    discountPrice: item.discountPrice
                }, {
                    transaction: t
                });
            }
        }
    });
    return {
        success: true,
        data: newMarketProduct.id
    }
}

module.exports.getAllProductService = async (result) => {
    const {status, groupAgencyId, agencyId, keyword, groupProductId,
        type, createdAt, storeId, limit = 20, page = 1,
        isConfig, productType, loginUser, branchId, otherBranchId} = result;
    let {sortBy} = result;
    let marketProductIncludeTmp = [
        {
            model: models.Product,
            as: "product",
            attributes: ["id", "name", "shortName", "code", "groupProductId","description"],
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
            model:models.Image,
            as:"imageCenter"
        },
        {
            model:models.ProductUnit,
            as:"productUnit",
            attributes: ["id","unitName","exchangeValue"]
        }
    ]

    let where = {};
    if(isConfig){
        where.branchId = branchId;
    }else{
        where.branchId = {
            [Op.ne]:branchId
        }
    }
    if(otherBranchId){
        where.branchId = otherBranchId;
    }
    if (status) {
        where.status = status;
    }
    if (type) {
        where.marketType = type;
    }
    let includeCount = [];
    if (groupAgencyId || agencyId) {
        where.marketType = marketConfigContant.MARKET_TYPE.PRIVATE;
        let index = marketProductIncludeTmp.findIndex((item) => item.as === 'agencys');
        if (groupAgencyId) {
            marketProductIncludeTmp[index].where = {
                groupAgencyId
            }
        } else {
            marketProductIncludeTmp[index].where = {
                agencyId
            }
        }
        includeCount.push(marketProductIncludeTmp[index]);
    }
    if (groupProductId || keyword || productType) {
        let index = marketProductIncludeTmp.findIndex((item) => item.as === 'product');
        if (groupProductId) {
            marketProductIncludeTmp[index].where = {
                groupProductId
            }
        }
        if(keyword && keyword.trim() != ""){
            marketProductIncludeTmp[index].where = {
                name:{
                    [Op.like]:`%${keyword.trim()}%`
                }
            }
        }
        if(productType){
            marketProductIncludeTmp[index].where = {
                type:productType
            }
        }
        includeCount.push(marketProductIncludeTmp[index]);
    }
    if (createdAt) {
        where.createdAt = utils.addFilterByDate([createdAt.start, createdAt.end]);
    }

    if(!sortBy){
        sortBy = "createdAt";
    }

    let rows = await models.MarketProduct.findAll({
        where,
        include: marketProductIncludeTmp,
        order: [[sortBy, "DESC"]],
        limit:parseInt(limit),
        offset:(parseInt(page) - 1)*parseInt(limit)
    });

    for (let item of rows) {
        item.dataValues.images = await getImages(item.images);
    }
    let count = await models.MarketProduct.count({
        where,
        attributes: ["id"],
        include : includeCount
    })
    return {
        success: true,
        data: {
            items: rows,
            totalItem: count
        }
    }
}

module.exports.changeStatusProductService = async (result) => {
    const {id, status, storeId, branchId} = result;
    if(!branchId){
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:"Vui lòng truyền thông tin chi nhánh"
        }
    }
    const marketProductExists = await models.MarketProduct.findOne({
        where: {
            id, branchId
        }
    });
    if (!marketProductExists) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Không tìm thấy sản phẩm có id = ${id}`
        }
    }
    await models.MarketProduct.update({
        status
    }, {
        where: {
            id
        }
    });
    return {
        success: true,
        data: null
    }
}

module.exports.changeProductService = async (result) => {
    let {
        id,
        productId,
        marketType,
        price,
        discountPrice,
        quantity,
        status,
        description,
        images = [],
        isDefaultPrice,
        storeId,
        batches,
        agencys,
        loginUser,
        branchId,
        thumbnail,
        productUnitId
    } = result;
    const marketProductExists = await models.MarketProduct.findOne({
        where: {
            id,
            storeId
        }
    });
    if (!marketProductExists) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Không tồn tại sản phẩm trên chợ có id = ${id}`
        }
    }
    if(!productUnitId){
        productUnitId = marketProductExists.productUnitId;
    }
    if(!branchId){
        branchId = marketProductExists.branchId;
    }
    const branchExists = await models.Branch.findOne({
        where:{
            id:branchId,
            storeId
        }
    });
    if(!branchExists){
        return{
            error:true,
            message:`Không tồn tại chi nhánh co id = ${branchId} trong cửa hàng id = ${storeId}`,
            code:HttpStatusCode.BAD_REQUEST
        }
    }
    if(branchExists.isAgency === false && marketType === marketConfigContant.MARKET_TYPE.PRIVATE){
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:"Bạn không có quyền tạo sản phẩm trên chợ riêng. Vui lòng đăng ký làm đại lý"
        }
    }
    const product = await models.Product.findOne({
        where: {
            id: productId,
            storeId
        }
    });
    if (!product) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: "Sản phẩm không tồn tại"
        }
    }
    const productUnitExists = await models.ProductUnit.findOne({
        where:{
            id:productUnitId,
            productId
        }
    });
    if(!productUnitExists){
        return{
            error:true,
            message:"Đơn vị của sản phẩm không đúng",
            code:HttpStatusCode.BAD_REQUEST
        }
    }
    const t = await models.sequelize.transaction(async (t) => {
        images = images.join("/");
        if (marketType === marketConfigContant.MARKET_TYPE.COMMON || isDefaultPrice) {
            await models.MarketProductAgency.destroy({
                where: {
                    marketProductId: id
                },
                transaction: t
            });
        }
        if (marketType === marketConfigContant.MARKET_TYPE.PRIVATE && !isDefaultPrice) {
            const ids = agencys.filter(item => item.id !== undefined).map(subItem => {
                return subItem.id;
            })
            await models.MarketProductAgency.destroy({
                where: {
                    marketProductId: id,
                    id: {
                        [Op.notIn]: ids
                    }
                },
                transaction: t
            });
            for (const item of agencys) {
                const {agencyId, groupId, price, discountPrice} = item;
                const marketProductAgencyId = item.id;
                if (groupId) {
                    const groupAgencyExists = await models.GroupAgency.findOne({
                        where: {
                            id: groupId,
                            branchId
                        }
                    });
                    if (!groupAgencyExists) {
                        throw new Error(`Không tồn tại nhóm đại lý có id = ${groupId}`);
                    }
                } else {
                    const agencyExists = await models.RequestAgency.findOne({
                        where: {
                            id: agencyId,
                            branchId
                        }
                    });
                    if (!agencyExists) {
                        throw new Error(`Không tồn tại đại lý có id = ${agencyId}`);
                    }
                }
                if (marketProductAgencyId) {
                    const itemExists = await models.MarketProductAgency.findOne({
                        where: {
                            marketProductId: id,
                            id: marketProductAgencyId,
                        }
                    });
                    if (!itemExists) {
                        throw new Error(`Không tìm thấy đại lý - sản phẩm có id = ${marketProductAgencyId}`)
                    }
                    if(agencyId){
                        await models.MarketProductAgency.update({
                            agencyId, groupAgencyId: null, price, discountPrice
                        }, {where: {id: marketProductAgencyId}, transaction: t});
                    }else{
                        await models.MarketProductAgency.update({
                            agencyId:null, groupAgencyId: groupId, price, discountPrice
                        }, {where: {id: marketProductAgencyId}, transaction: t});
                    }
                } else {
                    await models.MarketProductAgency.create({
                        agencyId, groupAgencyId: groupId, price, discountPrice, marketProductId: id
                    }, {
                        transaction: t
                    })
                }
            }
        }

        let totalQuantity = quantity;
        if (product.isBatchExpireControl == 1) {
            if (!batches || batches.length == 0) {
                throw Error(
                    JSON.stringify({
                        error: true,
                        code: HttpStatusCode.BAD_REQUEST,
                        message: `Vui lòng nhập lô của sản phẩm`
                    })
                )
            } else {
                totalQuantity = 0;
                const batchIds = await batches.map(item => {
                    return item.batchId;
                });
                await models.MarketProductBatch.destroy({
                    where: {
                        batchId: {
                            [Op.notIn]: batchIds
                        },
                        marketProductId: id,
                    },
                    transaction: t
                })
                for (const item of batches) {
                    totalQuantity += item.quantity;
                    const itemExists = await models.MarketProductBatch.findOne({
                        where: {
                            batchId: item.batchId,
                            marketProductId: id
                        }
                    });
                    if (!itemExists) {
                        await models.MarketProductBatch.create({
                            marketProductId: id,
                            batchId: item.batchId,
                            quantity: item.quantity,
                            storeId
                        }, {
                            transaction: t
                        });
                    } else {
                        if (itemExists.quantity != item.quantity) {
                            await models.MarketProductBatch.update({
                                quantity: item.quantity,
                            }, {
                                where: {
                                    marketProductId: id,
                                    batchId: item.batchId,
                                },
                                transaction: t
                            })
                        }
                    }
                }
            }
        }
        await models.MarketProduct.update({
            productId,productUnitId, marketType, price, discountPrice, status, description, isDefaultPrice,
            images, updatedBy: loginUser.id, quantity: totalQuantity,branchId,thumbnail
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

module.exports.getDetailProductService = async (result) => {
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
            message: `Không tồn tại sản phẩm trên chợ có id = ${id}`
        }
    }
    marketProduct.dataValues.images = await getImages(marketProduct.images);
    return {
        success: true,
        data: {
            item: marketProduct
        }
    }
}

module.exports.deleteProductService = async (result) => {
    const {id} = result;
    const itemExists = await models.MarketProduct.findOne({
        where: {
            id
        }
    });
    if (!itemExists) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Không tồn tại sản phẩm trên chợ có id = ${id}`
        }
    }
    const findProductMarketOrder = await models.MarketOrderProduct.findOne({
        where:{
            marketProductId: id,
        }
    });
    if(findProductMarketOrder){
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Sản phẩm đã được đặt hàng, không thể xóa`
        }
    }
    const t = await models.sequelize.transaction(async (t) => {
        await models.MarketProductBatch.destroy({
            where: {
                marketProductId: id
            },
            transaction: t
        });
        await models.MarketProductAgency.destroy({
            where: {
                marketProductId: id
            },
            transaction: t
        });
        await models.MarketProduct.destroy({
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

module.exports.createRequestAgencyService = async (result) => {
    const {branchId, listAgency, storeId} = result;
    if(!branchId){
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:"Vui lòng truyền thông tin chi nhánh"
        }
    }
    const isExists = await models.RequestAgency.findOne({
        where: {
            branchId: {
                [Op.in]: listAgency
            },
            agencyId: branchId,
            status: {
                [Op.ne]: marketConfigContant.AGENCY_STATUS.CANCEL
            }
        }
    });
    if (isExists) {
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:`Tồn tại chi nhánh đã gửi follow`
        }
    }
    // Dang nhap tk 1 : 1 follow 2 => agency: 1 , branch : 2
    const t = await models.sequelize.transaction(async (t)=>{
        for (const item of listAgency) {
            const check = await models.RequestAgency.findOne({
                where:{
                    branchId: item,
                    agencyId: branchId,
                }
            });
            if(check){
                await models.RequestAgency.update({
                    status: marketConfigContant.AGENCY_STATUS.PENDING
                },{
                    where:{
                        branchId: item,
                        agencyId: branchId,
                    },
                    transaction:t
                });
            }
            else{
                await models.RequestAgency.create({
                    branchId: item,
                    agencyId: branchId,
                    status: marketConfigContant.AGENCY_STATUS.PENDING
                },{
                    transaction:t
                });
            }
        }
    })
    return {
        success: true,
        data: null
    }
}

module.exports.changeStatusAgencyService = async (result) => {
    const {id, storeId, status, groupAgencyId, branchId} = result;
    const requestAgency = await models.RequestAgency.findOne({
        where: {
            id, branchId
        }
    });
    if (!requestAgency) {
        return {
            error: true,
            message: "Không tìm thấy đại lý",
            code: HttpStatusCode.BAD_REQUEST
        };
    }
    if(groupAgencyId){
        const groupAgency = await models.GroupAgency.findOne({
            where:{
                id:groupAgencyId,
                branchId:branchId
            }
        });
        if(!groupAgency) {
            return {
                error: true,
                message: "Không tìm thấy nhóm đại lý",
                code: HttpStatusCode.BAD_REQUEST
            };
        }
    }
    await models.RequestAgency.update({
        status: status,
        groupAgencyId:groupAgencyId
    }, {
        where: {
            id
        }
    });
    return {
        success: true,
        data: null
    }
}

module.exports.getListAgencyService = async (query) => {
    let requestAgencyInclude = [
        {
            model: models.GroupAgency,
            as: "groupAgency",
            include: [
                {
                    model: models.User,
                    as: "userCreated",
                    attributes: ["id", "fullName"],
                },
                {
                    model: models.User,
                    as: "userUpdated",
                    attributes: ["id", "fullName"],
                },
                {
                    model:models.Branch,
                    as:"branch"
                }
            ],
        },
        {
            model:models.Branch,
            as:"branch",
            include:[{
                model:models.Store,
                as:"store"
            }]
        },
        {
            model:models.Branch,
            as:"agency",
            include:[{
                model:models.Store,
                as:"store"
            }]
        }
    ]

    const {status, limit = 10, page = 1, storeId, branchId, keyword} = query;
    if(!branchId){
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:"Vui lòng truyền thông tin chi nhánh"
        }
    }
    let where = {
        branchId
    };
    if (status) {
        where.status = status;
    }
    if(keyword){
        const index = requestAgencyInclude.findIndex(item=>item.as === "agency");
        requestAgencyInclude[index].where = {
            name: {
                [Op.like]: `%${keyword.trim()}%`
            }
        }
    }

    const {rows, count} = (await models.RequestAgency.findAndCountAll({
        where,
        include: requestAgencyInclude,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [['createdAt', 'DESC']]
    }))
    return {
        success: true,
        data: {
            items: rows,
            totalItem: count
        }
    }
}

module.exports.getStatusAgencyService = async (params)=>{
    try {
        const {id, storeId, branchId} = params;
        if(!branchId){
            return{
                error:true,
                code:HttpStatusCode.BAD_REQUEST,
                message:"Vui lòng truyền thông tin chi nhánh"
            }
        }
        const requestAgency = await models.RequestAgency.findOne({
            where:{
                branchId:id,
                agencyId:branchId
            }
        });
        let status = requestAgency?requestAgency.status:"false";
        return {
            success: true,
            data: {
                status
            }
        }
    }catch(e){
        return{
            error:true,
            status:status
        }
    }
}

module.exports.changeAgencyService = async (query) => {
    const {id, groupAgencyId, branchId} = query;
    if(!branchId){
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:"Vui lòng truyền thông tin chi nhánh"
        }
    }
    const agencyExists = await models.RequestAgency.findOne({
        where: {
            id,branchId
        }
    });
    if (!agencyExists) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Không tồn tại đại lý có id = ${id} trong cửa hàng`
        };
    }
    await models.RequestAgency.update(
        {
          groupAgencyId
        },
        {
        where: {
            id
        }
    });
    return {
        success: true,
        data: null
    }
}

module.exports.deleteAgencyService = async (query) => {
    const {id, branchId} = query;
    if(!branchId){
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:"Vui lòng truyền thông tin chi nhánh"
        }
    }
    const agencyExists = await models.RequestAgency.findOne({
        where: {
            [Op.or]: [
                {
                    [Op.and]: {
                        id,
                        branchId
                    }
                },
                {
                    [Op.and]: {
                        id,
                        agencyId: branchId
                    }
                }
            ]
        }
    });
    if (!agencyExists) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Không tồn tại đại lý có id = ${id} trong cửa hàng`
        };
    }
    await models.RequestAgency.destroy({
        where: {
            id
        }
    });
    return {
        success: true,
        data: null
    }
}

module.exports.createGroupAgencyService = async (result) => {
    const {name, description, storeId, loginUser, branchId} = result;
    if(!branchId){
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:"Vui lòng truyền thông tin chi nhánh"
        }
    }
    const branchExists = await models.Branch.findOne({
        where:{
            id:branchId,
            storeId
        }
    });
    if(!branchExists) {
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:`Không tồn tại chi nhánh id = ${branchId} trong cửa hàng storeId = ${storeId}`
        }
    }
    const newGroupAgency = await models.GroupAgency.create({
        name,
        description,
        branchId,
        createdBy: loginUser.id
    });
    return {
        success: true,
        data: {
            id: newGroupAgency.id
        }
    }
}

module.exports.getAllGroupAgencyService = async (result) => {
    const {storeId, keyword,branchId, limit = 10, page = 1} = result;
    if(!branchId){
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:"Vui lòng truyền thông tin chi nhánh"
        }
    }
    let where = {};
    if (keyword) {
        where = {
            name: {
                [Op.like]: `%${keyword}%`
            }
        }
    }
    where.branchId = branchId;
    const {rows, count} = await models.GroupAgency.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit),
        order: [["createdAt", "DESC"]]
    });
    return {
        success: true,
        data: {
            items: rows,
            totalItem: count
        }
    }
}

module.exports.getDetailGroupAgencyService = async (result) => {
    const {id, branchId} = result;
    if(!branchId){
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:"Vui lòng truyền thông tin chi nhánh"
        }
    }
    const groupAgency = await models.GroupAgency.findOne({
        where: {
            id, branchId
        }
    });
    if (!groupAgency) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Không tồn tại nhóm đại lý có id = ${id}`
        }
    }
    return {
        success: true,
        data: {
            item: groupAgency
        }
    }
}

module.exports.changeGroupAgencyService = async (result) => {
    const {description, loginUser, id, branchId} = result;
    if(!branchId){
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:"Vui lòng truyền thông tin chi nhánh"
        }
    }
    const groupAgencyExists = await models.GroupAgency.findOne({
        where: {
            branchId, id
        }
    });
    if (!groupAgencyExists) {
        return {
            error: true,
            message: `Không tồn tại nhóm đại lý có id = ${id}`,
            status: HttpStatusCode.BAD_REQUEST
        }
    }
    await models.GroupAgency.update({
        description,
        updatedBy: loginUser.id
    }, {
        where: {
            id
        }
    });
    return {
        success: true,
        data: null
    }
}

module.exports.deleteGroupAgencyService = async (result) => {
    const {id, storeId} = result;
    const groupAgencyExists = await models.GroupAgency.findOne({
        where: {
            id
        }
    });
    if (!groupAgencyExists) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Không tìm thấy nhóm đại lý có id = ${id}`
        }
    }
    await models.GroupAgency.destroy({
        where: {
            id
        }
    });
    return {
        success: true,
        data: null
    }
}

module.exports.createMarketImageService = async(result)=>{
    let {storeId,imageBannerId = [],imageTopId = [],imageBottomId = []} = result;
    imageBannerId = imageBannerId.join("/");
    imageBottomId = imageBottomId.join("/");
    imageTopId = imageTopId.join("/");
    const marketExists = await models.MarketImage.findOne({
        where:{
            storeId
        }
    });
    let id;
    if(!marketExists){
        const newMarketImage = await models.MarketImage.create({
            storeId,
            imageBottomId,
            imageBannerId,
            imageTopId
        });
        id = newMarketImage.id;
    }else{
        id = marketExists.id;
        await models.MarketImage.update({
            imageBottomId,
            imageBannerId,
            imageTopId
        },{
            where:{
                storeId
            }
        });
    }
    return{
        success:true,
        data:{
            id
        }
    }
}

module.exports.getAllMarketImageService = async (query)=>{
    const {storeId} = query;
    let listImage = await models.MarketImage.findOne({
        where:{
            storeId
        }
    });
    if(!listImage){
        return{
            error:true,
            message:"Không tìm thấy ảnh",
            code:HttpStatusCode.BAD_REQUEST
        }
    }
    listImage.dataValues.imageBanner = await models.Image.findAll({
        where:{
            id:{
                [Op.in]:listImage.imageBannerId.split("/")
            }
        }
    });
    listImage.dataValues.imageTop = await models.Image.findAll({
        where:{
            id:{
                [Op.in]:listImage.imageTopId.split("/")
            }
        }
    });
    listImage.dataValues.imageBottom = await models.Image.findAll({
        where:{
            id:{
                [Op.in]:listImage.imageBottomId.split("/")
            }
        }
    });
    return{
        success:true,
        data:{
            items: listImage
        }
    }
}

module.exports.deleteMarketImageService = async (params)=>{
    const {storeId,id} = params;
    const imageExists = await models.MarketImage.findOne({
        where:{
            storeId,id
        }
    });
    if(!imageExists) {
        return{
            error:true,
            code:HttpStatusCode.BAD_REQUEST,
            message:`Không tồn tại ảnh có id = ${id} ở cửa hàng có id = ${storeId}`
        }
    }
    await models.MarketImage.destroy({
        where:{
            id
        }
    });
    return{
        success:true,
        data:null
    }
}
