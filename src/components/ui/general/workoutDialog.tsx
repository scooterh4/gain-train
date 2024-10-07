import { createContext, useState } from "react";
import { Dialog, DialogContent } from "../dialog";
import { Button } from "../button";
import { X } from "lucide-react";
import { ExercisesDialog } from "./exercisesDialog";
import { type DisplaySet, ExerciseTableDisplay } from "./exerciseSetsDisplay";
import { Table } from "../table";
import { api } from "~/utils/api";
import { type Exercise } from "@prisma/client";
import { getEmptySet } from "~/lib/utils";

export interface ExerciseDisplay extends Exercise {
  addedAt: number
}

export type WorkoutExerciseWithSets = { 
  exercise: ExerciseDisplay, 
  sets: DisplaySet[]
}

export const WorkoutContext = createContext<{
  workoutExercises: WorkoutExerciseWithSets[];
  removeExercise: (exercise: ExerciseDisplay) => void;
  updateExerciseData: (exercise: ExerciseDisplay, sets: DisplaySet[]) => void;
  addExtraSetToExercise: (exercise: ExerciseDisplay) => void;
  popSetFromExercise: (exercise: ExerciseDisplay) => void;
  updateSetDataForExercise: (exercise: ExerciseDisplay, set_num: number, type: "weight" | "reps", value: string) => void;
}>({
  workoutExercises: [],
  removeExercise: () => { return },
  updateExerciseData: () => { return},
  addExtraSetToExercise: () => { return },
  popSetFromExercise: () => { return },
  updateSetDataForExercise: () => { return }
});

export const WorkoutDialog = ({
    started_at,
    children,
  }: {
    started_at: number | null,
    children: React.ReactNode;
  }): JSX.Element => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExerciseWithSets[]>([])
  
  const logWorkout = api.user.logWorkout.useMutation({
    onSuccess: () => {
      console.log("It worked!!!!!")
      clearExercises()
      setDialogOpen(false)
    }
  })

  const addExercise = (exercise: Exercise) => {
    const newExercises = [
      ...workoutExercises, 
      { 
        exercise: { ...exercise, addedAt: Date.now() },
        sets: [] 
      }
    ];
    setWorkoutExercises(newExercises);
  };

  const clearExercises = () => {
    setWorkoutExercises([])
  }

  const onFinishWorkoutClicked = () => {
    if (!started_at) {
      console.log("No started_at value for workoutDialog")
      return
    }

    logWorkout.mutate({
      started_at: started_at,
      workout: workoutExercises,
    })
  }

  const removeExercise = (exercise: ExerciseDisplay) => {
    setWorkoutExercises(prev => prev.filter(ex => ex.exercise !== exercise));
  }

  const updateExerciseData = (exercise: ExerciseDisplay, sets: DisplaySet[]) => {
    setWorkoutExercises(prev => prev.map(ex => 
      ex.exercise === exercise ? { ...ex, sets } : ex
    ));
  };

  const updateSetDataForExercise = (exercise: ExerciseDisplay, set_num: number, type: "weight" | "reps", value: string) => {
    const numberValue = parseInt(value)
    console.log("numberValue", numberValue)

    setWorkoutExercises(prev => prev.map(ex => { 
      if (ex.exercise === exercise) {
        return {
          ...ex,
          sets: ex.sets.map(set => {
            if (set.set_num === set_num) {
              return {
                ...set,
                weight: type === "weight" ? numberValue : set.weight,
                reps: type === "reps" ? numberValue : set.reps,
              }
            } 
            return set
          })
        }
      }
        
      return ex
    }));
  }

  const addExtraSetToExercise = (exercise: ExerciseDisplay) => {
    setWorkoutExercises(prev => prev.map(ex => {
      if (ex.exercise === exercise) {
        const newSet: DisplaySet = getEmptySet(ex.sets.length + 1);
        return { ...ex, sets: [...ex.sets, newSet] };
      }
      return ex;
    }));
  }

  const popSetFromExercise = (exercise: ExerciseDisplay) => {
    setWorkoutExercises(prev => prev.map(ex => {
      if (ex.exercise !== exercise) {
        return { ...ex }
      }
      const sets = [...ex.sets]
      sets.pop()
      return {
        exercise,
        sets
      }
    }))
  }

  return (
    <>
      <div className="flex-grow" onClick={() => setDialogOpen(true)}>
        {children}
      </div>
      <WorkoutContext.Provider
        value={{
          workoutExercises,
          removeExercise,
          updateExerciseData,
          addExtraSetToExercise,
          popSetFromExercise,
          updateSetDataForExercise
        }}   
      >
        <Dialog open={dialogOpen}>
          <DialogContent 
            title="Workout Dialog"
            className="bottom-0 h-[calc(100dvh-4rem)] w-full translate-y-0 overflow-hidden rounded-t-3xl border-0 bg-white p-0 ">
            <div className="relative overflow-y-auto overflow-x-hidden p-6 ">
              <div className="flex flex-row mb-4 place-content-between rounded-2xl bg-blue-800 p-4 text-black">
                <div className="mb-2 text-xl text-white font-medium">
                  Gain time
                </div>
                <ConfirmFinishWorkoutDialog onFinishWorkoutClicked={onFinishWorkoutClicked}>
                  <Button 
                    className="bg-green-500 place-items-end"
                  >
                    Finish Workout
                  </Button>
                </ConfirmFinishWorkoutDialog>
              </div>
              <div className="flex flex-row">
                <ExercisesDialog addExercise={addExercise}>
                  <Button>
                    Add Exercise
                  </Button>
                </ExercisesDialog>
                <Button variant={"destructive"} onClick={clearExercises}>
                  Clear Exercises
                </Button>
              </div>
              {workoutExercises.map((exer, index) => 
                <Table key={`${exer.exercise.id}_${index}`}>
                  <ExerciseTableDisplay 
                    exercise={exer.exercise} 
                    sets={exer.sets}
                  />
                </Table>
              )}
              
            </div> 
            <div className="absolute right-4 top-4">
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8"
                onClick={() => {
                  setDialogOpen(false);
                }}
              >
                <X size={16} className="text-appa-dark-blue-hover" />
              </Button>
            </div> 
          </DialogContent>
        </Dialog>
      </WorkoutContext.Provider>
    </>
  );
}

const ConfirmFinishWorkoutDialog = ({
  children,
  onFinishWorkoutClicked
}: {
  children: React.ReactNode;
  onFinishWorkoutClicked: () => void
}): JSX.Element => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  
  return (
    <>
      <div className="flex-grow" onClick={() => setConfirmDialogOpen(true)}>
        {children}
      </div>
      <Dialog open={confirmDialogOpen}>
        <DialogContent 
          title="Workout Dialog"
          className="bottom-0 h-[calc(100dvh-4rem)] w-full translate-y-0 overflow-hidden rounded-t-3xl border-0 bg-white p-0 ">
          <div className="relative overflow-y-auto overflow-x-hidden p-6 ">
            <div className="flex flex-row mb-4 place-content-between rounded-2xl bg-blue-800 p-4 text-black">
              <div className="mb-2 text-xl text-white font-medium">
                R u sure ur done?
              </div>
            </div>
            <Button className="bg-green-600 text-white" onClick={() => {
              setConfirmDialogOpen(false)
              onFinishWorkoutClicked()
            }}>
              Yes
            </Button>
            <Button className="bg-red-600 text-white" onClick={() => {
              setConfirmDialogOpen(false)}}
            >
              No
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}