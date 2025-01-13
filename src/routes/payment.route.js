const express = require("express");
const { userAuth } = require("../utils/middlewares");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const PaymentModal = require("../models/payment");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const order = await razorpayInstance.orders.create({
      amount: 50000,
      currency: "INR",
      receipt: "order_rcptid_11",
      notes: {
        key1: "value1",
        key2: "value2",
      },
    });
    // save to DB
    const payment = new PaymentModal({
      userId: req.user._id,
      orderId: order.id,
      status: order.status,
      receipt: order.receipt,
      currency: order.currency,
      amount: order.amount,
      notes: order.notes,
    });

    const savedPayment = await payment.save();
    res.json({ ...savedPayment.toJSON() });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
  }
});
module.exports = paymentRouter;
