"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { AuthManager } from "@/modules/platform-kit/ui/auth";
import { DatabaseManager } from "@/modules/platform-kit/ui/database";
import { LogoSupabase } from "@/modules/platform-kit/ui/logo-supabase";
import { LogsManager } from "@/modules/platform-kit/ui/logs";
import { SecretsManager } from "@/modules/platform-kit/ui/secrets";
import {
  SheetNavigationProvider,
  useSheetNavigation,
} from "@/modules/platform-kit/ui/SheetNavigationContext";
import { StorageManager } from "@/modules/platform-kit/ui/storage";
import { SuggestionsManager } from "@/modules/platform-kit/ui/suggestions";
import { UsersManager } from "@/modules/platform-kit/ui/users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  ChevronLeft,
  ChevronRight,
  Database,
  ExternalLink,
  HardDrive,
  KeyRound,
  Lightbulb,
  ScrollText,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { ReactNode, useMemo } from "react";

const queryClient = new QueryClient();

function DialogView({
  projectRef,
  isMobile,
}: {
  projectRef: string;
  isMobile?: boolean;
}) {
  const { stack, push, popTo, reset } = useSheetNavigation();

  const handleTopLevelNavigation = (title: string, component: ReactNode) => {
    if (stack.length === 1 && stack[0].title === title) {
      return;
    }
    reset();
    push({ title, component });
  };

  const currentView = stack[stack.length - 1];
  const activeManager = stack.length > 0 ? stack[0].title : null;

  const navigationItems = useMemo(
    () => [
      {
        title: "Database",
        icon: Database,
        component: <DatabaseManager projectRef={projectRef} />,
      },
      {
        title: "Storage",
        icon: HardDrive,
        component: <StorageManager projectRef={projectRef} />,
      },
      {
        title: "Auth",
        icon: Shield,
        component: <AuthManager projectRef={projectRef} />,
      },
      {
        title: "Users",
        icon: Users,
        component: <UsersManager projectRef={projectRef} />,
      },
      {
        title: "Secrets",
        icon: KeyRound,
        component: <SecretsManager projectRef={projectRef} />,
      },
      {
        title: "Logs",
        icon: ScrollText,
        component: <LogsManager projectRef={projectRef} />,
      },
      {
        title: "Suggestions",
        icon: Lightbulb,
        component: <SuggestionsManager projectRef={projectRef} />,
      },
    ],
    [projectRef],
  );

  if (isMobile) {
    return (
      <div className="flex h-full flex-col overflow-hidden">
        {/* Content Area */}
        <div className="flex h-full flex-col overflow-hidden">
          <div className="grow overflow-y-auto">
            {currentView ? (
              currentView.component
            ) : (
              <div className="flex h-full items-center justify-center">
                <p className="text-muted-foreground">
                  Select a manager from the bottom navigation to get started.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Navigation Bar */}
        <div className="bg-background border-t">
          <div className="overflow-x-auto">
            <div className="flex min-w-max gap-1 p-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.title}
                    variant={
                      activeManager === item.title ? "secondary" : "ghost"
                    }
                    className="h-16 w-20 min-w-16 flex-col gap-1 px-2 text-xs"
                    onClick={() =>
                      handleTopLevelNavigation(item.title, item.component)
                    }
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-center text-[10px] leading-tight">
                      {item.title === "Auth" ? "Auth" : item.title}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-[240px_1fr] overflow-hidden">
      {/* Sidebar */}
      <div className="flex flex-col border-r px-3 py-6 pb-3">
        <div className="mb-4 px-4">
          <h2 className="text-muted-foreground text-sm font-semibold">
            Manage your back-end
          </h2>
        </div>
        <div className="grow space-y-0.5">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.title}
                variant={activeManager === item.title ? "secondary" : "ghost"}
                className="w-full justify-start text-sm"
                onClick={() =>
                  handleTopLevelNavigation(item.title, item.component)
                }
              >
                <Icon className="text-muted-foreground mr-2" />
                {item.title === "Auth" ? "Authentication" : item.title}
              </Button>
            );
          })}
        </div>
        <footer className="text-muted-foreground -m-3 flex items-center gap-3 border-t p-0 text-sm">
          <HoverCard>
            <HoverCardTrigger asChild>
              <Link
                href={`https://supabase.com/dashboard/project/${projectRef}`}
                target="_blank"
                className="hover:bg-accent flex h-auto w-full items-center justify-start gap-3 rounded-none px-4 py-4 text-left text-sm"
              >
                <LogoSupabase size={16} />
                <span className="flex-1">Open in Supabase</span>
                <ExternalLink className="text-muted-foreground/50 ml-2 h-4 w-4" />
              </Link>
            </HoverCardTrigger>
            <HoverCardContent
              sideOffset={8}
              align="start"
              side="top"
              className="bg-muted/50 w-[216px] text-sm"
            >
              <h4 className="mb-1 font-semibold">About Supabase</h4>
              <p className="text-muted-foreground">
                Access powerful back-end tools for database, auth, storage, and
                logs directly in Supabase.
              </p>
            </HoverCardContent>
          </HoverCard>
        </footer>
      </div>

      {/* Content Area */}
      <div className="flex h-full flex-col overflow-hidden">
        {/* Header with breadcrumbs */}
        <div className="relative flex h-12 shrink-0 items-center border-b px-4">
          {stack.length > 1 && (
            <Button
              variant="outline"
              size="icon"
              className="relative z-10 h-8 w-8"
              onClick={() => popTo(stack.length - 2)}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          )}
          {/* Breadcrumbs */}
          <div className="text-muted-foreground relative z-10 ml-4 flex items-center gap-1.5 text-sm">
            {stack.map((item: { title: string }, index: number) => (
              <div
                key={`${item.title}-${index}`}
                className="flex items-center gap-1.5"
              >
                {index > 0 && <ChevronRight className="h-3 w-3" />}
                {index === stack.length - 1 ? (
                  <span className="text-foreground font-semibold">
                    {item.title}
                  </span>
                ) : (
                  <button
                    onClick={() => popTo(index)}
                    className="hover:underline"
                  >
                    {item.title}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grow overflow-y-auto">
          {currentView ? (
            currentView.component
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">
                Select a manager from the sidebar to get started.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SupabaseManagerDialog({
  projectRef,
  open,
  onOpenChange,
  isMobile,
}: {
  projectRef: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
}) {
  const content = (
    <SheetNavigationProvider
      onStackEmpty={() => {}}
      initialStack={[
        {
          title: "Database",
          component: <DatabaseManager projectRef={projectRef} />,
        },
      ]}
    >
      <DialogView projectRef={projectRef} isMobile={isMobile} />
    </SheetNavigationProvider>
  );

  if (!isMobile) {
    return (
      <QueryClientProvider client={queryClient}>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="h-[80vh] max-h-[700px] w-[1180px] overflow-hidden p-0 sm:max-w-[calc(100%-2rem)] sm:rounded-lg">
            <DialogTitle className="sr-only">Manage your back-end</DialogTitle>
            {content}
          </DialogContent>
        </Dialog>
      </QueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="h-[90vh] overflow-hidden p-0">
          <DrawerHeader className="sr-only">
            <DrawerTitle>Manage your back-end</DrawerTitle>
          </DrawerHeader>
          {content}
        </DrawerContent>
      </Drawer>
    </QueryClientProvider>
  );
}
