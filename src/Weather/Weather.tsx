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
    let backgroundColor = import.meta.env.VITE_COLOR_DEFAULT;

    if (temp !== undefined) {
      if (temp < parseFloat(import.meta.env.VITE_TEMP_1)) {
        backgroundColor = import.meta.env.VITE_COLOR_VERY_COLD;
      } else if (temp < parseFloat(import.meta.env.VITE_TEMP_2)) {
        backgroundColor = import.meta.env.VITE_COLOR_COLD;
      } else if (temp < parseFloat(import.meta.env.VITE_TEMP_3)) {
        backgroundColor = import.meta.env.VITE_COLOR_COOL;
      } else if (temp < parseFloat(import.meta.env.VITE_TEMP_4)) {
        backgroundColor = import.meta.env.VITE_COLOR_MILD;
      } else if (temp < parseFloat(import.meta.env.VITE_TEMP_5)) {
        backgroundColor = import.meta.env.VITE_COLOR_WARM;
      } else if (temp < parseFloat(import.meta.env.VITE_TEMP_6)) {
        backgroundColor = import.meta.env.VITE_COLOR_HOT;
      } else if (temp < parseFloat(import.meta.env.VITE_TEMP_7)) {
        backgroundColor = import.meta.env.VITE_COLOR_VERY_HOT;
      } else {
        backgroundColor = import.meta.env.VITE_COLOR_EXTREME_HOT;
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
        <div className="weather__loading">
          {import.meta.env.VITE_TEXT_LOADING}
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return (
      <div className="weather__item">
        <h2 className="weather__label">{city.name}</h2>
        <div className="weather__error">{import.meta.env.VITE_TEXT_ERROR}</div>
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
          {import.meta.env.VITE_TEXT_FEELS_LIKE}{" "}
          {Math.round(weatherData.main.feels_like)}°C
        </div>
        <div className="weather__info">
          {import.meta.env.VITE_TEXT_HUMIDITY}: {weatherData.main.humidity}%
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
  const cities: ICity[] = React.useMemo(() => {
    const citiesString = import.meta.env.VITE_CITIES;
    return citiesString.split(",").map((cityStr: string) => {
      const [id, name, lat, lon] = cityStr.split(":");
      return {
        id,
        name,
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      };
    });
  }, []);

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
      <h1 className="weather__title">{import.meta.env.VITE_SEC_TITLE}</h1>
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
      refetchOnWindowFocus:
        import.meta.env.VITE_QUERY_REFETCH_ON_WINDOW_FOCUS === "true",
      retry: parseInt(import.meta.env.VITE_QUERY_RETRY || "3"),
      staleTime: parseInt(import.meta.env.VITE_QUERY_STALE_TIME || "600000"),
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
