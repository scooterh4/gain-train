import { useState } from "react";
import { Dialog, DialogContent } from "../dialog";
import { Button } from "../button";
import { X } from "lucide-react";
import { ExercisesDialog } from "./exercisesDialog";

export const WorkoutDialog = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
const [dialogOpen, setDialogOpen] = useState(false);

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
          <div className="mb-4 rounded-2xl bg-appa-dark-blue p-4 text-black">
            <div className="mb-2 text-xl font-medium">
              Gain time
            </div>
          </div>
          <div>
          <ExercisesDialog>
            <Button>
              Add Exercise
            </Button>
          </ExercisesDialog>
          </div>
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