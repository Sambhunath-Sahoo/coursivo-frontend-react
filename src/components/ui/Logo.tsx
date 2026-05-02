interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

export function Logo({
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: "text-base" },
    md: { icon: 32, text: "text-xl" },
    lg: { icon: 44, text: "text-2xl" },
  };

  const { icon: iconSize, text: textSize } = sizes[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={iconSize}
        height={iconSize}
        viewBox="0 0 44 44"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Container */}
        <rect width="44" height="44" rx="11" fill="#000000" />

        {/* Bold C arc — 290° arc, opens to the right */}
        {/* Center ≈ (20, 22), radius 12 */}
        {/* Top terminal ≈ (29, 14.5), bottom terminal ≈ (29, 29.5) */}
        <path
          d="M29 14.5 A12 12 0 1 0 29 29.5"
          stroke="white"
          strokeWidth="5.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Spark — small filled circle in the C opening, top area */}
        <circle cx="33" cy="11.5" r="3" fill="white" />
      </svg>

      {showText && (
        <span className={`font-normal tracking-normal text-foreground ${textSize}`}>
          Coursivo
        </span>
      )}
    </div>
  );
}

export function LogoIcon({
  size = 32,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 44 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <rect width="44" height="44" rx="11" fill="#000000" />
      <path
        d="M29 14.5 A12 12 0 1 0 29 29.5"
        stroke="white"
        strokeWidth="5.5"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="33" cy="11.5" r="3" fill="white" />
    </svg>
  );
}
