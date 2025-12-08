import React from "react";
import "./Header.css";

// Типы данных
interface IHeaderData {
  href: string;
  title: string;
}

// Основной компонент
const Header: React.FC = () => {
  // Левая группа
  const leftGroup: IHeaderData[] = React.useMemo(
    () => [
      {
        href: "#about",
        title: "О нас",
      },
      {
        href: "#adv",
        title: "Преимущества",
      },
      {
        href: "#rev",
        title: "Отзывы",
      },
    ],
    []
  );

  // Правая группа
  const rightGroup: IHeaderData[] = React.useMemo(
    () => [
      {
        href: "#tours",
        title: "Туры",
      },
      {
        href: "#order",
        title: "Заказать тур",
      },
      {
        href: "#map",
        title: "Офис",
      },
    ],
    []
  );
  return (
    <header className="header">
      <nav className="nav">
        <div className="nav__group nav__group--left">
          {leftGroup.map((text, index) => (
            <a href={text.href} className="nav__link" key={index}>
              {text.title}
            </a>
          ))}
        </div>

        <div className="nav__logo">
          <h1 className="nav__title">China Travel</h1>
        </div>

        <div className="nav__group nav__group--right">
          {rightGroup.map((text, index) => (
            <a href={text.href} className="nav__link" key={index}>
              {text.title}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
