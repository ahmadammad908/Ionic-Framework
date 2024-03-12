// utils.tsx
export function getTheme(): string {
  // Logic to get theme from state or localStorage
  return "light"; // Placeholder value
}

export function isIos(): boolean {
  // Basic iOS detection, may not be very reliable
  const userAgent: string = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

export function setTheme(theme: string): void {
  // Logic to set theme to state or localStorage
  console.log("Setting theme to:", theme);
}
