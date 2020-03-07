import express from 'express';
import Sequelize from 'sequelize';

import UserService from '../services/UserService';
import UserValidationService from '../services/UserValidationService';
import User from '../models/User';

export const userRouter = express.Router();

const sequelize = new Sequelize('postgres://postgres:P0stgress_user@localhost/DB');
User.init(sequelize);

const userService = new UserService(User);
const validationService = new UserValidationService();

sequelize.sync();

userRouter.get('/:id', (req, res, next) => {
  const id = req.params.id;

  userService.getUser(id)
    .then(user => res.json(user))
    .catch(err => {
      console.error('Method: ', req.method);
      console.error('req.params.id: ', req.params.id);
      console.error('error: ', err.message);

      next(err);
    });
});

userRouter.get('/', validationService.validateQueryParams(), (req, res, next) => {
  const loginSubstr = req.query.loginSubstr;
  const limit = req.query.limit;

  userService.getAutoSuggestUsers(loginSubstr, limit)
    .then(loginSuggests => res.json(loginSuggests))
    .catch(err => {
      console.error('Method: ', req.method);
      console.error('req.query.loginSubstr: ', req.query.loginSubstr);
      console.error('req.query.limit: ', req.query.limit);
      console.error('error: ', err.message);

      next(err);
    });
});

userRouter.post('/', validationService.validateBody(), (req, res, next) => {
  userService.createUser(req.body)
    .then(user => res.status(201).json({
      message: `The user #${user.id} has been created`,
      content: user
    }))
    .catch(err => {
      console.error('Method: ', req.method);
      console.error('req.body: ', JSON.stringify(req.body));
      console.error('error: ', err.message);

      next(err);
    });
});

userRouter.delete('/:id', (req, res, next) => {
  const id = req.params.id;

  userService.deleteUser(id)
    .then(() => res.json({
      message: `The user #${id} has been deleted`
    }))
    .catch(err => {
      console.error('Method: ', req.method);
      console.error('req.params.id: ', req.params.id);
      console.error('error: ', err.message);

      next(err);
    });
});

userRouter.put('/:id',
  validationService.validateBody(),
  validationService.validateParams(),
  (req, res, next) => {
    const id = req.params.id;

    userService.updateUser(id, req.body)
      .then(user => res.json({
        message: `The user #${id} has been updated`,
        content: user
      }))
      .catch(err => {
        console.error('Method: ', req.method);
        console.error('req.params.id: ', req.params.id);
        console.error('req.body: ', JSON.stringify(req.body));
        console.error('error: ', err.message);

        next(err);
      });
  });
