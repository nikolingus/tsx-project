import React from "react";
import "./Video.css";

const Video: React.FC = () => {
  return (
    <section className="video section">
      <iframe
        className="video__frame"
        src="https://rutube.ru/play/embed/d1a9dac79cb0525f062d29f16e5f3dc0?t=1671"
      ></iframe>
    </section>
  );
};

export default Video;
