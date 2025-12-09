import React from "react";
import { Link } from "react-router-dom";
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
        href: "/",
        title: "Главная",
      },
      {
        href: "/reviews",
        title: "Отзывы",
      },
    ],
    []
  );

  // Правая группа
  const rightGroup: IHeaderData[] = React.useMemo(
    () => [
      {
        href: "/tours",
        title: "Туры",
      },
      {
        href: "/order",
        title: "Заказать тур",
      },
    ],
    []
  );

  return (
    <header className="header">
      <nav className="nav">
        <div className="nav__group nav__group--left">
          {leftGroup.map((item, index) => (
            <Link to={item.href} className="nav__link" key={index}>
              {item.title}
            </Link>
          ))}
        </div>

        <div className="nav__logo">
          <h1 className="nav__title">China Travel</h1>
        </div>

        <div className="nav__group nav__group--right">
          {rightGroup.map((item, index) => (
            <Link to={item.href} className="nav__link" key={index}>
              {item.title}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Header;
