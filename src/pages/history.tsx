import { WorkoutDisplay } from "~/components/ui/general/workoutHistoryDisplay";
import { api } from "~/utils/api";

export default function History() {
  const history = api.user.getUserWorkoutHistory.useQuery().data
  
  return (
    <main className="flex px-2 min-h-screen space-y-2 flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <h1 className="text-white text-[2rem]">
        Workout history
      </h1>
      <div className="flex flex-col">
        { (!history || history === undefined) && (
          <div className="text-white">No workouts to display!</div>
        )}
        { !!history && (
          <>
            { history.map(workout => (
              <div key={workout.id}>
                <WorkoutDisplay {...workout} />
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
}
