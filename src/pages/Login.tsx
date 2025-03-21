
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth";
import { getLoginRedirectUrl } from "@/utils/auth";

const Login = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  
  useEffect(() => {
    // If user is already authenticated, redirect
    if (isAuthenticated && user) {
      const redirectUrl = getLoginRedirectUrl();
      navigate(redirectUrl, { replace: true });
    }
  }, [isAuthenticated, user, navigate]);

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
            providers={[]}
            redirectTo={window.location.origin}
            onlyThirdPartyProviders={false}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Sign In',
                  loading_button_label: 'Signing in...',
                  social_provider_text: 'Sign in with {{provider}}',
                  link_text: "Already have an account? Sign in",
                },
                sign_up: {
                  email_label: 'Email',
                  password_label: 'Password',
                  button_label: 'Sign Up',
                  loading_button_label: 'Signing up...',
                  social_provider_text: 'Sign up with {{provider}}',
                  link_text: "Don't have an account? Sign up",
                },
              },
            }}
            view="sign_in"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
