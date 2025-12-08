import React, { useState } from "react";
import "./Reviews.css";

interface IReviews {
  text: string;
  name: string;
  photo: string;
}

const Reviews: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const reviewsItems: IReviews[] = [
    {
      text: "Получил огромное удовольствие от увлекательной поездки в Харбин. Особенно запомнились большие ледяные скульптуры.",
      name: "Сергей Т.",
      photo: "./img/sergei.jpg",
    },
    {
      text: "До глубины души была потрясена горами, которые послужили прототипом для фильма 'Аватар'!",
      name: "Татьяна С.",
      photo: "./img/tanya.jpg",
    },
    {
      text: "Был поражен красотой и величием Терракотовой армии! Однозначно рекомендую данный тур!",
      name: "Алексей М.",
      photo: "./img/alex.jpg",
    },
  ];

  const showNext = (): void => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % reviewsItems.length);
  };

  const showPrev = (): void => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + reviewsItems.length) % reviewsItems.length
    );
  };

  return (
    <section className="reviews section" id="rev">
      <h2 className="reviews__title">Отзывы наших клиентов</h2>
      <div className="reviews__slider">
        <button
          className="reviews__button reviews__button--prev"
          type="button"
          onClick={showPrev}
        >
          <svg
            className="reviews__icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="reviews__list">
          {reviewsItems.map((review, index) => (
            <div
              key={index}
              className={`reviews__item ${
                index === currentIndex ? "reviews__item--active" : ""
              }`}
            >
              <p className="reviews__text">{review.text}</p>
              <div className="reviews__author">
                <img className="reviews__photo" src={review.photo} alt="" />
                <span className="reviews__name">{review.name}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          className="reviews__button reviews__button--next"
          type="button"
          onClick={showNext}
        >
          <svg
            className="reviews__icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Reviews;
