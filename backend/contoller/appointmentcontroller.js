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


//  ======================================================
// CREATE APPOINTMENT
// ====================================================
 export const createAppointment = asyncHandler(async (req, res) => {

   const appointment =  await  createAppointmentService 
   ( 
      req.user,
       req.body
  );

   res.status(201).json(
    {
    success: true,
    appointment: appointment.data,
    message:
      "Your appointment has been created successfully. Please check your email for details.",
  });
});


//=====================================================
//  TRACK  APPOINTMENT
// ======================================================

export const trackAppointment = asyncHandler(async (req, res) => {

   const  appointment_record  =
      await   trackAppointmentService(req.params.appointmentId) ;

  res.status(200).json({

    success: true,
     message: "Record found",
    appointment_record,
  });
});


//  ======================================================
//    GET APPOINTMENTS
//    ======================================================
export  const getAppointments = asyncHandler(async (req, res) => {

        const result = await getAppointmentsService(req.user);

  res.status(200).json({
    
    success: true,
    stats: result.stats,
      appointments: result.appointments,
  });

});


// ==================================================
   //         APPROVE APPOINTMENT
// =================================================
  export  const approveAppointment = 
      asyncHandler(async (req, res) => {

  const appointment =
     await approveAppointmentService(
       req.params.appointmentId,
       req.user
    );

   res.json({
     message: "Appointment approved and email sent",
    appointment,
  }) ;
} );


 //   ======================================================
 //    REJECT APPOINTMENT
 //   ======================================================
export const rejectAppointment = asyncHandler(async (req, res) => {

    const appointment =
      await rejectAppointmentService(
      req.params.appointmentId,
      req.body.reason
    );

    res.json({
       message: "Appointment rejected and email sent",
    appointment,
  });
});


  // ======================================================
// CHECK-IN / CHECK-OUT
  // ======================================================
    export const appointment_CheckInAndCheckOut =
      asyncHandler(async (req, res) => {

const result =
      await  appointmentCheckService( req.body.qrData );
 
    res.json( result );
  });


//  ======================================================
//   SLOT DETAILS
//  ======================================================
  export const SlotDetails = asyncHandler(async (req, res) => {

  const response = await slotDetailsService(
     req.params.hostId,
    req.query.date

  );

   res.json(response);


});


// ======================================================
// CHECK SLOT AVAILABILITY
// =================================================

export const checkSlotAvailability =

    asyncHandler(async (req, res) => {

   const result =
       await checkSlotAvailabilityService(req.body);
 
    res.json(result);
  });