"use strict";
module.exports = (sequelize, DataTypes) => {
  const OrderProduct = sequelize.define(
    "OrderProduct",
    {
      id: {
        allowNull: false,
        type: DataTypes.INTEGER(10).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        allowNull: false,
        type: DataTypes.INTEGER(10).UNSIGNED,
      },
      productId: {
        allowNull: false,
        type: DataTypes.INTEGER(10).UNSIGNED,
      },
      productUnitId: {
        allowNull: false,
        type: DataTypes.INTEGER(10).UNSIGNED,
      },
      productUnitData: {
        allowNull: true,
        type: DataTypes.TEXT,
      },
      quantity: {
        allowNull: false,
        type: DataTypes.INTEGER(5).UNSIGNED,
      },
      quantityBaseUnit: {
        allowNull: false,
        type: DataTypes.INTEGER(10).UNSIGNED,
      },
      comboId: {
        allowNull: true,
        type: DataTypes.INTEGER(10).UNSIGNED,
      },
      /* Chỉ thêm vào giỏ hàng chưa chốt đặt thì trường giá để trống
      Sau khi đã đặt hàng thành công, thì điền giá cuối cùng vào
    */
      price: {
        allowNull: true,
        type: DataTypes.INTEGER(10).UNSIGNED,
      },
      // Giá vốn trên đơn vị cơ bản
      primePrice: {
        allowNull: true,
        type: DataTypes.INTEGER(10).UNSIGNED,
      },
      // Khách hàng
      customerId: {
        allowNull: false,
        type: DataTypes.INTEGER(10).UNSIGNED,
      },
      // Nhóm khách hàng
      groupCustomerId: {
        allowNull: true,
        type: DataTypes.INTEGER(10).UNSIGNED,
      },
      // Người bán hàng
      userId: {
        allowNull: true,
        type: DataTypes.INTEGER(10).UNSIGNED,
      },
      discount: {
        allowNull: true,
        type: DataTypes.FLOAT(),
        defaultValues: 0,
      },
    },
    {
      tableName: "order_products",
      timestamps: true,
      paranoid: true,
    }
  );

  OrderProduct.associate = function (models) {
    // associations can be defined here
    OrderProduct.belongsTo(models.Order, {
      as: "order",
      foreignKey: "orderId",
      targetKey: "id",
    });

    OrderProduct.belongsTo(models.Product, {
      as: "product",
      foreignKey: "productId",
      targetKey: "id",
    });

    OrderProduct.belongsTo(models.Customer, {
      as: "customer",
      foreignKey: "customerId",
      targetKey: "id",
    });

    OrderProduct.belongsTo(models.User, {
      as: "user",
      foreignKey: "userId",
      targetKey: "id",
    });

    OrderProduct.belongsTo(models.ProductUnit, {
      as: "productUnit",
      foreignKey: "productUnitId",
      targetKey: "id",
    });
  };
  return OrderProduct;
};
