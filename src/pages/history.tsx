import { type Exercise, type SetLog } from "@prisma/client";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { WorkoutDisplay } from "~/components/ui/general/workoutHistoryDisplay";
import { api } from "~/utils/api";

export type WorkoutDisplayType = {
  ExerciseLog: {
    Exercise: Exercise,
    SetLog: SetLog[]
  } [],
  id: string,
  created_at: Date,
  started_at: Date,      
  ended_at: Date,
  user_id: string,        
  workout_name: string,
  notes: string | null,
}

export default function History() {
  const { data, fetchNextPage, hasNextPage } = api.user.getUserWorkouts.useInfiniteQuery({
      limit: 5,
    },
    {
      getNextPageParam: (lastPage) => lastPage?.cursor
    }
  ) 
 
  const [ workouts, setWorkouts ] = useState<WorkoutDisplayType[] | undefined>( data?.pages[0]?.workouts ? data?.pages[0]?.workouts : undefined)

  useEffect(() => {
    if (data?.pages) {
      setWorkouts(() => {
        const newWorkouts = data.pages.flatMap((page) => page?.workouts?.filter((w) => !!w) ?? []); // Filter out null/undefined
        return [...newWorkouts] 
      });
    }
  }, [data])

  const loadMoreWorkouts = async () => {
    if (hasNextPage) {
      await fetchNextPage()
    }
  }

  if (workouts === undefined) {
    return <Loading />;
  }

  return (
    <main className="flex px-2 min-h-screen space-y-2 flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <h1 className="text-white text-[2rem]">
        Workout history
      </h1>
      <div className="flex flex-col">
        <>
          { !!workouts && workouts.map(workout => (
            <div key={workout.id}>
              <WorkoutDisplay workout={workout}
              />
            </div>
          ))}
        </>
        {hasNextPage && (
          <Button 
            className="text-white bg-red" 
            onClick={ loadMoreWorkouts }>
            Load more workouts
          </Button> 
        )}
      </div>
    </main>
  );
}

const Loading = () => {
  return (
    <div className="text-white">
      Loading...
    </div>
  )
}