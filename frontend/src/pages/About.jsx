import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


export default function AboutPage()  {

  const navigate =  useNavigate();

  return (

    <div  className="min-h-screen relative  overflow-hidden  text-white">

      {/* BACK BUTTON */}
      <motion.button 
        onClick={() => navigate(-1)}
         initial={{ opacity: 0, x: -20 }}
         animate={{ opacity: 1, x: 0 }}
         whileHover={{ scale: 1.12 }}
         whileTap={{ scale: 0.92 }}
         className="fixed top-5 left-5 z-50 px-4 py-2 rounded-xl
                   bg-white/10 border border-white/20 backdrop-blur-xl
                   text-white shadow-lg hover:bg-white/20 transition"
      >
         ←  Back
      </motion.button>

      {/*  BACKGROUND  ( MATCH HOMEPAGE GRADIENT )  */}
      <div  className="absolute inset-0 bg-gradient-to-br  from-blue-600 via-indigo-600 to-purple-700"></div>

      {/* BLUR ORBS */}
      <div  className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-white/10  blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-150px]  right-[-100px] w-[400px] h-[400px]  bg-cyan-300/10 blur-3xl rounded-full"></div>

      {/* GRID */}
      <div
         className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
             "linear-gradient(to right,  white 1px,  transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
           backgroundSize: "60px 60px",
        }}
      >

      </div>

        {/*  HERO SECTION */}
      < section className = "relative z-10 max-w-7xl mx-auto px-6 lg:px-12 pt-24 pb-20">

        <div  className =" grid lg:grid-cols-2 gap-16 items-center ">

          {/*  LEFT  SIDE */}
          <div>

            <div  className = " inline-flex items-center gap-2 px-4 py-2  rounded-full bg-white/10 border  border-white/20 backdrop-blur-xl text-sm text-white/80 mb-8">
                 About Our Project
            </div>

            <h1  className="text-5xl  lg:text-7xl font-black  leading-tight tracking-tight">
                    Visitor
               <span className="block text-cyan-200">
                   Management
              </span >
               System
            </h1>
            <p className ="mt-8 text-lg  text-white/80 leading-relaxed  max-w-2xl">
               A modern smart visitor management platform designed
              to simplify visitor registration, appointment booking,
              OTP verification, QR-based check-in, and secure
              appointment tracking.
            </p>

            {/* FEATURES */}
            < div  className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-12">

              < div className= " bg-white/10  border  border-white/20  rounded-3xl  p-6 backdrop-blur-xl hover:bg-white/15 transition">
                <h2  className =" text-2xl  font-bold text-cyan-200">OTP</h2>
                <p className  =" text-white/70 mt-3 text-sm">
                    Secure email verification before registration.
                 </p>
                 </div>

              <div  className=" bg-white/10 border  border-white/20 rounded-3xl p-6  backdrop-blur-xl  hover:bg-white/15 transition">
                  <h2 className="text-2xl font-bold text-cyan-200"> QR Check-In</h2>
              <p className="text-white/70 mt-3 text-sm">
                   Fast QR-based visitor check-in system.
                </p>

              </div>

              <div className= " bg-white/10  border  border-white/20  rounded-3xl p-6 backdrop-blur-xl hover:bg-white/15 transition">
                   <h2 className="text-2xl font-bold text-cyan-200">Live Tracking</h2>
                 <p className="text-white/70 mt-3 text-sm">
                           Real-time appointment status updates.
                </p>

              </div>

              <div  className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-xl hover:bg-white/15 transition">
                 <h2 className="text-2xl font-bold text-cyan-200" >Smart  Booking</h2>
                <p  className= "text-white/70 mt-3 text-sm">
                    Slot-based appointment scheduling system.
                 </p>
             </div>

            </div>


          </div>

                   {/* RIGHT SIDE */}
          <div  className="relative  flex  items-center  justify-center">

            <div className= "relative w-full max-w-lg rounded-[40px] bg-white/10 border border-white/20 backdrop-blur-2xl p-10 shadow-[0_0_80px_rgba(0,0,0,0.25)] overflow-hidden">

              { /*  SPIN EFFECT */}
              <div
                   className="absolute -top-20 -right-20 w-60 h-60 border-[20px] border-cyan-300/10 rounded-full animate-spin"
                style={{ animationDuration: "20s" }}
              ></div>

              <div className=" relative z-10 ">

                 <h2 className=" text-4xl font-bold">
                   Project Overview
                </h2>

                <p className="text-white/80 mt-4 leading-relaxed">
                  This project was developed to create a
                   professional digital visitor handling system
                  for organizations and institutions.
                </p>

                 {/* STACK */}
                 <div className="mt-10 space-y-4">

                   <div className="flex  justify-between bg-white/10  border  border-white/20 rounded-2xl px-5 py-4">
                      <span className="text-white/70"> Frontend</span>
                    <span  className="text-cyan-200 font-semibold">
                       React + Tailwind
                    </span>


                  </div>

                  < div  className="flex justify-between  bg-white/10 border  border-white/20  rounded-2xl px-5 py-4" >
                     <span className="text-white/70">Backend</span >
                    <span className="text-cyan-200 font-semibold" >
                      Node + Express
                    </span>

                  </div>

                <div  className="flex justify-between bg-white/10 border border-white/20 rounded-2xl px-5 py-4">
                     < span className="text-white/70">Database </span>
                    <span className="text-cyan-200 font-semibold" >
                       MongoDB
                     </span>
                  </div>

                  <div className="flex justify-between bg-white/10 border border-white/20 rounded-2xl px-5 py-4">
                    
                    <span className ="text-white/70"> Security</span>
                    <span className="text-cyan-200 font-semibold ">

                      OTP + QR
                    </span>
                  </div>

                </div>


              </div>

           
                   </div>

          </div>
        </div>

      </section>

    </div>
  );
  
}