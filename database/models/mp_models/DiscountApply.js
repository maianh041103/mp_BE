"use strict";
const Sequelize = require("sequelize");
const discountContant = require('../../../src/mpModules/discount/discountContant');
module.exports = (sequelize, DataTypes) => {
    const DiscountApply = sequelize.define(
        "DiscountApply",
        {
            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            discountItemId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: false,
            },
            orderId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: false,
            },
            productUnitId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: true
            },
            groupId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: true
            }
        },
        {
            tableName: "Discount_apply",
        }
    );

    DiscountApply.associate = function (models) {
        DiscountApply.belongsTo(models.DiscountItem, {
            as: "discountItem",
            foreignKey: "discountItemId",
            sourceKey: 'id',
        }),
            DiscountApply.hasOne(models.Order, {
                as: "order",
                foreignKey: "orderId",
                sourceKey: 'id',
            }),
            DiscountApply.belongsTo(models.ProductUnit, {
                as: "productUnit",
                foreignKey: "productUnitId",
                sourceKey: 'id',
            }),
            DiscountApply.belongsTo(models.GroupProduct, {
                as: "group",
                foreignKey: "groupId",
                sourceKey: 'id',
            })
    };

    return DiscountApply;
};
