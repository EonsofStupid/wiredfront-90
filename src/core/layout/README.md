
# Core Layout Components

This directory contains the core layout components for the wiredFRONT application. These components form the fundamental structure of the application and should not be modified without careful consideration.

## Structure

The core layout consists of the following components:

- `CoreLayoutContainer`: The root container for the application
- `CoreTopBar`: The top navigation bar
- `CoreLeftSidebar`: The left sidebar with main navigation
- `CoreRightSidebar`: The right sidebar for project details
- `CoreBottomBar`: The bottom status bar
- `CoreMainContent`: The main content area
- `CoreLayout`: Combines all of the above into a cohesive layout

## Usage

To use the core layout in your application, you have several options:

### 1. Use the MainLayout component (recommended)

```tsx
import { MainLayout } from "@/components/layout/MainLayout";

function MyPage() {
  return (
    <MainLayout>
      <h1>My Page Content</h1>
    </MainLayout>
  );
}
```

### 2. Use the HOC pattern

```tsx
import { withCoreLayout } from "@/core/layout/withCoreLayout";

function MyPage() {
  return <h1>My Page Content</h1>;
}

export default withCoreLayout(MyPage);
```

### 3. Use the core components directly

```tsx
import { CoreLayout } from "@/core/layout/CoreLayout";

function MyApp() {
  return (
    <CoreLayout>
      <MyRoutes />
    </CoreLayout>
  );
}
```

## Important Guidelines

1. **DO NOT MODIFY** the core layout components directly. They are designed to be stable and consistent.
2. Always use the provided CSS classes and variables when styling components to maintain consistency.
3. If you need a custom layout, create a new layout component that uses the core components.
4. Use the `z-index` variables defined in `types.ts` to ensure proper layering.

## CSS Classes

All core layout components have CSS classes with the prefix `wf-core-` to distinguish them from other components. For example:

- `.wf-core-layout-container`
- `.wf-core-topbar`
- `.wf-core-leftsidebar`

## Z-Index Management

Z-index values are centralized in the `LayoutZIndex` constant in `types.ts`. Always use these values to ensure consistent layering.

## Dimensions

Layout dimensions (heights, widths) are defined in the `LayoutDimensions` constant in `types.ts`. Use these values when referring to the size of core layout components.
