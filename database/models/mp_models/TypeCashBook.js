"use strict";
const Sequelize = require("sequelize");
const cashBookContant = require('../../../src/mpModules/cashBook/cashBookContant');
module.exports = (sequelize, DataTypes) => {
    const TypeCashBook = sequelize.define(
        "TypeCashBook",
        {
            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING,
                allowNull: true
            },
            storeId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: false
            },
            createdAt: {
                allowNull: true,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: true,
                type: Sequelize.DATE,
            },
            deletedAt: {
                allowNull: true,
                type: Sequelize.DATE,
            }
        },
        {
            tableName: "type_cash_books",
            timestamps: true,
            paranoid: true,
        }
    );

    TypeCashBook.associate = function (models) {
        TypeCashBook.belongsTo(models.Store, {
            as: "store",
            foreignKey: "storeId",
            targetKey: 'id',
        })
    };

    return TypeCashBook;
};
