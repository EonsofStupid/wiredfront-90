/**
 * WiredFront Feature Generator
 * 
 * This file provides a function for generating a new feature
 * based on templates in the scaffold-templates directory.
 */

import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);

interface TemplateMap {
  [key: string]: string[];
}

// Map of feature types to their template paths
const featureTemplates: TemplateMap = {
  chat: [
    'chat/ChatPanel.template.tsx',
    'chat/useChatTrackedAtoms.template.ts'
  ],
  training: [
    'training/TrainingPanel.template.tsx'
  ],
  dev: [],
  image: [],
  search: []
};

// Replace template tokens with actual values
function replaceTokens(content: string, replacements: Record<string, string>): string {
  let result = content;
  
  for (const [token, value] of Object.entries(replacements)) {
    const regex = new RegExp(`{{${token}}}`, 'g');
    result = result.replace(regex, value);
  }
  
  return result;
}

// Convert from camelCase to kebab-case
function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

// Ensure directory exists
async function ensureDir(dir: string): Promise<void> {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    if ((error as any).code !== 'EEXIST') {
      throw error;
    }
  }
}

/**
 * Generate a new feature based on templates
 */
export async function generateFeature(
  name: string,
  featureType: string = 'chat',
  scope: string = '',
  customPath: string = ''
): Promise<void> {
  // Capitalize first letter for component names
  const componentName = name.charAt(0).toUpperCase() + name.slice(1);
  const hookName = `use${componentName}`;
  const storeName = `${name.toLowerCase()}Store`;
  const featureName = name.toLowerCase();
  
  // Build the output directory path
  let outputDir = customPath;
  if (!outputDir) {
    outputDir = path.join(
      'src',
      'components',
      scope ? scope : '',
      featureName
    );
  }
  
  // Create replacements for tokens in templates
  const replacements = {
    FeatureName: componentName,
    featureName: featureName,
    hookName: hookName,
    storeName: storeName
  };
  
  // Create the output directory
  await ensureDir(outputDir);
  
  // Create subdirectories
  await ensureDir(path.join(outputDir, 'components'));
  await ensureDir(path.join(outputDir, 'hooks'));
  await ensureDir(path.join(outputDir, 'atoms'));
  
  if (featureType === 'chat' || featureType === 'training') {
    await ensureDir(path.join(outputDir, 'store'));
  }
  
  // Get templates for the feature type
  const templates = featureTemplates[featureType] || [];
  
  if (templates.length === 0) {
    throw new Error(`No templates found for feature type: ${featureType}`);
  }
  
  // Process each template
  for (const templatePath of templates) {
    const fullTemplatePath = path.join(__dirname, '..', 'scaffold-templates', templatePath);
    const templateContent = await readFile(fullTemplatePath, 'utf8');
    
    // Replace tokens in the template
    const processedContent = replaceTokens(templateContent, replacements);
    
    // Determine output file path based on template name
    const templateFileName = path.basename(templatePath);
    let outputFileName = templateFileName.replace('.template', '');
    
    // Replace feature name in output filename
    if (outputFileName.includes('Chat')) {
      outputFileName = outputFileName.replace('Chat', componentName);
    } else if (outputFileName.includes('Training')) {
      outputFileName = outputFileName.replace('Training', componentName);
    }
    
    // Determine the subdirectory based on the file type
    let subDir = '';
    if (outputFileName.startsWith('use') && outputFileName.endsWith('.ts')) {
      subDir = 'hooks';
    } else if (outputFileName.endsWith('Store.ts')) {
      subDir = 'store';
    } else if (outputFileName.endsWith('atoms.ts')) {
      subDir = 'atoms';
    } else if (outputFileName.endsWith('.tsx')) {
      // If it's the main component file, put it in the root
      // Otherwise, put it in the components directory
      if (outputFileName.startsWith(componentName)) {
        subDir = '';
      } else {
        subDir = 'components';
      }
    }
    
    // Write the processed content to the output file
    const outputFilePath = path.join(outputDir, subDir, outputFileName);
    await writeFile(outputFilePath, processedContent);
    
    console.log(`Generated: ${outputFilePath}`);
  }
  
  // Create a basic index.ts file
  const indexContent = `/**
 * ${componentName} Feature
 * 
 * This file exports the main components and hooks for the ${componentName} feature.
 */

export { ${componentName}Panel } from './${componentName}Panel';
export { use${componentName}TrackedAtoms } from './hooks/use${componentName}TrackedAtoms';
`;

  await writeFile(path.join(outputDir, 'index.ts'), indexContent);
  console.log(`Generated: ${path.join(outputDir, 'index.ts')}`);
  
  // For chat and training, create atoms files
  if (featureType === 'chat' || featureType === 'training') {
    const atomsContent = `/**
 * ${componentName} Atoms
 * 
 * This file defines Jotai atoms for the ${componentName} feature.
 */

import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { atomWithMiddleware } from '@/lib/jotai/middleware';
import type { ChatMessage } from '@/components/chat/types';

// Base atoms - internal use only, not exported
const baseIsVisibleAtom = atom(false);
const baseMessagesAtom = atom<ChatMessage[]>([]);
const baseInputValueAtom = atom('');

// Tracked atoms - exported for use
export const trackedIsVisibleAtom = atomWithMiddleware(
  baseIsVisibleAtom,
  {
    onWrite: (next) => next,
    debugLabel: '${featureName}IsVisible'
  }
);

export const trackedMessagesAtom = atomWithMiddleware(
  baseMessagesAtom,
  {
    onWrite: (next) => next,
    debugLabel: '${featureName}Messages'
  }
);

export const trackedInputValueAtom = atomWithMiddleware(
  baseInputValueAtom,
  {
    onWrite: (next) => next,
    debugLabel: '${featureName}InputValue'
  }
);

// Derived atoms
export const hasMessagesAtom = atom(
  (get) => get(trackedMessagesAtom).length > 0
);

export const messageCountAtom = atom(
  (get) => get(trackedMessagesAtom).length
);
`;

    await writeFile(path.join(outputDir, 'atoms', 'tracked-atoms.ts'), atomsContent);
    console.log(`Generated: ${path.join(outputDir, 'atoms', 'tracked-atoms.ts')}`);
  }
  
  console.log(`Feature ${componentName} successfully generated in ${outputDir}`);
}
