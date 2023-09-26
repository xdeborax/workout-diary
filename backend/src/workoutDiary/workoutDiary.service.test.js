import { workoutDiaryService } from './workoutDiary.service';
import { WorkoutDiaryModel } from './workoutDiary.model';

describe('workoutDiaryService', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  const firstWorkoutToAdd = {
    sportType: 'Futás',
    workoutName: 'tempó futás',
    date: '2023-03-19',
    duration: 1,
    distance: 7,
    note: 'jó volt a sebesség',
    durationUnit: 'óra',
    distanceUnit: 'km',
    isDone: true,
  };

  const secondWorkoutToAdd = {
    sportType: 'Erősítő edzés',
    workoutName: 'láb nap',
    date: '2023-03-24',
    duration: 1,
    note: 'fejlődés az ismétlés számokkal',
    durationUnit: 'óra',
    exercises: [
      {
        exerciseName: 'guggolás', weight: 30, sets: 4, reps: 12,
      },
      {
        exerciseName: 'kitörés', weight: 10, sets: 4, reps: 20,
      },
      {
        exerciseName: 'lábtolás', weight: 30, sets: 4, reps: 13,
      },
    ],
    isDone: true,
  };

  const userId = '6408d521bd84316b485e1d6c';

  describe('addWorkout', () => {
    test('should throw error if there is no userId', async () => {
      await expect(
        workoutDiaryService.addWorkout({ userId: null, ...firstWorkoutToAdd }),
      ).rejects.toThrow();
    });

    test('should throw error if the user doesn\'t exist', async () => {
      await expect(
        workoutDiaryService.addWorkout({ userId: '123', ...firstWorkoutToAdd }),
      ).rejects.toThrow();
    });

    test('Should throw error if the sport type, date, duration and duration unit are not provided', async () => {
      await expect(
        workoutDiaryService.addWorkout({
          userId,
          ...firstWorkoutToAdd,
          sportType: null,
          date: null,
          duration: null,
          durationUnit: null,
        }),
      ).rejects.toThrow();
    });

    test('Should throw error if sport type is not provided', async () => {
      await expect(
        workoutDiaryService.addWorkout({ userId, ...firstWorkoutToAdd, sportType: null }),
      ).rejects.toThrow();
    });

    test('Should throw error if date is not provided', async () => {
      await expect(
        workoutDiaryService.addWorkout({ userId, ...firstWorkoutToAdd, date: null }),
      ).rejects.toThrow();
    });

    test('Should throw error if duration is not provided', async () => {
      await expect(
        workoutDiaryService.addWorkout({ userId, ...firstWorkoutToAdd, duration: null }),
      ).rejects.toThrow();
    });

    test('Should throw error if duration is 0', async () => {
      await expect(
        workoutDiaryService.addWorkout({ userId, ...firstWorkoutToAdd, duration: 0 }),
      ).rejects.toThrow();
    });

    test('Should throw error if duration is less than 0', async () => {
      await expect(
        workoutDiaryService.addWorkout({ userId, ...firstWorkoutToAdd, duration: -1 }),
      ).rejects.toThrow();
    });

    test('Should throw error if duration unit is not provided', async () => {
      await expect(
        workoutDiaryService.addWorkout({ userId, ...firstWorkoutToAdd, durationUnit: null }),
      ).rejects.toThrow();
    });

    test('Should throw error if distance unit is added without distance', async () => {
      await expect(
        workoutDiaryService.addWorkout({ userId, ...firstWorkoutToAdd, distance: null }),
      ).rejects.toThrow();
    });

    test('Should throw error if distance is added without distance  unit', async () => {
      await expect(
        workoutDiaryService.addWorkout({ userId, ...firstWorkoutToAdd, distanceUnit: null }),
      ).rejects.toThrow();
    });

    test('Should throw error if distance is 0', async () => {
      await expect(
        workoutDiaryService.addWorkout({ userId, ...firstWorkoutToAdd, distance: 0 }),
      ).rejects.toThrow();
    });

    test('Should throw error if distance is less than 0', async () => {
      await expect(
        workoutDiaryService.addWorkout({ userId, ...firstWorkoutToAdd, distance: -1 }),
      ).rejects.toThrow();
    });

    test('Should throw error if note is more than 200 character', async () => {
      await expect(
        workoutDiaryService.addWorkout(
          {
            userId,
            ...firstWorkoutToAdd,
            note: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
          },
        ),
      ).rejects.toThrow();
    });

    test('Should throw error if an exercise is added without exercise name', async () => {
      await expect(
        workoutDiaryService.addWorkout({
          userId,
          ...secondWorkoutToAdd,
          exercises: [
            {
              exerciseName: '', weight: 30, sets: 4, reps: 12,
            },
            {
              exerciseName: 'kitörés', weight: 10, sets: 4, reps: 20,
            },
            {
              exerciseName: 'lábtolás', weight: 30, sets: 4, reps: 13,
            },
          ],
        }),
      ).rejects.toThrow();
    });

    test('Should throw error if an exercise is added with weight, that is 0 or less than 0', async () => {
      await expect(
        workoutDiaryService.addWorkout({
          userId,
          ...secondWorkoutToAdd,
          exercises: [
            {
              exerciseName: 'guggolás', weight: -1, sets: 4, reps: 12,
            },
            {
              exerciseName: 'kitörés', weight: 10, sets: 4, reps: 20,
            },
            {
              exerciseName: 'lábtolás', weight: 30, sets: 4, reps: 13,
            },
          ],
        }),
      ).rejects.toThrow();
    });

    test('Should throw error if an exercise is added with sets, that is 0 or less than 0', async () => {
      await expect(
        workoutDiaryService.addWorkout({
          userId,
          ...secondWorkoutToAdd,
          exercises: [
            {
              exerciseName: 'guggolás', weight: 30, sets: 0, reps: 12,
            },
            {
              exerciseName: 'kitörés', weight: 10, sets: 4, reps: 20,
            },
            {
              exerciseName: 'lábtolás', weight: 30, sets: 4, reps: 13,
            },
          ],
        }),
      ).rejects.toThrow();
    });

    test('Should throw error if an exercise is added with reps, that is 0 or less than 0', async () => {
      await expect(
        workoutDiaryService.addWorkout({
          userId,
          ...secondWorkoutToAdd,
          exercises: [
            {
              exerciseName: 'guggolás', weight: 30, sets: 4, reps: -12,
            },
            {
              exerciseName: 'kitörés', weight: 10, sets: 4, reps: 20,
            },
            {
              exerciseName: 'lábtolás', weight: 30, sets: 4, reps: 13,
            },
          ],
        }),
      ).rejects.toThrow();
    });

    test('Add workout with valid data should return a new workout diary with the currently added workout in it', async () => {
      jest.spyOn(WorkoutDiaryModel, 'findOneAndUpdate').mockResolvedValue({
        user: '6408d521bd84316b485e1d6c',
        workouts: [
          {
            sportType: 'Futás',
            workoutName: 'tempó futás',
            date: '2023-03-19',
            duration: 1,
            distance: 7,
            note: 'jó volt a sebesség',
            durationUnit: 'óra',
            distanceUnit: 'km',
            isDone: true,
            _id: '6411cd7e5f9979277960935a',
          },
        ],
        _id: '6411cd7e5f99792779609359',
        __v: 0,
      });

      const result = await workoutDiaryService.addWorkout({ userId, ...firstWorkoutToAdd });

      await expect(result.id).toBe('6411cd7e5f99792779609359');
      await expect(result.workouts).toStrictEqual([
        {
          sportType: 'Futás',
          workoutName: 'tempó futás',
          date: '2023-03-19',
          duration: 1,
          distance: 7,
          note: 'jó volt a sebesség',
          durationUnit: 'óra',
          distanceUnit: 'km',
          isDone: true,
          id: '6411cd7e5f9979277960935a',
        },
      ]);
    });

    test('Add workout with valid data should return the workout diary with all the added workout in it', async () => {
      jest.spyOn(WorkoutDiaryModel, 'findOneAndUpdate').mockResolvedValue({
        user: '6408d521bd84316b485e1d6c',
        workouts: [
          {
            sportType: 'Erősítő edzés',
            workoutName: 'láb nap',
            date: '2023-03-24',
            duration: 1,
            note: 'fejlődés az ismétlés számokkal',
            durationUnit: 'óra',
            exercises: [
              {
                exerciseName: 'guggolás', weight: 30, sets: 4, reps: 12, _id: '64304b13228c02dd3c811919',
              },
              {
                exerciseName: 'kitörés', weight: 10, sets: 4, reps: 20, _id: '64304b13228c02dd3c811920',
              },
              {
                exerciseName: 'lábtolás', weight: 30, sets: 4, reps: 13, _id: '64304b13228c02dd3c811921',
              },
            ],
            isDone: true,
            _id: '6411d1ea892d6740e3d693af',
          },
          {
            sportType: 'Futás',
            workoutName: 'tempó futás',
            date: '2023-03-19',
            duration: 1,
            distance: 7,
            note: 'jó volt a sebesség',
            durationUnit: 'óra',
            distanceUnit: 'km',
            isDone: true,
            _id: '6411cd7e5f9979277960935a',
          },
        ],
        _id: '6411cd7e5f99792779609359',
        __v: 0,
      });

      const result = await workoutDiaryService.addWorkout({ userId, ...secondWorkoutToAdd });

      await expect(result.id).toBe('6411cd7e5f99792779609359');
      await expect(result.workouts).toStrictEqual([
        {
          sportType: 'Erősítő edzés',
          workoutName: 'láb nap',
          date: '2023-03-24',
          duration: 1,
          note: 'fejlődés az ismétlés számokkal',
          durationUnit: 'óra',
          exercises: [
            {
              exerciseName: 'guggolás', weight: 30, sets: 4, reps: 12, id: '64304b13228c02dd3c811919',
            },
            {
              exerciseName: 'kitörés', weight: 10, sets: 4, reps: 20, id: '64304b13228c02dd3c811920',
            },
            {
              exerciseName: 'lábtolás', weight: 30, sets: 4, reps: 13, id: '64304b13228c02dd3c811921',
            },
          ],
          isDone: true,
          id: '6411d1ea892d6740e3d693af',
        },
        {
          sportType: 'Futás',
          workoutName: 'tempó futás',
          date: '2023-03-19',
          duration: 1,
          distance: 7,
          note: 'jó volt a sebesség',
          durationUnit: 'óra',
          distanceUnit: 'km',
          isDone: true,
          id: '6411cd7e5f9979277960935a',
        },
      ]);
    });
  });

  describe('getWorkouts', () => {
    test('should throw error if there is no userId', async () => {
      await expect(
        workoutDiaryService.getWorkouts({ userId: null }),
      ).rejects.toThrow();
    });

    test('should throw error if the user doesn\'t exist', async () => {
      await expect(
        workoutDiaryService.getWorkouts({ userId: '123' }),
      ).rejects.toThrow();
    });

    test('should result the workout diary, if the user has added workouts', async () => {
      jest.spyOn(WorkoutDiaryModel, 'findOne').mockResolvedValueOnce({
        workouts: [
          {
            sportType: 'Futás',
            workoutName: 'tempó futás',
            date: '2023-03-19',
            duration: 1,
            distance: 7,
            note: 'jó volt a sebesség',
            durationUnit: 'óra',
            distanceUnit: 'km',
            isDone: true,
            _id: '6411cd7e5f9979277960935a',
          },
          {
            sportType: 'Erősítő edzés',
            workoutName: 'láb nap',
            date: '2023-03-24',
            duration: 1,
            note: 'fejlődés az ismétlés számokkal',
            durationUnit: 'óra',
            exercises: [
              {
                exerciseName: 'guggolás', weight: 30, sets: 4, reps: 12, _id: '64304b13228c02dd3c811919',
              },
              {
                exerciseName: 'kitörés', weight: 10, sets: 4, reps: 20, _id: '64304b13228c02dd3c811920',
              },
              {
                exerciseName: 'lábtolás', weight: 30, sets: 4, reps: 13, _id: '64304b13228c02dd3c811921',
              },
            ],
            isDone: true,
            _id: '6411d1ea892d6740e3d693af',
          },
        ],
        _id: '6411cd7e5f99792779609359',
        __v: 0,
      });

      const result = await workoutDiaryService.getWorkouts({ userId });
      await expect(result.id).toBe('6411cd7e5f99792779609359');
      await expect(result.workouts).toStrictEqual([
        {
          sportType: 'Futás',
          workoutName: 'tempó futás',
          date: '2023-03-19',
          duration: 1,
          distance: 7,
          note: 'jó volt a sebesség',
          durationUnit: 'óra',
          distanceUnit: 'km',
          isDone: true,
          id: '6411cd7e5f9979277960935a',
        },
        {
          sportType: 'Erősítő edzés',
          workoutName: 'láb nap',
          date: '2023-03-24',
          duration: 1,
          note: 'fejlődés az ismétlés számokkal',
          durationUnit: 'óra',
          exercises: [
            {
              exerciseName: 'guggolás', weight: 30, sets: 4, reps: 12, id: '64304b13228c02dd3c811919',
            },
            {
              exerciseName: 'kitörés', weight: 10, sets: 4, reps: 20, id: '64304b13228c02dd3c811920',
            },
            {
              exerciseName: 'lábtolás', weight: 30, sets: 4, reps: 13, id: '64304b13228c02dd3c811921',
            },
          ],
          isDone: true,
          id: '6411d1ea892d6740e3d693af',
        },
      ]);
    });

    test('should result an empty array, if the user hasn\'t get added workouts', async () => {
      jest.spyOn(WorkoutDiaryModel, 'findOne').mockResolvedValueOnce(null);

      const result = await workoutDiaryService.getWorkouts({ userId });

      await expect(result.workouts).toStrictEqual([]);
    });
  });

  describe('removeWorkout', () => {
    const workoutId = '6411cd7e5f9979277960935a';

    test('should throw error if there is no userId', async () => {
      await expect(
        workoutDiaryService.removeWorkout({ userId: null, workoutId }),
      ).rejects.toThrow();
    });

    test('should throw error if the user doesn\'t exist', async () => {
      await expect(
        workoutDiaryService.removeWorkout({ userId: '123', workoutId }),
      ).rejects.toThrow();
    });

    test('should throw error if the workout id format is not valid', async () => {
      await expect(
        workoutDiaryService.removeWorkout({ userId, workoutId: '123' }),
      ).rejects.toThrow();
    });

    test('should result the workout diary without the selected workout', async () => {
      jest.spyOn(WorkoutDiaryModel, 'findOneAndUpdate').mockResolvedValueOnce({
        workouts: [
          {
            sportType: 'Erősítő edzés',
            workoutName: 'láb nap',
            date: '2023-03-24',
            duration: 1,
            note: 'fejlődés az ismétlés számokkal',
            durationUnit: 'óra',
            exercises: [
              {
                exerciseName: 'guggolás', weight: 30, sets: 4, reps: 12, _id: '64304b13228c02dd3c811919',
              },
              {
                exerciseName: 'kitörés', weight: 10, sets: 4, reps: 20, _id: '64304b13228c02dd3c811920',
              },
              {
                exerciseName: 'lábtolás', weight: 30, sets: 4, reps: 13, _id: '64304b13228c02dd3c811921',
              },
            ],
            isDone: true,
            _id: '6411d1ea892d6740e3d693af',
          },
        ],
        _id: '6411cd7e5f99792779609359',
        __v: 0,
      });

      const result = await workoutDiaryService.removeWorkout({ userId, workoutId });

      await expect(result.id).toStrictEqual('6411cd7e5f99792779609359');
      await expect(result.workouts).toStrictEqual([
        {
          sportType: 'Erősítő edzés',
          workoutName: 'láb nap',
          date: '2023-03-24',
          duration: 1,
          note: 'fejlődés az ismétlés számokkal',
          durationUnit: 'óra',
          exercises: [
            {
              exerciseName: 'guggolás', weight: 30, sets: 4, reps: 12, id: '64304b13228c02dd3c811919',
            },
            {
              exerciseName: 'kitörés', weight: 10, sets: 4, reps: 20, id: '64304b13228c02dd3c811920',
            },
            {
              exerciseName: 'lábtolás', weight: 30, sets: 4, reps: 13, id: '64304b13228c02dd3c811921',
            },
          ],
          isDone: true,
          id: '6411d1ea892d6740e3d693af',
        },
      ]);
    });
  });

  describe('editWorkout', () => {
    const workoutId = '6411cd7e5f9979277960935a';

    test('should throw error if there is no userId', async () => {
      await expect(
        workoutDiaryService.editWorkout({ userId: null, workoutId }),
      ).rejects.toThrow();
    });

    test('should throw error if the user doesn\'t exist', async () => {
      await expect(
        workoutDiaryService.editWorkout({ userId: '123', workoutId }),
      ).rejects.toThrow();
    });

    test('should throw error if the workout id format is not valid', async () => {
      await expect(
        workoutDiaryService.editWorkout({ userId, workoutId: '123' }),
      ).rejects.toThrow();
    });

    test('should result the workout diary with all the workouts in it included the edited one', async () => {
      const firstWorkoutToEdit = {
        sportType: 'Futás2',
        workoutName: 'tempó futás',
        date: '2023-03-19',
        duration: 1,
        distance: 7,
        note: 'jó volt a sebesség',
        durationUnit: 'óra',
        distanceUnit: 'km',
        isDone: true,
      };

      jest.spyOn(WorkoutDiaryModel, 'findOneAndUpdate').mockResolvedValueOnce({
        workouts: [
          {
            sportType: 'Erősítő edzés',
            workoutName: 'láb nap',
            date: '2023-03-24',
            duration: 1,
            note: 'fejlődés az ismétlés számokkal',
            durationUnit: 'óra',
            exercises: [
              {
                exerciseName: 'guggolás', weight: 30, sets: 4, reps: 12, _id: '64304b13228c02dd3c811919',
              },
              {
                exerciseName: 'kitörés', weight: 10, sets: 4, reps: 20, _id: '64304b13228c02dd3c811920',
              },
              {
                exerciseName: 'lábtolás', weight: 30, sets: 4, reps: 13, _id: '64304b13228c02dd3c811921',
              },
            ],
            isDone: true,
            _id: '6411d1ea892d6740e3d693af',
          },
        ],
      });
      jest.spyOn(WorkoutDiaryModel, 'findOneAndUpdate').mockResolvedValueOnce({
        workouts: [
          {
            sportType: 'Erősítő edzés',
            workoutName: 'láb nap',
            date: '2023-03-24',
            duration: 1,
            note: 'fejlődés az ismétlés számokkal',
            durationUnit: 'óra',
            exercises: [
              {
                exerciseName: 'guggolás', weight: 30, sets: 4, reps: 12, _id: '64304b13228c02dd3c811919',
              },
              {
                exerciseName: 'kitörés', weight: 10, sets: 4, reps: 20, _id: '64304b13228c02dd3c811920',
              },
              {
                exerciseName: 'lábtolás', weight: 30, sets: 4, reps: 13, _id: '64304b13228c02dd3c811921',
              },
            ],
            isDone: true,
            _id: '6411d1ea892d6740e3d693af',
          },
          {
            sportType: 'Futás2',
            workoutName: 'tempó futás',
            date: '2023-03-19',
            duration: 1,
            distance: 7,
            note: 'jó volt a sebesség',
            durationUnit: 'óra',
            distanceUnit: 'km',
            isDone: true,
            _id: '6411cd7e5f9979277960935a',
          },
        ],
        _id: '6411cd7e5f99792779609359',
        __v: 0,
      });

      const result = await workoutDiaryService.editWorkout(
        { userId, workoutId, ...firstWorkoutToEdit },
      );

      await expect(result.id).toStrictEqual('6411cd7e5f99792779609359');
      await expect(result.workouts).toStrictEqual([
        {
          sportType: 'Erősítő edzés',
          workoutName: 'láb nap',
          date: '2023-03-24',
          duration: 1,
          note: 'fejlődés az ismétlés számokkal',
          durationUnit: 'óra',
          exercises: [
            {
              exerciseName: 'guggolás', weight: 30, sets: 4, reps: 12, id: '64304b13228c02dd3c811919',
            },
            {
              exerciseName: 'kitörés', weight: 10, sets: 4, reps: 20, id: '64304b13228c02dd3c811920',
            },
            {
              exerciseName: 'lábtolás', weight: 30, sets: 4, reps: 13, id: '64304b13228c02dd3c811921',
            },
          ],
          isDone: true,
          id: '6411d1ea892d6740e3d693af',
        },
        {
          sportType: 'Futás2',
          workoutName: 'tempó futás',
          date: '2023-03-19',
          duration: 1,
          distance: 7,
          note: 'jó volt a sebesség',
          durationUnit: 'óra',
          distanceUnit: 'km',
          isDone: true,
          id: '6411cd7e5f9979277960935a',
        },
      ]);
    });
  });
});
