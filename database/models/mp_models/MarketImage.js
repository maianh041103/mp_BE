const marketContant = require("../../../src/mpModules/marketConfig/marketConfigContant");

"use strict";
module.exports = (sequelize, DataTypes) => {
    const MarketImage = sequelize.define(
        "MarketImage",
        {
            id: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            imageId:{
                type:DataTypes.INTEGER(10).UNSIGNED,
                allowNull: false
            },
            position:{
                type:DataTypes.ENUM(marketContant.MARKET_IMAGE.LIST,
                    marketContant.MARKET_IMAGE.TOP,
                    marketContant.MARKET_IMAGE.BOTTOM),
                allowNull: false
            },
            storeId:{
              type:DataTypes.INTEGER(10).UNSIGNED,
              allowNull: false,
            },
            createdAt: {
                allowNull: true,
                type: DataTypes.DATE,
            },
            updatedAt: {
                allowNull: true,
                type: DataTypes.DATE,
            },
            deletedAt: {
                allowNull: true,
                type: DataTypes.DATE,
            },
        },
        {
            tableName: "market_images",
            timestamps: true,
            paranoid: true,
        }
    );

    MarketImage.associate = function (models) {
        MarketImage.belongsTo(models.Store, {
            as: "store",
            foreignKey: "storeId",
            targetKey: "id",
        });

        MarketImage.belongsTo(models.Image, {
            as: "image",
            foreignKey: "imageId",
            targetKey: "id"
        });
    };
    return MarketImage;
};
