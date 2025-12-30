import { useState } from "react";

interface Notification {
  type: "success" | "error";
  message: string;
}

export const useNotification = () => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });

    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  return {
    notification,
    showNotification,
  };
};
