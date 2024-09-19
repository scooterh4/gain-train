import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ChartIcon, HouseIcon, ListIcon } from "./svgs";

export function AppLayout({
  children
}: { children: React.ReactNode; }) {
  return (
    // <SignedInNavbar />
    // <div className="min-h-[1rem] w-full" />
    <div className="flex min-h-full flex-grow flex-col rounded-t-3xl bg-slate-400 sm:mx-auto sm:w-[640px] md:w-[768px]">
      {children}
      <div className="min-h-[6rem] w-full" />
      <MobileNavbar />
    </div>
  );
}

export function MobileNavbar(): JSX.Element {
  const router = useRouter();
  const [route, setRoute] = useState<string>(router.pathname);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      setRoute(url);
    };

    router.events.on("routeChangeStart", handleRouteChange);
    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router]);

  return (
    <div>
      <div className="fixed bottom-6 right-1/2 flex h-16 w-32 translate-x-1/2 place-content-between place-items-center rounded-full bg-appa-dark-blue p-[0.38rem] shadow-[0px_4px_24px_0px_rgba(0,0,0,0.15)]">
        <div
          className={`z-10 flex h-[3.25rem] w-[3.25rem] place-content-center  place-items-center`}
          onClick={() => {
            void router.push("/history");
          }}
        >
          <ListIcon active={route === "/history"} />
        </div>
        <div
          className={`z-10 flex h-[3.25rem] w-[3.25rem] place-content-center place-items-center `}
          onClick={() => {
            void router.push("/");
          }}
        >
          <HouseIcon active={route === "/"} />
        </div>
        <div
          className={`z-10 flex h-[3.25rem] w-[3.25rem] place-content-center  place-items-center`}
          onClick={() => {
            void router.push("/metrics");
          }}
        >
          <ChartIcon active={route === "/metrics"} />
        </div>
      </div>
    </div>
  );
}