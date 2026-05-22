import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

export interface TruncatedTextProps {
  text: string;
  className?: string;
}

export function TruncatedText({ text, className }: TruncatedTextProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={cn('block min-w-0 truncate', className)}>{text}</span>
      </TooltipTrigger>
      <TooltipContent>{text}</TooltipContent>
    </Tooltip>
  );
}
