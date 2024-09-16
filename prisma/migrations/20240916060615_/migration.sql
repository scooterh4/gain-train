/*
  Warnings:

  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "email" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "AlltimePersonalBests_user_id_idx" ON "AlltimePersonalBests"("user_id");

-- CreateIndex
CREATE INDEX "DailyPersonalBests_user_id_idx" ON "DailyPersonalBests"("user_id");

-- CreateIndex
CREATE INDEX "ExerciseLog_user_id_idx" ON "ExerciseLog"("user_id");

-- CreateIndex
CREATE INDEX "Exercises_user_id_idx" ON "Exercises"("user_id");

-- CreateIndex
CREATE INDEX "SetLog_exercise_id_idx" ON "SetLog"("exercise_id");

-- CreateIndex
CREATE INDEX "WorkoutLog_user_id_idx" ON "WorkoutLog"("user_id");
