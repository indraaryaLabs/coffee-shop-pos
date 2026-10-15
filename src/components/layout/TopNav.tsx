"use client";

import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface TopNavProps {
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  children?: React.ReactNode;
}

export function TopNav({
  title,
  subtitle,
  searchPlaceholder = "Search transactions...",
  searchQuery,
  onSearchChange,
  children,
}: TopNavProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const user = session?.user;
  const userName = user?.name || "User";
  const userRole = (user as any)?.role || "barista";

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Logged out successfully");
          router.push("/login");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message || "Failed to logout");
        }
      }
    });
  };

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
        {children}
        <button className="text-muted-foreground hover:bg-primary/10 rounded-full p-2 transition-all relative">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-background" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger render={
            <button className="text-muted-foreground hover:bg-primary/10 rounded-full p-2 transition-all outline-none focus-visible:ring-2 focus-visible:ring-primary" />
          }>
            <span className="material-symbols-outlined">account_circle</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 font-headline bg-popover border border-border shadow-xl rounded-xl">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-bold flex flex-col">
                <span className="text-foreground">{userName}</span>
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest leading-tight">{userRole}</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border/50" />
              <DropdownMenuItem className="cursor-pointer gap-3 font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg">
                <span className="material-symbols-outlined text-[18px]">settings</span>
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer gap-3 font-semibold text-destructive focus:text-destructive focus:bg-destructive/10 hover:text-destructive hover:bg-destructive/10 rounded-lg mt-1"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
