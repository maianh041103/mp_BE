const { createUserTracking } = require("../behavior/behaviorService");
const Sequelize = require("sequelize");
const _ = require("lodash");
const { Op } = Sequelize;
const models = require("../../../database/models");
const {
  typeOptions,
  accountTypes,
  logActions,
} = require("../../helpers/choices");
const { HttpStatusCode } = require("../../helpers/errorCodes");

function processQuery(params) {
  const {
    page = 1,
    limit = 10,
    keyword = "",
    type,
    status,
    include = [
      {
        model: models.Image,
        as: "image",
        attributes: ["id", "originalName", "fileName", "filePath", "path"],
      },
    ],
  } = params;
  const query = {
    include,
    offset: +limit * (+page - 1),
    limit: +limit,
    order: [["displayOrder", "ASC"]],
  };
  const where = {};
  if (keyword) {
    where[Op.or] = {
      title: {
        [Op.like]: `%${keyword.trim()}%`,
      },
      description: {
        [Op.like]: `%${keyword.trim()}%`,
      },
    };
  }
  if (type) {
    where.type = type;
  }
  if (typeof status !== "undefined") {
    where.status = status;
  }
  query.where = where;
  return query;
}

export async function bannerFilter(params) {
  try {
    return await models.Banner.findAll(processQuery(params));
  } catch (e) {
    return [];
  }
}

export async function indexBanners(params) {
  const query = processQuery(params);
  const { rows, count } = await models.Banner.findAndCountAll(query);
  return {
    success: true,
    data: {
      list_banner: rows,
      totalItem: count,
      list_type_banner: typeOptions,
    },
  };
}

export async function createBanner(params) {
  const newBanner = await models.Banner.create(params);
  createUserTracking({
    accountId: newBanner.createdBy,
    type: accountTypes.USER,
    objectId: newBanner.id,
    action: logActions.banner_create.value,
    data: { ...params },
  });
  return {
    success: true,
    data: newBanner,
  };
}

export async function updateBanner(id, params) {
  const foundBanner = await models.Banner.findByPk(id, {
    attributes: ["id"],
  });

  if (!foundBanner) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Banner không tồn tại",
    };
  }

  await models.Banner.update(params, {
    where: {
      id,
    },
  });

  createUserTracking({
    accountId: params.updatedBy,
    type: accountTypes.USER,
    objectId: id,
    action: logActions.banner_update.value,
    data: { ...params },
  });

  return {
    success: true,
  };
}

export async function readBanner(id) {
  return {
    success: true,
    data: await models.Banner.findByPk(id, {
      where: {
        id: id,
      },
    }),
  };
}

export async function deleteBanner(id, loginUser) {
  const instance = await models.Banner.findByPk(id, {
    attributes: ["id", "title"],
  });

  if (!instance) {
    return {
      error: true,
      code: HttpStatusCode.NOT_FOUND,
      message: "Banner không tồn tại",
    };
  }

  await models.Banner.destroy({
    where: {
      id,
    },
  });

  createUserTracking({
    accountId: loginUser.id,
    type: accountTypes.USER,
    objectId: instance.id,
    action: logActions.banner_delete.value,
    data: { id, title: instance.title },
  });

  return {
    success: true,
  };
}
