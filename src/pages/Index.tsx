import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DraggableChat } from "@/components/chat/DraggableChat";
import { SetupWizard } from "@/components/setup/SetupWizard";
import { useAuthStore } from "@/stores/auth";

export default function Index() {
  const { user, loading } = useAuthStore();
  const navigate = useNavigate();
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    // If user is authenticated and setup is needed, show setup
    // Otherwise, if user is authenticated, redirect to dashboard
    if (!loading && user) {
      const hasCompletedSetup = localStorage.getItem('setupComplete');
      if (!hasCompletedSetup) {
        setShowSetup(true);
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  // Show nothing while loading
  if (loading) return null;

  return (
    <div className="relative min-h-screen">
      {showSetup && <SetupWizard onComplete={() => setShowSetup(false)} />}
      {user && <DraggableChat />}
    </div>
  );
}
