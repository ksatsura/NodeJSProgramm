import express from 'express';
import Sequelize from 'sequelize';

import GroupService from '../services/GroupService';
import GroupValidationService from '../services/GroupValidationService';
import Group from '../models/Group';
import User from '../models/User';
import UserGroup from '../models/UserGroup';

import { checkToken } from '../helpers/authorizationHelpers';

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


groupRouter.get('/:id', checkToken, (req, res, next) => {
  const id = req.params.id;

  groupService.getGroup(id)
    .then(group => res.json(group))
    .catch(err => {
      console.error('Method: ', req.method);
      console.error('req.params.id: ', req.params.id);
      console.error('error: ', err.message);

      next(err);
    });
});

groupRouter.get('/', checkToken, (req, res, next) => {
  groupService.getAllGroups()
    .then(allGroups => res.json(allGroups))
    .catch(err => {
      console.error('Method: ', req.method);
      console.error('req.body: ', JSON.stringify(req.body));
      console.error('error: ', err.message);

      next(err);
    });
});

groupRouter.post('/', checkToken, groupValidationService.validateBody(), (req, res, next) => {
  groupService.createGroup(req.body)
    .then(group => res.status(201).json({
      message: `The group #${group.id} has been created`,
      content: group
    }))
    .catch(err => {
      console.error('Method: ', req.method);
      console.error('req.body: ', JSON.stringify(req.body));
      console.error('error: ', err.message);

      next(err);
    });
});

groupRouter.delete('/:id', checkToken, (req, res, next) => {
  const id = req.params.id;

  groupService.deleteGroup(id)
    .then(() => res.json({
      message: `The group #${id} has been deleted`
    }))
    .catch(err => {
      console.error('Method: ', req.method);
      console.error('req.params.id: ', req.params.id);
      console.error('error: ', err.message);

      next(err);
    });
});

groupRouter.put('/:id',
  groupValidationService.validateBody(),
  groupValidationService.validateParams(),
  checkToken,
  (req, res, next) => {
    const id = req.params.id;

    groupService.updateGroup(id, req.body)
      .then(group => res.json({
        message: `The group #${id} has been updated`,
        content: group
      }))
      .catch(err => {
        console.error('Method: ', req.method);
        console.error('req.params.id: ', req.params.id);
        console.error('req.body', JSON.stringify(req.body));
        console.error('error: ', err.message);

        next(err);
      });
  });

groupRouter.post('/:id',
  groupValidationService.validateParams(),
  groupValidationService.validateQueryParams(),
  checkToken,
  (req, res, next) => {
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
          console.error('Method: ', req.method);
          console.error('req.query.userId: ', req.query.userId);
          console.error('req.params.id', req.params.id);
          console.error('error: ', err.message);

          next(err);

          return t.rollback();
        });
    });
  });
