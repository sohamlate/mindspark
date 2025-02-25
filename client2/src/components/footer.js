import React from "react";
import { FaHospitalAlt } from "react-icons/fa"; 

const Footer = () => (
  <div className="relative">
    {/* Footer Wrapper */}
    <div className="flex flex-col px-6 py-16 bg-slate-900 text-white sm:flex-row">
      {/* Info Text Section */}
      <div className="flex flex-col flex-1 sm:mr-36">
        <div className="mb-6">
          <FaHospitalAlt className="text-emerald-400 text-4xl" />
        </div>
        <p className="text-white text-opacity-90 font-light text-lg leading-7 mb-6">
          Priscriptpro provides progressive and affordable service for everyone.
        </p>
        <div className="text-white font-light text-lg">@Priscriptpro</div>
      </div>

      {/* Columns Wrapper */}
      <div className="flex flex-col sm:flex-row flex-1 space-y-12 sm:space-y-0 sm:space-x-12">
        {/* Company Column */}
        <div className="flex flex-col flex-1">
          <h3 className="text-white text-opacity-90 font-semibold text-2xl mb-4">Company</h3>
          <div className="space-y-2">
            <p className="cursor-pointer hover:text-emerald-400 transition">About</p>
            <p className="cursor-pointer hover:text-emerald-400 transition">Testimonials</p>
            <p className="cursor-pointer hover:text-emerald-400 transition">Find a doctor</p>
            <p className="cursor-pointer hover:text-emerald-400 transition">Apps</p>
          </div>
        </div>

        {/* Region Column */}
        <div className="flex flex-col flex-1">
          <h3 className="text-white text-opacity-90 font-semibold text-2xl mb-4">Region</h3>
          <div className="space-y-2">
            <p className="cursor-pointer hover:text-emerald-400 transition">Indonesia</p>
            <p className="cursor-pointer hover:text-emerald-400 transition">Singapore</p>
            <p className="cursor-pointer hover:text-emerald-400 transition">Hong Kong</p>
            <p className="cursor-pointer hover:text-emerald-400 transition">Canada</p>
          </div>
        </div>

        {/* Help Column */}
        <div className="flex flex-col flex-1">
          <h3 className="text-white text-opacity-90 font-semibold text-2xl mb-4">Help</h3>
          <div className="space-y-2">
            <p className="cursor-pointer hover:text-emerald-400 transition">Help center</p>
            <p className="cursor-pointer hover:text-emerald-400 transition">Contact support</p>
            <p className="cursor-pointer hover:text-emerald-400 transition">Instructions</p>
            <p className="cursor-pointer hover:text-emerald-400 transition">How it works</p>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom Border & Copyright */}
    <div className="border-t border-slate-700 text-center py-4 text-white text-opacity-60 text-sm bg-slate-800">
      © {new Date().getFullYear()} Priscriptpro. All rights reserved.
    </div>
  </div>
);

export default Footer;
