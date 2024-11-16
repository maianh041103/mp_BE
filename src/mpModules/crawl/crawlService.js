const models = require('../../../database/models/index');
const { HttpStatusCode } = require('../../helpers/errorCodes');
const { Sequelize, Op, where } = require("sequelize");
const _ = require("lodash");
const axios = require('axios');
const categoryContant = require("./categoryContant");
const {getNextValue} = require("../product/productCodeService");
const codeGenerator = require("../../helpers/codeGenerator");
const {generateCode} = require("../../helpers/codeGenerator");
const {addSourceMappingUrl} = require("@babel/cli/lib/babel/util");
const {productStatuses} = require("../product/productConstant");
const marketConfigContant = require("../marketConfig/marketConfigContant");

const createCategories = async (categories, storeId, t) => {
    const payload = categories.map(item=>
    {
        return{
            name:item.name,
            slug:item.name,
            storeId
        }
    });
    await models.GroupProduct.bulkCreate(payload,
        {
            transaction: t
        });
}

module.exports.createFromMedicineMarket = async (payload) => {
    await models.sequelize.transaction(async (t) => {
        const {token, storeId} = payload;
        const categories = categoryContant.categories;
        await createCategories(categories, storeId, t);
        const apiUrl = `https://chothuoc24h.vn/searchProduct`;

        for (const category of categories) {
            let currentPage = 1;
            while (true) {
                const body = new URLSearchParams();
                body.append('page', currentPage);
                body.append('categoryId', category.id);
                const response = await axios.post(apiUrl, body, {
                    headers: {
                        'Accept': '*/*',
                        'Accept-Language': 'vi-VN,vi;q=0.9,fr-FR;q=0.8,fr;q=0.7,en-US;q=0.6,en;q=0.5',
                        'Connection': 'keep-alive',
                        'Cookie': token,
                        'Origin': 'https://chothuoc24h.vn',
                        'Referer': `https://chothuoc24h.vn/tim-kiem.html?category=${category.id}`,
                        'Sec-Fetch-Dest': 'empty',
                        'Sec-Fetch-Mode': 'cors',
                        'Sec-Fetch-Site': 'same-origin',
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
                        'X-CSRF-TOKEN': 'e8LHxltrHQnxKIpZT29U1LOXeR2lQGlu9wf5qMqY',
                        'X-Requested-With': 'XMLHttpRequest',
                        'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Windows"'
                    }
                });
                const products = response.data;
                const productToSave = await Promise.all(products.data.map(async (product) => {
                    const nextValue = await getNextValue(storeId, 1);
                    const code = generateCode("TH", nextValue);
                    return {
                        name: product.name,
                        shortName: product.common_name ? product.common_name : product.name,
                        slug: product.name,
                        code,
                        barCode:code,
                        groupProductId: category.id,
                        imageUrl: `https://chothuoc24h.vn/storage/${product.image}`,
                        price: product.price,
                        storeId: storeId,
                        type: 1,
                        drugCode: "",
                        status: productStatuses.ACTIVE,
                        inventory: 0,
                        baseUnit: product.unit || "",
                    };
                }));
                const newProducts = await models.Product.bulkCreate(productToSave,{
                    transaction: t
                });
                const unitToSave = newProducts.map(item=>{
                        return{
                            productId: item.id,
                            unitName: item.baseUnit,
                            exchangeValue: 1,
                            price: item.price,
                            isDirectSale: item.isDirectSale || false,
                            isBaseUnit: true,
                            quantity: item.quantity || 0,
                            code: item.code,
                            barCode: item.barCode || "",
                            storeId: item.storeId
                        }
                });
                const newUnits = await models.ProductUnit.bulkCreate(unitToSave,{
                    transaction: t
                });
                const marketProductToSave = newUnits.map(item=>{
                    return {
                        productId: item.productId,
                        productUnitId: item.id,
                        quantity: 0,
                        marketType: marketConfigContant.MARKET_TYPE.COMMON,
                        price: item.price,
                        discountPrice: 0,
                        status: marketConfigContant.PRODUCT_MARKET_STATUS.ACTIVE,
                        isDefaultPrice: true,
                        storeId: item.storeId
                    }
                });
                await models.MarketProduct.bulkCreate(marketProductToSave,{
                    transaction:t
                });
                if (currentPage === products.totalPages) {
                    break;
                }
                currentPage++;
            }
        }
    });

    return {
        success:true,
        data:null
    }
}

module.exports.createFromWholesaleMedicine= async (payload) => {

}