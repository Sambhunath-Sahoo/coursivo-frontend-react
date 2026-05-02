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
  ChevronDown,
  FileText,
  Clock,
  Lock,
  Eye,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

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

function getInitial(name: string) {
  return name.charAt(0).toUpperCase();
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function LoadingSkeleton() {
  return (
    <div className="min-h-screen animate-pulse bg-background">
      <div className="border-b border-border pt-28 pb-14">
        <div className="mx-auto max-w-7xl container-padding">
          <div className="mb-6 h-3.5 w-32 rounded bg-muted" />
          <div className="max-w-2xl space-y-4">
            <div className="flex gap-2">
              <div className="h-5 w-14 rounded-full bg-muted" />
              <div className="h-5 w-20 rounded-full bg-muted" />
            </div>
            <div className="h-9 w-3/4 rounded bg-muted" />
            <div className="h-9 w-1/2 rounded bg-muted" />
            <div className="h-4 w-full rounded bg-muted" />
            <div className="h-4 w-5/6 rounded bg-muted" />
          </div>
        </div>
      </div>
      <div className="mx-auto max-w-7xl container-padding py-14">
        <div className="flex flex-col gap-10 lg:flex-row">
          <div className="flex-1 space-y-8">

            {/* Course Curriculum Skeleton */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="h-6 w-40 rounded bg-muted/80" />
                <div className="h-4 w-48 rounded bg-muted/60" />
              </div>
              <div className="overflow-hidden rounded-xl border border-border">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="border-b border-border last:border-0">
                    <div className="flex items-center gap-3 bg-muted/20 px-5 py-4">
                      <div className="h-4 w-4 rounded bg-muted/40 shrink-0" />
                      <div className="h-4 w-1/3 rounded bg-muted/60 flex-1" />
                      <div className="h-3 w-16 rounded bg-muted/40" />
                    </div>
                    {[1, 2].map((_, j) => (
                      <div key={j} className="flex items-center gap-4 px-5 py-3.5 border-t border-border/50 bg-background">
                        <div className="h-6 w-6 rounded-full bg-muted/30 shrink-0" />
                        <div className="h-4 w-4 rounded bg-muted/40 shrink-0" />
                        <div className="h-4 w-2/3 rounded bg-muted/50 flex-1" />
                        <div className="h-3 w-12 rounded bg-muted/40 shrink-0" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="hidden w-80 shrink-0 space-y-4 lg:block">
            <div className="aspect-video w-full rounded-xl bg-muted" />
            <div className="h-10 w-full rounded-full bg-muted" />
            <div className="h-8 w-full rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [enrolled, setEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [collapsedSections, setCollapsedSections] = useState<Set<number>>(new Set());

  const toggleSection = (id: number) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  useEffect(() => {
    if (!id) return;
    const load = async () => {
      try {
        const [courseData, enrollmentCheck] = await Promise.all([
          courseService.getCourseById(Number(id)),
          isAuthenticated
            ? enrollmentService.checkEnrollment(Number(id))
            : Promise.resolve({ isEnrolled: false }),
        ]);
        setCourse(courseData);
        setEnrolled(enrollmentCheck.isEnrolled);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load course");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, isAuthenticated]);

  const handleEnroll = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    if (!id) return;
    setIsEnrolling(true);
    try {
      await enrollmentService.enrollInCourse(Number(id));
      setEnrolled(true);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to enroll");
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  if (error || !course) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <Shield className="mb-4 h-10 w-10 text-muted-foreground/30" />
        <p className="mb-1 text-lg font-semibold text-foreground">Course not found</p>
        <p className="mb-6 text-sm text-muted-foreground">
          {error ?? "This course may have been removed or is unavailable."}
        </p>
        <button
          onClick={() => navigate("/courses")}
          className="flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/30"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </button>
      </div>
    );
  }

  const priceLabel = formatPrice(course.price, course.currency, course.isFree);
  const isFreeCard = course.isFree || course.price === 0;
  const sections = course.sections || [];
  const totalLessons = sections.reduce((acc, s) => acc + s.lessons.length, 0);
  const totalMinutes = sections.reduce(
    (acc, s) => acc + s.lessons.reduce((sum, l) => sum + (l.durationMinutes ?? 0), 0),
    0,
  );

  // ─── Purchase / enroll card ───────────────────────────────────────────────

  const PurchaseCard = () => (
    <div className="overflow-hidden rounded-xl border border-border bg-background shadow-sm">
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
              }}
            />
            <div className="absolute inset-0 flex cursor-pointer items-center justify-center bg-foreground/0 transition-colors hover:bg-foreground/10">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-background/90 shadow-sm opacity-0 transition-opacity hover:opacity-100">
                <PlayCircle className="h-6 w-6 text-foreground" />
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <PlayCircle className="h-10 w-10 text-muted-foreground/30" />
          </div>
        )}
      </div>

      <div className="p-5">
        {/* Price */}
        <div className="mb-1">
          <span
            className={cn(
              "text-3xl font-semibold tracking-tight",
              isFreeCard ? "text-emerald-600" : "text-foreground",
            )}
          >
            {priceLabel}
          </span>
        </div>
        {!isFreeCard && (
          <p className="mb-5 text-[11px] text-muted-foreground">30-day money-back guarantee</p>
        )}

        {/* Enroll CTA */}
        <Button
          className={cn(
            "mb-3 h-11 w-full rounded-full text-sm font-semibold shadow-none",
            enrolled
              ? "bg-emerald-600 text-white hover:bg-emerald-700"
              : "bg-foreground text-background hover:opacity-80",
          )}
          onClick={enrolled ? undefined : handleEnroll}
          disabled={isEnrolling}
        >
          {enrolled ? (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Enrolled
            </>
          ) : isEnrolling ? (
            "Enrolling…"
          ) : isFreeCard ? (
            <>
              <Zap className="mr-2 h-4 w-4" />
              Enrol for Free
            </>
          ) : (
            "Enroll Now"
          )}
        </Button>

        <button className="h-11 w-full rounded-full border border-border bg-background text-sm font-semibold text-foreground transition-colors hover:bg-muted/30">
          Add to Wishlist
        </button>

      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="border-b border-border pt-24 pb-6">
        <div className="mx-auto max-w-7xl container-padding">

          {/* Breadcrumb */}
          <nav className="mb-5 flex items-center gap-1.5 text-[13px] text-muted-foreground">
            <Link to="/courses" className="transition-colors hover:text-foreground">
              Courses
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="line-clamp-1 text-foreground">{course.title}</span>
          </nav>

          <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
            {/* Left — headline block */}
            <div className="min-w-0 flex-1">
              {/* Badges */}
              <div className="mb-3 flex flex-wrap items-center gap-2">
                {isFreeCard && (
                  <span className="rounded-full bg-foreground px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-background">
                    Free
                  </span>
                )}
                <span className="rounded-full border border-border px-3 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {course.status}
                </span>
              </div>

              <h1 className="mb-3 text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl">
                {course.title}
              </h1>

              {course.description && (
                <p className="mb-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
                  {course.description}
                </p>
              )}

              {/* Instructor pill */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                  {getInitial(course.instructor.fullName)}
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Instructor
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {course.instructor.fullName}
                  </p>
                </div>
              </div>

              {/* Stats strip */}
              {(totalLessons > 0 || totalMinutes > 0) && (
                <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-border pt-6">
                  {totalLessons > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-semibold text-foreground">{totalLessons}</span>
                      {totalLessons === 1 ? "lesson" : "lessons"}
                    </div>
                  )}
                  {sections.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span className="font-semibold text-foreground">{sections.length}</span>
                      {sections.length === 1 ? "section" : "sections"}
                    </div>
                  )}
                  {totalMinutes > 0 && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="font-semibold text-foreground">
                        {Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m
                      </span>
                      total
                    </div>
                  )}
                </div>
              )}

              {/* Perks — fills left-column empty space */}
              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2.5 border-t border-border pt-5">
                {[
                  { icon: Globe, text: "Full lifetime access" },
                  { icon: Trophy, text: "Certificate of completion" },
                  { icon: BadgeIndianRupee, text: `Currency: ${course.currency}` },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — purchase card (desktop, inside hero) */}
            <div className="hidden w-80 shrink-0 lg:block">
              <div className="sticky top-20">
                <PurchaseCard />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile purchase card */}
      <div className="border-b border-border container-padding py-6 lg:hidden">
        <PurchaseCard />
      </div>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-7xl container-padding py-14">
        <div className="flex flex-col gap-14 lg:flex-row">
          <div className="min-w-0 flex-1 space-y-12">



            {/* ── Curriculum ── */}
            {sections.length > 0 && (
              <section>
                <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <h2 className="text-lg font-semibold tracking-tight text-foreground">
                    Course Curriculum
                  </h2>
                  <div className="flex items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                      {sections.length} section{sections.length !== 1 ? "s" : ""}&nbsp;·&nbsp;
                      {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
                      {totalMinutes > 0 &&
                        ` · ${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m total`}
                    </p>
                    <button
                      onClick={() => {
                        if (collapsedSections.size === sections.length) {
                          setCollapsedSections(new Set());
                        } else {
                          setCollapsedSections(new Set(sections.map((s) => s.id)));
                        }
                      }}
                      className="shrink-0 text-sm font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
                    >
                      {collapsedSections.size === sections.length ? "Expand All" : "Collapse All"}
                    </button>
                  </div>
                </div>

                <div className="overflow-hidden rounded-xl border border-border">
                  {sections.map((section, sIdx) => (
                    <div
                      key={section.id}
                      className={cn(sIdx !== sections.length - 1 && "border-b border-border")}
                    >
                      {/* Section header — clickable */}
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="flex w-full items-center gap-3 bg-muted/30 px-5 py-3.5 text-left transition-colors hover:bg-muted/50"
                      >
                        <BookOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="flex-1 text-sm font-semibold text-foreground">
                          {section.title}
                        </span>
                        <span className="text-xs font-medium text-muted-foreground">
                          {section.lessons.length}{" "}
                          {section.lessons.length === 1 ? "lesson" : "lessons"}
                        </span>
                        <ChevronDown
                          className={cn(
                            "ml-2 h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                            collapsedSections.has(section.id) && "-rotate-90",
                          )}
                        />
                      </button>

                      {/* Lessons — hidden when collapsed */}
                      {!collapsedSections.has(section.id) && section.lessons.map((lesson, lIdx) => (
                        <div
                          key={lesson.id}
                          className={cn(
                            "flex items-center gap-4 px-5 py-4 transition-colors hover:bg-muted/20",
                            lIdx !== section.lessons.length - 1 && "border-b border-border",
                          )}
                        >
                          {/* Lesson number */}
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background text-[11px] font-medium text-muted-foreground">
                            {lIdx + 1}
                          </span>

                          {/* Type icon */}
                          <div className="shrink-0 text-muted-foreground/40">
                            {lesson.videoUrl ? (
                              <PlayCircle className="h-4 w-4" />
                            ) : (
                              <FileText className="h-4 w-4" />
                            )}
                          </div>

                          {/* Title & description */}
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

                          {/* Right meta */}
                          <div className="flex shrink-0 items-center gap-3">
                            {lesson.isPreviewable ? (
                              <span className="flex items-center gap-1 rounded-full border border-border bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                                <Eye className="h-3 w-3" />
                                Preview
                              </span>
                            ) : (
                              <Lock className="h-3.5 w-3.5 text-muted-foreground/30" />
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
                  ))}
                </div>
              </section>
            )}

          </div>

          {/* Right column — Course Details */}
          <div className="hidden w-80 shrink-0 lg:block">
            <div className="sticky top-24">
              <section>
                <h2 className="mb-4 text-lg font-semibold tracking-tight text-foreground">
                  Course Details
                </h2>
                <div className="overflow-hidden rounded-xl border border-border">
                  {[
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
                  ].map(({ icon: Icon, label, value }, i, arr) => (
                    <div
                      key={label}
                      className={cn(
                        "flex items-center gap-4 px-5 py-4",
                        i !== arr.length - 1 && "border-b border-border",
                      )}
                    >
                      <Icon className="h-4 w-4 shrink-0 text-muted-foreground/60" />
                      <span className="w-24 shrink-0 text-sm text-muted-foreground">{label}</span>
                      <span className="text-sm font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
