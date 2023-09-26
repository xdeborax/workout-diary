import { useEffect, useState } from 'react';
import Form from './Form';
import InputSelect from './InputSelect';
import InputTextarea from './InputTextarea';
import RadioButton from './RadioButton';
import ExercisesInputs from './ExercisesInputs';
import useFetchWithAuthorization from '../useFetchWithAuthorization';
import './WorkoutForm.scss';
import InputCheckBox from './InputCheckBox';
import InputRegular from './InputRegular';
import generateRandomId from '../generateRandomId';

export default function WorkoutForm({
  basicWorkoutFormValues,
  exercisesInputsValues,
  sportTypeValue,
  selectedWorkoutId,
  loadWorkoutDiary,
  showWorkoutModifyForm,
  hideFormHandler,
}) {
  const fetchWithAuthorization = useFetchWithAuthorization();

  const [listOfSportTypes, setListOfSportTypes] = useState('');
  const [variableElementsOfForm, setVariableElementsOfForm] = useState({});
  const [selectedSportType, setSelectedSportType] = useState(sportTypeValue);
  const [serverErrorMessage, setServerErrorMessage] = useState('');
  const [units, setUnits] = useState({});

  const [basicWorkoutFormInitialValues, setBasicWorkoutFormInitialValues] = useState(basicWorkoutFormValues);
  const [exercisesInputsRows, setExercisesInputsRows] = useState(exercisesInputsValues);
  const [exercisesErrorMessage, setExercisesErrorMessage] = useState('');
  const [allFormInputsAreValidated, setAllFormInputsAreValidated] = useState(false);

  async function getUnits() {
    try {
      const response = await fetchWithAuthorization(
        `${process.env.REACT_APP_API_BASE_URL}/api/units`,
      );

      if (response?.ok) {
        const data = await response.json();
        const result = {};
        data.units.forEach((unit) => {
          result[unit.unitName] = unit.unitValue;
        });

        setUnits(result);
      }
    } catch (err) {
      setServerErrorMessage(
        'Hiba történt a lista betöltése során! Kérjük, látogasson vissza később!',
      );
    }
  }

  async function getListOfSportTypes() {
    try {
      const response = await fetchWithAuthorization(
        `${process.env.REACT_APP_API_BASE_URL}/api/sports`,
      );
      if (response?.ok) {
        const data = await response.json();
        setListOfSportTypes(data.sportTypes);
        setServerErrorMessage('');
        if (sportTypeValue) {
          data.sportTypes?.forEach((sport) => {
            if (sport.type === sportTypeValue) {
              setVariableElementsOfForm({
                hasPropDistance: sport.hasPropDistance,
                hasPropExercises: sport.hasPropExercises,
              });
            }
          });
        }
      }
    } catch (err) {
      setServerErrorMessage(
        'Hiba történt az adatok betöltése során! Kérjük, látogasson vissza később!',
      );
    }
  }

  useEffect(() => {
    getListOfSportTypes();
    getUnits();
  }, []);

  useEffect(() => {
    setBasicWorkoutFormInitialValues(basicWorkoutFormValues);
    setExercisesInputsRows(exercisesInputsValues);
    setSelectedSportType(sportTypeValue);
  }, [basicWorkoutFormValues, exercisesInputsValues, sportTypeValue]);

  function isNotEmpty(value) {
    return value !== '';
  }
  function isMoreThanNull(value) {
    return value > 0;
  }
  function isMoreThanNullOrEmpty(value) {
    return value > 0 || value === '';
  }
  function isLessThan200Char(value) {
    return value.length <= 200;
  }

  const validators = {
    date: [
      {
        fn: isNotEmpty,
        errorMessage: 'Add meg az edzés dátumát!',
      },
    ],
    duration: [
      {
        fn: isNotEmpty,
        errorMessage: 'Add meg az edzés időtartamát!',
      },
      {
        fn: isMoreThanNull,
        errorMessage: 'Nem lehet nulla vagy annál kisebb!',
      },
    ],
    distance: [
      {
        fn: isMoreThanNullOrEmpty,
        errorMessage: 'Nem lehet nulla vagy annál kisebb!',
      },
    ],
    note: [
      {
        fn: isLessThan200Char,
        errorMessage: 'Nem lehet több 200 karakternél!',
      },
    ],
  };

  function areExercisesInputsValuesValid() {
    const isExerciseNameExist = [];
    const isNumberNotNullOrNegative = [];

    exercisesInputsRows.forEach((field) => {
      if ((field.weight || field.sets || field.reps) && !field.exerciseName) {
        isExerciseNameExist.push(false);
      } if ((field.sets !== '' && field.sets <= 0)
        || (field.reps !== '' && field.reps <= 0)
        || (field.weight !== '' && field.weight <= 0)) {
        isNumberNotNullOrNegative.push(false);
      } else {
        isExerciseNameExist.push(true);
        isNumberNotNullOrNegative.push(true);
      }
    });
    const areExerciseNamesValid = isExerciseNameExist.every((isFieldValid) => isFieldValid);
    const areNumbersNotNullOrNegative = isNumberNotNullOrNegative.every((isFieldValid) => isFieldValid);
    if (!areExerciseNamesValid) {
      setExercisesErrorMessage('Add meg a gyakorlat/gyakorlatok nevét is!');
      return false;
    } if (!areNumbersNotNullOrNegative) {
      setExercisesErrorMessage('Nem lehet nulla vagy annál kisebb értéket megadni!');
      return false;
    }
    setExercisesErrorMessage('');
    return true;
  }

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

    setFormAlertType('');
    setFromAlertText('');
    if (new Date(formData.date).setHours(0, 0, 0) > new Date().setHours(0, 0, 0) && formData.isDone) {
      setFormAlertType('danger');
      setFromAlertText('Csak korábbi edzés tekinthető elvégzettnek');
    } else {
      let workoutData = {};

      workoutData = {
        sportType: selectedSportType,
        date: formData.date,
        duration: Number(formData.duration),
        durationUnit: formData.durationUnit,
        isDone: formData.isDone,
      };

      if (formData.workoutName) {
        workoutData.workoutName = formData.workoutName;
      }

      if (formData.note) {
        workoutData.note = formData.note;
      }

      if (formData.distance && formData.distanceUnit) {
        workoutData.distance = Number(formData.distance);
        workoutData.distanceUnit = formData.distanceUnit;
      }

      const filteredExercisesInputsRows = exercisesInputsRows.filter((row) => row.exerciseName);
      const exercisesData = [];
      if (filteredExercisesInputsRows.length > 0) {
        filteredExercisesInputsRows.forEach((row) => {
          const exercise = {};
          if (row.weight) {
            exercise.weight = Number(row.weight);
          } if (row.sets) {
            exercise.sets = Number(row.sets);
          } if (row.reps) {
            exercise.reps = Number(row.reps);
          }
          exercise.exerciseName = row.exerciseName;
          exercisesData.push(exercise);
        });
        workoutData.exercises = exercisesData;
      }

      const basicFormisValid = reportFormValidity();
      const exercisesInputsValuesAreValid = areExercisesInputsValuesValid();

      setFromAlertText('');
      setAllFormInputsAreValidated(true);

      if (basicFormisValid && exercisesInputsValuesAreValid) {
        let response;

        try {
          let url;
          let fetchMethod;
          if (selectedWorkoutId) {
            url = `${process.env.REACT_APP_API_BASE_URL}/api/diaries/${selectedWorkoutId}`;
            fetchMethod = 'PATCH';
          } else {
            url = `${process.env.REACT_APP_API_BASE_URL}/api/diaries`;
            fetchMethod = 'POST';
          }
          response = await fetchWithAuthorization(url, {
            method: fetchMethod,
            body: JSON.stringify(workoutData),
            headers: {
              'Content-type': 'application/json',
            },
          });
          if (response?.ok) {
            setWasValidated(false);
            setFormData(basicWorkoutFormValues);

            const uid = generateRandomId();
            setExercisesInputsRows([
              {
                id: uid, exerciseName: '', weight: '', sets: '', reps: '',
              },
            ]);
            setSelectedSportType('');
            setFormAlertType('success');
            setFromAlertText('Edzésed rögzítve az edzésnaplóban!');
            if (loadWorkoutDiary) {
              await loadWorkoutDiary();
              setTimeout(() => {
                hideFormHandler();
              }, 4000);
            }
            setErrorMessages({});
            setAllFormInputsAreValidated(false);
            setTimeout(() => {
              setFormAlertType('');
              setFromAlertText('');
            }, 4000);
          }
        } catch (err) {
          setWasValidated(false);
          setFormAlertType('danger');
          setFromAlertText('Sikertelen mentés.');
          setTimeout(() => {
            setFormAlertType('');
            setFromAlertText('');
          }, 4000);
          setAllFormInputsAreValidated(true);
        }
      }
    }
  }

  function handleSportTypeChange({ target: { value } }) {
    const result = {
      type: '',
      hasPropDistance: false,
      hasPropExercises: false,
    };
    listOfSportTypes.forEach((sport) => {
      if (sport.type === value) {
        result.type = sport.type;
        result.hasPropDistance = sport.hasPropDistance;
        result.hasPropExercises = sport.hasPropExercises;
      }
    });
    setSelectedSportType(result.type);
    setVariableElementsOfForm({ hasPropDistance: result.hasPropDistance, hasPropExercises: result.hasPropExercises });
  }
  return (
    <main className="container mt-3 pb-5">
      <Form
        title={selectedWorkoutId ? 'Edzés módosítása' : 'Edzés hozzáadása'}
        buttonText="Mentés"
        handleSubmit={handleSubmit}
        initalValues={basicWorkoutFormInitialValues}
        validators={validators}
        formName="workoutForm"
        disabled={!selectedSportType}
        showModifyForm={showWorkoutModifyForm}
        hideFormHandler={hideFormHandler}
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
            <InputSelect
              label="Sport típusa:*"
              name="selectedSport"
              handleOnchange={handleSportTypeChange}
              value={selectedSportType}
              className={`input-field ${allFormInputsAreValidated && 'is-valid'}`}
              disabled={selectedWorkoutId}
            >
              <option value="">Válassz...</option>
              {listOfSportTypes && listOfSportTypes.map((sport) => {
                return <option key={sport.id} id={sport.id}>{sport.type}</option>;
              })}
            </InputSelect>
            {serverErrorMessage && <div className="mb-3">{serverErrorMessage}</div>}
            {selectedSportType
              && (
                <>
                  <InputRegular
                    type="text"
                    name="workoutName"
                    className="input-field"
                    handleOnChange={handleOnChange}
                    getValidationClassName={getValidationClassName}
                    value={formData.workoutName}
                    label="Edzés elnevezése:"
                  />

                  <InputRegular
                    type="date"
                    name="date"
                    className="input-field"
                    handleOnChange={handleOnChange}
                    getValidationClassName={getValidationClassName}
                    errorMessages={errorMessages.date}
                    value={formData.date}
                    label="Dátum:*"
                  />
                  <InputRegular
                    type="number"
                    name="duration"
                    className="input-field"
                    handleOnChange={handleOnChange}
                    getValidationClassName={getValidationClassName}
                    errorMessages={errorMessages.duration}
                    value={formData.duration}
                    label="Időtartam:*"
                  >
                    <div className="btn-group" role="group">
                      {units && units['időtartam'] && units['időtartam'].map((unit) => {
                        return (
                          <RadioButton
                            key={unit}
                            unitName="durationUnit"
                            unit={unit}
                            value={formData.durationUnit}
                            handleOnChange={handleOnChange}
                          />
                        );
                      })}
                    </div>
                  </InputRegular>

                  {selectedSportType
                    && (variableElementsOfForm.hasPropDistance)
                    && (
                      <InputRegular
                        type="number"
                        name="distance"
                        className="input-field"
                        handleOnChange={handleOnChange}
                        getValidationClassName={getValidationClassName}
                        errorMessages={errorMessages.distance}
                        value={formData.distance}
                        label="Távolság:"
                      >

                        <div className="RegInputRegular" role="group">
                          {units && units['távolság'] && units['távolság'].map((unit) => {
                            return (
                              <RadioButton
                                key={unit}
                                unitName="distanceUnit"
                                unit={unit}
                                value={formData.distanceUnit}
                                handleOnChange={handleOnChange}
                              />
                            );
                          })}
                        </div>
                      </InputRegular>
                    )}

                  {selectedSportType
                    && (variableElementsOfForm.hasPropExercises)
                    && (
                      <>
                        <div className="form-label mt-5 fw-semibold">Gyakorlatok:</div>
                        <ExercisesInputs
                          exercisesInputsRows={exercisesInputsRows}
                          setExercisesInputsRows={setExercisesInputsRows}
                          generateRandomId={generateRandomId}
                        />
                        {exercisesErrorMessage
                          && <div className="m-3 ms-4 text-danger strengthInvalid">{exercisesErrorMessage}</div>}
                      </>
                    )}

                  <InputTextarea
                    label="Megjegyzés:"
                    name="note"
                    handleOnchange={handleOnChange}
                    value={formData.note}
                    getValidationClassName={getValidationClassName}
                    errorMessages={errorMessages.note}
                    className="input-field"
                  />

                  <div className="fs-5 mt-4 fw-bold">
                    <InputCheckBox
                      label="Megcsináltam"
                      name="isDone"
                      checked={formData.isDone}
                      handleOnChange={handleCheckboxChange}
                      getValidationClassName={getValidationClassName}
                      errorMessages={errorMessages.isDone}
                    />
                  </div>
                </>
              )}
          </>
        )}
      </Form>
    </main>
  );
}
