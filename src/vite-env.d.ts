// Type definitions for the environment
// Replaces missing vite/client types
declare global {
  // FIX: Changed `const` or `let` to `var` for the `process` declaration. This avoids a "Cannot redeclare block-scoped variable" error by allowing the declaration to be merged with any existing global definitions.
  var process: {
    env: {
      [key: string]: string | undefined;
    }
  };
}

export {};
