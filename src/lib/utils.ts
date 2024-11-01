import { SetLog } from "@prisma/client"
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

export const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
});

export const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: 'numeric',
  hour12: true
});

export function isBetterSet(newSet: SetLog, currentBest: SetLog | undefined): boolean {
  // returns true if the newSet is 'better' than the currentBest
  // better means the new set was more weight, OR the new set had more reps for the same weight
  return (
    (!currentBest) 
    || (!!newSet.weight && !currentBest.weight) 
    || (!!newSet.weight && !!currentBest.weight && newSet.weight > currentBest.weight)
    || (newSet.weight === currentBest.weight && newSet.reps > currentBest.reps)
  );
}