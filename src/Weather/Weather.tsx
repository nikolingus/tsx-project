import React from "react";
import {
  useQueries,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createUseStyles } from "react-jss";
import "./Weather.css";
import axios from "axios";

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

// Стили для динамического изменения фона карточки
const useStyles = createUseStyles({
  weatherItem: ({ temp }: { temp?: number }) => {
    // Цвет фона в зависимости от температуры
    let backgroundColor = "rgba(255, 255, 255, 0.1)"; // Цвет по умолчанию

    if (temp !== undefined) {
      if (temp < -10) {
        backgroundColor = "rgba(0, 126, 252, 0.25)";
      } else if (temp < 0) {
        backgroundColor = "rgba(93, 145, 240, 0.25)";
      } else if (temp < 10) {
        backgroundColor = "rgba(135, 189, 250, 0.25)";
      } else if (temp < 20) {
        backgroundColor = "rgba(176, 230, 214, 0.25)";
      } else if (temp < 25) {
        backgroundColor = "rgba(144, 238, 144, 0.25)";
      } else if (temp < 30) {
        backgroundColor = "rgba(255, 215, 0, 0.25)";
      } else if (temp < 35) {
        backgroundColor = "rgba(255, 165, 0, 0.25)";
      } else {
        backgroundColor = "rgba(255, 69, 0, 0.25)";
      }
    }

    return {
      background: backgroundColor,
      transition: "background 0.5s ease-in-out",
    };
  },
});

// Компонент для отображения погоды в каждом городе
const WeatherCity: React.FC<IWeatherCityRules> = ({
  city,
  weatherData,
  isLoading,
}) => {
  // Получение температуры
  const temp = weatherData?.main.temp;

  // Используем стили JSS
  const classes = useStyles({ temp });

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
    return `${import.meta.env.VITE_OPENWEATHER_ICON_URL}/${iconCode}@2x.png`;
  };

  // Отображение данных о погоде для города
  return (
    <div className={`weather__item ${classes.weatherItem}`}>
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
const getWeatherData = async (city: ICity): Promise<IWeatherData> => {
  const response = await axios.get<IWeatherData>(
    `${import.meta.env.VITE_OPENWEATHER_URL}/weather`,
    {
      params: {
        lat: city.lat,
        lon: city.lon,
        appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
        units: import.meta.env.VITE_TEMP_UNITS,
        lang: import.meta.env.VITE_LANGUAGE,
      },
    }
  );
  return response.data;
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
      queryFn: () => getWeatherData(city),
      staleTime: parseInt(import.meta.env.VITE_QUERY_STALE_TIME),
      retry: parseInt(import.meta.env.VITE_QUERY_RETRY),
      refetchOnWindowFocus: import.meta.env.VITE_QUERY_FOCUS === "true",
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
      <h1 className="weather__title">Погода в Китае</h1>
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
      refetchOnWindowFocus: import.meta.env.VITE_QUERY_FOCUS === "true",
      retry: parseInt(import.meta.env.VITE_QUERY_RETRY),
      staleTime: parseInt(import.meta.env.VITE_QUERY_STALE_TIME),
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
