import React from "react";
import { AlertTriangle } from "lucide-react";

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  message = "An unexpected error occurred",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-6 border border-border rounded-lg bg-background/50 text-center">
      <AlertTriangle className="h-10 w-10 text-destructive mb-4" />
      <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <button
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          onClick={onRetry}
        >
          Reload page
        </button>
      )}
    </div>
  );
};

export default ErrorDisplay;
