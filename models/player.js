'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Player.belongsTo(models.Game, { as: 'game', foreignKey: 'gameId' });
    }
  }
  Player.init(
    {
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      balance: DataTypes.INTEGER,
      isLocked: DataTypes.BOOLEAN,
      gameId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Player',
      tableName: 'players',
      timestamps: false,
    }
  );
  return Player;
};
