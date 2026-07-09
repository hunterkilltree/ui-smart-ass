"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { ApiError, getToken, setToken, setUnauthorizedHandler } from "./api";
import { AuthAPI } from "./be";
import type { User } from "./types";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  /**
   * Set when the boot-time session check failed for a non-auth reason
   * (network blip, server error). The token is kept so the session can be
   * recovered — call retry() to re-run the check.
   */
  bootError: ApiError | null;
  retry: () => void;
  signIn: (email: string, password: string, next?: string) => Promise<void>;
  signUp: (email: string, password: string, next?: string) => Promise<void>;
  signOut: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

/** Only allow internal paths as post-auth destinations. */
function safeNext(next: string | undefined): string {
  if (next && next.startsWith("/") && !next.startsWith("//")) return next;
  return "/dashboard";
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [bootError, setBootError] = useState<ApiError | null>(null);
  const router = useRouter();

  // Monotonic counter guarding against stale async results: any explicit
  // auth transition (sign-in, sign-out, cross-tab change) bumps it, and
  // in-flight me() responses from an older epoch are ignored so they can
  // never clobber a fresher session.
  const epochRef = useRef(0);

  const loadUser = useCallback(() => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setBootError(null);
      setLoading(false);
      return;
    }
    const epoch = ++epochRef.current;
    setLoading(true);
    setBootError(null);
    AuthAPI.me()
      .then((u) => {
        if (epoch !== epochRef.current) return; // stale — a newer transition won
        setUser(u);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (epoch !== epochRef.current) return;
        if (err instanceof ApiError && err.status === 401) {
          // The session is genuinely invalid — only then drop the token.
          setToken(null);
          setUser(null);
        } else {
          // Network/server blip: keep the token so a retry or the next
          // reload can recover the session instead of forcing a re-login.
          setBootError(
            err instanceof ApiError
              ? err
              : new ApiError(0, "Network request failed", "network")
          );
        }
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  // Central 401 handling: any session-authenticated request that comes back
  // 401 mid-session ends the session and returns the user to sign-in.
  useEffect(() => {
    setUnauthorizedHandler((usedToken) => {
      // Ignore stale failures from a token that has already been replaced
      // (e.g. a slow request from before a fresh sign-in settles late).
      if (usedToken !== null && usedToken !== getToken()) return;
      epochRef.current++;
      setToken(null);
      setUser(null);
      setBootError(null);
      setLoading(false);
      const path =
        typeof window !== "undefined" ? window.location.pathname : "";
      router.replace(
        path.startsWith("/dashboard")
          ? `/sign-in?next=${encodeURIComponent(path)}`
          : "/sign-in"
      );
    });
    return () => setUnauthorizedHandler(null);
  }, [router]);

  // Keep tabs in sync: signing out (or in) in one tab updates the others.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== "token" && e.key !== null) return;
      const token = getToken();
      if (!token) {
        // Signed out elsewhere.
        epochRef.current++;
        setUser(null);
        setBootError(null);
        setLoading(false);
      } else {
        // Signed in (or token replaced) elsewhere — rehydrate this tab.
        loadUser();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [loadUser]);

  const signIn = async (email: string, password: string, next?: string) => {
    const res = await AuthAPI.signIn(email, password);
    epochRef.current++; // invalidate any in-flight me() from the old session
    setToken(res.token);
    setUser(res.user);
    setBootError(null);
    setLoading(false);
    // replace (not push) so Back does not return to the credentials form.
    router.replace(safeNext(next));
  };

  const signUp = async (email: string, password: string, next?: string) => {
    const res = await AuthAPI.signUp(email, password);
    epochRef.current++;
    setToken(res.token);
    setUser(res.user);
    setBootError(null);
    setLoading(false);
    router.replace(safeNext(next));
  };

  const signOut = () => {
    epochRef.current++;
    setToken(null);
    setUser(null);
    setBootError(null);
    setLoading(false);
    router.replace("/sign-in");
  };

  return (
    <Ctx.Provider
      value={{
        user,
        loading,
        bootError,
        retry: loadUser,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
