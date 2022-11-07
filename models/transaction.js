'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.Player, {
        as: 'from',
        foreignKey: 'playerFrom',
      });
      Transaction.belongsTo(models.Player, {
        as: 'to',
        foreignKey: 'playerTo',
      });
    }
  }
  Transaction.init(
    {
      playerFrom: DataTypes.INTEGER,
      playerTo: DataTypes.INTEGER,
      amount: DataTypes.INTEGER,
      processDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Transaction',
      tableName: 'transactions',
      timestamps: false,
    }
  );
  return Transaction;
};
