import { useState } from "react";
import { Link } from "react-router-dom";


function Home() {

  const [open, setOpen] = useState(false);

  return (

    <div className="min-h-screen bg-gray-100 overflow-x-hidden">

      {/* NAVBAR  */}
      <nav  className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200  sticky top-0 z-50">
        <div className="max-w-7xl  mx-auto flex items-center justify-between px-6 py-4">
          {/* LOGO */}
          <div>

            <h1 className=" text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              VisitorMS
            </h1 >

          </div  >

          {/* DESKTOP  MENU */}
          <ul  className="hidden md:flex items-center gap-8 text-gray-700 font-medium">

            <li className="hover:text-blue-600 transition  cursor-pointer">
              Home
            </li>
            <li className="hover:text-blue-600 transition cursor-pointer">
                <Link
    to="/about"
    className="hover:text-blue-600 transition"
  >

    About
  </Link>
             </li>

             <li className="hover:text-blue-600 transition cursor-pointer">
                        <Link
    to="/help"
    className="hover:text-blue-600 transition"
  >
    Help

  </Link>
            </li>

            <li>
              <Link
                to="/auth/login"
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-5 py-2 rounded-xl shadow-md transition-all duration-200"
              >

                Login
              </Link>
            </li>

          </ul>

          {/* MOBILE BUTTON */}
          <button
            className="md:hidden text-2xl text-gray-700"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>
        </div>


        {/* MOBILE MENU */}
        {open && (
          <div className=" md:hidden  border-t border-gray-200 bg-white">

            <ul className="flex flex-col px-6 py-4 gap-4 text-gray-700 ">

              <li className="hover:text-blue-600 cursor-pointer ">
                 Home
              </li>
              <li className="hover:text-blue-600 cursor-pointer">
                <Link to="/about">About</Link>
              </li>

              <li className= "hover:text-blue-600 cursor-pointer">
                           <Link
    to="/help"

    className="hover:text-blue-600 transition"
  >
    Help
  </Link>

              </li>

               <li>
                <Link
                   to="/auth/login"
                     className="inline-block  bg-gradient-to-r from-blue-500 to-indigo-600  text-white px-4 py-2 rounded-xl"
                >
                   Login
                </Link>

              </li>
            </ul>

          </div>
        )}
      </nav>

      {/* HERO SECTION */}

        <section  className="relative min-h-[90vh]  flex items-center justify-center  overflow-hidden">

                   {/* BACKGROUND */}
        <div className=" absolute  inset-0 bg-gradient-to-br  from-blue-600 via-indigo-600 to-purple-700"></div>

         {/*  BLUR CIRCLES */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
           <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl"></div>

        {/* CONTENT */}
        <div className="relative z-10 text-center px-6 max-w-5xl">

          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-5 py-2 text-white text-sm mb-8">
             Secure Visitor Management Platform
          </div>

             <h1 className="text-5xl  md:text-7xl font-bold text-white leading-tight">
            Smart Visitor
            <span className="block bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent">
              Management System
            </span>
          </h1>

          <p className= "text-blue-100 text-lg md:text-xl mt-6 max-w-3xl mx-auto leading-relaxed">
            Simplify visitor tracking, appointment approvals,
            QR check-ins, employee coordination, and security
            management through one modern platform.
          </p>

                                            {/* BUTTONS */}
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">


            <Link
              to="/visitors"
              className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold shadow-xl transition-all duration-200"
            >
              Visitor Registration →
             </Link>

            <Link
              to="/auth/login"
              className="bg-white/10 backdrop-blur-md  border  border-white/20 text-white hover:bg-white/20 px-8 py-4 rounded-2xl font-semibold transition-all duration-200"
            >

               Admin Login
               </Link>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20">
  

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-white shadow-xl">
              <h2 className="text-4xl font-bold">24/7</h2>
              <p className="text-blue-100 mt-2">
                Real-Time Monitoring
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-white shadow-xl">
              
              <h2 className="text-4xl font-bold">QR</h2>
              <p className="text-blue-100 mt-2">
                Fast Visitor Check-In
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/10 rounded-3xl p-6 text-white shadow-xl">
              
              <h2 className="text-4xl font-bold">Secure</h2>
              <p className="text-blue-100 mt-2">
                Role Based Authentication
              </p>
            </div>
          </div>

        </div>

      </section>


      {/* FOOTER */}

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        
         © 2026 Visitor Management System • Built with React & Tailwind
      </footer>

    </div>
  );
  
}

export default Home;