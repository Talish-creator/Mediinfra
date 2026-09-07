import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import { AlertTriangle, FileQuestion, RotateCcw, ArrowLeft, Activity } from "lucide-react";
import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";
import { MediInfraProvider } from "@/lib/mediinfra-store";
import { AppShell } from "@/components/mediinfra/AppShell";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FC] dark:bg-slate-950 px-4">
      <div className="w-full max-w-lg rounded-[22px] border border-[#0F172A]/[0.08] dark:border-white/[0.08] bg-white dark:bg-slate-900 p-8 sm:p-10 text-center shadow-[0_20px_50px_rgba(2,6,23,0.08)]">
        <div className="mx-auto mb-5 flex size-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200/80 dark:border-blue-900/80 text-primary shadow-sm">
          <FileQuestion className="size-7 text-primary" />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-semibold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-3">
          Error 404 • Resource Unresolved
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white sm:text-3xl">
          Telemetry Node Not Found
        </h1>
        <p className="mt-2.5 text-sm text-[#64748B] dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
          The requested command route, sensor viewpoint, or telemetry view cannot be resolved in the
          current site schema.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 active:scale-[0.98]"
          >
            <ArrowLeft className="size-3.5" />
            Return to Command Center
          </Link>
          <Link
            to="/digital-twin"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0F172A]/10 dark:border-white/10 bg-white dark:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-[#0F172A] dark:text-white shadow-sm transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <Activity className="size-3.5 text-primary" />
            Open Digital Twin
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F6F8FC] dark:bg-slate-950 px-4">
      <div className="w-full max-w-xl rounded-[22px] border border-red-200/80 dark:border-red-950 bg-white dark:bg-slate-900 p-8 sm:p-10 shadow-[0_20px_50px_rgba(2,6,23,0.08)]">
        <div className="flex items-start gap-4 mb-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 text-red-600 shadow-sm">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-mono font-semibold uppercase tracking-wider bg-red-100/80 dark:bg-red-950/80 text-red-700 dark:text-red-400 mb-1.5">
              Fault Code • ERR_TELEMETRY_PIPELINE
            </div>
            <h1 className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white sm:text-2xl">
              Telemetry Ingestion Interrupted
            </h1>
          </div>
        </div>
        <p className="text-sm text-[#64748B] dark:text-slate-400 leading-relaxed mb-4">
          A runtime exception occurred while processing telemetry streams or rendering dashboard
          nodes. You can invalidate cache and retry stream synchronization.
        </p>
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-3.5 mb-6 overflow-x-auto">
          <p className="font-mono text-xs text-red-600 dark:text-red-400 font-medium">
            {error?.message || "Unknown hardware telemetry stream error."}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all duration-150 hover:bg-blue-700 active:scale-[0.98]"
          >
            <RotateCcw className="size-3.5" />
            Retry Stream Sync
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0F172A]/10 dark:border-white/10 bg-white dark:bg-slate-800 px-5 py-2.5 text-xs font-semibold text-[#0F172A] dark:text-white shadow-sm transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            Go to Command Center
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "MediInfra — Healthcare Site Safety Command" },
      {
        name: "description",
        content:
          "ELV digital twin and workforce intelligence platform for hospital construction safety.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <MediInfraProvider>
        <AppShell>
          {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
          <Outlet />
        </AppShell>
        <Toaster position="top-right" richColors closeButton />
      </MediInfraProvider>
    </QueryClientProvider>
  );
}
