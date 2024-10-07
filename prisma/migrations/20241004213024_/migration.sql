/*
  Warnings:

  - You are about to drop the column `duration_seconds` on the `WorkoutLog` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `WorkoutLog` table. All the data in the column will be lost.
  - Added the required column `started_at` to the `WorkoutLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WorkoutLog" 
DROP COLUMN "duration_seconds",
DROP COLUMN "updated_at",
ADD COLUMN "started_at" TIMESTAMP(3),
ADD COLUMN "ended_at" TIMESTAMP(3);

-- Update existing rows
UPDATE "WorkoutLog"
SET "started_at" = COALESCE("created_at", CURRENT_TIMESTAMP),
    "ended_at" = COALESCE("created_at", CURRENT_TIMESTAMP) + INTERVAL '2 hours';

-- Add NOT NULL constraint
ALTER TABLE "WorkoutLog" 
ALTER COLUMN "started_at" SET NOT NULL,
ALTER COLUMN "ended_at" SET NOT NULL;

-- Set default for new rows
ALTER TABLE "WorkoutLog" 
ALTER COLUMN "started_at" SET DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "ended_at" SET DEFAULT CURRENT_TIMESTAMP + INTERVAL '2 hours';
