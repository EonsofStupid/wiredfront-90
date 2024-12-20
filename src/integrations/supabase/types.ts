export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      ai_memory: {
        Row: {
          context_key: string
          context_value: Json
          created_at: string | null
          expires_at: string | null
          id: string
          personality_id: string
        }
        Insert: {
          context_key: string
          context_value?: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
          personality_id: string
        }
        Update: {
          context_key?: string
          context_value?: Json
          created_at?: string | null
          expires_at?: string | null
          id?: string
          personality_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_memory_personality_id_fkey"
            columns: ["personality_id"]
            isOneToOne: false
            referencedRelation: "ai_personalities"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          metadata: Json | null
          status: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          metadata?: Json | null
          status?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_model_configs: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          local_model_path: string | null
          metadata: Json | null
          model_name: string
          model_type: string
          training_status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          local_model_path?: string | null
          metadata?: Json | null
          model_name: string
          model_type: string
          training_status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          local_model_path?: string | null
          metadata?: Json | null
          model_name?: string
          model_type?: string
          training_status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_personalities: {
        Row: {
          changed_by: string | null
          created_at: string | null
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          changed_by?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          changed_by?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      ai_personality_history: {
        Row: {
          changed_at: string | null
          changed_by: string
          changes: Json
          id: string
          personality_id: string
        }
        Insert: {
          changed_at?: string | null
          changed_by: string
          changes?: Json
          id?: string
          personality_id: string
        }
        Update: {
          changed_at?: string | null
          changed_by?: string
          changes?: Json
          id?: string
          personality_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_personality_history_personality_id_fkey"
            columns: ["personality_id"]
            isOneToOne: false
            referencedRelation: "ai_personalities"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_personality_traits: {
        Row: {
          created_at: string | null
          id: string
          personality_id: string
          trait_key: string
          trait_value: Json
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          personality_id: string
          trait_key: string
          trait_value?: Json
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          personality_id?: string
          trait_key?: string
          trait_value?: Json
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ai_personality_traits_personality_id_fkey"
            columns: ["personality_id"]
            isOneToOne: false
            referencedRelation: "ai_personalities"
            referencedColumns: ["id"]
          },
        ]
      }
      ai_settings: {
        Row: {
          api_key: string | null
          created_at: string | null
          id: string
          key: string
          metadata: Json | null
          provider: string | null
          updated_at: string | null
          user_id: string | null
          value: Json
          visual_effects: Json | null
        }
        Insert: {
          api_key?: string | null
          created_at?: string | null
          id?: string
          key: string
          metadata?: Json | null
          provider?: string | null
          updated_at?: string | null
          user_id?: string | null
          value?: Json
          visual_effects?: Json | null
        }
        Update: {
          api_key?: string | null
          created_at?: string | null
          id?: string
          key?: string
          metadata?: Json | null
          provider?: string | null
          updated_at?: string | null
          user_id?: string | null
          value?: Json
          visual_effects?: Json | null
        }
        Relationships: []
      }
      ai_tasks: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          priority: number | null
          prompt: string
          provider: string
          result: string | null
          status: string | null
          task_id: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          priority?: number | null
          prompt: string
          provider: string
          result?: string | null
          status?: string | null
          task_id: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          priority?: number | null
          prompt?: string
          provider?: string
          result?: string | null
          status?: string | null
          task_id?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_training_data: {
        Row: {
          category: string
          content: string
          created_at: string | null
          id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string | null
          id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_unified_config: {
        Row: {
          config_data: Json
          config_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          config_data?: Json
          config_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          config_data?: Json
          config_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      ai_work_items: {
        Row: {
          completed_at: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          output: string | null
          priority: number | null
          status: Database["public"]["Enums"]["chat_status"] | null
          task: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          output?: string | null
          priority?: number | null
          status?: Database["public"]["Enums"]["chat_status"] | null
          task: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          output?: string | null
          priority?: number | null
          status?: Database["public"]["Enums"]["chat_status"] | null
          task?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      component_themes: {
        Row: {
          component_type: string
          created_at: string | null
          id: string
          is_active: boolean | null
          styles: Json
          theme_name: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          component_type: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          styles?: Json
          theme_name: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          component_type?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          styles?: Json
          theme_name?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      custom_sections: {
        Row: {
          content: Json
          created_at: string | null
          id: string
          is_active: boolean | null
          position: number | null
          section_name: string
          theme_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          position?: number | null
          section_name: string
          theme_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: Json
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          position?: number | null
          section_name?: string
          theme_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "custom_sections_theme_id_fkey"
            columns: ["theme_id"]
            isOneToOne: false
            referencedRelation: "component_themes"
            referencedColumns: ["id"]
          },
        ]
      }
      discord_achievements: {
        Row: {
          achievement_type: string
          description: string | null
          earned_at: string | null
          id: string
          server_id: string
          title: string
          user_id: string | null
        }
        Insert: {
          achievement_type: string
          description?: string | null
          earned_at?: string | null
          id?: string
          server_id: string
          title: string
          user_id?: string | null
        }
        Update: {
          achievement_type?: string
          description?: string | null
          earned_at?: string | null
          id?: string
          server_id?: string
          title?: string
          user_id?: string | null
        }
        Relationships: []
      }
      discord_bot_config: {
        Row: {
          bot_token: string | null
          client_id: string
          created_at: string | null
          id: string
          is_active: boolean | null
          name: string | null
          server_count: number | null
          total_messages: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          bot_token?: string | null
          client_id: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          server_count?: number | null
          total_messages?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          bot_token?: string | null
          client_id?: string
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          server_count?: number | null
          total_messages?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      discord_bot_logs: {
        Row: {
          created_at: string | null
          id: string
          level: Database["public"]["Enums"]["log_level"]
          message: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level?: Database["public"]["Enums"]["log_level"]
          message: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: Database["public"]["Enums"]["log_level"]
          message?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      discord_quotes: {
        Row: {
          author: string | null
          content: string
          created_at: string | null
          id: string
          quote_type: Database["public"]["Enums"]["quote_type"]
          server_id: string
          tags: string[] | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string | null
          id?: string
          quote_type: Database["public"]["Enums"]["quote_type"]
          server_id: string
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string | null
          id?: string
          quote_type?: Database["public"]["Enums"]["quote_type"]
          server_id?: string
          tags?: string[] | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      discord_server_config: {
        Row: {
          created_at: string | null
          enabled_features: string[] | null
          id: string
          moderation_rules: Json | null
          prefix: string | null
          server_id: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          enabled_features?: string[] | null
          id?: string
          moderation_rules?: Json | null
          prefix?: string | null
          server_id: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          enabled_features?: string[] | null
          id?: string
          moderation_rules?: Json | null
          prefix?: string | null
          server_id?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      file_operations: {
        Row: {
          content: string | null
          created_at: string | null
          file_path: string
          id: string
          metadata: Json | null
          operation_type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          file_path: string
          id?: string
          metadata?: Json | null
          operation_type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          file_path?: string
          id?: string
          metadata?: Json | null
          operation_type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      github_integration: {
        Row: {
          auth_token: string | null
          auto_sync: boolean | null
          branch_name: string | null
          created_at: string | null
          id: string
          repository_url: string | null
          sync_frequency: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          auth_token?: string | null
          auto_sync?: boolean | null
          branch_name?: string | null
          created_at?: string | null
          id?: string
          repository_url?: string | null
          sync_frequency?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          auth_token?: string | null
          auto_sync?: boolean | null
          branch_name?: string | null
          created_at?: string | null
          id?: string
          repository_url?: string | null
          sync_frequency?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      layout_preferences: {
        Row: {
          bottom_bar_visible: boolean | null
          created_at: string | null
          id: string
          right_sidebar_open: boolean | null
          right_sidebar_width: number | null
          sidebar_open: boolean | null
          sidebar_width: number | null
          top_bar_visible: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bottom_bar_visible?: boolean | null
          created_at?: string | null
          id?: string
          right_sidebar_open?: boolean | null
          right_sidebar_width?: number | null
          sidebar_open?: boolean | null
          sidebar_width?: number | null
          top_bar_visible?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bottom_bar_visible?: boolean | null
          created_at?: string | null
          id?: string
          right_sidebar_open?: boolean | null
          right_sidebar_width?: number | null
          sidebar_open?: boolean | null
          sidebar_width?: number | null
          top_bar_visible?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          is_mobile_optimized: boolean | null
          last_seen: string | null
          theme_preference: string | null
          updated_at: string
          user_id: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_mobile_optimized?: boolean | null
          last_seen?: string | null
          theme_preference?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          is_mobile_optimized?: boolean | null
          last_seen?: string | null
          theme_preference?: string | null
          updated_at?: string
          user_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      setup_wizard_config: {
        Row: {
          ai_config: Json | null
          bot_config: Json | null
          created_at: string | null
          current_step: number | null
          environment_config: Json | null
          id: string
          setup_status: Database["public"]["Enums"]["setup_status"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          ai_config?: Json | null
          bot_config?: Json | null
          created_at?: string | null
          current_step?: number | null
          environment_config?: Json | null
          id?: string
          setup_status?: Database["public"]["Enums"]["setup_status"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          ai_config?: Json | null
          bot_config?: Json | null
          created_at?: string | null
          current_step?: number | null
          environment_config?: Json | null
          id?: string
          setup_status?: Database["public"]["Enums"]["setup_status"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      testing_environments: {
        Row: {
          created_at: string | null
          docker_config: Json | null
          environment_name: string
          framework: string
          id: string
          is_active: boolean | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          docker_config?: Json | null
          environment_name: string
          framework: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          docker_config?: Json | null
          environment_name?: string
          framework?: string
          id?: string
          is_active?: boolean | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      typing_status: {
        Row: {
          chat_id: string
          id: number
          is_typing: boolean | null
          last_updated: string | null
          user_id: string
        }
        Insert: {
          chat_id: string
          id?: number
          is_typing?: boolean | null
          last_updated?: string | null
          user_id: string
        }
        Update: {
          chat_id?: string
          id?: number
          is_typing?: boolean | null
          last_updated?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_visual_preferences: {
        Row: {
          created_at: string | null
          id: string
          prefer_high_performance: boolean | null
          reduced_motion: boolean | null
          theme_preference: string | null
          updated_at: string | null
          user_id: string | null
          visual_effects: Json | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          prefer_high_performance?: boolean | null
          reduced_motion?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string | null
          visual_effects?: Json | null
        }
        Update: {
          created_at?: string | null
          id?: string
          prefer_high_performance?: boolean | null
          reduced_motion?: boolean | null
          theme_preference?: string | null
          updated_at?: string | null
          user_id?: string | null
          visual_effects?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ai_provider:
        | "chatgpt"
        | "gemini"
        | "huggingface"
        | "anthropic"
        | "mistral"
        | "cohere"
      chat_status: "pending" | "processing" | "completed" | "failed"
      log_level: "info" | "warning" | "error"
      personality_trait: "friendly" | "professional" | "casual" | "technical"
      quote_type: "idiot" | "dope"
      setup_status: "not_started" | "in_progress" | "completed"
      task_type: "code" | "analysis" | "automation" | "data"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never