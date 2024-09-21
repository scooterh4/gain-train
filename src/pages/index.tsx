import { Button } from "~/components/ui/button";
import { WorkoutDialog } from "~/components/ui/general/workoutDialog";
import { Input } from "~/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table";
import { api } from "~/utils/api";

export default function Home() {
  const user = api.user.helloUser.useQuery().data

  return (
    <>
      <main className="flex px-2 min-h-screen space-y-2 flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        {/* <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16"> */}
        {!!user && (
          <h1 className="text-xl font-bold tracking-tight text-white">
              Hello <span className="text-[hsl(280,100%,70%)]">{user.name}</span>
          </h1>
            )}
          <h1 className="text-white text-[2rem]">
            Quick start
          </h1>
          <div>
          <WorkoutDialog>
            <Button className="w-full">
              Start new workout
            </Button>
          </WorkoutDialog>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          <Table>
            {/* <TableHeader>{exercise.exercise_name}</TableHeader> */}
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Set</TableHead>
                <TableHead>Previous display</TableHead>
                <TableHead>Weight</TableHead>
                <TableHead className="text-right">Reps</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* {exercise.map((invoice) => ( */}
                <TableRow>
                  <TableCell className="font-medium">1</TableCell>
                  <TableCell>165 x 4</TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell className="text-right"><Input /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">2</TableCell>
                  <TableCell>170 x 4</TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell className="text-right"><Input /></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">2</TableCell>
                  <TableCell>175 x 4</TableCell>
                  <TableCell><Input /></TableCell>
                  <TableCell className="text-right"><Input /></TableCell>
                </TableRow>
              {/* ))} */}
            </TableBody>
          </Table>
          </div>
          <p className="text-2xl text-white">
              {/* {post?.map(post => (
                <div key={post.id}>
                  <span className="p-2">{post.name}</span>
                  <span>{post.createdAt.toDateString()}</span>
                </div>
              ))} */}
          </p>
        {/* </div> */}
      </main>
    </>
  );
}
