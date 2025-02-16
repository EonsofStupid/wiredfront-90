
import { Badge } from "@/components/ui/badge";
import { ValidationStatusType } from "../../types/api-config.types";

interface ConfigurationStatusProps {
  status: ValidationStatusType;
}

export function ConfigurationStatus({ status }: ConfigurationStatusProps) {
  const getStatusConfig = (status: ValidationStatusType) => {
    switch (status) {
      case "valid":
        return { variant: "success", label: "Valid" };
      case "invalid":
        return { variant: "destructive", label: "Invalid" };
      case "expired":
        return { variant: "warning", label: "Expired" };
      case "rate_limited":
        return { variant: "warning", label: "Rate Limited" };
      case "error":
        return { variant: "destructive", label: "Error" };
      default:
        return { variant: "secondary", label: "Pending" };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge variant={config.variant as "success" | "destructive" | "warning" | "secondary"}>
      {config.label}
    </Badge>
  );
}
