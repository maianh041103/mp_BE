'use strict';
module.exports = (sequelize, DataTypes) => {
  const Payment = sequelize.define('Payment', {
    id: {
      type: DataTypes.INTEGER(1).UNSIGNED,
      primaryKey: true,
    },
    code: {
      allowNull: false,
      type: DataTypes.STRING,
    },
    amount: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    totalAmount: {
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    customerId: {
      allowNull: false,
      type: DataTypes.INTEGER(10).UNSIGNED,
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
    tableName: 'payments',
    timestamps: true,
    paranoid: true,
  });

  Payment.associate = function(models) {
    // associations can be defined here
    Payment.belongsTo(models.Customer, {
      as: 'customer',
      foreignKey: 'customerId',
      targetKey: 'id',
    });
    Payment.hasMany(models.Order, {
      as: 'order',
      foreignKey: 'orderId',
      sourceKey: 'id',
    });
  };

  return Payment;
};
