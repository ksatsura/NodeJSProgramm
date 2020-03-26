import supertest from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { USER_ID, USER_ID_INCORRECT, USER_ID_NOT_EXISTED } from '../../../test-data/dbTestData';

describe('userRouter endpoints', () => {
  let app;

  describe('POST /users/login', () => {
    let request;

    beforeEach(() => {
      app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      const router = require('../../../routers/userRouter');

      app.use('/users', router.userRouter);
      request = supertest(app);
    });

    it('should pass the authenfication token at correct login and password', async (done) => {
      const response = await request
        .post('/users/login')
        .send({ login: 'user1', password: 'password1' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      done();
    });

    it('should thrown the 403 Status Error at wrong user login and (or) password ', async (done) => {
      const response = await request
        .post('/users/login')
        .send({ login: 'user11', password: 'password11111' })
        .set('Accept', 'application/json');

      expect(response.status).toBe(403);
      done();
    });
  });

  describe('POST /users/', () => {
    let request;
    let token;

    beforeAll(async (done) => {
      app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      const router = require('../../../routers/userRouter');

      app.use('/users', router.userRouter);
      request = supertest(app);

      const response = await request
        .post('/users/login')
        .send({ login: 'user1', password: 'password1' })
        .set('Accept', 'application/json');

      token = response.text;

      done();
    });

    it('should create user in case if a such user does not exist', async (done) => {
      const response = await request
        .post('/users/')
        .send({ login: 'user123', password: 'password123', age: 123 })
        .set('Accept', 'application/json')
        .set('x-access-token', token);

      expect(response.status).toBe(201);
      done();
    });

    it('should thrown the 409 Status Error if such user already exists', async (done) => {
      const response = await request
        .post('/users/')
        .send({ login: 'user4', password: 'password4', age: 4 })
        .set('Accept', 'application/json')
        .set('x-access-token', token);

      expect(response.status).toBe(409);
      done();
    });
  });

  describe('GET /users/:id', () => {
    let request;
    let token;

    beforeAll(async (done) => {
      app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      const router = require('../../../routers/userRouter');

      app.use('/users', router.userRouter);
      request = supertest(app);

      const response = await request
        .post('/users/login')
        .send({ login: 'user1', password: 'password1' })
        .set('Accept', 'application/json');

      token = response.text;

      done();
    });


    it('should return user data in case if a such user exists', async (done) => {
      const response = await request
        .get(`/users/${USER_ID}`)
        .set('x-access-token', token);

      expect(response.status).toBe(200);
      done();
    });

    it('should thrown the 404 Status Error at non-existent user', async (done) => {
      const response = await request
        .get(`/users/${USER_ID_NOT_EXISTED}`)
        .set('x-access-token', token);

      expect(response.status).toBe(404);
      done();
    });

    it('should thrown the 500 Status Error at icorrect user id', async (done) => {
      const response = await request
        .get(`/users/${USER_ID_INCORRECT}`)
        .set('x-access-token', token);

      expect(response.status).toBe(500);
      done();
    });
  });

  describe('PUT /users/:id', () => {
    let request;
    let token;

    beforeAll(async (done) => {
      app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      const router = require('../../../routers/userRouter');

      app.use('/users', router.userRouter);
      request = supertest(app);

      const response = await request
        .post('/users/login')
        .send({ login: 'user1', password: 'password1' })
        .set('Accept', 'application/json');

      token = response.text;

      done();
    });

    it('should update user data in case if a such user exists', async (done) => {
      const response = await request
        .put(`/users/${USER_ID}`)
        .send({ login: 'user130', password: 'password130', age: 130 })
        .set('Accept', 'application/json')
        .set('x-access-token', token);

      expect(response.status).toBe(200);
      done();
    });

    it('should thrown the 404 Status Error at non-existent user', async (done) => {
      const response = await request
        .put(`/users/${USER_ID_NOT_EXISTED}`)
        .send({ login: 'user130', password: 'password130', age: 130 })
        .set('Accept', 'application/json')
        .set('x-access-token', token);

      expect(response.status).toBe(404);
      done();
    });

    it('should thrown the 500 Status Error at incorrect user id', async (done) => {
      const response = await request
        .put(`/users/${USER_ID_INCORRECT}`)
        .send({ login: 'user130', password: 'password130', age: 130 })
        .set('Accept', 'application/json')
        .set('x-access-token', token);

      expect(response.status).toBe(500);
      done();
    });
  });

  describe('DELETE /users/:id', () => {
    let request;
    let token;

    beforeAll(async (done) => {
      app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      const router = require('../../../routers/userRouter');

      app.use('/users', router.userRouter);
      request = supertest(app);

      const response = await request
        .post('/users/login')
        .send({ login: 'user1', password: 'password1' })
        .set('Accept', 'application/json');

      token = response.text;

      done();
    });

    it('should delete user data and return 200 Status Code', async (done) => {
      const response = await request
        .delete(`/users/${USER_ID}`)
        .set('x-access-token', token);

      expect(response.status).toBe(200);
      done();
    });
  });
});
