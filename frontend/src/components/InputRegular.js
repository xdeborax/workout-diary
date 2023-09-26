export default function InputRegular(
  {
    name,
    handleOnChange,
    getValidationClassName,
    type,
    className,
    label,
    errorMessages = [],
    value = '',
    placeholder,
    icon,
    disabled,
    children,
  },
) {
  return (
    <div className="mb-3">
      <div className="input-block">
        <label htmlFor={name} className="form-label mt-2 fw-semibold">
          {icon && <i className="px-2">{icon}</i>}
          {label}
        </label>
        <div className="input-group">
          <input
            type={type}
            name={name}
            onChange={handleOnChange}
            id={name}
            value={value}
            className={`${className} form-control ${getValidationClassName(name)}`}
            placeholder={placeholder}
            disabled={disabled}
          />
          {children}
          <div className="invalid-feedback mx-4" data-testid="errorblock">
            {errorMessages && errorMessages[0]}
          </div>
        </div>
      </div>
    </div>
  );
}
