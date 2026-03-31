"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/hooks/use-auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuthStore();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please enter both email and password.");

    setIsLoading(true);

    // Simulate network latency / loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Authenticate (mock)
    login(email);
    
    toast.success("Successfully signed in!");
    setIsLoading(false);
    
    // Redirect entirely handled by next/navigation
    router.push("/");
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Panel: Cover Image */}
      <div className="hidden lg:flex w-1/2 relative bg-primary items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/30 z-10 mix-blend-multiply" />
        <Image
          unoptimized
          src="/images/barista-profile.jpg" // Using an existing known image representing an aesthetic barista shot
          alt="The Atelier Coffee Shop"
          fill
          priority
          className="object-cover scale-105"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative z-20 text-center max-w-sm"
        >
          <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/90 flex items-center justify-center text-primary-foreground mb-6 shadow-xl backdrop-blur-md border border-white/20">
            <span className="material-symbols-outlined text-4xl">coffee</span>
          </div>
          <h1 className="font-headline text-5xl font-extrabold text-white tracking-widest uppercase mb-4 drop-shadow-md">
            The Atelier
          </h1>
          <p className="text-white/80 font-medium tracking-widest uppercase text-sm drop-shadow-sm">
            Crafting the perfect cup, every time.
          </p>
        </motion.div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md mx-auto space-y-8"
        >
          <div className="space-y-2 text-center lg:text-left">
            <h2 className="font-headline text-4xl font-extrabold text-foreground tracking-tight">
              Welcome back
            </h2>
            <p className="text-muted-foreground font-medium">
              Enter your credentials to access the POS.
            </p>
          </div>

          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Email</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-muted-foreground text-xl">
                    mail
                  </span>
                  <Input
                    type="email"
                    required
                    placeholder="julian@theatelier.co"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 bg-card border-border rounded-xl shadow-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground">Password</label>
                  <a href="#" className="text-sm font-bold text-primary hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-2.5 text-muted-foreground text-xl">
                    lock
                  </span>
                  <Input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 bg-card border-border rounded-xl shadow-sm"
                  />
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all active:scale-[0.98] shadow-md flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, ease: "linear", duration: 1 }}
                  className="material-symbols-outlined text-lg"
                >
                  progress_activity
                </motion.span>
              ) : (
                <>
                  <span>Sign In</span>
                  <span className="material-symbols-outlined text-lg">arrow_forward</span>
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <a href="#" className="font-bold text-primary hover:underline">
              Contact Admin
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
