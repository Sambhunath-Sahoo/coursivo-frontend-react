import { Link, useNavigate } from "react-router-dom";
import { Home, ArrowLeft, BookOpen, LayoutDashboard, LogIn } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4 font-sans antialiased">
      <div className="max-w-md space-y-8 text-center">
        {/* 404 Text */}
        <div className="space-y-3">
          <h1 className="text-9xl font-semibold tracking-tighter text-foreground">404</h1>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">Page Not Found</h2>
          <p className="mx-auto max-w-sm text-sm leading-relaxed text-muted-foreground">
            The page you're looking for doesn't exist, has been moved, or is currently unavailable.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-sm"
          >
            <Home className="h-4 w-4" />
            Go to Home
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center gap-2 rounded-full border border-border bg-background px-6 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-foreground/50 hover:bg-muted/30"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </div>

        {/* Helpful Links */}
        <div className="border-t border-border pt-8">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-muted-foreground/80">
            You might be looking for
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              to="/courses"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <BookOpen className="h-4 w-4" />
              Browse Courses
            </Link>
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
