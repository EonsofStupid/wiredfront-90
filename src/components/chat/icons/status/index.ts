
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Activity
} from 'lucide-react';

// Export status indicator icons for reuse throughout the application
export const StatusIcons = {
  online: CheckCircle,
  offline: XCircle,
  warning: AlertCircle,
  pending: Clock,
  active: Activity
};

export type StatusIconType = keyof typeof StatusIcons;
