import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get('returnTo');

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate(returnTo || '/dashboard', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, returnTo]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-card p-8 rounded-lg shadow-lg space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-primary to-brand">
          Welcome Back
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'rgb(var(--primary))',
                  brandAccent: 'rgb(var(--primary-foreground))',
                  inputBackground: 'rgb(var(--background))',
                  inputText: 'rgb(var(--foreground))',
                  inputBorder: 'rgb(var(--border))',
                  inputBorderFocus: 'rgb(var(--ring))',
                  inputBorderHover: 'rgb(var(--border))',
                }
              }
            },
            className: {
              container: 'space-y-4',
              button: 'w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-md transition-colors duration-200',
              input: 'w-full bg-background border border-input rounded-md px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
              label: 'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              message: 'text-destructive',
              divider: 'text-muted-foreground',
              anchor: 'text-primary hover:text-primary/90 transition-colors duration-200',
            }
          }}
          theme="default"
          providers={["github", "google"]}
          redirectTo={window.location.origin}
          onlyThirdPartyProviders={false}
        />
      </div>
    </div>
  );
};

export default Login;