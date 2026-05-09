import Appointment from "../model/appiontmentmodel.js";
import Visitor from "../model/visitormodel.js";

import crypto from "crypto";
import mongoose from "mongoose";

 import { sendEmail } from "../utils/sendemail.js";

import { createQRFile } from "../services.js/QR.js";

import {
   approvalEmailTemplate,
   rejectionEmailTemplate,
  appointmentRequestTemplate,
} from "../utils/appointmentTemplate.js";


// ======================================================
 // CREATE APPOINTMENT
 // ==================================================

export const  createAppointmentService = async (
   user,
    body
) => {

 const visitorId = user.visitorId;

    const visitor = await Visitor.findById(visitorId);

  if (!visitor ) {

     throw new Error("Visitor not found");
  }

  const {

    hostId,
     visitPurpose,
     visitDate,
    duration,
  }  = body;

  if (
    !hostId ||
     !visitPurpose ||
      !visitDate ||
       !duration
  ) {
     throw  new  Error (" All fields are required");
  }

  // ===========  START & END TIME =================
  const start = new Date(visitDate );

   const end =  new Date(

    start.getTime() + duration * 60000
      );

   // ================ SLOT CONFLICT CHECK ==============
  const conflict  = await Appointment.findOne({
   
    hostId,

    status: {

       $in: ["PENDING", "APPROVED"],
    },

    $or:  [
      {
        visitDate: { $lt: end },
        endTime: { $gt: start },
      },
    ],

  });

  if  (conflict) {
       throw new Error("Time slot already booked ❌");
  }

  // =================   TRACKING ID =================
             const trackingId =
    `APT-${crypto.randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;

     // ================ CREATE APPOINTMENT =================
  const appointment =
       await Appointment.create({

      trackingId,

       visitorId,

       hostId,

      visitPurpose,

       visitDate: start,

      endTime: end,

       status: "PENDING",
    });

     // =================  POPULATE DATA  =================
  const populatedAppointment =
      await Appointment.findById(appointment._id)

         .populate("hostId", "name")

        .populate(
          "visitorId",
          "name email"
      );

  // ================= EMAIL =================
      if (populatedAppointment.visitorId.email) {

       const html = appointmentRequestTemplate({

        visitorName:
        populatedAppointment.visitorId.name,

       visitPurpose,

      visitDate:
        new Date(visitDate).toLocaleString(),

       hostName:
        populatedAppointment.hostId.name,

         trackingId,
    });

     await sendEmail(
        {

       to:
        populatedAppointment.visitorId.email,

      subject:
        "Appointment Request Submitted",

      html,
    }
);
  }

  return {
       data: populatedAppointment,
  };
};


//  ======================================================
//    TRACK APPOINTMENT
//   ======================================================

 export const  trackAppointmentService  = async (
    appointmentId
) => {

  if (!appointmentId) {
      throw new Error("Track id required");
  }

  const appointment_record =
    await Appointment.findOne({
        trackingId: appointmentId,
    });

  if  ( !appointment_record) {
    throw new Error("No record found");
  }

   return  appointment_record;

};


//  ====================================================
//   GET  APPOINTMENTS
// ===================================================
export  const  getAppointmentsService  = async (
  user
)  => {

  if ( !user || !user.id ) {
     throw  new Error("Unauthorized");
  }

   const role = user.role;

  const userId = user.id;

    let query = {};

  //  =================  ROLE FILTER  =================
  if ( role === "EMPLOYEE") {

     query.hostId =  userId;

   } else  if (role === "USER")
     {

    query.visitorId = userId;

  }  else if ( role !== "ADMIN")
     {

    throw  new Error("Access denied");
  }

  //   ================= FETCH =================
  const  appointments =
     await Appointment.find(query)

       .populate(
         "visitorId",
        "name email phone"
       )

      .populate(
         "hostId",
        "name email"
       )

      .populate(
        "approvedBy" ,
        "name"
           )

       .sort({ createdAt: -1 })

     .lean();

  //   ================= STATS =================
  let stats = {
     total: appointments.length,
    pending: 0,
     approved: 0,
    rejected: 0,
     checkedIn: 0,
    checkedOut: 0,
    
};

    appointments.forEach( (a) => 
        {

    if  ( a.status === "PENDING") {
      stats.pending++;
    }

    else if ( a.status === "APPROVED" ) {
      stats.approved++;
    }

    else if (a.status === "REJECTED" ) {
       stats.rejected++;
    } 

    else  if ( a.status === "CHECKED_IN" ) {
       stats.checkedIn++;
    }

    else  if ( a.status  === "CHECKED_OUT") {
        stats.checkedOut++;
    }

  }
);

  //  =================  SAFE  NULL POPULATE ==============

  const safeAppointments =
     appointments.map((a) => ({

        ...a,

 visitorId:
        a.visitorId || {},

       hostId:
        a.hostId || {},

      approvedBy:
         a.approvedBy || {},
    })
);

   return {
     stats,
      appointments: safeAppointments,
     };
  };


//  ==================  ==================================
// APPROVE APPOINTMENT
// =====================   ================================
export  const  approveAppointmentService = async (
  appointmentId,
   user
)  => {

    const appointment =
      await Appointment.findById(appointmentId)

      .populate("visitorId");

  if  (!appointment) {
     throw new Error("Appointment not found");
  }

  if ( appointment.status !== "PENDING") {
     throw new Error(
      "Appointment already processed"
    );
  }

  //   ================= QR =================
  const filePath =
       await createQRFile(
      appointment.trackingId
    );

  //  ================= UPDATE ==============
  appointment.status = "APPROVED";


  appointment.approvedBy = user._id;
  appointment.approvedAt = new Date();

   appointment.qrUrl = filePath;

      await appointment.save();

  //   ================= EMAIL =================
  const  html = approvalEmailTemplate({

    visitorName:
       appointment.visitorId.name,

     visitPurpose:
      appointment.visitPurpose,

    visitDate:
       new Date(
        appointment.visitDate
      ).toLocaleString(),
  }
);

    await sendEmail({

    to:
       appointment.visitorId.email,

    subject:
       "Appointment Approved",

     html,

    attachments: [
      {
         filename: "qr.png",
        path: filePath,
        cid: "qrimage",
      },
    ],

  });

   return appointment;
};


//   ===============================================
// REJECT APPOINTMENT
  // ====================================================
export  const  rejectAppointmentService =  async (
   appointmentId,
     reason
) =>  {

const appointment =
      await Appointment.findById(appointmentId)

          .populate("visitorId");

  if  (!appointment) {
        throw new Error("Appointment not found");

  }

  if  ( appointment.status !== "PENDING" ) {
     throw new Error(
          "Appointment already processed"
    );

  }

   // ==  ============= UPDATE =================
    appointment.status = "REJECTED";

  appointment.rejectionReason = reason;

   await appointment.save();

       // ================= EMAIL =================
  const html = rejectionEmailTemplate({

    visitorName:
        appointment.visitorId.name,

      visitPurpose:
      appointment.visitPurpose,

visitDate:
      new Date(
        appointment.visitDate
      ).toLocaleString(),

    reason,
  });
  await sendEmail({

    to:
       appointment.visitorId.email,

    subject:
         "Appointment Rejected",

    html,
  });


  return appointment;


};


// ====================================================
//             CHECK-IN  /  CHECK-OUT
// ===============================================
export   const appointmentCheckService = async (
  qrData
) =>  {

  if ( !qrData) {
      throw new Error("QR data missing ❌");
  }
console.log("res",{qrData} );
  const  appointment =
           await Appointment.findOne({
      trackingId: qrData,
    })

       .populate("visitorId")

      .populate("hostId");

     if (!appointment) {
          throw new Error("Invalid QR ❌");
  }

  // =============== STATUS CHECK   =================
  if ( appointment.status ===  "PENDING") {
    return  {
      message:
         "Appointment not approved yet ⏳",
    };

  }

  if ( appointment.status === "REJECTED") {
     return {
           message:
        "Appointment rejected ❌",
    };

  }

  //  =============== CHECK-IN =================
  if (appointment.status === "APPROVED") {

     appointment.status = "CHECKED_IN";

     appointment.checkInTime = new Date();

    await appointment.save();

      return {
       message: "Check-In Successful ✅",

      user: {
        name:
          appointment.visitorId?.name,

         host:
          appointment.hostId?.name,

         purpose:
          appointment.visitPurpose,

          time:
           appointment.checkInTime,
      },
    };

  }

  // ================ CHECK-OUT ===============
  if ( appointment.status === "CHECKED_IN" )
     {

     appointment.status = "CHECKED_OUT";

     appointment.checkOutTime = new Date();

     await appointment.save();

    return {
      message: "Check-Out Successful ✅",

       user: {
        name:
          appointment.visitorId?.name,

         host:
          appointment.hostId?.name,

        purpose:
           appointment.visitPurpose,

        time:
           appointment.checkOutTime,
      },

    };
  }

  // =============    ALREADY CHECKED OUT =================
  if  ( appointment.status === "CHECKED_OUT") {

    return  {
      message:
        "Visitor already checked out ⚠️",
    };

  }

};


//   ======================================================
//          SLOT DETAILS
//  ======================================================
export   const slotDetailsService = async (
  hostId,
   date
) =>  {

  if (!hostId || !date) {
    throw new Error(
      "HostId and date required"
    );
  }

  // ================= START OF DAY =================
  const startOfDay = new Date(date);

  startOfDay.setHours(
       0,
         0,
        0,
       0
  );

  // ================= END OF DAY =================
  const endOfDay = new Date(date);

  endOfDay.setHours(
    23,
    59,
     59,
     999
  );

  const response =
    await Appointment.find(
      {
          hostId:
          new mongoose.Types.ObjectId(
            hostId
           ),


        visitDate: {
          $gte: startOfDay,
          $lte: endOfDay,
        },


        status: {
          $in: [
             "PENDING",
            "APPROVED",
             "CHECKED_IN",
          ],
        },
      },

       "visitDate endTime status"
    ).sort({ visitDate: 1 });

  return  response;


};


//  ======================================================
//  CHECK SLOT AVAILABILITY
 // ======================================================
export  const  checkSlotAvailabilityService  =
  async  (body) => {

    const {
        hostId,
       visitDate,
       duration,
    } = body;

    if (
       !hostId ||
      !visitDate ||
       !duration
    )  {
          return {
        available: false,
        message:
           "Missing required fields",
        };
    }

    const start =
         new Date(visitDate);

    const  end =
       new Date(
         start.getTime() +
        Number(duration) * 60000
       );

    // ================= PAST BOOKING =================
       if (start < new Date()) {

      return {
         available: false,
        message:
          "Cannot book past time",
      };
          }

        // ================= CONFLICT CHECK =================
    const   conflict  =
        await Appointment.findOne({

        hostId,

        status: {
          $in: [
             "PENDING",
              "APPROVED",
            "CHECKED_IN",
           
        ],
        },


        $or: [
          {
             visitDate: {
              $lt: end,
             },

            endTime: {
              $gt: start,
            },
          },

        ],
      });


    if  (conflict) {

       return {
         available: false,
        message:
          "Slot already booked",
      };
       }

    return {
      available: true,
       message: "Slot available",
        };
 };