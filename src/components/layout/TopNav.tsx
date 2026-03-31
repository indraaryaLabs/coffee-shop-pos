"use client";

import { Input } from "@/components/ui/input";

interface TopNavProps {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export function TopNav({
  title,
  subtitle,
  searchPlaceholder = "Search transactions...",
  searchQuery,
  onSearchChange,
}: TopNavProps) {
  return (
    <header className="fixed top-0 right-0 w-[calc(100%-16rem)] h-16 bg-background/80 backdrop-blur-md z-40 px-8 flex items-center justify-between border-b border-border/50">
      <div className="flex items-center gap-6 flex-1">
        <div className="relative group max-w-md w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-xl">
            search
          </span>
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery ?? ""}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="bg-secondary border-none rounded-xl pl-10 pr-4 py-2 text-sm w-full focus-visible:ring-1 focus-visible:ring-primary transition-all"
          />
        </div>
        {title && (
          <div className="flex items-center gap-4">
            <h2 className="font-headline font-extrabold text-lg text-foreground tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <span className="text-[10px] font-bold text-accent bg-secondary px-2 py-1 rounded-full uppercase tracking-widest">
                {subtitle}
              </span>
            )}
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button className="text-muted-foreground hover:bg-primary/10 rounded-full p-2 transition-all relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
        </button>
        <button className="text-muted-foreground hover:bg-primary/10 rounded-full p-2 transition-all">
          <span className="material-symbols-outlined">account_circle</span>
        </button>
      </div>
    </header>
  );
}
