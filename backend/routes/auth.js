import { Router } from "express";
import {  authlogin } from "../controller/authcontroller.js";
import { createotp, verifyOtp } from "../controller/otpcontroller.js";
import { loginLimiter } from "../middleware/rateLimiting.js";
const router=Router();



 router.post('/login',loginLimiter,authlogin);
  router.post('/otp', createotp);
  router.patch('/otp', verifyOtp);


export default router;