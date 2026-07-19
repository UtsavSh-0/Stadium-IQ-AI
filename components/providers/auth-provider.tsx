"use client";

/**
 * Client-side authentication provider.
 *
 * Wraps the browser Supabase client in a React context so any client
 * component can read the current user + app profile without refetching it
 * independently. It also owns the auth state listener (STEP 5:
 * `onAuthStateChange`) so the UI updates automatically on sign-in,
 * sign-out, token refresh, and password resets performed from the URL hash.
 *
 * Server Components / Route Handlers should NOT use this — they read the
 * session directly via `lib/supabase/server.ts` and `lib/auth/guards.ts`.
 */
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import type { User as AuthUser } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { createClient } from "@/lib/supabase/client";

type Role = Database["public"]["Enums"]["user_role"];

export interface AppProfile {
  full_name: string | null;
  email: string;
  role: Role;
  avatar_url: string | null;
}

interface AuthContextValue {
  /** Supabase Auth user (null when signed out). */
  user: AuthUser | null;
  /** App-level profile from public.users (null until loaded / when missing). */
  profile: AppProfile | null;
  /** True until the initial session + profile lookup has settled. */
  loading: boolean;
  /** Signs the user out and redirects to /login. */
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function loadProfile(
  supabase: ReturnType<typeof createClient>,
  authUserId: string
): Promise<AppProfile | null> {
  const { data } = await supabase
    .from("users")
    .select("full_name, email, role, avatar_url")
    .eq("auth_user_id", authUserId)
    .maybeSingle<AppProfile>();

  return data ?? null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<AppProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let active = true;

    // Initial session resolution + profile load.
    supabase.auth.getUser().then(async ({ data }) => {
      if (!active) return;
      const authUser = data.user ?? null;
      setUser(authUser);
      if (authUser) {
        setProfile(await loadProfile(supabase, authUser.id));
      }
      setLoading(false);
    });

    // Keep state in sync with Supabase Auth for the lifetime of the page:
    // sign-in, sign-out, token refresh, and password resets from the URL.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!active) return;
      const authUser = session?.user ?? null;
      setUser(authUser);
      if (authUser) {
        setProfile(await loadProfile(supabase, authUser.id));
      } else {
        setProfile(null);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
