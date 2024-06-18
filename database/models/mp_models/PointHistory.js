"use strict";
const Sequelize = require("sequelize");
const pointContant = require("../../../src/mpModules/point/pointContant");

module.exports = (sequelize, DataTypes) => {
    const PointHistory = sequelize.define(
        "PointHistory",
        {
            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            customerId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: false
            },
            orderId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: true
            },
            point: {
                type: DataTypes.INTEGER(11),
                allowNull: true
            },
        },
        {
            tableName: "point_history",
            timestamps: true,
            paranoid: true
        });

    PointHistory.associate = function (models) {
        PointHistory.belongsTo(models.Customer, {
            as: 'customer',
            foreignKey: 'customerId',
            targetKey: 'id',
        });

        PointHistory.belongsTo(models.Order, {
            as: "order",
            foreignKey: "orderId",
            targetKey: 'id',
        })
    };

    return PointHistory;
}