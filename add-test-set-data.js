import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database');

    const user = await prisma.appUser.findFirst({
      where: {
        id: "cm1e5r7270000hoxef8cz6bg5"
      }
    })

    if (!user) {
      console.log("No user found")
      return
    }

    // Bench exercise id: cm1e5rna10001hoxeygvfr1ks
    const exercise = await prisma.exercises.findFirst({
      where: {
        id: "cm1e5rna10001hoxeygvfr1ks"
      }
    })

    if (!exercise) {
      console.log("No exercise found")
      return 
    }

    console.log("Creating new workout")
    const newWorkout = await prisma.workoutLog.create({
      data: {
        AppUser: {
          connect: user
        },
        workout_name: "First test workout",
        duration_seconds: 60 * 60 * 2,
      }
    })

    if (!newWorkout) {
      console.log("No new workout made")
      return
    }
    
    console.log("Creating new exerciseLog")
    const exerciseLog = await prisma.exerciseLog.create({
      data: {
        Exercise: {
          connect: exercise
        },
        AppUser: {
          connect: user
        },
        WorkoutLog: {
          connect: newWorkout
        }
      },
    })

    if (!exerciseLog) {
      console.log("ExerciseLog not created")
      return 
    }

    console.log("Creating new setLogs")
    const setLogs = await prisma.setLog.createMany({
      data: [
        {
          exercise_id: exercise.id,
          exerciseLog_id: exerciseLog.id,
          set_num: 1,
          weight: 140,
          reps: 6
        },
        {
          exercise_id: exercise.id,
          exerciseLog_id: exerciseLog.id,
          set_num: 2,
          weight: 145,
          reps: 5
        },
        {
          exercise_id: exercise.id,
          exerciseLog_id: exerciseLog.id,
          set_num: 3,
          weight: 150,
          reps: 4
        },
      ],
    })

    if (!setLogs) {
      console.log("Did not create all set logs")
      return
    }

    console.log("It actually worked!!")
  } catch (error) {
    console.error('Failed to connect to the database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection()
  .catch((error) => {
    console.error('Unhandled error:', error);
    process.exit(1);
  });