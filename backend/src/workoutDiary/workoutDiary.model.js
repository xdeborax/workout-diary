import mongoose from 'mongoose';

const workoutDiarySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserModel',
  },
  workouts: [
    {
      sportType: String,
      workoutName: String,
      date: Date,
      duration: Number,
      distance: Number,
      note: String,
      durationUnit: String,
      distanceUnit: String,
      isDone: {
        type: Boolean,
        default: false,
      },
      exercises: [
        {
          exerciseName: String,
          weight: Number,
          sets: Number,
          reps: Number,
        },
      ],
    },
  ],
});

export const WorkoutDiaryModel = mongoose.model('WorkoutDiary', workoutDiarySchema);
