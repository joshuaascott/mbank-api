'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Game extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Game.hasMany(models.Player, { as: 'players', foreignKey: 'gameId' });
    }
  }
  Game.init(
    {
      alias: DataTypes.STRING,
      isPrivate: DataTypes.BOOLEAN,
      password: DataTypes.STRING,
      status: DataTypes.ENUM('STARTING', 'STARTED', 'STOPPED'),
      startBalance: DataTypes.INTEGER,
      maxPlayers: DataTypes.INTEGER,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'Game',
      tableName: 'games',
      timestamps: false,
    }
  );
  return Game;
};
