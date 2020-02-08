import express from 'express';
import { userTableInit } from './data-access/userDataAccess';
import { router } from './routers/userRouter';
const app = express();

userTableInit();

app.use(express.json());
app.use('/', router);
app.listen(3000);
