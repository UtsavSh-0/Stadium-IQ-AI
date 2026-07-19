"use client";

/**
 * Shared authentication screen.
 *
 * Renders the branded two-column layout and the real Supabase auth form.
 * Used by both /login and /signup so there is a single source of truth for
 * authentication UI + logic (no duplicated demo code).
 *
 * Modes:
 *   login  - email + password sign-in (+ Google OAuth, forgot-password link)
 *   signup - create account (name + email + password), default role 'fan'
 *   forgot - request a password reset email
 *   reset  - set a new password after clicking the reset link (reads the
 *            session restored from the URL hash by @supabase/ssr)
 */
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Chrome,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Mail,
  Radio,
  TriangleAlert,
  User as UserIcon,
  UsersRound,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  loginSchema,
  signupSchema,
  resetPasswordSchema,
  emailSchema,
} from "@/lib/validation/auth";
import { homeForRole, DEMO_ACCOUNTS } from "@/lib/constants/auth";
import type { Database } from "@/types/database.types";

type Mode = "login" | "signup" | "forgot" | "reset";
type Role = Database["public"]["Enums"]["user_role"];

/**
 * Maps Supabase Auth errors to friendly, non-leaking messages.
 * Internal/raw error text is never surfaced to the user.
 */
function toFriendlyError(error: { message?: string } | null): string {
  const message = (error?.message ?? "").toLowerCase();

  if (!message) {
    return "Something went wrong. Please try again.";
  }
  if (message.includes("invalid login credentials")) {
    return "Invalid email or password. Please try again.";
  }
  if (message.includes("email not confirmed")) {
    return "Please confirm your email address before signing in.";
  }
  if (
    message.includes("already registered") ||
    message.includes("user already registered") ||
    message.includes("already been registered")
  ) {
    return "An account with this email already exists. Try signing in instead.";
  }
  if (message.includes("password should be at least")) {
    return "Password is too weak. Use at least 6 characters.";
  }
  if (
    message.includes("unable to validate email") ||
    message.includes("invalid email")
  ) {
    return "Please enter a valid email address.";
  }
  if (
    message.includes("network") ||
    message.includes("failed to fetch") ||
    message.includes("fetch failed")
  ) {
    return "Network error. Please check your connection and try again.";
  }
  if (message.includes("expired") || message.includes("token")) {
    return "This session or link has expired. Please request a new one.";
  }
  return "Something went wrong. Please try again.";
}

export function AuthScreen({ defaultMode = "login" }: { defaultMode?: Mode }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Support the password-reset deep link (/login?mode=reset#access_token=...).
  // Read once from window.location to avoid needing a Suspense boundary.
  useEffect(() => {
    if (
      defaultMode === "login" &&
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("mode") === "reset"
    ) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMode("reset");
    }
  }, [defaultMode]);

  const supabase = createClient();

  const redirectBase = () =>
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost:3000";

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const input = loginSchema.safeParse({ email, password });
    if (!input.success) {
      setError(input.error.issues[0].message);
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signInWithPassword(
      input.data
    );

    if (authError || !data.user) {
      setError(toFriendlyError(authError));
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("auth_user_id", data.user.id)
      .maybeSingle<{ role: Role }>();

    router.push(homeForRole(profile?.role));
  }

  async function handleSignup(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const input = signupSchema.safeParse({ fullName, email, password });
    if (!input.success) {
      setError(input.error.issues[0].message);
      setLoading(false);
      return;
    }

    const { data, error: authError } = await supabase.auth.signUp({
      email: input.data.email,
      password: input.data.password,
      options: {
        data: { full_name: input.data.fullName },
        emailRedirectTo: `${redirectBase()}/login`,
      },
    });

    if (authError || !data.user) {
      setError(toFriendlyError(authError));
      setLoading(false);
      return;
    }

    // If email confirmation is enabled there is no session yet; ask the user
    // to confirm. Otherwise (auto-confirm) we're already signed in.
    if (!data.session) {
      setMessage(
        "Account created! Check your email to confirm your address, then sign in."
      );
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("auth_user_id", data.user.id)
      .maybeSingle<{ role: Role }>();

    router.push(homeForRole(profile?.role));
  }

  async function handleForgot(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const input = emailSchema.safeParse(email);
    if (!input.success) {
      setError(input.error.issues[0].message);
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.resetPasswordForEmail(
      input.data,
      { redirectTo: `${redirectBase()}/login?mode=reset` }
    );

    if (authError) {
      setError(toFriendlyError(authError));
      setLoading(false);
      return;
    }

    setMessage("If that email exists, we've sent reset instructions. Check your inbox.");
    setLoading(false);
  }

  async function handleReset(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const input = resetPasswordSchema.safeParse({ password });
    if (!input.success) {
      setError(input.error.issues[0].message);
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.updateUser({
      password: input.data.password,
    });

    if (authError) {
      setError(toFriendlyError(authError));
      setLoading(false);
      return;
    }

    setMessage("Password updated. Redirecting to sign in…");
    setTimeout(() => router.push("/login"), 1200);
  }

  async function handleGoogle() {
    setLoading(true);
    setError(null);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${redirectBase()}/login` },
    });
  }

  const submitLabel: Record<Mode, string> = {
    login: "Sign in",
    signup: "Create account",
    forgot: "Send reset link",
    reset: "Update password",
  };

  return (
    <main className="auth-screen grid min-h-dvh bg-[#0c0e12] text-[#e2e2e8] lg:grid-cols-2">
      <section className="hidden border-r border-white/10 bg-[radial-gradient(circle_at_45%_35%,rgba(112,0,255,.25),transparent_34%)] p-10 lg:flex lg:flex-col">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-[#c3c5d9]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to StadiumIQ
        </Link>
        <div className="my-auto max-w-md">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#7000ff]">
            <Radio className="h-5 w-5" />
          </div>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[.2em] text-[#00e293]">
            FIFA World Cup 2026
          </p>
          <h1 className="mt-3 text-4xl font-bold">Your matchday starts here.</h1>
          <p className="mt-5 leading-7 text-[#c3c5d9]">
            Sign in to the Operations Command Center or your personal Fan
            Companion.
          </p>
        </div>
        <p className="text-xs text-[#c3c5d9]">Secured by Supabase Auth</p>
      </section>

      <section className="flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="mb-8 flex items-center gap-2 text-sm text-[#c3c5d9] lg:hidden"
          >
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>

          <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-[#00e293]">
            {mode === "signup"
              ? "Create account"
              : mode === "forgot"
                ? "Reset password"
                : mode === "reset"
                  ? "Set new password"
                  : "Sign in"}
          </p>
          <h1 className="mt-2 text-3xl font-bold">
            {mode === "signup"
              ? "Create your StadiumIQ account"
              : mode === "forgot"
                ? "Forgot your password?"
                : mode === "reset"
                  ? "Choose a new password"
                  : "Welcome back to StadiumIQ"}
          </h1>
          <p className="mt-2 text-sm text-[#c3c5d9]">
            {mode === "signup"
              ? "New here? Set up your account in seconds."
              : mode === "forgot"
                ? "Enter your email and we'll send a reset link."
                : mode === "reset"
                  ? "Enter a new password for your account."
                  : "Use your email and password to continue."}
          </p>

          {(error || message) && (
            <div
              className={`mt-5 flex items-start gap-2 rounded-xl border px-3 py-2.5 text-sm ${
                error
                  ? "border-red-400/30 bg-red-500/10 text-red-200"
                  : "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
              }`}
            >
              {error ? (
                <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" />
              ) : (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              )}
              <span>{error ?? message}</span>
            </div>
          )}

          {mode !== "reset" && (
            <button
              onClick={handleGoogle}
              disabled={loading}
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 text-sm font-semibold hover:bg-white/10 disabled:opacity-60"
            >
              <Chrome className="h-4 w-4 text-[#b7c4ff]" /> Continue with Google
            </button>
          )}

          {mode !== "reset" && (
            <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-wider text-[#8d90a2]">
              <span className="h-px flex-1 bg-white/10" />
              or email
              <span className="h-px flex-1 bg-white/10" />
            </div>
          )}

          <form
            onSubmit={
              mode === "login"
                ? handleLogin
                : mode === "signup"
                  ? handleSignup
                  : mode === "forgot"
                    ? handleForgot
                    : handleReset
            }
            className="space-y-4"
          >
            {mode === "signup" && (
              <label className="block text-sm font-medium">
                Full name
                <input
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="mt-2 h-11 w-full rounded-xl border border-white/15 bg-[#111318] px-3"
                  placeholder="Your name"
                />
              </label>
            )}

            {mode !== "reset" && (
              <label className="block text-sm font-medium">
                Email
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-[#8d90a2]" />
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-11 w-full rounded-xl border border-white/15 bg-[#111318] pl-10 pr-3"
                    placeholder="you@example.com"
                  />
                </div>
              </label>
            )}

            {mode !== "forgot" && (
              <label className="block text-sm font-medium">
                Password
                <div className="relative mt-2">
                  <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-[#8d90a2]" />
                  <input
                    required
                    type={show ? "text" : "password"}
                    autoComplete={mode === "login" ? "current-password" : "new-password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 w-full rounded-xl border border-white/15 bg-[#111318] pl-10 pr-10"
                    placeholder={mode === "reset" ? "New password" : "••••••••"}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-3 text-[#8d90a2]"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </label>
            )}

            {mode === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setMode("forgot");
                    setError(null);
                    setMessage(null);
                  }}
                  className="text-xs font-semibold text-[#b7c4ff] hover:underline"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#7000ff] to-[#b7c4ff] text-[#001452]"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === "login" ? (
                <ArrowRight className="h-4 w-4" />
              ) : mode === "signup" ? (
                <UserIcon className="h-4 w-4" />
              ) : mode === "forgot" ? (
                <Mail className="h-4 w-4" />
              ) : (
                <KeyRound className="h-4 w-4" />
              )}
              {submitLabel[mode]}
            </Button>
          </form>

          <p className="mt-5 text-center text-xs text-[#c3c5d9]">
            {mode === "login" && (
              <>
                New to StadiumIQ?{" "}
                <button
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setMessage(null);
                  }}
                  className="font-semibold text-[#b7c4ff] hover:underline"
                >
                  Sign up
                </button>
              </>
            )}
            {mode === "signup" && (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setMode("login");
                    setError(null);
                    setMessage(null);
                  }}
                  className="font-semibold text-[#b7c4ff] hover:underline"
                >
                  Log in
                </button>
              </>
            )}
            {(mode === "forgot" || mode === "reset") && (
              <button
                onClick={() => {
                  setMode("login");
                  setError(null);
                  setMessage(null);
                }}
                className="font-semibold text-[#b7c4ff] hover:underline"
              >
                Back to sign in
              </button>
            )}
          </p>

          {mode === "login" && (
            <div className="mt-5 rounded-xl border border-white/10 bg-white/[.03] p-3">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-[#8d90a2]">
                Demo accounts
              </p>
              <div className="space-y-2">
                {DEMO_ACCOUNTS.map((account) => (
                  <DemoAccount
                    key={account.email}
                    label={account.label}
                    email={account.email}
                    password={account.password}
                    onUse={() => {
                      setEmail(account.email);
                      setPassword(account.password);
                      setError(null);
                      setMessage(null);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-4 text-[10px] text-[#8d90a2]">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-[#c3c5d9]"
            >
              <Building2 className="h-3.5 w-3.5" /> Command Center
            </Link>
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-[#c3c5d9]"
            >
              <UsersRound className="h-3.5 w-3.5" /> Fan Companion
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/** Small row inside the "Demo accounts" box on the login screen. */
function DemoAccount({
  label,
  email,
  password,
  onUse,
}: {
  label: string;
  email: string;
  password: string;
  onUse: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-[#111318] px-3 py-2">
      <div className="min-w-0">
        <p className="truncate text-[11px] font-medium text-[#e2e2e8]">{label}</p>
        <p className="truncate text-[10px] text-[#8d90a2]">
          {email} · {password}
        </p>
      </div>
      <button
        type="button"
        onClick={onUse}
        className="shrink-0 rounded-md border border-white/15 px-2 py-1 text-[10px] font-semibold text-[#b7c4ff] hover:bg-white/10"
      >
        Use
      </button>
    </div>
  );
}
