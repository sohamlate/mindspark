import React, { useEffect, useState, useRef } from "react";
import Typed from "typed.js";

const Intro = () => {
  const [animationFinished, setAnimationFinished] = useState(false);
  const [animationFinished2, setAnimationFinished2] = useState(true);
  const [animationFinished3, setAnimationFinished3] = useState(true);

  const typedRef = useRef(null); // Create a reference for Typed.js

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
          "Get smart reminders.",
          "Never miss a dose again!",
        ],
        typeSpeed:30,
        backSpeed: 20,
        loop: true,
      });

      return () => typed.destroy(); // Cleanup Typed instance
    }
  }, []);

  return (
    <div
      className={`fixed z-50 left-0 top-0 w-screen h-screen bg-gradient-to-br from-[#09122C] via-[#872341] to-[#E17564] transition-opacity duration-1000 flex justify-center items-center ${
        animationFinished ? "opacity-0" : "opacity-100"
      } ${animationFinished3 ? "" : "hidden"}`}
    >
      <div className="text-center space-y-8">
        {/* Project Name Animation */}
        <h1
          className={`text-5xl font-bold text-white transition-all duration-1000 ${
            animationFinished2 ? "translate-x-[70vw]" : "translate-x-[0vw]"
          } ${
            animationFinished
              ? "opacity-0 translate-y-[50vh]"
              : "translate-y-[0vh] opacity-100"
          }`}
        >
          Welcome to PrescriptPro!
        </h1>

        {/* React Typed Fix: Attach ref to span */}
        <p
          className={`text-lg text-white max-w-md mx-auto transition-all duration-1000 ${
            animationFinished2 ? "translate-x-[50vw]" : "translate-x-[0vw]"
          } ${
            animationFinished
              ? "opacity-0 translate-y-[40vh]"
              : "translate-y-[0vh] opacity-100"
          }`}
        >
          <span ref={typedRef} className="text-yellow-300" />
        </p>
      </div>
    </div>
  );
};

export default Intro;
