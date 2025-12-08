import React from "react";
import "./Advantages.css";

// Типы данных
interface IAdvantagesData {
  image: string;
  subtitle: string;
  text: string;
}

// Основной компонент
const Advantages: React.FC = () => {
  const advantages: IAdvantagesData[] = React.useMemo(
    () => [
      {
        image:
          "https://static.tildacdn.com/lib/icons/tilda/-/paint/000000-e2e2e2-1-50-58/star_quality.svg",
        subtitle: "Высокий уровень сервиса",
        text: "Наша компания проводит туры по Китаю уже более 15 лет, а наши клиенты - тысячи довольных путешественников со всего мира.",
      },
      {
        image:
          "https://static.tildacdn.com/lib/icons/tilda/-/paint/000000-e2e2e2-1-50-58/bubble_speach_dialog_talk.svg",
        subtitle: "Постоянная поддержка",
        text: "Наши менеджеры всегда будут с вами на связи, мы с радостью поможем вам!",
      },
      {
        image:
          "https://static.tildacdn.com/lib/icons/tilda/-/paint/000000-e2e2e2-1-50-58/guest_persona.svg",
        subtitle: "Индивидуальные туры",
        text: "Мы предоставляем широкие возможности в выборе программ, в том числе индивидуальные туры для одного человека, пары или семьи.",
      },
    ],
    []
  );

  return (
    <section className="advantages section" id="adv">
      <h1 className="advantages__title">Почему выбирают нас?</h1>
      <p className="advantages__description">
        Испытайте уникальные эмоции от путешествий по Китаю, которые захватывают
        дух и оставляют приятные впечатления на всю жизнь.
      </p>
      <div className="advantages__list">
        {advantages.map((advantage, index) => (
          <div className="advantages__item" key={index}>
            <img className="advantages__image" src={advantage.image} />
            <div className="advantages__content">
              <h3 className="advantages__subtitle">{advantage.subtitle}</h3>
              <p className="advantages__text">{advantage.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Advantages;
