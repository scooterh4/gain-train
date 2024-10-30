/*
  Warnings:

  - A unique constraint covering the columns `[user_id,exercise_id]` on the table `AlltimePersonalBests` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AlltimePersonalBests_user_id_exercise_id_key" ON "AlltimePersonalBests"("user_id", "exercise_id");
