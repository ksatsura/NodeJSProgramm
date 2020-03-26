import supertest from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { GROUP_ID, GROUP_ID_NOT_EXISTED, GROUP_ID_INCORRECT } from '../../../test-data/dbTestData';

describe('groupRouter endpoints', () => {
  let app;
  let token;

  beforeAll(async (done) => {
    app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    const router = require('../../../routers/userRouter');

    app.use('/users', router.userRouter);
    const request = supertest(app);

    const response = await request
      .post('/users/login')
      .send({ login: 'user1', password: 'password1' })
      .set('Accept', 'application/json');

    token = response.text;
    done();
  });


  describe('GET /groups/:id', () => {
    let request;

    beforeAll(() => {
      app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      const router = require('../../../routers/groupRouter');

      app.use('/groups', router.groupRouter);
      request = supertest(app);
    });

    it('should return group data in case if a such group exists', async (done) => {
      const response = await request
        .get(`/groups/${GROUP_ID}`)
        .set('x-access-token', token);

      expect(response.status).toBe(200);
      done();
    });

    it('should thrown the 404 Status Error at non-existent group', async (done) => {
      const response = await request
        .get(`/groups/${GROUP_ID_NOT_EXISTED}`)
        .set('x-access-token', token);

      expect(response.status).toBe(404);
      done();
    });

    it('should thrown the 500 Status Error at icorrect group id', async (done) => {
      const response = await request
        .get(`/groups/${GROUP_ID_INCORRECT}`)
        .set('x-access-token', token);

      expect(response.status).toBe(500);
      done();
    });
  });

  describe('GET /groups/', () => {
    let request;

    beforeAll(() => {
      app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      const router = require('../../../routers/groupRouter');

      app.use('/groups', router.groupRouter);
      request = supertest(app);
    });

    it('should return all groups data', async (done) => {
      const response = await request
        .get('/groups/')
        .set('x-access-token', token);

      expect(response.status).toBe(200);
      done();
    });
  });

  describe('PUT /groups/:id', () => {
    let request;

    beforeAll(() => {
      app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({ extended: true }));

      const router = require('../../../routers/groupRouter');

      app.use('/groups', router.groupRouter);
      request = supertest(app);
    });

    it('should update group data in case if a such group exists', async (done) => {
      const response = await request
        .put(`/groups/${GROUP_ID}`)
        .send({ name: 'group10', permissions: ['READ', 'WRITE', 'DELETE', 'SHARE'] })
        .set('Accept', 'application/json')
        .set('x-access-token', token);

      expect(response.status).toBe(200);
      done();
    });

    it('should thrown the 404 Status Error at non-existent user', async (done) => {
      const response = await request
        .put(`/groups/${GROUP_ID_NOT_EXISTED}`)
        .send({ name: 'group10', permissions: ['READ', 'WRITE', 'DELETE', 'SHARE'] })
        .set('Accept', 'application/json')
        .set('x-access-token', token);

      expect(response.status).toBe(404);
      done();
    });
  });
});
