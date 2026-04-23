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
import { BookOpen, Users, Plus, BarChart } from "lucide-react";

export default function InstructorDashboard() {
  const user = useUser();

  const stats = [
    {
      title: "Total Courses",
      value: "0",
      icon: BookOpen,
      description: "Published actively",
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary/20",
    },
    {
      title: "Total Students",
      value: "0",
      icon: Users,
      description: "Enrolled globally",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Total Revenue",
      value: "$0",
      icon: BarChart,
      description: "Lifetime earnings",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
  ];

  const myCourses: any[] = []; // Placeholder

  return (
    <div className="min-h-full bg-background pb-20 font-sans selection:bg-primary/20">
      {/* Header Section - Premium Gradient */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-background via-muted/30 to-background py-6">
        <div className="pointer-events-none absolute left-0 top-0 h-[200px] w-[400px] rounded-full bg-primary/5 opacity-60 blur-[80px]" />

        <div className="container-padding animate-in fade-in slide-in-from-bottom-4 relative z-10 mx-auto max-w-7xl duration-1000">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h1 className="mb-1.5 text-xl font-semibold tracking-tight text-foreground lg:text-2xl">
                Hello, {user?.fullName || "Instructor"}
              </h1>
              <p className="max-w-xl text-sm text-muted-foreground">
                Manage your curriculum, track enrollments, and monitor your
                success.
              </p>
            </div>

            <div className="flex shrink-0 items-center gap-4">
              <Link to="/instructor/courses/create">
                <Button
                  size="sm"
                  className="gap-2 font-medium text-primary-foreground shadow-sm"
                >
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
        {/* Stats Grid */}
        <div className="animate-in fade-in slide-in-from-bottom-8 mb-10 grid gap-6 delay-150 duration-1000 md:grid-cols-3">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="border-border/40 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium tracking-tight text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div
                  className={`${stat.bgColor} ${stat.borderColor} rounded-xl border p-2`}
                >
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-1 text-3xl font-semibold tracking-tight text-foreground">
                  {stat.value}
                </div>
                <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 grid gap-6 delay-300 duration-1000">
          {/* My Courses Manager */}
          <Card className="border-border/40 shadow-sm">
            <CardHeader className="mb-4 border-b border-border/40 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    Your Courses
                  </CardTitle>
                  <CardDescription className="text-sm">
                    Content you are actively managing
                  </CardDescription>
                </div>
                <Link to="/instructor/courses">
                  <Button variant="outline" size="sm" className="font-medium">
                    View Catalog
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {myCourses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-6 rounded-full border border-border bg-muted/50 p-5 shadow-sm">
                    <BookOpen className="h-10 w-10 text-muted-foreground/50" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold tracking-tight text-foreground">
                    No published courses
                  </h3>
                  <p className="mb-8 max-w-sm text-sm text-muted-foreground">
                    Start creating your very first course and share your
                    knowledge globally.
                  </p>
                  <Link to="/instructor/courses/create">
                    <Button className="font-medium shadow-sm transition-transform hover:-translate-y-0.5">
                      <Plus className="mr-2 h-4 w-4" />
                      Build Your First Course
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
        </div>
      </div>
    </div>
  );
}
