// server/router/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controller/paymentController');

const { getPayment } = paymentController;

router.get('/', getPayment);
router.post('/make-payment', (req, res) => {
  res.status(201).send({ message: "Payment processed" });
});

module.exports = router;
