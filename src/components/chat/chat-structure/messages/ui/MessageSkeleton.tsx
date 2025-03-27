
import { Skeleton } from '@/components/ui/skeleton';

export function MessageSkeleton({ role = 'assistant', lines = 2 }: { role?: 'user' | 'assistant', lines?: number }) {
  const isUser = role === 'user';
  
  return (
    <div className={`flex items-start gap-4 p-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        {Array(lines).fill(0).map((_, i) => (
          <Skeleton key={i} className={`h-4 w-[${250 - (i * 25)}px]`} />
        ))}
      </div>
    </div>
  );
} 
