"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useGetSuggestions } from "@/modules/platform-kit/hooks/use-suggestions";
import { Terminal } from "lucide-react";
import { useMemo } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";

export function SuggestionsManager({ projectRef }: { projectRef: string }) {
  const { data: suggestions, isLoading, error } = useGetSuggestions(projectRef);

  const sortedSuggestions = useMemo(() => {
    if (!suggestions) return [];
    const levelOrder = { ERROR: 1, WARN: 2, INFO: 3 };
    return [...suggestions].sort((a: any, b: any) => {
      const levelA = levelOrder[a.level as keyof typeof levelOrder] || 99;
      const levelB = levelOrder[b.level as keyof typeof levelOrder] || 99;
      return levelA - levelB;
    });
  }, [suggestions]);

  const getBadgeVariant = (level: "ERROR" | "WARN" | "INFO") => {
    switch (level) {
      case "ERROR":
        return "destructive";
      case "WARN":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6 pt-4 lg:p-12 lg:pt-12">
      <h2 className="mb-1 text-base font-semibold lg:text-xl">Suggestions</h2>
      <p className="text-muted-foreground mb-4 text-sm lg:mb-8 lg:text-base">
        Improve your project's security and performance.
      </p>
      {isLoading && (
        <div className="space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      )}
      {error && (
        <Alert variant="destructive" className="mt-8">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error fetching suggestions</AlertTitle>
          <AlertDescription>
            {(error as any)?.message ||
              "An unexpected error occurred. Please try again."}
          </AlertDescription>
        </Alert>
      )}
      {suggestions && (
        <div>
          {sortedSuggestions.length > 0 ? (
            <div>
              {sortedSuggestions.map((suggestion: any) => (
                <div
                  key={suggestion.cache_key}
                  className="group relative border-b py-4 last:border-b-0"
                >
                  <div className="flex-1">
                    <div className="flex items-start justify-start gap-4">
                      <h4 className="text-sm font-semibold">
                        {suggestion.title}
                      </h4>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant={getBadgeVariant(suggestion.level)}
                          className="shrink-0"
                        >
                          {suggestion.level}
                        </Badge>
                        {suggestion.type && (
                          <Badge
                            variant={
                              suggestion.type === "security"
                                ? "destructive"
                                : "secondary"
                            }
                            className="shrink-0"
                          >
                            {suggestion.type.charAt(0).toUpperCase() +
                              suggestion.type.slice(1)}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-muted-foreground prose prose-sm mt-2 max-w-none text-sm">
                      <ReactMarkdown
                        components={{
                          code({ inline, children, ...props }: any) {
                            return inline ? (
                              <code
                                className="bg-muted rounded px-1"
                                {...props}
                              >
                                {children}
                              </code>
                            ) : (
                              <pre
                                className="bg-muted overflow-x-auto rounded p-2"
                                {...props}
                              >
                                <code>{children}</code>
                              </pre>
                            );
                          },
                        }}
                      >
                        {suggestion.detail}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>No suggestions found</AlertTitle>
              <AlertDescription>
                Your project looks good! No suggestions at this time.
              </AlertDescription>
            </Alert>
          )}
        </div>
      )}
    </div>
  );
}
