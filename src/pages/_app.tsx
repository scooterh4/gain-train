import { type AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { type Metadata } from "next";
import { type Session } from "@supabase/auth-helpers-nextjs";
import { AuthProvider } from "~/components/AppProviders";

export const metadata: Metadata = {
  title: "Gain Train Application",
};

const publicRoutes = ["/signin"];
function MyApp({
  Component,
  pageProps,
}: AppProps<{ initialSession: Session }>) {
  return (
    <main className="inset-0 flex min-h-screen flex-col bg-appa-dark-blue">
      <AuthProvider
        initialSession={pageProps.initialSession}
        publicRoutes={publicRoutes}
        appTitle="The Gain Train 💪🚂"
      >
        <Component {...pageProps} />
      </AuthProvider>
    </main>
  );
}

export default api.withTRPC(MyApp);
