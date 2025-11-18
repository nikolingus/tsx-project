import React from "react";
import "./Gallery.css";

const Gallery: React.FC = () => {
  return (
    <section className="gallery section">
      <img className="gallery__image" src="./img/stena.jpg" />
      <img className="gallery__image" src="./img/army.jpg" />
      <img className="gallery__image" src="./img/harbin.jpg" />
      <img className="gallery__image" src="./img/most.jpg" />
    </section>
  );
};

export default Gallery;
