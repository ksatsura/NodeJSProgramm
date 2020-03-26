import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import cors from 'cors';
import {} from 'dotenv/config';

import { groupTableInit } from './data-access/groupDataAccess';
import { userTableInit } from './data-access/userDataAccess';
import { userRouter } from './routers/userRouter';
import { groupRouter } from './routers/groupRouter';


const app = express();

groupTableInit();
userTableInit();

morgan.token('body', req => JSON.stringify(req.body));

app.use(morgan(':method url=:url response-time=:response-time body=:body',
  { stream: fs.createWriteStream('./server.log', { flags: 'a' }) }
));
app.use(express.json());
app.use('/users', userRouter);
app.use('/groups', groupRouter);

app.use((err, req, res, next) => { // eslint-disable-line
  const status = err.status || 500;
  const message = status === 500 ? 'Internal Server Error' : err.message;

  console.error('Error status: ', status);
  console.error('Message: ', message);
  console.error(err.stack);

  res.status(status);
  res.json({ status, message, stack: err.stack });
});

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

app.use(cors());

app.listen(3000);
