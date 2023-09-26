import Form from '../Form';
import InputRegular from '../InputRegular';
import InputCheckBox from '../InputCheckBox';
import useFetchWithAuthorization from '../../useFetchWithAuthorization';

export default function SportTypeForm({ getListOfSportTypes }) {
  const fetchWithAuthorization = useFetchWithAuthorization();

  const initalValues = {
    type: '',
    hasPropDistance: false,
    hasPropExercises: false,
  };

  function isNotEmpty(value) {
    return value !== '';
  }

  function isLess30OrLessChar(value) {
    return value.length <= 30;
  }

  const validators = {
    type: [
      {
        fn: isNotEmpty,
        errorMessage: 'A típus megadása kötelező.',
      },
      {
        fn: isLess30OrLessChar,
        errorMessage: 'Max. 30 karakter lehet',
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
  ) {
    event.preventDefault();

    const sportTypeData = {
      type: formData.type.charAt(0).toUpperCase() + formData.type.slice(1),
      hasPropDistance: formData.hasPropDistance,
      hasPropExercises: formData.hasPropExercises,
    };

    const formIsValid = reportFormValidity();

    if (formIsValid) {
      let response;

      try {
        response = await fetchWithAuthorization(`${process.env.REACT_APP_API_BASE_URL}/api/admin/sports`, {
          method: 'POST',
          body: JSON.stringify(sportTypeData),
          headers: {
            'Content-type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setFormData(initalValues);
          setErrorMessages({});
          setWasValidated(false);
          setWasValidated(false);
          setFormAlertType('success');
          setFromAlertText('Sikeres hozzáadás');
          getListOfSportTypes();
        } else {
          setWasValidated(false);
          setFormAlertType('danger');
          setFromAlertText(data.error);
        }
        setTimeout(() => {
          setFormAlertType('');
          setFromAlertText('');
        }, 4000);
      } catch (err) {
        setWasValidated(false);
        setFormAlertType('danger');
        setFromAlertText('Sikertelen hozzáadás');
        setTimeout(() => {
          setFormAlertType('');
          setFromAlertText('');
        }, 4000);
      }
    }
  }

  return (
    <main className="container">
      <Form
        title="Edzés típus hozzáadása"
        buttonText="Hozzáadás"
        handleSubmit={handleSubmit}
        initalValues={initalValues}
        validators={validators}
        formName="sportTypeForm"
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
              name="type"
              className="input-field"
              handleOnChange={handleOnChange}
              getValidationClassName={getValidationClassName}
              errorMessages={errorMessages.type}
              value={formData.type}
              label="Típus*"
            />

            <div>
              <InputCheckBox
                label="Távolság mező hozzáadása"
                name="hasPropDistance"
                checked={formData.hasPropDistance}
                handleOnChange={handleCheckboxChange}
                getValidationClassName={getValidationClassName}
                errorMessages={errorMessages.hasPropDistance}
              />
            </div>

            <div>
              <InputCheckBox
                label="Gyakorlatok mező hozzáadása"
                name="hasPropExercises"
                checked={formData.hasPropExercises}
                handleOnChange={handleCheckboxChange}
                getValidationClassName={getValidationClassName}
                errorMessages={errorMessages.hasPropExercises}
              />
            </div>
          </>
        )}
      </Form>
    </main>
  );
}
