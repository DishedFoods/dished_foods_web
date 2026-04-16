/* ── Form validation matching Go backend requirements ─── */

export interface FieldError {
  field: string;
  message: string;
}

/** Backend requires: min 8 chars, 6+ letters, 1 special, 1 number, 1 letter */
export function validatePassword(pw: string): string | null {
  if (pw.length < 8) return "Password must be at least 8 characters";

  const letters = (pw.match(/[a-zA-Z]/g) || []).length;
  if (letters < 6) return "Password must contain at least 6 letters";

  if (!/[0-9]/.test(pw)) return "Password must contain at least 1 number";

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(pw))
    return "Password must contain at least 1 special character (!@#$%^&*...)";

  return null;
}

export function validateEmail(email: string): string | null {
  if (!email) return "Email is required";
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Please enter a valid email address";
  return null;
}

export function validateUsername(username: string): string | null {
  if (!username) return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters";
  if (!/^[a-zA-Z0-9_-]+$/.test(username))
    return "Username can only contain letters, numbers, hyphens, and underscores";
  return null;
}

export function validateRequired(value: string, label: string): string | null {
  if (!value.trim()) return `${label} is required`;
  return null;
}

/** Sanitize user input to prevent XSS */
export function sanitize(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
