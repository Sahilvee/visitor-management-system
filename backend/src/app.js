import express from 'express';
import userrouter from '../routes/userrouter.js'
import authrouter  from '../routes/auth.js'
import visitorroute from '../routes/visitor.js'

import adminrouter from '../routes/admin.js'
import appointmentRoutes from'../routes/appointment.js'
import cors from 'cors'
import path from "path"
import { errorHandler } from '../middleware/errormiddleware.js';
 
import exportrouter from '../routes/export.js'
const app= express();
app.use(express.json()); 
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
})); 

app.use("/uploads", express.static("uploads"));
app.use('/auth',authrouter);
app.use('/admin',adminrouter)
app.use('/visitors',visitorroute)
app.use('/users',userrouter);
app.use("/appointments", appointmentRoutes);
app.use("/export",exportrouter);

app.use(errorHandler);


export default app;