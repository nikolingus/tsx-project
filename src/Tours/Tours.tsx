import React from "react";
import "./Tours.css";

const Tours: React.FC = () => {
  return (
    <section className="tours" id="tours">
      <h1 className="tours__title">Самые популярные туры</h1>
      <div className="tours__list">
        <div className="tours__item">
          <img src="./img/gold.jpg" className="tours__image" />
          <div className="tours__content">
            <h2 className="tours__subtitle">Золотой Треугольник Тур в Китай</h2>
            <p className="tours__text">
              На протяжении более 700 лет Пекин является столицей Китая. Здесь
              сохранились такие памятники великолепного прошлого Китайской
              Империи, как Великая Китайская Стена и Запретный Город... Сиань -
              древняя столица Китая, известная во всём мире Терракотовой Армией
              и Древней Городской Стеной. Из Пекина в Сиань удобно добираться на
              высокоскоростном поезде, и это отличная возможность увидеть жизнь
              Китая изнутри. Шанхай - самый развивающийся город в Китае и
              настоящий рай для шопинга.
            </p>
          </div>
        </div>
        <div className="tours__item">
          <img src="./img/ava.jpg" className="tours__image" />
          <div className="tours__content">
            <h2 className="tours__subtitle">
              Классический Тур в Китай, Аватар-Тур
            </h2>
            <p className="tours__text">
              Космические пейзажи Национального парка Чжанцзяцзе (Zhangjiajie),
              ставшего известным во всём мире благодаря фильму "Аватар", поразят
              Вас своим великолепием. Пекин, Сиань, Шанхай - в этих городах Вы
              узнаете о древней культуре и богатой истории Китая, увидите
              величественные статуи Терракотовой Армии, а также впечатляющий
              ритм современности Поднебесной.
            </p>
          </div>
        </div>
        <div className="tours__item">
          <img src="./img/shaolin.jpg" className="tours__image" />
          <div className="tours__content">
            <h2 className="tours__subtitle">Шаолинь Кунг-Фу Тур</h2>
            <p className="tours__text">
              Во время этого тура Вы узнаете об истории происхождения боевых
              искусств и кунг-фу, Вас ждёт великолепная природа - пещеры и
              гроты, горы и реки. Вы познакомитесь с уникальной культурой
              Шаолинь, посетите Храм Шаолинь - самый известный храм в Китае!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Tours;
