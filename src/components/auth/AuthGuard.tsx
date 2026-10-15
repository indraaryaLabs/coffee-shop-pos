"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (!isPending && !session) {
      router.push("/login");
    }
  }, [session, isPending, router]);

  // Handle loading state
  if (!isMounted || isPending) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex items-center justify-center"
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <div className="absolute w-12 h-12 rounded-full border-4 border-primary/20" />
        </motion.div>
        <p className="text-sm font-headline tracking-widest text-muted-foreground uppercase animate-pulse">
          Brewing your experience...
        </p>
      </div>
    );
  }

  // Redirecting state
  if (!session) return null;

  return <>{children}</>;
}
