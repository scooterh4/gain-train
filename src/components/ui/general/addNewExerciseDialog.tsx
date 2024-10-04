import { useRef, useState } from "react";
import { Dialog, DialogContent } from "../dialog";
import { Button } from "../button";
import { X } from "lucide-react";
import { Input } from "../input";
import { api } from "~/utils/api";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ExerciseType } from "@prisma/client";

export const AddNewExerciseDialog = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
const [dialogOpen, setDialogOpen] = useState(false);
const newExercise = useRef<string | undefined>(undefined)
const [ newExerciseType, setNewExerciseType ] = useState<string | null>(null)
const [ error, setError ] = useState({ exerciseType: false, exerciseName: false })
const utils = api.useUtils();
const exerciseTypes = api.exercise.getExerciseTypes.useQuery().data

const createNewExercise = api.exercise.createExercise.useMutation({
  onSuccess:() => {
    void utils.exercise.invalidate()
  }
})
const saveNewExercise = () => {
  console.log(newExercise.current)

  if (!newExercise.current || !newExerciseType) {
    setError({
      exerciseType: !newExerciseType,
      exerciseName: !newExercise.current
    })
    return
  }

  createNewExercise.mutate({
    name: newExercise.current,
    exercise_type: newExerciseType
  })
  setNewExerciseType(null)
  setError({
    exerciseType: false,
    exerciseName: false,
  })
  setDialogOpen(false)
}


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
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span className={error.exerciseType ? 'bg-red-500' : ''}>{ newExerciseType ?? 'Select exercise type' }</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 text-black bg-white">
                <DropdownMenuGroup>
                  {exerciseTypes?.map(type => 
                    <DropdownMenuItem key={type.id} onClick={() => setNewExerciseType(type.name)}>
                      {type.name}  
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <div>
              <Input 
                placeholder="Add exercise name" 
                className={error.exerciseName ? 'bg-red-500' : ''} 
                onChange={(e) => { newExercise.current = e.target.value }} 
              />
            </div>
            <div>
              <Button className="bg-green-500 text-white" onClick={saveNewExercise}>
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
              setNewExerciseType(null)
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