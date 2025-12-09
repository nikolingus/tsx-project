import React from "react";
import "./Video.css";

const Video: React.FC = () => {
  const link: string = React.useMemo(
    () =>
      "https://rutube.ru/play/embed/d1a9dac79cb0525f062d29f16e5f3dc0?t=1671",
    []
  );
  return (
    <section className="video section">
      <iframe className="video__frame" src={link}></iframe>
    </section>
  );
};

export default Video;
