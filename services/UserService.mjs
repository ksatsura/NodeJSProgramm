import Sequelize from 'sequelize';
import { getNewId } from '../helpers/userHelpers';

export default class UserService {
  constructor(userModel) {
    this.userModel = userModel;
  }

  getAutoSuggestUsers(loginSubstring, limit) {
    const usersLimit = Number(limit);

    return this.userModel.findAll({ where: { login: { [Sequelize.Op.substring]: loginSubstring } },
      limit: usersLimit })
      .then((affectedRows) => affectedRows)
      .catch(error => {
        throw error;
      });
  }

  createUser(newUserData) {
    return this.userModel.create({
      id: getNewId(),
      ...newUserData,
      is_deleted: false
    }).then(user => user)
      .catch(error => {
        throw error;
      });
  }

  updateUser(userId, newUser) {
    return this.userModel.update({ ...newUser }, { returning: true, where: { id: userId } })
      .then((affectedRow) => affectedRow)
      .catch(error => {
        throw error;
      });
  }

  deleteUser(userId) {
    return this.userModel.update({ is_deleted: true }, { where: { id: userId } })
      .then((affectedRow) => affectedRow)
      .catch(error => {
        throw error;
      });
  }

  getUserById(userId) {
    return this.userModel.findOne({ where: { id: userId } })
      .then((affectedRow) => affectedRow)
      .catch(error => {
        throw error;
      });
  }

  getUserByLogin(userLogin) {
    return this.userModel.findOne({ where: { login: userLogin } })
      .then((affectedRow) => affectedRow)
      .catch(error => {
        throw error;
      });
  }
}

