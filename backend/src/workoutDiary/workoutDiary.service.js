import mongoose from 'mongoose';
import { WorkoutDiaryModel } from './workoutDiary.model';

export const workoutDiaryService = {
  async addWorkout({
    userId,
    sportType,
    workoutName,
    date,
    duration,
    distance,
    note,
    durationUnit,
    distanceUnit,
    isDone,
    exercises,
  }) {
    if (!userId) {
      const error = new Error('User ID is required.');
      error.status = 401;
      throw error;
    }
    if (!sportType && !date && !duration && !durationUnit) {
      const error = new Error('Addition of sport type, date, duration and duration unit is required.');
      error.status = 400;
      throw error;
    } else if (!sportType) {
      const error = new Error('Addition of sport type is required.');
      error.status = 400;
      throw error;
    } else if (!date) {
      const error = new Error('Addition of date is required.');
      error.status = 400;
      throw error;
    } else if (!duration && duration !== 0) {
      const error = new Error('Addition of duration is required.');
      error.status = 400;
      throw error;
    } else if (duration <= 0) {
      const error = new Error('Duration can\'t be 0 or less than 0.');
      error.status = 400;
      throw error;
    } else if (!durationUnit) {
      const error = new Error('Addition of duration unit is required.');
      error.status = 400;
      throw error;
    } else if (!distance && distance !== 0 && distanceUnit) {
      const error = new Error('Addition of distance unit without distance is not possible.');
      error.status = 400;
      throw error;
    } else if (distance && !distanceUnit) {
      const error = new Error('Addition of distance without distance unit is not possible.');
      error.status = 400;
      throw error;
    } else if (distance <= 0) {
      const error = new Error('Distance can\'t be 0 or less than 0.');
      error.status = 400;
      throw error;
    } else if (note && note.length > 200) {
      const error = new Error('Note can\'t be more than 200 character.');
      error.status = 400;
      throw error;
    } else if (exercises) {
      exercises.forEach((exercise) => {
        if (((exercise.weight || exercise.sets || exercise.reps) && !exercise.exerciseName)) {
          const error = new Error('Exercise can\'t be added without exercise name');
          error.status = 400;
          throw error;
        } else if ((exercise.sets <= 0)
          || (exercise.reps <= 0)
          || (exercise.weight <= 0)) {
          const error = new Error('Exercise weight, sets and reps can\'t be 0 or less than 0');
          error.status = 400;
          throw error;
        }
      });
    }

    const result = {};

    const workoutToAdd = {
      sportType,
      date,
      duration,
      durationUnit,
      isDone,
      workoutName,
      distance,
      distanceUnit,
      note,
      exercises,
    };

    Object.keys(workoutToAdd).forEach((k) => workoutToAdd[k] == null && delete workoutToAdd[k]);

    const workoutDiary = await WorkoutDiaryModel.findOneAndUpdate(
      { user: userId },
      { $push: { workouts: workoutToAdd } },
      { upsert: true, new: true },
    );

    result.id = workoutDiary._id;
    result.workouts = workoutDiary.workouts.map((workout) => {
      const workoutResult = {
        id: workout._id,
        sportType: workout.sportType,
        date: workout.date,
        duration: workout.duration,
        durationUnit: workout.durationUnit,
        isDone: workout.isDone,
        workoutName: workout.workoutName,
        distance: workout.distance,
        distanceUnit: workout.distanceUnit,
        note: workout.note,
        exercises: workout.exercises,
      };

      Object.keys(workoutResult).forEach((k) => workoutResult[k] == null
        && delete workoutResult[k]);

      if (workout.exercises?.length > 0) {
        const exercisesData = [];
        workout.exercises.forEach((row) => {
          const exercise = {};
          if (row.weight) {
            exercise.weight = row.weight;
          } if (row.sets) {
            exercise.sets = row.sets;
          } if (row.reps) {
            exercise.reps = row.reps;
          }
          exercise.exerciseName = row.exerciseName;
          exercise.id = row._id;
          exercisesData.push(exercise);
        });
        workoutResult.exercises = exercisesData;
      }
      return workoutResult;
    });
    return result;
  },

  async getWorkouts({ userId }) {
    if (!userId) {
      const error = new Error('User ID is required.');
      error.status = 401;
      throw error;
    }

    const result = {};
    let workouts = [];
    const workoutList = await WorkoutDiaryModel.findOne({ user: userId });

    if (workoutList) {
      const sortedWorkoutListByDate = workoutList.workouts.sort((a, b) => b.date - a.date);
      workouts = sortedWorkoutListByDate.map((workout) => {
        const workoutResult = {
          id: workout._id,
          sportType: workout.sportType,
          date: workout.date,
          duration: workout.duration,
          durationUnit: workout.durationUnit,
          isDone: workout.isDone,
          workoutName: workout.workoutName,
          distance: workout.distance,
          distanceUnit: workout.distanceUnit,
          note: workout.note,
          exercises: workout.exercises,
        };

        Object.keys(workoutResult).forEach((k) => workoutResult[k] == null
          && delete workoutResult[k]);

        if (workout.exercises?.length > 0) {
          const exercisesData = [];
          workout.exercises.forEach((row) => {
            const exercise = {};
            if (row.weight) {
              exercise.weight = row.weight;
            } if (row.sets) {
              exercise.sets = row.sets;
            } if (row.reps) {
              exercise.reps = row.reps;
            }
            exercise.exerciseName = row.exerciseName;
            exercise.id = row._id;
            exercisesData.push(exercise);
          });
          workoutResult.exercises = exercisesData;
        }
        return workoutResult;
      });
      result.id = workoutList._id;
    }
    result.workouts = workouts;
    return result;
  },

  async removeWorkout({ userId, workoutId }) {
    if (!userId) {
      const error = new Error('User ID is required.');
      error.status = 401;
      throw error;
    }
    if (!workoutId) {
      const error = new Error('WorkoutId is required.');
      error.status = 400;
      throw error;
    }
    if (!mongoose.isValidObjectId(workoutId)) {
      const error = new Error('Workout doesn\'t exist.');
      error.status = 400;
      throw error;
    }

    const result = {};
    let workouts = [];

    const workoutList = await WorkoutDiaryModel.findOneAndUpdate(
      { user: userId },
      { $pull: { workouts: { _id: workoutId } } },
      { new: true },
    );
    if (workoutList) {
      const sortedWorkoutListByDate = workoutList.workouts.sort((a, b) => b.date - a.date);
      workouts = sortedWorkoutListByDate.map((workout) => {
        const workoutResult = {
          id: workout._id,
          sportType: workout.sportType,
          date: workout.date,
          duration: workout.duration,
          durationUnit: workout.durationUnit,
          isDone: workout.isDone,
          workoutName: workout.workoutName,
          distance: workout.distance,
          distanceUnit: workout.distanceUnit,
          note: workout.note,
          exercises: workout.exercises,
        };

        Object.keys(workoutResult).forEach((k) => workoutResult[k] == null
          && delete workoutResult[k]);

        if (workout.exercises?.length > 0) {
          const exercisesData = [];
          workout.exercises.forEach((row) => {
            const exercise = {};
            if (row.weight) {
              exercise.weight = row.weight;
            } if (row.sets) {
              exercise.sets = row.sets;
            } if (row.reps) {
              exercise.reps = row.reps;
            }
            exercise.exerciseName = row.exerciseName;
            exercise.id = row._id;
            exercisesData.push(exercise);
          });
          workoutResult.exercises = exercisesData;
        }
        return workoutResult;
      });
      result.id = workoutList._id;
    }
    result.workouts = workouts;
    return result;
  },

  async editWorkout({
    userId,
    sportType,
    workoutName,
    date,
    duration,
    distance,
    note,
    durationUnit,
    distanceUnit,
    exercises,
    isDone,
    workoutId,
  }) {
    const result = {};
    if (!userId) {
      const error = new Error('User ID is required.');
      error.status = 401;
      throw error;
    }
    if (!workoutId) {
      const error = new Error('WorkoutId is required.');
      error.status = 400;
      throw error;
    }
    if (!mongoose.isValidObjectId(workoutId)) {
      const error = new Error('Workout doesn\'t exist.');
      error.status = 400;
      throw error;
    }
    if (!sportType && !date && !duration && !durationUnit) {
      const error = new Error('Addition of sport type, date, duration and duration unit is required.');
      error.status = 400;
      throw error;
    } else if (!sportType) {
      const error = new Error('Addition of workout type is required.');
      error.status = 400;
      throw error;
    } else if (!date) {
      const error = new Error('Addition of date is required.');
      error.status = 400;
      throw error;
    } else if (!duration && duration !== 0) {
      const error = new Error('Addition of duration is required.');
      error.status = 400;
      throw error;
    } else if (duration <= 0) {
      const error = new Error('Duration can\'t be 0 or less than 0.');
      error.status = 400;
      throw error;
    } else if (!durationUnit) {
      const error = new Error('Addition of duration unit is required.');
      error.status = 400;
      throw error;
    } else if (!distance && distance !== 0 && distanceUnit) {
      const error = new Error('Addition of distance unit without distance is not possible.');
      error.status = 400;
      throw error;
    } else if (distance && !distanceUnit) {
      const error = new Error('Addition of distance without distance unit is not possible.');
      error.status = 400;
      throw error;
    } else if (distance && distance <= 0) {
      const error = new Error('Distance can\'t be 0 or less than 0.');
      error.status = 400;
      throw error;
    } else if (note && note.length > 200) {
      const error = new Error('Note can\'t be more than 200 character.');
      error.status = 400;
      throw error;
    } else if (exercises) {
      exercises.forEach((exercise) => {
        if (((exercise.weight || exercise.sets || exercise.reps) && !exercise.exerciseName)) {
          const error = new Error('Exercise can\'t be added without exercise name');
          error.status = 400;
          throw error;
        } else if ((exercise.sets && exercise.sets <= 0)
          || (exercise.reps && exercise.reps <= 0)
          || (exercise.weight && exercise.weight <= 0)) {
          const error = new Error('Exercise weight, sets and reps can\'t be 0 or less than 0');
          error.status = 400;
          throw error;
        }
      });
    }

    const workoutToEdit = {
      _id: workoutId,
      sportType,
      workoutName,
      date,
      duration,
      durationUnit,
      isDone,
      distance,
      distanceUnit,
      note,
      exercises,
    };

    Object.keys(workoutToEdit).forEach((k) => workoutToEdit[k] == null
      && delete workoutToEdit[k]);

    await WorkoutDiaryModel.findOneAndUpdate(
      { user: userId },
      { $pull: { workouts: { _id: workoutId } } },
      { new: true },
    );
    const workoutDiary = await WorkoutDiaryModel.findOneAndUpdate(
      { user: userId },
      { $push: { workouts: workoutToEdit } },
      { new: true },
    );

    result.id = workoutDiary._id;
    result.workouts = workoutDiary.workouts.map((workout) => {
      const workoutResult = {
        id: workout._id,
        sportType: workout.sportType,
        date: workout.date,
        duration: workout.duration,
        durationUnit: workout.durationUnit,
        isDone: workout.isDone,
        workoutName: workout.workoutName,
        distance: workout.distance,
        distanceUnit: workout.distanceUnit,
        note: workout.note,
        exercises: workout.exercises,
      };

      Object.keys(workoutResult).forEach((k) => workoutResult[k] == null
        && delete workoutResult[k]);

      if (workout.exercises?.length > 0) {
        const exercisesData = [];
        workout.exercises.forEach((row) => {
          const exercise = {};
          if (row.weight) {
            exercise.weight = row.weight;
          } if (row.sets) {
            exercise.sets = row.sets;
          } if (row.reps) {
            exercise.reps = row.reps;
          }
          exercise.exerciseName = row.exerciseName;
          exercise.id = row._id;
          exercisesData.push(exercise);
        });
        workoutResult.exercises = exercisesData;
      }
      return workoutResult;
    });
    return result;
  },
};
