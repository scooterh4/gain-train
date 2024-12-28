import {
  useSupabaseClient,
  SessionContextProvider,
} from "@supabase/auth-helpers-react";
import {
  createPagesBrowserClient,
  type Session,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "./ui/button";
import { AppLayout } from "./nav";

interface RouteProviderProps {
  children: React.ReactNode;
  publicRoutes: string[];
  appTitle: string;
}

export const RouteProvider = ({
  children,
  publicRoutes,
  appTitle,
}: RouteProviderProps) => {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (["INITIAL_SESSION", "SIGNED_IN", "SIGNED_OUT"].includes(event)) {
        setIsLoggedIn(!!session);
        if (session && publicRoutes.includes(router.pathname)) {
          await router.push("/");
        } else if (!session && !publicRoutes.includes(router.pathname)) {
          await router.push("/signin");
        }
      }
    });
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  if (isLoggedIn) {
    return (
      <AppLayout>
        {/* <div className="h-screen overflow-hidden flex flex-col"> */}
          <Header appTitle={appTitle} />
          <div className="flex-grow overflow-y-auto py-4">{children}</div>
        {/* </div> */}
      </AppLayout>
    );
  }
  return <>{children}</>;
};

interface AuthProviderProps extends RouteProviderProps {
  initialSession: Session;
}

export const AuthProvider = (props: AuthProviderProps) => {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({
      cookieOptions: {
        secure: true,
        path: "/",
        sameSite: "lax",
        domain:
          process.env.NODE_ENV === "production"
            ? ".vercel.app"
            : "localhost",
      },
    })
  );

  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={props.initialSession}
    >
      <RouteProvider {...props}>{props.children}</RouteProvider>
    </SessionContextProvider>
  );
};

export const Header = ({ appTitle }: { appTitle: string }) => {
  const supabase = useSupabaseClient();
  const router = useRouter();
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      router.push("/signin").catch((err) => {
        console.error("Failed to navigate", err);
      });
    }
  };
  return (
    <div className="h-16 p-4 flex flex-row justify-between items-center">
      <div className="text-2xl cursor-pointer" onClick={() => router.push("/")}>
        {appTitle}
      </div>
      <Button onClick={signOut}>Sign Out</Button>
    </div>
  );
};
