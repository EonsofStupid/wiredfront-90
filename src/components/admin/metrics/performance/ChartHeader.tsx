
import { ArrowUpDown } from "lucide-react";

interface ChartHeaderProps {
  title: string;
  description: string;
}

export function ChartHeader({ title, description }: ChartHeaderProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white flex items-center">
        <ArrowUpDown className="h-5 w-5 text-[#8B5CF6] mr-2" />
        {title}
      </h3>
      <p className="text-sm text-white/60 mt-1">{description}</p>
    </div>
  );
}
