import React, { useRef, useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import emailjs from "@emailjs/browser";
import "./Registration.css";

// Типы данных
interface IFieldErrors {
  email: string;
  name: string;
  phone: string;
}

interface ITouchedFields {
  email: boolean;
  name: boolean;
  phone: boolean;
}

// Тип для имен полей формы
type FieldName = "email" | "name" | "phone";

const Registration: React.FC = () => {
  // Создаем типизированные ссылки на DOM-элементы полей формы
  const formRef = useRef<HTMLFormElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  // Состояния компонента с явной типизацией
  const [isLoading, setIsLoading] = useState<boolean>(false); // Загрузка отправки
  const [message, setMessage] = useState<string>(""); // Сообщение для уведомления
  const [isFormValid, setIsFormValid] = useState<boolean>(false); // Валидность всей формы
  const [fieldErrors, setFieldErrors] = useState<IFieldErrors>({
    email: "",
    name: "",
    phone: "",
  }); // Ошибки валидации для каждого поля
  const [touchedFields, setTouchedFields] = useState<ITouchedFields>({
    email: false,
    name: false,
    phone: false,
  }); // Отслеживание полей, редактируемых пользователем

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

  // Обработчик изменения поля с типизацией параметров
  const handleFieldChange = (fieldName: FieldName, value: string): void => {
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
      const email = emailRef.current?.value?.trim() || "";
      const name = nameRef.current?.value?.trim() || "";
      const phone = phoneRef.current?.value?.trim() || "";

      // Форма валидна если все поля заполнены и нет ошибок валидации
      const isValid =
        email &&
        name &&
        phone &&
        !validateEmail(email) &&
        !validateName(name) &&
        !validatePhone(phone);
      setIsFormValid(!!isValid);
    };

    // Получаем все input с типизацией
    const inputs: (HTMLInputElement | HTMLTextAreaElement | null)[] = [
      emailRef.current,
      nameRef.current,
      phoneRef.current,
      messageRef.current,
    ];

    // Добавляем обработчики на каждое поле
    inputs.forEach((input) => {
      input?.addEventListener("input", checkFormValidity);
    });

    // Первоначальная проверка при загрузке
    checkFormValidity();

    // Удаляем обработчики при размонтировании
    return () => {
      inputs.forEach((input) => {
        input?.removeEventListener("input", checkFormValidity);
      });
    };
  }, []);

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
    setIsLoading(true); // Включаем состояние загрузки
    setMessage(""); // Сбрасываем предыдущие сообщения

    // Отображение ошибки, если пользователь попытается отправить пустую форму
    setTouchedFields({
      email: true,
      name: true,
      phone: true,
    });

    // Финальная проверка перед отправкой с типизацией
    const email = emailRef.current?.value?.trim() || "";
    const name = nameRef.current?.value?.trim() || "";
    const phone = phoneRef.current?.value?.trim() || "";

    const emailError = validateEmail(email);
    const nameError = validateName(name);
    const phoneError = validatePhone(phone);

    // Если есть ошибки валидации - показываем ошибку и прерываем отправку
    if (emailError || nameError || phoneError) {
      setFieldErrors({
        email: emailError,
        name: nameError,
        phone: phoneError,
      });
      setMessage("error");
      setIsLoading(false);
      return;
    }

    // Дополнительная проверка на валидность формы
    if (!isFormValid) {
      setMessage("error");
      setIsLoading(false);
      return;
    }

    try {
      // Параметры для отправки через EmailJS с типизацией
      const templateParams = {
        user_name: nameRef.current?.value?.trim() || "",
        user_email: emailRef.current?.value?.trim() || "",
        user_phone: phoneRef.current?.value?.trim() || "",
        user_message: messageRef.current?.value?.trim() || "Не указано", // Запасное значение для пустого сообщения
        date: new Date().toLocaleString("ru-RU"), // Текущая дата в российском формате
      };

      console.log("Отправляемые параметры:", templateParams);

      // Отправка письма через EmailJS сервис с типизацией
      const result = await emailjs.send(
        "service_ok2hqod", // ID сервиса в EmailJS
        "template_jfsxfsx", // ID шаблона в EmailJS
        templateParams, // Данные для подстановки в шаблон
        "pLQq_Z4lItNBlOGf5" // Public key для доступа к сервису
      );

      console.log("Сообщение отправлено:", result);
      setMessage("success"); // Показываем успешное уведомление
      clearForm(); // Очищаем форму после успешной отправки
    } catch (error) {
      // Обработка ошибок отправки с типизацией
      console.error("Ошибка отправки:", error);
      setMessage("error"); // Показываем уведомление об ошибке
    } finally {
      // Выключаем состояние загрузки в любом случае
      setIsLoading(false);
    }
  };

  // Очистка формы с типизацией
  const clearForm = (): void => {
    [emailRef, nameRef, phoneRef, messageRef].forEach((ref) => {
      if (ref.current) ref.current.value = "";
    });
    setIsFormValid(false);
    setFieldErrors({ email: "", name: "", phone: "" });
    setTouchedFields({ email: false, name: false, phone: false });
  };

  // Функция для получения текста уведомления с типизацией
  const getNotificationText = (): string => {
    return message === "success"
      ? "Заявка успешно отправлена!"
      : "Ошибка отправки!";
  };

  // Обработчик изменения input с типизацией события
  const handleInputChange =
    (fieldName: FieldName) =>
    (e: ChangeEvent<HTMLInputElement>): void => {
      handleFieldChange(fieldName, e.target.value);
    };

  // Обработчик события, когда пользователь убрал курсор, с типизацией
  const handleInputBlur =
    (fieldName: FieldName) =>
    (e: ChangeEvent<HTMLInputElement>): void => {
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
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="registration__form"
      >
        <ul className="registration__list">
          <li className="registration__item">
            <p className="registration__label">Электронная почта</p>
            <input
              ref={emailRef}
              className={`registration__input ${
                touchedFields.email && fieldErrors.email
                  ? "registration__input--error"
                  : ""
              }`}
              type="email"
              placeholder="Ваша электронная почта"
              required
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
              ref={nameRef}
              className={`registration__input ${
                touchedFields.name && fieldErrors.name
                  ? "registration__input--error"
                  : ""
              }`}
              type="text"
              placeholder="Ваше имя"
              required
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
              ref={phoneRef}
              className={`registration__input ${
                touchedFields.phone && fieldErrors.phone
                  ? "registration__input--error"
                  : ""
              }`}
              type="tel"
              placeholder="Ваш номер телефона"
              required
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
              ref={messageRef}
              className="registration__input registration__input-wishes"
              placeholder="Ваши пожелания (необязательно)"
            ></textarea>
          </li>
        </ul>

        <button
          type="submit"
          className="registration__button"
          disabled={isLoading || !isFormValid}
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
