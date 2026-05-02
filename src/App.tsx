import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "./components/layout/Navbar";
import { ServerAwakener } from "./components/startup/ServerAwakener";
import { Loader2 } from "lucide-react";

// Lazy load page components for code splitting
const Home = lazy(() => import("./pages/Home"));
const Courses = lazy(() => import("./pages/Courses"));
const CourseDetail = lazy(() => import("./pages/CourseDetail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const SignIn = lazy(() => import("./pages/auth/SignIn"));
const SignUp = lazy(() => import("./pages/auth/SignUp"));
const MyCourses = lazy(() => import("./pages/student/MyCourses"));

// Layouts - lazy loaded
const InstructorLayout = lazy(() =>
  import("./components/layout/InstructorLayout").then((m) => ({
    default: m.InstructorLayout,
  })),
);
const StudentLayout = lazy(() =>
  import("./components/layout/StudentLayout").then((m) => ({
    default: m.StudentLayout,
  })),
);

// Instructor pages - lazy loaded
const InstructorDashboard = lazy(
  () => import("./pages/instructor/InstructorDashboard"),
);
const InstructorCourses = lazy(
  () => import("./pages/instructor/InstructorCourses"),
);
const CourseBuilder = lazy(() => import("./pages/instructor/CourseBuilder"));

// Loading fallback component
function PageLoader() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

// Layout wrapper that conditionally shows Navbar
function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  // Initialize theme globally
  useEffect(() => {
    const THEME_KEY = "coursivo_theme";
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";
  const isInstructorPage = location.pathname.startsWith("/instructor");
  const isStudentDashboard =
    location.pathname === "/dashboard" ||
    location.pathname.startsWith("/my-courses");

  // Don't show Navbar for auth pages and dashboard layouts (they have their own sidebar)
  const showNavbar = !isAuthPage && !isInstructorPage && !isStudentDashboard;

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      {showNavbar && <Navbar />}
      <main>{children}</main>
    </div>
  );
}

function App() {
  return (
    <ServerAwakener>
      <BrowserRouter>
        <AppLayout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes with Navbar */}
              <Route path="/" element={<Home />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/courses/:id" element={<CourseDetail />} />

              {/* Student Dashboard Routes - with sidebar layout */}
              <Route element={<StudentLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/my-courses" element={<MyCourses />} />
                {/* Add more student routes here */}
              </Route>

              {/* Instructor Routes - with sidebar layout */}
              <Route path="/instructor" element={<InstructorLayout />}>
                <Route path="dashboard" element={<InstructorDashboard />} />
                <Route path="courses" element={<InstructorCourses />} />
                <Route path="courses/create" element={<CourseBuilder />} />
                <Route path="courses/:id/edit" element={<CourseBuilder />} />
              </Route>

              {/* Auth routes */}
              <Route path="/login" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />

              {/* 404 - Catch all unmatched routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </AppLayout>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </ServerAwakener>
  );
}

export default App;
