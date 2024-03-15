const _ = require("lodash");
const {
  respondItemSuccess,
  respondWithError,
} = require("../../helpers/response");
const {
  readProduct,
  indexProducts,
  indexProductCombo,
  updateProduct,
  createProduct,
  deleteProductById,
  updateproductStatuses,
  deleteManyProducts,
  updateEndDateManyProducts,
} = require("./productService");
const {
  indexProductPriceSettings,
  updateProductPriceSetting,
} = require("./productPriceSetting");
const { productStatuses } = require("./productConstant");
const { HttpStatusCode } = require("../../helpers/errorCodes");
const {
  indexMasterSaleProducts,
  indexMasterInboundProducts,
} = require("./productMasterService");

export async function indexMasterInboundProductController(req, res) {
  try {
    const { loginUser = {} } = req;
    const result = await indexMasterInboundProducts({
      ...req.query,
      storeId: loginUser.storeId,
    });
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function indexMasterSaleProductController(req, res) {
  try {
    const { loginUser = {} } = req;
    const result = await indexMasterSaleProducts({
      ...req.query,
      storeId: loginUser.storeId,
    });
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    console.log(error);
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function indexController(req, res) {
  try {
    const { loginUser = {} } = req;
    const result = await indexProducts({
      ...req.query,
      storeId: loginUser.storeId,
    });
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function indexPriceSettingController(req, res) {
  try {
    const { loginUser = {} } = req;
    const result = await indexProductPriceSettings({
      ...req.query,
      storeId: loginUser.storeId,
    });
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function createController(req, res) {
  try {
    const { loginUser = {} } = req;
    const warningExpiryDate = _.get(req.body, "warningExpiryDate", null);
    const product = {
      name: _.get(req.body, "name", ""),
      slug: _.get(req.body, "slug", ""),
      code: _.get(req.body, "code", ""),
      barCode: _.get(req.body, "barCode", ""),
      shortName: _.get(req.body, "shortName", ""),
      groupProductId: _.get(req.body, "groupProductId", null),
      primePrice: _.get(req.body, "primePrice", 0),
      price: _.get(req.body, "price", null),
      weight: _.get(req.body, "weight", ""),
      ...(warningExpiryDate && { warningExpiryDate }),
      warningExpiryText: _.get(req.body, "warningExpiryText", null),
      isDirectSale: _.get(req.body, "isDirectSale", false),
      registerNumber: _.get(req.body, "registerNumber", null),
      activeElement: _.get(req.body, "activeElement", null),
      content: _.get(req.body, "content", null),
      packingSpecification: _.get(req.body, "packingSpecification", null),
      manufactureId: _.get(req.body, "manufactureId", null),
      countryId: _.get(req.body, "countryId", null),
      minInventory: _.get(req.body, "minInventory", null),
      maxInventory: _.get(req.body, "maxInventory", null),
      description: _.get(req.body, "description", ""),
      note: _.get(req.body, "note", ""),
      status: _.get(req.body, "status", productStatuses.ACTIVE),
      imageId: _.get(req.body, "imageId", null),
      type: _.get(req.body, "type", null),
      storeId: loginUser.storeId,
      branchId: _.get(req.body, "branchId", null),
      dosageId: _.get(req.body, "dosageId", null),
      positionId: _.get(req.body, "positionId", null),
      isLoyaltyPoint: _.get(req.body, "isLoyaltyPoint", false),
      isBatchExpireControl: _.get(req.body, "isBatchExpireControl", false),
      expiryPeriod: _.get(req.body, "expiryPeriod", null),
      inventory: _.get(req.body, "inventory", 0),
      baseUnit: _.get(req.body, "baseUnit", null),
      productUnits: _.get(req.body, "productUnits", []),
      createdBy: loginUser.id,
      createdAt: new Date(),
    };
    const result = await createProduct(product, loginUser);
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function readController(req, res) {
  try {
    const { id } = req.params;
    const result = await readProduct(id);
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function updateController(req, res) {
  try {
    const { id } = req.params;
    const { loginUser = {} } = req;
    const status = _.get(req.body, "status", null);
    const warningExpiryDate = _.get(req.body, "warningExpiryDate", null);
    const product = {
      name: _.get(req.body, "name", ""),
      slug: _.get(req.body, "slug", ""),
      // code: _.get(req.body, "code", ""),
      barCode: _.get(req.body, "barCode", ""),
      shortName: _.get(req.body, "shortName", ""),
      groupProductId: _.get(req.body, "groupProductId", null),
      primePrice: _.get(req.body, "primePrice", 0),
      price: _.get(req.body, "price", null),
      weight: _.get(req.body, "weight", ""),
      ...(warningExpiryDate && { warningExpiryDate }),
      warningExpiryText: _.get(req.body, "warningExpiryText", null),
      isDirectSale: _.get(req.body, "isDirectSale", false),
      registerNumber: _.get(req.body, "registerNumber", null),
      activeElement: _.get(req.body, "activeElement", null),
      content: _.get(req.body, "content", null),
      packingSpecification: _.get(req.body, "packingSpecification", null),
      manufactureId: _.get(req.body, "manufactureId", null),
      countryId: _.get(req.body, "countryId", null),
      minInventory: _.get(req.body, "minInventory", null),
      maxInventory: _.get(req.body, "maxInventory", null),
      description: _.get(req.body, "description", ""),
      note: _.get(req.body, "note", ""),
      ...(status !== null && { status }),
      imageId: _.get(req.body, "imageId", null),
      type: _.get(req.body, "type", null),
      storeId: loginUser.storeId,
      branchId: _.get(req.body, "branchId", null),
      dosageId: _.get(req.body, "dosageId", null),
      positionId: _.get(req.body, "positionId", null),
      isLoyaltyPoint: _.get(req.body, "isLoyaltyPoint", false),
      inventory: _.get(req.body, "inventory", 0),
      baseUnit: _.get(req.body, "baseUnit", null),
      productUnits: _.get(req.body, "productUnits", []),
      updatedBy: loginUser.id,
      updatedAt: new Date(),
    };
    const result = await updateProduct(id, product, loginUser);
    if (result.success) res.json(respondItemSuccess());
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function updateStatus(req, res) {
  try {
    const { id } = req.params;
    const { loginUser = {} } = req;
    const status = _.get(req.body, "status", null);
    const product = {
      ...(status !== null && { status }),
      updatedBy: loginUser.id,
    };
    const result = await updateproductStatuses(id, product, loginUser);
    if (result.success) res.json(respondItemSuccess());
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function deleteController(req, res) {
  try {
    const { id } = req.params;
    const { loginUser = {} } = req;
    const result = await deleteProductById(id, loginUser);
    if (result.success) res.json(respondItemSuccess());
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function deleteProducts(req, res) {
  try {
    const { ids } = req.body;
    const { loginUser = {} } = req;
    const result = await deleteManyProducts(ids, loginUser);
    if (result.success) res.json(respondItemSuccess());
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function updateEndDateProducts(req, res) {
  try {
    const { ids, endDate, endMonth } = req.body;
    const result = await updateEndDateManyProducts(
      ids,
      endDate,
      endMonth,
      loginUser.id
    );
    if (result.success) res.json(respondItemSuccess());
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}

export async function updatePriceSettingController(req, res) {
  try {
    const { id } = req.params;
    const { loginUser = {} } = req;
    const type = _.get(req.body, "type", null);
    const value = _.get(req.body, "value", 0);
    const isApplyForAll = _.get(req.body, "isApplyForAll", false);
    const branchId = _.get(req.body, "branchId", null);
    const result = await updateProductPriceSetting(
      id,
      {
        type,
        value,
        isApplyForAll,
        branchId,
      },
      loginUser
    );
    if (result.success) res.json(respondItemSuccess());
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    console.log(error);
    res.json(
      respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error)
    );
  }
}
