import { Skeleton } from '@/components/ui/skeleton';

export function WeatherTabSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-32 w-full" />
    </div>
  );
}
