/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Post";

-- CreateTable
CREATE TABLE "AlltimePersonalBests" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "setLog_id" TEXT NOT NULL,

    CONSTRAINT "AlltimePersonalBests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyPersonalBests" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "setLog_id" TEXT NOT NULL,

    CONSTRAINT "DailyPersonalBests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Exercises" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "exercise_name" TEXT NOT NULL,

    CONSTRAINT "Exercises_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExerciseLog" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "workoutLog_id" TEXT NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "notes" TEXT,

    CONSTRAINT "ExerciseLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SetLog" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "exercise_id" TEXT NOT NULL,
    "exerciseLog_id" TEXT NOT NULL,
    "set_num" INTEGER NOT NULL,
    "weight" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,

    CONSTRAINT "SetLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutLog" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "workout_name" TEXT NOT NULL,
    "duration_seconds" INTEGER NOT NULL,
    "notes" TEXT,

    CONSTRAINT "WorkoutLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AlltimePersonalBests_user_id_key" ON "AlltimePersonalBests"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "AlltimePersonalBests_exercise_id_key" ON "AlltimePersonalBests"("exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "AlltimePersonalBests_setLog_id_key" ON "AlltimePersonalBests"("setLog_id");

-- CreateIndex
CREATE UNIQUE INDEX "DailyPersonalBests_user_id_key" ON "DailyPersonalBests"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "DailyPersonalBests_exercise_id_key" ON "DailyPersonalBests"("exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "DailyPersonalBests_setLog_id_key" ON "DailyPersonalBests"("setLog_id");

-- CreateIndex
CREATE UNIQUE INDEX "Exercises_user_id_key" ON "Exercises"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseLog_user_id_key" ON "ExerciseLog"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseLog_workoutLog_id_key" ON "ExerciseLog"("workoutLog_id");

-- CreateIndex
CREATE UNIQUE INDEX "ExerciseLog_exercise_id_key" ON "ExerciseLog"("exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "SetLog_exercise_id_key" ON "SetLog"("exercise_id");

-- CreateIndex
CREATE UNIQUE INDEX "SetLog_exerciseLog_id_key" ON "SetLog"("exerciseLog_id");

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutLog_user_id_key" ON "WorkoutLog"("user_id");
