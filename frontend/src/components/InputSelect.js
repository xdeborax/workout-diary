export default function InputSelect({
  name,
  label,
  handleOnchange,
  value = '',
  errorMessages = [],
  getValidationClassName,
  className,
  handleOnBlur,
  disabled,
  children,
}) {
  return (
    <div className="input-block mb-3">
      <label htmlFor={name} className="form-label fw-semibold">{label}</label>
      <select
        id={name}
        name={name}
        onChange={handleOnchange}
        onBlur={handleOnBlur}
        className={`${className} form-select ${getValidationClassName && getValidationClassName(name)}`}
        value={value}
        disabled={disabled}
      >
        {children}
      </select>
      <div className="invalid-feedback mx-4" data-testid="errorblock">
        {errorMessages && errorMessages[0]}
      </div>
    </div>
  );
}
