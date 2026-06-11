import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  ChevronDown,
  FileText,
  Clock,
  Lock,
  Eye,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Converts any YouTube watch/short URL to an embed URL, or returns the original URL. */
function getYouTubeEmbedUrl(url: string): string {
  try {
    const u = new URL(url);
    // https://www.youtube.com/watch?v=ID
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}?autoplay=1&rel=0`;
    // https://youtu.be/ID
    if (u.hostname === "youtu.be") return `https://www.youtube.com/embed${u.pathname}?autoplay=1&rel=0`;
    // https://www.youtube.com/embed/ID — already embed
    if (u.pathname.startsWith("/embed/")) return url;
  } catch { /* not a valid URL */ }
  return url;
}

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
  const [previewLesson, setPreviewLesson] = useState<{ title: string; videoUrl: string } | null>(null);

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

      {/* ── Video Preview Modal ── */}
      {previewLesson && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setPreviewLesson(null)}
          onKeyDown={(e) => e.key === "Escape" && setPreviewLesson(null)}
          tabIndex={-1}
        >
          <div
            className="relative w-full max-w-4xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setPreviewLesson(null)}
              className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Title */}
            <p className="mb-3 text-sm font-medium text-white/70">{previewLesson.title}</p>

            {/* YouTube iframe */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black shadow-2xl">
              <iframe
                src={getYouTubeEmbedUrl(previewLesson.videoUrl)}
                title={previewLesson.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div className="border-b border-border pt-24 pb-6">
        <div className="mx-auto max-w-7xl container-padding">



          <div className="flex flex-col gap-10 lg:flex-row lg:items-start">
            {/* Left — headline block */}
            <div className="min-w-0 flex-1">

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
                {/* Header */}
                <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl font-semibold tracking-tight text-foreground">
                      Course Curriculum
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {sections.length} section{sections.length !== 1 ? "s" : ""}&nbsp;·&nbsp;
                      {totalLessons} lesson{totalLessons !== 1 ? "s" : ""}
                      {totalMinutes > 0 &&
                        ` · ${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m total`}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (collapsedSections.size === sections.length) {
                        setCollapsedSections(new Set());
                      } else {
                        setCollapsedSections(new Set(sections.map((s) => s.id)));
                      }
                    }}
                    className="shrink-0 self-start rounded-full border border-border bg-background px-4 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground sm:self-auto"
                  >
                    {collapsedSections.size === sections.length ? "Expand All" : "Collapse All"}
                  </button>
                </div>

                {/* Sections */}
                <div className="space-y-4">
                  {sections.map((section, sIdx) => {
                    const isCollapsed = collapsedSections.has(section.id);
                    const sectionMinutes = section.lessons.reduce(
                      (sum, l) => sum + (l.durationMinutes ?? 0), 0
                    );
                    return (
                      <div
                        key={section.id}
                        className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm transition-shadow hover:shadow-md"
                      >
                        {/* Section header */}
                        <button
                          onClick={() => toggleSection(section.id)}
                          className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted/20"
                        >
                          {/* Section number badge */}
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-xs font-bold text-background">
                            {sIdx + 1}
                          </span>

                          {/* Title block */}
                          <div className="min-w-0 flex-1">
                            <p className="text-[15px] font-semibold text-foreground leading-snug">
                              {section.title}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {section.lessons.length}{" "}
                              {section.lessons.length === 1 ? "lesson" : "lessons"}
                              {sectionMinutes > 0 && ` · ${sectionMinutes} min`}
                            </p>
                          </div>

                          {/* Chevron */}
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 shrink-0 text-muted-foreground/60 transition-transform duration-200",
                              isCollapsed && "-rotate-90",
                            )}
                          />
                        </button>

                        {/* Lessons list */}
                        {!isCollapsed && (
                          <div className="border-t border-border">
                            {section.lessons.map((lesson, lIdx) => {
                              const isPreview = lesson.isPreviewable;
                              const hasVideo = !!lesson.videoUrl;
                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => {
                                    if (isPreview && lesson.videoUrl) {
                                      setPreviewLesson({ title: lesson.title, videoUrl: lesson.videoUrl });
                                    }
                                  }}
                                  className={cn(
                                    "group relative flex items-center gap-4 px-5 py-3.5 transition-colors",
                                    lIdx !== section.lessons.length - 1 && "border-b border-border/60",
                                    isPreview && lesson.videoUrl
                                      ? "cursor-pointer hover:bg-teal-50/60 dark:hover:bg-teal-950/20"
                                      : "hover:bg-muted/20",
                                  )}
                                >
                                  {/* Left accent bar for preview lessons */}
                                  {isPreview && (
                                    <div className="absolute left-0 top-0 h-full w-0.5 rounded-r bg-teal-500" />
                                  )}

                                  {/* Lesson index */}
                                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted/50 text-[11px] font-semibold text-muted-foreground">
                                    {lIdx + 1}
                                  </span>

                                  {/* Media type icon — play button animates on hover for preview */}
                                  <div className={cn(
                                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-md transition-colors",
                                    isPreview && hasVideo
                                      ? "bg-teal-500/10 text-teal-600 group-hover:bg-teal-500 group-hover:text-white"
                                      : hasVideo ? "bg-foreground/5 text-foreground/60" : "bg-muted text-muted-foreground/50"
                                  )}>
                                    {hasVideo ? (
                                      <PlayCircle className="h-3.5 w-3.5" />
                                    ) : (
                                      <FileText className="h-3.5 w-3.5" />
                                    )}
                                  </div>

                                  {/* Title & description */}
                                  <div className="min-w-0 flex-1">
                                    <p className={cn(
                                      "truncate text-[13.5px] font-medium leading-snug",
                                      isPreview ? "text-foreground" : "text-foreground/80"
                                    )}>
                                      {lesson.title}
                                    </p>
                                    {lesson.description && (
                                      <p className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                                        {lesson.description}
                                      </p>
                                    )}
                                  </div>

                                  {/* Right meta */}
                                  <div className="flex shrink-0 items-center gap-2">
                                    {isPreview ? (
                                      <span className="flex items-center gap-1 rounded-full bg-teal-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-teal-600 ring-1 ring-teal-500/20">
                                        <Eye className="h-3 w-3" />
                                        Preview
                                      </span>
                                    ) : (
                                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted/60">
                                        <Lock className="h-3 w-3 text-muted-foreground/40" />
                                      </span>
                                    )}
                                    {lesson.durationMinutes != null && lesson.durationMinutes > 0 && (
                                      <span className="flex items-center gap-1 text-[11.5px] tabular-nums text-muted-foreground">
                                        <Clock className="h-3 w-3" />
                                        {lesson.durationMinutes} min
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
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
