import React from "react";
import "./Video.css";

interface IVideoData {
  src: string;
}

const Video: React.FC = () => {
  const links: IVideoData[] = React.useMemo(
    () => [
      {
        src: "https://rutube.ru/play/embed/d1a9dac79cb0525f062d29f16e5f3dc0?t=1671",
      },
    ],
    []
  );
  return (
    <section className="video section">
      {links.map((link, index) => (
        <iframe className="video__frame" src={link.src} key={index}></iframe>
      ))}
    </section>
  );
};

export default Video;
