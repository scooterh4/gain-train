import { useState } from "react";
import { Button } from "~/components/ui/button";
import { WorkoutDialog } from "~/components/ui/general/workoutDialog";
import { api } from "~/utils/api";

export default function Home() {
  const user = api.user.helloUser.useQuery().data
  const [ workoutStartedAt, setWorkoutStartedAt ] = useState<number | null>(null)

  const startWorkout = () => {
    console.log('Workout start reset')
    setWorkoutStartedAt(Date.now())
  }

  return (
    <>
      <main className="flex px-2 min-h-screen space-y-2 flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {/* <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16"> */}
        {!!user && (
          <h1 className="text-xl font-bold tracking-tight text-white">
              Hello <span className="text-[hsl(280,100%,70%)]">{user.name}</span>
          </h1>
            )}
          <h1 className="text-white text-[2rem]">
            Quick start
          </h1>
          <div>
          <WorkoutDialog started_at={workoutStartedAt}>
            <Button className="w-full" onClick={startWorkout}>
              Start new workout
            </Button>
          </WorkoutDialog>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          </div>
      </main>
    </>
  );
}
