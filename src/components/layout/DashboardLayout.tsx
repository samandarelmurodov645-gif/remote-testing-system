import { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
  header?: ReactNode;
}

export function DashboardLayout({ children, header }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-50">
      {header}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="relative inline-block">
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {title}
            </h1>
            <span className="absolute -bottom-1.5 left-0 w-10 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" />
          </div>
          {description && (
            <p className="mt-4 text-slate-500 text-sm leading-relaxed max-w-xl">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 shrink-0 mt-1">{actions}</div>
        )}
      </div>
    </div>
  );
}
