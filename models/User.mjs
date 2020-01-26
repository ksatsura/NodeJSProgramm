import Sequelize from 'sequelize';

export default class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true
        },
        login: {
          type: Sequelize.STRING,
          allowNull: false
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        age: {
          type: Sequelize.INTEGER,
          allowNull: false
        },
        is_deleted: {
          type: Sequelize.BOOLEAN,
          allowNull: false
        }
      },
      { sequelize, modelName: 'user', timestamps: false }
    );
  }
}

