import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ExerciseTypes } from "~/components/ui/general/exerciseSetsDisplay"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
  
export const getEmptySet = (setNum: number) => {
  return {
    prev_set: "",
    set_num: setNum,
    weight: null,
    reps: null,
    error: false
  }
}

export function getPrevSetMessage (exercise_type_id: string, weight: number | null, reps: number) {
  switch (exercise_type_id) {
    case ExerciseTypes.normal_weighted.valueOf():
      return `${weight} lb x ${reps}`
    
    case ExerciseTypes.weighted_bodyweight.valueOf():
      return weight ? `+${weight} lb x ${reps}` : `${reps} reps`
    
    default:
      return ''
  }
}
