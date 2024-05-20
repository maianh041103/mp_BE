"use strict";
const Sequelize = require("sequelize");
const discountContant = require('../../../src/mpModules/discount/discountContant');
const Discount = require("./Discount");
module.exports = (sequelize, DataTypes) => {
    const DiscountTime = sequelize.define(
        "DiscountTime",
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
            from: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            to: {
                type: Sequelize.DATE,
                allowNull: false
            },
            //Áp dụng vào các ngày trong tháng : 1 2 3 4
            byDay: {
                type: Sequelize.STRING,
                allowNull: true
            },
            byMonth: {
                type: Sequelize.STRING,
                allowNull: true
            },
            byHour: {
                type: Sequelize.STRING,
                allowNull: true
            },
            //thứ trong tuần
            byWeekDay: {
                type: Sequelize.STRING,
                allowNull: true
            },
            isWarning: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            },
            isBirthDay: {
                type: Sequelize.BOOLEAN,
                defaultValue: false
            }
        },
        {
            tableName: "discountTime",
            timestamps: false,
        }
    );

    DiscountTime.associate = function (models) {
        DiscountTime.belongsTo(models.Discount, {
            as: "discount",
            foreignKey: "discountId",
            sourceKey: 'id',
        })
    };
    return DiscountTime;
};
