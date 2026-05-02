import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/api/auth.service";
import { useAppDispatch } from "@/store/hooks";
import { setAuth } from "@/store/auth.slice";
import { decodeToken } from "@/lib/jwt";

// ─── Demo Credentials ─────────────────────────────────────────────────────────

const DEMO_ACCOUNTS = [
  {
    label: "Demo Educator",
    email: "rahul@gmail.com",
    password: "3Tr3ogG(!}zy55hl>5E",
  },
  {
    label: "Demo Student",
    email: "vishalstu@yopmail.com",
    password: "123456",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignIn() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [appliedDemo, setAppliedDemo] = useState<string | null>(null);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setAppliedDemo(null);
  };

  const applyDemo = (account: (typeof DEMO_ACCOUNTS)[number]) => {
    setFormData({ email: account.email, password: account.password });
    setAppliedDemo(account.label);
    toast.info(`${account.label} credentials applied!`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { token } = await authService.login({
        email: formData.email,
        password: formData.password,
      });
      const decodedUser = decodeToken(token);
      dispatch(setAuth(token));
      toast.success("Welcome back!");
      if (decodedUser?.role === "INSTRUCTOR") {
        navigate("/instructor/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-zinc-900 antialiased">

      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-zinc-950 p-12 xl:p-16">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="h-4 w-4 rounded-sm bg-white transition-transform group-hover:scale-110" />
          <span className="text-sm font-semibold text-white">Coursivo</span>
        </Link>

        {/* Middle copy */}
        <div className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
            Welcome back
          </p>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white xl:text-5xl">
            The easiest way to create, sell &amp; grow your courses
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
            Continue where you left off. Thousands of learners and instructors
            are already building with Coursivo.
          </p> 

          {/* Social proof strip */}
          <div className="flex items-center gap-6 border-t border-zinc-800 pt-6">
            {[
              { value: "500+", label: "Courses" },
              { value: "10K+", label: "Students" },
              { value: "100+", label: "Instructors" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-2xl font-semibold text-white">{value}</div>
                <div className="mt-0.5 text-[11px] font-semibold uppercase tracking-widest text-zinc-500">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-zinc-600">
          © 2026 Coursivo Technologies Pvt. Ltd.
        </p>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">

          {/* Mobile logo */}
          <Link
            to="/"
            className="mb-8 flex items-center gap-2 lg:hidden"
          >
            <div className="h-4 w-4 rounded-sm bg-zinc-900" />
            <span className="text-sm font-semibold text-zinc-900">Coursivo</span>
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">
              Sign in to your account
            </h2>
            <p className="mt-1.5 text-sm text-zinc-500">
              Enter your credentials to continue
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="email"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                autoComplete="email"
                className="h-11 rounded-lg border-zinc-200 bg-zinc-50 text-sm placeholder:text-zinc-400 focus-visible:border-zinc-900 focus-visible:ring-0"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="password"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  autoComplete="current-password"
                  className="h-11 rounded-lg border-zinc-200 bg-zinc-50 pr-10 text-sm placeholder:text-zinc-400 focus-visible:border-zinc-900 focus-visible:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="h-11 w-full rounded-full bg-zinc-900 text-sm font-semibold text-white shadow-none hover:bg-zinc-700"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isLoading ? "Signing in…" : "Sign in"}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
                Quick demo
              </span>
            </div>
          </div>

          {/* Demo accounts */}
          <div className="space-y-2">
            {DEMO_ACCOUNTS.map((account) => (
              <div
                key={account.label}
                className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    {account.label}
                  </p>
                  <p className="truncate font-mono text-sm text-zinc-700">
                    {account.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => applyDemo(account)}
                  className={`ml-3 flex h-8 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors ${
                    appliedDemo === account.label
                      ? "bg-zinc-900 text-white"
                      : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-100"
                  }`}
                >
                  {appliedDemo === account.label ? (
                    <>
                      <Check className="h-3 w-3" />
                      Applied
                    </>
                  ) : (
                    "Apply"
                  )}
                </button>
              </div>
            ))}
          </div>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-zinc-500">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-zinc-900 underline-offset-2 hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
