-- DropIndex
DROP INDEX "AlltimePersonalBests_exercise_id_key";

-- DropIndex
DROP INDEX "DailyPersonalBests_exercise_id_key";

-- DropIndex
DROP INDEX "WorkoutLog_user_id_key";

-- CreateIndex
CREATE INDEX "AlltimePersonalBests_exercise_id_idx" ON "AlltimePersonalBests"("exercise_id");

-- CreateIndex
CREATE INDEX "DailyPersonalBests_exercise_id_idx" ON "DailyPersonalBests"("exercise_id");
