import mongoose from 'mongoose'

const  appointmentSchema  =  new mongoose.Schema(
  {

     trackingId: {
       type: String,
       required: true,
       unique: true,
        index: true,
    } ,

     visitorId:  {
       type: mongoose.Schema.Types.ObjectId,
       ref: "Visitor",
        required: true,
    },

     hostId: {
       type: mongoose.Schema.Types.ObjectId,
       ref: "User",
        required: true,
    },

    visitPurpose: {
       type: String,
        required: true,
        trim: true,
    },

     visitDate: {
       type: Date,
      required: true,
     },


  endTime: {
        type: Date,
    },

   
    duration: {
        type: Number, // minutes
    },
     
    // ✅ UPDATED STATUS FLOW
     status: {
       type: String,
    enum: [
         "PENDING",
          "APPROVED",
          "REJECTED",
         "CANCELLED",
        "CHECKED_IN",
          "CHECKED_OUT"
      ],
      default: " PENDING",
    },

       // ✅ Check-in / Check-out
     checkInTime: Date,
    checkOutTime: Date,

    approvedBy: {
       type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

     approvedAt: Date,

    rejectionReason: {
       type: String,
     trim: true,
    },

     qrUrl: {
      type: String
    },
  },
  {
    timestamps: true,

  }
);

// 📈  Helpful   indexes
 appointmentSchema.index({ visitorId: 1 });
appointmentSchema.index({ hostId: 1 });
appointmentSchema.index({ visitDate: 1 });

appointmentSchema.index({ organizationId: 1 });

 const Appointment =  mongoose.model("Appointment", appointmentSchema) ;
 
export default Appointment