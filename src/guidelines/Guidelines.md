**Add your own guidelines here**
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->

# Lumen Development Guidelines

This document outlines the development guidelines, coding standards, and best practices for the Lumen student management platform.

## Table of Contents

1. [General Guidelines](#general-guidelines)
2. [Code Structure](#code-structure)
3. [TypeScript Guidelines](#typescript-guidelines)
4. [React Component Guidelines](#react-component-guidelines)
5. [UI/UX Guidelines](#uiux-guidelines)
6. [State Management](#state-management)
7. [File Organization](#file-organization)
8. [Performance Guidelines](#performance-guidelines)
9. [Accessibility Guidelines](#accessibility-guidelines)
10. [Testing Guidelines](#testing-guidelines)

## General Guidelines

### Code Quality
- Write clean, readable, and maintainable code
- Follow the DRY (Don't Repeat Yourself) principle
- Use meaningful variable and function names
- Keep functions small and focused on a single responsibility
- Comment complex logic and business rules
- Refactor code regularly to prevent technical debt

### Version Control
- Use meaningful commit messages following conventional commits format
- Create feature branches for new functionality
- Keep commits small and focused
- Review code before merging to main branch

## Code Structure

### Component Architecture
```
ComponentName/
├── ComponentName.tsx      # Main component file
├── ComponentName.types.ts # Type definitions (if complex)
├── index.ts              # Export file
└── README.md            # Component documentation (if needed)
```

### Import Order
1. React and React-related imports
2. Third-party library imports
3. Internal components and utilities
4. Type imports
5. Relative imports

```typescript
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import type { User, Activity } from "../../App";
import { toast } from "sonner";
```

## TypeScript Guidelines

### Type Definitions
- Define interfaces for all props and complex objects
- Use union types for limited string values
- Prefer interfaces over types for object shapes
- Use generic types when appropriate

```typescript
interface StudentDashboardProps {
  user: User;
  activities: Activity[];
  onAddActivity: (activity: Omit<Activity, 'id'>) => void;
}

type ActivityStatus = 'pending' | 'approved' | 'rejected';
```

### Type Safety
- Enable strict mode in TypeScript configuration
- Avoid `any` type - use `unknown` if necessary
- Use type assertions sparingly and with proper guards
- Implement proper error handling with typed errors

## React Component Guidelines

### Functional Components
- Use functional components with hooks exclusively
- Implement proper cleanup in useEffect hooks
- Use custom hooks for shared logic
- Keep components focused and single-purpose

```typescript
export function StudentDashboard({ user, activities, onAddActivity }: StudentDashboardProps) {
  const [selectedTab, setSelectedTab] = useState('all');
  
  useEffect(() => {
    // Effect logic with proper cleanup
    return () => {
      // Cleanup
    };
  }, [dependency]);

  return (
    // JSX
  );
}
```

### State Management
- Use `useState` for local component state
- Use `useReducer` for complex state logic
- Lift state up when shared between components
- Use context sparingly for truly global state

### Event Handling
- Use arrow functions for event handlers
- Implement proper error handling in async operations
- Provide user feedback for all actions

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await onSubmit(formData);
    toast.success("Activity submitted successfully!");
  } catch (error) {
    toast.error("Failed to submit activity");
    console.error(error);
  }
};
```

## UI/UX Guidelines

### Design System
- Use shadcn/ui components consistently
- Follow the established color scheme and typography
- Maintain consistent spacing using Tailwind CSS classes
- Ensure responsive design across all breakpoints

### Component Styling
- Use Tailwind CSS utility classes
- Create custom CSS classes only when necessary
- Use CSS variables for theme colors
- Implement dark mode support where applicable

### Responsive Design
- Mobile-first approach
- Use responsive classes (sm:, md:, lg:, xl:)
- Test on multiple screen sizes
- Ensure touch targets are appropriately sized

### User Feedback
- Provide loading states for async operations
- Show success/error messages using toast notifications
- Implement proper form validation with clear error messages
- Use skeleton loaders for better perceived performance

## State Management

### Local State
```typescript
// Good: Local state for component-specific data
const [isLoading, setIsLoading] = useState(false);
const [formData, setFormData] = useState(initialFormData);
```

### Prop Drilling
- Avoid excessive prop drilling (max 2-3 levels)
- Use composition over prop drilling when possible
- Consider context for deeply nested shared state

### Data Flow
- Keep data flow unidirectional
- Use callback functions for child-to-parent communication
- Validate data at component boundaries

## File Organization

### Folder Structure
```
src/
├── components/
│   ├── shared/           # Reusable components
│   ├── student/          # Student-specific components
│   ├── faculty/          # Faculty-specific components
│   ├── admin/            # Admin-specific components
│   └── ui/               # UI primitives
├── hooks/                # Custom hooks
├── types/                # Global type definitions
├── utils/                # Utility functions
└── styles/               # Global styles
```

### File Naming
- Use PascalCase for component files
- Use camelCase for utility files and hooks
- Use kebab-case for CSS files
- Be descriptive and consistent

## Performance Guidelines

### Component Optimization
- Use React.memo for expensive renders
- Implement proper key props for lists
- Avoid inline object creation in renders
- Use useCallback and useMemo judiciously

```typescript
// Good: Memoized expensive calculation
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Good: Stable callback reference
const handleClick = useCallback((id: string) => {
  onItemClick(id);
}, [onItemClick]);
```

### Bundle Size
- Use dynamic imports for code splitting
- Import only necessary parts of libraries
- Optimize images and assets
- Monitor bundle size regularly

## Accessibility Guidelines

### Semantic HTML
- Use appropriate HTML elements
- Implement proper heading hierarchy
- Use landmark elements (nav, main, aside)
- Provide alternative text for images

### Keyboard Navigation
- Ensure all interactive elements are keyboard accessible
- Implement logical tab order
- Provide visible focus indicators
- Support escape key for closing modals

### Screen Readers
- Use proper ARIA labels and descriptions
- Implement live regions for dynamic content
- Provide meaningful error messages
- Test with screen reader software

### Color and Contrast
- Ensure sufficient color contrast ratios
- Don't rely solely on color for information
- Support high contrast mode
- Test with color blindness simulators

## Testing Guidelines

### Unit Testing
- Test component behavior, not implementation
- Use meaningful test descriptions
- Test error states and edge cases
- Mock external dependencies appropriately

### Integration Testing
- Test user workflows end-to-end
- Verify data flow between components
- Test form submissions and validations
- Ensure proper error handling

### Manual Testing
- Test on multiple browsers and devices
- Verify responsive behavior
- Test with assistive technologies
- Validate against design specifications

## Error Handling

### Component Error Boundaries
```typescript
// Implement error boundaries for robust error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }

    return this.props.children;
  }
}
```

### Async Error Handling
```typescript
// Proper async error handling with user feedback
const handleAsyncOperation = async () => {
  try {
    setIsLoading(true);
    const result = await riskyOperation();
    setData(result);
    toast.success("Operation completed successfully");
  } catch (error) {
    console.error("Operation failed:", error);
    toast.error("Operation failed. Please try again.");
  } finally {
    setIsLoading(false);
  }
};
```

## Security Guidelines

### Input Validation
- Validate all user inputs on both client and server
- Sanitize data before displaying
- Use proper form validation
- Implement file upload restrictions

### Authentication
- Never store sensitive data in localStorage
- Implement proper session management
- Use secure HTTP headers
- Validate user permissions for all actions

## Documentation

### Code Documentation
- Document complex business logic
- Provide examples for reusable components
- Keep documentation up to date
- Use JSDoc for function documentation

### Component Documentation
```typescript
/**
 * StudentDashboard component for displaying student activities and statistics
 * 
 * @param user - The current user object
 * @param activities - Array of student activities
 * @param onAddActivity - Callback function for adding new activities
 */
export function StudentDashboard({ user, activities, onAddActivity }: StudentDashboardProps) {
  // Component implementation
}
```

## Best Practices Summary

1. **Consistency**: Follow established patterns and conventions
2. **Simplicity**: Keep code simple and readable
3. **Performance**: Optimize for user experience
4. **Accessibility**: Ensure the application is usable by everyone
5. **Security**: Implement proper security measures
6. **Testing**: Write tests for critical functionality
7. **Documentation**: Keep code well-documented
8. **Collaboration**: Write code that others can easily understand and maintain

---

These guidelines should be followed by all contributors to ensure code quality, maintainability, and consistency across the Lumen platform.
