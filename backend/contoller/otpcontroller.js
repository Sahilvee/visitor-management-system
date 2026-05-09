import OTP from "../model/otpmodel.js";
import Visitor from "../model/visitormodel.js";
import { sendEmail } from "../utils/sendemail.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { otpEmailTemplate } from "../utils/otptemplate.js";

import jwt from "jsonwebtoken";

//   🔹 SEND OTP
export const createotp =  asyncHandler(async (req, res) => 
  {
   const {  email, type }  = req.body ;
  if (!email  || !type) {
     return res.status(400).json({
       success: false,
       message: "Email and type are required",
      });
             }

  //  If appointment → email must exist
  if  ( type === "appointment")
      {
       const visitor = await Visitor.findOne({ email });

    if  (!visitor)
       {
      return res.status(400).json({
          success: false,
       message: "Visitor not found. Please register first.",
      });

    }


  }

  //  Check  existing OTP  (based on type)
  const existingOtp =  await OTP.findOne({ email, type }) ;

  if ( existingOtp && existingOtp.expiry > new Date())  {
     return res.status(400).json(
      {
      success: false,
      message: " Please wait before requesting another OTP" ,
    }) ;

  }

  const  otp = Math.floor(1000 + Math.random() * 9000);
  const expiry  = new Date(Date.now() + 5 * 60 * 1000);

     //  delete old OTP of same type
  await  OTP.deleteMany({ email, type });

  await OTP.create({
     email,
    otp,
      expiry,
     attempts: 0,
    type,
  });



  await sendEmail({
     to: email,
     subject: "OTP Verification",
   html: otpEmailTemplate(otp),
  });

  res.json({
      success: true,
        message: "OTP sent successfully",
  });
});


// 🔹 VERIFY OTP
export const verifyOtp = asyncHandler(  async (req, res) => {
   const { email, otp, type } = req.body;

  const otpRecord = await OTP.findOne({ email, type });
  
   if (!otpRecord) {
    return res.status(400).json({
        success: false,
        message: "OTP expired or not found",
    });
  }

  // ❌ Too many attempts
  if    (otpRecord.attempts >= 3) {
return res.status(429).json({
        success: false,
        message: "Too many attempts. Request new OTP",
    });
  }

  // ❌ Expired
  if (otpRecord.expiry < new Date()) {
    return res.status(400).json({
        success: false,
        message: "OTP expired",
    });
  }

  // ❌ Wrong OTP

  if  (otpRecord.otp !== Number(otp)) {
      otpRecord.attempts += 1;
    await otpRecord.save();

    return res.status(400).json({
       success: false,
      message: "Invalid OTP",
       });
     }  

  // 🔥 find visitor
  const   visitor = await  Visitor.findOne({ email  });

  // 🔥 extra  safety for  appointment
  if ( type === "appointment" && !visitor ) {
    return res.status(400).json({
     
      success: false,
     
      message: "Visitor not found. Please register first.",
    });


  }

  //  🔥 generate token
  const token = jwt.sign(
     {
      email,
      visitorId: visitor?._id || null,
       role: "visitor",
       verified: true,
      type,
      },
    process.env.JWT_SECRET,
      { expiresIn: "10m" }
  );

 res.json({
     success: true,
    message: "OTP verified successfully",
      token,
      visitorId: visitor?._id || null,
    });
    
});