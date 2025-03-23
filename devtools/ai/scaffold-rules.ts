
/**
 * WiredFront Scaffolding Rules
 * 
 * This file defines the rules and steps for scaffolding new features,
 * components, and modules in the WiredFront application.
 */

export const scaffoldRules = {
  /**
   * Feature Module Scaffolding
   * 
   * Steps and rules for creating a new feature module
   */
  featureModule: {
    steps: [
      'Create feature directory structure',
      'Create main feature component',
      'Create component sub-directory',
      'Create hooks sub-directory',
      'Create store or atoms based on state requirements',
      'Set up tests',
      'Register feature in relevant parent component or router'
    ],
    
    directoryStructure: `
      /src/components/{Feature}/
        ├── {Feature}.tsx           # Main component
        ├── components/             # Child components
        │   ├── {Feature}Header.tsx
        │   ├── {Feature}Content.tsx
        │   └── {Feature}Footer.tsx
        ├── hooks/                  # Custom hooks
        │   ├── use{Feature}State.ts
        │   └── use{Feature}Actions.ts
        ├── store/                  # Zustand store (if needed)
        │   ├── {feature}Store.ts
        │   └── types.ts
        ├── atoms/                  # Jotai atoms (if needed)
        │   ├── ui-atoms.ts
        │   └── state-atoms.ts
        └── utils/                  # Utilities
            └── {feature}Utils.ts
    `,
    
    requiredFiles: [
      '{Feature}.tsx',              // Main component
      'components/{Feature}Content.tsx', // Core content component
      'index.ts'                    // Exports
    ],
    
    optionalFiles: [
      'hooks/use{Feature}TrackedAtoms.ts', // For Jotai state
      'store/{feature}Store.ts',    // For Zustand state
      'atoms/ui-atoms.ts',          // For Jotai atoms
      'utils/{feature}Utils.ts',    // Feature-specific utilities
      'types.ts'                    // Feature-specific types
    ]
  },
  
  /**
   * State Management Scaffolding
   * 
   * Rules for creating state management for a new feature
   */
  stateManagement: {
    decisionTree: {
      useZustand: [
        'State needs to be accessed by multiple unrelated components',
        'State needs to persist across page reloads',
        'State represents application-level data',
        'State needs middleware for persistence, logging, etc.'
      ],
      useJotai: [
        'State is primarily used by a single component or closely related components',
        'State involves many derived values',
        'State primarily represents UI concerns',
        'State can be colocated with the component'
      ]
    },
    
    zustandScaffolding: [
      'Create types.ts with State and Actions interfaces',
      'Create store file with properly typed store',
      'Implement actions with immutable state updates',
      'Add middleware as needed (persist, devtools, etc.)',
      'Create selector hooks for consuming state and actions'
    ],
    
    jotaiScaffolding: [
      'Create atoms file with base atoms (not exported)',
      'Create tracked atoms with middleware',
      'Create derived atoms for computed values',
      'Create custom hook for consuming atoms',
      'Colocate atoms with their component'
    ]
  },
  
  /**
   * Component Scaffolding
   * 
   * Rules for creating a new component
   */
  component: {
    steps: [
      'Create component file with proper name',
      'Define props interface',
      'Implement component with proper typing',
      'Add needed hooks and state',
      'Add Tailwind classes for styling',
      'Handle accessibility concerns',
      'Add component to index.ts exports'
    ],
    
    template: `
      import React from 'react';
      
      interface {{ComponentName}}Props {
        // Define props here
      }
      
      export function {{ComponentName}}({ /* destructure props */ }: {{ComponentName}}Props) {
        // Hooks
        
        // Rendering
        return (
          <div className="...">
            {/* Component content */}
          </div>
        );
      }
    `,
    
    bestPractices: [
      'Keep components small and focused',
      'Extract complex logic to custom hooks',
      'Use shadcn/ui components where appropriate',
      'Properly type all props and state',
      'Use proper semantic HTML',
      'Ensure responsive design with Tailwind',
      'Add aria attributes for accessibility'
    ]
  },
  
  /**
   * Hook Scaffolding
   * 
   * Rules for creating a new hook
   */
  hook: {
    steps: [
      'Create hook file with proper name',
      'Define input parameters and return type',
      'Implement the hook logic',
      'Add error handling and validation',
      'Document the hook purpose and usage',
      'Add hook to index.ts exports if needed'
    ],
    
    template: `
      import { useState, useEffect } from 'react';
      
      interface {{HookName}}Options {
        // Define options here
      }
      
      interface {{HookName}}Result {
        // Define return values here
      }
      
      export function {{hookName}}(options: {{HookName}}Options): {{HookName}}Result {
        // Hook implementation
        
        return {
          // Return values
        };
      }
    `,
    
    bestPractices: [
      'Keep hooks focused on a single concern',
      'Properly type inputs and outputs',
      'Handle loading, error, and success states',
      'Clean up effects when necessary',
      'Add dependencies array to useEffect',
      'Memoize callbacks and computed values'
    ]
  },
  
  /**
   * Tracked Atoms Scaffolding
   * 
   * Rules for creating tracked atoms for a component
   */
  trackedAtoms: {
    steps: [
      'Create atoms file in atoms directory',
      'Define base atoms (not exported)',
      'Create tracked atoms with middleware',
      'Create derived atoms if needed',
      'Create custom hook for consuming tracked atoms',
      'Export tracked atoms and hook'
    ],
    
    template: `
      import { atom } from 'jotai';
      import { atomWithMiddleware } from '@/lib/jotai/middleware';
      
      // Base atoms - not exported, internal use only
      const base{{State}}Atom = atom<{{Type}}>(_initialValue_);
      
      // Tracked atoms - exported for use
      export const tracked{{State}}Atom = atomWithMiddleware(
        base{{State}}Atom,
        {
          onWrite: (next) => {
            // Validation, side effects, etc.
            return next;
          },
          debugLabel: '{{debugLabel}}'
        }
      );
      
      // Custom hook
      export function use{{Feature}}TrackedAtoms() {
        const [{{state}}, set{{State}}] = useAtom(tracked{{State}}Atom);
        
        return {
          {{state}},
          set{{State}}
        };
      }
    `,
    
    bestPractices: [
      'Never export base atoms',
      'Always wrap base atoms with middleware',
      'Add debug labels to all tracked atoms',
      'Group related atoms in a single file',
      'Create custom hooks for consuming tracked atoms',
      'Add validation logic in middleware when appropriate'
    ]
  }
};
