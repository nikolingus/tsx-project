import React from "react";

// типы данных
interface ITourist {
  id: string;
  firstName: string;
  lastName: string;
}

interface TouristInputProps {
  tourist: ITourist;
  errors: { firstName: string; lastName: string };
  touched: { firstName: boolean; lastName: boolean };
  onChange: (
    id: string,
    field: keyof Omit<ITourist, "id">,
    value: string
  ) => void;
  onBlur: (id: string, field: keyof Omit<ITourist, "id">) => void;
  onRemove: (id: string) => void;
  showRemove: boolean;
  showErrors: boolean;
}

const TouristInput: React.FC<TouristInputProps> = ({
  tourist,
  errors,
  touched,
  onChange,
  onBlur,
  onRemove,
  showRemove,
  showErrors,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof Omit<ITourist, "id">
  ) => {
    onChange(tourist.id, field, e.target.value);
  };

  const handleBlur = (field: keyof Omit<ITourist, "id">) => {
    onBlur(tourist.id, field);
  };

  // Отображение ошибки
  const shouldShowError = (field: "firstName" | "lastName") => {
    return (touched[field] || showErrors) && errors[field];
  };

  return (
    <div className="registration__tourist-group">
      <div className="registration__tourist-fields">
        <div className="registration__tourist-field">
          <input
            type="text"
            placeholder="Фамилия"
            value={tourist.lastName}
            onChange={(e) => handleChange(e, "lastName")}
            onBlur={() => handleBlur("lastName")}
            className={`registration__input registration__tourist-input ${
              shouldShowError("lastName") ? "registration__input--error" : ""
            }`}
          />
          {shouldShowError("lastName") ? (
            <span className="registration__error">{errors.lastName}</span>
          ) : null}
        </div>
        <div className="registration__tourist-field">
          <input
            type="text"
            placeholder="Имя"
            value={tourist.firstName}
            onChange={(e) => handleChange(e, "firstName")}
            onBlur={() => handleBlur("firstName")}
            className={`registration__input registration__tourist-input ${
              shouldShowError("firstName") ? "registration__input--error" : ""
            }`}
          />
          {shouldShowError("firstName") ? (
            <span className="registration__error">{errors.firstName}</span>
          ) : null}
        </div>
      </div>
      {showRemove ? (
        <button
          type="button"
          onClick={() => onRemove(tourist.id)}
          className="registration__tourist-remove"
          aria-label="Удалить туриста"
        >
          ✕
        </button>
      ) : null}
    </div>
  );
};

export default TouristInput;
