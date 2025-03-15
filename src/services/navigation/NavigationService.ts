
import { toast } from "sonner";
import { logger } from "@/services/chat/LoggingService";
import { RouteLoggingService } from "./RouteLoggingService";

/**
 * NavigationService provides a centralized way to navigate in the application
 * and logs navigation events for analytics and debugging
 */
export const NavigationService = {
  /**
   * Navigate using the provided navigate function from useNavigate
   */
  navigate: (navigate: Function, to: string, options?: any): void => {
    try {
      // Capture previous route
      const from = window.location.pathname + window.location.search;
      
      // Perform navigation
      navigate(to, options);
      
      // Log the navigation event
      RouteLoggingService.logRouteChange(from, to);
    } catch (error) {
      logger.error("Navigation error:", error);
      toast.error("Navigation failed. Please try again.");
    }
  },
  
  /**
   * Navigate to a settings page with the specified tab
   * For use within component hooks where navigate is available
   */
  navigateToSettings: (navigate: Function, section: string): void => {
    try {
      const to = `/settings?tab=${section}`;
      NavigationService.navigate(navigate, to);
    } catch (error) {
      logger.error("Settings navigation error:", error);
      toast.error("Failed to navigate to settings");
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
  navigateToProject: (navigate: Function, projectId: string, tab: string = 'overview'): void => {
    try {
      const to = `/projects/${projectId}?tab=${tab}`;
      NavigationService.navigate(navigate, to);
    } catch (error) {
      logger.error("Project navigation error:", error);
      toast.error("Failed to navigate to project");
    }
  },

  /**
   * Navigate to RAG management 
   */
  navigateToRAG: (navigate: Function, projectId?: string): void => {
    try {
      const to = projectId ? `/rag?projectId=${projectId}` : '/rag';
      NavigationService.navigate(navigate, to);
    } catch (error) {
      logger.error("RAG navigation error:", error);
      toast.error("Failed to navigate to RAG management");
    }
  },

  /**
   * Navigate to GitHub integration page
   */
  navigateToGitHub: (navigate: Function, section: string = 'repositories'): void => {
    try {
      const to = `/github?section=${section}`;
      NavigationService.navigate(navigate, to);
    } catch (error) {
      logger.error("GitHub navigation error:", error);
      toast.error("Failed to navigate to GitHub page");
    }
  }
};
