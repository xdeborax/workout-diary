import { useState, useEffect } from 'react';
import 'react-tabs/style/react-tabs.css';
import './WorkoutDiary.scss';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarDays,
  faList,
} from '@fortawesome/free-solid-svg-icons';
import WorkoutElement from '../components/WorkoutElement';
import useFetchWithAuthorization from '../useFetchWithAuthorization';
import WorkoutForm from '../components/WorkoutForm';
import getTodayDate from '../getTodayDate';
import AllWorkoutDataInDiary from '../components/AllWorkoutDataInDiary';
import generateRandomId from '../generateRandomId';
import CalendarForDiary from '../components/CalendarForDiary';

export default function WorkoutDiary() {
  const [allWorkoutsData, setAllWorkoutsData] = useState({});
  const [todayDate, setTodayDate] = useState({});
  const [errorMessage, setErrorMessage] = useState('');
  const fetchWithAuthorization = useFetchWithAuthorization();
  const calendarIcon = <FontAwesomeIcon icon={faCalendarDays} />;
  const listIcon = <FontAwesomeIcon icon={faList} />;

  useEffect(() => {
    loadWorkoutDiary();
    loadTodayDate();
  }, []);

  function loadTodayDate() {
    const result = getTodayDate();
    setTodayDate(result);
  }

  async function loadWorkoutDiary() {
    let response;
    try {
      response = await fetchWithAuthorization(`${process.env.REACT_APP_API_BASE_URL}/api/diaries`);

      if (response?.ok) {
        const data = await response.json();
        const result = {};

        if (data.workouts.length > 0) {
          data.workouts.forEach((workout) => {
            const workoutDate = new Date(workout.date);
            const dayNameLowerCase = workoutDate.toLocaleDateString('hu-HU', { weekday: 'long' });
            const workoutDetails = {
              ...workout,
              sportType: workout.sportType.charAt(0).toUpperCase() + workout.sportType.slice(1),
            };

            if (workout.exercises.length > 0 || workout.exercises[0]?.length) {
              workoutDetails.exercises = workout.exercises;
            }

            if (!result[workout.date]) {
              result[workout.date] = {
                date: {
                  fullDate: workoutDate.toISOString().slice(0, 10).replaceAll('-', '.'),
                  day: workoutDate.getDate(),
                  weekDay: workoutDate.getDay(),
                  month: workoutDate.getMonth() + 1,
                  year: workoutDate.getFullYear(),
                  dayName: dayNameLowerCase.charAt(0).toUpperCase() + dayNameLowerCase.slice(1),
                },
                workouts: [workoutDetails],
              };
            } else {
              result[workout.date].workouts.push(workoutDetails);
            }
          });
          setAllWorkoutsData(result);
          setErrorMessage('');
        } else {
          setAllWorkoutsData({});
        }
      }
    } catch (err) {
      setErrorMessage('Sajnáljuk, a kért szolgáltatás jelenleg nem elérhető.');
    }
  }

  const newRowId = generateRandomId();
  const exercisesInputsInitialValues = [
    {
      id: newRowId, exerciseName: '', weight: '', sets: '', reps: '',
    },
  ];
  const regularWorkoutFormInitialValues = {
    workoutName: '',
    date: '',
    duration: '',
    distance: '',
    note: '',
    durationUnit: 'perc',
    distanceUnit: 'm',
    isDone: false,
  };

  const [exercisesInputsValues, setExercisesInputsValues] = useState(exercisesInputsInitialValues);
  const [regularWorkoutFormValues, setRegularWorkoutFormValues] = useState(regularWorkoutFormInitialValues);
  const [sportTypeValue, setSportTypeValue] = useState('');
  const [showWorkoutModifyForm, setShowWorkoutModifyForm] = useState(false);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState('');

  function hideFormHandler() {
    setShowWorkoutModifyForm(false);
  }

  async function handleClickOnDelete(id) {
    hideFormHandler();
    const workoutToDelete = {
      workoutId: id,
    };
    let response;

    try {
      response = await fetchWithAuthorization(`${process.env.REACT_APP_API_BASE_URL}/api/diaries`, {
        method: 'PATCH',
        body: JSON.stringify(workoutToDelete),
        headers: {
          'Content-type': 'application/json',
        },
      });

      if (response?.ok) {
        const updatedData = {};
        Object.keys(allWorkoutsData).forEach((date) => {
          const updatedWorkoutList = allWorkoutsData[date].workouts.filter((workout) => workout.id !== id);
          if (updatedWorkoutList.length > 0) {
            updatedData[date] = {};
            updatedData[date].date = allWorkoutsData[date].date;
            updatedData[date].workouts = updatedWorkoutList;
          }
        });
        setAllWorkoutsData(updatedData);
      }
    } catch (err) {
      setErrorMessage('A törlés sikertelen!');
    }
  }

  function handleClickOnModify(detail) {
    setShowWorkoutModifyForm(false);
    setRegularWorkoutFormValues(regularWorkoutFormInitialValues);
    setSportTypeValue('');
    setExercisesInputsValues(exercisesInputsInitialValues);
    const regularWorkoutDataToModify = {
      workoutName: detail.workoutName,
      date: new Date(detail.date).toISOString().split('T')[0],
      duration: detail.duration,
      distance: detail.distance ? detail.distance : '',
      note: detail.note ? detail.note : '',
      durationUnit: detail.durationUnit,
      distanceUnit: detail.distanceUnit ? detail.distanceUnit : 'm',
      isDone: detail.isDone,
    };
    setShowWorkoutModifyForm(true);
    setRegularWorkoutFormValues(regularWorkoutDataToModify);
    setSportTypeValue(detail.sportType);
    setSelectedWorkoutId(detail.id);
    if (detail.exercises) {
      setExercisesInputsValues(detail.exercises);
    }
    window.scrollTo({ top: 0, left: 0, behaviour: 'smooth' });
  }

  const [showCalendarOrList, setShowCalendarOrList] = useState('calendar');

  function handleClickOnCalendarButton() {
    setShowCalendarOrList('calendar');
    hideFormHandler();
  }

  function handleClickOnListButton() {
    setShowCalendarOrList('list');
    hideFormHandler();
  }

  return (
    <div className="container mt-3 pb-5">
      <div className="dataFrame col-sm-12 pb-3 col-xl-10 p-1 p-sm-3 p-md-5">
        <h1 className="pageTitle m-1 py-3">Edzésnapló</h1>
        <Tabs>
          <TabList>
            <Tab className="tabTitle px-4 mt-4">Mai edzés</Tab>
            <Tab className="tabTitle px-4 mt-4">E heti edzések</Tab>
            <Tab className="tabTitle px-4 mt-4">Összes edzés</Tab>
          </TabList>
          {showWorkoutModifyForm
        && (
          <div>
            <WorkoutForm
              basicWorkoutFormValues={regularWorkoutFormValues}
              exercisesInputsValues={exercisesInputsValues}
              showWorkoutModifyForm={showWorkoutModifyForm}
              hideFormHandler={hideFormHandler}
              sportTypeValue={sportTypeValue}
              selectedWorkoutId={selectedWorkoutId}
              loadWorkoutDiary={loadWorkoutDiary}
              filterWorkoutsData={allWorkoutsData}
            />
          </div>
        )}
          <TabPanel>
            <div>
              {allWorkoutsData && Object.keys(allWorkoutsData).map((date) => {
                if (allWorkoutsData[date].date.fullDate === todayDate.fullDate) {
                  return (
                    <WorkoutElement
                      key={date}
                      details={allWorkoutsData[date].workouts}
                      workoutDate={allWorkoutsData[date].date}
                      todayDate={todayDate}
                      handleClickOnDelete={handleClickOnDelete}
                      handleClickOnModify={handleClickOnModify}
                      expanded
                    />
                  );
                }
                return null;
              })}
            </div>
            {(allWorkoutsData && !errorMessage && !(Object.keys(allWorkoutsData)
              .find((date) => allWorkoutsData[date].date.fullDate === todayDate.fullDate)))
              && (<div className="fs-6 my-3">Nem található hozzáadott edzés</div>)}
          </TabPanel>
          <TabPanel>
            <div>
              {allWorkoutsData && Object.keys(allWorkoutsData).map((date) => {
                if (todayDate.lastDayOfCurrentWeek > new Date(date)
                  && new Date(date) >= todayDate.firstDayOfCurrentWeek) {
                  return (
                    <WorkoutElement
                      key={date}
                      details={allWorkoutsData[date].workouts}
                      workoutDate={allWorkoutsData[date].date}
                      todayDate={todayDate}
                      handleClickOnDelete={handleClickOnDelete}
                      handleClickOnModify={handleClickOnModify}
                    />
                  );
                }
                return null;
              })}
            </div>
            {(allWorkoutsData && !errorMessage && !(Object.keys(allWorkoutsData)
              .find((date) => todayDate.lastDayOfCurrentWeek > new Date(date)
                && new Date(date) >= todayDate.firstDayOfCurrentWeek)))
              && (<div className="fs-6 my-3">Nem található hozzáadott edzés</div>)}
          </TabPanel>
          <TabPanel>
            <div className="text-end fs-3">
              <input
                type="radio"
                className="btn-check"
                name="listOrCalendarRadio"
                data-testid="calendar-radio"
                id="calendarRadio"
                autoComplete="off"
                checked={showCalendarOrList === 'calendar'}
                onChange={handleClickOnCalendarButton}
              />
              <label className="btn btn-outline-secondary calendarRadioButton fs-5" htmlFor="calendarRadio">
                <i>{calendarIcon}</i>
              </label>
              <input
                type="radio"
                className="btn-check"
                name="listOrCalendarRadio"
                data-testid="list-radio"
                id="listRadio"
                autoComplete="off"
                onChange={handleClickOnListButton}
                checked={showCalendarOrList === 'list'}
              />
              <label
                className="btn btn-outline-secondary listRadioButton
               fs-5"
                htmlFor="listRadio"
              >
                <i>{listIcon}</i>
              </label>
            </div>
            {showCalendarOrList === 'list'
              && (
                <>
                  <AllWorkoutDataInDiary
                    allWorkoutsData={allWorkoutsData}
                    handleClickOnDelete={handleClickOnDelete}
                    handleClickOnModify={handleClickOnModify}
                    todayDate={todayDate}
                    hideFormHandler={hideFormHandler}
                  />
                  {!errorMessage && Object.keys(allWorkoutsData).length === 0
                    && (
                      <div className="fs-6 my-3">
                        Nem található hozzáadott edzés
                      </div>
                    )}
                </>
              )}
            {showCalendarOrList === 'calendar'
              && (
                <>
                  {!errorMessage && Object.keys(allWorkoutsData).length === 0
                    && (
                      <div className="fs-6 my-3">
                        Nem található hozzáadott edzés
                      </div>
                    )}
                  <CalendarForDiary
                    allWorkoutsData={allWorkoutsData}
                    todayDate={todayDate}
                    handleClickOnDelete={handleClickOnDelete}
                    handleClickOnModify={handleClickOnModify}
                    hideFormHandler={hideFormHandler}
                    showWorkoutModifyForm={showWorkoutModifyForm}
                  />
                </>
              )}
          </TabPanel>
        </Tabs>
        {errorMessage
          && (
            <div className="my-3 pb-1">
              {errorMessage}
            </div>
          )}
      </div>
    </div>
  );
}
