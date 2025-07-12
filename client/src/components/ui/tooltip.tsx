// Tooltip components completely removed due to React hooks error
// All tooltip functionality is disabled

export function TooltipProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function Tooltip({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export function TooltipTrigger({ children, asChild, ...props }: { children: React.ReactNode; asChild?: boolean; [key: string]: any }) {
  return <>{children}</>;
}

export function TooltipContent({ children, ...props }: { children: React.ReactNode; [key: string]: any }) {
  return null;
}
