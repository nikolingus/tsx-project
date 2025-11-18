import React from "react";
import "./Map.css";

const Map: React.FC = () => {
  return (
    <section className="map section" id="map">
      <iframe
        className="map__frame"
        src="https://yandex.ru/map-widget/v1/?ll=30.326622%2C59.955079&mode=whatshere&whatshere%5Bpoint%5D=30.326788%2C59.955161&whatshere%5Bzoom%5D=17&z=17.39"
        title="Карта расположения офиса"
        loading="lazy"
      ></iframe>
    </section>
  );
};

export default Map;
