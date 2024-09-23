import { type Exercises } from "@prisma/client";
import { TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "../table";
import { Input } from "../input";
import { api } from "~/utils/api";
import { useEffect, useState } from "react";
import { Button } from "../button";
import { Trash2Icon } from "lucide-react";

type DisplaySets = {
  exercise_id: string,
  prev_set: string,
  set_num: number,
  weight: number | null,
  reps: number | null,
}

const emptySet = (exerciseId: string, setNum: number) => {
  return {
    exercise_id: exerciseId,
    prev_set: "",
    set_num: setNum,
    weight: null,
    reps: null
  }
}

export const ExerciseTableDisplay = (
  {exercise}: {exercise: Exercises}
) => {
  const prevSets = api.exercise.getPreviousSetsForExercise.useQuery({
    exerciseId: exercise.id
  }).data

  useEffect(() => {
    if (!prevSets) {
      setDisplaySets([1, 2, 3].map(num => {
        return emptySet(exercise.id, num);
      }))
    }
    else {
      setDisplaySets(prevSets.map(set => {
        return {
          exercise_id: set.exercise_id,
          prev_set: `${set.weight} x ${set.reps}`,
          set_num: set.set_num,
          weight: null,
          reps: null
        };
      }))
    }
  }, [prevSets])

  const [ displaySets, setDisplaySets ] = useState<DisplaySets[]>([])

  const addSetToExercise = () => {
    const lastSet = displaySets[displaySets.length - 1]?.set_num
    if (!lastSet || lastSet === undefined) {
      console.log("Last set is undefined for exercise id", exercise.id)
    }
    else {
      setDisplaySets((prevSets) => [...prevSets, emptySet(exercise.id, lastSet + 1)])
    }
  }

  const deleteSet = (setNum: number) => {
    if (setNum === displaySets.length) {
      setDisplaySets((prevSets) => {
        const sets = [...prevSets]
        sets.pop()
        return sets
      })
    }
  }

  return (
    <>
      <TableHeader className="text-right">{exercise.exercise_name}</TableHeader> 
      <TableHeader>
        <TableRow>
          <TableHead className="w-[30px]">Set</TableHead>
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
            <TableCell><Input type="number" /></TableCell>
            <TableCell className="text-right"><Input type="number" /></TableCell>
            <TableCell onClick={() => deleteSet(set.set_num)}>
              <Trash2Icon className={`${set.set_num !== displaySets.length ? "text-gray-300" : ""}`} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter className="w-full">
        <Button className="w-full" onClick={addSetToExercise}>
          Add set
        </Button>
      </TableFooter>
    </>
  )
}