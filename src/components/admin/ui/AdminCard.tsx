
import React from "react";
import { cn } from "@/lib/utils";
import { Loader2, LockIcon, AlertCircle } from "lucide-react";
import { useRoleStore } from "@/stores/role";

interface AdminCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "accent" | "highlight";
  glow?: boolean;
  isLoading?: boolean;
  requiredRole?: "super_admin" | "admin" | "developer" | "subscriber" | "guest";
  error?: string | null;
}

export const AdminCard = ({
  children,
  className,
  variant = "default",
  glow = false,
  isLoading = false,
  requiredRole,
  error = null,
  ...props
}: AdminCardProps) => {
  const { hasRole } = useRoleStore();
  const hasAccess = !requiredRole || hasRole(requiredRole);

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
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark/50 backdrop-blur-sm z-10">
          <Loader2 className="h-8 w-8 animate-spin text-white/80" />
        </div>
      )}
      
      {!hasAccess && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark/80 backdrop-blur-sm z-10 text-white/80">
          <LockIcon className="h-12 w-12 mb-3 opacity-70" />
          <p className="text-center px-6">
            You need {requiredRole} permissions to access this section
          </p>
        </div>
      )}

      {error && !isLoading && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-100">{error}</p>
        </div>
      )}

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

export const AdminCardActions = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex items-center justify-end gap-2 mt-4 pt-2 border-t border-[#8B5CF6]/20",
      className
    )}
    {...props}
  />
);
