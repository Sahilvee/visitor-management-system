import bcrypt from "bcrypt";
import User from "../model/usermodel.js";
import {asyncHandler} from "../utils/asyncHandler.js";

       //-------------------------- Admin creates Employee / Frontdesk
export const adminregister = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;

    // validation
  if  (!name || !email || !phone || !password || !role) {
    return res.status(400).json({
       message: "All credentials are required",
     });
  }

  // allowed roles (important!)
  const allowedRoles =  ["EMPLOYEE", "FRONTDESK"];
   
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      message: "Invalid role assignment",

    });
  }

  //  check existing user
  const userExist = await User.findOne({ email });
    if (userExist) {
           return res.status(409).json({
        message: "User already exists",
    });

  }

  //   hash password
     const hashedPassword =  await bcrypt.hash(password, 10);

   // create user

      const user = await User.create({
    name,
     email,
     phone,
     password: hashedPassword,
    role,
     createdBy: req.user.id, // optional but GOOD for audit
  } );

     res.status(201).json({
    success: true,
     message: "User created successfully",
    user: {
      id: user._id,
        name: user.name,
       email: user.email,
       role: user.role,
    },

  });
    
});

export const getAllUsers=asyncHandler(async(req,res)=>{
   const users=await User.find();
  if(users.length==0)return res.status(200).json({message:"User not found"})
     return res.status(200).json({success:true, count: users.length,users});
});

export const deleteUser = asyncHandler(async (req, res) => {
     const { id } = req.params;
console.log("sg")
     // 🔍 Check  if user  exists  

  const user = await User.findById(id);
  if (!user) {
     return res.status(404).json({
       success: false,
          message: "User not found",
    });

  }

     //  🚫 Prevent deleting self 
  if (user._id.toString() === req.user.id) {
    return res.status(400).json({
        success: false,
   message: "You cannot delete your own account",
    
  });
  }

  //    ❗ Optional: prevent deleting ADMIN
  if (user.role === "ADMIN") {
        return res.status(403).json({
         success: false,
         message: "Admin cannot be deleted",
    });


  }

  //   🗑️ Delete user
  await  user.deleteOne();

   res.status(200).json({
    success: true,
      message: "User deleted successfully",
  });



});