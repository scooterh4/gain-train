import { useState } from "react";
import { Dialog, DialogContent } from "../dialog";
import { Button } from "../button";
import { X } from "lucide-react";
import { Input } from "../input";


export const AddNewExerciseDialog = ({
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
        title="Add New Exercise"
        className="fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" >
        <div className="relative overflow-y-auto overflow-x-hidden p-6 ">
          <div className="mb-4 space-y-3 rounded-2xl bg-appa-dark-blue p-4 text-white">
            <div className="mb-2 text-xl font-medium">
              Create New Exercise
            </div>
            <div>
              <Input placeholder="Add exercise name" />
            </div>
            <div>
              <Button className="bg-green-500 text-white">
                Save
              </Button>
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
        </div> 
      </DialogContent>
    </Dialog>
  </>
);
}