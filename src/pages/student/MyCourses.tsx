import { useEffect, useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { enrollmentService } from "@/api/enrollment.service";
import type { EnrollmentResponse } from "@/api/enrollment.service";
import { BookOpen, Compass, Shield, MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function CourseCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-lg border border-border/60 bg-card">
      <div className="aspect-video w-full shrink-0 bg-muted" />
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="h-3.5 w-full rounded bg-muted" />
        <div className="h-3.5 w-4/5 rounded bg-muted" />
        <div className="mt-0.5 h-3 w-1/2 rounded bg-muted" />
        <div className="h-3 w-2/3 rounded bg-muted" />
        <div className="mt-auto border-t border-border/50 pt-1.5">
          <div className="h-3.5 w-1/3 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export default function MyCourses() {
  const [enrollments, setEnrollments] = useState<EnrollmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const data = await enrollmentService.getMyEnrollments();
        setEnrollments(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load enrollments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  return (
    <div className="min-h-full bg-background pb-20 font-sans selection:bg-primary/20">
      {/* Header Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-muted/30 to-background py-6">
        <div className="pointer-events-none absolute right-0 top-0 h-[200px] w-[400px] rounded-full bg-primary/5 opacity-60 blur-[80px]" />

        <div className="container-padding animate-in fade-in slide-in-from-bottom-4 relative z-10 mx-auto max-w-7xl duration-1000">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary shadow-sm">
            <BookOpen className="h-3 w-3" />
            Learning Portfolio
          </div>
          <h1 className="mb-1.5 mt-4 text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
            My Courses
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            View the courses you have enrolled in and continue learning.
          </p>
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container-padding mx-auto max-w-7xl pt-12">
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <CourseCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Shield className="mb-4 h-12 w-12 text-destructive opacity-50" />
            <p className="text-lg font-medium text-destructive">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-6"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && !error && enrollments.length > 0 && (
          <div className="animate-in fade-in delay-300 duration-1000">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id}>
                  <CourseCard course={enrollment.course} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && enrollments.length === 0 && (
          <div className="animate-in fade-in flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-muted/10 py-24 text-center">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-background shadow-sm">
              <Compass className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <p className="mb-2 text-xl font-bold tracking-tight text-foreground">
              No courses enrolled
            </p>
            <p className="max-w-md text-sm text-muted-foreground">
              You haven't enrolled in any courses yet. Explore our catalog and start learning today.
            </p>
            <Link to="/courses">
              <Button
                variant="default"
                className="mt-8 font-semibold gap-2 shadow-md transition-transform hover:scale-105"
              >
                Browse Catalog
                <MoveRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
