import React from "react";
import "./Gallery.css";

// Типы данных
interface IGalleryData {
  image: string;
}

// Основной компонент
const Gallery: React.FC = () => {
  const photos: IGalleryData[] = React.useMemo(
    () => [
      {
        image: "./img/stena.jpg",
      },
      {
        image: "./img/army.jpg",
      },
      {
        image: "./img/harbin.jpg",
      },
      {
        image: "./img/most.jpg",
      },
    ],
    []
  );
  return (
    <section className="gallery section">
      {photos.map((photo, index) => (
        <img className="gallery__image" src={photo.image} key={index} />
      ))}
    </section>
  );
};

export default Gallery;
