"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useGetBuckets } from "@/modules/platform-kit/hooks/use-storage";
import { AlertTriangle, Folder } from "lucide-react";

export function StorageManager({ projectRef }: { projectRef: string }) {
  const { data: buckets, isLoading, isError } = useGetBuckets(projectRef);

  return (
    <div className="p-6 pt-4 lg:p-8 lg:pt-8">
      <h1 className="text-base font-semibold lg:text-xl">Storage</h1>
      <p className="text-muted-foreground mt-1 hidden text-sm lg:block lg:text-base">
        View and manage the files stored in your app.
      </p>

      {isLoading && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      )}
      {isError && (
        <Alert variant="destructive" className="mt-8">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error loading buckets</AlertTitle>
          <AlertDescription>
            There was a problem loading your storage buckets.
          </AlertDescription>
        </Alert>
      )}

      {buckets && buckets.length > 0 ? (
        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {buckets.map((bucket: any) => (
            <Tooltip key={bucket.id}>
              <TooltipTrigger asChild>
                <Button
                  key={bucket.id}
                  variant="outline"
                  className="h-auto flex-row justify-start gap-4 p-4 text-left"
                >
                  <Folder className="text-muted-foreground h-4 w-4" />
                  <div className="flex-1">
                    <h2 className="mb-1 font-semibold">{bucket.name}</h2>

                    <p className="text-muted-foreground text-xs">
                      Updated {new Date(bucket.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge variant={bucket.public ? "default" : "secondary"}>
                    {bucket.public ? "Public" : "Private"}
                  </Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Viewing files is coming soon</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      ) : buckets && buckets.length === 0 ? (
        <Alert className="mt-8">
          <Folder className="h-4 w-4" />
          <AlertTitle>No storage buckets</AlertTitle>
          <AlertDescription>
            A bucket is a container used to store and protect files in your app.
          </AlertDescription>
        </Alert>
      ) : null}
    </div>
  );
}
