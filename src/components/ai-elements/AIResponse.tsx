interface AIResponseProps {
  response: string;
}

export const AIResponse = ({ response }: AIResponseProps) => {
  if (!response) return null;

  return (
    <div className="mt-4 p-2 rounded-md bg-dark-lighter/30 border border-white/10">
      <pre className="text-xs overflow-auto max-h-40 whitespace-pre-wrap">
        {response}
      </pre>
    </div>
  );
};