import React from "react";
import "./LogoSlider.css";

const logos = [
  "https://logo.clearbit.com/huawei.com",
  "https://i.ibb.co/t9nxNQq/logo.png",
  "https://logo.clearbit.com/zte.com.cn",
  "https://logo.clearbit.com/oppo.com",
  "https://logo.clearbit.com/nokia.com",
  "https://logo.clearbit.com/t-mobile.com",
];

const LogoSlider = () => {
  return (
    <div className="logo-slider">
      <div className="logo-track">
        {logos.concat(logos).map((logo, index) => (
          <img key={index} src={logo} alt={`logo-${index}`} />
        ))}
      </div>
    </div>
  );
};

export default LogoSlider;
