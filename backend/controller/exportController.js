import { asyncHandler } from "../utils/asyncHandler.js";
import { exportAppointmentsService } from "../services.js/exportAppointmentsService.js";
import { exportUsersService } from "../services.js/exportUserService.js";
export const exportAppointmentController=asyncHandler(async(req,res)=>{
try {

      const pdfBuffer =
            await exportAppointmentsService();

       res.setHeader(
           "Content-Type",
         "application/pdf"
      );

        res.setHeader(
           "Content-Disposition",
         "attachment; filename=appointments.pdf"
      );

             res.send(pdfBuffer);

   }  catch( err) {

       res.status(500).json({
         message: err.message
      });
   }
})
export const exportUserController=asyncHandler(async(req,res)=>{
   try {
       const pdfBuffer =await exportUsersService();

        res.setHeader(
           "Content-Type",
            "application/pdf"
      );

         res.setHeader(
           "Content-Disposition",
         "attachment; filename=appointments.pdf"
      );

     res.send(pdfBuffer);

   } catch( err) {

        res.status(500).json({
          message: err.message
      });
   }
})