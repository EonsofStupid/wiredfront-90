
/**
 * WiredFront Component Policies
 * 
 * This file defines policies for components, including state management
 * approach, component boundaries, and scaffolding requirements.
 */

type StateType = 'local' | 'global' | 'split';
type ZustandUsage = boolean;
type JotaiUsage = boolean;
type TrackedAtomsUsage = boolean;

interface ComponentPolicy {
  state: StateType;
  zustand?: ZustandUsage;
  jotai?: JotaiUsage;
  hasTrackedAtoms?: TrackedAtomsUsage;
  modeLinked?: boolean;
  scaffolded?: boolean;
  usesVoice?: boolean;
  managedBy?: string;
  customizable?: boolean;
  type?: 'mode-aware' | 'static' | 'responsive';
}

/**
 * Component policies defining how each component should be implemented
 */
export const componentPolicies: Record<string, ComponentPolicy> = {
  // Chat Components
  'ChatPanel': {
    state: 'local',
    jotai: true,
    zustand: false,
    type: 'mode-aware',
    scaffolded: true,
    hasTrackedAtoms: true,
    usesVoice: true
  },
  
  'ChatMessage': {
    state: 'local',
    jotai: true,
    zustand: false,
    scaffolded: true,
    hasTrackedAtoms: true
  },
  
  'ChatInput': {
    state: 'local',
    jotai: true,
    zustand: false,
    scaffolded: true,
    hasTrackedAtoms: true,
    usesVoice: true
  },
  
  // Layout Components
  'Sidebar': {
    state: 'global',
    zustand: true,
    jotai: false,
    managedBy: 'layoutSlice',
    customizable: true
  },
  
  'TopBar': {
    state: 'global',
    zustand: true,
    jotai: false,
    managedBy: 'layoutSlice',
    customizable: true
  },
  
  'BottomBar': {
    state: 'global',
    zustand: true,
    jotai: false,
    managedBy: 'layoutSlice',
    customizable: true
  },
  
  // Feature Components
  'TrainingPanel': {
    state: 'split',
    zustand: true,
    jotai: true,
    modeLinked: true,
    hasTrackedAtoms: true
  },
  
  'DevPanel': {
    state: 'split',
    zustand: true,
    jotai: true,
    modeLinked: true,
    hasTrackedAtoms: true
  },
  
  'ImageGenPanel': {
    state: 'split',
    zustand: true,
    jotai: true,
    modeLinked: true,
    hasTrackedAtoms: true
  },
  
  'SearchPanel': {
    state: 'split',
    zustand: true,
    jotai: true,
    modeLinked: true,
    hasTrackedAtoms: true
  },
  
  // Project Components
  'ProjectList': {
    state: 'global',
    zustand: true,
    jotai: false
  },
  
  'ProjectDetails': {
    state: 'global',
    zustand: true,
    jotai: false
  },
  
  'ProjectActions': {
    state: 'local',
    jotai: true,
    hasTrackedAtoms: true
  },
  
  // Admin Components
  'AdminDashboard': {
    state: 'global',
    zustand: true,
    jotai: false
  },
  
  'UserManager': {
    state: 'global',
    zustand: true,
    jotai: false
  },
  
  'APIKeyManager': {
    state: 'global',
    zustand: true,
    jotai: false
  },
  
  'FeatureFlagManager': {
    state: 'global',
    zustand: true,
    jotai: false
  },
  
  // Authentication Components
  'LoginForm': {
    state: 'local',
    jotai: true,
    hasTrackedAtoms: true
  },
  
  'RegisterForm': {
    state: 'local',
    jotai: true,
    hasTrackedAtoms: true
  },
  
  'UserProfile': {
    state: 'global',
    zustand: true,
    jotai: false
  }
};

/**
 * Helper functions for component policies
 */
export const componentPolicyUtils = {
  /**
   * Check if a component should use Zustand for state management
   */
  shouldUseZustand(componentName: string): boolean {
    return componentPolicies[componentName]?.zustand || false;
  },
  
  /**
   * Check if a component should use Jotai for state management
   */
  shouldUseJotai(componentName: string): boolean {
    return componentPolicies[componentName]?.jotai || false;
  },
  
  /**
   * Check if a component should use tracked atoms
   */
  shouldUseTrackedAtoms(componentName: string): boolean {
    return componentPolicies[componentName]?.hasTrackedAtoms || false;
  },
  
  /**
   * Check if a component should be scaffolded
   */
  shouldBeScaffolded(componentName: string): boolean {
    return componentPolicies[componentName]?.scaffolded || false;
  },
  
  /**
   * Get the state type for a component
   */
  getStateType(componentName: string): StateType {
    return componentPolicies[componentName]?.state || 'local';
  },
  
  /**
   * Check if a component is linked to chat mode
   */
  isModeLinked(componentName: string): boolean {
    return componentPolicies[componentName]?.modeLinked || false;
  },
  
  /**
   * Get managing store for a component
   */
  getManagedBy(componentName: string): string | undefined {
    return componentPolicies[componentName]?.managedBy;
  }
};
