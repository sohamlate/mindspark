import React from "react";

const Slide = () => (
  <div className="mx-4 sm:mx-10 text-white">
    <div className="max-h-[425px] bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 text-white text-center py-16 px-8 sm:px-20">
      <div className="font-bold text-3xl sm:text-4xl leading-tight text-emerald-400 mb-8">
        What our customers are saying
      </div>
      <div className="w-24 h-1 bg-emerald-500/50 mx-auto mb-8 rounded-full" />

      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <img
            src="https://avatar.iran.liara.run/public"
            alt="Founder"
            className="w-24 h-24 rounded-full border-2 border-emerald-500/50 bg-slate-800 mx-auto"
          />
          <div className="flex flex-col items-center sm:items-start">
            <div className="font-bold text-2xl leading-tight text-emerald-400">Edward Newgate</div>
            <div className="font-normal text-lg text-slate-300">Founder Circle</div>
          </div>
        </div>

        <div className="text-left flex-1 font-normal text-lg leading-relaxed text-slate-300">
          "PrescriptPro has truly transformed the way I manage my medications. The smart reminders ensure I never forget a dose, and the easy-to-use interface makes scheduling effortless. It's the perfect solution for anyone who needs a reliable medication management tool!"
        </div>
      </div>
    </div>
  </div>
);

export default Slide