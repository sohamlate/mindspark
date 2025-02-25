import Slider from "react-slick";
import React from "react";
import Slide from "./slide";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ImageSlider = () => {
  const settings = {
    autoplay: true,
    dots: true,
    infinite: true,
    speed: 500,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: (
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10">
        {/* <ArrowRight className="w-10 h-10 text-white p-2 shadow-lg rounded-full bg-slate-800/80 border border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300" /> */}
      </div>
    ),
    prevArrow: (
     
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
        {/* <ArrowLeft className="w-10 h-10 text-white p-2 shadow-lg rounded-full bg-slate-800/80 border border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300" /> */}
      </div>
    ),
    customPaging: (i) => (
      <div className="w-3 h-3 rounded-full bg-slate-800/80 border border-emerald-500/50 hover:bg-emerald-500/10 transition-all duration-300" />
    ),
    appendDots: (dots) => (
      <div className="absolute bottom-[-30px] w-full flex justify-center items-center">
        <ul className="pt-4 flex justify-center items-center space-x-2">
          {dots}
        </ul>
      </div>
    ),
  };

  return (
    <div className="relative container mx-auto">
      <Slider {...settings}>
        <div>
          <Slide />
        </div>
        <div>
          <Slide />
        </div>
        <div>
          <Slide />
        </div>
        <div>
          <Slide />
        </div>
      </Slider>
    </div>
  );
};

export default ImageSlider;
