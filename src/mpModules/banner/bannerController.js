const _ = require("lodash");
const {
  respondItemSuccess,
  respondWithError,
} = require("../../helpers/response");
const {
  readBanner,
  indexBanners,
  updateBanner,
  createBanner,
  deleteBanner,
} = require("./bannerService");
const { HttpStatusCode } = require("../../helpers/errorCodes");

export async function getList(req, res) {
  try {
    const result = await indexBanners(req.query);
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
  }
}

export async function create(req, res) {
  try {
    const banner = {
      title: _.get(req, "body.title", ""),
      alt: _.get(req, "body.alt", ""),
      imageId: _.get(req, "body.imageId", null),
      displayOrder: _.get(req, "body.displayOrder", ""),
      link: _.get(req, "body.link", ""),
      type: _.get(req, "body.type", ""),
      description: _.get(req, "body.description", ""),
      sponsor: _.get(req, "body.sponsor", ""),
      status: _.get(req, "body.status", null),
      createdBy: _.get(req, "loginUser.id", null),
      createdAt: new Date(),
    };
    const result = await createBanner(banner);
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
  }
}

export async function getDetail(req, res) {
  try {
    const { id } = req.params;
    const result = await readBanner(id);
    if (result.success) res.json(respondItemSuccess(result.data));
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
  }
}

export async function update(req, res) {
  try {
    const { id } = req.params;
    const banner = {
      title: _.get(req, "body.title", ""),
      alt: _.get(req, "body.alt", ""),
      imageId: _.get(req, "body.imageId", null),
      displayOrder: _.get(req, "body.displayOrder", ""),
      link: _.get(req, "body.link", ""),
      type: _.get(req, "body.type", ""),
      description: _.get(req, "body.description", ""),
      sponsor: _.get(req, "body.sponsor", ""),
      status: _.get(req, "body.status", null),
      updatedBy: _.get(req, "loginUser.id", null),
      updatedAt: new Date(),
    };
    const result = await updateBanner(id, banner);
    if (result.success) res.json(respondItemSuccess());
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
  }
}

export async function deleteController(req, res) {
  try {
    const { id } = req.params;
    const { loginUser = {} } = req;
    const result = await deleteBanner(id, loginUser);
    if (result.success) res.json(respondItemSuccess());
    else res.json(respondWithError(result.code, result.message, {}));
  } catch (error) {
    res.json(respondWithError(HttpStatusCode.SYSTEM_ERROR, error.message, error));
  }
}
