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
import PDFDocument from "pdfkit";


// ===================================================== 
 // CREATE APPOINTMENT
  // ==================================================

export const  createAppointmentService = async (user,body) => {
//         *Things to keep in mind in this call
//1.check for the visitor record && check that all the required appointment details are there
//2. get the start and end time 
//3. check for slot conflict 
//4. genarate track id and create appointment 
//5. populate the data to get all the realted detail from different model
//6. send mail 
//7. return populated appointment details
    const visitorId = user.visitorId;
   const { hostId,visitPurpose,visitDate,duration}  = body;

 // 1. Check Visitor and Appointment details 
    const visitor = await Visitor.findById(visitorId);
  if(!visitor||!hostId ||!visitPurpose || !visitDate ||!duration){
                throw  new  Error (" All fields are required");
  }


  // 2.  Start and End time 
  const start = new Date(visitDate );
   const end =  new Date( start.getTime() + duration * 60000 );


   //3.   Slot conflict check 
 const conflict = await Appointment.findOne({ hostId,
  status: { $in: ["PENDING", "APPROVED"],},
  visitDate: { $lt: end },
  endTime: { $gt: start },
});
 
 
  if  ( conflict) {
        throw new Error("TIME SLOT IS NOT AVAILABLE FOR NOW .SORRY!❎");
  }
 
    //4.              -----CREATE APPOINTMENT----
  
   //Tracking ID Creation
   const trackingId = `APT-${crypto.randomBytes(4).toString("hex").toUpperCase()}`; 

  
   const appointment =
       await Appointment.create({
      trackingId,
       visitorId,
       hostId,
      visitPurpose,
       visitDate: start,
      endTime: end,
       status: "PENDING",
    } );

      //5. ================= Realted data combining  =================
  const populatedAppointment = await Appointment.findById(appointment._id) .populate("hostId", "name").populate( "visitorId","name email");

  //6. ================= EMAIL =================
      if (populatedAppointment.visitorId.email) {
       const html = appointmentRequestTemplate({

        visitorName:populatedAppointment.visitorId.name,
         visitPurpose,
         visitDate:new Date(visitDate).toLocaleString(),
         hostName:populatedAppointment.hostId.name,
         trackingId,
    });

     await sendEmail (
        {
       to:
        populatedAppointment.visitorId.email,
      subject:
        "Appointment Request Submitted",
      html,
      }
);

  }
  // 7.
   return {
     statusCode: 201,
    message:
        "Appointment created ✔️",
     data: populatedAppointment,
  };
 
};

 //   ==================================================
//          SLOT DETAILS
//  ==========================================

//     *Things to keep in mind in this call
// 1.check for the host id and date
// 2. set the start and end date hour to get appointment details between that 
//3. get appoitment with filter 
//4. return response
export   const slotDetailsService = async ( hostId,date) =>  {
 //1.
  if (!hostId || !date ) {
     throw new Error(
       "HostId and date required"
    );
  }
//2.
   // ================= START OF DAY =================
  const startOfDay  = new Date(date);

   startOfDay.setHours(0,0,0,0);

  // ================= END OF DAY =================
    const endOfDay = new Date(date);
      endOfDay.setHours(
     23,
     59,
      59,
     999
  );

 const activeStatuses = ["PENDING","APPROVED","CHECKED_IN",];
 
 //3.
const response = await Appointment.find({
  hostId,
    visitDate: {
     $gte: startOfDay,
    $lte: endOfDay,
  }  ,

  status: {
     $in: activeStatuses,
  },

})
.select("visitDate endTime status")
.sort("visitDate");

//4.
   return  response;


};

//    ======================================================
//    TRACK APPOINTMENT
 //   ======================================================

 export const  trackAppointmentService  = async (appointmentId) => {
  if (!appointmentId )
     {
      throw new Error("Track id required");
  }

  const  appointment_record =
    await Appointment.findOne({
         trackingId: appointmentId,
    });

  if  (  !appointment_record )
     {
    throw new Error("No records");
  }

    return   appointment_record;

};


//  ====================================================
//                   GET  APPOINTMENTS
// ===================================================
export   const  getAppointmentsService  =  async (user)  => {

  if (!user || !user.id )
  {
      throw  new Error("Unauthorized");
  }

     const role = user.role;
   const userId = user.id;

    
   let query = {};

    //   =================  ROLE FILTER  =================
  if  ( role === "EMPLOYEE")
     {
     query.hostId =  userId;
     } else  if (role === "USER")
     {

    query.visitorId =  userId;

  }  else if( role !==  "ADMIN")
     {
     throw  new Error("Access denied");
  }

  //    ================= FETCH =================
  const  appointments =
     await Appointment.find(query)
       .populate(
         "visitorId", "name email phone"
       ).populate(
         "hostId",
        "name email"
       ).populate(
        "approvedBy" ,
        "name"
           )
       .sort({ createdAt: -1 }).lean();

  //    ================= STATS =================
  let stats = {
     total: appointments.length,
    pending: 0,
     approved: 0,
    rejected: 0,
     checkedIn: 0,
    checkedOut: 0};

    appointments.forEach( (a) => 
        {

    if  ( a.status ===  "PENDING") 
      {
    stats.pending++;
    }

    else if ( a.status === "APPROVED" )
       {
    stats.approved++;
    }

    else if (a.status === "REJECTED" ) 
      {
      stats.rejected++;
    } 

    else  if ( a.status === "CHECKED_IN" ) 
      {
      stats.checkedIn++;
    }

    else  if ( a.status  === "CHECKED_OUT")
       {
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


//  =================================================
 // APPROVE APPOINTMENT
//  ===================================================
export  const  approveAppointmentService = async (appointmentId,user) =>
   { const appointment =
      await Appointment.findById(appointmentId).populate("visitorId");

     if  (!appointment ) {
      throw new Error("Appointment not found");
  }

   if ( appointment.status !== "PENDING")
     {
     throw new Error(
      "Appointment already processed "
     );
  }

  //   ================= QR =================
  const filePath = await createQRFile(appointment.trackingId);

  //  ================= UPDATE ==============
   appointment.status = "APPROVED";


   appointment.approvedBy = user._id;
  appointment.approvedAt = new Date();

    appointment.qrUrl = filePath;

       await appointment.save();

  // ================= EMAIL =================
  const  html = approvalEmailTemplate({

       visitorName:
       appointment.visitorId.name,
        visitPurpose:
      appointment.visitPurpose,

     visitDate: new Date(  appointment.visitDate).toLocaleString(),
  }
);


//  ================= PDF =================

const doc = new PDFDocument({
   size: "A4",
  margin: 50,
});

  const  buffers = [];

doc.on("data", (chunk) => {buffers.push(chunk);});


//  ================= HEADER =================

doc.rect(40, 40, 515, 720).stroke("#0F172A");

doc.fontSize(24).fillColor("#0F172A").text( "Visitor Pass", 180,60);
doc.moveDown(2);


// ================= COMPANY =================

doc.fontSize(16).fillColor("#2563EB").text(
      "Visitor Management System",
    {
        align: "center",
    }
  );
doc.moveDown(2);


// ================= VISITOR DETAILS =================

doc.fontSize(14).fillColor("black");

doc.text(
   `Visitor Name: ${appointment.visitorId.name}`
);

doc.moveDown();
doc.text(
  `Purpose: ${appointment.visitPurpose}`
);

doc.moveDown();

doc.text( `Visit Date: ${new Date(  appointment.visitDate).toLocaleString()
  }`
);

doc.moveDown();

doc.text(`Tracking ID: ${appointment.trackingId}`);
doc.moveDown(2);


// ================= STATUS =================

doc.fillColor("green").fontSize(16).text(
      "STATUS: APPROVED",
    {
      align: "center",
     }
  );


// ================= QR =================

doc.image(filePath,
  200,
  420,
{
    width: 150,
    height: 150 }

);


// ================= FOOTER =================

doc.fillColor("gray").fontSize(10).text( "Please show this pass at the reception desk.",120,650);
// ================= FINISH =================

doc.end();
const pdfBuffer =await new Promise((resolve) => {
doc.on("end", () => {
      resolve(
        Buffer.concat(buffers)
      );

    });

});
 await sendEmail({ to:
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

    {
       filename: "visitor-pass.pdf",

      content: pdfBuffer,
    },
  ],
  });

      return appointment;
};


//   ===============================================
//             REJECT APPOINTMENT
  // ====================================================
export  const  rejectAppointmentService =  async ( appointmentId, reason) =>  {

const   appointment = await Appointment.findById(appointmentId).populate("visitorId");

  if (!appointment)  {
         throw new Error("Appointment not found");

  }

  if   ( appointment.status !== "PENDING" ) {
      throw new Error(
          "Appointment already processed");

  }

   // == ============= UPDATE =================
     appointment.status = "REJECTED";

  appointment.rejectionReason = reason;
        await appointment.save();

       //  ================= EMAIL =================
  const html = rejectionEmailTemplate({

    visitorName:appointment.visitorId.name,

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
           "Appointment pending ⏳",
     };

   } 

    if  (  appointment.status === "REJECTED") {
     return {
           message:
              "Appointment rejected ❌",
     };

        }

  //  =============== CHECK-IN =================
    if  (appointment.status === "APPROVED") {

       appointment.status = "CHECKED_IN";
   
      appointment.checkInTime = new Date();

       await appointment.save();

      return {
       message: "Check-In Successful ✅",

      user: { name:
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

  //    ================ CHECK-OUT ===============
  if (  appointment.status === "CHECKED_IN" )
      {

     appointment.status = "CHECKED_OUT";
     appointment.checkOutTime = new Date();
           await appointment.save();

    return {  message: "Check-Out Successful ✅",  user: { name:   appointment.visitorId?.name,  host:
          appointment.hostId?.name,
        purpose:
           appointment.visitPurpose,
        time:
           appointment.checkOutTime,
      },

       };
  }

  // =============    ALREADY CHECKED OUT =================
  if    ( appointment.status === "CHECKED_OUT") {

    return  {
      message:
        "Visitor already checked out ⚠️",
    };
  }
    };





//  ======================================================
//  CHECK SLOT AVAILABILITY
 // ======================================================
export   const   checkSlotAvailabilityService  =
  async  (body)  => { const { hostId, visitDate, duration} = body;

    if ( !hostId || !visitDate ||  !duration
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
       new Date(  start.getTime() + Number(duration) * 60000);

    // ================= PAST BOOKING =================
      if (start < new Date()) {

       return   {
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


    if ( conflict) {

       return { available: false,
        message:
          "Slot already booked",
      };
       }

    return {
      available: true,
         message: "Slot available",
         };
  };