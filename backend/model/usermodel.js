import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
     name:  {
       type: String,
        required: true,
        trim: true,
        minlength: 2
    },

    email :  {
       type: String,
        required: true,
        unique: true,
        lowercase: true,
      trim: true
    },

    phone: {
       type: String,
       required: true,
      match: /^[0-9]{10}$/
    },

   password: {
      type: String,
      required: true,
       minlength: 6,
        select: false }  ,

      
    role: {
        type: String,
        enum: ["ADMIN", "EMPLOYEE", "FRONTDESK"],
        required: true
    },

   status:  {
       type: String,
      enum: [ "ACTIVE", "INACTIVE"],
       default: "ACTIVE"
    },

    organization: {
        type: mongoose.Schema.Types.ObjectId,
       ref: "Organization"
    },

     lastLogin: {
        type: Date
    },

     createdBy: {
      
        type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      
      
    }
  },
  {

    timestamps: true
  }
);

//hide field
userSchema.set("toJSON", {

    transform: function (doc, ret) {
     delete ret.password;
    delete ret.__v;
     return ret;
  }
  
});

export default mongoose.model("User", userSchema);
