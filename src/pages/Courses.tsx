import { useCallback, useEffect, useRef, useState } from "react";
import { CourseCard, CourseCardSkeleton, ListSkeleton, CourseListItem } from "@/components/CourseCard";
import { courseService } from "@/api/course.service";
import type { Course, DifficultyLevel, PageResponse } from "@/types/course.types";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  LayoutList,
  Shield,
  SlidersHorizontal,
  X,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type PriceFilter = "ALL" | "FREE" | "PAID";
type SortOption = "newest" | "price_asc" | "price_desc" | "name_asc" | "name_desc";
type DifficultyFilter = DifficultyLevel | "";

const SORT_LABELS: Record<SortOption, string> = {
  newest: "Featured",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  name_asc: "Name: A → Z",
  name_desc: "Name: Z → A",
};

const DIFFICULTY_LABELS: Record<DifficultyFilter, string> = {
  "": "All Levels",
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
};

const DIFFICULTY_COLORS: Record<string, string> = {
  // Escalating intensity rather than hue-coding — the ramp itself carries the meaning.
  BEGINNER: "border-border bg-muted text-muted-foreground",
  INTERMEDIATE: "border-border bg-accent text-foreground",
  ADVANCED: "border-foreground/30 bg-foreground text-background",
};

const PAGE_SIZE = 12;

// ─── Debounce hook ────────────────────────────────────────────────────────────

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Courses() {
  const [pageData, setPageData] = useState<PageResponse<Course> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("ALL");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [sortOpen, setSortOpen] = useState(false);
  const [page, setPage] = useState(0);

  // Track previous params to reset page on filter change
  const prevFiltersRef = useRef({ debouncedQuery, priceFilter, difficulty, sort });

  // Reset page to 0 whenever a filter changes (not on page change itself)
  useEffect(() => {
    const prev = prevFiltersRef.current;
    if (
      prev.debouncedQuery !== debouncedQuery ||
      prev.priceFilter !== priceFilter ||
      prev.difficulty !== difficulty ||
      prev.sort !== sort
    ) {
      setPage(0);
      prevFiltersRef.current = { debouncedQuery, priceFilter, difficulty, sort };
    }
  }, [debouncedQuery, priceFilter, difficulty, sort]);

  const fetchCourses = useCallback(
    (signal: AbortSignal) => {
      setIsLoading(true);
      setError(null);
      courseService
        .searchCourses(
          {
            q: debouncedQuery || undefined,
            difficulty: difficulty || undefined,
            priceType: priceFilter,
            sort,
            page,
            size: PAGE_SIZE,
          },
          signal,
        )
        .then((data) => {
          setPageData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          if ((err as Error).name === "AbortError") return;
          setError(err instanceof Error ? err.message : "Failed to load courses");
          setIsLoading(false);
        });
    },
    [debouncedQuery, priceFilter, difficulty, sort, page],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchCourses(controller.signal);
    return () => controller.abort();
  }, [fetchCourses]);

  const courses = pageData?.content ?? [];
  const totalElements = pageData?.totalElements ?? 0;
  const totalPages = pageData?.totalPages ?? 0;

  const activeFilterCount = [
    priceFilter !== "ALL",
    difficulty !== "",
    sort !== "newest",
  ].filter(Boolean).length;

  const clearAll = () => {
    setQuery("");
    setPriceFilter("ALL");
    setDifficulty("");
    setSort("newest");
    setPage(0);
  };

  // ── Pagination helpers ──────────────────────────────────────────────────────

  const goToPage = (p: number) => {
    if (p < 0 || p >= totalPages) return;
    setPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageNumbers = (() => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i);
    const nums: (number | "…")[] = [];
    if (page > 2) nums.push(0, "…");
    else for (let i = 0; i < Math.min(page, 3); i++) nums.push(i);
    for (let i = Math.max(0, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) nums.push(i);
    if (page < totalPages - 3) nums.push("…", totalPages - 1);
    else for (let i = Math.max(page + 1, totalPages - 3); i < totalPages; i++) nums.push(i);
    // deduplicate
    return nums.filter((v, i, arr) => arr.indexOf(v) === i);
  })();

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
                id="course-search"
                type="text"
                placeholder="Search courses, topics or instructors…"
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

          {/* Difficulty filter pills */}
          <div className="flex items-center gap-1.5">
            {(["", "BEGINNER", "INTERMEDIATE", "ADVANCED"] as DifficultyFilter[]).map((d) => (
              <button
                key={d || "all"}
                onClick={() => setDifficulty(d)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  difficulty === d
                    ? "bg-foreground text-background"
                    : "border border-border bg-background text-muted-foreground hover:border-foreground/20 hover:bg-muted/30"
                }`}
              >
                {DIFFICULTY_LABELS[d]}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-border" />

          {/* Price filter pills */}
          <div className="flex items-center gap-1.5">
            {(["ALL", "FREE", "PAID"] as PriceFilter[]).map((p) => (
              <button
                key={p}
                onClick={() => setPriceFilter(p)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  priceFilter === p
                    ? "bg-foreground text-background"
                    : "border border-border bg-background text-muted-foreground hover:border-foreground/20 hover:bg-muted/30"
                }`}
              >
                {p === "ALL" ? "All Prices" : p === "FREE" ? "Free" : "Paid"}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-zinc-200" />

          {/* Sort dropdown */}
          <div className="relative">
            <button
              onClick={() => setSortOpen(!sortOpen)}
              className={`flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                sort !== "newest"
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
              {Array.from({ length: PAGE_SIZE }).map((_, i) => <CourseCardSkeleton key={i} />)}
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
              onClick={() => { const c = new AbortController(); fetchCourses(c.signal); }}
              className="rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-background hover:opacity-80"
            >
              Try again
            </button>
          </div>
        )}

        {/* Results */}
        {!isLoading && !error && courses.length > 0 && (
          <>
            {/* Results header */}
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {debouncedQuery || priceFilter !== "ALL" || difficulty ? "Filtered results" : "All Courses"}
              </h2>
              <span className="rounded-full border border-border bg-muted/30 px-3.5 py-1 text-xs font-semibold text-muted-foreground">
                {totalElements.toLocaleString()} {totalElements === 1 ? "course" : "courses"}
              </span>
            </div>

            {layout === "grid" ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
                {courses.map((course) => (
                  <div key={course.id} className="group relative">
                    <CourseCard course={course} />
                    {/* Difficulty badge overlay */}
                    {course.difficultyLevel && (
                      <span className={`pointer-events-none absolute left-2 top-2 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${DIFFICULTY_COLORS[course.difficultyLevel]}`}>
                        {DIFFICULTY_LABELS[course.difficultyLevel]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {courses.map((course) => (
                  <div key={course.id} className="relative">
                    <CourseListItem course={course} />
                    {course.difficultyLevel && (
                      <span className={`pointer-events-none absolute right-4 top-4 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${DIFFICULTY_COLORS[course.difficultyLevel]}`}>
                        {DIFFICULTY_LABELS[course.difficultyLevel]}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* ── Pagination ──────────────────────────────────────────────── */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-1.5">
                {/* Prev */}
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={!pageData?.hasPrevious}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted/40 disabled:pointer-events-none disabled:opacity-30"
                  aria-label="Previous page"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                {/* Page numbers */}
                {pageNumbers.map((pn, idx) =>
                  pn === "…" ? (
                    <span key={`ellipsis-${idx}`} className="flex h-9 w-9 items-center justify-center text-xs text-muted-foreground">
                      …
                    </span>
                  ) : (
                    <button
                      key={pn}
                      onClick={() => goToPage(pn as number)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                        pn === page
                          ? "bg-foreground text-background"
                          : "border border-border bg-background text-muted-foreground hover:bg-muted/40"
                      }`}
                      aria-label={`Page ${(pn as number) + 1}`}
                      aria-current={pn === page ? "page" : undefined}
                    >
                      {(pn as number) + 1}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={!pageData?.hasNext}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-colors hover:bg-muted/40 disabled:pointer-events-none disabled:opacity-30"
                  aria-label="Next page"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Page info */}
            {totalPages > 1 && (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Page {page + 1} of {totalPages} · {totalElements.toLocaleString()} courses total
              </p>
            )}
          </>
        )}

        {/* No results */}
        {!isLoading && !error && pageData && courses.length === 0 && totalElements > 0 && (
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
        {!isLoading && !error && pageData && totalElements === 0 && !debouncedQuery && priceFilter === "ALL" && !difficulty && (
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
