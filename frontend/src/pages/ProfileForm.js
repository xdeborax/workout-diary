import { useContext } from 'react';
import Form from '../components/Form';
import InputRegular from '../components/InputRegular';
import { UserContext } from '../contexts/UserContext';

export default function ProfileForm() {
  const { loggedInUser, logInUserByToken } = useContext(UserContext);

  const initalValues = {
    name: loggedInUser.name,
    email: loggedInUser.email,
    password: '',
  };

  let token = localStorage.getItem('token');

  async function handleSubmit(
    event,
    formData,
    setFormData,
    setErrorMessages,
    setFormAlertType,
    setFromAlertText,
    reportFormValidity,
    setWasValidated,
  ) {
    event.preventDefault();

    const userData = {
      name: formData.name,
      password: formData.password,
    };

    const formIsValid = reportFormValidity();

    if (formIsValid) {
      let response;

      try {
        response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/users`, {
          method: 'PATCH',
          body: JSON.stringify(userData),
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (response.ok) {
          token = data.token;
          logInUserByToken(token);
          setFormData({
            name: data.name,
            email: data.email,
            password: '',
          });
          setErrorMessages({});
          setWasValidated(false);
          setFormAlertType('success');
          setFromAlertText('Sikerült a módosítás');
        } else {
          setWasValidated(false);
          setFormAlertType('danger');
          setFromAlertText(data.error);
        }
      } catch (err) {
        setWasValidated(false);
        setFormAlertType('danger');
        setFromAlertText('Sikertelen módosítás.');
      }
    }
  }

  return (
    <main className="container mt-3 pb-5">
      <Form
        title="Profil módosítása"
        handleSubmit={handleSubmit}
        initalValues={initalValues}
        buttonText="Módosítás"
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
              disabled
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
  );
}
