import mongoose from "mongoose";
import User from "../model/usermodel.js";

export  const userget = async (req, res) => {
    try {
         const response = await User.find({},"_id name");
  res.json(response);  
  } catch (err) {
       res.status(500).json({ error: err.message });
  }
}; 