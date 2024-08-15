"use strict";
const Sequelize = require("sequelize");
const marketSellContant = require("../../../src/mpModules/marketSell/marketSellContant");
module.exports = (sequelize, DataTypes) => {
    const MarketOrder = sequelize.define(
        "MarketOrder",
        {
            id: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            code: {
                allowNull: true,
                type: Sequelize.STRING(20)
            },
            fullName: {
              allowNull: true,
              type: Sequelize.STRING(255)
            },
            branchId: {
                allowNull: false,
                type: DataTypes.INTEGER(10).UNSIGNED,
            },
            toBranchId:{
                allowNull:false,
                type:DataTypes.INTEGER(10).UNSIGNED,
            },
            addressId:{
                allowNull:false,
                type: DataTypes.INTEGER(10).UNSIGNED,
            },
            address:{
                allowNull:true,
                type: DataTypes.STRING,
            },
            phone:{
                allowNull:true,
                type: DataTypes.STRING,
            },
            status:{
                allowNull: false,
                type:DataTypes.ENUM(
                    marketSellContant.STATUS_ORDER.DONE,
                    marketSellContant.STATUS_ORDER.CONFIRM,
                    marketSellContant.STATUS_ORDER.SEND,
                    marketSellContant.STATUS_ORDER.CANCEL,
                    marketSellContant.STATUS_ORDER.PENDING,
                    marketSellContant.STATUS_ORDER.PROCESSING,
                    marketSellContant.STATUS_ORDER.CLOSED
                ),
                defaultValues: marketSellContant.STATUS_ORDER.PENDING,
            },
            note:{
                allowNull:true,
                type: DataTypes.TEXT,
            },
            wardId:{
                allowNull:true,
                type: DataTypes.INTEGER(10).UNSIGNED,
            },
            districtId:{
                allowNull:true,
                type:DataTypes.INTEGER(10).UNSIGNED,
            },
            provinceId:{
                allowNull:true,
                type: DataTypes.INTEGER(10).UNSIGNED,
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
            tableName: "market_orders",
            timestamps: true,
            paranoid: true,
        }
    );

    MarketOrder.associate = function (models) {
        MarketOrder.belongsTo(models.Branch, {
            as: "branch",
            foreignKey: "branchId",
            targetKey: "id",
        });
        MarketOrder.belongsTo(models.Address, {
            as: "addresses",
            foreignKey: "addressId",
            targetKey: "id"
        });
        MarketOrder.hasMany(models.MarketOrderProduct,{
            as:"products",
            foreignKey:"marketOrderId",
            sourceKey:"id"
        });
        MarketOrder.belongsTo(models.Branch,{
            as:"toBranch",
            foreignKey:"toBranchId",
            targetKey:"id"
        });
        MarketOrder.hasMany(models.HistoryPurchase,{
            as:"historyPurchase",
            foreignKey:"marketOrderId",
            sourceKey:"id"
        });
        MarketOrder.belongsTo(models.Ward,{
            as:"ward",
            foreignKey:"wardId",
            targetKey:"id"
        });
        MarketOrder.belongsTo(models.District,{
            as:"district",
            foreignKey:"districtId",
            targetKey:"id"
        });
        MarketOrder.belongsTo(models.Province,{
            as:"province",
            foreignKey:"provinceId",
            targetKey:"id"
        });
    };
    return MarketOrder;
};