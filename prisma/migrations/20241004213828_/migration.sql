-- AlterTable
ALTER TABLE "WorkoutLog" ALTER COLUMN "started_at" DROP DEFAULT,
ALTER COLUMN "ended_at" SET DEFAULT CURRENT_TIMESTAMP;
