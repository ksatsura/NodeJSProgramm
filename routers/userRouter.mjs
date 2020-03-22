import express from 'express';
import Sequelize from 'sequelize';
import jwt from 'jsonwebtoken';

import UserService from '../services/UserService';
import UserValidationService from '../services/UserValidationService';
import User from '../models/User';

import { checkToken } from '../helpers/authorizationHelpers';

export const userRouter = express.Router();

const sequelize = new Sequelize('postgres://postgres:P0stgress_user@localhost/DB');
User.init(sequelize);

const userService = new UserService(User);
const validationService = new UserValidationService();

sequelize.sync();

userRouter.post('/login', (req, res, next) => {
  const userLogin = req.body.login;
  const userPassword = req.body.password;

  userService.getUserByLogin(userLogin)
    .then(user => {
      if (user && user.password === userPassword) {
        const payload = { 'sub': user.id, 'login': user.login };
        const token = jwt.sign(payload, '34scrtstrng12', { expiresIn: 3000 });

        res.send(token);
      } else {
        res.status(403).json({
          message: 'Bad login/password combination' });
      }
    })
    .catch(err => {
      console.error('Method: ', req.method);
      console.error('req.body: ', req.body);
      console.error('error: ', err.message);

      next(err);
    });
});

userRouter.get('/:id', checkToken, (req, res, next) => {
  const id = req.params.id;

  userService.getUserById(id)
    .then(user => res.json(user))
    .catch(err => {
      console.error('Method: ', req.method);
      console.error('req.params.id: ', req.params.id);
      console.error('error: ', err.message);

      next(err);
    });
});

userRouter.get('/', checkToken, validationService.validateQueryParams(), (req, res, next) => {
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

userRouter.post('/', checkToken,  validationService.validateBody(), (req, res, next) => {
  userService.getUserByLogin(req.body.login)
    .then(user => {
      if (user) {
        res.status(409).json({
          message: `The user with login ${user.login} was already created` });
      }
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
});

userRouter.delete('/:id', checkToken, (req, res, next) => {
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
  checkToken,
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
