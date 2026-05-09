import mongoose from "mongoose";


const  otpSchema =  new mongoose.Schema(
  {
   email : 
    {
      type: String,
      ref: "Visitor",
      required: true,
    }, 

    otp: {
      type: Number,
      required: true,
    }, 

    expiry: {
       type: Date,
      required: true,
    },
    attempts: {
      type: Number,
       default: 0,
    },
     
   type:{
     type: String,
      enum: ["visitor", "appointment"],
       required: true,
  },

  },

  { timestamps: true }
);

// TTL index → auto delete OTP after expiry time
  otpSchema.index( { expiry: 1 } , { expireAfterSeconds: 0 }) ;

const OTP = mongoose.model('OTP', otpSchema);


export default OTP;
