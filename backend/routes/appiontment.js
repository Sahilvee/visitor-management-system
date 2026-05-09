import { Router } from "express";
import { approveAppointment, rejectAppointment,getAppointments } from "../contoller/appointmentcontroller.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {protect,authorizeRoles} from "../middleware/authmiddlerware.js";

import { createAppointment, trackAppointment,appointment_CheckInAndCheckOut ,SlotDetails,checkSlotAvailability} from "../contoller/appointmentcontroller.js";
const router = Router();


/*
   Admin / Host routes
*/ 

 router.get(
   "/",
  protect,authorizeRoles("ADMIN","EMPLOYEE"),
  getAppointments
);

  // approve appointment
 router.patch(
    "/:appointmentId/approve",
      protect,authorizeRoles("ADMIN","EMPLOYEE"),
   approveAppointment
);

  //  reject  appointment
router.patch (
   "/:appointmentId/reject",
 protect,authorizeRoles("ADMIN","EMPLOYEE"),
 rejectAppointment
);

 router.post('/',protect, createAppointment);
 router.post('/CheckInCheckOut',protect,authorizeRoles("FRONTDESK"),appointment_CheckInAndCheckOut);
  router.get('/:appointmentId', trackAppointment);
  router.get('/slots/:hostId',SlotDetails);
   router.post("/check-slot", checkSlotAvailability);

   
export default router;