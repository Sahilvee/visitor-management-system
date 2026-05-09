import { asyncHandler } from "../utils/asyncHandler.js";

import {
  createVisitorService,
  getAllVisitorsService,
    verifyVisitorService,
     deleteVisitorService,
}  from "../services.js/visitor.service.js";


 //  ====================================================
 //  CREATE VISITOR
// ======================================================
export  const  createVisitor = asyncHandler(async (req, res) =>
   {

  console.log("BODY:", req.body);
   console.log("FILE:", req.file);

  const result = await createVisitorService(
      req.body,
      req.file,
       req.user
  ) ;

    // Existing visitor
  if  ( result.existing )
     {

    if (result.verified) {
      return res.status(200).json({
        success: true,
         message: "Visitor already verified",
         visitor: result.visitor,
      } 
    );
    }


     return  res.status(200).json ({
       success: true,
        message: "Visitor exists but verification is pending",
         visitor: result.visitor,
      });

  }

   //  New visitor
   res.status(201).json( {
    success: true,
     message: "Visitor created successfully. OTP verification pending.",
      visitor: result.visitor,
  });
});


// ======================================================
  // GET ALL VISITORS
  // ======================================================
export const getAllVisitors = asyncHandler(async (req, res) => {

    const visitors = await getAllVisitorsService();

  res.status(200).json({
 success: true,
      total: visitors.length,
    visitors,
  });
});


 // ======================================================
//   VERIFY VISITOR
  // ======================================================
export const verifyVisitor = asyncHandler(async (req, res) => {

  const visitor = await verifyVisitorService(
    req.params.id
  );

  res.status(200).json({
      success: true,
      message: "Visitor verified successfully",
      visitor,
   });

});


//   ======================================================
  //   DELETE VISITOR
  // ======================================================
export const   deleteVisitor = asyncHandler(async (req, res) => {

  
  await deleteVisitorService(req.params.id);
  res.status(200).json({
      success: true,
     message: "Visitor deleted successfully",
  });


});