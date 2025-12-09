import React from "react";
import "./Footer.css";

const Footer: React.FC = () => {
  const currentYear: number = React.useMemo(
    () => new Date().getFullYear(),
    [new Date().getFullYear()]
  );

  return (
    <footer className="footer">
      <p>© {currentYear} ChinaTravel</p>
    </footer>
  );
};

export default Footer;
