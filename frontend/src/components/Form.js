import './Form.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEnvelope,
  faLock,
  faCircleUser,
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';

export default function Form({
  title,
  buttonText,
  handleSubmit,
  initalValues,
  validators,
  formName,
  disabled,
  showModifyForm,
  hideFormHandler,
  children,
}) {
  const [formData, setFormData] = useState(initalValues);
  const [errorMessages, setErrorMessages] = useState({});
  const [wasValidated, setWasValidated] = useState(false);

  const [formAlertText, setFromAlertText] = useState('');
  const [formAlertType, setFormAlertType] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    setFormData(initalValues);
  }, [initalValues]);

  function reportFieldValidity(inputName) {
    const inputValue = formData[inputName];
    const inputValidators = validators[inputName];
    const inputValidationResults = inputValidators.map((inputValidator) => {
      const { fn: validatorFn, errorMessage: validatorErrorMessage } = inputValidator;
      const isValid = validatorFn(inputValue);
      return isValid ? '' : validatorErrorMessage;
    })
      .filter((errorMessage) => errorMessage !== '');

    setErrorMessages((prev) => ({
      ...prev,
      [inputName]: inputValidationResults,
    }));

    return inputValidationResults.length === 0;
  }

  function reportFormValidity() {
    if (validators !== undefined) {
      const inputFieldNames = Object.keys(validators);
      const inputValidations = inputFieldNames.map((inputFieldName) => reportFieldValidity(inputFieldName));
      const isValid = inputValidations.every((isFieldValid) => isFieldValid);
      setWasValidated(inputFieldNames);
      return isValid;
    }
    return true;
  }

  function getValidationClassName(fieldName) {
    let className = '';
    const key = fieldName;
    const isValid = errorMessages[key] === undefined || (errorMessages[key] && errorMessages[key].length === 0);
    if (wasValidated) {
      if (isValid) {
        className = 'is-valid';
      } else {
        className = 'is-invalid';
      }
    }
    return className;
  }

  function handleOnChange({ target: { name, value } }) {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleCheckboxChange({ target: { name, checked } }) {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  }

  const user = <FontAwesomeIcon icon={faCircleUser} />;
  const envelope = <FontAwesomeIcon icon={faEnvelope} />;
  const lock = <FontAwesomeIcon icon={faLock} />;
  const xmark = <FontAwesomeIcon icon={faCircleXmark} className="text-secondary" />;

  return (
    <div className="form-container d-flex justify-content-center">
      <div className="form-block mt-2" id={formName}>

        <form
          onSubmit={(event) => handleSubmit(
            event,
            formData,
            setFormData,
            setErrorMessages,
            setFormAlertType,
            setFromAlertText,
            reportFormValidity,
            setWasValidated,
            navigate,
          )}
          noValidate
        >

          {showModifyForm && (
            <div className="text-end">
              <button
                onClick={hideFormHandler}
                type="button"
                className="btn fs-4"
                data-testid="close-form-btn"
              >
                {xmark}
              </button>
            </div>
          )}

          <h1 className="form-title mt-3 mb-4">{title}</h1>

          {children(
            handleOnChange,
            getValidationClassName,
            errorMessages,
            formData,
            user,
            envelope,
            lock,
            handleCheckboxChange,
          )}

          {formAlertText && (
            <div className={`alert alert-${formAlertType}`} role="alert">
              {formAlertText}
            </div>
          )}

          <button
            id="submit-btn"
            type="submit"
            disabled={disabled}
            className="btn btn-primary text-light my-3"
          >
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  );
}
