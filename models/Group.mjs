import Sequelize from 'sequelize';

export default class Group extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        permissions: {
          type: Sequelize.ARRAY(Sequelize.TEXT),
          allowNull: false
        }
      },
      { sequelize, modelName: 'group', timestamps: false }
    );
  }
}
