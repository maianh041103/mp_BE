'use strict';
module.exports = (sequelize, DataTypes) => {
  const MoveItem = sequelize.define('MoveItem', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    moveId: {
      allowNull: true,
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    productUnitId: {
      allowNull: true,
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    quantity: {
      allowNull: true,
      type: DataTypes.INTEGER,
    },
    productId: {
      allowNull: true,
      type: DataTypes.INTEGER(10).UNSIGNED,
    }
  }, {
    tableName: 'move_items',
    timestamps: true,
  });
  MoveItem.associate = function (models) {
    MoveItem.belongsTo(models.Product, {
      as: "product",
      foreignKey: "productId",
      targetKey: "id",
    });

    MoveItem.belongsTo(models.ProductUnit, {
      as: "productUnit",
      foreignKey: "productUnitId",
      targetKey: "id",
    });

    MoveItem.hasMany(models.MoveItemBatch, {
      as: "batches",
      foreignKey: "purchaseReturnItemId",
      sourceKey: "id"
    })
  };
  return MoveItem;
};