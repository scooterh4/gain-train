/*
  Warnings:

  - The primary key for the `AlltimePersonalBests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `DailyPersonalBests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[exercise_id]` on the table `AlltimePersonalBests` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "AlltimePersonalBests_user_id_exercise_id_key";

-- AlterTable
ALTER TABLE "AlltimePersonalBests" DROP CONSTRAINT "AlltimePersonalBests_pkey",
ADD CONSTRAINT "AlltimePersonalBests_pkey" PRIMARY KEY ("user_id", "exercise_id");

-- AlterTable
ALTER TABLE "DailyPersonalBests" DROP CONSTRAINT "DailyPersonalBests_pkey",
ADD COLUMN     "day" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "DailyPersonalBests_pkey" PRIMARY KEY ("day", "exercise_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "AlltimePersonalBests_exercise_id_key" ON "AlltimePersonalBests"("exercise_id");
