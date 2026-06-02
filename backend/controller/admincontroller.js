import bcrypt from "bcrypt";
import User from "../model/usermodel.js";
import {asyncHandler} from "../utils/asyncHandler.js";

       //-------------------------- Admin creates Employee / Frontdesk
export const adminregister = asyncHandler(async (req, res) => {
  const { name, email, phone, password, role } = req.body;
           //   *Things to keep in mind in this call*
     //1.  check every required field is there
     //2. cross check the role (because front end can be tempered)
     //3. check is there existing user with the same email 
     //4. create user and return 

    //  1. validation
  if  (!name || !email || !phone || !password || !role) 
    {
       console.log("Not all required field is there in the api call by admin ....")
    return res.status(400).json({
       message: "All credentials are required",
     });
  }

  //2. allowed roles (roles admin can choose)

    if (role!=="FRONTDESK"&& role!=="EMPLOYEE") 
      {
    // unknown role 
    return res.status(400).json({
      message: "Invalid role ",

    });
  }

  //3.  check existing user
  const userExist = await User.findOne({ email:email });
    if (userExist) {
           return res.status(409).json({
        message: "User already exists",
    });

  }

  //   hash password
     const hashedPassword =  await bcrypt.hash(password, 10);

   // create user

      const user = await User.create({
    name:name,
     email:email,
     phone:phone,
     password: hashedPassword,
    role:role,
     createdBy: req.user.id, 
  } );
   
       res.status(201).json({
     message: "User created successfully",
            user: {
         id: user._id,
        name: user.name,
       email: user.email,
       role: user.role,
    },

  });

    
});

  // ----------------------------Getting  all Users

export const getAllUsers=asyncHandler(async(req,res)=>{
   const users=await User.find();

  if(users.length==0)return res.status(200).json({message:"User not found"})
     return res.status(200).json({success:true, count: users.length,users});
});
//---------------------deleted all users
export const deleteUser = asyncHandler(async (req, res) => {
        //*Things to keep in mind in this call
        //1.check id is there
        //2.check user is there for the id 
        //3.check user is not admin or it self
        //4.delete user and 

     
     //1. checking id is there or not 
     const { id } = req.params;
     if(!id)return res.status(400).json({message:"All field are required"})

     //2.  Check  if user  exists  

  const userRecord = await User.findById(id);
  if (!userRecord) {
     return res.status(404).json({
       success: false,
          message: "USER NOT FOUND ",
    });

  }
      console.log(userRecord);

     //3.   Prevent deleting self & admin 
  if (userRecord._id.toString() === req.user.id|| userRecord.role === "ADMIN") {
      
    return res.status(400).json({
        success: false,
   message: "You cannot delete your own account or an admin account",
    
  });
  }


  //4    Delete user
    const deleteRes=await  userRecord.deleteOne();
 console.log(deleteRes);
   res.status(200).json({
    success: true,
    
      message: "User deleted successfully",
  });



});