'use strict';
const Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define('Trip', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(100),
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
    time: {
      type: DataTypes.DATE,
      allowNull: null
    },
    createdBy: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    userId: { //Người phụ trách
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true
    },
    note: {
      type: DataTypes.STRING(1000),
      allowNull: true
    },
    storeId: {
      type: DataTypes.INTEGER.UNSIGNED,
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
  }, {
    tableName: 'trips',
    timestamps: true,
  });
  Trip.associate = function (models) {
    Trip.hasMany(models.TripCustomer, {
      as: "tripCustomer",
      foreignKey: 'tripId',
      sourceKey: "id",
    });
    Trip.belongsTo(models.User, {
      as: "userCreated",
      foreignKey: "createdBy",
      targetKey: "id",
    });
    Trip.belongsTo(models.User, {
      as: "userManager",
      foreignKey: 'userId',
      targetKey: "id",
    })
  };
  return Trip;
};
