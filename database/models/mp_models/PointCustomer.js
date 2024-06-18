"use strict";
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    const PointCustomer = sequelize.define(
        "PointCustomer",
        {
            id: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            pointId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: false,
            },
            groupCustomerId: {
                type: DataTypes.INTEGER(11).UNSIGNED,
                allowNull: false,
            },
        },
        {
            tableName: "point_customers",
            timestamps: false,
        }
    );

    PointCustomer.associate = function (models) {
        PointCustomer.belongsTo(models.Point, {
            as: "point",
            foreignKey: "pointId",
            sourceKey: 'id',
        }),
            PointCustomer.belongsTo(models.GroupCustomer, {
                as: "groupCustomer",
                foreignKey: "groupCustomerId",
                sourceKey: 'id',
            })
    };

    return PointCustomer;
};
