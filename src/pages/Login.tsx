import { Auth } from "@supabase/auth-ui-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/dashboard');
      }
    };
    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      if (event === 'SIGNED_IN' && session) {
        toast.success('Successfully logged in!');
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-dark/80 backdrop-blur-sm">
      <div className="w-full max-w-md glass-card relative z-[var(--z-content)] overflow-visible">
        <div className="p-8 space-y-6">
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
                    brand: 'rgb(var(--color-neon-blue))',
                    brandAccent: 'rgb(var(--color-neon-pink))',
                    inputBackground: 'rgba(0, 0, 0, 0.2)',
                    inputText: 'white',
                    inputBorder: 'rgba(255, 255, 255, 0.1)',
                    inputBorderFocus: 'rgb(var(--color-neon-blue))',
                    inputBorderHover: 'rgb(var(--color-neon-pink))',
                  }
                }
              },
              className: {
                container: 'space-y-4 relative z-[var(--z-content)]',
                button: 'w-full bg-neon-blue hover:bg-neon-pink text-white font-bold py-3 px-4 rounded-md transition-colors duration-300 relative z-[var(--z-content)]',
                input: 'w-full bg-dark-lighter/30 border border-white/10 rounded-md p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent relative z-[var(--z-content)]',
                label: 'text-white/80 block mb-2',
                message: 'text-neon-pink mt-2',
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
    </div>
  );
};

export default Login;