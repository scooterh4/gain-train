import Link from "next/link";
import { Button } from "~/components/ui/button";
import { WorkoutDialog } from "~/components/ui/general/workoutDialog";
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
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/usage/first-steps"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">First Steps →</h3>
              <div className="text-lg">
                Just the basics - Everything you need to know to set up your
                database and authentication.
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
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
