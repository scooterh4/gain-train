import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "~/hooks/use-toast";
import { Toaster } from "../ui/toaster";
import { Button } from "../ui/button";

export function SignIn({ pageTitle }: { pageTitle: string }) {
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const signInWithGoogle = async () => {
    toast({
      title: window.location.origin,
    });
    try {
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: (window.location.origin.includes('localhost') ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL) + "/api/auth/callback",
      },
    });
      if (error) throw error;
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: `An unexpected error occurred. See console.`,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Toaster></Toaster>
      <div className="rounded-2xl bg-appa-gray-bg p-6">
        <div className="flex flex-col items-start">
          <h1 className="mb-4 text-3xl font-bold">{pageTitle}</h1>
          <Button
            onClick={() => {
              signInWithGoogle()
              .catch(err => console.log(err))
              .then(() => console.log('this will succeed'))
              .catch(() => 'obligatory catch');
            }}
          >
            Log In with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
