import React, { useEffect, useState, useRef } from "react";
import Typed from "typed.js";
import { Pill, Bell, Shield, Clock } from "lucide-react";

const Intro = ({ onClick }) => {

  const [animationFinished, setAnimationFinished] = useState(false);
  const [animationFinished2, setAnimationFinished2] = useState(true);
  const [animationFinished3, setAnimationFinished3] = useState(true);

  const typedRef = useRef(null);

  useEffect(() => {
    const timeout2 = setTimeout(() => {
      setAnimationFinished2(false);
    }, 100);

    const timeout = setTimeout(() => {
      setAnimationFinished(true);
    }, 15000);

    const timeout3 = setTimeout(() => {
      setAnimationFinished3(false);
    }, 9000);

    return () => {
      clearTimeout(timeout);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, []);

  useEffect(() => {
    if (typedRef.current) {
      const typed = new Typed(typedRef.current, {
        strings: [
          "Manage your medication schedule effortlessly.",
          "Get smart reminders for every dose.",
          "Track your health journey seamlessly.",
          "Never miss a dose again!"
        ],
        typeSpeed: 40,
        backSpeed: 30,
        loop: true,
      });

      return () => typed.destroy();
    }
  }, []);

  return (
    <div
      onClick={onClick}
      className={`fixed z-50 left-0 top-0 w-screen h-screen bg-slate-900 transition-opacity duration-1000 flex justify-center items-center ${
        animationFinished ? "opacity-0" : "opacity-100"
      } ${animationFinished3 ? "" : "hidden"}`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 animate-float-slow">
          <Pill className="w-16 h-16 text-emerald-500/10" />
        </div>
        <div className="absolute top-20 right-20 animate-float-delayed">
          <Bell className="w-12 h-12 text-emerald-500/10" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float">
          <Shield className="w-14 h-14 text-emerald-500/10" />
        </div>
        <div className="absolute bottom-10 right-10 animate-float-slow">
          <Clock className="w-16 h-16 text-emerald-500/10" />
        </div>
      </div>

      {/* Main content */}
      <div className="relative text-center space-y-8">
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-12 border border-slate-700/50 shadow-2xl">
          {/* Logo icon */}
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-emerald-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
            <Pill className="w-20 h-20 text-emerald-400 mx-auto relative animate-float" />
          </div>

          {/* Welcome text */}
          <h1
            className={`text-6xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent transition-all duration-1000 mb-6 ${
              animationFinished2 ? "translate-x-[70vw]" : "translate-x-[0vw]"
            } ${
              animationFinished
                ? "opacity-0 translate-y-[50vh]"
                : "translate-y-[0vh] opacity-100"
            }`}
          >
            Welcome to PrescriptPro!
          </h1>

          {/* Typed text container */}
          <div
            className={`relative transition-all duration-1000 ${
              animationFinished2 ? "translate-x-[50vw]" : "translate-x-[0vw]"
            } ${
              animationFinished
                ? "opacity-0 translate-y-[40vh]"
                : "translate-y-[0vh] opacity-100"
            }`}
          >
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent mx-auto mb-8"></div>
            <p className="text-xl text-slate-300 mb-2">Your Personal Medical Assistant</p>
            <p className="text-2xl">
              <span ref={typedRef} className="text-emerald-400 font-medium" />
            </p>
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent mx-auto mt-8"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro;