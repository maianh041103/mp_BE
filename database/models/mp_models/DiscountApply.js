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
            discountId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: false,
            },
            orderId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: false,
            }
        },
        {
            tableName: "discount_apply",
            timestamps: false,
        }
    );

    DiscountApply.associate = function (models) {
        DiscountApply.belongsTo(models.Discount, {
            as: "discount",
            foreignKey: "discountId",
            sourceKey: 'id',
        }),
            DiscountApply.hasOne(models.Order, {
                as: "order",
                foreignKey: "orderId",
                sourceKey: 'id',
            })
    };

    return DiscountApply;
};
