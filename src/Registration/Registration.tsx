import React, { useState, useEffect, useCallback } from "react";
import type { FormEvent, ChangeEvent } from "react";
import emailjs from "@emailjs/browser";
import "./Registration.css";
import axios from "axios";
import { IMaskInput } from "react-imask";

// Типы данных
interface ITourist {
  firstName: string;
  lastName: string;
}

interface IFormData {
  email: string;
  name: string;
  phone: string;
  message: string;
  tourId: string;
  excursionIds: string[];
  tourists: ITourist[];
}

interface ITour {
  id: string;
  name: string;
  description: string;
}

interface IExcursion {
  id: string;
  name: string;
  description: string;
  tourIds: string[];
}

type FormField = keyof Omit<IFormData, "excursionIds" | "tourists">;
type FieldErrors = Record<FormField, string>;
type TouchedFields = Record<FormField, boolean>;
type TouristErrors = Array<{
  firstName: string;
  lastName: string;
}>;

const Registration: React.FC = () => {
  // Состояния
  const [formData, setFormData] = useState<IFormData>({
    email: "",
    name: "",
    phone: "",
    message: "",
    tourId: "",
    excursionIds: [],
    tourists: [{ firstName: "", lastName: "" }],
  });

  const [tours, setTours] = useState<ITour[]>([]);
  const [excursions, setExcursions] = useState<IExcursion[]>([]);
  const [availableExcursions, setAvailableExcursions] = useState<IExcursion[]>(
    []
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({
    email: "",
    name: "",
    phone: "",
    message: "",
    tourId: "",
  });
  const [touchedFields, setTouchedFields] = useState<TouchedFields>({
    email: false,
    name: false,
    phone: false,
    message: false,
    tourId: false,
  });
  const [touristErrors, setTouristErrors] = useState<TouristErrors>([
    { firstName: "", lastName: "" },
  ]);

  // Ключ для принудительного пересоздания маски телефона
  const [phoneKey, setPhoneKey] = useState<number>(0);

  // Загрузка данных
  useEffect(() => {
    const getData = async () => {
      try {
        const [toursResponse, excursionsResponse] = await Promise.all([
          axios.get("http://localhost:3001/tours"),
          axios.get("http://localhost:3001/excursions"),
        ]);

        setTours(toursResponse.data);
        setExcursions(excursionsResponse.data);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        setMessage("error");
      }
    };

    getData();
  }, []);

  // Обновление доступных экскурсий
  useEffect(() => {
    if (formData.tourId) {
      const available = excursions.filter((excursion) =>
        excursion.tourIds.includes(formData.tourId)
      );
      setAvailableExcursions(available);
      setFormData((prev) => ({ ...prev, excursionIds: [] }));
    } else {
      setAvailableExcursions([]);
    }
  }, [formData.tourId, excursions]);

  // Валидация email с типизацией
  const validateEmail = useCallback((email: string): string => {
    if (!email) return "Email обязателен для заполнения";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Введите корректный email";
    return "";
  }, []);

  // Валидация имени с типизацией
  const validateName = useCallback((name: string): string => {
    if (!name) return "Имя обязательно для заполнения";
    if (name[0] !== name[0].toUpperCase())
      return "Имя должно начинаться с заглавной буквы";
    if (name.length < 2) return "Имя должно содержать минимум 2 символа";
    if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(name))
      return "Имя может содержать только буквы, пробелы и дефисы";
    return "";
  }, []);

  // Валидация телефона с типизацией
  const validatePhone = useCallback((phone: string): string => {
    if (!phone) return "Телефон обязателен для заполнения";

    const clearPhone = phone.replace(/\D/g, "");
    if (clearPhone.length !== 11)
      return "Номер телефона должен содержать 11 цифр";

    return "";
  }, []);

  // Валидация тура с типизацией
  const validateTour = useCallback((tourId: string): string => {
    if (!tourId) return "Выберите тур";
    return "";
  }, []);

  // Валидация имени туриста с типизацией
  const validateFirstName = useCallback((firstName: string): string => {
    if (!firstName) return "Имя туриста обязательно для заполнения";
    if (firstName[0] !== firstName[0].toUpperCase())
      return "Имя туриста должно начинаться с заглавной буквы";
    if (firstName.length < 2)
      return "Имя туриста должно содержать минимум 2 символа";
    if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(firstName))
      return "Имя туриста может содержать только буквы, пробелы и дефисы";
    return "";
  }, []);

  // Валидация фамилии туриста с типизацией
  const validateLastName = useCallback((lastName: string): string => {
    if (!lastName) return "Фамилия туриста обязательна для заполнения";
    if (lastName[0] !== lastName[0].toUpperCase())
      return "Фамилия туриста должна начинаться с заглавной буквы";
    if (lastName.length < 2)
      return "Фамилия туриста должна содержать минимум 2 символа";
    if (!/^[a-zA-Zа-яА-ЯёЁ\s\-]+$/.test(lastName))
      return "Фамилия туриста может содержать только буквы, пробелы и дефисы";
    return "";
  }, []);

  const validateForm = useCallback((): boolean => {
    const { email, name, phone, tourId, tourists } = formData;
    const emailError = validateEmail(email);
    const nameError = validateName(name);
    const phoneError = validatePhone(phone);
    const tourError = validateTour(tourId);

    // Валидация всех туристов
    const touristsErrors = tourists.map((tourist) => ({
      firstName: validateFirstName(tourist.firstName),
      lastName: validateLastName(tourist.lastName),
    }));

    const hasTouristErrors = touristsErrors.some(
      (error) => error.firstName !== "" || error.lastName !== ""
    );

    const hasErrors = !!(
      emailError ||
      nameError ||
      phoneError ||
      tourError ||
      hasTouristErrors
    );

    if (hasErrors) {
      setFieldErrors({
        email: emailError,
        name: nameError,
        phone: phoneError,
        message: "",
        tourId: tourError,
      });
      setTouristErrors(touristsErrors);
    }

    return !hasErrors;
  }, [
    formData,
    validateEmail,
    validateName,
    validatePhone,
    validateTour,
    validateFirstName,
    validateLastName,
  ]);

  // Функция для подсветки всех незаполненных обязательных полей
  const showEmptyFields = (): void => {
    const newTouchedFields: TouchedFields = {
      email: true,
      name: true,
      phone: true,
      message: false,
      tourId: true,
    };
    setTouchedFields(newTouchedFields);
  };

  // Обработчик изменения поля с типизацией параметров
  const handleFieldChange = (fieldName: FormField, value: string): void => {
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
      case "tourId":
        error = validateTour(value);
        break;
      default:
        break;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [fieldName]: error,
    }));
  };

  const handleTouristChange = (
    index: number,
    field: keyof ITourist,
    value: string
  ): void => {
    const newTourists = [...formData.tourists];
    newTourists[index] = { ...newTourists[index], [field]: value };
    setFormData((prev) => ({ ...prev, tourists: newTourists }));

    // Валидация конкретного туриста
    const error =
      field === "firstName"
        ? validateFirstName(value)
        : validateLastName(value);

    const newErrors = [...touristErrors];
    newErrors[index] = {
      ...newErrors[index],
      [field]: error,
    };
    setTouristErrors(newErrors);
  };

  // Добавление поля с туристом
  const addTouristField = (): void => {
    setFormData((prev) => ({
      ...prev,
      tourists: [...prev.tourists, { firstName: "", lastName: "" }],
    }));
    setTouristErrors((prev) => [...prev, { firstName: "", lastName: "" }]);
  };

  // Удаление поля с туристом
  const removeTouristField = (index: number): void => {
    if (formData.tourists.length > 1) {
      const newTourists = formData.tourists.filter((_, i) => i !== index);
      setFormData((prev) => ({ ...prev, tourists: newTourists }));

      // Удаляем соответствующую ошибку
      const newErrors = touristErrors.filter((_, i) => i !== index);
      setTouristErrors(newErrors);
    }
  };

  const handleExcursionChange = (excursionId: string): void => {
    setFormData((prev) => {
      const newExcursionIds = prev.excursionIds.includes(excursionId)
        ? prev.excursionIds.filter((id) => id !== excursionId)
        : [...prev.excursionIds, excursionId];
      return { ...prev, excursionIds: newExcursionIds };
    });
  };

  // Автоматическое скрытие уведомления
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  // Отправка формы
  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    showEmptyFields();
    setMessage("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const applicationData = {
        ...formData,
        tourists: formData.tourists.filter(
          (t) => t.firstName.trim() !== "" && t.lastName.trim() !== ""
        ),
      };

      await axios.post("http://localhost:3001/applications", applicationData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const selectedTour = tours.find((t) => t.id === formData.tourId);
      const selectedExcursions = excursions.filter((e) =>
        formData.excursionIds.includes(e.id)
      );

      const templateParams = {
        user_name: formData.name,
        user_email: formData.email,
        user_phone: "+" + formData.phone,
        user_message: formData.message || "Не указано",
        tour_name: selectedTour?.name,
        excursions_list:
          selectedExcursions.map((e) => e.name).join(", ") || "Не выбраны",
        tourists_list: formData.tourists
          .filter((t) => t.firstName.trim() !== "" && t.lastName.trim() !== "")
          .map((t) => `${t.lastName} ${t.firstName}`)
          .join(", "),
        date: new Date().toLocaleString("ru-RU"),
      };

      // Отправка письма через EmailJS
      await emailjs.send(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_PUBLIC_KEY
      );

      setMessage("success");
      clearForm();
    } catch (error) {
      console.error("Ошибка отправки:", error);
      setMessage("error");
    } finally {
      setIsLoading(false);
    }
  };

  // Обработчик изменения телефона
  const handlePhoneChange = (value: string) => {
    // Очищаем значение от всех нецифровых символов
    const cleanedValue = value.replace(/\D/g, "");

    let phoneValue = cleanedValue;

    // Если номер начинается с 8, заменяем на 7
    if (cleanedValue.startsWith("8") && cleanedValue.length === 11) {
      phoneValue = "7" + cleanedValue.slice(1);
    }
    // Если номер из 10 цифр, добавляем 7
    else if (cleanedValue.length === 10) {
      phoneValue = "7" + cleanedValue;
    }
    // Если номер из 11 цифр и начинается с 7, оставляем как есть
    else if (cleanedValue.length === 11 && cleanedValue.startsWith("7")) {
      phoneValue = cleanedValue;
    }
    // Если меньше 10 цифр, сохраняем как есть
    else if (cleanedValue.length <= 10) {
      phoneValue = cleanedValue;
    }

    setFormData((prev) => ({
      ...prev,
      phone: phoneValue,
    }));

    // Валидация
    if (phoneValue.length === 11) {
      const error = validatePhone(phoneValue);
      setFieldErrors((prev) => ({
        ...prev,
        phone: error,
      }));
    } else {
      setFieldErrors((prev) => ({
        ...prev,
        phone: "",
      }));
    }

    // Заменяю статус на touched
    if (!touchedFields.phone) {
      setTouchedFields((prev) => ({
        ...prev,
        phone: true,
      }));
    }
  };

  // Обработчик потери фокуса телефона
  const handlePhoneBlur = (): void => {
    if (!touchedFields.phone) {
      setTouchedFields((prev) => ({
        ...prev,
        phone: true,
      }));
    }

    // Валидация телефона при потере фокуса
    const error = validatePhone(formData.phone);
    setFieldErrors((prev) => ({
      ...prev,
      phone: error,
    }));
  };

  // Очистка формы
  const clearForm = (): void => {
    setFormData({
      email: "",
      name: "",
      phone: "",
      message: "",
      tourId: "",
      excursionIds: [],
      tourists: [{ firstName: "", lastName: "" }],
    });
    setFieldErrors({
      email: "",
      name: "",
      phone: "",
      message: "",
      tourId: "",
    });
    setTouchedFields({
      email: false,
      name: false,
      phone: false,
      message: false,
      tourId: false,
    });
    setTouristErrors([{ firstName: "", lastName: "" }]);

    // Сбрасываем ключ для принудительного пересоздания маски телефона
    setPhoneKey((prev) => prev + 1);
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
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ): void => {
      handleFieldChange(fieldName, e.target.value);
    };

  // Обработчик события, когда пользователь убрал курсор
  const handleInputBlur =
    (fieldName: FormField) =>
    (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ): void => {
      handleFieldChange(fieldName, e.target.value);
    };

  return (
    <section className="registration section" id="order">
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
      <form onSubmit={handleSubmit} className="registration__form" noValidate>
        <ul className="registration__list">
          {/* Email */}
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
            {touchedFields.email && fieldErrors.email && (
              <span className="registration__error">{fieldErrors.email}</span>
            )}
          </li>

          {/* Имя */}
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

          {/* Телефон*/}
          <li className="registration__item">
            <p className="registration__label">Номер телефона</p>
            <IMaskInput
              key={phoneKey} // Ключ для пересоздания компонента при очистке
              mask="+7 (000) 000-00-00"
              lazy={false}
              overwrite="shift"
              placeholderChar="_"
              placeholder="+7 (___) ___-__-__"
              className={`registration__input ${
                touchedFields.phone && fieldErrors.phone
                  ? "registration__input--error"
                  : ""
              }`}
              onAccept={(value: string) => handlePhoneChange(value)}
              onBlur={handlePhoneBlur}
              value={undefined}
              autofix={false}
            />
            {touchedFields.phone && fieldErrors.phone && (
              <span className="registration__error">{fieldErrors.phone}</span>
            )}
          </li>

          {/* Тур */}
          <li className="registration__item">
            <p className="registration__label">Выбор тура</p>
            <select
              className={`registration__input registration__select ${
                touchedFields.tourId && fieldErrors.tourId
                  ? "registration__input--error"
                  : ""
              }`}
              value={formData.tourId}
              onChange={handleInputChange("tourId")}
              onBlur={handleInputBlur("tourId")}
            >
              <option value="">Выберите тур</option>
              {tours.map((tour) => (
                <option key={tour.id} value={tour.id}>
                  {tour.name}
                </option>
              ))}
            </select>
            {touchedFields.tourId && fieldErrors.tourId && (
              <span className="registration__error">{fieldErrors.tourId}</span>
            )}
          </li>

          {/* Экскурсии */}
          <li className="registration__item">
            <p className="registration__label">Доступные экскурсии</p>
            <div className="registration__excursions">
              {availableExcursions.length > 0 ? (
                <div className="registration__excursions-list">
                  {availableExcursions.map((excursion) => (
                    <label
                      key={excursion.id}
                      className="registration__excursion-item"
                    >
                      <input
                        type="checkbox"
                        checked={formData.excursionIds.includes(excursion.id)}
                        onChange={() => handleExcursionChange(excursion.id)}
                        className="registration__excursion-checkbox"
                      />
                      <div className="registration__excursion-content">
                        <span className="registration__excursion-name">
                          {excursion.name}
                        </span>
                        <span className="registration__excursion-description">
                          {excursion.description}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="registration__excursions-empty">
                  {formData.tourId
                    ? "Нет доступных экскурсий для выбранного тура"
                    : "Выберите тур для отображения экскурсий"}
                </p>
              )}
            </div>
          </li>

          {/* Туристы */}
          <li className="registration__item">
            <p className="registration__label">Список туристов</p>
            <div className="registration__tourists">
              {formData.tourists.map((tourist, index) => (
                <div key={index} className="registration__tourist-group">
                  <div className="registration__tourist-fields">
                    <div className="registration__tourist-field">
                      <input
                        type="text"
                        placeholder="Фамилия"
                        value={tourist.lastName}
                        onChange={(e) =>
                          handleTouristChange(index, "lastName", e.target.value)
                        }
                        className={`registration__input registration__tourist-input ${
                          touristErrors[index]?.lastName
                            ? "registration__input--error"
                            : ""
                        }`}
                      />
                      {touristErrors[index]?.lastName && (
                        <span className="registration__error">
                          {touristErrors[index].lastName}
                        </span>
                      )}
                    </div>
                    <div className="registration__tourist-field">
                      <input
                        type="text"
                        placeholder="Имя"
                        value={tourist.firstName}
                        onChange={(e) =>
                          handleTouristChange(
                            index,
                            "firstName",
                            e.target.value
                          )
                        }
                        className={`registration__input registration__tourist-input ${
                          touristErrors[index]?.firstName
                            ? "registration__input--error"
                            : ""
                        }`}
                      />
                      {touristErrors[index]?.firstName && (
                        <span className="registration__error">
                          {touristErrors[index].firstName}
                        </span>
                      )}
                    </div>
                  </div>
                  {formData.tourists.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTouristField(index)}
                      className="registration__tourist-remove"
                      aria-label="Удалить туриста"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTouristField}
                className="registration__tourist-add"
              >
                Добавить туриста
              </button>
            </div>
          </li>

          {/* Пожелания */}
          <li className="registration__item">
            <p className="registration__label">Пожелания</p>
            <textarea
              className="registration__input registration__input-wishes"
              placeholder="Ваши пожелания (необязательно)"
              value={formData.message}
              onChange={handleInputChange("message")}
              onBlur={handleInputBlur("message")}
            ></textarea>
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
