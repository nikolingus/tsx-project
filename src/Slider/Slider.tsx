import React, { useEffect, useRef } from "react";
import "./Slider.css";

const Slider: React.FC = () => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const currentSlide = useRef<number>(0);

  useEffect(() => {
    const slider = sliderRef.current;
    const container = containerRef.current;

    // Все элементы можно получить сразу из slider, не нужно проверять container
    const slides = slider?.querySelectorAll<HTMLDivElement>(".slider__slide");
    const prevBtn =
      slider?.querySelector<HTMLButtonElement>(".slider__btn--prev");
    const nextBtn =
      slider?.querySelector<HTMLButtonElement>(".slider__btn--next");
    const dots = slider?.querySelectorAll<HTMLSpanElement>(".slider__dot");

    // Прерывание эффекта, если найдено 0 элементов
    if (!slides || slides.length === 0) return;

    const slideCount = slides.length;

    // Обновление слайдера
    function updateSlider(): void {
      if (!container || !slides.length) return;

      const slideWidth = slides[0].getBoundingClientRect().width;
      container.style.transform = `translateX(-${
        currentSlide.current * slideWidth
      }px)`;

      // Упрощенная обработка точек
      dots?.forEach((dot, index) => {
        dot.classList.toggle(
          "slider__dot--active",
          index === currentSlide.current
        );
      });
    }

    // Следующий слайд
    function nextSlide(): void {
      currentSlide.current = (currentSlide.current + 1) % slideCount;
      updateSlider();
    }

    // Предыдущий слайд
    function prevSlide(): void {
      currentSlide.current =
        (currentSlide.current - 1 + slideCount) % slideCount;
      updateSlider();
    }

    // Перелючение по точкам
    function goToSlide(index: number): void {
      currentSlide.current = index;
      updateSlider();
    }

    // Обработчики событий
    if (nextBtn) nextBtn.addEventListener("click", nextSlide);
    if (prevBtn) prevBtn.addEventListener("click", prevSlide);

    // Обработчики для точек
    dots?.forEach((dot, index) => {
      dot.addEventListener("click", () => goToSlide(index));
    });

    // Адаптация под изменение размера окна
    window.addEventListener("resize", updateSlider);

    // Инициализация
    updateSlider();

    // Очистка
    return () => {
      if (nextBtn) nextBtn.removeEventListener("click", nextSlide);
      if (prevBtn) prevBtn.removeEventListener("click", prevSlide);

      dots?.forEach((dot, index) => {
        dot.removeEventListener("click", () => goToSlide(index));
      });

      window.removeEventListener("resize", updateSlider);
    };
  }, []);

  return (
    <section className="slider" ref={sliderRef}>
      <div className="slider__container" ref={containerRef}>
        <div className="slider__slide slider__slide--1">
          <div className="slider__content">
            <h2 className="slider__title">Тяньмэнь</h2>
            <p className="slider__text">
              Гора, расположенная в Китае, на северо-западе провинции Хунань, в
              Национальном парке горы Тяньмэнь. На гору можно подняться по
              канатной дороге, она часто упоминается в туристических гидах как
              «самая длинная высокогорная канатная дорога в мире» - она состоит
              из 98 вагонов, её общая длина 7455 м перепад высот составляет 1279
              метров, а самый крутой угол подъёма 37°.
            </p>
          </div>
        </div>

        <div className="slider__slide slider__slide--2">
          <div className="slider__content">
            <h2 className="slider__title">Река Лицзян</h2>
            <p className="slider__text">
              Во II веке до н. э. по приказу Цинь Шихуанди эти реки соединил
              канал Линцюй, что позволило плавать из Янцзы в Сицзян (и далее в
              дельту Жемчужной реки) на лодках. В 1982 году Государственный
              совет Китая признал живописную зону реки Лицзян местом, имеющим
              живописное и историческое значение.
            </p>
          </div>
        </div>

        <div className="slider__slide slider__slide--3">
          <div className="slider__content">
            <h2 className="slider__title">Чунцин</h2>
            <p className="slider__text">
              Высокотехнологичный мегаполис и самый большой город в мире, его
              площадь составляет 82 400 км².
            </p>
          </div>
        </div>
      </div>

      <button className="slider__btn slider__btn--prev" type="button">
        <svg
          className="slider__icon"
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

      <button className="slider__btn slider__btn--next" type="button">
        <svg
          className="slider__icon"
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

      <div className="slider__dots">
        <span className="slider__dot slider__dot--active" data-slide="0"></span>
        <span className="slider__dot" data-slide="1"></span>
        <span className="slider__dot" data-slide="2"></span>
      </div>
    </section>
  );
};

export default Slider;
