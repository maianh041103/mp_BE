const {
  respondItemSuccess,
  respondWithError,
} = require("../../helpers/response");
const { indexChartProductsReport } = require("./chartReportService");
const { indexRevenuesReport } = require("./revenueReportService");
const { HttpStatusCode } = require("../../helpers/errorCodes");

export async function getChartProductsReport(req, res) {
  try {
    const { loginUser = {} } = req;
    const result = await indexChartProductsReport(req.query, loginUser);
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.BAD_REQUEST, error.message, error)
    );
  }
}

export async function getRevenuesReport(req, res) {
  try {
    const { loginUser = {} } = req;
    const result = await indexRevenuesReport(req.query, loginUser);
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(
      respondWithError(HttpStatusCode.BAD_REQUEST, error.message, error)
    );
  }
}
