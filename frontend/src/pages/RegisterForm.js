import { NavLink } from 'react-router-dom';
import validator from 'validator';
import Form from '../components/Form';
import InputRegular from '../components/InputRegular';
import InputCheckBox from '../components/InputCheckBox';

export default function RegisterForm() {
  const initalValues = {
    name: '',
    email: '',
    password: '',
    auth: false,
  };

  function isNotEmpty(value) {
    return value !== '';
  }

  function isThisEmail(value) {
    return validator.isEmail(value);
  }

  function atLeastEightChars(value) {
    return value.length >= 8;
  }

  function isItChecked(value) {
    return value === true;
  }

  const validators = {
    name: [
      {
        fn: isNotEmpty,
        errorMessage: 'A név megadása kötelező.',
      },
    ],
    email: [
      {
        fn: isNotEmpty,
        errorMessage: 'Az email megadása kötelező.',
      },
      {
        fn: isThisEmail,
        errorMessage: 'Nem megfelelő email formátum.',
      },
    ],
    password: [
      {
        fn: isNotEmpty,
        errorMessage: 'A jelszó megadása kötelező.',
      },
      {
        fn: atLeastEightChars,
        errorMessage: 'A jelszónak legalább 8 karakternek kell lennie.',
      },
    ],
    auth: [
      {
        fn: isItChecked,
        errorMessage: 'Kötelező elfogadni.',
      },
    ],
  };

  async function handleSubmit(
    event,
    formData,
    setFormData,
    setErrorMessages,
    setFormAlertType,
    setFromAlertText,
    reportFormValidity,
    setWasValidated,
    navigate,
  ) {
    event.preventDefault();

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
    };

    const formIsValid = reportFormValidity();

    if (formIsValid) {
      let response;

      try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/register`, {
          method: 'POST',
          body: JSON.stringify(userData),
          headers: {
            'Content-type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFormData(initalValues);
          setErrorMessages({});
          setWasValidated(false);

          navigate('/login');
        } else {
          setWasValidated(false);
          setFormAlertType('danger');
          setFromAlertText(data.error);
        }
      } catch (err) {
        setWasValidated(false);
        setFormAlertType('danger');
        setFromAlertText('Sikertelen regisztráció.');
      }
    }
  }

  return (
    <div className="pb-5">
      <main className="container">
        <Form
          title="Regisztráció"
          buttonText="Regisztráció"
          handleSubmit={handleSubmit}
          initalValues={initalValues}
          validators={validators}
        >
          {(
            handleOnChange,
            getValidationClassName,
            errorMessages,
            formData,
            user,
            envelope,
            lock,
            handleCheckboxChange,
          ) => (
            <>
              <InputRegular
                type="text"
                name="name"
                className="input-field"
                handleOnChange={handleOnChange}
                getValidationClassName={getValidationClassName}
                errorMessages={errorMessages.name}
                value={formData.name}
                placeholder="Felhasználónév*"
                icon={user}
              />

              <InputRegular
                type="email"
                name="email"
                className="input-field"
                handleOnChange={handleOnChange}
                getValidationClassName={getValidationClassName}
                errorMessages={errorMessages.email}
                value={formData.email}
                placeholder="Email*"
                icon={envelope}
              />

              <InputRegular
                type="password"
                name="password"
                className="input-field"
                handleOnChange={handleOnChange}
                getValidationClassName={getValidationClassName}
                errorMessages={errorMessages.password}
                value={formData.password}
                placeholder="Jelszó*"
                icon={lock}
              />

              <div id="authInput">
                <InputCheckBox
                  label={(
                    <div>
                      Elfogadom a
                      {' '}
                      <NavLink to="/termsandconditions">felhasználási feltételeket</NavLink>
                      {' '}
                      és az
                      {' '}
                      <NavLink to="/privacypolicy">adatvédelmi szabályzatot</NavLink>
                      {' *'}
                    </div>
                  )}
                  name="auth"
                  checked={formData.auth}
                  handleOnChange={handleCheckboxChange}
                  getValidationClassName={getValidationClassName}
                  errorMessages={errorMessages.auth}
                />
              </div>
            </>
          )}
        </Form>
      </main>
    </div>
  );
}
