import React, { useState, useEffect } from "react";
import { ArrowRight,ArrowLeft, Pill, ClipboardList, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageSlider from "../components/imageSlider";
import Footer from "../components/footer";

import Intro from "../Intro";

const testimonials = [
  {
    name: "Edward Newgate",
    role: "Founder Circle",
    feedback:
      "Our dedicated patient engagement app and web portal allow you to access information instantaneously (no tedious forms, long calls, or administrative hassle) and securely.",
    image: "../../assets/img/founder.svg",
  },
  // Add more testimonials as needed
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  nextArrow: (
    <ArrowRight className="w-8 text-yellow-500 hover:text-yellow-400 transition-colors duration-300" />
  ),
  prevArrow: (
    <ArrowLeft className="w-8 text-yellow-500 hover:text-yellow-400 transition-colors duration-300" />
  ),
};


const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
   const [isIntroEnded, setIntroEnded] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
   
    const token = localStorage.getItem('token'); 
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  setTimeout(() => {
    setIntroEnded(false);
   
  }, 9000);

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    navigate('/'); // Redirect to home or another page
  };

  return (
    <div className="min-h-screen bg-gray-900 text-yellow-500 mb-[2rem">

      {isIntroEnded && (
                <Intro />
              )
            }

    {!isIntroEnded && (
     <div>
      {/* Navbar */}
      <nav className="flex justify-between items-center p-6">
        <div className="text-3xl font-bold">PrescriptPro</div>
        <div className="space-x-4 flex items-center">
          {isLoggedIn ? (
            <>
              {/* Fake User Image */}
              <img
                src="https://avatar.iran.liara.run/public" // Replace with a real user image URL or a placeholder
                alt="User"
                className="rounded-full h-[3rem] w-[50%] "
                />
              <button 
                onClick={handleLogout} 
                className="px-4 py-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors duration-300 rounded-md font-medium"
                >
                Logout
              </button>
            </>
          ) : (
            <>
              <button className="px-4 py-2 font-medium hover:text-yellow-400 transition-colors duration-300">
                Features
              </button>
              <button className="px-4 py-2 font-medium hover:text-yellow-400 transition-colors duration-300">
                Pricing
              </button>
              <button className="px-4 py-2 font-medium hover:text-yellow-400 transition-colors duration-300">
                About
              </button>
              <Link to="/login">
                <button className="px-4 py-2 border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black transition-colors duration-300 rounded-md font-medium">
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button className="px-4 py-2 bg-yellow-500 text-black rounded-md hover:bg-yellow-400 transition-colors duration-300 font-medium">
                  Sign Up
                </button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Main Section */}
      <main className="container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          >
          <h1 className="text-5xl font-bold mb-6">Simplify Your Prescriptions</h1>
          <p className="text-xl mb-8">Manage, track, and refill your medications with ease</p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex justify-center space-x-8 mb-16"
          >
          <FeatureCard
            icon={<Pill className="w-12 h-12 text-yellow-400" />}
            title="Smart Reminders"
            description="Never miss a dose with intelligent notifications"
            />
          <FeatureCard
            icon={<ClipboardList className="w-12 h-12 text-yellow-400" />}
            title="Easy Management"
            description="Keep all your prescriptions organized in one place"
            />
          <FeatureCard
            icon={<Globe className="w-12 h-12 text-yellow-400" />}
            title="Pharmacy Network"
            description="Connect with local pharmacies for quick refills"
            />
        </motion.div>

        {/* Call-to-Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex justify-center"
          >
          <Link to="/dashboard">
            <button className="px-6 py-3 flex items-center bg-yellow-500 text-black rounded-md hover:bg-yellow-400 transition-colors duration-300 font-medium">
              <span>Get Started</span>
              <ArrowRight className="ml-2" />
            </button>
          </Link>
          <button className="ml-4 px-6 py-3 border border-yellow-500 text-yellow-500 rounded-md hover:bg-yellow-500 hover:text-black transition-colors duration-300 font-medium">
            WhatsApp Bot
          </button>
        </motion.div>
      </main>

      <div className="mt-[2rem] pb-[2rem] mb-[2rem]">

        <ImageSlider></ImageSlider>
      
      </div>
      
      <Footer></Footer>
   
  </div>
  
)
}
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-gray-800 p-6 rounded-lg shadow-lg max-w-xs text-center"
    >
    <div className="mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold mb-2">{title}</h3>
    <p>{description}</p>
  </motion.div>
);

export default LandingPage;
