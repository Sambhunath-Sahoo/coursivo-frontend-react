import { Link } from "react-router-dom";
import { useUser } from "@/store/hooks";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Award, TrendingUp, MoveRight } from "lucide-react";

export default function Dashboard() {
  const user = useUser();

  const recentCourses: any[] = []; // Placeholder

  return (
    <div className="min-h-full bg-background pb-20 font-sans selection:bg-primary/20">
      {/* 1. Header Section - Premium Gradient */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-muted/30 to-background py-6">
        <div className="pointer-events-none absolute right-0 top-0 h-[200px] w-[400px] rounded-full bg-primary/5 opacity-60 blur-[80px]" />

        <div className="container-padding animate-in fade-in slide-in-from-bottom-4 relative z-10 mx-auto max-w-7xl duration-1000">
          <h1 className="mb-1.5 text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
            Welcome back, {user?.fullName || "Student"}!
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Continue your learning journey and track your overall progress
            across classes.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container-padding mx-auto max-w-7xl pt-12">
        <div className="animate-in fade-in slide-in-from-bottom-8 grid gap-6 delay-300 duration-1000 lg:grid-cols-3">
          {/* Continue Learning */}
          <Card className="border-border/40 shadow-sm lg:col-span-2">
            <CardHeader className="mb-4 border-b border-border/40 pb-4">
              <CardTitle className="text-xl font-semibold tracking-tight">
                Continue Learning
              </CardTitle>
              <CardDescription className="text-sm">
                Pick up exactly where you left off
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-6 rounded-full border border-border bg-muted/50 p-5 shadow-sm">
                    <BookOpen className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
                    No courses yet
                  </h3>
                  <p className="mb-8 max-w-sm text-sm text-muted-foreground">
                    Start your learning journey by enrolling in a new exciting
                    course today.
                  </p>
                  <Link to="/courses">
                    <Button
                      size="lg"
                      className="gap-2 font-medium shadow-md transition-transform hover:scale-105"
                    >
                      Browse Full Catalog
                      <MoveRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Course items will go here */}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card className="border-border/40 bg-gradient-to-b from-background to-muted/20 shadow-sm">
              <CardHeader className="mb-4 border-b border-border/40 pb-4">
                <CardTitle className="text-xl font-semibold tracking-tight">
                  Quick Links
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/courses" className="block">
                  <Button
                    variant="outline"
                    className="h-14 w-full justify-start border-border/50 font-medium hover:bg-muted/50"
                  >
                    <BookOpen className="mr-3 h-5 w-5 text-primary" />
                    Browse Catalog
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  className="h-14 w-full cursor-not-allowed justify-start border-border/50 font-medium opacity-70 hover:bg-muted/50"
                >
                  <Award className="mr-3 h-5 w-5 text-amber-500" />
                  My Certificates
                </Button>
                <Button
                  variant="outline"
                  className="h-14 w-full cursor-not-allowed justify-start border-border/50 font-medium opacity-70 hover:bg-muted/50"
                >
                  <TrendingUp className="mr-3 h-5 w-5 text-emerald-500" />
                  Learning Progress
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
