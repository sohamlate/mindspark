import Slider from "react-slick";
import React from "react";
import Slide from "./slide";
import { ArrowLeft, ArrowRight } from "lucide-react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const ImageSlider = () => {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: true,
      nextArrow: (
        <ArrowRight className="w-8 h-8 text-white hover:text-yellow-400 transition-colors duration-300 bg-black rounded-full p-2 shadow-xl absolute right-4 top-1/2 transform -translate-y-1/2 z-10" />
      ),
      prevArrow: (
        <ArrowLeft className="w-8 h-8 text-white hover:text-yellow-400 transition-colors duration-300 bg-black rounded-full p-2 shadow-xl absolute left-4 top-1/2 transform -translate-y-1/2 z-10" />
      ),
      customPaging: (i) => (
        <div className="w-2.5 h-2.5 rounded-full bg-white opacity-70 hover:opacity-100 transition-opacity duration-300" />
      ),
      appendDots: (dots) => (
        <div
          style={{ bottom: "-30px" }}
          className="absolute w-full flex justify-center items-center"
        >
          <ul className="pt-[1rem] flex justify-center align-middle space-x-2">{dots}</ul>
        </div>
      ),
    };

  return (
    <div className="relative">
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
