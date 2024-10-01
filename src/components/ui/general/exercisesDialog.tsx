import { useState } from "react";
import { Dialog, DialogContent } from "../dialog";
import { Button } from "../button";
import { X } from "lucide-react";
import { AddNewExerciseDialog } from "./addNewExerciseDialog";
import { api } from "~/utils/api";
import { type Exercises } from "@prisma/client";

export const ExercisesDialog = ({
  addExercise,
  children,
}: {
  addExercise: (exercise: Exercises) => void;
  children: React.ReactNode;
}): JSX.Element => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const userExercises = api.exercise.getUserExercises.useQuery().data
  function onExerciseClicked(exercise: Exercises) {
    addExercise(exercise)
    setDialogOpen(false)
  }

  return (
    <>
      <div className="flex-grow" onClick={() => setDialogOpen(true)}>
        {children}
      </div>
      <Dialog open={dialogOpen}>
        <DialogContent 
          title="Exercise Dialog"
          className="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" >
          <div className="relative overflow-y-auto overflow-x-hidden p-6 ">
            <div className="mb-4 rounded-2xl bg-appa-dark-blue p-4 text-white">
              <div className="mb-2 text-xl font-medium">
                Exercises
              </div>
            </div>

          <AddNewExerciseDialog>
            <Button className="bg-green-500">
              New
            </Button>
          </AddNewExerciseDialog>
          <div>
            {!userExercises && (
              <div className="text-white">No exercises {`:(`}</div>
            )}
          </div>
          <div>
            {!!userExercises && (
              <h1 className="text-white text-xl">Your exercises</h1>
            )}
          </div>
          <div>
            {userExercises?.map((exercise) =>
                <Button key={exercise.id} className="text-white"
                  onClick={() => onExerciseClicked(exercise)}>
                  {exercise.exercise_name}
                </Button>
              )
            }
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
          </div> 
        </DialogContent>
      </Dialog>
    </>
  );
}