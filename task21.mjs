import express from 'express';
import {
  getAutoSuggestUsers,
  createUser, updateUser,
  deleteUser,
  getUser
} from './task21.model.js';
import joi from '@hapi/joi';
import exprssJoiValidation from 'express-joi-validation';

const app = express();
const router = express.Router();
const validator = exprssJoiValidation.createValidator({});

const bodySchema = joi.object({
  login: joi.string().required(),
  password: joi.string().alphanum().required(),
  age: joi.number().integer().min(4).max(130).required()
});

const paramsSchema = joi.object({
  id: joi.string().required()
});

const querySchema = joi.object({
  loginSubstr: joi.required(),
  limit: joi.required()
});

app.use(express.json());
app.use('/', router);
app.listen(3000);


router.get('/:id', async (req, res) => {
  const id = req.params.id;

  await getUser(id)
    .then(user => res.json(user))
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    });
});

router.get('/', validator.query(querySchema), async (req, res) => {
  const loginSubstr = req.query.loginSubstr;
  const limit = req.query.limit;

  await getAutoSuggestUsers(loginSubstr, limit)
    .then(loginSuggests => res.json(loginSuggests))
    .catch(err => {
      if (err.status) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: err.message });
      }
    });
});

router.post('/', validator.body(bodySchema), async (req, res) => {
  await createUser(req.body)
    .then(user => res.status(201).json({
      message: `The user #${user.id} has been created`,
      content: user
    }))
    .catch(err => res.status(500).json({ message: err.message }));
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;

  await deleteUser(id)
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

router.put('/:id',
  validator.body(bodySchema),
  validator.params(paramsSchema),
  async (req, res) => {
    const id = req.params.id;

    await updateUser(id, req.body)
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

