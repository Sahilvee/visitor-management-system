import jwt from "jsonwebtoken";
import User from "../model/usermodel.js";

// Middleware to verify JWT authentication
export const protect = async (req, res, next) => {
  try {

    
    const authHeader = req.headers.authorization;
 
    if   (!authHeader  ||  !authHeader.startsWith("Bearer ") ) {
      return  res.status(401).json( {  message: "Not authorized, no token" });
    }

    const  token = authHeader.split(" ")[1];
    const decoded =  jwt.verify(token,  process.env.JWT_SECRET);

    req.user  = decoded; 
  
     next();
  }  catch (error) {
     return res.status(401).json({ message: "Token invalid or expired" });
  }

};

// role-based verify 

export const authorizeRoles =   (...roles) => 
   {
       return (req,res,next)=>{
       
             if(!roles.includes(req.user.role) )
              {
             return res.status(403).json({message:"Access denied"});
              }
        

        next();
        
    }
}