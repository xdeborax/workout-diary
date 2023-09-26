export default function InputCheckBox({
  label,
  name,
  checked,
  handleOnChange,
  getValidationClassName,
  errorMessages = [],
}) {
  return (
    <div className="mb-4 form-check">
      <input
        checked={checked}
        name={name}
        type="checkbox"
        onChange={handleOnChange}
        id={name}
        value={name}
        className={`form-check-input ${getValidationClassName(name)}`}
      />
      <label htmlFor={name} className="form-check-label">{label}</label>
      <div className="invalid-feedback">
        {errorMessages.length === 1
          ? errorMessages[0]
          : (
            <ul>
              {errorMessages.map((errorMessage) => <li key={errorMessage}>{errorMessage}</li>)}
            </ul>
          )}
      </div>
    </div>
  );
}
