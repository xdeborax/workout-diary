export default function RadioButton(
  {
    handleOnChange,
    value,
    unitName,
    unit,
  },
) {
  return (
    <>
      <input
        type="radio"
        className="btn-check"
        onChange={handleOnChange}
        name={unitName}
        id={`btnradio1-${unit}`}
        autoComplete="off"
        value={unit}
        checked={unit === value}
      />
      <label className="btn btn-outline-primary rounded-0" htmlFor={`btnradio1-${unit}`}>{unit}</label>
    </>
  );
}
