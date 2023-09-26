import './Home.scss';
import '../components/Header.scss';
import WorkoutForm from '../components/WorkoutForm';
import generateRandomId from '../generateRandomId';

export default function AddNewWorkout() {
  const basicWorkoutFormInitialValues = {
    workoutName: '',
    date: '',
    duration: '',
    distance: '',
    note: '',
    durationUnit: 'perc',
    distanceUnit: 'm',
    isDone: false,
  };

  const uid = generateRandomId();

  const exercisesInputsInitialValues = [
    {
      id: uid, exerciseName: '', weight: '', sets: '', reps: '',
    },
  ];

  const sportTypeValue = '';

  return (
    <WorkoutForm
      basicWorkoutFormValues={basicWorkoutFormInitialValues}
      exercisesInputsValues={exercisesInputsInitialValues}
      sportTypeValue={sportTypeValue}
    />
  );
}
