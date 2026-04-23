import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "./store";

// Typed hooks for use throughout the app
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

// Convenience selector hooks matching the old Zustand API
export const useIsAuthenticated = () =>
  useAppSelector((state) => state.auth.isAuthenticated);

export const useUser = () => useAppSelector((state) => state.auth.user);

export const useToken = () => useAppSelector((state) => state.auth.token);
