export default function InputTextarea({
  name, label, handleOnchange, value = '', errorMessages = [], getValidationClassName, className,
}) {
  return (
    <div className="input-block mb-3  fw-semibold">
      <label htmlFor={name} className="form-label">{label}</label>
      <textarea
        rows="2"
        className={`${className} form-control ${getValidationClassName && getValidationClassName(name)}`}
        name={name}
        value={value}
        id={name}
        onChange={handleOnchange}
      />
      <div className="invalid-feedback">{errorMessages}</div>
    </div>
  );
}
