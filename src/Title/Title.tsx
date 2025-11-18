import React from "react";
import "./Title.css";

const Title: React.FC = () => {
  return (
    <section className="title section" id="about">
      <h6 className="title__subtext">
        УВЛЕКАТЕЛЬНЫЕ ТУРЫ ПО КИТАЮ С ОСМОТРОМ ДОСТОПРИМЕЧАТЕЛЬНОСТЕЙ
      </h6>
      <h1 className="title__text">
        Насыщенные экскурсионные туры в Китай, интересная архитектура и богатая
        история.
      </h1>
    </section>
  );
};

export default Title;
