
# 🧠 WiredFront AI Development Tools

This folder contains internal rules, patterns, and scaffolding instructions for the **developer AI assistant**.

⚠️ These files are **NOT used by the runtime app AI**.

They guide:
- Code generation tools (ChatGPT, Copilot, CLI agents)
- Refactoring assistants
- AI-driven development workflows

## Purpose

These guidelines ensure that AI assistance for development follows consistent patterns,
enforces type safety, and adheres to the architectural decisions of the WiredFront application.

## Folder Structure

- `state-guidelines.ts`: Zustand + Jotai usage policies and best practices
- `store-structure.ts`: Directory and file patterns for state management
- `naming-conventions.ts`: Consistent naming for components, stores, and atoms
- `scaffold-rules.ts`: Instructions for creating new features or components
- `mode-switching-behavior.ts`: Logic for handling different application modes
- `git-auto-descriptions.ts`: Format for AI-generated commit messages
- `permissions-map.ts`: Role-based access control definitions
- `component-policies.ts`: Component boundaries and state management rules
- `type-sources.ts`: Source-of-truth for TypeScript types
- `scaffold-templates/`: Templates for generating new features
- `cli/`: Tooling for scaffolding via command line

## Usage

Reference these files when using AI assistance to generate code, refactor existing code,
or when manually implementing new features to ensure consistency across the codebase.
