import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "@/store/hooks";
import { courseService } from "@/api/course.service";
import type { Course } from "@/types/course.types";
import {
  BookOpen,
  BarChart2,
  Plus,
  Pencil,
  ArrowUpRight,
  TrendingUp,
  Flame,
  Clock,
  Users,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ActionCard } from "@/components/ActionCard";

// ─── Status config ────────────────────────────────────────────────────────────

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

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function RowSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-4 border-b border-border/50 px-5 py-3.5 last:border-0">
      <div className="h-9 w-12 shrink-0 rounded-lg bg-muted" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 w-1/2 rounded-full bg-muted" />
        <div className="h-2.5 w-1/4 rounded-full bg-muted" />
      </div>
      <div className="h-5 w-14 shrink-0 rounded-full bg-muted" />
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ElementType;
  accent?: string;
}) {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-border bg-background p-4 transition-shadow hover:shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/80">
          {label}
        </span>
        <div
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-lg",
            accent ?? "bg-muted",
          )}
        >
          <Icon className={cn("h-3.5 w-3.5", accent ? "text-primary-foreground" : "text-muted-foreground")} />
        </div>
      </div>
      <div>
        <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        <p className="mt-0.5 text-xs text-muted-foreground/80">{sub}</p>
      </div>
    </div>
  );
}

// ─── Action card ──────────────────────────────────────────────────────────────



// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InstructorDashboard() {
  const user = useUser();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    courseService
      .getInstructorCourses()
      .then(setCourses)
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const publishedCount = courses.filter((c) => c.status === "PUBLISHED").length;
  const draftCount = courses.filter((c) => c.status === "DRAFT").length;
  const firstName = user?.fullName?.split(" ")[0] ?? "Instructor";

  return (
    <div className="min-h-full bg-muted/30 font-sans text-foreground antialiased">
      <div className="mx-auto max-w-7xl px-6 py-7 lg:px-8">

        {/* ── Page title row ─────────────────────────────────────────── */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              {firstName}&apos;s Studio
            </h1>
            <p className="mt-1 text-sm text-muted-foreground/80">
              Overview of your educator workspace
            </p>
          </div>
          <Link
            to="/instructor/courses/create"
            className="flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" />
            New Course
          </Link>
        </div>

        {/* ── Stats row ──────────────────────────────────────────────── */}
        <div className="mb-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
          <StatCard
            label="Total Courses"
            value={isLoading ? "—" : String(courses.length)}
            sub="Created by you"
            icon={BookOpen}
          />
          <StatCard
            label="Published"
            value={isLoading ? "—" : String(publishedCount)}
            sub={draftCount > 0 ? `${draftCount} still in draft` : "All live"}
            icon={Flame}
            accent="bg-primary"
          />
          <StatCard
            label="Revenue"
            value="₹0"
            sub="Lifetime earnings"
            icon={BarChart2}
          />
          <StatCard
            label="Completion"
            value="—"
            sub="Avg. student progress"
            icon={TrendingUp}
          />
        </div>

        {/* ── Two-column body ─────────────────────────────────────────── */}
        <div className="grid gap-5 lg:grid-cols-3">

          {/* Left — courses table */}
          <div className="lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-border bg-background">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/50 px-5 py-3.5">
                <div>
                  <h2 className="text-base font-semibold text-foreground">Your Courses</h2>
                  <p className="mt-0.5 text-sm text-muted-foreground/80">Content you are managing</p>
                </div>
                <Link
                  to="/instructor/courses"
                  className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  View all <ExternalLink className="h-3.5 w-3.5" />
                </Link>
              </div>

              {/* Table head */}
              {!isLoading && courses.length > 0 && (
                <div className="flex items-center gap-4 bg-muted/30 px-5 py-2">
                  <div className="h-9 w-12 shrink-0" />
                  <p className="flex-1 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground/80">Course</p>
                  <p className="hidden w-20 shrink-0 text-xs font-semibold uppercase tracking-[0.1em] text-muted-foreground/80 sm:block">Status</p>
                  <div className="w-14 shrink-0" />
                </div>
              )}

              {/* Loading */}
              {isLoading && Array.from({ length: 4 }).map((_, i) => <RowSkeleton key={i} />)}

              {/* Empty */}
              {!isLoading && courses.length === 0 && (
                <div className="flex flex-col items-center justify-center py-14 text-center">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/30">
                    <BookOpen className="h-5 w-5 text-muted-foreground/50" />
                  </div>
                  <p className="mb-1 text-sm font-semibold text-foreground">No courses yet</p>
                  <p className="mb-5 max-w-xs text-xs text-muted-foreground/80">Create your first course and start sharing your knowledge.</p>
                  <Link
                    to="/instructor/courses/create"
                    className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    <Plus className="h-3.5 w-3.5" /> Build First Course
                  </Link>
                </div>
              )}

              {/* Rows */}
              {!isLoading && courses.slice(0, 6).map((course) => {
                const s = STATUS[course.status] ?? STATUS.ARCHIVED;
                return (
                  <div
                    key={course.id}
                    className="group flex items-center gap-4 border-b border-border/50 px-5 py-3.5 transition-colors last:border-0 hover:bg-muted/30"
                  >
                    <div className="flex h-9 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                      {course.thumbnailUrl ? (
                        <img src={course.thumbnailUrl} alt={course.title} className="h-full w-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = "none"; }} />
                      ) : (
                        <BookOpen className="h-4 w-4 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{course.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground/80">
                        {course.isFree ? "Free" : course.price ? `₹${course.price}` : "—"}
                      </p>
                    </div>
                    <div className={cn("hidden shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 sm:flex", s.pill)}>
                      <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
                      <span className="text-[10px] font-semibold uppercase tracking-wider">{s.label}</span>
                    </div>
                    <div className="w-14 shrink-0 text-right">
                      <Link
                        to={`/instructor/courses/${course.id}/edit`}
                        className="inline-flex items-center gap-1 rounded-full border border-border bg-background px-2.5 py-1 text-[11px] font-semibold text-muted-foreground opacity-0 transition-all group-hover:opacity-100 hover:border-foreground/50 hover:text-foreground"
                      >
                        <Pencil className="h-2.5 w-2.5" /> Edit
                      </Link>
                    </div>
                  </div>
                );
              })}

              {!isLoading && courses.length > 6 && (
                <div className="border-t border-border/50 px-5 py-3 text-center">
                  <Link to="/instructor/courses" className="text-xs font-semibold text-muted-foreground/80 hover:text-foreground">
                    + {courses.length - 6} more courses →
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className="flex flex-col gap-4">
            {/* Quick actions */}
            <div className="rounded-xl border border-border bg-background p-4">
              <h3 className="mb-3 text-base font-semibold text-foreground">Quick Actions</h3>
              <div className="space-y-2">
                <ActionCard title="Create a course" desc="Start building your curriculum" to="/instructor/courses/create" icon={Plus} />
                <ActionCard title="Manage courses" desc="Edit, publish or archive" to="/instructor/courses" icon={BookOpen} />
                <ActionCard title="View analytics" desc="Track enrollments & progress" to="/instructor/analytics" icon={BarChart2} />
              </div>
            </div>

            {/* Recent activity */}
            <div className="rounded-xl border border-border bg-background p-4">
              <h3 className="mb-3 text-base font-semibold text-foreground">Recent Activity</h3>
              <div className="space-y-3">
                {[
                  { icon: Users, text: "No new enrollments yet", time: "—", muted: true },
                  { icon: Clock, text: "No recent updates", time: "—", muted: true },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <item.icon className="h-3 w-3 text-muted-foreground/80" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground/80">{item.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dark tip card */}
            <div className="rounded-xl bg-primary p-4 text-primary-foreground">
              <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Pro tip</p>
              <p className="text-sm font-semibold leading-snug">
                Add a compelling thumbnail to boost click-through rate by up to 40%.
              </p>
              <Link to="/instructor/courses/create" className="mt-3 flex items-center gap-1 text-xs font-semibold text-muted-foreground/80 hover:text-primary-foreground">
                Create a course <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
