import express from 'express';
import { groupTableInit } from './data-access/groupDataAccess';
import { userTableInit } from './data-access/userDataAccess';
import { userRouter } from './routers/userRouter';
import { groupRouter } from './routers/groupRouter';
const app = express();

groupTableInit();
userTableInit();

app.use(express.json());
app.use('/users', userRouter);
app.use('/groups', groupRouter);
app.listen(3000);
