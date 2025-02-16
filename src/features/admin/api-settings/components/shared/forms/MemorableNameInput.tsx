
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface MemorableNameInputProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function MemorableNameInput({ value, onChange, error }: MemorableNameInputProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="memorable_name">Memorable Name</Label>
      <Input
        id="memorable_name"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="e.g., production-gpt4, development-anthropic"
        className={error ? "border-destructive" : ""}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
