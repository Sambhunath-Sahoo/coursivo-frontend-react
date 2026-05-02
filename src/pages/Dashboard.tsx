import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/store/hooks";
import { enrollmentService, type EnrollmentResponse } from "@/api/enrollment.service";
import {
  BookOpen,
  Award,
  TrendingUp,
  PlayCircle,

  ArrowUpRight,
  ExternalLink,
} from "lucide-react";

import { ActionCard } from "@/components/ActionCard";

function RowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 border-b border-border/50 px-5 py-3.5 last:border-0">
      <div className="h-9 w-12 shrink-0 rounded-lg bg-muted" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-1/2 rounded-full bg-muted" />
        <div className="h-2.5 w-1/4 rounded-full bg-muted" />
      </div>
    </div>
  );
}



export default function Dashboard() {
  const user = useUser();
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    enrollmentService
      .getMyEnrollments()
      .then(setEnrollments)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const firstName = user?.fullName?.split(" ")[0] ?? "Student";

  return (
    <div className="min-h-full bg-background font-sans text-foreground antialiased">
      <div className="mx-auto max-w-7xl px-6 py-7 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Welcome back, {firstName}!
            </h1>
            <p className="mt-1 text-sm text-muted-foreground/80">
              Continue your learning journey and track your overall progress
            </p>
          </div>
          <Link
            to="/courses"
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Browse Catalog
          </Link>
        </div>

        {/* Two-column body */}
        <div className="grid gap-5 lg:grid-cols-3">
          {/* Left — Continue Learning */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-border bg-background">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/50 px-5 py-3.5">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Continue Learning</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground/80">Pick up exactly where you left off</p>
                </div>
                <Link
                  to="/student/courses"
                  className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  View all <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Table head */}
              {!isLoading && enrollments.length > 0 && (
                <div className="flex items-center gap-4 bg-muted/30 px-5 py-2">
                  <div className="h-9 w-12 shrink-0" />
                  <p className="flex-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground/80">Course</p>
                  <p className="hidden w-32 shrink-0 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground/80 sm:block">Enrolled</p>
                </div>
              )}

              {/* Loading */}
              {isLoading && Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)}

              {/* Empty */}
              {!isLoading && enrollments.length === 0 && (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/30">
                    <BookOpen className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <p className="mb-1 text-sm font-semibold text-foreground">No courses yet</p>
                  <p className="mb-5 max-w-xs text-xs text-muted-foreground/80">Start your learning journey by enrolling in a new exciting course today.</p>
                  <Link
                    to="/courses"
                    className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <BookOpen className="h-3.5 w-3.5" /> Browse Full Catalog
                  </Link>
                </div>
              )}

              {/* Rows */}
              {!isLoading && enrollments.slice(0, 5).map(({ id, course, enrolledAt }) => (
                <Link
                  key={id}
                  to={`/courses/${course.id}`}
                  className="group flex items-center gap-4 border-b border-border/50 px-5 py-3.5 transition-colors last:border-0 hover:bg-muted/30"
                >
                  <div className="flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <PlayCircle className="h-4 w-4 text-muted-foreground/50" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">
                      {course.title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground/80">
                      {course.instructor.fullName}
                    </p>
                  </div>
                  <div className="hidden w-32 shrink-0 sm:block">
                    <p className="text-xs font-medium text-muted-foreground/80">
                      {new Date(enrolledAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              ))}

              {!isLoading && enrollments.length > 5 && (
                <div className="border-t border-border/50 px-5 py-3 text-center">
                  <Link to="/student/courses" className="text-xs font-semibold text-muted-foreground/80 hover:text-foreground">
                    + {enrollments.length - 5} more courses →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-4">
            {/* Quick Actions */}
            <div className="rounded-xl border border-border bg-background p-4">
              <h3 className="mb-3 text-base font-semibold text-foreground">Quick Links</h3>
              <div className="space-y-2">
                <ActionCard title="Browse Catalog" desc="Explore new courses" to="/courses" icon={BookOpen} />
                <ActionCard title="My Certificates" desc="View earned certificates" to="#" icon={Award} />
                <ActionCard title="Learning Progress" desc="Track your progress" to="#" icon={TrendingUp} />
              </div>
            </div>

            {/* Dark tip card */}
            <div className="rounded-xl bg-primary p-4 text-primary-foreground">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/80">Pro tip</p>
              <p className="text-sm font-semibold leading-snug">
                Consistent learning leads to better retention. Try setting a daily goal!
              </p>
              <Link to="/courses" className="mt-3 flex items-center gap-1 text-xs font-semibold text-muted-foreground/80 hover:text-primary-foreground">
                Find a course <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
