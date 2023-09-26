import { workoutDiaryService } from './workoutDiary.service';

export const workoutDiaryController = {
  async post(req, res, next) {
    const {
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
    } = req.body;
    const { userId } = req.headers.loggedInUserData;
    try {
      const result = await workoutDiaryService.addWorkout({
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
      });
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  },

  async get(req, res, next) {
    const { userId } = req.headers.loggedInUserData;
    try {
      const result = await workoutDiaryService.getWorkouts({ userId });
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },

  async patchRemove(req, res, next) {
    const { workoutId } = req.body;
    const { userId } = req.headers.loggedInUserData;
    try {
      const result = await workoutDiaryService.removeWorkout({ userId, workoutId });
      return res.status(200).json(result);
    } catch (error) {
      return next(error);
    }
  },

  async patchEdit(req, res, next) {
    const {
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
    } = req.body;
    const { userId } = req.headers.loggedInUserData;
    const { workoutId } = req.params;
    try {
      const result = await workoutDiaryService.editWorkout({
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
      });
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  },
};
