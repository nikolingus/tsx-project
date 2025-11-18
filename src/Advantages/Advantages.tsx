import React from "react";
import "./Advantages.css";

const Advantages: React.FC = () => {
  return (
    <section className="advantages section" id="adv">
      <h1 className="advantages__title">Почему выбирают нас?</h1>
      <p className="advantages__description">
        Испытайте уникальные эмоции от путешествий по Китаю, которые захватывают
        дух и оставляют приятные впечатления на всю жизнь.
      </p>
      <div className="advantages__list">
        <div className="advantages__item">
          <img
            className="advantages__image"
            src="https://static.tildacdn.com/lib/icons/tilda/-/paint/000000-e2e2e2-1-50-58/star_quality.svg"
          />
          <div className="advantages__content">
            <h3 className="advantages__subtitle">Высокий уровень сервиса</h3>
            <p className="advantages__text">
              Наша компания проводит туры по Китаю уже более 15 лет, а наши
              клиенты - тысячи довольных путешественников со всего мира.
            </p>
          </div>
        </div>
        <div className="advantages__item">
          <img
            className="advantages__image"
            src="https://static.tildacdn.com/lib/icons/tilda/-/paint/000000-e2e2e2-1-50-58/bubble_speach_dialog_talk.svg"
          />
          <div className="advantages__content">
            <h3 className="advantages__subtitle">Постоянная поддержка</h3>
            <p className="advantages__text">
              Наши менеджеры всегда будут с вами на связи, мы с радостью поможем
              вам!
            </p>
          </div>
        </div>
        <div className="advantages__item">
          <img
            className="advantages__image"
            src="https://static.tildacdn.com/lib/icons/tilda/-/paint/000000-e2e2e2-1-50-58/guest_persona.svg"
          />
          <div className="advantages__content">
            <h3 className="advantages__subtitle">Индивидуальные туры</h3>
            <p className="advantages__text">
              Мы предоставляем широкие возможности в выборе программ, в том
              числе индивидуальные туры для одного человека, пары или семьи.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advantages;
