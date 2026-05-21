import { Router } from "express";
import { exportAppointmentController } from "../controller/exportController.js";
import { exportUserController } from "../controller/exportController.js";
const router=Router();
 
router.get('/appointments',exportAppointmentController);
router.get('/users',exportUserController);

export default router;