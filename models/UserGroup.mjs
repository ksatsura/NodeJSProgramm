import Sequelize from 'sequelize';

export default class UserGroup extends Sequelize.Model {
  static init(sequelize) {
    return super.init(
      {
        userId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'User',
            key: 'id'
          }
        },
        groupId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Group',
            key: 'id'
          }
        }
      },
      { sequelize, modelName: 'usergroup', timestamps: false }
    );
  }
}
