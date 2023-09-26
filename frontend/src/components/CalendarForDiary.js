import { useEffect, useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/hu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleXmark,
} from '@fortawesome/free-solid-svg-icons';
import WorkoutElement from './WorkoutElement';
import 'react-big-calendar/lib/css/react-big-calendar.css';

export default function CalendarForDiary({
  allWorkoutsData, handleClickOnDelete, handleClickOnModify, todayDate, hideFormHandler, showWorkoutModifyForm,
}) {
  const xmark = <FontAwesomeIcon icon={faCircleXmark} className="text-secondary" />;
  const [events, setEvents] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [workoutsForDay, setWorkoutsForDay] = useState({});

  useEffect(() => {
    loadEvents();
    setWorkoutsForDay({});
  }, [allWorkoutsData]);

  function loadEvents() {
    const eventsResult = [];
    Object.keys(allWorkoutsData).forEach((date) => {
      allWorkoutsData[date].workouts.forEach((workout) => {
        const workoutEvent = {
          start: new Date(date).setHours(0, 0, 0),
          end: new Date(date).setHours(0, 0, 0),
          title: `${workout.sportType} ${workout.isDone ? '✔' : '✘'}`,
        };
        eventsResult.push(workoutEvent);
      });
    });
    setEvents(eventsResult);
  }

  const localizer = momentLocalizer(moment);

  function handleClickOnEvent(date) {
    hideFormHandler();
    const eventsForDay = {};
    Object.keys(allWorkoutsData).forEach((key) => {
      if (new Date(key).setHours(0, 0, 0) === new Date(date.start).setHours(0, 0, 0)) {
        eventsForDay[key] = allWorkoutsData[key];
      }
    });
    setShowDetails(true);
    setWorkoutsForDay(eventsForDay);
    window.scrollTo({ top: 60, left: 0, behaviour: 'smooth' });
  }

  function handleClickOnX() {
    setShowDetails(false);
  }

  const messages = {
    previous: 'Előző',
    next: 'Következő',
    today: 'Ma',
  };

  return (
    <div>
      <div className="mb-5">
        {showDetails && !showWorkoutModifyForm

        && (Object.keys(workoutsForDay).length > 0
          && (
            <div>
              <div className="text-end">
                <button
                  onClick={handleClickOnX}
                  type="button"
                  className="btn fs-4"
                  data-testid="close-form-btn"
                >
                  {xmark}
                </button>
              </div>
              {Object.keys(workoutsForDay).map((date) => {
                return (
                  <WorkoutElement
                    key={date}
                    details={workoutsForDay[date].workouts}
                    workoutDate={workoutsForDay[date].date}
                    todayDate={todayDate}
                    handleClickOnDelete={handleClickOnDelete}
                    handleClickOnModify={handleClickOnModify}
                    expanded
                  />
                );
              })}
            </div>
          )

        )}
      </div>

      <Calendar
        localizer={localizer}
        defaultView="month"
        events={events}
        messages={messages}
        culture="hu"
        views={['month']}
        style={{ height: '80vh' }}
        onSelectSlot={(date) => handleClickOnEvent(date)}
        onSelectEvent={(date) => handleClickOnEvent(date)}
        selectable
        showAllEvents
      />
    </div>
  );
}
