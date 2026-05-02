import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, BookOpen, ExternalLink, Pencil, Search, SlidersHorizontal } from "lucide-react";
import { courseService } from "@/api/course.service";
import type { Course } from "@/types/course.types";
import { cn } from "@/lib/utils";
import { CourseCardSkeleton } from "@/components/CourseCard";

const STATUS: Record<string, { pill: string; dot: string; label: string }> = {
  PUBLISHED: {
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    label: "Published",
  },
  DRAFT: {
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    dot: "bg-amber-400",
    label: "Draft",
  },
  ARCHIVED: {
    pill: "bg-muted text-muted-foreground border-border",
    dot: "bg-zinc-400",
    label: "Archived",
  },
};

export default function InstructorCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    courseService
      .getInstructorCourses()
      .then(setCourses)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load courses"))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="min-h-full bg-muted/30 font-sans text-foreground antialiased">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              My Courses
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your curriculum, track courses, and update content.
            </p>
          </div>
          <Link
            to="/instructor/courses/create"
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Create Course
          </Link>
        </div>

        {/* ── Toolbar ────────────────────────────────────────────────── */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
          <button className="flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground/80 hover:border-foreground/50 hover:text-foreground">
            <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
            Filters
          </button>
        </div>

        {/* ── Loading ────────────────────────────────────────────────── */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* ── Error ──────────────────────────────────────────────────── */}
        {error && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50 py-16 text-center">
            <p className="font-semibold text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-background px-4 py-2 text-sm font-semibold text-foreground shadow-sm border border-border hover:bg-muted/30"
            >
              Try Again
            </button>
          </div>
        )}

        {/* ── Empty ──────────────────────────────────────────────────── */}
        {!isLoading && !error && courses.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background py-24 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/30 border border-border/50">
              <BookOpen className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">No courses yet</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">
              You haven&apos;t created any courses yet. Start sharing your knowledge with the world.
            </p>
            <Link
              to="/instructor/courses/create"
              className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Plus className="h-4 w-4" />
              Build Your First Course
            </Link>
          </div>
        )}

        {/* ── Grid ───────────────────────────────────────────────────── */}
        {!isLoading && !error && courses.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {courses.map((course) => {
              const s = STATUS[course.status] ?? STATUS.ARCHIVED;
              
              return (
                <div 
                  key={course.id} 
                  className="group flex flex-col overflow-hidden rounded-xl border border-border bg-background transition-all hover:border-border hover:shadow-md"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={(e) => { e.currentTarget.style.display = "none"; }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <BookOpen className="h-8 w-8 text-muted-foreground/50" />
                      </div>
                    )}
                    
                    {/* Status badge */}
                    <div className="absolute left-3 top-3">
                      <div className={cn("flex items-center gap-1.5 rounded-full border bg-background/90 px-2 py-1 backdrop-blur-md", s.pill)}>
                        <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
                        <span className="text-[9px] font-semibold uppercase tracking-wider">{s.label}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-1 flex-col p-4.5 p-4">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
                      {course.title || "Untitled Course"}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {course.description || "No description provided."}
                    </p>
                    
                    <div className="mt-auto pt-4">
                      <div className="flex items-center justify-between border-t border-border/50 pt-4">
                        <span className="text-sm font-semibold text-foreground">
                          {course.isFree ? "Free" : course.price ? `₹${course.price}` : "—"}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {course.status === "PUBLISHED" && (
                            <Link 
                              to={`/courses/${course.id}`}
                              className="flex h-7 w-7 items-center justify-center rounded-full border border-border text-muted-foreground/80 transition-colors hover:border-foreground/50 hover:text-foreground"
                              title="View as student"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                            </Link>
                          )}
                          <Link 
                            to={`/instructor/courses/${course.id}/edit`}
                            className="flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground/80 transition-colors hover:border-foreground/50 hover:text-foreground"
                          >
                            <Pencil className="h-3 w-3" /> Edit
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
