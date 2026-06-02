import React from "react";
import { Link } from "react-router-dom";

export default function VisitorPage() {
  return (
    <div className="min-h-screen bg-gray-100 overflow-hidden">

             {/* HERO SECTION */}
      <section className="relative min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">

        <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl"></div>
             <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-400/10 rounded-full blur-3xl"></div>
           <div className="absolute inset-0 bg-black/10"></div>

        {/* NAv-BAR */}
        <nav className="relative z-20 flex items-center justify-between px-8 lg:px-16 py-4">
           <div>
            <h1 className="text-3xl font-bold tracking-wide">
              VisitorMS
            </h1>
          </div>

        </nav>

        {/* Main content*/}

          <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 pt-4 lg:pt-8 grid lg:grid-cols-2 gap-16 items-center min-h-[85vh]">

          {/* Left content */}

               <div>

           <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-5 py-2 text-sm mb-8">
                Smart Visitor Management Platform
              </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">

                 Visitor
              <span className="block text-blue-200">
                Portal
              </span>

               </h1>

            <p className="mt-8 text-lg md:text-xl text-blue-100 leading-relaxed max-w-2xl">
                      Register visitors, book appointments,
               track approvals, and manage secure QR-based
              check-ins through one modern platform.

               </p>

            {/* Stats */}

           <div className="grid grid-cols-3 gap-4 mt-14">

              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center">

                 <h2 className="text-3xl font-bold">
                  QR
                  </h2>

                  <p className="text-sm text-blue-100 mt-2">
                  Smart Check-In
                </p>

              </div>
              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center">

                <h2 className="text-3xl font-bold">
                  Fast
                 </h2>

                <p className="text-sm text-blue-100 mt-2">
                      Easy Booking
                 </p>
              </div>

              <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-center">
                 <h2 className="text-3xl font-bold">
                  24/7
                </h2>
                   <p className="text-sm text-blue-100 mt-2">
                  Secure Access
                </p>

              </div>
            </div>
          </div>

          {/* Right contenet*/}

            <div  className="relative" >

            {/* Main card */}
               <div  className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[40px] p-10 lg:p-12 shadow-2xl min-h-[650px] flex flex-col justify-center">

                      <div className=" mb-10 ">
 
                  <h2 className="text-4xl  font-bold">
                  Quick Actions
                </h2>

                <p className="text-blue-100 mt-3 text-lg">
                   Choose how you want to continue
                 
                  </p>
              </div>

              {/* Actions */}
                <div className="space-y-7">



                {/*  Register visitor */}
                <Link  to="/register-form">
                  <div className="group bg-white/10 hover:bg-white/20 border border-white/10 rounded-3xl p-7 transition-all duration-300 flex items-center justify-between cursor-pointer min-h-[120px]">

                       <div>

                      <h3 className="text-2xl font-semibold">
                        Register Yourself

                      </h3>

                      <p className="text-blue-100 text-base mt-3">
                        Create your visitor profile securely

                        </p>
                          </div>

                    <div className="w-16 h-16 rounded-2xl bg-blue-400/20 flex items-center justify-center text-3xl group-hover:translate-x-1 transition">
                         →
                       </div>
                  </div>

                        </Link>

                {/* Booking */}
                <Link to="/book-appointment">

                    <div className="group bg-white/10 hover:bg-white/20 border border-white/10 rounded-3xl p-7 transition-all duration-300 flex items-center justify-between cursor-pointer min-h-[120px]">

                      <div>
                         <h3 className="text-2xl font-semibold">
                            Book Appointment
                          </h3>

                      <p className="text-blue-100 text-base mt-3">
                           Schedule meetings with employees
                      </p>
                    </div>


                    <div className="w-16 h-16 rounded-2xl bg-green-400/20 flex items-center justify-center text-3xl group-hover:translate-x-1 transition">
                       →
                     </div>

                    </div>
                </Link>

                {/* TRACK */}
                <Link  to="/track-appointment">

                  <div className=" group bg-white/10  hover:bg-white/20  border border-white/10 rounded-3xl  p-7 transition-all duration-300 flex items-center justify-between cursor-pointer  min-h-[120px]">
 

                      <div>

                      <h3 className="text-2xl   font-semibold">
                        Track Appointment

                        </h3>

                      <p className="text-blue-100 text-base mt-3">
                           Monitor approval & visitor status

                        </p>

                    </div>


                    <div className="w-16 h-16 rounded-2xl bg-purple-400/20 flex items-center justify-center text-3xl group-hover:translate-x-1 transition">
                      →
                       </div>

                  </div>
                </Link>

              </div>


             </div>

          </div>
             </div>

      </section>
       </div>
  );
}