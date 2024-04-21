'use strict';
module.exports = (sequelize, DataTypes) => {
  const OrderProductBatch = sequelize.define('OrderProductBatch', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    orderProductId: {
      allowNull: true,
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    batchId: {
      allowNull: true,
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    quantity: {
      allowNull: true,
      type: DataTypes.INTEGER(10).UNSIGNED,
    }
  }, {
    tableName: 'purchase_return_item_batch',
    timestamps: true,
    paranoid: true,
  });
  OrderProductBatch.associate = function (models) {
    OrderProductBatch.belongsTo(models.Batch, {
      as: 'batch',
      foreignKey: 'batchId',
      targetKey: 'id',
    });

    OrderProductBatch.belongsTo(models.OrderProductBatch, {
      as: "purchaseReturnItem",
      foreignKey: "purchaseReturnItemId",
      targetKey: "id",
    });
  };
  return OrderProductBatch;
};
