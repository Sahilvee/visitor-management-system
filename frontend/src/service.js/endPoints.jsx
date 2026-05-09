// Centralized API endpoint configuration

// Helps  avoid hardcoding  URLs  across the project

const  endpoints = {

  //  =================  AUTH  =================
   // Send OTP to user email/phone for verification
     SEND_OTP: "/auth/otp",

  // Verify OTP received by user
  VERIFY_OTP: "/auth/otp",

  // =================  Visitor =================
    //  Register a new visitor in the system
   REGISTER_VISITOR: "/visitors",

  // ================= APPOINTMENTS =================
  // Create a new appointment
  CREATE_APPOINTMENT: "/appointments",

   // Get details of a  specific appointment using ID
  TRACK_APPOINTMENT: (appointmentId) =>
    `/appointments/${appointmentId}`,

  // Get all appointments   (Admin use)
ADMIN_APPOINTMENT: "/appointments",

  // Check available  slots for appointments
  SLOT_DETAILS: "/appointments/slots",

  //  Validate if a slot is available or not
  CHECK_SLOT: "/appointments/check-slot",

  //  Check-IN/OUT operations (Front desk)
     FRONT_DESK: "/appointments/CheckInCheckOut",

   // =================  ADMIN =================
  // Admin  login  authentication
      ADMIN_LOGIN: "/auth/login",

  // Get all registered users (Admin only)
     ADMIN_GET_USERS: "/admin/users",

   // Create new user (Admin only)
    ADMIN_CREATE_USERS: "/admin/users",


};

export default endpoints;