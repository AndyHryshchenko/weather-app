export const attachPopoverWidthObserver = (
  field: HTMLDivElement | null,
  setWidth: (width: number) => void,
): (() => void) | undefined => {
  if (!field) {
    return undefined;
  }
  const updateWidth = () => setWidth(field.offsetWidth);
  updateWidth();
  const observer = new ResizeObserver(updateWidth);
  observer.observe(field);
  return () => observer.disconnect();
};
