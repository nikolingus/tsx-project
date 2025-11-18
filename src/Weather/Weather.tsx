import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Weather.css";

// Определние типов данных
interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  }[];
}

const Weather: React.FC = () => {
  // Хранение данных о погоде для трех городов
  const [weatherData, setWeatherData] = useState<{
    beijing: WeatherData | null;
    guangzhou: WeatherData | null;
    harbin: WeatherData | null;
  }>({
    beijing: null,
    guangzhou: null,
    harbin: null,
  });

  // Отслеживание процесса загрузки
  const [loading, setLoading] = useState(true);

  // Координаты городов
  const cities = {
    beijing: { name: "Пекин", lat: 39.9042, lon: 116.4074 },
    guangzhou: { name: "Гуанчжоу", lat: 23.1291, lon: 113.2644 },
    harbin: { name: "Харбин", lat: 45.8038, lon: 126.534 },
  };

  // Загрузка данных при первом отображении компонента
  useEffect(() => {
    const getWeatherData = async () => {
      setLoading(true);

      // Параллельный запрос данных о погоде
      const promises = Object.entries(cities).map(async ([key, city]) => {
        // Запрос к API OpenWeatherMap
        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather`,
          {
            params: {
              lat: city.lat,
              lon: city.lon,
              appid: "7dbb871250c80e49f8af51fb5af9c97e", // мой API key
              units: "metric",
              lang: "ru",
            },
          }
        );
        return { key, data: response.data };
      });

      // Ожидание выполнения всех запросов
      const results = await Promise.all(promises);

      // Обновление состояния с полученными данными
      const newWeatherData = { ...weatherData };
      results.forEach((result) => {
        newWeatherData[result.key as keyof typeof weatherData] = result.data;
      });

      setWeatherData(newWeatherData);
      setLoading(false);
    };

    getWeatherData();
  }, []);

  // Формирование URL иконки погоды
  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  return (
    <section className="weather">
      <h1 className="weather__title">Погода в городах Китая</h1>
      <div className="weather__list">
        {weatherData.beijing && (
          <div className="weather__item">
            <h2 className="weather__label">{cities.beijing.name}</h2>
            <div className="weather__content">
              <img
                className="weather__image"
                src={getWeatherIcon(weatherData.beijing.weather[0].icon)}
                alt={weatherData.beijing.weather[0].description}
              />
              <div className="weather__temperature">
                {Math.round(weatherData.beijing.main.temp)}°C
              </div>
            </div>
            <p className="weather__description">
              {weatherData.beijing.weather[0].description}
            </p>
            <div className="weather__details">
              <div className="weather__info">
                Ощущается как {Math.round(weatherData.beijing.main.feels_like)}
                °C
              </div>
              <div className="weather__info">
                Влажность: {weatherData.beijing.main.humidity}%
              </div>
            </div>
          </div>
        )}

        {weatherData.guangzhou && (
          <div className="weather__item">
            <h2 className="weather__label">{cities.guangzhou.name}</h2>
            <div className="weather__content">
              <img
                className="weather__image"
                src={getWeatherIcon(weatherData.guangzhou.weather[0].icon)}
                alt={weatherData.guangzhou.weather[0].description}
              />
              <div className="weather__temperature">
                {Math.round(weatherData.guangzhou.main.temp)}°C
              </div>
            </div>
            <p className="weather__description">
              {weatherData.guangzhou.weather[0].description}
            </p>
            <div className="weather__details">
              <div className="weather__info">
                Ощущается как{" "}
                {Math.round(weatherData.guangzhou.main.feels_like)}
                °C
              </div>
              <div className="weather__info">
                Влажность: {weatherData.guangzhou.main.humidity}%
              </div>
            </div>
          </div>
        )}

        {weatherData.harbin && (
          <div className="weather__item">
            <h2 className="weather__label">{cities.harbin.name}</h2>
            <div className="weather__content">
              <img
                className="weather__image"
                src={getWeatherIcon(weatherData.harbin.weather[0].icon)}
                alt={weatherData.harbin.weather[0].description}
              />
              <div className="weather__temperature">
                {Math.round(weatherData.harbin.main.temp)}°C
              </div>
            </div>
            <p className="weather__description">
              {weatherData.harbin.weather[0].description}
            </p>
            <div className="weather__details">
              <div className="weather__info">
                Ощущается как {Math.round(weatherData.harbin.main.feels_like)}
                °C
              </div>
              <div className="weather__info">
                Влажность: {weatherData.harbin.main.humidity}%
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Weather;
