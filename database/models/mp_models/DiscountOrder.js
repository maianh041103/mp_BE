"use strict";
const Sequelize = require("sequelize");
const discountContant = require('../../../src/mpModules/discount/discountContant');
module.exports = (sequelize, DataTypes) => {
    const DiscountOrder = sequelize.define(
        "DiscountOrder",
        {
            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            discountId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: false,
            },
            orderId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: false,
            },
            productId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: true
            }
        },
        {
            tableName: "discount_orders",
        }
    );

    DiscountOrder.associate = function (models) {
        DiscountOrder.belongsTo(models.Discount, {
            as: "discount",
            foreignKey: "discountId",
            sourceKey: 'id',
        }),
            DiscountOrder.belongsTo(models.Order, {
                as: "order",
                foreignKey: "orderId",
                sourceKey: 'id',
            }),
            DiscountOrder.belongsTo(models.Discount, {
                as: "product",
                foreignKey: "productId",
                sourceKey: 'id',
            })
    };

    return DiscountOrder;
};
