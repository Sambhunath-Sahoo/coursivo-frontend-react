import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff, GraduationCap, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/api/auth.service";
import { useAppDispatch } from "@/store/hooks";
import { setAuth } from "@/store/auth.slice";
import type { UserRole } from "@/types/auth.types";

// ─── Role cards config ────────────────────────────────────────────────────────

const ROLES: { role: UserRole; icon: React.ElementType; title: string; sub: string }[] = [
  {
    role: "STUDENT",
    icon: GraduationCap,
    title: "Learn",
    sub: "As a Student",
  },
  {
    role: "INSTRUCTOR",
    icon: Users,
    title: "Teach",
    sub: "As an Instructor",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function SignUp() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT" as UserRole,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role: UserRole) => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const { token } = await authService.register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role,
      });

      dispatch(setAuth(token));
      toast.success("Account created successfully!");

      if (formData.role === "INSTRUCTOR") {
        navigate("/instructor/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
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
            Join the community
          </p>
          <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-white xl:text-5xl">
            Start your learning journey today
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
            Join thousands of learners and instructors building skills and
            sharing knowledge on the world's most intuitive course platform.
          </p>

          {/* Feature bullets */}
          <ul className="space-y-3 border-t border-zinc-800 pt-6">
            {[
              "Publish courses in minutes",
              "Built-in payments & analytics",
              "Global reach & built-in SEO",
              "No transaction fees on paid plans",
            ].map((feat) => (
              <li key={feat} className="flex items-center gap-3 text-sm text-zinc-400">
                <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-zinc-700">
                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                </div>
                {feat}
              </li>
            ))}
          </ul>
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
              Create an account
            </h2>
            <p className="mt-1.5 text-sm text-zinc-500">
              Choose how you want to use Coursivo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role selector */}
            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                I want to
              </p>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map(({ role, icon: Icon, title, sub }) => {
                  const active = formData.role === role;
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleSelect(role)}
                      disabled={isLoading}
                      className={`flex flex-col items-center gap-2 rounded-lg border-2 py-5 transition-all disabled:opacity-50 ${
                        active
                          ? "border-zinc-900 bg-zinc-900 text-white"
                          : "border-zinc-200 bg-zinc-50 text-zinc-700 hover:border-zinc-400"
                      }`}
                    >
                      <Icon className={`h-7 w-7 ${active ? "text-white" : "text-zinc-400"}`} />
                      <div>
                        <p className={`text-sm font-semibold ${active ? "text-white" : "text-zinc-900"}`}>
                          {title}
                        </p>
                        <p className={`text-[11px] ${active ? "text-zinc-300" : "text-zinc-400"}`}>
                          {sub}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Full name */}
            <div className="space-y-1.5">
              <Label
                htmlFor="fullName"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Full Name
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={isLoading}
                required
                autoComplete="name"
                className="h-11 rounded-lg border-zinc-200 bg-zinc-50 text-sm placeholder:text-zinc-400 focus-visible:border-zinc-900 focus-visible:ring-0"
              />
            </div>

            {/* Email */}
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

            {/* Password */}
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
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  autoComplete="new-password"
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

            {/* Confirm password */}
            <div className="space-y-1.5">
              <Label
                htmlFor="confirmPassword"
                className="text-xs font-semibold uppercase tracking-wider text-zinc-500"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                  autoComplete="new-password"
                  className="h-11 rounded-lg border-zinc-200 bg-zinc-50 pr-10 text-sm placeholder:text-zinc-400 focus-visible:border-zinc-900 focus-visible:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                  tabIndex={-1}
                >
                  {showConfirm ? (
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
              {isLoading ? "Creating account…" : "Create account"}
            </Button>
          </form>

          {/* Footer link */}
          <p className="mt-6 text-center text-sm text-zinc-500">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-zinc-900 underline-offset-2 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
