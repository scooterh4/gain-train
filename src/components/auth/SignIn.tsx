import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useToast } from "~/hooks/use-toast";
import { Toaster } from "../ui/toaster";
import { Button } from "../ui/button";
import { getBaseUrl } from "~/utils/api";

export function SignIn({ pageTitle }: { pageTitle: string }) {
  const supabase = useSupabaseClient();
  const { toast } = useToast();

  const signInWithGoogle = async () => {
    toast({
      title: window.location.origin,
    });
    const { error, data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: getBaseUrl() + "/api/auth/callback",
      },
    });
    if (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "Error with auth" + error.message,
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
