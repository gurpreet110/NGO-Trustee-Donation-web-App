// Simulate network latency for realistic async behavior.
export const delay = (data, ms = 400) =>
  new Promise((resolve) => setTimeout(() => resolve(data), ms));
