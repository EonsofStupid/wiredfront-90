
import React from "react";
import { cn } from "@/lib/utils";

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "accent" | "highlight";
  glow?: boolean;
}

export const AdminCard = ({
  children,
  className,
  variant = "default",
  glow = false,
  ...props
}: AdminCardProps) => {
  return (
    <div
      className={cn(
        "admin-card relative overflow-hidden rounded-xl border p-5",
        variant === "accent" && "admin-card-accent",
        variant === "highlight" && "admin-card-highlight",
        glow && "admin-card-glow",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export const AdminCardHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mb-3 flex flex-col space-y-1.5", className)}
    {...props}
  />
);

export const AdminCardTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h3
    className={cn(
      "text-xl font-semibold tracking-tight admin-text-gradient",
      className
    )}
    {...props}
  />
);

export const AdminCardDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);

export const AdminCardContent = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("", className)} {...props} />
);

export const AdminCardFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("mt-4 flex items-center pt-2", className)}
    {...props}
  />
);
