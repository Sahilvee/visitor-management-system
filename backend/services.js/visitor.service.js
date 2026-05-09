import Visitor from "../model/visitormodel.js";


//  ======================================================
 // CREATE VISITOR
//  ======================================================
export const createVisitorService = async (
  body,file,user
)  => {

   const  {
    name ,
    email ,
      phone,
      idtype,
     idnumber,
  } =  body;

   //  =================  VALIDATION  =================
  if ( !name || !email || !phone ) 
    {
     throw  new 
     Error(
      "Name, email and phone are required"
    );
  }

  //  ID validation
  if  ( idtype &&  !idnumber ) {
        throw new Error(
        "ID number is required when ID type is selected"
    );


  }


  //  ================= CHECK EXISTING VISITOR =================
  let  visitor =  await Visitor.findOne({ phone });

  if (visitor) 
     {

    return {
         existing: true,
         verified: visitor.verified,
         visitor,
    };
  }

 // ================= FILE HANDLING =================
    const photoUrl = file
        ? `/uploads/${file.filename}`
         : null;

  //  ================= CREATE VISITOR  =================
  visitor = await Visitor.create({
    name,
     email,
      phone,

     // Map frontend field names
     idType: idtype ,
     idNumber: idnumber ,

     photoUrl,

    createdBy:  user?.id || "SELF" ,

    verified: false ,


    // Expiry after 24 hours
    expiresAt: new Date(
      Date.now() + 24 * 60 * 60 * 1000
    ),
  });

  return {
     existing: false,
      visitor,
  };


};


// ======================================================
  //  GET ALL VISITORS
// ======================================================
 export  const  getAllVisitorsService =  async () => {

   return await Visitor.find()
     .sort({ createdAt: -1 });
};


//  ======================================================
//  VERIFY VISITOR
// ======================================================
 export const verifyVisitorService = async (id) =>
     {

  const  visitor =  await  Visitor.findById(id);

  if (!visitor ) {
     throw  new Error("Visitor not found");
  }

   visitor.verified = true;

   await visitor.save();

   return visitor;


};


//  ======================================================
//   DELETE VISITOR
 // =====================================================
export const deleteVisitorService  = async (id) => {


  const  visitor = await Visitor.findById(id);

  
  if (!visitor) {
    throw new Error( " Visitor not found");
  }
  await visitor.deleteOne();


};