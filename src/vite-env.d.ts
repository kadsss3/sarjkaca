// FIX: Resolved "Cannot redeclare block-scoped variable 'process'" error.
// The declaration is wrapped in `declare global` and the file is treated as a module via `export {}`
// to correctly augment the global scope and avoid conflicts with other type definitions.

// Type definitions for the environment
// Replaces missing vite/client types
declare global {
  // FIX: Changed `const` to `var` to avoid "Cannot redeclare block-scoped variable" errors.
  // `var` allows for declaration merging with other global type definitions (e.g., from @types/node).
  var process: {
    env: {
      [key: string]: string | undefined;
    }
  };
}

export {};