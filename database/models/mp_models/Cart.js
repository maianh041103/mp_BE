'use strict';
module.exports = (sequelize, DataTypes) => {
    const Cart = sequelize.define('Cart', {
        id: {
            type: DataTypes.INTEGER(10).UNSIGNED,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        branchId: {
            allowNull: false,
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        marketProductId: {
            allowNull: false,
            type: DataTypes.INTEGER(10).UNSIGNED,
        },
        price:{
            allowNull: false,
            type:DataTypes.INTEGER(20).UNSIGNED
        },
        quantity:{
            allowNull:false,
            type:DataTypes.INTEGER(10).UNSIGNED
        },
        createdAt:{
            allowNull: true,
            type: DataTypes.DATE
        },
        updatedAt:{
            allowNull: true,
            type:DataTypes.DATE
        },
        deletedAt:{
            allowNull: true,
            type: DataTypes.DATE
        }
    }, {
        tableName: 'carts',
        timestamps: true,
        paranoid: true,
    });
    Cart.associate = function (models) {
        Cart.belongsTo(models.Branch, {
            as: 'branch',
            foreignKey: 'branchId',
            targetKey: 'id',
        });

        Cart.belongsTo(models.MarketProduct, {
            as: "marketProduct",
            foreignKey: "marketProductId",
            targetKey: "id",
        });
    };
    return Cart;
};
