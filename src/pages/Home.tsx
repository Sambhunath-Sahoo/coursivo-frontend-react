import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CourseCard, CourseCardSkeleton } from "@/components/CourseCard";
import { courseService } from "@/api/course.service";
import type { Course } from "@/types/course.types";
import homePageImg from "@/assets/home-page.png";
import {
  BookOpen,
  BarChart2,
  CreditCard,
  Headphones,
  Zap,
  DollarSign,
  Search,
  Shield,
  Check,
  ChevronRight,
  Globe,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: BookOpen,
    title: "Built for learners",
    desc: "Coursivo is beautifully crafted for students and educators with best-in-class tools to make content creation easy.",
  },
  {
    icon: Globe,
    title: "Global Marketplace",
    desc: "Publish your courses in our thriving marketplace and reach thousands of eager learners worldwide without worrying about hosting.",
  },
  {
    icon: DollarSign,
    title: "Purchase Power Parity",
    desc: "Our smart purchase power parity feature helps creators maximise their profits when selling around the globe.",
  },
  {
    icon: Search,
    title: "SEO",
    desc: "We provide built-in, top-tier SEO support to help your courses rank on Google, Bing, and more.",
  },
  {
    icon: BarChart2,
    title: "Analytics",
    desc: "Track course performance, student engagement, and revenue metrics, etc.",
  },
  {
    icon: CreditCard,
    title: "Multi Payment Gateway",
    desc: "We support over 5 payment gateways and more than 30 currencies worldwide.",
  },
  {
    icon: Headphones,
    title: "Customer Support",
    desc: "We are available almost 100% of the time so that you can ship content like a breeze.",
  },
  {
    icon: Zap,
    title: "And much more",
    desc: "Even more things to offer which you are just going to love.",
  },
];

type PricingPlan = {
  name: string;
  price: string;
  period: string;
  desc: string;
  features: string[];
  popular?: boolean;
  exploreMore?: boolean;
};

const PRICING_PLANS: PricingPlan[] = [
  {
    name: "Basic",
    price: "$499",
    period: "/year",
    desc: "When you grow, need more power and flexibility",
    features: [
      "All in Free Plan",
      "Basic Analytics",
      "Unlimited Course Enrollments",
      "Community",
      "Digital Products",
    ],
  },
  {
    name: "Professional",
    price: "$1,499",
    period: "/year",
    desc: "When you grow, need more power and flexibility",
    features: [
      "All in Basic Plan",
      "Full HD Videos",
      "Email Templates",
      "DRM Encryption",
      "Subscriptions",
    ],
    popular: true,
    exploreMore: true,
  },
  {
    name: "Premium",
    price: "$1,999",
    period: "/year",
    desc: "When you grow, need more power and flexibility",
    features: [
      "All in Professional plan",
      "Zapier Integration",
      "Pabbly Integration",
      "Priority Support",
      "SAML & OpenID Connect",
    ],
  },
];

const FREE_FEATURES = [
  "Custom Payment Gateways",
  "Youtube Integration",
  "SSL Support",
  "SEO",
  "1:1 Meeting",
  "Private Discord Server Access",
];

const FOOTER_LINKS: Record<string, { label: string; href: string }[]> = {
  "": [
    { label: "Pricing", href: "/" },
    { label: "Blog", href: "/" },
    { label: "Contact", href: "/" },
  ],
  " ": [
    { label: "Privacy Policy", href: "/" },
    { label: "Terms of Service", href: "/" },
    { label: "Refund Policy", href: "/" },
  ],
  "  ": [
    { label: "Twitter", href: "/" },
    { label: "LinkedIn", href: "/" },
    { label: "GitHub", href: "/" },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [billing, setBilling] = useState<"monthly" | "annually">("annually");

  useEffect(() => {
    const controller = new AbortController();
    const fetchCourses = async () => {
      try {
        const data = await courseService.searchCourses({ size: 10 }, controller.signal);
        setCourses(data.content);
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


  return (
    <div className="min-h-screen bg-background font-sans text-foreground antialiased">

      {/* ─── 1. Hero ───────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center container-padding pb-0 pt-24 text-center">
        <h1 className="mx-auto max-w-4xl text-[52px] font-semibold leading-[1.05] tracking-tight text-foreground sm:text-[68px] md:text-[84px]">
          The easiest way to create, sell, and grow your courses
        </h1>

        <div className="mt-10">
          <Link to="/signup">
            <Button className="h-11 rounded-full bg-foreground px-8 text-sm font-semibold text-background hover:opacity-80">
              Book Demo
            </Button>
          </Link>
        </div>

        {/* Product Screenshot */}
        <div className="relative mx-auto mt-14 w-full max-w-6xl">
          <div className="rounded-3xl border border-border/60 bg-zinc-100/80 p-2 shadow-2xl dark:bg-zinc-900/50 sm:p-4 md:p-5">
            <div className="overflow-hidden rounded-2xl border border-border/80 bg-background shadow-sm">
              <img 
                src={homePageImg} 
                alt="Coursivo Course Builder Dashboard" 
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background via-background/80 to-transparent" />
        </div>
      </section>

      {/* ─── 2. Features ───────────────────────────────────────────────────── */}
      <section className="container-padding py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
              Packed with thousands of features
            </h2>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground">
              From course creation to student management, Coursivo offers everything you need
              to launch, scale, and monetize your courses.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-border border border-border sm:grid-cols-2 md:grid-cols-4">
            {FEATURES.map(({ icon: Icon, label, title, desc }: {
              icon?: React.ElementType;
              label?: string;
              title: string;
              desc: string;
            }) => (
              <div key={title} className="bg-background p-7 transition-colors hover:bg-muted/20">
                <div className="mb-3 flex h-7 w-7 items-center justify-center">
                  {label ? (
                    <span className="text-sm font-semibold text-muted-foreground">{label}</span>
                  ) : Icon ? (
                    <Icon className="h-5 w-5 text-muted-foreground" />
                  ) : null}
                </div>
                <h3 className="mb-2 text-sm font-semibold text-foreground">{title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 3. Pricing ────────────────────────────────────────────────────── */}
      <section className="container-padding py-24">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-3 text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
              Pricing
            </h2>
            <p className="text-base text-muted-foreground">
              Choose the plan that suits your needs. No hidden fees. Cancel at any time.
            </p>

            <div className="mt-6 inline-flex items-center rounded-full border border-border bg-muted/30 p-1">
              <button
                onClick={() => setBilling("monthly")}
                className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-colors ${
                  billing === "monthly"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("annually")}
                className={`rounded-full px-5 py-1.5 text-sm font-semibold transition-colors ${
                  billing === "annually"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Annually
              </button>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {PRICING_PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-xl border p-7 ${
                  plan.popular
                    ? "border-foreground bg-background shadow-sm"
                    : "border-border bg-background"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 right-6 rounded-full bg-foreground px-3 py-0.5 text-[11px] font-semibold text-background">
                    Popular
                  </div>
                )}
                <div className="mb-1 text-lg font-semibold text-foreground">{plan.name}</div>
                <p className="mb-6 text-sm text-muted-foreground">{plan.desc}</p>
                <div className="mb-6 flex items-baseline gap-1">
                  <span className="text-4xl font-semibold text-foreground">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                </div>
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 shrink-0 text-muted-foreground" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button
                    className={`w-full rounded-md font-semibold ${
                      plan.popular
                        ? "bg-foreground text-background hover:opacity-80"
                        : "border border-border bg-background text-foreground hover:bg-muted/30"
                    }`}
                    variant={plan.popular ? "default" : "outline"}
                  >
                    Get Started
                  </Button>
                </Link>
                {plan.exploreMore && (
                  <Link to="/courses" className="mt-3 flex items-center justify-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                    Explore more <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Free tier */}
          <div className="rounded-xl border border-border bg-background p-8 md:flex md:items-center md:justify-between md:gap-12">
            <div className="mb-6 md:mb-0 md:flex-1">
              <h3 className="mb-1 text-2xl font-semibold text-foreground">Free</h3>
              <p className="text-sm text-muted-foreground">Get all goodies for free, no credit card required.</p>
              <p className="mt-4 mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">Included features</p>
              <div className="grid grid-cols-1 gap-x-8 gap-y-2 sm:grid-cols-2">
                {FREE_FEATURES.map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-foreground">
                      <Check className="h-2.5 w-2.5 text-background" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <div className="mb-4 flex items-baseline gap-1">
                <span className="text-5xl font-semibold text-foreground">$0</span>
                <span className="text-sm text-muted-foreground">/mon</span>
              </div>
              <Link to="/signup">
                <Button className="w-40 rounded-md bg-foreground font-semibold text-background hover:opacity-80">
                  Get Started
                </Button>
              </Link>
              <p className="mt-2 text-center text-xs text-muted-foreground">No credit card required.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. Featured Courses ─────────────────────────────────────────── */}
      {!isLoading && !error && courses.length > 0 && (
        <section className="border-t border-border bg-background container-padding py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-4xl font-semibold tracking-tight text-foreground">Top courses right now</h2>
                <p className="mt-2 text-base text-muted-foreground">The most popular choices from learners worldwide.</p>
              </div>
              <Link to="/courses" className="hidden md:block">
                <Button variant="outline" className="rounded-full border-border font-semibold text-foreground">
                  View all <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {courses.slice(0, 10).map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>
      )}

      {isLoading && (
        <section className="border-t border-border bg-background container-padding py-20">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-4xl font-semibold tracking-tight text-foreground">Top courses right now</h2>
                <p className="mt-2 text-base text-muted-foreground">The most popular choices from learners worldwide.</p>
              </div>
              <div className="hidden md:block">
                <Button variant="outline" className="rounded-full border-border font-semibold text-foreground" disabled>
                  View all <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {[...Array(10)].map((_, i) => (
                <CourseCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      {error && (
        <div className="flex flex-col items-center border-t border-border py-16 text-center">
          <Shield className="mb-3 h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="mt-3 rounded-full">
            Try Again
          </Button>
        </div>
      )}

      {/* ─── 5. Dark CTA ───────────────────────────────────────────────────── */}
      <section className="border-t border-border bg-background container-padding py-20 text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-3 text-4xl font-semibold tracking-tight text-foreground md:text-5xl">
            Ready to signup and join the waitlist?
          </h2>
          <p className="mb-10 text-sm text-muted-foreground">
            Get instant access to our state of the art project and join the waitlist to get early access to all the features.
          </p>
          <Link to="/signup">
            <Button className="h-11 rounded-full bg-foreground px-8 text-sm font-semibold text-background hover:opacity-80">
              Book Demo
            </Button>
          </Link>
        </div>
      </section>

      {/* ─── 6. Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-border bg-background container-padding py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="shrink-0">
              <div className="mb-2 flex items-center gap-1.5">
                <div className="h-4 w-4 rounded-sm bg-foreground" />
                <span className="text-sm font-normal text-foreground">Coursivo</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Copyright © 2026 Coursivo Technologies Pvt. Ltd.<br />All rights reserved.
              </p>
            </div>
            <div className="flex gap-16">
              {Object.entries(FOOTER_LINKS).map(([, links], i) => (
                <ul key={i} className="space-y-3">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <Link to={href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                        {label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
