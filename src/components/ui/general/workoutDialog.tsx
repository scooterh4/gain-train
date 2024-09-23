import { useState } from "react";
import { Dialog, DialogContent } from "../dialog";
import { Button } from "../button";
import { X } from "lucide-react";
import { ExercisesDialog } from "./exercisesDialog";
import { type Exercises } from "@prisma/client";
import { ExerciseTableDisplay } from "./exerciseSetsDisplay";
import { Table } from "../table";
import { api } from "~/utils/api";

export const WorkoutDialog = ({
    children,
  }: {
    children: React.ReactNode;
  }): JSX.Element => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [workoutExercises, setWorkoutExercises] = useState<Exercises[]>([])
  // const logWorkout = api.workout.logWorkout
  const clearExercises = () => {
    setWorkoutExercises([])
  }
  const onFinishWorkoutClicked = () => {
    console.log("Its done!")
  }

  const removeExercise = (exerciseId: string) => {
    setWorkoutExercises((prevExercises) => {
      return prevExercises.filter(prev => prev.id !== exerciseId)
    })
  }

  return (
    <>
      <div className="flex-grow" onClick={() => setDialogOpen(true)}>
        {children}
      </div>
      <Dialog open={dialogOpen}>
        <DialogContent 
          title="Workout Dialog"
          className="bottom-0 h-[calc(100dvh-4rem)] w-full translate-y-0 overflow-hidden rounded-t-3xl border-0 bg-white p-0 ">
          <div className="relative overflow-y-auto overflow-x-hidden p-6 ">
            <div className="flex flex-row mb-4 place-content-between rounded-2xl bg-blue-800 p-4 text-black">
              <div className="mb-2 text-xl text-white font-medium">
                Gain time
              </div>
              <Button className="bg-green-500" onClick={onFinishWorkoutClicked}>
                Finish Workout
              </Button>
            </div>
            <div className="flex flex-row">
              <ExercisesDialog setWorkoutExercises={setWorkoutExercises}>
                <Button>
                  Add Exercise
                </Button>
              </ExercisesDialog>
              <Button variant={"destructive"} onClick={clearExercises}>
                Clear Exercises
              </Button>
            </div>
            {workoutExercises.map((exercise) => 
              <Table key={exercise.id}>
                <ExerciseTableDisplay exercise={exercise} removeExercise={() => removeExercise(exercise.id)} />
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
    </>
  );
}