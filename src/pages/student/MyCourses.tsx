import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { BookOpen, Search, SlidersHorizontal, Compass, X, LayoutGrid, LayoutList } from "lucide-react";
import { enrollmentService } from "@/api/enrollment.service";
import type { EnrollmentResponse } from "@/api/enrollment.service";
import { CourseCard, CourseCardSkeleton, ListSkeleton, CourseListItem } from "@/components/CourseCard";


type PriceFilter = "all" | "free" | "paid";
type SortOption = "default" | "price-asc" | "price-desc" | "name-asc" | "name-desc";

const SORT_LABELS: Record<SortOption, string> = {
  default: "Featured",
  "price-asc": "Price: Low to High",
  "price-desc": "Price: High to Low",
  "name-asc": "Name: A → Z",
  "name-desc": "Name: Z → A",
};

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState<PriceFilter>("all");
  const [sort, setSort] = useState<SortOption>("default");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [sortOpen, setSortOpen] = useState(false);

  useEffect(() => {
    enrollmentService
      .getMyEnrollments()
      .then(setEnrollments)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load enrollments"))
      .finally(() => setIsLoading(false));
  }, []);

  const activeFilterCount = [
    priceFilter !== "all",
    sort !== "default",
  ].filter(Boolean).length;

  const filteredEnrollments = useMemo(() => {
    let result = [...enrollments];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (e) =>
          e.course.title.toLowerCase().includes(query) ||
          e.course.instructor.fullName.toLowerCase().includes(query)
      );
    }

    if (priceFilter === "free") {
      result = result.filter((e) => e.course.isFree || e.course.price === 0);
    }
    if (priceFilter === "paid") {
      result = result.filter((e) => !e.course.isFree && e.course.price > 0);
    }

    if (sort === "price-asc") {
      result.sort((a, b) => a.course.price - b.course.price);
    }
    if (sort === "price-desc") {
      result.sort((a, b) => b.course.price - a.course.price);
    }
    if (sort === "name-asc") {
      result.sort((a, b) => a.course.title.localeCompare(b.course.title));
    }
    if (sort === "name-desc") {
      result.sort((a, b) => b.course.title.localeCompare(a.course.title));
    }

    return result;
  }, [enrollments, searchQuery, priceFilter, sort]);

  const clearAll = () => {
    setSearchQuery("");
    setPriceFilter("all");
    setSort("default");
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              My Courses
            </h1>
            <p className="mt-1 text-sm text-muted-foreground/80">
              View the courses you have enrolled in and continue learning.
            </p>
          </div>
          <Link
            to="/courses"
            className="flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <BookOpen className="h-4 w-4" />
            Browse Catalog
          </Link>
        </div>

        {/* ── Search Bar ─────────────────────────────────────────────── */}
        <div className="mb-6 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/80" />
            <input 
              type="text" 
              placeholder="Search enrollments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/80 focus:border-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/50"
            />
          </div>
        </div>
      </div>

      {/* ── Sticky filter bar ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 border-b border-t border-border bg-background/95 px-6 py-3 lg:px-8 backdrop-blur-sm">
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

          <div className="h-4 w-px bg-border" />

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
                        <svg className="h-3.5 w-3.5 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
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
              <div className="h-4 w-px bg-border" />
              <button
                onClick={clearAll}
                className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
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

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* ── Loading ────────────────────────────────────────────────── */}
        {isLoading && (
          layout === "grid" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <CourseCardSkeleton key={i} />)}
            </div>
          ) : (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <ListSkeleton key={i} />)}
            </div>
          )
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
        {!isLoading && !error && enrollments.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background py-24 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/30 border border-border/50">
              <Compass className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">No courses enrolled</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground/80">
              You haven't enrolled in any courses yet. Explore our catalog and start learning today.
            </p>
            <Link
              to="/courses"
              className="flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <BookOpen className="h-4 w-4" />
              Browse Catalog
            </Link>
          </div>
        )}

        {/* ── Results Header ─────────────────────────────────────────── */}
        {!isLoading && !error && filteredEnrollments.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-foreground">
              {searchQuery || priceFilter !== "all" || sort !== "default" ? "Filtered results" : "All Courses"}
            </h2>
            <span className="rounded-full border border-border bg-muted/30 px-3.5 py-1 text-xs font-semibold text-muted-foreground">
              {filteredEnrollments.length} {filteredEnrollments.length === 1 ? "course" : "courses"}
            </span>
          </div>
        )}

        {/* ── No Search Results ──────────────────────────────────────── */}
        {!isLoading && !error && enrollments.length > 0 && filteredEnrollments.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background py-24 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/30 border border-border/50">
              <Search className="h-6 w-6 text-muted-foreground/50" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-foreground">No matching courses</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground/80">
              We couldn't find any courses matching your filters.
            </p>
            <button
              onClick={clearAll}
              className="rounded-full border border-border bg-background px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/30"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* ── Grid/List ──────────────────────────────────────────────── */}
        {!isLoading && !error && filteredEnrollments.length > 0 && (
          layout === "grid" ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEnrollments.map((enrollment) => (
                <div key={enrollment.id}>
                  <CourseCard course={enrollment.course} />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEnrollments.map((enrollment) => (
                <CourseListItem key={enrollment.id} course={enrollment.course} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
