import { dateFormatter, timeFormatter } from "~/lib/utils";
import { type WorkoutDisplayType } from "~/pages/history";

export const WorkoutDisplay = ({ workout } : {workout: WorkoutDisplayType }) => {
  const formattedDate = dateFormatter.format(workout.started_at);
  const formattedStartTime = timeFormatter.format(workout.started_at).toLowerCase();
  const durationMin = ((workout.ended_at.getTime() - workout.started_at.getTime()) / 1000) / 60
  const durationHrs = durationMin / 60

  return (
    <div key={workout.id} className="flex flex-col text-white  border-pink-400 border-2 rounded-md my-2 px-4 mx-10">
      <h1 className="text-lg">{formattedDate} @ {formattedStartTime}</h1>
      <h1 className="text-lg">
        {durationHrs < 1 ? "" : `${durationHrs} hrs `}{durationMin.toFixed(0)} mins
      </h1>
      <h1 className="text-lg">Exercises:</h1>
      { workout.ExerciseLog.map(exer => (
        <div key={exer.Exercise.id} className="text-sm">
          {exer.SetLog.length} x {exer.Exercise.exercise_name}
        </div>
      ))}
    </div>
  )
}