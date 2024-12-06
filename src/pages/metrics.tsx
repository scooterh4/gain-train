import { api } from "~/utils/api";

export default function Metrics() {
  const exerciseAlltimeBests = api.user.getUserExerciseAllTimeBests.useQuery().data
  const exerciseDailyBests = api.user.getUserExerciseDailyBests.useQuery().data

  return (
    <main className="flex px-2 min-h-screen space-y-2 flex-col bg-gradient-to-b text-white from-[#2e026d] to-[#15162c]">
      <h1 className="text-white text-[2rem]">
        Metrics
      </h1>
      <div className="flex flex-col">
        <div>
          Alltime bests
          { !!exerciseAlltimeBests && exerciseAlltimeBests.map(exer => 
            <div key={exer.id} className="my-2 ml-6">
              <p>{exer.Exercise.exercise_name}</p>
              <p>Best: {exer.SetLog.weight}lbs x {exer.SetLog.reps}reps</p>
            </div>
          )}
        </div>
        <div>
          Daily bests
          { !!exerciseDailyBests && exerciseDailyBests.map(exer => 
            <div key={exer.id} className="my-2 ml-6">
              <p>{exer.day.toDateString()}</p>
              <p>{exer.Exercise.exercise_name}</p>
              <p>Best: {exer.SetLog.weight}lbs x {exer.SetLog.reps}reps</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
