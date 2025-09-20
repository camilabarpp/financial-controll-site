import { Loader2 } from "lucide-react";

export function Loading() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
        <span className="text-lg font-medium text-muted-foreground">
          Carregando...
        </span>
      </div>
    </div>
  );
}
