// server/index.js
const cors = require('cors');
const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json());
app.use(cors({ origin: 'http://localhost:5173' })); // Correct placement

const adminRouter = require('./router/adminRoute');
const userRouter = require('./router/userRoutes');
const paymentRouter = require('./router/paymentRoutes');

// Note: ChangePass import is redundant. You only need adminRouter.
// const ChangePass = require('./router/adminRoute');

app.use('/payment', paymentRouter);
app.use('/admin', adminRouter);
app.use('/user', userRouter);

const { ConnectDb } = require('./utils/dbConnector');

ConnectDb().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
});