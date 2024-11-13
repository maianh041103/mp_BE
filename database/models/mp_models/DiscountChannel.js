"use strict";
const Sequelize = require("sequelize");
const discountContant = require('../../../src/mpModules/discount/discountContant');
module.exports = (sequelize, DataTypes) => {
    const DiscountChannel = sequelize.define(
        "DiscountChannel",
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
            channel: {
                type: Sequelize.ENUM(discountContant.discountChannel.OFFLINE, discountContant.discountChannel.ONLINE),
                allowNull: false,
            },
        },
        {
            tableName: "discount_channels",
            timestamps: false,
        }
    );

    DiscountChannel.associate = function (models) {
        DiscountChannel.belongsTo(models.Discount, {
            as: "discount",
            foreignKey: "discountId",
            sourceKey: 'id',
        })
    };

    return DiscountChannel;
};
