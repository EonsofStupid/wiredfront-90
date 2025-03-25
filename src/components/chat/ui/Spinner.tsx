import React from "react";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = "md",
  className = "",
  label,
}) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`relative ${sizeClasses[size]} ${className}`}>
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />

        {/* Main spinner container */}
        <div className="relative animate-spin">
          {/* Circuit pattern background */}
          <svg
            className="absolute inset-0 w-full h-full opacity-20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
              stroke="currentColor"
              strokeWidth="1"
              strokeDasharray="2 2"
            />
            <path
              d="M12 6v6l4 2"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Main spinner */}
          <svg
            className="w-full h-full text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            {/* Glowing background circle */}
            <circle
              className="opacity-20"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              filter="url(#glow)"
            />

            {/* Main spinner path */}
            <path
              className="opacity-100"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              filter="url(#glow)"
            />

            {/* Glow filter definition */}
            <defs>
              <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
                <feColorMatrix
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 3 0"
                  result="glow"
                />
                <feMerge>
                  <feMergeNode in="glow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
          </svg>

          {/* Animated sparks */}
          <div className="absolute inset-0">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-primary rounded-full"
                style={{
                  top: "50%",
                  left: "50%",
                  transform: `rotate(${i * 90}deg) translateY(-12px)`,
                  animation: `spark 1.5s ease-in-out infinite ${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {label && <span className="text-sm text-muted-foreground">{label}</span>}
    </div>
  );
};
