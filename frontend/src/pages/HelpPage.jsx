import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


export default function HelpPage() {

  const navigate = useNavigate();

  return (
     <div className="min-h-screen relative text-white overflow-hidden">

      {/* BACK BUTTON */}
      <motion.button
        onClick={() => navigate(-1)}
         initial={{ opacity: 0, x: -20 }}
         animate={{ opacity: 1, x: 0 }}
         whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed top-5 left-5 z-50 px-4 py-2 rounded-xl
                   bg-white/10 border border-white/20 backdrop-blur-xl
                   shadow-lg hover:bg-white/20 transition text-sm"
      >
        ← Back
      </motion.button>

      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700"></div>

      {/* DECOR ELEMENTS */}

      <div className="absolute  top-[-120px] left-[-120px]  w-[350px] h-[350px]  bg-white/10 blur-3xl rounded-full"></div>
      <div className="absolute bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-cyan-300/10 blur-3xl rounded-full"></div>

                {/* WRAPPER */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-28 pb-20">

        {/* HEADER */}
        <header className="text-center mb-14">

          <h1 className="text-5xl font-bold tracking-tight">
            Help <span className="text-cyan-200">Center</span>
          </h1>
          <p className="text-white/70 mt-4 text-lg">
            Visitor Management System — User Guidelines & System Information
          </p>
        </header>

            {/* GRID */}
        <div className="grid lg:grid-cols-12 gap-8">
           {/* LEFT NAV */}
          <aside className="lg:col-span-3 space-y-4">

            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-xl">
              <h2 className="text-cyan-200 font-semibold mb-4 text-sm uppercase tracking-wider">
                Contents
              </h2>
              <ul className="space-y-3 text-white/70 text-sm">
                <li>• System Overview</li>
                <li>• Registration Process</li>
                <li>• Appointment Flow</li>
                <li>• QR Verification</li>
                <li>• Admin Access Policy</li>
                <li>• Security Standards</li>
              </ul>
            </div>

            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-xl text-sm text-white/70">
              <p>
                Users are advised to complete registration before initiating any appointment request.
              </p>
            </div>

          </aside>

          {/* MAIN CONTENT */}
          <main className="lg:col-span-6 space-y-6">

            <section className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-cyan-200">
                System Overview
              </h2>
              <p className="mt-3 text-white/80 leading-relaxed">
                The Visitor Management System is designed to digitize and streamline
                visitor entry, appointment scheduling, and verification processes
                through a secure and structured workflow.
              </p>
            </section>

            <section className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-xl">
              <h2 className="text-xl font-semibold text-cyan-200">
                Registration Requirement
              </h2>
              <p className="mt-3 text-white/80 leading-relaxed">
                All users must complete the registration process prior to accessing
                system features. This ensures identity verification and proper tracking
                of visitor activities.
              </p>
            </section>


            <section className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-xl">
              
              <h2 className="text-xl font-semibold text-cyan-200">
                Appointment Management
              </h2>
              <p className="mt-3 text-white/80 leading-relaxed">
               
                Appointment booking is available only after successful registration.
                Each appointment is assigned a unique tracking identifier for monitoring
                and validation purposes.
              </p>
            </section>

            <section className="bg-white/10 border border-white/20 rounded-3xl p-6 backdrop-blur-xl">
             
              <h2 className="text-xl font-semibold text-cyan-200">
              
                QR-Based Verification
              </h2>
              
              <p className="mt-3 text-white/80 leading-relaxed">
                Entry validation is performed using QR code scanning at the reception desk.
                Verification is mandatory for secure access control.
              </p>

            </section>

            <section  className="bg-white/10 border  border-white/20 rounded-3xl p-6 backdrop-blur-xl">
              <h2 className="text-xl  font-semibold  text-cyan-200">
                Admin Access Policy
              </h2>
              <p className="mt-3 text-white/80 leading-relaxed">
                Administrative login access is restricted to authorized personnel only.
                Administrators are responsible for managing visitor approvals and system oversight.
              </p>
            </section>
          </main>

          {/*   RIGHT SUPPORT PANEL */}
          <aside className="lg:col-span-3 space-y-4">

            <div className="bg-white/10 border border-white/20 rounded-2xl p-5 backdrop-blur-xl">
               <h2 className="text-cyan-200 font-semibold mb-4 text-sm uppercase tracking-wider">
                 Support Information
              </h2>

              <div className="space-y-3 text-sm text-white/80">
                 <p><span className="text-white/60">Email:</span> support@visitorms.com</p>
                 <p><span className="text-white/60">Phone:</span> +91 98765 43210</p>
                <p><span className="text-white/60">Hours:</span> Mon–Sat, 10:00 AM – 6:00 PM</p>
                <p><span className="text-white/60">Response Time:</span> Within 24 hours</p>
              </div>
            </div>

            <div  className="bg-white/10  border  border-white/20 rounded-2xl p-5 backdrop-blur-xl text-sm text-white/70">
                      <p>
                For urgent technical issues, please contact support directly via email or phone.
                       </p>
            </div>

          </aside>

        </div>


                                         {/* FOOTER */}
        <footer className="text-center mt-16 text-white/40 text-sm">
          Visitor Management System • Documentation Portal
        </footer>
      </div>
    </div>
  );

}