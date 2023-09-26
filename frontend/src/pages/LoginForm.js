import { useContext } from 'react';
import validator from 'validator';
import Form from '../components/Form';
import { UserContext } from '../contexts/UserContext';
import InputRegular from '../components/InputRegular';

export default function LoginForm() {
  const { logInUserByToken } = useContext(UserContext);

  const initalValues = {
    email: '',
    password: '',
  };

  function isNotEmpty(value) {
    return value !== '';
  }

  function isThisEmail(value) {
    return validator.isEmail(value);
  }

  const validators = {
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
      email: formData.email,
      password: formData.password,
    };

    const formIsValid = reportFormValidity();

    if (formIsValid) {
      let response;

      try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/login`, {
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

          const { token } = data;
          if (token) {
            logInUserByToken(token);
            navigate('/');
          }
        } else {
          setWasValidated(false);
          setFormAlertType('danger');
          setFromAlertText(data.error);
        }
      } catch (err) {
        setWasValidated(false);
        setFormAlertType('danger');
        setFromAlertText('Sikertelen bejelentkezés.');
      }
    }
  }

  return (
    <div className="pb-5">
      <main className="container">
        <Form
          title="Bejelentkezés"
          buttonText="Bejelentkezés"
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
          ) => (
            <>
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
            </>
          )}
        </Form>
      </main>
    </div>
  );
}
