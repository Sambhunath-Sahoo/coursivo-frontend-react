import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Menu,
  X,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsAuthenticated, useUser, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/auth.slice";
import { getInitials } from "@/lib/user-utils";

const publicNavLinks: { name: string; href: string }[] = [];
const authenticatedNavLinks: { name: string; href: string }[] = [];

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useAppDispatch();
  const isAuthenticated = useIsAuthenticated();
  const user = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  const dashboardLink =
    user?.role === "INSTRUCTOR" ? "/instructor/dashboard" : "/dashboard";

  return (
    <nav
      className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/95 py-2 backdrop-blur-xl"
          : "border-b border-transparent bg-background/80 py-4 backdrop-blur-md"
      }`}
    >
      <div className="container-padding mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
        >
          <Logo size="md" className="text-foreground" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {(isAuthenticated ? authenticatedNavLinks : publicNavLinks).map(
            (link) => (
              <Link
                key={link.name}
                to={link.href}
                className="group relative text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-primary transition-all group-hover:w-full"></span>
              </Link>
            ),
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden items-center md:flex">
            <ThemeToggle />
          </div>

          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground ring-offset-background transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                  {getInitials(user.fullName)}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[220px] rounded-xl p-0 shadow-sm border border-border bg-background">
                <DropdownMenuLabel className="font-normal p-3.5">
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-semibold leading-none text-foreground">{user.fullName}</p>
                    <p className="text-xs text-foreground/70">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="m-0 bg-border" />
                <DropdownMenuItem asChild className="rounded-none cursor-pointer px-3.5 py-2.5 text-[13px] font-medium focus:bg-muted/50 data-[highlighted]:bg-muted/50 [&_svg]:size-[16px]">
                  <Link to={dashboardLink} className="flex w-full items-center text-foreground gap-2.5">
                    <LayoutDashboard className="text-foreground" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="m-0 bg-border" />
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="rounded-none rounded-b-xl cursor-pointer px-3.5 py-2.5 text-[13px] font-medium text-red-600 focus:bg-red-50 focus:text-red-600 data-[highlighted]:bg-red-50 data-[highlighted]:text-red-600 [&_svg]:size-[16px] gap-2.5"
                >
                  <LogOut className="text-red-600" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            // Not logged in - Show login/signup buttons
            <div className="hidden items-center gap-4 md:flex">
              <Link
                to="/login"
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Login
              </Link>
              <Link to="/signup">
                <Button className="rounded-full bg-foreground px-5 text-sm font-semibold text-background shadow-none hover:opacity-80">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="bg-muted/30 md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu Overflow */}
      {isMobileMenuOpen && (
        <div className="animate-in fade-in slide-in-from-top-2 absolute left-0 top-full w-full border-b border-border bg-background/95 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="container-padding space-y-6 py-6">
            <div className="flex items-center justify-between border-b border-border/50 pb-4">
              <span className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
                Navigation
              </span>
              <ThemeToggle />
            </div>

            {(isAuthenticated ? authenticatedNavLinks : publicNavLinks).length >
              0 && (
              <div className="flex flex-col space-y-4">
                {(isAuthenticated ? authenticatedNavLinks : publicNavLinks).map(
                  (link) => (
                    <Link
                      key={link.name}
                      to={link.href}
                      className="text-lg font-semibold text-foreground transition-colors hover:text-primary"
                    >
                      {link.name}
                    </Link>
                  ),
                )}
              </div>
            )}

            {isAuthenticated && user ? (
              <div className="rounded-xl border border-border/50 bg-muted/30 p-4 shadow-inner">
                <div className="mb-4 flex items-center gap-4 border-b border-border/50 pb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-xl font-semibold text-primary-foreground shadow-md">
                    {getInitials(user.fullName)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold leading-none">
                      {user.fullName}
                    </h3>
                    <p className="mb-1 mt-1 text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                        user.role === "INSTRUCTOR"
                          ? "border border-primary/20 bg-primary/10 text-primary"
                          : "border border-accent/20 bg-accent/20 text-accent-foreground"
                      }`}
                    >
                      {user.role === "INSTRUCTOR" ? "Instructor" : "Student"}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Link
                    to={dashboardLink}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors hover:bg-background"
                  >
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 pt-2">
                <Link to="/login">
                  <Button
                    variant="outline"
                    className="h-12 w-full rounded-xl border-zinc-200 text-base font-semibold text-zinc-900"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    className="h-12 w-full rounded-xl bg-zinc-900 text-base font-semibold text-white shadow-none hover:bg-zinc-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
