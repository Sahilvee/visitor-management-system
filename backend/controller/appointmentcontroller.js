import { asyncHandler } from "../utils/asyncHandler.js";

import {
  createAppointmentService,
  trackAppointmentService,
   getAppointmentsService,
  approveAppointmentService,
  rejectAppointmentService,
  appointmentCheckService,
   slotDetailsService,
  checkSlotAvailabilityService,
} from "../services.js/appointment.service.js";
import { sendResponse } from "../utils/sendResponse.js";
// ======================================================
// CREATE APPOINTMENT
//  handling from service
// ======================================================

export const createAppointment =
asyncHandler(async (req, res) => {
 const result =
     await createAppointmentService(
       req.user,
      req.body
    );
  res.status(result.statusCode)
     .json(result);
});



// ======================================================
//     TRACK APPOINTMENT
// manual try catch
// ======================================================

export const trackAppointment =
async (req, res) => {

  try {
    const appointment_record =
        await trackAppointmentService(
        req.params.appointmentId
      );

    sendResponse(
       res,
        200,
       true,
       "Record found",
      {
         appointment_record,
       }
    );
  }
  catch (error) {
     res.status(500).json({
        success: false,
         message:
        error.message || "Something went wrong",
      });

  }

};



// ======================================================
//   GET APPOINTMENTS
// inline validation style
// ======================================================

export  const getAppointments  =
asyncHandler (async (req, res) => {

  const  result  =
    await getAppointmentsService(
      req.user
    );

  if  (!result)  {
    return res.status(404).json({
       success: false,
       message: "No appointments found",
    });
  }

res.status(200).json({
      success: true,
       stats: result.stats,
    appointments: result.appointments,
   });

});



// ======================================================
//   APPROVE APPOINTMENT
// Throw Based Error Handling
// ======================================================

export const approveAppointment =
asyncHandler(async (req, res) => {

  const appointment =
    await approveAppointmentService(
      req.params.appointmentId,
      req.user
    );

 
  if (!appointment) {

const error = new Error("Approval Failed ");

error.statusCode = 404;

throw error;
  }

  res.json({
    success: true,
    message:
      "Appointment approved and email sent",
    appointment,
  });
});



// ======================================================
// REJECT APPOINTMENT
//  nested try catch
// ======================================================

export const rejectAppointment =
asyncHandler(async (req, res) => {

  try {
     const appointment =
      await rejectAppointmentService(
        req.params.appointmentId,
        req.body.reason
      );

    res.json(
      { 

      success: true,
      message:
          "Appointment rejected and email sent",
      appointment,
    });

  }

  catch {
    res.status(400).json({
        success: false,
      message:
         "Unable to reject appointment",
    });

  }
});



// ======================================================
//  CHECK-IN /  CHECK-OUT
// simple  conditional handling
//  ================================================

export  const  appointment_CheckInAndCheckOut  =
asyncHandler ( async (req, res) => {

  const  result  =

    await  appointmentCheckService(
       req.body.qrData
    );

  if  (result.success ===  false) {

     return res.status(400).json(result);
  }

  res.json(result);
});



//    ======================================================
//  SLOT DETAILS
// validation first approach
// ======================================================

export const SlotDetails =
  asyncHandler(async (req, res) => {

  if  (!req.params.hostId ) {

    return  res.status(400).json({
       success: false,
      message: "Host id required",
    });

  }

  const response =
     await slotDetailsService(
        req.params.hostId,
        req.query.date
    );

   res.json(response);


});



// ======================================================
//   CHECK SLOT AVAILABILITY
// fallback response handling
//  ====================================================

export const checkSlotAvailability =
 asyncHandler( async (req, res) => {

  const  result  =
     await checkSlotAvailabilityService(
      req.body
    );

   res.json(
    result ||  {
      success: false,
       message: "No slot data found",
    }


  );
  
});