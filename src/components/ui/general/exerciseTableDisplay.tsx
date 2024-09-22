import { type Exercises } from "@prisma/client";
import { Table } from "lucide-react";
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from "../table";
import { Input } from "../input";

export const ExerciseTableDisplay = (
  {exercise}: {exercise: Exercises}
) => {
  return (
    <>
            <TableHeader className="text-right">{exercise.exercise_name}</TableHeader> 
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Set</TableHead>
                <TableHead>Previous display</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead className="text-right">Reps</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                <TableRow>
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
                </TableRow>
            </TableBody>
            </>
  )
}