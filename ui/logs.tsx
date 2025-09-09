"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useGetLogs } from "@/modules/platform-kit/hooks/use-logs";
import { Check, ChevronsUpDown, Logs, Terminal } from "lucide-react";
import { useMemo, useState } from "react";
import { LogsTableName, genDefaultQuery } from "../lib/logs";

// Define log types with names and descriptions
const logTypes = [
  {
    value: LogsTableName.FN_EDGE,
    label: "Function Edge Logs",
    description: "Edge function execution logs with request/response data",
  },
  {
    value: LogsTableName.AUTH,
    label: "Authentication Logs",
    description: "User authentication events and security logs",
  },
  {
    value: LogsTableName.POSTGRES,
    label: "PostgreSQL Logs",
    description: "Database queries, errors, and performance metrics",
  },
  {
    value: LogsTableName.REALTIME,
    label: "Realtime Logs",
    description: "WebSocket connections and realtime subscriptions",
  },
  {
    value: LogsTableName.STORAGE,
    label: "Storage Logs",
    description: "File uploads, downloads, and storage operations",
  },
  {
    value: LogsTableName.PG_CRON,
    label: "Cron Job Logs",
    description: "Scheduled job executions and cron task logs",
  },
  {
    value: LogsTableName.EDGE,
    label: "Edge Logs",
    description: "HTTP requests and responses from Edge Functions",
  },

  {
    value: LogsTableName.FUNCTIONS,
    label: "Function Logs",
    description: "Serverless function execution logs and events",
  },
  {
    value: LogsTableName.POSTGREST,
    label: "PostgREST Logs",
    description: "API requests to your database through PostgREST",
  },
  {
    value: LogsTableName.SUPAVISOR,
    label: "Supavisor Logs",
    description: "Connection pooling and database proxy logs",
  },
  {
    value: LogsTableName.PGBOUNCER,
    label: "PgBouncer Logs",
    description: "Legacy connection pooling logs",
  },
  {
    value: LogsTableName.WAREHOUSE,
    label: "Warehouse Logs",
    description: "Data warehouse operations and analytics",
  },
  {
    value: LogsTableName.PG_UPGRADE,
    label: "PostgreSQL Upgrade Logs",
    description: "Database upgrade processes and migration logs",
  },
];

export function LogsManager({ projectRef }: { projectRef: string }) {
  const [activeTab, setActiveTab] = useState<LogsTableName>(
    LogsTableName.FN_EDGE,
  );
  const [open, setOpen] = useState(false);

  const sql = useMemo(() => genDefaultQuery(activeTab), [activeTab]);

  const { data: logs, isLoading, error } = useGetLogs(projectRef, { sql });

  const selectedLogType = logTypes.find((type) => type.value === activeTab);

  return (
    <>
      <div className="bg-background sticky top-0 z-10 mb-6 flex items-center justify-between border-b p-6 pt-4 lg:p-8 lg:pt-8">
        <div className="flex-1">
          <h1 className="text-base font-semibold lg:text-xl">Logs</h1>
          <p className="text-muted-foreground mt-1 hidden text-sm lg:block lg:text-base">
            Debug errors and track activity in your app
          </p>
        </div>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-64 justify-between"
            >
              {selectedLogType ? selectedLogType.label : "Select log type..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <Command>
              <CommandInput placeholder="Search log types..." className="h-9" />
              <CommandList
                className="max-h-60 overflow-y-auto"
                onWheel={(e) => {
                  e.stopPropagation();
                }}
                style={{ overscrollBehavior: "contain" }}
              >
                <CommandEmpty>No log type found.</CommandEmpty>
                <CommandGroup>
                  {logTypes.map((logType) => (
                    <CommandItem
                      key={logType.value}
                      value={logType.value}
                      onSelect={(currentValue) => {
                        setActiveTab(currentValue as LogsTableName);
                        setOpen(false);
                      }}
                      className="flex items-center gap-2 p-3"
                    >
                      <div className="flex-1">
                        <div className="mb-1 text-xs leading-none font-medium">
                          {logType.label}
                        </div>
                        <div className="text-muted-foreground text-xs leading-snug">
                          {logType.description}
                        </div>
                      </div>
                      <Check
                        className={cn(
                          "mt-0.5 h-4 w-4",
                          activeTab === logType.value
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {isLoading && (
        <div className="mx-8 mt-8 space-y-2">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      )}
      {(error || (logs && logs.error)) && (
        <div className="mx-6 mt-8 lg:mx-8">
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error fetching logs</AlertTitle>
            <AlertDescription>
              {(error as any)?.message ||
                (typeof logs?.error === "object" && logs.error?.message) ||
                "An unexpected error occurred. Please try again."}
            </AlertDescription>
          </Alert>
        </div>
      )}
      {logs && logs.result && logs.result.length > 0 && (
        <div className="mt-4 w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {Object.keys(logs.result[0] as object).map((key, idx, arr) => (
                  <TableHead
                    key={key}
                    className={
                      (idx === 0 ? "first:pl-6 lg:first:pl-8 " : "") +
                      (idx === arr.length - 1 ? "last:pr-6 lg:last:pr-8" : "")
                    }
                  >
                    {key
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {(logs.result as any[]).map((log, index) => (
                <TableRow
                  key={log.id || index}
                  className="group hover:bg-muted/50 relative"
                >
                  {Object.keys(logs.result?.[0] ?? []).map((key, idx, arr) => {
                    const value = log[key];
                    const formattedValue = (() => {
                      if (key === "timestamp" && typeof value === "number") {
                        return new Date(value / 1000).toLocaleString();
                      }
                      if (value === null) {
                        return "NULL";
                      }
                      return typeof value === "object"
                        ? JSON.stringify(value, null, 2)
                        : String(value);
                    })();

                    return (
                      <TableCell
                        key={key}
                        className="text-muted-foreground group-hover:text-foreground min-w-[8rem] text-xs first:pl-6 last:pr-6 lg:first:pl-8 lg:last:pr-8"
                      >
                        <HoverCard>
                          <HoverCardTrigger asChild>
                            <div className="w-fit max-w-96 cursor-default truncate font-mono text-xs">
                              {formattedValue}
                            </div>
                          </HoverCardTrigger>
                          <HoverCardContent className="max-h-96 w-96 overflow-auto p-3">
                            <pre className="font-mono text-xs break-words whitespace-pre-wrap">
                              {formattedValue}
                            </pre>
                          </HoverCardContent>
                        </HoverCard>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
      {logs && logs.result && logs.result.length === 0 && (
        <div className="mx-8 mt-8">
          <Alert>
            <Logs className="h-4 w-4" />
            <AlertTitle>No logs found</AlertTitle>
            <AlertDescription>
              Logs will appear here when your application generates activity.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </>
  );
}
