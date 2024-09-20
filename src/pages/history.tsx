import Link from "next/link";

export default function History() {
  // const post = api.post.getLatest.useQuery().data;

  return (
    <>
      <main className="flex px-2 min-h-screen space-y-2 flex-col bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <h1 className="text-white text-[2rem]">
          Workout history
        </h1>
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
      </main>
    </>
  );
}
