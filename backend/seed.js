
import mongoose from "mongoose";
import dotenv from "dotenv";

import User from "./model/usermodel.js";
import Visitor from "./model/visitormodel.js";
import Appointment from "./model/appiontmentmodel.js";
import bcrypt from 'bcrypt'
dotenv.config();

const  seedDatabase =  async () => {

const hashedPassword  =await bcrypt.hash("123456", 10);
  try 
  {

    // ===============================
      //   CONNECT DATABASE
    // ===============================

     await mongoose.connect(process.env.MONGO_URI);

    console.log("Database Connected");

    // ===============================
      // CLEAR OLD DATA
      // ===============================

     await Appointment.deleteMany();
     await Visitor.deleteMany();
    await User.deleteMany();

      console.log("Old Data Removed");

    // ===============================
    //  CREATE USERS
    //   ===============================

    const users = await User.insertMany([

      {
         name: "Admin User",
        email : "admin@test.com",
         phone: "9999999999",
        password: hashedPassword,
        role: "ADMIN",
        status: "ACTIVE"
      },

      {
        name: "Front Desk",
        email : "frontdesk@test.com",
        phone : "8888888888",
        password : hashedPassword,
        role: "FRONTDESK",
        status: "ACTIVE"
      } ,

       {
         name: "Employee User",
          email: "employee@test.com",
          phone: "7777777777",
         password: hashedPassword,
         role: "EMPLOYEE",
         status: "ACTIVE"
      }

      ]);

       console.log("Users Added");

      // ===============================
      // CREATE VISITORS
    // ===============================

    const  visitors =  await Visitor.insertMany([

       {
          name: "Rahul Sharma",
         email: "rahul@test.com",
          phone: "6666666666",
          idType: "Aadhaar",
         idNumber: "123412341234",
         createdBy: "Admin",
         verified: true
      },

      {
        name: "Priya Singh",
        email: "priya@test.com",
        phone: "5555555555",
        idType: "Passport",
        idNumber: "P1234567",
         createdBy: "Admin",
         verified: true
      }

    ]);

    console.log("Visitors Added");
     // ===============================
      // CREATE APPOINTMENTS
    // ===============================

    await  Appointment.insertMany([

      {
        trackingId: "APT-1001",

        visitorId: visitors[0]._id,

        hostId: users[2]._id,

         visitPurpose: "Project Discussion",

          visitDate: new Date(),

        endTime: new Date(
          Date.now() + 60 * 60 * 1000
           ),

            duration: 60,

         status: "APPROVED",

         approvedBy: users[0]._id,

        approvedAt: new Date(),

        checkInTime: new Date()
         },

      {
            trackingId: "APT-1002",

          visitorId: visitors[1]._id,

         hostId: users[2]._id,
   
         visitPurpose: "Interview",

         visitDate: new Date(),

    endTime: new Date(
            Date.now() + 30 * 60 * 1000
        ),

        duration:   30,
 
          status: "PENDING"
      
    }

    ]);

       console.log("Appointments Added");

    // ===============================
    //    DONE
    // ===============================

      console.log("Seed Data Inserted Successfully");

       process.exit();

  }  catch  ( error) {

    console.log(error);
 process.exit(1);
  }
};

seedDatabase();

