import React from "react";
import  LimitingLine  from "../components/LimitingLine"; // Assuming this is a styled component or Tailwind utility

const Slide = () => (
  <div className="mx-10 text-white">
    <div className="max-h-[425px]  bg-gradient-to-br from-[#09122C] via-[#872341] to-[#E17564] rounded-3xl text-white text-center py-16 px-20">
      <div className="font-bold text-4xl leading-[48px] text-white mb-8">
        What our customers are saying
      </div>
      <LimitingLine isServices />

      <div className="flex flex-col md:flex-row justify-between mt-8">
        <div className="grid grid-cols-2">
          <img
            src= "https://avatar.iran.liara.run/public"
            alt="Founder"
            className="w-24 h-24 rounded-full border-2 border-white bg-white mx-auto mb-4"
          />
          <div className="flex flex-col items-center">
            <div className="font-bold text-2xl leading-[48px]">{`Edward Newgate`}</div>
            <div className="font-normal text-xl leading-[48px] opacity-85">
              Founder Circle
            </div>
          </div>
        </div>

        <div className="pl-10 text-left flex-1 font-normal text-xl leading-8 text-white opacity-90">
          PrescriptPro has truly transformed the way I manage my medications. The smart reminders ensure I never forget a dose, and the easy-to-use interface makes scheduling effortless. It’s the perfect solution for anyone who needs a reliable medication management tool!
        </div>
      </div>
    </div>
  </div>
);

export default Slide;
