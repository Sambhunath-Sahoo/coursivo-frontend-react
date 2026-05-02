import { useEffect, useMemo, useState } from "react";
import { CourseCard, CourseCardSkeleton, ListSkeleton, CourseListItem } from "@/components/CourseCard";
import { courseService } from "@/api/course.service";
import type { Course } from "@/types/course.types";
import { BookOpen, LayoutGrid, LayoutList, Shield, SlidersHorizontal, X } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PriceFilter = "all" | "free" | "paid";
type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

const SORT_LABELS: Record<SortOption, string> = {
  default: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "name-asc": "Name: A → Z",
  "name-desc": "Name: Z → A",
};

export default function Courses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [query, setQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [sort, setSort] = useState<SortOption>("default");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    const fetchCourses = async () => {
      try {
        const data = await courseService.getPublicCourses(controller.signal);
        setCourses(data);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Failed to load courses");
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    };
    fetchCourses();
    return () => controller.abort();
  }, []);

  // Active filter count (excluding defaults)
  const activeFilterCount = [
    priceFilter !== "all",
    sort !== "default",
  ].filter(Boolean).length;

  const filtered = useMemo(() => {
    let result = [...courses];

    // Search
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.instructor.fullName.toLowerCase().includes(q),
      );
    }

    // Price
    if (priceFilter === "free") result = result.filter((c) => c.isFree || c.price === 0);
    if (priceFilter === "paid") result = result.filter((c) => !c.isFree && c.price > 0);

    // Sort
    if (sort === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sort === "name-asc") result.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "name-desc") result.sort((a, b) => b.title.localeCompare(a.title));

    return result;
  }, [courses, query, priceFilter, sort]);

  const clearAll = () => {
    setQuery("");
    setPriceFilter("all");
    setSort("default");
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="border-b border-border container-padding pb-14 pt-32 text-center">
        <div className="mx-auto max-w-3xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Course catalog
          </p>
          <h1 className="text-[56px] font-semibold leading-[1.04] tracking-tight text-foreground md:text-[72px]">
            Explore all courses
          </h1>
          <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-muted-foreground">
            From critical skills to technical topics, Coursivo supports your
            professional development.
          </p>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-md">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search courses or instructors…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-12 w-full rounded-full border border-border bg-muted/40 pl-11 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground/30 focus:bg-background focus:outline-none"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Sticky filter bar ─────────────────────────────────────────────── */}
      <div className="sticky top-[57px] z-30 border-b border-border bg-background/95 container-padding py-3 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-3">

          {/* Filter icon label */}
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[9px] font-semibold text-background">
                {activeFilterCount}
              </span>
            )}
          </div>

          <div className="h-4 w-px bg-border" />

          {/* Price filter pills */}
          <div className="flex items-center gap-1.5">
            {(["all", "free", "paid"] as PriceFilter[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriceFilter(p)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  priceFilter === p
                    ? "bg-foreground text-background"
                    : "border border-border bg-background text-muted-foreground hover:border-foreground/20 hover:bg-muted/30"
                }`}
              >
                {p === "all" ? "All Prices" : p === "free" ? "Free" : "Paid"}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-zinc-200" />

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                sort !== "default"
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:bg-muted/30"
              }`}
            >
              {SORT_LABELS[sort]}
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </button>

            {sortOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setSortOpen(false)}
                />
                <div className="absolute left-0 top-[calc(100%+8px)] z-20 min-w-[180px] overflow-hidden rounded-xl border border-border bg-background shadow-sm">
                  {(Object.entries(SORT_LABELS) as [SortOption, string][]).map(([key, label]) => (
                    <button
                      key={key}
                      onClick={() => { setSort(key); setSortOpen(false); }}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors hover:bg-muted/40 ${
                        sort === key ? "font-semibold text-foreground" : "font-medium text-muted-foreground"
                      }`}
                    >
                      {label}
                      {sort === key && (
                        <svg className="h-3.5 w-3.5 text-zinc-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path d="m5 12 5 5L20 7" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Clear all */}
          {activeFilterCount > 0 && (
            <>
              <div className="h-4 w-px bg-zinc-200" />
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-xs font-semibold text-zinc-400 hover:text-zinc-700"
              >
                <X className="h-3 w-3" />
                Clear all
              </button>
            </>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Layout toggle */}
          <div className="flex items-center gap-1 rounded-full border border-border bg-muted/30 p-1">
            <button
              onClick={() => setLayout("grid")}
              className={`rounded-full p-1.5 transition-colors ${
                layout === "grid" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              title="Grid view"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setLayout("list")}
              className={`rounded-full p-1.5 transition-colors ${
                layout === "list" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
              title="List view"
            >
              <LayoutList className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl container-padding py-12">

        {/* Loading */}
        {isLoading && (
          layout === "grid" ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => <CourseCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <ListSkeleton key={i} />)}
            </div>
          )
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <Shield className="mb-4 h-10 w-10 text-muted-foreground/30" />
            <p className="mb-1 text-base font-semibold text-foreground">Something went wrong</p>
            <p className="mb-6 text-sm text-muted-foreground">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background hover:opacity-80"
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && filtered.length > 0 && (
          <>
            {/* Results header */}
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {query || priceFilter !== "all" ? "Filtered results" : "All Courses"}
              </h2>
              <span className="rounded-full border border-border bg-muted/30 px-3.5 py-1 text-xs font-semibold text-muted-foreground">
                {filtered.length} {filtered.length === 1 ? "course" : "courses"}
              </span>
            </div>

            {layout === "grid" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {filtered.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((course) => (
                  <CourseListItem key={course.id} course={course} />
                ))}
              </div>
            )}
          </>
        )}

        {/* No results */}
        {!isLoading && !error && courses.length > 0 && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-muted/30">
              <BookOpen className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <p className="mb-1 text-lg font-semibold text-foreground">
              No courses match your filters
            </p>
            <p className="mb-6 text-sm text-muted-foreground">
              Try adjusting your search or filter criteria.
            </p>
            <button
              onClick={clearAll}
              className="rounded-full border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-muted/30"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Empty catalog */}
        {!isLoading && !error && courses.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-32 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-muted/30">
              <BookOpen className="h-7 w-7 text-muted-foreground/40" />
            </div>
            <p className="mb-1 text-lg font-semibold text-foreground">No courses yet</p>
            <p className="max-w-xs text-sm text-muted-foreground">
              Check back soon — new courses are added regularly.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
