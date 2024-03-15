"use strict";
module.exports = (sequelize, Sequelize) => {
  const Customer = sequelize.define(
    "Customer",
    {
      id: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      // Mã khách hàng
      code: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      fullName: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      phone: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      birthday: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      gender: {
        type: Sequelize.ENUM("male", "female", "other"),
        defaultValue: "other",
      },
      taxCode: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: true,
        type: Sequelize.STRING(2000),
      },
      groupCustomerId: {
        allowNull: true,
        type: Sequelize.INTEGER(11).UNSIGNED,
      },
      avatarId: {
        allowNull: true,
        type: Sequelize.INTEGER(11).UNSIGNED,
      },
      position: {
        allowNull: true,
        type: Sequelize.INTEGER(1).UNSIGNED,
      },
      address: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      facebook: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      note: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      point: {
        allowNull: true,
        type: Sequelize.INTEGER(11),
        defaultValue: 0,
      },
      debt: {
        allowNull: true,
        type: Sequelize.INTEGER(11),
        defaultValue: 0,
      },
      wardId: {
        allowNull: true,
        type: Sequelize.INTEGER(5).UNSIGNED,
      },
      districtId: {
        allowNull: true,
        type: Sequelize.INTEGER(5).UNSIGNED,
      },
      provinceId: {
        allowNull: true,
        type: Sequelize.INTEGER(2).UNSIGNED,
      },
      // Loại tài khoản
      type: {
        allowNull: true,
        type: Sequelize.INTEGER(1).UNSIGNED, 
        defaultValue: 1, // 1 - Cá nhân, 2 - Công ty
      },
      storeId: {
        allowNull: false,
        type: Sequelize.INTEGER(10).UNSIGNED,
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM("draft", "active", "inactive"),
        defaultValue: "active",
      },
      lastLoginAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      changePasswordAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
      createdBy: {
        allowNull: true,
        type: Sequelize.INTEGER(11).UNSIGNED,
      },
      updatedBy: {
        allowNull: true,
        type: Sequelize.INTEGER(11).UNSIGNED,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    },
    {
      tableName: "customers",
      timestamps: true,
      paranoid: true,
    }
  );
  Customer.associate = function (models) {
    Customer.belongsTo(models.Store, {
      as: 'store',
      foreignKey: 'storeId',
      targetKey: 'id',
    });

    Customer.belongsTo(models.GroupCustomer, {
      as: "groupCustomer",
      foreignKey: "groupCustomerId",
      sourceKey: "id",
    });

    Customer.belongsTo(models.Image, {
      as: "avatar",
      foreignKey: "avatarId",
      targetKey: "id",
    });

    Customer.belongsTo(models.Province, {
      as: "province",
      foreignKey: "provinceId",
      targetKey: "id",
    });

    Customer.belongsTo(models.District, {
      as: "district",
      foreignKey: "districtId",
      targetKey: "id",
    });

    Customer.belongsTo(models.Ward, {
      as: "ward",
      foreignKey: "wardId",
      targetKey: "id",
    });
  };
  return Customer;
};
