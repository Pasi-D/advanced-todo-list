import React, { ReactNode, useEffect, useState } from "react";
import ErrorDisplay from "./ErrorDisplay";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback,
}) => {
  const [errorState, setErrorState] = useState<{
    hasError: boolean;
    error: Error | null;
  }>({
    hasError: false,
    error: null,
  });

  const ErrorCatcher: React.FC<{ children: ReactNode }> = ({ children }) => {
    try {
      return <>{children}</>;
    } catch (error) {
      setErrorState({
        hasError: true,
        error: error instanceof Error ? error : new Error("Unknown error"),
      });
      return null;
    }
  };

  useEffect(() => {
    if (errorState.hasError && errorState.error) {
      console.error("Error caught by ErrorBoundary:", errorState.error);
    }
  }, [errorState]);

  if (errorState.hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <ErrorDisplay
        message={errorState.error?.message}
        onRetry={() => window.location.reload()}
      />
    );
  }

  return <ErrorCatcher>{children}</ErrorCatcher>;
};

export default ErrorBoundary;
