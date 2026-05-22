interface RequestErrorAlertProps {
  message: string;
  title?: string;
}

export function RequestErrorAlert({ message, title }: RequestErrorAlertProps) {
  return (
    <div
      role="alert"
      className="rounded-md border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary"
    >
      {title ? <p className="font-medium">{title}</p> : null}
      <p className={title ? 'mt-1 text-foreground/80' : undefined}>{message}</p>
    </div>
  );
}
