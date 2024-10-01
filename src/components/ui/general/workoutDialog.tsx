import { createContext, useState } from "react";
import { Dialog, DialogContent } from "../dialog";
import { Button } from "../button";
import { X } from "lucide-react";
import { ExercisesDialog } from "./exercisesDialog";
import { type DisplaySets, emptySet, ExerciseTableDisplay } from "./exerciseSetsDisplay";
import { Table } from "../table";
import { api } from "~/utils/api";
import { type Exercises } from "@prisma/client";

export interface ExerciseDisplay extends Exercises {
  addedAt: number
}

export type WorkoutExerciseWithSets = { 
  exercise: ExerciseDisplay, 
  sets: DisplaySets[]
}

export const WorkoutContext = createContext<{
  workoutExercises: WorkoutExerciseWithSets[];
  removeExercise: (exercise: ExerciseDisplay) => void;
  setExerciseSets: (exercise: ExerciseDisplay, sets: DisplaySets[]) => void;
  addExtraSetToExercise: (exercise: ExerciseDisplay) => void;
  popSetFromExercise: (exercise: ExerciseDisplay) => void;
}>({
  workoutExercises: [],
  removeExercise: () => { return },
  setExerciseSets: () => { return},
  addExtraSetToExercise: () => { return },
  popSetFromExercise: () => { return }
});

export const WorkoutDialog = ({
    children,
  }: {
    children: React.ReactNode;
  }): JSX.Element => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState<WorkoutExerciseWithSets[]>([])

  // const logWorkout = api.workout.logWorkout

  const addExercise = (exercise: Exercises) => {
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
    console.log("Its done!")
  }

  const removeExercise = (exercise: ExerciseDisplay) => {
    setWorkoutExercises(prev => prev.filter(ex => ex.exercise !== exercise));
  }

  const setExerciseSets = (exercise: ExerciseDisplay, sets: DisplaySets[]) => {
    setWorkoutExercises(prev => prev.map(ex => 
      ex.exercise === exercise ? { ...ex, sets } : ex
    ));
  }

  const addExtraSetToExercise = (exercise: ExerciseDisplay) => {
    setWorkoutExercises(prev => prev.map(ex => {
      if (ex.exercise === exercise) {
        const newSet: DisplaySets = emptySet(ex.sets.length + 1);
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
          setExerciseSets,
          addExtraSetToExercise,
          popSetFromExercise
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
                  <Button className="bg-green-500 place-items-end">
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