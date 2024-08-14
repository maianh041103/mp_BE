const {
    respondItemSuccess,
    respondWithError,
} = require("../../helpers/response");
const { HttpStatusCode } = require("../../helpers/errorCodes");
const marketSellService = require("./marketSellService");
import { respondWithClientError } from "../../helpers/response";

//[POST] mp/api/market/sell/address
module.exports.createAddress = async (req, res) => {
    try {
        const { loginUser = {} } = req;
        const result = await marketSellService.createAddressService(
            {
                ...req.body,
                storeId: loginUser.storeId
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

//[GET] mp/api/market/sell/address
module.exports.getAllAddress = async (req,res)=>{
    try {
        const { loginUser = {} } = req;
        const result = await marketSellService.getAllAddressService(
            {
                storeId: loginUser.storeId,
                ...req.query,
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

//[GET] mp/api/market/sell/address/:id
module.exports.getDetailAddress = async (req,res)=>{
    try {
        const { loginUser = {} } = req;
        const {id} = req.params;
        const result = await marketSellService.getDetailAddressService(
            {
                storeId: loginUser.storeId,
                id,
                ...req.query,
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

//[PATCH] mp/api/market/sell/address/:id
module.exports.updateAddress = async (req,res)=>{
    try {
        const { loginUser = {} } = req;
        const {id} = req.params;
        const result = await marketSellService.updateAddressService(
            {
                storeId: loginUser.storeId,
                id,
                ...req.body
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

//[DELETE] mp/api/market/sell/address/:id
module.exports.deleteAddress = async (req,res)=>{
    try {
        const { loginUser = {} } = req;
        const {id} = req.params;
        const result = await marketSellService.deleteAddressService(
            {
                storeId: loginUser.storeId,
                id
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

//[GET] mp/api/market/sell/prduct/:id
module.exports.getDetailProduct = async (req,res)=>{
    try {
        const { loginUser = {} } = req;
        const {id} = req.params;
        const result = await marketSellService.getDetailProductService(
            {
                storeId: loginUser.storeId,
                id
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

//[GET] mp/api/market/sell/store
module.exports.getAllStore = async (req,res)=>{
    try {
        const { loginUser = {} } = req;
        const result = await marketSellService.getAllStoreService(
            {
                storeId: loginUser.storeId,
                ...req.query
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

//[GET] mp/api/market/sell/store/:id
module.exports.getDetailStore = async (req,res)=>{
    try {
        const { loginUser = {} } = req;
        const {id} = req.params;
        const result = await marketSellService.getDetailStoreService(
            {
                storeId: loginUser.storeId,
                id
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

//[POST] mp/api/market/sell/cart
module.exports.addProductToCart = async (req,res)=>{
    try {
        const { loginUser = {} } = req;
        const result = await marketSellService.addProductToCartService(
            {
                ...req.body,
                storeId: loginUser.storeId
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

//[GET] mp/api/market/sell/cart
module.exports.getProductInCart = async (req,res)=>{
    try {
        const { loginUser = {} } = req;
        const result = await marketSellService.getProductInCartService(
            {
                storeId: loginUser.storeId,
                ...req.query,
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

//[PATCH] mp/api/market/sell/cart/:id/:quantity
module.exports.updateQuantityProductInCart = async (req,res)=>{
    try {
        const { loginUser = {} } = req;
        const {id,quantity} = req.params;
        const result = await marketSellService.updateQuantityProductInCartService(
            {
                storeId: loginUser.storeId,
                id,quantity
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

//[DELETE] mp/api/market/sell/cart/:id
module.exports.deleteProductInCart = async (req,res)=>{
    try {
        const { loginUser = {} } = req;
        const {id} = req.params;
        const result = await marketSellService.deleteProductInCartService(
            {
                storeId: loginUser.storeId,
                id
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

//[POST] mp/api/market/sell/market-order
module.exports.createMarketOrder = async (req,res)=>{
    try {
        const { loginUser = {} } = req;
        const result = await marketSellService.createMarketOrderService(
            {
                ...req.body,
                storeId: loginUser.storeId
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

//[GET] mp/api/market/sell/market-order/:id
module.exports.getDetailMarketOrder = async (req,res)=>{
    try {
        const { loginUser = {} } = req;
        const {id} = req.params;
        const result = await marketSellService.getDetailMarketOrderService(
            {
                storeId: loginUser.storeId,
                id
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

//[GET] mp/api/market/sell/market-order
module.exports.getAllMarketOrder = async (req,res)=>{
    try {
        const { loginUser = {} } = req;
        const result = await marketSellService.getAllMarketOrderService(
            {
                storeId: loginUser.storeId,
                ...req.query
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

//[PATCH] mp/api/market/sell/market-order/:id
module.exports.changeStatusMarketOrder = async (req,res)=>{
    try {
        const { loginUser = {} } = req;
        const {id} = req.params;
        const result = await marketSellService.changeStatusMarketOrderService(
            {
                storeId: loginUser.storeId,
                loginUser,
                id,
                ...req.body
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}

//[GET] mp/api/market/sell/product-private
module.exports.getProductPrivate = async(req,res)=>{
    try {
        const { loginUser = {} } = req;
        const result = await marketSellService.getProductPrivateService(
            {
                storeId: loginUser.storeId,
                ...req.query
            }
        );
        if (result.success) res.json(respondItemSuccess(result.data));
        else res.json(respondWithError(result.code, result.message, {}));
    } catch (e) {
        res.json(respondWithClientError(e))
    }
}
