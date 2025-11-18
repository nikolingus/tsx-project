import React from "react";
import Advantages from "../Advantages/Advantages";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import Gallery from "../Gallery/Gallery";
import Title from "../Title/Title";
import Tours from "../Tours/Tours";
import Slider from "../Slider/Slider";
import Video from "../Video/Video";
import Reviews from "../Reviews/Reviews";
import Registration from "../Registration/Registration";
import Map from "../Map/Map";
import Weather from "../Weather/Weather";

import "./App.css";

const App: React.FC = () => {
  return (
    <div>
      <Header />
      <Title />
      <Gallery />
      <Tours />
      <Weather />
      <Slider />
      <Video />
      <Advantages />
      <Reviews />
      <Registration />
      <Map />
      <Footer />
    </div>
  );
};

export default App;
