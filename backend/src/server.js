import dotenv from 'dotenv';
dotenv.config();
import app from "./app.js";
import connectdb from '../configration/dbconection.js';
import path from "path"

const port = process.env.PORT||5001;
connectdb();
app.listen(port,()=>{
    console.log("Serving from:", path.join(process.cwd(), "backend/uploads"));
    console.log("Server listning on port 5000");
})