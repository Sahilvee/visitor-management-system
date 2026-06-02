import React from "react";
import { Link } from "react-router-dom";

function ErrorPage() {
  return (

    <div className=" min-h-screen  relative overflow-hidden  bg-[#0B1120] flex items-center justify-center px-6">

    
       <div className="absolute top-[-120px]  left-[-120px] w-[350px] h-[350px] bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>

      <div className =" absolute  bottom-[-150px] right-[-100px] w-[400px] h-[400px] bg-indigo-500/20 blur-3xl rounded-full animate-pulse"></div>

      {/* GRID BACKGROUND */}
      <div  className="absolute inset-0 opacity-[0.04]"
        style={{
           backgroundImage:
              " linear-gradient(to right, white 1px, transparent 1px),  linear-gradient(to bottom, white 1px, transparent 1px)",
           backgroundSize: "60px 60px",
        }}
      > </div>

    
      <div   className="relative  z-10 max-w-5xl  w-full grid lg:grid-cols-2  items-center gap-14">

       
        <div className= "text-white">
  
          <div className=" inline-flex  items-center gap-2 px-4 py-2 rounded-full bg-white/5 border  border-white/10 backdrop-blur-xl  text-sm text-gray-300  mb-8">
             Error 404  
           </div>

           <h1 className="text-7xl lg:text-9xl font-black leading-none tracking-tight">
             Lost
             </h1>

          <h2   className="text-4xl lg:text-5xl  font-bold mt-4 text-gray-200">
             Page Not Found
             </h2>

          <p className="mt-6  text-gray-400  text-lg leading-relaxed max-w-lg">
            The page you are looking for doesn’t exist
             or has been moved to another location.
            </p>

      
          <div className="flex flex-wrap gap-4 mt-10">

            <Link to="/">
            <button className="px-7 py-4 rounded-2xl bg-white text-[#0B1120] font-semibold hover:scale-105 transition duration-300 shadow-2xl">
                Back to Home
              </button>
             </Link>

             <button onClick={() => window.history.back()}
              className="px-7 py-4 rounded-2xl border border-white/10 bg-white/5 text-white backdrop-blur-xl hover:bg-white/10 transition duration-300"
            >
              Go Back
            </button>

          </div>

        </div>


        <div className="relative flex items-center justify-center">
            <div  className="relative w-[320px] h-[320px] rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-2xl shadow-[0_0_80px_rgba(59,130,246,0.15)] flex items-center justify-center overflow-hidden">

     
            <div className="absolute w-[420px] h-[420px] border-[30px] border-cyan-400/10 rounded-full animate-spin"
              style={{ animationDuration: "18s" }}
            ></div>

               <div  className="absolute w-56 h-56 rounded-full bg-gradient-to-br from-cyan-400/20 to-indigo-500/20 blur-xl"></div>

            <div  className="relative z-10 text-center">

              <h1  className="text-7xl font-black text-white tracking-wider">   404
              </h1>

                <p className="text-gray-300 mt-3">
                 Invalid Route
              </p>

            </div>

          </div>

          </div>

         </div>

        </div>
  );
  
}


export default ErrorPage;