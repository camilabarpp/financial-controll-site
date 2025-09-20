import { AlertCircle } from "lucide-react";
import { Button } from "./button";

interface ErrorProps {
  message: string;
  onRetry?: () => void;
}

export function Error({ message, onRetry }: ErrorProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-4 max-w-md text-center">
        <AlertCircle className="h-12 w-12 text-destructive" />
        <h2 className="text-lg font-semibold text-foreground">Ops! Algo deu errado</h2>
        <p className="text-muted-foreground">{message}</p>
        {onRetry && (
          <Button 
            onClick={onRetry}
            variant="outline"
            className="mt-4"
          >
            Tentar novamente
          </Button>
        )}
      </div>
    </div>
  );
}
