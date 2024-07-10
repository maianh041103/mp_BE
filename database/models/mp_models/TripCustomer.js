'use strict';

const { TRIPSTATUS } = require("../../../src/mpModules/trip/tripContant");

module.exports = (sequelize, DataTypes) => {
    const TripCustomer = sequelize.define('TripCustomer', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        customerId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false,
        },
        tripId: {
            type: DataTypes.INTEGER.UNSIGNED,
            allowNull: false
        },
        lat: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        lng: {
            type: DataTypes.STRING(100),
            allowNull: false
        },
        status: {
            type: DataTypes.ENUM(TRIPSTATUS.VISITED, TRIPSTATUS.SKIP, TRIPSTATUS.NOT_VISITED, TRIPSTATUS.WAITED),
            allowNull: true,
            default: TRIPSTATUS.NOT_VISITED
        },
        stt: {
            type: DataTypes.INTEGER(10),
            allowNull: true
        },
        note: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        tableName: 'trip_customer',
        timestamps: false,
    });
    TripCustomer.associate = function (models) {
        TripCustomer.belongsTo(models.Customer, {
            as: "customer",
            foreignKey: "customerId",
            targetKey: "id",
        });
        TripCustomer.belongsTo(models.Trip, {
            as: "trip",
            foreignKey: 'tripId',
            targetKey: "id",
        });
    };
    return TripCustomer;
};
