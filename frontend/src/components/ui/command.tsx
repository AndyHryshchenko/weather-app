import { Command as CommandPrimitive } from 'cmdk';
import type { ComponentPropsWithoutRef } from 'react';
import { cn } from '@/lib/utils';

export function Command({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof CommandPrimitive>) {
  return (
    <CommandPrimitive
      className={cn('flex h-full w-full flex-col overflow-hidden', className)}
      {...props}
    />
  );
}

export function CommandInput({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof CommandPrimitive.Input>) {
  return (
    <CommandPrimitive.Input
      className={cn(
        'flex w-full bg-transparent text-sm outline-none placeholder:text-foreground/60 disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export function CommandList({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof CommandPrimitive.List>) {
  return (
    <CommandPrimitive.List
      className={cn('max-h-60 overflow-y-auto', className)}
      {...props}
    />
  );
}

export function CommandEmpty({
  ...props
}: ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>) {
  return (
    <CommandPrimitive.Empty
      className="py-4 text-center text-sm text-foreground/60"
      {...props}
    />
  );
}

export function CommandItem({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof CommandPrimitive.Item>) {
  return (
    <CommandPrimitive.Item
      className={cn(
        'cursor-pointer rounded-sm px-2 py-2 text-sm outline-none aria-selected:bg-muted',
        className,
      )}
      {...props}
    />
  );
}
