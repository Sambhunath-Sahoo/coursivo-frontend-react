import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course.types";

// Deterministic gradient placeholder based on course id
const GRADIENTS = [
  "from-violet-500 to-purple-700",
  "from-sky-500 to-blue-700",
  "from-emerald-500 to-teal-700",
  "from-amber-400 to-orange-600",
  "from-rose-500 to-pink-700",
  "from-indigo-500 to-blue-800",
  "from-cyan-400 to-sky-600",
  "from-fuchsia-500 to-purple-800",
];

function CourseThumbnail({ id, title, thumbnailUrl, className }: { id: number; title: string; thumbnailUrl: string | null; className?: string }) {
  if (!thumbnailUrl) {
    const gradient = GRADIENTS[id % GRADIENTS.length];
    const initials = title.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    return (
      <div className={cn(`flex items-center justify-center bg-gradient-to-br ${gradient}`, className)}>
        <span className="select-none text-2xl font-bold text-white/80 drop-shadow">{initials}</span>
      </div>
    );
  }
  return (
    <img
      src={thumbnailUrl}
      alt={title}
      className={cn("object-cover transition-transform duration-300 group-hover:scale-105", className)}
      onError={(e) => {
        // swap to gradient on broken URL
        const parent = e.currentTarget.parentElement;
        if (parent) {
          e.currentTarget.remove();
          const gradient = GRADIENTS[id % GRADIENTS.length];
          parent.className = cn(parent.className, `bg-gradient-to-br ${gradient} flex items-center justify-center`);
          const span = document.createElement("span");
          span.className = "select-none text-2xl font-bold text-white/80 drop-shadow";
          span.textContent = title.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
          parent.appendChild(span);
        }
      }}
    />
  );
}

export interface CourseCardProps {
  course: Course;
  className?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number, currency: string, isFree: boolean): string {
  if (isFree || price === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
}

function RatingStars({ rating = 4.5 }: { rating?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => {
        const filled = i < Math.floor(rating);
        const half = !filled && i < rating;
        return (
          <Star
            key={i}
            className={cn(
              "h-3 w-3 shrink-0",
              filled
                ? "fill-amber-400 text-amber-400"
                : half
                  ? "fill-amber-200 text-amber-300"
                  : "fill-muted text-muted",
            )}
          />
        );
      })}
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CourseCard({ course, className }: CourseCardProps) {
  const { title, price, currency, isFree, thumbnailUrl, instructor } = course;
  const priceLabel = formatPrice(price, currency, isFree);
  const isFreeCard = isFree || price === 0;

  return (
    <Link
      to={`/courses/${course.id}`}
      className={cn(
        "group block overflow-hidden rounded-xl border border-border bg-background transition-all duration-200 hover:border-foreground/20 hover:shadow-md",
        className,
      )}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        <CourseThumbnail id={course.id} title={title} thumbnailUrl={thumbnailUrl} className="h-full w-full" />
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-foreground/0 transition-colors duration-200 group-hover:bg-foreground/5" />
        {/* Free badge */}
        {isFreeCard && (
          <span className="absolute left-3 top-3 rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background shadow-sm">
            Free
          </span>
        )}
      </div>

      {/* Text */}
      <div className="space-y-1.5 p-3.5">
        <h3 className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-foreground transition-colors group-hover:text-foreground/70">
          {title}
        </h3>

        <p className="text-[12px] text-muted-foreground">{instructor.fullName}</p>

        {/* Rating row */}
        <div className="flex items-center gap-1.5">
          <span className="text-[12px] font-semibold text-amber-500">4.5</span>
          <RatingStars rating={4.5} />
          <span className="text-[11px] text-muted-foreground">(1,234)</span>
        </div>

        {/* Price */}
        <p
          className={cn(
            "text-[13px] font-semibold tracking-tight",
            isFreeCard ? "text-emerald-600" : "text-foreground",
          )}
        >
          {priceLabel}
        </p>
      </div>
    </Link>
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-xl border border-border bg-background">
      <div className="aspect-[16/9] w-full shrink-0 bg-muted" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-4/5 rounded bg-muted" />
        <div className="mt-4 flex justify-between border-t border-border/50 pt-4">
          <div className="h-4 w-1/3 rounded bg-muted" />
          <div className="h-6 w-1/4 rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-5 rounded-xl border border-border bg-background p-4">
      <div className="h-24 w-40 shrink-0 rounded-lg bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-muted" />
        <div className="h-3 w-1/3 rounded bg-muted" />
        <div className="h-3 w-2/5 rounded bg-muted" />
      </div>
      <div className="h-6 w-16 shrink-0 rounded bg-muted" />
    </div>
  );
}

export function CourseListItem({ course }: { course: Course }) {
  const { title, price, currency, isFree, thumbnailUrl, instructor } = course;
  const isFreeCard = isFree || price === 0;
  const priceLabel = isFreeCard
    ? "Free"
    : new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(price);

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group flex items-center gap-5 rounded-xl border border-border bg-background p-4 transition-all duration-200 hover:border-foreground/20 hover:shadow-sm"
    >
      <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-lg bg-muted">
        <CourseThumbnail id={course.id} title={title} thumbnailUrl={thumbnailUrl} className="h-full w-full" />
        {isFreeCard && (
          <span className="absolute left-2 top-2 rounded-full bg-foreground px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-background">
            Free
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground transition-colors group-hover:text-foreground/70">
          {title}
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">{instructor.fullName}</p>
        <div className="mt-2 flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-3 w-3 ${i < 4 ? "text-amber-400" : "text-muted"}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-1 text-[11px] text-muted-foreground">(1,234)</span>
        </div>
      </div>

      <div className="shrink-0">
        <span className={`text-sm font-semibold tracking-tight ${isFreeCard ? "text-emerald-600" : "text-foreground"}`}>
          {priceLabel}
        </span>
      </div>
    </Link>
  );
}
