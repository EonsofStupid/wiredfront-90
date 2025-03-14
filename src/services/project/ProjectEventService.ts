
import { supabase } from "@/integrations/supabase/client";

export class ProjectEventService {
  static async logProjectCreation(projectId: string, metadata: any) {
    try {
      await supabase
        .from("github_metrics")
        .insert({
          metric_type: "project_created",
          value: 1,
          metadata: {
            projectId,
            ...metadata
          }
        });
      
      return true;
    } catch (error) {
      console.error("Error logging project creation:", error);
      return false;
    }
  }
  
  static async logProjectImport(projectId: string, repoUrl: string, metadata: any = {}) {
    try {
      await supabase
        .from("github_metrics")
        .insert({
          metric_type: "project_imported",
          value: 1,
          metadata: {
            projectId,
            repoUrl,
            ...metadata
          }
        });
      
      return true;
    } catch (error) {
      console.error("Error logging project import:", error);
      return false;
    }
  }
  
  static async logGitHubAction(actionType: string, projectId: string, metadata: any = {}) {
    try {
      await supabase
        .from("github_metrics")
        .insert({
          metric_type: `github_${actionType}`,
          value: 1,
          metadata: {
            projectId,
            ...metadata
          }
        });
      
      return true;
    } catch (error) {
      console.error(`Error logging GitHub action ${actionType}:`, error);
      return false;
    }
  }
}
