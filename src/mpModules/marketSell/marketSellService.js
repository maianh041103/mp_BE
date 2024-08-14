const Sequelize = require("sequelize");
const {Op} = Sequelize;
const models = require("../../../database/models");
const {HttpStatusCode} = require("../../helpers/errorCodes");
const {getImages} = require("../../helpers/getImages");
const marketConfigContant = require("../marketConfig/marketConfigContant")
const marketSellContant = require("./marketSellContant");
const {generateCode} = require("../../helpers/codeGenerator");
const {createWarehouseCard} = require("../warehouse/warehouseService");
const {warehouseStatus} = require("../warehouse/constant");

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
        model: models.Image,
        as: "imageCenter"
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
        attributes: [
            "id", "name", "phone", "email", "field", "address", "wardId", "districtId", "provinceId", "logoId",
            [Sequelize.literal(`(SELECT COUNT(*) FROM market_products
    WHERE market_products.storeId = store.id and market_products.deletedAt IS NULL)`), 'totalProduct'],
            [Sequelize.literal(`(SELECT SUM(market_products.quantitySold) FROM market_products
    WHERE market_products.storeId = store.id and market_products.deletedAt IS NULL)`), 'totalQuantitySold']
        ],
        include: [{
            model: models.Image,
            as: "logo"
        }]
    },
    {
        model: models.Branch,
        as: "branch",
        attributes: ["id", "name", "phone"]
    },
    {
        model: models.ProductUnit,
        as: "productUnit",
        attributes: ["id", "unitName", "exchangeValue"]
    }
];
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
];
const cartInclude = [
    {
        model: models.MarketProduct,
        as: "marketProduct",
        include: [{
            model: models.Product,
            as: "product",
            attributes: ["id", "name"]
        }, {
            model: models.ProductUnit,
            as: "productUnit",
            attributes: ["id", "exchangeValue", "unitName"]
        }, {
            model: models.Store,
            as: "store",
            attributes: ["id", "name"]
        }, {
            model: models.Image,
            as: "imageCenter"
        }, {
            model: models.Branch,
            as: "branch",
            attributes: ["id", "name"]
        }]
    }
];
const marketOrderInclude = [
    {
        model: models.MarketOrderProduct,
        as: "products",
        include: [
            {
                model: models.MarketProduct,
                as: "marketProduct",
                attributes: ["id","thumbnail"],
                include: [
                    {
                        model: models.Product,
                        as: "product",
                        attributes: ["id", "name"]
                    },
                    {
                        model: models.ProductUnit,
                        as: "productUnit",
                        attributes: ["id", "unitName", "exchangeValue"]
                    },
                    {
                        model: models.Image,
                        as:"imageCenter"
                    }
                ]
            }
        ]
    },
    {
        model: models.Branch,
        as: "branch",
        attributes: ["id", "name", "phone", "address1", "address2"],
        include: [
            {
                model: models.Store,
                as: "store",
                attributes: ["id", "name"]
            }
        ]
    },
    {
        model: models.Branch,
        as: "toBranch",
        attributes: ["id", "name", "phone", "address1", "address2"],
        include: [
            {
                model: models.Store,
                as: "store",
                attributes: ["id", "name"]
            }
        ]
    },
    {
        model: models.HistoryPurchase,
        as: "historyPurchase",
        attributes: ["id", "status", "time", "note"]
    },
    {
        model:models.Ward,
        as:"ward",
        attributes: ["name", "name2"]
    },
    {
        model:models.District,
        as:"district",
        attributes: ["name", "name2"]
    },
    {
        model:models.Province,
        as:"province",
        attributes: ["name", "name2"]
    }
];

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
                    branchId,
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
            },
            include: marketProductInclude,
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
                    [Op.eq]: marketProduct.storeId
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
                },
                {
                    model: models.ProductUnit,
                    as: "productUnit",
                    attributes: ["id", "exchangeValue", "unitName"]
                },
                {
                    model: models.Image,
                    as: "imageCenter"
                }
            ]
        });
        marketProduct.dataValues.productWillCare = listProduct;
        if (marketProduct.store) {
            marketProduct.dataValues.store.dataValues.totalProduct = parseInt(marketProduct.dataValues.store.dataValues.totalProduct);
            marketProduct.dataValues.store.dataValues.totalQuantitySold = parseInt(marketProduct.dataValues.store.dataValues.totalQuantitySold);
        }
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

        const count = await models.Store.count({
            where:{
                id: {
                    [Op.ne]: storeId
                },
                [Op.and]: Sequelize.literal(`EXISTS (
                SELECT 1 
                FROM market_products 
                WHERE market_products.storeId = Store.id 
                AND market_products.deletedAt IS NULL
            )`)
            },
        })
        for (let item of listStore) {
            item.dataValues.totalProduct = parseInt(item.dataValues.totalProduct);
            item.dataValues.totalQuantitySold = parseInt(item.dataValues.totalQuantitySold);
        }
        return {
            success: true,
            data: {
                items: listStore,
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

module.exports.getDetailStoreService = async (result) => {
    try {
        const {storeId, id} = result;
        const store = await models.Store.findOne({
            where: {
                id
            },
            attributes: [
                "id", "name", "phone", "email", "field", "address", "wardId", "districtId", "provinceId", "logoId",
                [Sequelize.literal(`(SELECT COUNT(*) FROM market_products
    WHERE market_products.storeId = Store.id and market_products.deletedAt IS NULL)`), 'totalProduct'],
                [Sequelize.literal(`(SELECT SUM(market_products.quantitySold) FROM market_products
    WHERE market_products.storeId = Store.id and market_products.deletedAt IS NULL)`), 'totalQuantitySold']
            ],
            include: storeInclude
        });
        store.dataValues.totalProduct = parseInt(store.dataValues.totalProduct);
        store.dataValues.totalQuantitySold = parseInt(store.dataValues.totalQuantitySold);
        return {
            success: true,
            data: store
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
            where: {
                branchId, marketProductId
            }
        });
        let totalQuantity;
        if (productInCart) {
            totalQuantity = productInCart.quantity + quantity;
        }
        if (totalQuantity > marketProductExists.quantity - marketProductExists.quantitySold) {
            return {
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: `Số lượng thêm vào giỏ hàng không được lớn hơn số lượng bán`
            }
        }
        let resultId;
        if (!productInCart) {
            let newProductInCart = await models.Cart.create({
                branchId,
                marketProductId,
                quantity,
                price
            });
            resultId = newProductInCart.id;
        } else {
            resultId = productInCart.id;
            await models.Cart.update({
                quantity: totalQuantity
            }, {
                where: {
                    branchId, marketProductId
                }
            });
        }
        return {
            success: true,
            data: {
                id: resultId
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

module.exports.getProductInCartService = async (result) => {
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
            where: {
                id: branchId, storeId
            }
        });
        if (!branchExists) {
            return {
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: `Không tồn tại chi nhánh có id = ${branchId} trong cửa hàng có id = ${storeId}`
            }
        }
        let where = {
            branchId
        };
        const listProductInCart = await models.Cart.findAll({
            where,
            include: cartInclude
        });
        let listProductGroupByBranch = [];
        for (let item of listProductInCart) {
            let images = (item?.marketProduct?.images || "").split("/");
            if (images.length > 0) {
                item.dataValues.image = (await models.Image.findOne({
                    where: {
                        id: images[0]
                    }
                }));
            }

            let index = listProductGroupByBranch.findIndex(tmp => {
                return tmp.branchId === item?.marketProduct?.branchId;
            });
            if (index > -1) {
                listProductGroupByBranch[index].products.push(item);
            } else {
                listProductGroupByBranch.push({
                    branchId: item?.marketProduct?.branchId,
                    products: [item]
                })
            }
        }
        return {
            success: true,
            data: {
                item: listProductGroupByBranch
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

module.exports.updateQuantityProductInCartService = async (result) => {
    try {
        const {id, storeId, quantity} = result;
        const cartExists = await models.Cart.findOne({
            where: {
                id
            }
        });
        if (!cartExists) {
            return {
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: `Không tồn tai sản phẩm trong giỏ hàng`
            }
        }
        const marketProduct = await models.MarketProduct.findOne({
            where: {
                id: cartExists.marketProductId
            }
        });
        if (quantity > marketProduct.quantity - marketProduct.quantitySold) {
            return {
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: "Số lượng thêm vào giỏ hàng không được lớn hơn số lượng bán"
            }
        }
        if (quantity === 0) {
            await models.Cart.destroy({
                where: {
                    id
                }
            })
        } else {
            await models.Cart.update({
                quantity
            }, {
                where: {
                    id
                }
            });
        }
        return {
            success: true,
            data: null
        }
    } catch (e) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Lỗi ${e}`
        }
    }
}

module.exports.deleteProductInCartService = async (result) => {
    try {
        const {id} = result;
        const productInCartExists = await models.Cart.findOne({
            where: {
                id
            }
        });
        if (!productInCartExists) {
            return {
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: `Không tồn tại sản phẩm trong giỏ hàng`
            }
        }
        await models.Cart.destroy({
            where: {
                id
            }
        });
        return {
            success: true,
            data: null
        }
    } catch (e) {

    }
}

module.exports.createMarketOrderService = async (result) => {
    try {
        const {branchId, addressId, listProduct, toBranchId} = result;
        const addressExists = await models.Address.findOne({
            where: {
                id: addressId
            }
        });
        if (!addressExists) {
            return {
                error: true,
                message: `Không tồn tại địa chỉ giao hàng có id = ${addressId}`,
                code: HttpStatusCode.BAD_REQUEST
            }
        }
        let newMarketOrderBuy;
        const t = await models.sequelize.transaction(async (t) => {
            newMarketOrderBuy = await models.MarketOrder.create({
                branchId, addressId,
                address: addressExists.address,
                districtId:addressExists.districtId,
                wardId:addressExists.wardId,
                provinceId:addressExists.provinceId,
                status: marketSellContant.STATUS_ORDER.PENDING,
                phone: addressExists.phone,
                toBranchId: toBranchId
            }, {
                transaction: t
            });
            const code = generateCode("MK", newMarketOrderBuy.id);
            newMarketOrderBuy.code = code;
            await models.MarketOrder.update({
                code
            }, {
                where: {
                    id: newMarketOrderBuy.id
                },
                transaction: t
            });

            for (const item of listProduct) {
                let marketProductExists = await models.MarketProduct.findOne({
                    where: {
                        id: item.marketProductId,
                    }
                });
                if (!marketProductExists) {
                    throw new Error(`Không tồn tại sản phẩm trên chợ`);
                }
                await models.MarketOrderProduct.create({
                    marketProductId: item.marketProductId,
                    marketOrderId: newMarketOrderBuy.id,
                    quantity: item.quantity,
                    price: marketProductExists.discountPrice
                }, {
                    transaction: t
                });

                await models.Cart.destroy({
                    where: {
                        marketProductId: item.marketProductId,
                        branchId
                    },
                    transaction: t
                })
            }
        })
        return {
            success: true,
            data: {
                item: newMarketOrderBuy
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

module.exports.getDetailMarketOrderService = async (result) => {
    try {
        const {id} = result;
        const marketOrder = await models.MarketOrder.findOne({
            where: {
                id
            },
            include: marketOrderInclude
        });
        if (!marketOrder) {
            return {
                error: true,
                message: `Không tồn tại đơn hàng có id = ${id}`,
                code: HttpStatusCode.BAD_REQUEST
            }
        }
        return {
            success: true,
            data: {
                item: marketOrder
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

module.exports.getAllMarketOrderService = async (result) => {
    try {
        const {limit = 10, page = 1, type, branchId, status} = result;
        let where = {}
        if (type === marketSellContant.MARKET_ORDER_TYPE.BUY) {
            where.branchId = branchId;
        }
        if (type === marketSellContant.MARKET_ORDER_TYPE.SELL) {
            where.toBranchId = branchId;
        }
        if (status) {
            where.status = status;
        }
        const rows = await models.MarketOrder.findAll({
            where,
            include: marketOrderInclude,
            limit: parseInt((limit)),
            offset: (parseInt(page) - 1) * parseInt(limit),
            order: [["createdAt", "DESC"]]
        });
        const count = await models.MarketOrder.count({
            where
        });
        return {
            success: true,
            data: {
                items: rows,
                totalItem: count
            }
        }
    } catch (e) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `Loi ${e}`
        }
    }

}

module.exports.changeStatusMarketOrderService = async (result) => {
    try {
        let {id, status, note, products, delivery, loginUser} = result;
        const marketOrderExists = await models.MarketOrder.findOne({
            where: {
                id,
            },
            include: marketOrderInclude
        });
        if (!marketOrderExists) {
            return {
                error: true,
                code: HttpStatusCode.BAD_REQUEST,
                message: "Không tìm thấy đơn hàng"
            }
        }
        const t = await models.sequelize.transaction(async (t) => {
            await models.MarketOrder.update({
                status
            }, {
                where: {
                    id
                },
                transaction: t
            });
            await models.HistoryPurchase.create({
                marketOrderId: id,
                status,
                time: new Date(),
                createdBy:loginUser.id,
                note
            }, {
                transaction: t
            });
            //Processing : Tạo mã seri và chon lô cho sản phẩm bán
            if(status === marketSellContant.STATUS_ORDER.PROCESSING){
                for (const item of products) {
                    let series = item?.listSeri.map(seri=>{
                        return{
                            code:seri,
                            marketOrderId:id,
                            marketProductId:item?.marketProductId,
                            createdBy:loginUser.id
                        }
                    });
                    if (Array.isArray(series) && series.length > 0) {
                        await models.Seri.bulkCreate(series, {
                            transaction: t
                        })
                    }
                    if(item?.batches && item?.batches.length > 0) {
                        for (const batch of item?.batches) {
                            await models.MarketOrderBatch.create({
                                marketOrderId: id,
                                marketProductId: item.marketProductId,
                                batchId: batch.batchId,
                                quantity: batch.quantity
                            }, {
                                transaction: t
                            });
                        }
                    }
                }
            }
            let number;
            if (status === marketSellContant.STATUS_ORDER.SEND || status === marketSellContant.STATUS_ORDER.CANCEL) {
                if (status === marketSellContant.STATUS_ORDER.SEND) {
                    number = -1;
                    let endDate = new Date();
                    endDate.setDate(endDate.getDate() + marketSellContant.TIME_SHIP.TWO);
                    await models.Delivery.create({
                        code:delivery.code,
                        price:delivery.price,
                        name:delivery.name,
                        startDate:new Date(),
                        endDate
                    },{
                        transaction:t
                    })
                } else {
                    number = 1;
                    await models.Seri.destroy({
                        where:{
                            marketOrderId:id
                        }
                    },{
                        transaction:t
                    });
                }
                for (const item of marketOrderExists.products) {
                    await models.MarketProduct.increment({
                        quantity: item.quantity * number,
                        quantitySold: item.quantity * number * (-1)
                    }, {
                        where: {
                            id: item.marketProductId
                        },
                        transaction: t
                    });
                    await models.Inventory.increment({
                        quantity: item.quantity * number * item?.marketProduct?.productUnit?.exchangeValue
                    }, {
                        where: {
                            productId: item?.marketProduct?.product?.id,
                            branchId: marketOrderExists.toBranchId
                        },
                        transaction: t
                    });
                    const inventory = await models.Inventory.findOne({
                        where: {
                            productId: item?.marketProduct?.product?.id,
                            branchId: marketOrderExists.toBranchId
                        },
                        transaction: t
                    });
                    await models.WarehouseCard.create({
                            code: marketOrderExists.code,
                            type: warehouseStatus.SALE_MARKET,
                            productId: item?.marketProduct?.product?.id,
                            branchId: marketOrderExists.toBranchId,
                            changeQty: item.quantity * number * item?.marketProduct?.productUnit?.exchangeValue,
                            remainQty: inventory.quantity,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }, {
                            transaction: t
                        }
                    )
                }
                const listMarketOrderBatch = await models.MarketOrderBatch.findAll({
                    where: {
                        marketOrderId: id
                    }
                });

                //Tao products
                products = [];
                for (const item of listMarketOrderBatch) {
                    const index = products.findIndex(product => product.marketProductId === item.marketProductId);
                    if (index === -1) {
                        products.push({
                            marketProductId: item.marketProductId,
                            batches: [
                                {
                                    batchId: item.batchId,
                                    quantity: item.quantity
                                }
                            ]
                        })
                    } else {
                        products[index].batches.push({
                            batchId: item.batchId,
                            quantity: item.quantity
                        })
                    }
                }

                if (products) {
                    for (const item of products) {
                        const {marketProductId, batches} = item;
                        let totalQuantity = batches.reduce((cal, item) => {
                            return cal + item.quantity;
                        }, 0);
                        const marketOrderProduct = await models.MarketOrderProduct.findOne({
                            where: {
                                marketOrderId: id,
                                marketProductId
                            }
                        });
                        if (totalQuantity != marketOrderProduct.quantity) {
                            throw new Error("Số lượng không hợp lệ");
                        }
                        for (const batch of batches) {
                            await models.MarketProductBatch.increment({
                                quantity: batch.quantity * number,
                                quantitySold: batch.quantity * number * (-1)
                            }, {
                                where: {
                                    marketProductId,
                                    batchId: batch.batchId
                                },
                                transaction: t
                            });

                            await models.Batch.increment(
                                {
                                    quantity: batch.quantity * number
                                },
                                {
                                    where: {
                                        id: batch.batchId
                                    },
                                    transaction: t
                                }
                            )
                        }
                    }
                }
            }
        })
        return {
            success: true,
            data: null
        }
    } catch (e) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `${e}`
        }
    }
}

module.exports.getProductPrivateService = async (result) => {
    try {
        const {storeId, limit = 10, page = 1, keyword} = result;
        let include = [
            {
                model: models.Store,
                as: "store",
                include: [{
                    model: models.RequestAgency,
                    as: "agencys",
                    where: {
                        agencyId: storeId,
                        status: marketConfigContant.AGENCY_STATUS.ACTIVE
                    }
                }]
            },
            {
                model: models.MarketProductAgency,
                as: "agencys",
                where: Sequelize.literal('(`agencys`.`agencyId` = `store->agencys`.`id` OR `agencys`.`groupAgencyId` = `store->agencys`.`groupAgencyId`) AND `agencys`.`marketProductId` = `MarketProduct`.`id`'),
                required: false
            }
        ];
        let where = {
            storeId: {
                [Op.ne]: storeId
            },
            marketType: marketConfigContant.MARKET_TYPE.PRIVATE,
        };
        if (keyword && keyword.trim() !== "") {
            include.push({
                model: models.Product,
                as: "product",
                where: {
                    name: {
                        [Op.like]: `%${keyword.trim()}%`
                    }
                },
                attributes: ["name"]
            })
        }
        const listMarketProduct = await models.MarketProduct.findAll({
            where,
            include,
            limit: parseInt(limit),
            page: (parseInt(page) - 1) * (parseInt(limit))
        });
        const index = include.findIndex(item => {
            return item.as === "agencys";
        });
        include.splice(index, 1);
        console.log(include);
        const count = await models.MarketProduct.count({
            where,
            include
        });
        for (const marketProduct of listMarketProduct) {
            if (marketProduct.agencys.length > 0) {
                let index = marketProduct.agencys.findIndex(item => {
                    return item.agencyId !== null;
                });
                if (index === -1) index = 0;
                marketProduct.dataValues.price = marketProduct.dataValues.agencys[index].dataValues.price;
                marketProduct.dataValues.discountPrice = marketProduct.dataValues.agencys[index].discountPrice;
            }
        }
        return {
            success: true,
            data: {
                items: listMarketProduct,
                totalItem: count
            }
        }
    } catch (e) {
        return {
            error: true,
            code: HttpStatusCode.BAD_REQUEST,
            message: `${e}`
        }
    }
}