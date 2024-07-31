"use strict";
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const Address = sequelize.define(
        "Address",
        {
            id: {
                type: DataTypes.INTEGER(10).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            phone: {
                allowNull: true,
                type: Sequelize.STRING(15)
            },
            wardId: {
                allowNull: false,
                type: Sequelize.INTEGER(5).UNSIGNED,
            },
            districtId: {
                allowNull: false,
                type: Sequelize.INTEGER(5).UNSIGNED,
            },
            provinceId: {
                allowNull: false,
                type: Sequelize.INTEGER(2).UNSIGNED,
            },
            address: {
                allowNull: false,
                type: Sequelize.STRING(100),
            },
            branchId: {
                allowNull: false,
                type: DataTypes.INTEGER(10).UNSIGNED,
            },
            isDefaultAddress: {
                allowNull: true,
                type: Sequelize.BOOLEAN,
                defaultValue: false,
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
            tableName: "addresses",
            timestamps: true,
            paranoid: true,
        }
    );

    Address.associate = function (models) {
        Address.belongsTo(models.Branch, {
            as: "branch",
            foreignKey: "branchId",
            targetKey: "id",
        });
        Address.belongsTo(models.Ward, {
            as: "ward",
            foreignKey: "wardId",
            targetKey: "id"
        });
        Address.belongsTo(models.District, {
            as: "district",
            foreignKey: "districtId",
            targetKey: "id"
        });
        Address.belongsTo(models.Province, {
            as: "province",
            foreignKey: "provinceId",
            targetKey: "id"
        });
    };
    return Address;
};
