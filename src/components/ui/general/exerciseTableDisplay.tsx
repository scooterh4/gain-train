import { type Exercises } from "@prisma/client";
import { Table } from "lucide-react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Input } from "../input";

export const ExerciseTableDisplay = ({exercise}: {exercise: Exercises}) => {
  return (
    <Table>
      {/* <TableHeader>{exercise.exercise_name}</TableHeader> */}
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Set</TableHead>
          <TableHead>Previous display</TableHead>
          <TableHead>Weight</TableHead>
          <TableHead className="text-right">Reps</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* {exercise.map((invoice) => ( */}
          <TableRow key={exercise.id}>
            <TableCell className="font-medium">1</TableCell>
            <TableCell>165 x 4</TableCell>
            <TableCell>2</TableCell>
            <TableCell className="text-right">3</TableCell>
          </TableRow>
        {/* ))} */}
      </TableBody>
    </Table>
  )
}