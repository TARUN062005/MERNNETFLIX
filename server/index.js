// server/index.js
const express = require('express');
const app = express();
require('dotenv').config();
app.use(express.json());
const adminRouter = require('./router/adminRoute');
const userRouter = require('./router/userRoutes');
const paymentRouter = require('./router/paymentRoutes');
const ChangePass= require('./router/adminRoute');
const {ConnectDb}=require('./utils/dbConnector');
app.use('/payment', paymentRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);

ConnectDb().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});
