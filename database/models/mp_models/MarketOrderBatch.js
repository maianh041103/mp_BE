"use strict";
const Sequelize = require("sequelize");
const marketSellContant = require("../../../src/mpModules/marketSell/marketSellContant");
module.exports = (sequelize, DataTypes) => {
    const MarketOrderBatch = sequelize.define(
        "MarketOrderBatch",
        {
            id: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            marketOrderId: {
                allowNull: false,
                type: DataTypes.INTEGER(10).UNSIGNED,
            },
            marketProductId:{
                allowNull:false,
                type:DataTypes.INTEGER(10).UNSIGNED,
            },
            batchId:{
                allowNull:false,
                type: DataTypes.INTEGER(10).UNSIGNED,
            },
            quantity:{
                allowNull:false,
                type:DataTypes.INTEGER(10).UNSIGNED
            }
        },
        {
            tableName: "market_order_batches",
            timestamps: false,
            paranoid: false,
        }
    );

    MarketOrderBatch.associate = function (models) {
        MarketOrderBatch.belongsTo(models.MarketOrder, {
            as: "marketOrder",
            foreignKey: "marketOrderId",
            targetKey: "id"
        });
        MarketOrderBatch.belongsTo(models.MarketProduct, {
            as: "marketProduct",
            foreignKey: "marketOrderId",
            targetKey: "id"
        });
        MarketOrderBatch.belongsTo(models.Batch,{
            as:"batches",
            foreignKey:"batchId",
            targetKey:"id"
        });
    };
    return MarketOrderBatch;
};
