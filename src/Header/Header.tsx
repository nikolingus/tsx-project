import React from "react";
import "./Header.css";

const Header: React.FC = () => {
  return (
    <header className="header">
      <nav className="nav">
        <div className="nav__group nav__group--left">
          <a href="#about" className="nav__link">
            О нас
          </a>
          <a href="#adv" className="nav__link">
            Преимущества
          </a>
          <a href="#rev" className="nav__link">
            Отзывы
          </a>
        </div>

        <div className="nav__logo">
          <h1 className="nav__title">China Travel</h1>
        </div>

        <div className="nav__group nav__group--right">
          <a href="#tours" className="nav__link">
            Туры
          </a>
          <a href="#order" className="nav__link">
            Заказать тур
          </a>
          <a href="#map" className="nav__link">
            Офис
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Header;
