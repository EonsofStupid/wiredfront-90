
import { Github } from "lucide-react";
import { APIType } from "@/types/admin/settings/api";

interface KeyBadgeProps {
  type: APIType;
}

export function KeyBadge({ type }: KeyBadgeProps) {
  switch (type) {
    case 'openai':
      return <span>OpenAI</span>;
    case 'anthropic':
      return <span>Anthropic</span>;
    case 'gemini':
      return <span>Google Gemini</span>;
    case 'pinecone':
      return <span>Pinecone</span>;
    case 'github':
      return (
        <>
          <Github className="h-5 w-5 mr-2 text-gray-300" /> GitHub
        </>
      );
    default:
      return <span>{type}</span>;
  }
}
