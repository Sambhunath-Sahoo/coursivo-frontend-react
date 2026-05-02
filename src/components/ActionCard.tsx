import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function ActionCard({
  title,
  desc,
  to,
  icon: Icon,
}: {
  title: string;
  desc: string;
  to: string;
  icon: React.ElementType;
}) {
  return (
    <Link
      to={to}
      className="group flex items-start gap-3 rounded-xl border border-border bg-background p-3.5 transition-all hover:border-foreground/50 hover:shadow-sm"
    >
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-border bg-muted/30 transition-all group-hover:border-foreground/50 group-hover:bg-primary">
        <Icon className="h-3.5 w-3.5 text-muted-foreground transition-colors group-hover:text-primary-foreground" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        <p className="mt-0.5 truncate text-sm text-muted-foreground/80">{desc}</p>
      </div>
      <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50 transition-colors group-hover:text-foreground" />
    </Link>
  );
}
