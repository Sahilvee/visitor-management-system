import mongoose from "mongoose";

const  visitorSchema  = new mongoose.Schema(
  {
    name: {
        type: String,
      required: true,
        trim: true,
    },

    email: {
      type: String,
      trim: true,
       lowercase: true,
    }, 

    phone : {
       type: String,
       required: true,
        trim: true,
       unique: true, // important
    } ,

     photoUrl : {
       type: String,
    },

    idType: {
       type: String,
      enum:  [ "Aadhaar", "DL", "Passport"],
    },

    idNumber: {
      type:  String,
       trim: true,
    },

      createdBy: {
      type: String,
       required: true,
    },

    verified: {
      type: Boolean,
        default: false,
    },

     // ✅ TTL field
  expiresAt: {
       type: Date,
      default: null,
    },
  },
  {  
    timestamps: true }
);

         // TTL index (works only when expiresAt has a value)
visitorSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


const  Visitor =  mongoose.model("Visitor", visitorSchema) ;
export default Visitor;