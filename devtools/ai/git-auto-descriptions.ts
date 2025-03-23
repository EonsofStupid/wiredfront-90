
/**
 * WiredFront Git Auto Descriptions
 * 
 * This file defines the format rules for AI-generated commit messages
 * and scope rules based on directory structure.
 */

export const gitAutoDescriptions = {
  /**
   * Commit Message Format
   * 
   * Rules for formatting commit messages
   */
  commitFormat: {
    template: '<type>(<scope>): <subject>',
    
    types: {
      feat: 'A new feature',
      fix: 'A bug fix',
      docs: 'Documentation only changes',
      style: 'Changes that do not affect the meaning of the code (formatting, etc.)',
      refactor: 'A code change that neither fixes a bug nor adds a feature',
      perf: 'A code change that improves performance',
      test: 'Adding missing tests or correcting existing tests',
      build: 'Changes that affect the build system or external dependencies',
      ci: 'Changes to CI configuration files and scripts',
      chore: 'Other changes that don\'t modify src or test files'
    },
    
    scopeRules: {
      components: 'Changes to UI components',
      store: 'Changes to state management',
      api: 'Changes to API integrations',
      auth: 'Changes to authentication',
      chat: 'Changes to chat functionality',
      rag: 'Changes to RAG/vector search',
      github: 'Changes to GitHub integration',
      admin: 'Changes to admin panels',
      ui: 'Changes to UI/UX',
      types: 'Changes to TypeScript types',
      hooks: 'Changes to React hooks',
      services: 'Changes to services',
      utils: 'Changes to utility functions',
      devtools: 'Changes to developer tools'
    },
    
    subjectRules: [
      'Use the imperative, present tense: "change" not "changed" nor "changes"',
      'Don\'t capitalize the first letter',
      'No dot (.) at the end',
      'Limit to 50 characters',
      'Describe what the change does, not what was done'
    ]
  },
  
  /**
   * Directory to Scope Mapping
   * 
   * Maps directories to commit message scopes
   */
  directoryToScope: {
    'src/components/chat': 'chat',
    'src/components/ui': 'ui',
    'src/components/admin': 'admin',
    'src/components/github': 'github',
    'src/components/layout': 'layout',
    'src/stores': 'store',
    'src/hooks': 'hooks',
    'src/services': 'services',
    'src/types': 'types',
    'src/utils': 'utils',
    'src/pages': 'pages',
    'src/schema': 'schema',
    'supabase/functions': 'api',
    'devtools': 'devtools'
  },
  
  /**
   * Examples of Good Commit Messages
   */
  examples: {
    feature: 'feat(chat): add voice message transcription',
    bugfix: 'fix(github): resolve repository sync failing with large files',
    refactor: 'refactor(store): migrate chat state to zustand',
    performance: 'perf(rag): optimize vector search algorithm',
    documentation: 'docs(api): update API documentation with new endpoints',
    testing: 'test(hooks): add unit tests for session hooks',
    styling: 'style(ui): improve dark mode contrast ratios'
  },
  
  /**
   * Auto-Generation Rules
   * 
   * Rules for automatically generating commit messages
   */
  autoGeneration: {
    analyzeChanges: [
      'Determine primary change type (feat, fix, etc.)',
      'Identify affected directories to determine scope',
      'Summarize changes in concise subject line',
      'If complexity warrants, add body text explanation',
      'Reference issues by number if applicable'
    ],
    
    implementation: `
      // Example function for auto-generating commit messages
      export function generateCommitMessage(changes: FileChange[]): string {
        // Determine the type of change
        const type = determineChangeType(changes);
        
        // Determine the scope based on affected directories
        const scope = determineScope(changes);
        
        // Generate a concise subject
        const subject = summarizeChanges(changes);
        
        // Format according to template
        return \`\${type}(\${scope}): \${subject}\`;
      }
      
      // Helper functions
      function determineChangeType(changes: FileChange[]): string {
        // Logic to determine if this is a feat, fix, refactor, etc.
      }
      
      function determineScope(changes: FileChange[]): string {
        // Logic to extract the scope from affected directories
      }
      
      function summarizeChanges(changes: FileChange[]): string {
        // Logic to create a concise summary of changes
      }
    `
  }
};
