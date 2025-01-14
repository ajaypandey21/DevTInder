const express = require("express");
const { userAuth } = require("../utils/middlewares");
const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const PaymentModal = require("../models/payment");
const { membershipPlan } = require("../utils/constants");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { membershipType } = req.body;
    const { firstName, lastName, email } = req.user;
    const order = await razorpayInstance.orders.create({
      amount: membershipPlan[membershipType] * 100,
      currency: "INR",
      receipt: "order_rcptid_11",
      notes: {
        firstName,
        lastName,
        email,
        membershipType: membershipType,
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
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(400).send("Error: " + error.message);
    console.log("Error: " + error.message);
  }
});
module.exports = paymentRouter;
