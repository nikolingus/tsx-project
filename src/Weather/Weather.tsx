import React from "react";
import {
  useQueries,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import "./Weather.css";

// Типы данных
interface IMainData {
  temp: number;
  feels_like: number;
  humidity: number;
}

interface IWeather {
  main: string;
  description: string;
  icon: string;
}

interface IWeatherData {
  name: string;
  main: IMainData;
  weather: IWeather[];
}

interface ICity {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

// Правила передачи данных для WeatherCity
interface IWeatherCityRules {
  city: ICity;
  weatherData: IWeatherData | null;
  isLoading: boolean;
}

// Компонент для отображения погоды в каждом городе
const WeatherCity: React.FC<IWeatherCityRules> = ({
  city,
  weatherData,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="weather__item">
        <h2 className="weather__label">{city.name}</h2>
        <div className="weather__loading">Загрузка</div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="weather__item">
        <h2 className="weather__label">{city.name}</h2>
        <div className="weather__error">Ошибка загрузки данных</div>
      </div>
    );
  }

  // Функция для получения URL иконки погоды
  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  };

  // Отображение данных о погоде для города
  return (
    <div className="weather__item">
      <h2 className="weather__label">{city.name}</h2>
      <div className="weather__content">
        <img
          className="weather__image"
          src={getWeatherIcon(weatherData.weather[0].icon)}
          alt={weatherData.weather[0].description}
        />
        <div className="weather__temperature">
          {Math.round(weatherData.main.temp)}°C
        </div>
      </div>
      <p className="weather__description">
        {weatherData.weather[0].description}
      </p>
      <div className="weather__details">
        <div className="weather__info">
          Ощущается как {Math.round(weatherData.main.feels_like)}°C
        </div>
        <div className="weather__info">
          Влажность: {weatherData.main.humidity}%
        </div>
      </div>
    </div>
  );
};

// Функция для получения данных о погоде через API
const fetchWeatherData = async (city: ICity): Promise<IWeatherData> => {
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=7dbb871250c80e49f8af51fb5af9c97e&units=metric&lang=ru`
  );
  return response.json();
};

// Основной компонент
const Weather: React.FC = () => {
  const cities: ICity[] = React.useMemo(
    () => [
      { id: "beijing", name: "Пекин", lat: 39.9042, lon: 116.4074 },
      { id: "guangzhou", name: "Гуанчжоу", lat: 23.1291, lon: 113.2644 },
      { id: "harbin", name: "Харбин", lat: 45.8038, lon: 126.534 },
    ],
    []
  );

  // Параллельная загрузка данных по всем городам
  const weatherQueries = useQueries({
    queries: cities.map((city) => ({
      queryKey: ["weather", city.id],
      queryFn: () => fetchWeatherData(city),
      staleTime: 600000, // актуальность данных - 10 минут
      retry: 3, // Повторять запрос 3 раза при ошибке
      refetchOnWindowFocus: false, // Не обновлять при просмотре окна
    })),
  });

  // Объекты с данными для каждого города
  const weatherData = React.useMemo(() => {
    const data: Record<string, IWeatherData | null> = {};
    cities.forEach((city, index) => {
      data[city.id] = weatherQueries[index].data || null;
    });
    return data;
  }, [cities, weatherQueries]);

  // Объекты с состояниями загрузки для каждого города
  const loadingStates = React.useMemo(() => {
    const states: Record<string, boolean> = {};
    cities.forEach((city, index) => {
      states[city.id] = weatherQueries[index].isLoading;
    });
    return states;
  }, [cities, weatherQueries]);

  return (
    <section className="weather">
      <h1 className="weather__title">Погода в городах Китая</h1>
      <div className="weather__list">
        {cities.map((city) => (
          <WeatherCity
            key={city.id}
            city={city}
            weatherData={weatherData[city.id] || null}
            isLoading={loadingStates[city.id] || false}
          />
        ))}
      </div>
    </section>
  );
};

// Настройки по умолчанию для всех запросов
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      staleTime: 600000, // 10 минут
    },
  },
});

// Оборачиваем компонент в провайдер React Query
const WeatherPage: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Weather />
    </QueryClientProvider>
  );
};

export default WeatherPage;
