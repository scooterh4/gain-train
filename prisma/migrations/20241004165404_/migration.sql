/*
  Warnings:

  - Added the required column `exercise_type_id` to the `Exercise` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Exercise" 
ADD COLUMN  "exercise_type_id" TEXT NOT NULL
DEFAULT 'normal_weighted';

-- AlterTable
ALTER TABLE "SetLog" ALTER COLUMN "weight" DROP NOT NULL;

-- CreateTable
CREATE TABLE "ExerciseType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "requires_weight" BOOLEAN NOT NULL,
    "requires_reps" BOOLEAN NOT NULL,

    CONSTRAINT "ExerciseType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Exercise_exercise_type_id_idx" ON "Exercise"("exercise_type_id");
