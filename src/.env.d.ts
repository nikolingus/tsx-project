/// <reference types="vite/client" />

interface IVariablesEnv {
  // Настройки API
  readonly VITE_OPENWEATHER_API_KEY: string;
  readonly VITE_OPENWEATHER_URL: string;
  readonly VITE_OPENWEATHER_ICON_URL: string;
  readonly VITE_TEMP_UNITS: string;
  readonly VITE_LANGUAGE: string;

  // Города
  readonly VITE_CITIES: string;

  // Название
  readonly VITE_SEC_TITLE: string;

  // Температура
  readonly VITE_TEMP_1: string;
  readonly VITE_TEMP_2: string;
  readonly VITE_TEMP_3: string;
  readonly VITE_TEMP_4: string;
  readonly VITE_TEMP_5: string;
  readonly VITE_TEMP_6: string;
  readonly VITE_TEMP_7: string;

  // Цвета
  readonly VITE_COLOR_DEFAULT: string;
  readonly VITE_COLOR_VERY_COLD: string;
  readonly VITE_COLOR_COLD: string;
  readonly VITE_COLOR_COOL: string;
  readonly VITE_COLOR_MILD: string;
  readonly VITE_COLOR_WARM: string;
  readonly VITE_COLOR_HOT: string;
  readonly VITE_COLOR_VERY_HOT: string;
  readonly VITE_COLOR_EXTREME_HOT: string;

  // Параметры для React Query
  readonly VITE_QUERY_STALE_TIME: string;
  readonly VITE_QUERY_RETRY: string;
  readonly VITE_QUERY_FOCUS: string;

  // Загрузка и ошибка
  readonly VITE_TEXT_LOADING: string;
  readonly VITE_TEXT_ERROR: string;
  readonly VITE_TEXT_FEELS_LIKE: string;
  readonly VITE_TEXT_HUMIDITY: string;
}

interface ImportMeta {
  readonly env: IVariablesEnv;
}
