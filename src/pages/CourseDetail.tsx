import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { courseService } from "@/api/course.service";
import { enrollmentService } from "@/api/enrollment.service";
import type { Course } from "@/types/course.types";
import { useAppSelector } from "@/store/hooks";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  BookOpen,
  Globe,
  PlayCircle,
  Shield,
  Trophy,
  CheckCircle2,
  Zap,
  CalendarDays,
  BadgeIndianRupee,
  ChevronRight,
  FileText,
  Clock,
  Lock,
  Eye,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatPrice(price: number, currency: string, isFree: boolean): string {
  if (isFree || price === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(dateStr: string | undefined): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return isNaN(d.getTime())
    ? "—"
    : d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const courseData = await courseService.getCourseById(Number(id));
        setCourse(courseData);
        // if (isAuthenticated) {
        //   const { isEnrolled } = await enrollmentService.checkEnrollment(Number(id));
        //   setEnrolled(isEnrolled);
        // }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load course");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!id) return;
    
    setIsEnrolling(true);
    try {
      await enrollmentService.enrollInCourse(Number(id));
      setEnrolled(true);
    } catch (err) {
      console.error("Enrollment failed", err);
      alert(err instanceof Error ? err.message : "Failed to enroll");
    } finally {
      setIsEnrolling(false);
    }
  };

  const lessons = course?.lessons || [];

  // ── Loading ──
  if (isLoading) {
    return (
      <div className="min-h-screen animate-pulse bg-background text-foreground">
        {/* Hero skeleton */}
        <div className="border-b border-border/60 bg-muted/30">
          <div className="mx-auto max-w-7xl px-6 pb-10 pt-20 md:pb-14 md:pt-24">
            <div className="mb-8 h-4 w-32 rounded bg-muted" />
            <div className="max-w-2xl space-y-3">
              <div className="mb-4 flex gap-2">
                <div className="h-5 w-12 rounded-full bg-muted" />
                <div className="h-5 w-20 rounded-full bg-muted" />
              </div>
              <div className="h-7 w-3/4 rounded bg-muted" />
              <div className="h-7 w-1/2 rounded bg-muted" />
              <div className="mt-2 h-4 w-full rounded bg-muted" />
              <div className="h-4 w-5/6 rounded bg-muted" />
              <div className="mt-4 flex items-center gap-2">
                <div className="h-7 w-7 rounded-full bg-muted" />
                <div className="h-4 w-40 rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>

        {/* Body skeleton */}
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col gap-10 lg:flex-row">
            {/* Left */}
            <div className="flex-1 space-y-10">
              {/* Instructor card */}
              <div className="flex items-start gap-4 rounded-lg border border-border/60 bg-card p-5">
                <div className="h-14 w-14 shrink-0 rounded-full bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-muted" />
                  <div className="h-3 w-1/4 rounded bg-muted" />
                </div>
              </div>
              {/* Details table */}
              <div className="divide-y divide-border/40 rounded-lg border border-border/60 bg-card">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="h-4 w-4 shrink-0 rounded bg-muted" />
                    <div className="h-3.5 w-24 shrink-0 rounded bg-muted" />
                    <div className="h-3.5 w-32 rounded bg-muted" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right — purchase card skeleton */}
            <div className="hidden w-80 shrink-0 lg:block">
              <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
                <div className="aspect-video w-full bg-muted" />
                <div className="space-y-4 p-5">
                  <div className="h-7 w-1/3 rounded bg-muted" />
                  <div className="h-10 w-full rounded bg-muted" />
                  <div className="h-10 w-full rounded bg-muted" />
                  <div className="space-y-3 border-t border-border/40 pt-4">
                    <div className="h-3.5 w-3/4 rounded bg-muted" />
                    <div className="h-3.5 w-2/3 rounded bg-muted" />
                    <div className="h-3.5 w-1/2 rounded bg-muted" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ──
  if (error || !course) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <Shield className="mb-4 h-12 w-12 text-muted-foreground/30" />
        <p className="mb-1 text-lg font-semibold tracking-tight text-foreground">
          Course not found
        </p>
        <p className="mb-6 text-sm text-muted-foreground">
          {error ?? "This course may have been removed or is unavailable."}
        </p>
        <Button
          variant="outline"
          className="font-medium"
          onClick={() => navigate("/courses")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
      </div>
    );
  }

  const priceLabel = formatPrice(course.price, course.currency, course.isFree);

  // ── Purchase card ──
  const purchaseCard = (
    <div className="overflow-hidden rounded-lg border border-border/60 bg-card shadow-sm">
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {course.thumbnailUrl ? (
          <>
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling?.classList.remove("hidden");
              }}
            />
            <div className="absolute inset-0 flex hidden items-center justify-center bg-muted">
              <PlayCircle className="h-10 w-10 text-muted-foreground/30" />
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/20 opacity-0 transition-opacity hover:opacity-100">
          <PlayCircle className="h-12 w-12 text-white drop-shadow-lg" />
        </div>
      </div>

      {/* Pricing & CTA */}
      <div className="flex flex-col gap-4 p-5">
        <div>
          <span
            className={cn(
              "text-2xl font-semibold tracking-tight",
              course.isFree || course.price === 0
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-foreground",
            )}
          >
            {priceLabel}
          </span>
          {!course.isFree && course.price > 0 && (
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              30-day money-back guarantee
            </p>
          )}
        </div>

        <Button
          className="w-full bg-primary font-medium text-primary-foreground"
          onClick={enrolled ? undefined : handleEnroll}
          disabled={isEnrolling}
        >
          {enrolled ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Enrolled
            </>
          ) : isEnrolling ? (
            "Enrolling..."
          ) : course.isFree || course.price === 0 ? (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Enrol for Free
            </>
          ) : (
            "Enroll Now"
          )}
        </Button>

        <Button
          variant="outline"
          className="w-full border-border/50 font-medium hover:bg-muted/50"
        >
          Add to Wishlist
        </Button>

        {/* Course meta */}
        <div className="space-y-2.5 border-t border-border/40 pt-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <BadgeIndianRupee className="h-3.5 w-3.5 shrink-0" />
            <span>
              Currency:{" "}
              <span className="font-medium text-foreground">
                {course.currency}
              </span>
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Globe className="h-3.5 w-3.5 shrink-0" />
            <span>Full lifetime access</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 shrink-0" />
            <span>Certificate of completion</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Hero Banner ──────────────────────────────────────────────────── */}
      <div className="border-b border-border/60 bg-muted/30">
        <div className="mx-auto max-w-7xl px-6 pb-10 pt-20 md:pb-14 md:pt-24">
          <nav className="mb-8 flex items-center gap-2 text-[13px] text-muted-foreground">
            <Link
              to="/courses"
              className="font-medium transition-colors hover:text-foreground"
            >
              Courses
            </Link>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
            <span className="line-clamp-1 font-semibold text-foreground">
              {course.title}
            </span>
          </nav>

          <div className="max-w-2xl">
            {/* Badges */}
            <div className="mb-4 flex items-center gap-2">
              {(course.isFree || course.price === 0) && (
                <span className="rounded-full bg-foreground px-2 py-0.5 text-[11px] font-medium text-background">
                  Free
                </span>
              )}
              <span className="rounded-full border border-border/60 px-2 py-0.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">
                {course.status}
              </span>
            </div>

            <h1 className="mb-3 text-2xl font-semibold leading-snug tracking-tight text-foreground md:text-3xl">
              {course.title}
            </h1>

            {course.description && (
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                {course.description}
              </p>
            )}

            {/* Instructor */}
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-[11px] font-semibold text-white">
                {course.instructor.fullName.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm text-muted-foreground">
                Instructor:{" "}
                <span className="font-medium text-foreground">
                  {course.instructor.fullName}
                </span>
              </span>
            </div>
          </div>

          {/* Mobile purchase card */}
          <div className="mt-8 lg:hidden">{purchaseCard}</div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-10 lg:flex-row">
          {/* Left — content sections */}
          <div className="min-w-0 flex-1 space-y-10">
            {/* About the Instructor */}
            <section>
              <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
                About the Instructor
              </h2>
              <div className="flex items-start gap-4 rounded-lg border border-border/60 bg-card p-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 text-xl font-semibold text-white">
                  {course.instructor.fullName.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold tracking-tight text-foreground">
                    {course.instructor.fullName}
                  </p>
                  <p className="mt-0.5 text-[12px] text-muted-foreground">
                    Instructor · ID #{course.instructor.id}
                  </p>
                </div>
              </div>
            </section>

            {/* Course Curriculum */}
            {lessons.length > 0 && (
              <section>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    Course Curriculum
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {lessons.length} lesson{lessons.length !== 1 ? "s" : ""}
                    {lessons.reduce((acc, l) => acc + (l.durationMinutes ?? 0), 0) > 0 &&
                      ` · ${Math.floor(lessons.reduce((acc, l) => acc + (l.durationMinutes ?? 0), 0) / 60)}h ${lessons.reduce((acc, l) => acc + (l.durationMinutes ?? 0), 0) % 60}m total`}
                  </span>
                </div>
                <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
                  {lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className={cn(
                        "flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/40",
                        index !== lessons.length - 1 && "border-b border-border/40",
                      )}
                    >
                      {/* Order badge */}
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-muted-foreground">
                        {lesson.order}
                      </span>

                      {/* Icon */}
                      <div className="shrink-0 text-muted-foreground">
                        {lesson.videoUrl ? (
                          <PlayCircle className="h-4 w-4" />
                        ) : (
                          <FileText className="h-4 w-4" />
                        )}
                      </div>

                      {/* Title + description */}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {lesson.title}
                        </p>
                        {lesson.description && (
                          <p className="mt-0.5 truncate text-[12px] text-muted-foreground">
                            {lesson.description}
                          </p>
                        )}
                      </div>

                      {/* Meta: preview + duration */}
                      <div className="flex shrink-0 items-center gap-3">
                        {lesson.isPreviewable ? (
                          <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
                            <Eye className="h-3 w-3" />
                            Preview
                          </span>
                        ) : (
                          <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
                        )}
                        {lesson.durationMinutes != null && lesson.durationMinutes > 0 && (
                          <span className="flex items-center gap-1 text-[12px] text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {lesson.durationMinutes} min
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Course Info */}
            <section>
              <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
                Course Details
              </h2>
              <div className="divide-y divide-border/40 rounded-lg border border-border/60 bg-card">
                {[
                  { icon: BookOpen, label: "Title", value: course.title },
                  { icon: BadgeIndianRupee, label: "Price", value: priceLabel },
                  { icon: Globe, label: "Currency", value: course.currency },
                  {
                    icon: CalendarDays,
                    label: "Published",
                    value: formatDate(course.createdAt),
                  },
                  {
                    icon: CalendarDays,
                    label: "Last updated",
                    value: formatDate(course.updatedAt),
                  },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 px-5 py-3.5"
                  >
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="w-28 shrink-0 text-sm text-muted-foreground">
                      {label}
                    </span>
                    <span className="text-sm font-medium text-foreground">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right — sticky purchase card (desktop) */}
          <div className="hidden w-80 shrink-0 lg:block">
            <div className="sticky top-20">{purchaseCard}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
