"use strict";
const Sequelize = require("sequelize");
const cashBookContant = require('../../../src/mpModules/cashBook/cashBookContant');
module.exports = (sequelize, DataTypes) => {
    const CashBook = sequelize.define(
        "CashBook",
        {
            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            ballotType: {
                type: DataTypes.ENUM(
                    cashBookContant.BALLOTTYPE.EXPENSES,
                    cashBookContant.BALLOTTYPE.INCOME
                ),
                defaultValue: cashBookContant.BALLOTTYPE.EXPENSES,
                allowNull: false
            },
            code: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            time: {
                type: Sequelize.DATE,
                allowNull: true
            },
            typeId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: false
            },
            value: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            userId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: false
            },
            object: {
                type: DataTypes.ENUM(
                    cashBookContant.OBJECT.CUSTOMER,
                    cashBookContant.OBJECT.OTHER,
                    cashBookContant.OBJECT.SHIPPER,
                    cashBookContant.OBJECT.SUPPLIER,
                    cashBookContant.OBJECT.USER
                )
            },
            peopleId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: false
            },
            note: {
                type: DataTypes.STRING,
                allowNull: true
            },
            isDebt: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            branchId: {
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
            tableName: "cash_books",
            timestamps: true,
            paranoid: true,
        }
    );

    CashBook.associate = function (models) {
        // CashBook.hasMany(models.DiscountCustomer, {
        //     as: 'discountCustomer',
        //     foreignKey: 'discountId',
        //     sourceKey: 'id',
        // });
        CashBook.belongsTo(models.Branch, {
            as: "branch",
            foreignKey: "branchId",
            targetKey: 'id',
        })
    };

    return CashBook;
};
