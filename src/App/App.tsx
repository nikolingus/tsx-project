import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import MainPage from "../pages/MainPage";
import ToursPage from "../pages/ToursPage";
import OrderPage from "../pages/OrderPage";
import RevPage from "../pages/RevPage";
import "./App.css";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/tours" element={<ToursPage />} />
          <Route path="/order" element={<OrderPage />} />
          <Route path="/reviews" element={<RevPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
