import { type Exercises } from "@prisma/client";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Input } from "../input";
import { api } from "~/utils/api";

export const ExerciseTableDisplay = (
  {exercise}: {exercise: Exercises}
) => {
  const prevSets = api.exercise.getPreviousSetsForExercise.useQuery({
    exerciseId: exercise.id
  }).data
  
  let displaySets
  if (!prevSets) {
    displaySets = [1, 2, 3].map(num => {
      return {
        exercise_id: exercise.id,
        prev_set: "",
        set_num: num,
        weight: null,
        reps: null
      }
    })
  } 
  else {
    displaySets = prevSets.map(set => {
      return {
        exercise_id: set.exercise_id,
        prev_set: `${set.weight} x ${set.reps}`,
        set_num: set.set_num,
        weight: null,
        reps: null
      } 
    })
  }

  return (
    <>
      <TableHeader className="text-right">{exercise.exercise_name}</TableHeader> 
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Set</TableHead>
          <TableHead>Previous display</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead>Reps</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displaySets.map((set => 
          <TableRow key={set.set_num}>
            <TableCell className="font-medium">{set.set_num}</TableCell>
            <TableCell>{set.prev_set}</TableCell>
            <TableCell><Input /></TableCell>
            <TableCell className="text-right"><Input /></TableCell>
          </TableRow>
        ))}
          {/* <TableRow>
            <TableCell className="font-medium">1</TableCell>
            <TableCell>165 x 5</TableCell>
            <TableCell><Input /></TableCell>
            <TableCell className="text-right"><Input /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">2</TableCell>
            <TableCell>170 x 4</TableCell>
            <TableCell><Input /></TableCell>
            <TableCell className="text-right"><Input /></TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">3</TableCell>
            <TableCell>175 x 3</TableCell>
            <TableCell><Input /></TableCell>
            <TableCell className="text-right"><Input /></TableCell>
          </TableRow> */}
      </TableBody>
    </>
  )
}