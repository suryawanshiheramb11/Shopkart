import Razorpay from "razorpay";

// Created lazily so the server still starts if keys are not set yet
let razorpay;

export const getRazorpay = () => {
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
};
