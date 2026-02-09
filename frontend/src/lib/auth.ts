const ACCESS_KEY = "access_token";
const REFRESH_KEY = "refresh_token";

export function saveTokens(t: { access: string; refresh: string }) {
  localStorage.setItem(ACCESS_KEY, t.access);
  localStorage.setItem(REFRESH_KEY, t.refresh);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY);
}

export function logout() {
  localStorage.removeItem(ACCESS_KEY);
  localStorage.removeItem(REFRESH_KEY);
}