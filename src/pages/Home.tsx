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
  ArrowRight,
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

/**
 * Column spans per feature on the 12-column bento. Each triplet sums to 12 so rows stay
 * flush while the panel widths vary — the asymmetry is the point, so keep the sums intact
 * when adding or removing a feature.
 */
const FEATURE_SPANS = [
  "lg:col-span-5",
  "lg:col-span-4",
  "lg:col-span-3",
  "lg:col-span-3",
  "lg:col-span-4",
  "lg:col-span-5",
  "lg:col-span-6",
  "lg:col-span-6",
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
  Product: [
    { label: "Pricing", href: "/" },
    { label: "Blog", href: "/" },
    { label: "Contact", href: "/" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/" },
    { label: "Terms of Service", href: "/" },
    { label: "Refund Policy", href: "/" },
  ],
  Social: [
    { label: "Twitter", href: "/" },
    { label: "LinkedIn", href: "/" },
    { label: "GitHub", href: "/" },
  ],
};

// ─── Section heading ─────────────────────────────────────────────────────────

function SectionHeading({
  label,
  title,
  desc,
  align = "left",
}: {
  label: string;
  title: string;
  desc?: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{label}</p>
      <h2 className="text-h1 mt-3 text-foreground">{title}</h2>
      {desc && <p className="text-body mt-4 text-muted-foreground">{desc}</p>}
    </div>
  );
}

// ─── Component ───────────────────────────────────────────────────────────────

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
      {/* ─── 1. Hero ─────────────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden pb-24 pt-20 md:pt-28">
        {/* Atmosphere: engineering grid under a soft monochrome bloom */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 glow-top" />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 bg-grid mask-fade-radial opacity-60"
        />

        <div className="container-padding mx-auto max-w-7xl">
          {/* Left-weighted headline block — deliberately not centered */}
          <div className="max-w-3xl animate-rise">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/60" />
              <span className="text-[12px] font-medium text-muted-foreground">
                A course platform for independent educators
              </span>
            </div>

            <h1 className="text-display mt-7 text-foreground">
              The easiest way to create, sell, and grow your courses
            </h1>

            <p className="text-body mt-6 max-w-xl text-muted-foreground">
              Build your curriculum, publish to a global marketplace, and get paid — without
              stitching together five different tools.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/signup">
                <Button className="h-11 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90">
                  Get started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button
                  variant="outline"
                  className="h-11 rounded-lg border-border bg-card px-6 text-sm font-semibold text-foreground hover:bg-accent"
                >
                  Browse courses
                </Button>
              </Link>
            </div>
          </div>

          {/* Product panel — offset right and bled past the container edge */}
          <div className="relative mt-16 lg:mt-20 lg:-mr-24 xl:-mr-32">
            <div className="panel panel-highlight overflow-hidden p-1.5 shadow-2xl sm:p-2">
              <div className="well overflow-hidden">
                <img
                  src={homePageImg}
                  alt="The Coursivo course builder, showing a curriculum outline with sections and lessons"
                  className="h-auto w-full object-cover"
                  loading="eager"
                />
              </div>
            </div>
            {/* Dissolve the panel's lower edge into the field */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent"
            />
          </div>
        </div>
      </section>

      {/* ─── 2. Features ─────────────────────────────────────────────────── */}
      <section className="container-padding mx-auto max-w-7xl py-24">
        <SectionHeading
          label="Capabilities"
          title="Packed with thousands of features"
          desc="From course creation to student management, Coursivo offers everything you need to launch, scale, and monetize your courses."
        />

        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-12">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <article
              key={title}
              className={`panel-interactive group flex flex-col p-6 ${FEATURE_SPANS[i]}`}
            >
              <div className="well mb-4 flex h-9 w-9 items-center justify-center">
                <Icon
                  className="h-[17px] w-[17px] text-muted-foreground transition-colors group-hover:text-foreground"
                  strokeWidth={1.75}
                />
              </div>
              <h3 className="text-[15px] font-semibold tracking-tight text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-muted-foreground">{desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ─── 3. Pricing ──────────────────────────────────────────────────── */}
      <section className="container-padding mx-auto max-w-7xl py-24">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            label="Pricing"
            title="Choose the plan that suits your needs"
            desc="No hidden fees. Cancel at any time."
          />

          <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-card p-1">
            {(["monthly", "annually"] as const).map((cycle) => (
              <button
                key={cycle}
                onClick={() => setBilling(cycle)}
                aria-pressed={billing === cycle}
                className={`rounded-full px-5 py-1.5 text-[13px] font-semibold capitalize transition-colors ${
                  billing === cycle
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {cycle}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-7 transition-colors ${
                plan.popular
                  ? "panel-highlight border-foreground/25 bg-accent"
                  : "border-border bg-card hover:border-foreground/20"
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 right-6 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                  Popular
                </span>
              )}

              <h3 className="text-[15px] font-semibold text-foreground">{plan.name}</h3>
              <p className="mt-1.5 text-[13px] text-muted-foreground">{plan.desc}</p>

              <div className="mt-7 flex items-baseline gap-1.5">
                <span className="text-4xl font-semibold tracking-tight text-foreground">
                  {plan.price}
                </span>
                <span className="text-[13px] text-muted-foreground">{plan.period}</span>
              </div>

              <div className="my-7 h-px bg-border" />

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-[13.5px] text-muted-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-foreground/70" strokeWidth={2.5} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link to="/signup" className="block">
                <Button
                  variant={plan.popular ? "default" : "outline"}
                  className={`w-full rounded-lg font-semibold ${
                    plan.popular
                      ? "bg-primary text-primary-foreground hover:opacity-90"
                      : "border-border bg-background text-foreground hover:bg-accent"
                  }`}
                >
                  Get Started
                </Button>
              </Link>

              {plan.exploreMore && (
                <Link
                  to="/courses"
                  className="mt-3 flex items-center justify-center gap-1 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Explore more <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Free tier — full-width panel closing the pricing block */}
        <div className="panel mt-3 p-8 md:flex md:items-center md:justify-between md:gap-12">
          <div className="mb-8 md:mb-0 md:flex-1">
            <h3 className="text-h3 text-foreground">Free</h3>
            <p className="mt-1.5 text-[13.5px] text-muted-foreground">
              Get all goodies for free, no credit card required.
            </p>

            <p className="eyebrow mt-6">Included features</p>
            <div className="mt-3 grid grid-cols-1 gap-x-8 gap-y-2.5 sm:grid-cols-2">
              {FREE_FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2.5 text-[13.5px] text-muted-foreground">
                  <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-foreground">
                    <Check className="h-2.5 w-2.5 text-background" strokeWidth={3} />
                  </span>
                  {f}
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <div className="flex items-baseline gap-1.5">
              <span className="text-5xl font-semibold tracking-tight text-foreground">$0</span>
              <span className="text-[13px] text-muted-foreground">/mon</span>
            </div>
            <Link to="/signup" className="mt-5 w-full md:w-auto">
              <Button className="w-full rounded-lg bg-primary font-semibold text-primary-foreground hover:opacity-90 md:w-44">
                Get Started
              </Button>
            </Link>
            <p className="mt-2.5 text-[12px] text-muted-foreground">No credit card required.</p>
          </div>
        </div>
      </section>

      {/* ─── 4. Featured courses ─────────────────────────────────────────── */}
      {(isLoading || (!error && courses.length > 0)) && (
        <section className="container-padding mx-auto max-w-7xl py-24">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionHeading
              label="Marketplace"
              title="Top courses right now"
              desc="The most popular choices from learners worldwide."
            />
            <Link to="/courses" className="hidden shrink-0 md:block">
              <Button
                variant="outline"
                className="rounded-lg border-border bg-card font-semibold text-foreground hover:bg-accent"
                disabled={isLoading}
              >
                View all <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
            {isLoading
              ? [...Array(10)].map((_, i) => <CourseCardSkeleton key={i} />)
              : courses.slice(0, 10).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
          </div>
        </section>
      )}

      {error && (
        <section className="container-padding mx-auto max-w-7xl py-24">
          <div className="panel flex flex-col items-center px-6 py-16 text-center">
            <Shield className="mb-4 h-7 w-7 text-muted-foreground" strokeWidth={1.5} />
            <p className="text-[13.5px] text-muted-foreground">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-lg border-border bg-background hover:bg-accent"
            >
              Try again
            </Button>
          </div>
        </section>
      )}

      {/* ─── 5. CTA ──────────────────────────────────────────────────────── */}
      <section className="container-padding mx-auto max-w-7xl pb-24">
        <div className="panel panel-highlight relative isolate overflow-hidden px-6 py-20 text-center sm:px-12">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10 bg-grid-sm mask-fade-radial opacity-50"
          />
          <div className="mx-auto max-w-2xl">
            <h2 className="text-h1 text-foreground">Ready to sign up and join the waitlist?</h2>
            <p className="text-body mt-4 text-muted-foreground">
              Get instant access to our state of the art project and join the waitlist to get
              early access to all the features.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link to="/signup">
                <Button className="h-11 rounded-lg bg-primary px-6 text-sm font-semibold text-primary-foreground hover:opacity-90">
                  Book demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/courses">
                <Button
                  variant="outline"
                  className="h-11 rounded-lg border-border bg-background px-6 text-sm font-semibold text-foreground hover:bg-accent"
                >
                  Explore the marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 6. Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-border">
        <div className="container-padding mx-auto max-w-7xl py-14">
          <div className="flex flex-col gap-12 md:flex-row md:items-start md:justify-between">
            <div className="shrink-0">
              <div className="flex items-center gap-2">
                <span className="h-4 w-4 rounded-[5px] bg-foreground" />
                <span className="text-sm font-semibold tracking-tight text-foreground">
                  Coursivo
                </span>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-muted-foreground">
                Copyright © 2026 Coursivo Technologies Pvt. Ltd.
                <br />
                All rights reserved.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-16">
              {Object.entries(FOOTER_LINKS).map(([group, links]) => (
                <div key={group}>
                  <p className="eyebrow">{group}</p>
                  <ul className="mt-4 space-y-3">
                    {links.map(({ label, href }) => (
                      <li key={label}>
                        <Link
                          to={href}
                          className="text-[13.5px] text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
