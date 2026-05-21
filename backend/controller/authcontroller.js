import User from "../model/usermodel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

 import { asyncHandler } from "../utils/asyncHandler.js";

//-----------------------   login
export const authlogin=  asyncHandler(async(req,res)=>{
           console.log(req.body );
     const{  email,password  }=req.body;
 if(!email||!password)return res.status(400).json({message:"All credential required"});
 //verifying credential
      
    const user   =await User.findOne({email}).select("+password");   //finding username 
           if(!user)return res.status(404).json({message: "Invalid email or password"})
            
    
     const ismatch=  await  bcrypt.compare(password,user.password);//matching password

     if(!ismatch)return res.status(401).json({message: "Invalid email or password"});
   
      const token = jwt.sign({id:user._id,role:user.role},process.env.JWT_SECRET,{expiresIn:"1d"});

                  res.status(200).json({message:" Login successfully....",user,token})
        //

})

