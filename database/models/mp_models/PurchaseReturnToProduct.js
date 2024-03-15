'use strict';
module.exports = (sequelize, DataTypes) => {
  const PurchaseReturnToProduct = sequelize.define('PurchaseReturnToProduct', {
    id: {
      type: DataTypes.INTEGER(10).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    storeId: {
      allowNull: true,
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    branchId: {
      allowNull: true,
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    purchaseReturnId: {
      allowNull: true,
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    productId: {
      allowNull: true,
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    createdBy: {
      allowNull: true,
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    updatedBy: {
      allowNull: true,
      type: DataTypes.INTEGER(10).UNSIGNED,
    }
  }, {
    tableName: 'purchase_return_to_products',
    timestamps: true,
    paranoid: true,
  });
  PurchaseReturnToProduct.associate = function (models) {
    PurchaseReturnToProduct.belongsTo(models.Store, {
      as: 'store',
      foreignKey: 'storeId',
      targetKey: 'id',
    });

    PurchaseReturnToProduct.belongsTo(models.Branch, {
      as: "branch",
      foreignKey: "branchId",
      targetKey: "id",
    });

    PurchaseReturnToProduct.belongsTo(models.Product, {
      as: "product",
      foreignKey: "productId",
      targetKey: "id",
    });

    PurchaseReturnToProduct.hasMany(models.ProductBatchHistory, {
      as: "productBatchHistories",
      foreignKey: 'inboundProductId',
      sourceKey: 'id',
    });
  };
  return PurchaseReturnToProduct;
};
