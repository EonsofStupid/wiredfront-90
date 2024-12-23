import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeSupa } from "@supabase/auth-ui-shared";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark p-4">
      <div className="w-full max-w-md glass-card p-8 space-y-6">
        <h1 className="gradient-text text-3xl font-bold text-center mb-8">
          Welcome to wiredFRONT
        </h1>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#9b87f5',
                  brandAccent: '#7E69AB',
                  inputBackground: 'transparent',
                  inputText: 'white',
                  inputBorder: '#4a4a4a',
                  inputBorderFocus: '#9b87f5',
                  inputBorderHover: '#7E69AB',
                }
              }
            },
            className: {
              container: 'space-y-4',
              button: 'w-full bg-neon-blue hover:bg-neon-pink text-white font-bold py-2 px-4 rounded transition-colors duration-300',
              input: 'w-full bg-dark-lighter/30 border border-white/10 rounded-md p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent',
              label: 'text-white/80',
              message: 'text-neon-pink',
              divider: 'text-white/50',
              anchor: 'text-neon-blue hover:text-neon-pink transition-colors duration-300',
            }
          }}
          theme="dark"
          providers={["github", "google"]}
          redirectTo={window.location.origin}
        />
      </div>
    </div>
  );
};

export default Login;