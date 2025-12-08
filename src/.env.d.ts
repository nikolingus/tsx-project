/// <reference types="vite/client" />

interface IVariablesEnv {
  // Настройки API
  readonly VITE_OPENWEATHER_API_KEY: string;
  readonly VITE_OPENWEATHER_URL: string;
  readonly VITE_OPENWEATHER_ICON_URL: string;
  readonly VITE_TEMP_UNITS: string;
  readonly VITE_LANGUAGE: string;

  // Параметры для React Query
  readonly VITE_QUERY_STALE_TIME: string;
  readonly VITE_QUERY_RETRY: string;
  readonly VITE_QUERY_FOCUS: string;
}

interface ImportMeta {
  readonly env: IVariablesEnv;
}
