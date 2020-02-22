import express from 'express';
import Sequelize from 'sequelize';

import GroupService from '../services/GroupService';
import GroupValidationService from '../services/GroupValidationService';
import Group from '../models/Group';
import User from '../models/User';
import UserGroup from '../models/UserGroup';

export const groupRouter = express.Router();

const sequelize = new Sequelize('postgres://postgres:P0stgress_user@localhost/DB');

Group.init(sequelize);
User.init(sequelize);
UserGroup.init(sequelize);

Group.belongsToMany(User, { through: UserGroup, foreignKey: 'groupId' });
User.belongsToMany(Group, { through: UserGroup, foreignKey: 'userId' });
sequelize.sync();

const groupService = new GroupService(Group, User);
const groupValidationService = new GroupValidationService();


groupRouter.get('/:id', (req, res) => {
  const id = req.params.id;

  groupService.getGroup(id)
    .then(group => res.json(group))
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    });
});

groupRouter.get('/', (req, res) => {
  groupService.getAllGroups()
    .then(allGroups => res.json(allGroups))
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    });
});

groupRouter.post('/', groupValidationService.validateBody(), (req, res) => {
  groupService.createGroup(req.body)
    .then(group => res.status(201).json({
      message: `The group #${group.id} has been created`,
      content: group
    }))
    .catch(err => res.status(500).json({ message: err.message }));
});

groupRouter.delete('/:id', (req, res) => {
  const id = req.params.id;

  groupService.deleteGroup(id)
    .then(() => res.json({
      message: `The group #${id} has been deleted`
    }))
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message });
      }
      res.status(500).json({ message: err.message });
    });
});

groupRouter.put('/:id',
  groupValidationService.validateBody(),
  groupValidationService.validateParams(),
  (req, res) => {
    const id = req.params.id;

    groupService.updateGroup(id, req.body)
      .then(group => res.json({
        message: `The group #${id} has been updated`,
        content: group
      }))
      .catch(err => {
        if (err.status) {
          res.status(err.status).json({ message: err.message });
        }
        res.status(500).json({ message: err.message });
      });
  });

groupRouter.post('/:id',
  groupValidationService.validateParams(),
  groupValidationService.validateQueryParams(),
  (req, res) => {
    const userIds = req.query.userId;
    const groupId = req.params.id;

    sequelize.transaction().then(t => {
      groupService.addUsersToGroup(groupId, userIds, { transaction: t })
        .then(group => res.status(201).json({
          message: `The new users has been added to group #${groupId}`,
          content: group
        }))
        .then(() => t.commit())
        .catch((err) => {
          res.status(500).json({ message: err.message });
          return t.rollback();
        });
    });
  });
