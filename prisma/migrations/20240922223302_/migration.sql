-- DropIndex
DROP INDEX "ExerciseLog_exercise_id_key";

-- CreateIndex
CREATE INDEX "ExerciseLog_exercise_id_idx" ON "ExerciseLog"("exercise_id");
