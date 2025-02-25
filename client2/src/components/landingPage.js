import React, { useState, useEffect } from "react";
import { 
  ArrowRight, 
  ArrowLeft, 
  Pill, 
  ClipboardList, 
  Globe,
  Bell,
  Calendar,
  Clock,
  Shield,
  Smartphone,
  Users
} from "lucide-react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ImageSlider from "../components/imageSlider";
import Footer from "../components/footer";
import Intro from "../Intro";
import MedicalQuery  from "./MedicalQuery";

const testimonials = [
  {
    name: "Edward Newgate",
    role: "Founder Circle",
    feedback:
      "Our dedicated patient engagement app and web portal allow you to access information instantaneously (no tedious forms, long calls, or administrative hassle) and securely.",
    image: "../../assets/img/founder.svg",
  },
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  arrows: true,
  nextArrow: (
    <ArrowRight className="w-8 text-emerald-500 hover:text-emerald-400 transition-colors duration-300" />
  ),
  prevArrow: (
    <ArrowLeft className="w-8 text-emerald-500 hover:text-emerald-400 transition-colors duration-300" />
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
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {isIntroEnded && <Intro />}

      {!isIntroEnded && (
        <div className="relative">
          {/* Navbar */}
          <nav className="flex justify-between items-center p-6 bg-slate-800/50 backdrop-blur-sm fixed w-full z-50">
            <div className="text-3xl font-bold text-emerald-400">PrescriptPro</div>
            <div className="space-x-4 flex items-center">
              {isLoggedIn ? (
                <>
                  <img
                    src="https://avatar.iran.liara.run/public"
                    alt="User"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <button 
                    onClick={handleLogout} 
                    className="px-4 py-2 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors duration-300 rounded-md font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <button className="px-4 py-2 font-medium text-slate-300 hover:text-emerald-400 transition-colors duration-300">
                    Features
                  </button>
                  <button className="px-4 py-2 font-medium text-slate-300 hover:text-emerald-400 transition-colors duration-300">
                    Pricing
                  </button>
                  <button className="px-4 py-2 font-medium text-slate-300 hover:text-emerald-400 transition-colors duration-300">
                    About
                  </button>
                  <Link to="/login">
                    <button className="px-4 py-2 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-colors duration-300 rounded-md font-medium">
                      Login
                    </button>
                  </Link>
                  <Link to="/signup">
                    <button className="px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600 transition-colors duration-300 font-medium">
                      Sign Up
                    </button>
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Hero Section */}
          <main className="container mx-auto px-4 pt-32 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center"
            >
              <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Simplify Your Prescriptions
              </h1>
              <p className="text-xl mb-8 text-slate-300 max-w-2xl mx-auto">
                Your comprehensive medication management solution. Track doses, set reminders, and ensure medication adherence with our intelligent platform.
              </p>
            </motion.div>

            {/* Feature Cards */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            >
              <FeatureCard
                icon={<Pill className="w-12 h-12 text-emerald-400" />}
                title="Smart Reminders"
                description="Never miss a dose with intelligent notifications customized to your schedule"
              />
              <FeatureCard
                icon={<ClipboardList className="w-12 h-12 text-emerald-400" />}
                title="Easy Management"
                description="Keep all your prescriptions organized in one secure, accessible place"
              />
              <FeatureCard
                icon={<Globe className="w-12 h-12 text-emerald-400" />}
                title="Pharmacy Network"
                description="Connect with local pharmacies for quick refills and consultations"
              />
            </motion.div>

            {/* Call-to-Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex justify-center space-x-4 mb-20"
            >
              <Link to="/dashboard">
                <button className="px-6 py-3 flex items-center bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-md hover:from-emerald-600 hover:to-teal-600 transition-all duration-300 font-medium shadow-lg hover:shadow-emerald-500/25">
                  <span>Get Started</span>
                  <ArrowRight className="ml-2" />
                </button>
              </Link>
              <button className="px-6 py-3 border border-emerald-500/50 text-emerald-400 rounded-md hover:bg-emerald-500/10 transition-colors duration-300 font-medium backdrop-blur-sm">
                WhatsApp Bot
              </button>
            </motion.div>

            {/* Dosage Management Section */}
            <section className="mb-20">
              <h2 className="text-3xl font-bold mb-12 text-emerald-400 text-center">Advanced Dosage Management</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <DosageFeature
                  icon={<Bell className="w-8 h-8" />}
                  title="Smart Scheduling"
                  description="Intelligent reminders based on medication timing, meals, and your daily routine"
                />
                <DosageFeature
                  icon={<Calendar className="w-8 h-8" />}
                  title="Dosage Calendar"
                  description="Visual calendar showing your medication schedule and history"
                />
                <DosageFeature
                  icon={<Clock className="w-8 h-8" />}
                  title="Timing Optimization"
                  description="AI-powered suggestions for optimal medication timing"
                />
                <DosageFeature
                  icon={<Shield className="w-8 h-8" />}
                  title="Interaction Checker"
                  description="Automatic checking for potential medication interactions"
                />
                <DosageFeature
                  icon={<Smartphone className="w-8 h-8" />}
                  title="Mobile Tracking"
                  description="Track doses taken and missed with our mobile app"
                />
                <DosageFeature
                  icon={<Users className="w-8 h-8" />}
                  title="Family Management"
                  description="Manage medications for family members with caregiver features"
                />
              </div>
            </section>

            {/* Safety Features Section */}
            <section className="mb-20">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8">
                <h2 className="text-3xl font-bold mb-8 text-emerald-400 text-center">Medical Safety First</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                  <div className="text-left p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <h3 className="text-xl font-semibold mb-4 text-emerald-300">Dosage Verification</h3>
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                        Double-check dosage amounts
                      </li>
                      <li className="flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                        Medication conflict warnings
                      </li>
                      <li className="flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                        Allergy alerts
                      </li>
                    </ul>
                  </div>
                  <div className="text-left p-6 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <h3 className="text-xl font-semibold mb-4 text-emerald-300">Emergency Support</h3>
                    <ul className="space-y-3 text-slate-300">
                      <li className="flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                        24/7 pharmacist consultation
                      </li>
                      <li className="flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                        Emergency contact system
                      </li>
                      <li className="flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                        Medical history access
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            <div className="container mx-auto px-4">
              <MedicalQuery />
            </div>
          </main>

          <div className="container mx-auto px-4 pb-16">
            <ImageSlider />
          </div>
          
          <Footer />
        </div>
      )}
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg shadow-lg text-center border border-slate-700/50 hover:border-emerald-500/50 transition-colors duration-300"
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-2xl font-semibold mb-2 text-emerald-400">{title}</h3>
    <p className="text-slate-300">{description}</p>
  </motion.div>
);

const DosageFeature = ({ icon, title, description }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="flex items-start space-x-4 p-4 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-emerald-500/50 transition-all duration-300"
  >
    <div className="text-emerald-400 p-2 bg-slate-800/80 rounded-lg">{icon}</div>
    <div className="flex-1">
      <h3 className="text-lg font-semibold mb-1 text-emerald-300">{title}</h3>
      <p className="text-sm text-slate-400">{description}</p>
    </div>
  </motion.div>
);

export default LandingPage;