import React from "react";
import "./Title.css";

const Title: React.FC = () => {
  const subtext: string =
    "УВЛЕКАТЕЛЬНЫЕ ТУРЫ ПО КИТАЮ С ОСМОТРОМ ДОСТОПРИМЕЧАТЕЛЬНОСТЕЙ";
  const text: string =
    "Насыщенные экскурсионные туры в Китай, интересная архитектура и богатая история.";

  return (
    <section className="title section" id="about">
      <h6 className="title__subtext">{subtext}</h6>
      <h1 className="title__text">{text}</h1>
    </section>
  );
};

export default Title;
