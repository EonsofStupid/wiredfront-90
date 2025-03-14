
import { toast } from "sonner";
import { logger } from "@/services/chat/LoggingService";

/**
 * NavigationService provides a safe way to navigate in the application
 * regardless of the underlying router implementation (Next.js, React Router, etc.)
 */
export const NavigationService = {
  /**
   * Navigate to a settings page with the specified tab
   */
  navigateToSettings: (section: string): void => {
    try {
      // Since we might be in different router contexts (Next.js or React Router)
      // we'll use a safe approach that falls back to direct URL navigation
      const url = `/settings?tab=${section}`;
      
      // Try to use history API first (works in both contexts)
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState({}, '', url);
        // Dispatch a popstate event to notify router
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
      }
      
      // Fallback to direct location change
      window.location.href = url;
    } catch (error) {
      logger.error("Navigation error:", error);
      toast.error("Navigation failed. Please try again.");
      
      // Final fallback
      if (typeof window !== 'undefined') {
        window.location.href = `/settings?tab=${section}`;
      }
    }
  },
  
  /**
   * Open an external URL safely
   */
  openExternalUrl: (url: string): void => {
    try {
      window.open(url, '_blank', 'noopener,noreferrer');
    } catch (error) {
      logger.error("External navigation error:", error);
      toast.error("Failed to open external link.");
    }
  },

  /**
   * Navigate to a project view
   */
  navigateToProject: (projectId: string, tab: string = 'overview'): void => {
    try {
      const url = `/projects/${projectId}?tab=${tab}`;
      
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState({}, '', url);
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
      }
      
      window.location.href = url;
    } catch (error) {
      logger.error("Project navigation error:", error);
      toast.error("Failed to navigate to project");
      
      if (typeof window !== 'undefined') {
        window.location.href = `/projects`;
      }
    }
  },

  /**
   * Navigate to RAG management 
   */
  navigateToRAG: (projectId?: string): void => {
    try {
      const url = projectId ? `/rag?projectId=${projectId}` : '/rag';
      
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState({}, '', url);
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
      }
      
      window.location.href = url;
    } catch (error) {
      logger.error("RAG navigation error:", error);
      toast.error("Failed to navigate to RAG management");
      
      if (typeof window !== 'undefined') {
        window.location.href = '/rag';
      }
    }
  },

  /**
   * Navigate to GitHub integration page
   */
  navigateToGitHub: (section: string = 'repositories'): void => {
    try {
      const url = `/github?section=${section}`;
      
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState({}, '', url);
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
      }
      
      window.location.href = url;
    } catch (error) {
      logger.error("GitHub navigation error:", error);
      toast.error("Failed to navigate to GitHub page");
      
      if (typeof window !== 'undefined') {
        window.location.href = '/github';
      }
    }
  }
};
