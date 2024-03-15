const models = require("../../../database/models");
const { HttpStatusCode } = require("../../helpers/errorCodes");

export async function readProductUnit(id, loginUser) {
  const findProductUnit = await models.ProductUnit.findOne({
    where: {
      id,
      storeId: loginUser.storeId,
    },
  });
  if (!findProductUnit) {
    return {
      error: true,
      code: HttpStatusCode.BAD_REQUEST,
      message: `Đơn vị tính không tồn tại`,
    };
  }
  return {
    success: true,
    data: findProductUnit,
  };
}
