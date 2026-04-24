import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { courseService } from "@/api/course.service";
import type { Course } from "@/types/course.types";

function CourseCardSkeleton() {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-lg border border-border/60 bg-card">
      <div className="aspect-video w-full shrink-0 bg-muted" />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-4/5 rounded bg-muted" />
        <div className="mt-4 border-t border-border/50 pt-3 flex justify-between">
          <div className="h-4 w-1/3 rounded bg-muted" />
          <div className="h-6 w-1/3 rounded bg-muted" />
        </div>
      </div>
    </div>
  );
}

export default function InstructorCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await courseService.getInstructorCourses();
        setCourses(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load courses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="min-h-full bg-background pb-20 font-sans selection:bg-primary/20">
      {/* Header Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-muted/30 to-background py-6 md:py-10">
        <div className="pointer-events-none absolute left-0 top-0 h-[200px] w-[400px] rounded-full bg-primary/5 opacity-60 blur-[80px]" />

        <div className="container-padding animate-in fade-in slide-in-from-bottom-4 relative z-10 mx-auto max-w-7xl duration-1000">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h1 className="mb-1.5 text-2xl font-semibold tracking-tight text-foreground lg:text-3xl">
                My Courses
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                Manage your curriculum, track your courses, and update your content.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <Link to="/instructor/courses/create">
                <Button className="gap-2 font-medium shadow-sm">
                  <Plus className="h-4 w-4" />
                  Create New Course
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-padding mx-auto max-w-7xl pt-10">
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
            <p className="text-lg font-medium text-destructive">{error}</p>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="mt-6 font-medium"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Courses Grid */}
        {!isLoading && !error && courses.length > 0 && (
          <div className="animate-in fade-in delay-150 duration-1000">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {courses.map((course) => (
                <div key={course.id} className="group relative flex flex-col overflow-hidden rounded-lg border border-border/50 bg-card transition-all hover:shadow-md">
                  <div className="aspect-video w-full overflow-hidden bg-muted relative">
                    {course.thumbnailUrl ? (
                      <img
                        src={course.thumbnailUrl}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted/50">
                        <BookOpen className="h-8 w-8 text-muted-foreground/30" />
                      </div>
                    )}
                    <div className="absolute left-3 top-3 rounded-md bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground backdrop-blur-md shadow-sm border border-border/50">
                      {course.status}
                    </div>
                  </div>
                  
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="line-clamp-2 text-base font-semibold leading-snug text-foreground mb-1.5">
                      {course.title || "Untitled Course"}
                    </h3>
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {course.description || "No description provided."}
                    </p>
                    
                    <div className="mt-auto flex items-center justify-between border-t border-border/40 pt-4">
                      <div className="text-sm font-semibold text-foreground">
                        {course.isFree ? "Free" : `$${course.price?.toFixed(2) || '0.00'}`}
                      </div>
                      
                      <Link to={`/instructor/courses/${course.id}/edit`}>
                        <Button variant="outline" size="sm" className="h-8 text-xs font-semibold">
                          Edit Course
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && courses.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/50 bg-muted/10 py-24 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-background shadow-sm border border-border/40">
              <BookOpen className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
              No courses found
            </h3>
            <p className="mb-8 max-w-md text-lg text-muted-foreground">
              You haven't created any courses yet. Start sharing your knowledge with the world.
            </p>
            <Link to="/instructor/courses/create">
              <Button className="font-semibold shadow-sm transition-transform hover:-translate-y-0.5 px-6">
                <Plus className="mr-2 h-4 w-4" />
                Build Your First Course
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
