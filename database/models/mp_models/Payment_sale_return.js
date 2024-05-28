'use strict';
module.exports = (sequelize, DataTypes) => {
  const PaymentSaleReturn = sequelize.define('PaymentSaleReturn', {
    id: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    code: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    amount: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    customerId: {
      allowNull: false,
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    createdBy: {
      allowNull: false,
      type: DataTypes.INTEGER(11).UNSIGNED,
    },
    orderId: {
      allowNull: false,
      type: DataTypes.INTEGER(10).UNSIGNED,
    },
    paymentMethod: {
      allowNull: false,
      type: DataTypes.ENUM("CASH", "BANK", "DEBT")
    },
    status: {
      allowNull: true,
      type: DataTypes.STRING
    }
  }, {
    tableName: 'payments_sale_return',
    timestamps: true,
    paranoid: true,
  });

  PaymentSaleReturn.associate = function(models) {
    // associations can be defined here
    PaymentSaleReturn.belongsTo(models.Customer, {
      as: 'customer',
      foreignKey: 'customerId',
      targetKey: 'id',
    });
    PaymentSaleReturn.hasMany(models.Order, {
      as: 'order',
      foreignKey: 'orderId',
      sourceKey: 'id',
    });
    PaymentSaleReturn.belongsTo(models.User, {
      as: 'fullnameCreator',
      foreignKey: 'createdBy',
      sourceKey: 'id',
    });
  };

  return PaymentSaleReturn;
};
