-- DropIndex
DROP INDEX "AlltimePersonalBests_user_id_key";

-- DropIndex
DROP INDEX "DailyPersonalBests_user_id_key";

-- DropIndex
DROP INDEX "ExerciseLog_user_id_key";

-- DropIndex
DROP INDEX "ExerciseLog_workoutLog_id_key";

-- DropIndex
DROP INDEX "SetLog_exerciseLog_id_key";

-- DropIndex
DROP INDEX "SetLog_exercise_id_key";

-- CreateIndex
CREATE INDEX "ExerciseLog_workoutLog_id_idx" ON "ExerciseLog"("workoutLog_id");

-- CreateIndex
CREATE INDEX "SetLog_exerciseLog_id_idx" ON "SetLog"("exerciseLog_id");
