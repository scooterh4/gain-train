import { TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../table";
import { Input } from "../input";
import { api } from "~/utils/api";
import { useContext, useEffect } from "react";
import { Button } from "../button";
import { CircleEllipsisIcon, Trash2Icon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../dropdown-menu";
import { ExerciseDisplay, WorkoutContext } from "./workoutDialog";

export type DisplaySets = {
  prev_set: string,
  set_num: number,
  weight: number | null,
  reps: number | null,
}

export const emptySet = (setNum: number) => {
  return {
    prev_set: "",
    set_num: setNum,
    weight: null,
    reps: null
  }
}

export const ExerciseTableDisplay = ({
    exercise,
    sets,
  }: 
  {
    exercise: ExerciseDisplay;
    sets: DisplaySets[];
  }
) => {
  const prevSets = api.exercise.getPreviousSetsForExercise.useQuery({
    exerciseId: exercise.id
  }).data
  const { 
    workoutExercises, 
    removeExercise, 
    setExerciseSets, 
    addExtraSetToExercise, 
    popSetFromExercise
  } = useContext(WorkoutContext)

  useEffect(() => {
    const currentExer = workoutExercises.find((exer) => exer.exercise === exercise);
  
    // Check if the sets are already initialized to avoid re-triggering the effect
    if (currentExer?.sets.length === 0) {
      let newSets: DisplaySets[] = [];
  
      if (!prevSets) {
        newSets = [1, 2, 3].map(num => emptySet(num));
      } else {
        newSets = prevSets.map(set => ({
          prev_set: `${set.weight} x ${set.reps}`,
          set_num: set.set_num,
          weight: null,
          reps: null,
        }));
      }
  
      setExerciseSets(exercise, newSets);
    }
  }, [prevSets]);

  const deleteSet = (setNum: number) => {
    if (setNum === sets.length) {
      popSetFromExercise(exercise)
    }
  }

  return (
    <>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">{exercise.exercise_name}</TableHead>
          <TableHead className="text-right">
            <EditExerciseDropdownMenu 
              exerciseId={exercise.id}
              removeExercise={() => removeExercise(exercise)}
            >
              <CircleEllipsisIcon/>
            </EditExerciseDropdownMenu>
          </TableHead>
        </TableRow>
      </TableHeader> 
      <TableHeader>
        <TableRow>
          <TableHead className="w-[30px]">Set</TableHead>
          <TableHead>Previous display</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead>Reps</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sets.map((set => 
          <TableRow key={set.set_num}>
            <TableCell className="font-medium">{set.set_num}</TableCell>
            <TableCell>{set.prev_set}</TableCell>
            <TableCell><Input type="number" /></TableCell>
            <TableCell className="text-right"><Input type="number" /></TableCell>
            <TableCell onClick={() => deleteSet(set.set_num)}>
              <Trash2Icon className={`${set.set_num !== sets.length ? "text-gray-300" : ""}`} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="w-full">
        <Button className="w-full" onMouseDown={() => addExtraSetToExercise(exercise)}>
          Add set
        </Button>
      </TableFooter>
    </>
  )
}

function EditExerciseDropdownMenu(
  { 
    children, 
    exerciseId, 
    removeExercise 
  }: { 
    children: React.ReactNode;
    exerciseId: string;
    removeExercise: (exerciseId: string) => void; 
  }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Exercise Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => removeExercise(exerciseId)}>
            <Trash2Icon className="mr-2 h-4 w-4" />
            <span>Remove exercise</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}