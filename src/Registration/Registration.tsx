import React, { useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import emailjs from "@emailjs/browser";
import "./Registration.css";

// Типы данных
interface IFormData {
  email: string;
  name: string;
  phone: string;
  message: string;
}

// Тип для всех полей формы
type FormField = keyof IFormData;

// Типы для ошибок
type FieldErrors = Record<FormField, string>;
type TouchedFields = Record<FormField, boolean>;

const Registration: React.FC = () => {
  // Состояние для данных формы
  const [formData, setFormData] = useState<IFormData>({
    email: "",
    name: "",
    phone: "",
    message: "",
  });

  // Состояния компонента с явной типизацией
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    email: "",
    name: "",
    phone: "",
    message: "",
  });
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    email: false,
    name: false,
    phone: false,
    message: false,
  });

  // Валидация email с типизацией
  const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return "Email обязателен для заполнения";
    if (!emailRegex.test(email)) return "Введите корректный email";
    return "";
  };

  // Валидация имени с типизацией
  const validateName = (name: string): string => {
    if (!name) return "Имя обязательно для заполнения";
    if (name.length < 2) return "Имя должно содержать минимум 2 символа";
    if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(name))
      return "Имя может содержать только буквы, пробелы и дефисы";
    return "";
  };

  // Валидация телефона с типизацией
  const validatePhone = (phone: string): string => {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{11,13}$/;
    if (!phone) return "Телефон обязателен для заполнения";
    if (!phoneRegex.test(phone)) return "Введите корректный номер телефона";
    return "";
  };

  // Функция для подсветки всех незаполненных обязательных полей
  const showEmptyFields = (): void => {
    const newTouchedFields: TouchedFields = {
      email: true,
      name: true,
      phone: true,
      message: false, // Пожелание необязательно
    };
    setTouchedFields(newTouchedFields);
  };

  // Обработчик изменения поля с типизацией параметров
  const handleFieldChange = (fieldName: FormField, value: string): void => {
    // Обновляем значение поля в состоянии
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    // Помечаем поле как редактируемое
    if (!touchedFields[fieldName]) {
      setTouchedFields((prev) => ({
        ...prev,
        [fieldName]: true,
      }));
    }

    // Валидация и ошибки с типизацией
    let error = "";
    switch (fieldName) {
      case "email":
        error = validateEmail(value);
        break;
      case "name":
        error = validateName(value);
        break;
      case "phone":
        error = validatePhone(value);
        break;
      default:
        break;
    }

    // Обновление ошибки с сохранением типов
    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  // Валидация всей формы с типизацией
  useEffect(() => {
    const checkFormValidity = (): void => {
      const { email, name, phone } = formData;

      // Форма валидна, если все обязательные поля заполнены и нет ошибок валидации
      const isValid =
        email &&
        name &&
        phone &&
        !validateEmail(email) &&
        !validateName(name) &&
        !validatePhone(phone);
      setIsFormValid(!!isValid);
    };

    // Вызываем проверку при изменении данных формы
    checkFormValidity();
  }, [formData]);

  // Автоматическое скрытие уведомления через 5 секунд
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Основной обработчик отправки формы с типизацией события
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    showEmptyFields(); // Подсвечиваем все незаполненные обязательные поля
    setIsLoading(true); // Включаем состояние загрузки
    setMessage(""); // Сбрасываем предыдущие сообщения

    // Финальная проверка перед отправкой
    const { email, name, phone } = formData;

    const emailError = validateEmail(email);
    const nameError = validateName(name);
    const phoneError = validatePhone(phone);

    // Если есть ошибки валидации - показываем ошибку и прерываем отправку
    if (emailError || nameError || phoneError) {
      setFieldErrors((prev) => ({
        ...prev,
        email: emailError,
        name: nameError,
        phone: phoneError,
      }));
      setIsLoading(false);
      return;
    }

    // Дополнительная проверка на валидность формы
    if (!isFormValid) {
      setIsLoading(false);
      return;
    }

    try {
      // Параметры для отправки через EmailJS
      const templateParams = {
        user_name: formData.name,
        user_email: formData.email,
        user_phone: formData.phone,
        user_message: formData.message || "Не указано",
        date: new Date().toLocaleString("ru-RU"),
      };

      console.log("Отправляемые параметры:", templateParams);

      // Отправка письма через EmailJS сервис
      const result = await emailjs.send(
        "service_ok2hqod", // ID сервиса в EmailJS
        "template_jfsxfsx", // ID шаблона в EmailJS
        templateParams, // Данные для подстановки в шаблон
        "pLQq_Z4lItNBlOGf5" // Public key для доступа к сервису
      );

      console.log("Сообщение отправлено:", result);
      setMessage("success");
      clearForm();
    } catch (error) {
      console.error("Ошибка отправки:", error);
      setMessage("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Очистка формы
  const clearForm = (): void => {
    setFormData({
      email: "",
      name: "",
      phone: "",
      message: "",
    });
    setIsFormValid(false);
    setFieldErrors({
      email: "",
      name: "",
      phone: "",
      message: "",
    });
    setTouchedFields({
      email: false,
      name: false,
      phone: false,
      message: false,
    });
  };

  // Функция для получения текста уведомления
  const getNotificationText = (): string => {
    return message === "success"
      ? "Заявка успешно отправлена!"
      : "Ошибка отправки!";
  };

  // Обработчик изменения input с типизацией события
  const handleInputChange =
    (fieldName: FormField) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      handleFieldChange(fieldName, e.target.value);
    };

  // Обработчик события, когда пользователь убрал курсор
  const handleInputBlur =
    (fieldName: FormField) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
      handleFieldChange(fieldName, e.target.value);
    };

  return (
    <section className="registration section" id="order">
      {/* Всплывающее уведомление - отображается сверху на 5 секунд */}
      {message && (
        <div
          className={`notification ${
            message === "success"
              ? "notification--success"
              : "notification--error"
          }`}
        >
          {getNotificationText()}
        </div>
      )}

      <h1 className="registration__title">Регистрация</h1>

      {/* Основная форма с типизированными обработчиками */}
      <form onSubmit={handleSubmit} className="registration__form">
        <ul className="registration__list">
          <li className="registration__item">
            <p className="registration__label">Электронная почта</p>
            <input
              className={`registration__input ${
                touchedFields.email && fieldErrors.email
                  ? "registration__input--error"
                  : ""
              }`}
              type="email"
              placeholder="Ваша электронная почта"
              value={formData.email}
              onChange={handleInputChange("email")}
              onBlur={handleInputBlur("email")}
            />
            {/* Показываем ошибку только, если поле было тронуто, и есть ошибка */}
            {touchedFields.email && fieldErrors.email && (
              <span className="registration__error">{fieldErrors.email}</span>
            )}
          </li>

          <li className="registration__item">
            <p className="registration__label">Имя</p>
            <input
              className={`registration__input ${
                touchedFields.name && fieldErrors.name
                  ? "registration__input--error"
                  : ""
              }`}
              type="text"
              placeholder="Ваше имя"
              value={formData.name}
              onChange={handleInputChange("name")}
              onBlur={handleInputBlur("name")}
            />
            {touchedFields.name && fieldErrors.name && (
              <span className="registration__error">{fieldErrors.name}</span>
            )}
          </li>

          <li className="registration__item">
            <p className="registration__label">Номер телефона</p>
            <input
              className={`registration__input ${
                touchedFields.phone && fieldErrors.phone
                  ? "registration__input--error"
                  : ""
              }`}
              type="tel"
              placeholder="Ваш номер телефона"
              value={formData.phone}
              onChange={handleInputChange("phone")}
              onBlur={handleInputBlur("phone")}
            />
            {touchedFields.phone && fieldErrors.phone && (
              <span className="registration__error">{fieldErrors.phone}</span>
            )}
          </li>

          <li className="registration__item">
            <p className="registration__label">Пожелания</p>
            <textarea
              className="registration__input registration__input-wishes"
              placeholder="Ваши пожелания (необязательно)"
              value={formData.message}
              onChange={handleInputChange("message")}
              onBlur={handleInputBlur("message")}
            ></textarea>
            {touchedFields.message && fieldErrors.message && (
              <span className="registration__error">{fieldErrors.message}</span>
            )}
          </li>
        </ul>

        <button
          type="submit"
          className="registration__button"
          disabled={isLoading}
        >
          {isLoading ? "Отправка" : "Отправить заявку"}
        </button>
      </form>

      <p className="registration__warning">
        Нажимая на кнопку, вы даете согласие на обработку персональных данных и
        соглашаетесь c политикой конфиденциальности
      </p>
    </section>
  );
};

export default Registration;
