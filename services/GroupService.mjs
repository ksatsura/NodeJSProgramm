import { getNewId } from '../helpers/userHelpers';
import { permissions } from '../config';

export default class GroupService {
  constructor(groupModel, userModel) {
    this.groupModel = groupModel;
    this.userModel = userModel;
  }

  getAllGroups() {
    return this.groupModel.findAll()
      .then((affectedRows) => affectedRows)
      .catch(error => {
        throw error;
      });
  }

  createGroup(newGroupName) {
    return this.groupModel.create({
      id: getNewId(),
      ...newGroupName,
      permissions
    }).then(group => group)
      .catch(error => {
        throw error;
      });
  }

  updateGroup(groupId, newGroup) {
    return this.groupModel.update({ ...newGroup }, { returning: true, where: { id: groupId } })
      .then(affectedRow => affectedRow)
      .catch(error => {
        throw error;
      });
  }

  deleteGroup(groupId) {
    return this.groupModel.destroy({ where: { id: groupId } })
      .then((affectedRow) => affectedRow)
      .catch(error => {
        throw error;
      });
  }

  getGroup(groupId) {
    return this.groupModel.findOne({ where: { id: groupId } })
      .then((affectedRow) => affectedRow)
      .catch(error => {
        throw error;
      });
  }

  addUsersToGroup(groupId, userIds, transaction) {
    return this.userModel
      .findAll({ where: { id: userIds } }, transaction)
      .then(users =>
        this.groupModel.findOne({ where: { id: groupId } }, transaction)
          .then(group => group.addUsers(users, transaction)
            .then((affectedRows) => affectedRows)
            .catch(error => {
              throw error;
            }))
      )
      .catch(error => {
        throw error;
      });
  }
}

