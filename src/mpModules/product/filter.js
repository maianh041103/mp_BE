import {productAttributes, productIncludes} from "./constant";
import models from "../../../database/models";
import {productStatisticFilter} from "../productStatistic/productStatisticService";
const _ = require("lodash");
export async function queryFilter(params) {
    const {
        page = 1,
        limit = 20,
        keyword = "",
        name = "",
        type,
        status,
        productCategoryId,
        groupProductId,
        statusArray = [],
        unitId,
        manufactureId,
        notEqualManufactureId,
        listProductId = [],
        notEqualId,
        order = [["id", "DESC"]],
        tag,
        newest,
        bestseller,
        az,
        za,
        price,
        include = productIncludes,
        attributes = productAttributes,
        raw = false,
        storeId,
        isSale,
    } = params;

    const query = {
        offset: +limit * (+page - 1),
        limit: +limit,
        order,
    };

    if (raw) query.raw = true;

    if (_.isArray(include) && include.length) {
        query.include = include;
        if (!isSale) {
            for (const item of query.include) {
                if (item.as === "productUnit") {
                    query.order = [
                        [models.ProductUnit, "exchangeValue", "DESC"],
                        ...query.order,
                    ];
                }
            }
        }
    }

    if (_.isArray(attributes) && attributes.length) {
        query.attributes = attributes;
    }

    if (_.isArray(order) && order.length) {
        query.order = order;
    }

    const where = {};

    if (storeId) {
        where.storeId = storeId;
    }

    if (type) {
        where.type = type;
    }

    if (status) {
        where.status = status;
    }

    if (groupProductId) {
        where.groupProductId = groupProductId;
    }

    if (productCategoryId) {
        where.productCategoryId = productCategoryId;
    }

    if (notEqualId) {
        where.id = {
            [Op.ne]: notEqualId,
        };
    }

    if (notEqualManufactureId) {
        where.manufactureId = {
            [Op.ne]: notEqualManufactureId,
        };
    }

    if (_.isArray(statusArray) && statusArray.length) {
        where.status = {
            [Op.in]: statusArray,
        };
    }

    if (_.isArray(unitId) && unitId.length) {
        where.unitId = {
            [Op.in]: unitId,
        };
    }

    if (_.isArray(manufactureId) && manufactureId.length) {
        where.manufactureId = {
            [Op.in]: manufactureId,
        };
    }

    if (_.isArray(listProductId) && listProductId.length) {
        where.id = listProductId;
    }

    if (tag) {
        const tagToProducts = await tagToProductFilter({ tag });
        where.id = tagToProducts;
    }

    if (keyword) {
        where[Op.or] = {
            name: {
                [Op.like]: `%${keyword.trim()}%`,
            },
            slug: {
                [Op.like]: `%${keyword.trim()}%`,
            },
            code: {
                [Op.like]: `%${keyword.trim()}%`,
            },
        };
    }

    if (name) {
        where[Op.or] = {
            name: {
                [Op.like]: `%${keyword.trim()}%`,
            },
        };
    }

    if (newest) {
        query.order = [["id", "DESC"]];
    } else if (bestseller) {
        where.id = _.get(
            await productStatisticFilter({
                limit: 20,
                orderBy: [["sold", "DESC"]],
            }),
            "statistics",
            []
        ).map((o) => o.productId);
    } else if (az) {
        query.order = [["name", "ASC"]];
    } else if (za) {
        query.order = [["name", "DESC"]];
    } else if (price == "desc") {
        query.order = [["cost", "DESC"]];
    } else if (price == "asc") {
        query.order = [["cost", "ASC"]];
    }

    query.where = where;

    return query;
}