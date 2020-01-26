import express from 'express';
import Sequelize from 'sequelize';

import UserService from '../services/UserService';
import ValidationService from '../services/ValidationService';
import User from '../models/User';

export const router = express.Router();

const sequelize = new Sequelize('postgres://postgres:P0stgress_user@localhost/DB');
User.init(sequelize);
const userService = new UserService(User);
const validationService = new ValidationService();


router.get('/:id', (req, res) => {
  const id = req.params.id;

  sequelize.sync().then(() => {
    userService.getUser(id)
      .then(user => res.json(user))
      .catch(err => {
        if (err.status) {
          res.status(err.status).json({ message: err.message });
        } else {
          res.status(500).json({ message: err.message });
        }
      });
  });
});

router.get('/', validationService.validateQueryParams(), (req, res) => {
  const loginSubstr = req.query.loginSubstr;
  const limit = req.query.limit;

  sequelize.sync().then(() => {
    userService.getAutoSuggestUsers(loginSubstr, limit)
      .then(loginSuggests => res.json(loginSuggests))
      .catch(err => {
        if (err.status) {
          res.status(err.status).json({ message: err.message });
        } else {
          res.status(500).json({ message: err.message });
        }
      });
  });
});

router.post('/', validationService.validateBody(), (req, res) => {
  sequelize.sync().then(() => {
    userService.createUser(req.body)
      .then(user => res.status(201).json({
        message: `The user #${user.id} has been created`,
        content: user
      }))
      .catch(err => res.status(500).json({ message: err.message }));
  });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;

  sequelize.sync().then(() => {
    userService.deleteUser(id)
      .then(() => res.json({
        message: `The user #${id} has been deleted`
      }))
      .catch(err => {
        if (err.status) {
          res.status(err.status).json({ message: err.message });
        }
        res.status(500).json({ message: err.message });
      });
  });
});

router.put('/:id',
  validationService.validateBody(),
  validationService.validateParams(),
  (req, res) => {
    const id = req.params.id;

    sequelize.sync().then(() => {
      userService.updateUser(id, req.body)
        .then(user => res.json({
          message: `The user #${id} has been updated`,
          content: user
        }))
        .catch(err => {
          if (err.status) {
            res.status(err.status).json({ message: err.message });
          }
          res.status(500).json({ message: err.message });
        });
    });
  });
