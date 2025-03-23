
/**
 * WiredFront Permissions Map
 * 
 * This file defines role-based permissions for the WiredFront application.
 * It's used for role-based visibility, runtime guards, admin UI scaffolding,
 * and AI scaffolding restrictions.
 */

// Import app roles from Supabase types
type AppRole = "super_admin" | "admin" | "developer" | "subscriber" | "guest";

// Define all possible permissions
export type Permission = 
  // User Management
  | 'manageUsers'
  | 'editRoles'
  | 'viewUsers'
  
  // Content Management
  | 'manageContent'
  | 'assignRoles'
  | 'viewAllProjects'
  
  // System Administration
  | 'viewLogs'
  | 'configureAI'
  | 'manageAPIKeys'
  | 'manageFeatureFlags'
  
  // Development
  | 'useDevTools'
  | 'triggerScaffolds'
  | 'manageRepositories'
  | 'accessAllCode'
  
  // Application Features
  | 'useAppFeatures'
  | 'useAdvancedAI'
  | 'useVectorSearch'
  | 'viewTraining'
  | 'generateImages'
  
  // Public Access
  | 'viewGallery'
  | 'browseDocs'
  | 'readPublicProjects';

/**
 * Permissions map defining which roles have which permissions
 */
export const permissionsMap: Record<AppRole, Permission[]> = {
  super_admin: [
    // User Management
    'manageUsers', 
    'editRoles', 
    'viewUsers',
    
    // Content Management
    'manageContent', 
    'assignRoles', 
    'viewAllProjects',
    
    // System Administration
    'viewLogs', 
    'configureAI', 
    'manageAPIKeys', 
    'manageFeatureFlags',
    
    // Development
    'useDevTools', 
    'triggerScaffolds', 
    'manageRepositories', 
    'accessAllCode',
    
    // Application Features
    'useAppFeatures', 
    'useAdvancedAI', 
    'useVectorSearch', 
    'viewTraining', 
    'generateImages',
    
    // Public Access
    'viewGallery', 
    'browseDocs', 
    'readPublicProjects'
  ],
  
  admin: [
    // User Management
    'viewUsers',
    
    // Content Management
    'manageContent', 
    'assignRoles', 
    'viewAllProjects',
    
    // System Administration
    'viewLogs', 
    'manageFeatureFlags',
    
    // Development
    'useDevTools', 
    'manageRepositories',
    
    // Application Features
    'useAppFeatures', 
    'useAdvancedAI', 
    'useVectorSearch', 
    'viewTraining', 
    'generateImages',
    
    // Public Access
    'viewGallery', 
    'browseDocs', 
    'readPublicProjects'
  ],
  
  developer: [
    // Content Management
    'viewAllProjects',
    
    // Development
    'useDevTools', 
    'triggerScaffolds', 
    'manageRepositories',
    
    // Application Features
    'useAppFeatures', 
    'useAdvancedAI', 
    'useVectorSearch', 
    'viewTraining', 
    'generateImages',
    
    // Public Access
    'viewGallery', 
    'browseDocs', 
    'readPublicProjects'
  ],
  
  subscriber: [
    // Application Features
    'useAppFeatures', 
    'useVectorSearch', 
    'viewTraining', 
    'generateImages',
    
    // Public Access
    'viewGallery', 
    'browseDocs', 
    'readPublicProjects'
  ],
  
  guest: [
    // Public Access
    'viewGallery', 
    'browseDocs', 
    'readPublicProjects'
  ]
};

/**
 * Helper function to check if a role has a specific permission
 */
export function hasPermission(role: AppRole, permission: Permission): boolean {
  return permissionsMap[role]?.includes(permission) || false;
}

/**
 * Helper to get all roles that have a specific permission
 */
export function getRolesWithPermission(permission: Permission): AppRole[] {
  return Object.entries(permissionsMap)
    .filter(([_, permissions]) => permissions.includes(permission))
    .map(([role]) => role as AppRole);
}

/**
 * UI Component visibility based on permissions
 */
export const componentPermissions = {
  // Admin components
  'AdminDashboard': ['manageUsers', 'editRoles', 'viewLogs'],
  'UserManagement': ['manageUsers', 'editRoles'],
  'APIKeyManagement': ['configureAI', 'manageAPIKeys'],
  'FeatureFlagPanel': ['manageFeatureFlags'],
  'SystemLogsPanel': ['viewLogs'],
  
  // Developer components
  'GitHubSyncPanel': ['useDevTools', 'manageRepositories'],
  'RepositoryManager': ['useDevTools', 'manageRepositories'],
  'VectorIndexingPanel': ['useDevTools', 'useVectorSearch'],
  
  // Feature components
  'AdvancedAIPanel': ['useAdvancedAI'],
  'VectorSearchPanel': ['useVectorSearch'],
  'ImageGenerationPanel': ['generateImages'],
  'TrainingModule': ['viewTraining']
};

/**
 * Get required permission for a component
 */
export function getRequiredPermissionsForComponent(componentName: string): Permission[] {
  return componentPermissions[componentName] || [];
}

/**
 * Check if a role can access a component
 */
export function canAccessComponent(role: AppRole, componentName: string): boolean {
  const requiredPermissions = getRequiredPermissionsForComponent(componentName);
  return requiredPermissions.every(permission => hasPermission(role, permission));
}
