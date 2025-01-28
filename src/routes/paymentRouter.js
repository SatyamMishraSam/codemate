const express = require("express");
const { userAuth } = require("../middlewares/auth");

const paymentRouter = express.Router();
const razorpayInstance = require("../utils/razorpay");
const Payment = require("../models/payment");
const memberShipAmount = require("../utils/constants");
const {
  validateWebhookSignature,
} = require("razorpay/dist/utils/razorpay-utils");
const UserModel = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
  try {
    const { planType } = req.body;
    const { firstName, lastName, email } = req.user;

    var options = {
      // memberShipAmount is mapped with plan type and money
      amount: memberShipAmount[planType] * 100, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: "INR",
      receipt: "order_rcptid_11",
      notes: {
        firstName,
        lastName,
        email,
        membershipType: planType,
      },
    };

    const order = await razorpayInstance.orders.create(options);

    // Order info need to be saved in DB
    const payment = new Payment({
      userId: req.user._id, // req.user  will be coming from userAuth
      orderId: order.id,
      status: order.status,
      amount: order.amount,
      currency: order.currency,
      recept: order.receipt,
      notes: order.notes,
    });

    const savedPayment = await payment.save();
    // console.log(order);
    // console.log(savedPayment);

    // return back order details to frontend
    // we are passing keyid because , we need the razorpay key to frontend in options , so we are passing from backend
    res.json({ ...savedPayment.toJSON(), keyId: process.env.RAZORPAY_KEY_ID });
    // res.json(order);
  } catch (e) {
    return res.json(e.message);
  }
});

// no need of userAuth because we dont need user details here and this res will be send by razorpay to server
// here razorpay will make api call
paymentRouter.post("/payment/webhook", async (req, res) => {
  try {
    /* NODE SDK: https://github.com/razorpay/razorpay-node */
    const webhookSignature = req.get("X-Razorpay-Signature");

    const isValidWebhook = validateWebhookSignature(
      // In req.body we will be having all the details of the payment
      JSON.stringify(req.body),
      webhookSignature,
      process.env.RAZORPAY_WEBHOOK_SECRET
    );
    if (!isValidWebhook) {
      return res.jaon({ message: "Webhook Signature is not valid" });
    }

    // Now webook successfull so need to change payment status in DB
    const paymentDetails = req.body.payload.payment.enitity; //here we will have all the payment details

    const payment = await Payment.findOne({ orderId: paymentDetails.order_id });
    payment.status = paymentDetails.status; //change the db status to razorpay status
    await payment.save();

    const user = await UserModel.findOne({ _id: payment.userId });
    user.isPremium = true;
    user.memberShipType = payment.notes.memberShipType;
    await user.save();

    return res.status(200).json({ msg: "Webhook received Successfully" });
    // #webhook_body should be raw webhook request body
  } catch (e) {
    res.json(e.message);
  }
});

module.exports = paymentRouter;
