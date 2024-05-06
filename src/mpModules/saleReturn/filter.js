import {addFilterByDate} from "../../helpers/utils";
import {Op} from "sequelize";
import {saleReturnAttributes, saleReturnIncludes} from "./attributes";
import {SaleReturnStatus} from "./saleReturnConstant";
const _ = require("lodash");
export function getFilter(params) {
    const {
        page = 1,
        limit = 10,
        keyword = "",
        code = "",
        userId,
        branchId,
        storeId,
        from,
        to,
        status,
        creatorId,
        customerId,
    } = params;

    const query = {
        attributes: saleReturnAttributes,
        offset: +limit * (+page - 1),
        include: saleReturnIncludes,
        limit: +limit,
        order: [["id", "DESC"]],
    };

    const where = {
        status: {
            [Op.ne]: SaleReturnStatus.TRASH,
        },
    };

    if (storeId) {
        where.storeId = storeId;
    }

    if (branchId) {
        where.branchId = branchId;
    }

    if (status) {
        where.status = status;
    }

    if (code) {
        where.code = status;
    }

    if (keyword) {
        where.code = {
            [Op.like]: `%${keyword.trim()}%`,
        };
    }

    if (from) {
        where.createdAt = addFilterByDate([from, to]);
    }

    if (userId) {
        where.userId = userId;
    }

    if (creatorId) {
        where.createdBy = creatorId;
    }

    if (customerId) {
        where.customerId = customerId;
    }

    query.where = where;
    return query
}