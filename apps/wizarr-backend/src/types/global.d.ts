export {}; // Ensure this is treated as a module

declare global {
  function env<T>(key: string, defaultValue?: T): T | undefined;
}