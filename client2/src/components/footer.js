import React from "react";
// Import React Icons instead of the images
import { FaHospitalAlt, FaAppStore } from "react-icons/fa"; // Example icons for logo and apps
import { AiOutlineArrowRight } from "react-icons/ai"; // Example icon for arrow
import { IoMdHelpCircle } from "react-icons/io"; // Example icon for help

const Footer = () => (
  <div className="relative">
    {/* Decoration Background Dots */}
    <div className="absolute opacity-60 bg-contain z-10 right-7 mt-[-5%] hidden sm:block">
      {/* <AiOutlineArrowRight className="text-white" size={100} /> */}
    </div>
    {/* Decoration White Dots */}
    <div className="absolute opacity-60 bg-contain bg-no-repeat">
      {/* <AiOutlineArrowRight className="text-white" size={80} /> */}
    </div>

    {/* Footer Wrapper */}
    <div className="flex flex-col px-6 py-24 bg-gradient-to-br from-[#09122C] via-[#872341] to-[#E17564] sm:flex-row">
      {/* Info Text Section */}
      <div className="flex flex-col flex-1 sm:mr-36">
        <div className="mb-6">
      
          <FaHospitalAlt className="text-white text-4xl" />
        </div>
        <p className="text-white font-light text-lg leading-7 mb-24 sm:mb-0">
          Priscriptpro provides progressive, and affordable service for everyone
        </p>
        <div className="text-white font-light text-lg leading-7">
        @Priscriptpro
        </div>
      </div>

      {/* Columns Wrapper */}
      <div className="flex flex-col sm:flex-row flex-1 space-y-12 sm:space-y-0 sm:space-x-12">
        {/* Company Column */}
        <div className="flex flex-col flex-1">
          <h3 className="text-white font-semibold text-2xl leading-[60px] mb-6">Company</h3>
          <div>
            <p className="text-white font-light text-lg leading-9 cursor-pointer hover:underline">About</p>
            <p className="text-white font-light text-lg leading-9 cursor-pointer hover:underline">Testimonials</p>
            <p className="text-white font-light text-lg leading-9 cursor-pointer hover:underline">Find a doctor</p>
            <p className="text-white font-light text-lg leading-9 cursor-pointer hover:underline">Apps</p>
          </div>
        </div>

        {/* Region Column */}
        <div className="flex flex-col flex-1">
          <h3 className="text-white font-semibold text-2xl leading-[60px] mb-6">Region</h3>
          <div>
            <p className="text-white font-light text-lg leading-9 cursor-pointer hover:underline">Indonesia</p>
            <p className="text-white font-light text-lg leading-9 cursor-pointer hover:underline">Singapore</p>
            <p className="text-white font-light text-lg leading-9 cursor-pointer hover:underline">Hongkong</p>
            <p className="text-white font-light text-lg leading-9 cursor-pointer hover:underline">Canada</p>
          </div>
        </div>

        {/* Help Column */}
        <div className="flex flex-col flex-1">
          <h3 className="text-white font-semibold text-2xl leading-[60px] mb-6">Help</h3>
          <div>
            <p className="text-white font-light text-lg leading-9 cursor-pointer hover:underline">Help center</p>
            <p className="text-white font-light text-lg leading-9 cursor-pointer hover:underline">Contact support</p>
            <p className="text-white font-light text-lg leading-9 cursor-pointer hover:underline">Instructions</p>
            <p className="text-white font-light text-lg leading-9 cursor-pointer hover:underline">How it works</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
