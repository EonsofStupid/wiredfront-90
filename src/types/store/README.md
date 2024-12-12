# Store Types Documentation

This directory contains TypeScript types and interfaces for the application's state management system.

## Core Types

- `AsyncState`: Base interface for async operations
- `BaseState`: Common state properties
- `RedisConfig`: Redis connection configuration
- `CacheConfig`: Cache settings and configuration
- `StoreConfig`: Store persistence and configuration

## Store-Specific Types

### Auth Store
- `AuthState`: User authentication state
- `AuthActions`: Authentication operations
- `AuthStore`: Combined auth state and actions

### Settings Store
- `SettingsState`: Application settings
- `SettingsActions`: Settings operations
- `SettingsStore`: Combined settings state and actions

### UI Store
- `UIState`: Theme and layout preferences
- `UIActions`: UI operations
- `UIStore`: Combined UI state and actions

### Cache Store
- `CacheState`: Cache configuration and status
- `CacheActions`: Cache operations
- `CacheStore`: Combined cache state and actions

## Type Guards and Validation

The `guards.ts` file provides type guards and validation utilities:
- `isValidAction`: Validates action objects
- `hasPayload`: Checks for valid action payloads
- `isUser`, `isAsyncState`, etc.: Type-specific guards
- `isValidStateUpdate`: Validates state updates
- `assertType`: Type assertion with runtime validation

## Selectors

The `selectors.ts` file defines types for efficient state access:
- `StoreSelector`: Base selector type
- `StoreSelectors`: Common selectors interface
- `SelectorHook`: Custom selector hooks

## Middleware

The `middleware.ts` file contains types for:
- Store persistence configuration
- Development tools setup
- State hydration utilities

## Usage

```typescript
import { AuthStore, isUser, StoreSelector } from '@/types/store';

// Type guard usage
const validateUser = (data: unknown) => {
  if (isUser(data)) {
    // data is typed as User
    return data;
  }
  throw new Error('Invalid user data');
};

// Selector usage
const selectUserEmail: StoreSelector<string | null> = (state) => 
  state.user?.email ?? null;
```