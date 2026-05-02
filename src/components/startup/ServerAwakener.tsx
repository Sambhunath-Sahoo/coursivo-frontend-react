import { useEffect, useRef, useState } from "react";
import { healthService } from "@/api/health.service";
import { Loader2, Server, Coffee } from "lucide-react";

interface ServerAwakenerProps {
  children: React.ReactNode;
}

export function ServerAwakener({ children }: ServerAwakenerProps) {
  const [isAwake, setIsAwake] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const isAwakeRef = useRef(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const checkHealth = async () => {
      if (isAwakeRef.current) return;
      try {
        await healthService.checkHealth();
        isAwakeRef.current = true;
        setIsAwake(true);
      } catch {
        // will retry on next interval tick
      }
    };

    checkHealth();

    const checkInterval = setInterval(checkHealth, 2000);
    const elapsedInterval = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);

    return () => {
      clearInterval(checkInterval);
      clearInterval(elapsedInterval);
    };
  }, []);

  if (isAwake) {
    return <>{children}</>;
  }

  // If it responds immediately (local dev), we might flash this screen.
  // We could add a small delay before showing it, but the user asked for this specific feedback.

  return (
    <div className="animate-in fade-in fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/95 p-4 text-center backdrop-blur-sm duration-300">
      <div className="max-w-md space-y-8">
        <div className="relative mx-auto h-24 w-24">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/20"></div>
          <div className="relative flex h-full w-full items-center justify-center rounded-full border-2 border-primary bg-primary/10">
            <Server className="h-10 w-10 animate-pulse text-primary" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">
            Waking up the server
          </h2>

          <div className="space-y-2 text-muted-foreground">
            <p>The backend is hosted on a free service.</p>
            <p className="font-medium text-foreground">
              It will take 3-5 minutes to spin up.
            </p>
            <p>Getting things ready for you...</p>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-sm tabular-nums text-muted-foreground">
            Waiting: {elapsed}s
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 rounded-full bg-muted/50 px-4 py-2 text-sm text-muted-foreground/60">
          <Coffee className="h-4 w-4" />
          <span>Grab a coffee while you wait!</span>
        </div>
      </div>
    </div>
  );
}
