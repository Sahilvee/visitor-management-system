import { Router } from "express";
import {  authlogin } from "../contoller/authcontroller.js";
import { createotp, verifyOtp } from "../contoller/otpcontroller.js";

const router=Router();



 router.post('/login',authlogin);
  router.post('/otp', createotp);
  router.patch('/otp', verifyOtp);


export default router;