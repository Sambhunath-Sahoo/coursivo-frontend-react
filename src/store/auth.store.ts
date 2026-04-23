/**
 * Compatibility re-export layer.
 * All consumer files now import from here; the actual logic lives in
 * auth.slice.ts  (actions) and hooks.ts (selector hooks).
 */
export { setAuth, logout } from "./auth.slice";
export { useIsAuthenticated, useUser, useToken, useAppDispatch } from "./hooks";
