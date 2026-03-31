"use client";

import { motion } from "framer-motion";
import { TopNav } from "@/components/layout/TopNav";
import { useTheme } from "next-themes";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <>
      <TopNav title="" searchPlaceholder="Search settings..." />
      <main className="pt-24 px-8 pb-12 font-sans min-h-screen max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="mb-12">
            <h2 className="font-headline text-4xl font-extrabold text-foreground tracking-tight mb-2">
              Settings & Preferences
            </h2>
            <p className="text-muted-foreground font-medium">
              Manage your store, appearance, and POS configuration.
            </p>
          </div>

          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8 mb-8">
            <h3 className="font-headline text-xl font-bold text-foreground mb-6">
              Appearance
            </h3>
            <div className="flex flex-col sm:flex-row gap-6">
              <button
                onClick={() => setTheme("light")}
                className={`flex-1 p-6 rounded-2xl border-2 transition-all group ${
                  theme === "light"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="w-full h-32 bg-[#FFF8F0] rounded-xl border border-border mb-4 flex items-center justify-center">
                  <span className="text-[#4B2E2B] font-headline font-bold">
                    Light Theme
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      theme === "light"
                        ? "border-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {theme === "light" && (
                      <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                    )}
                  </div>
                  <span className="font-medium text-foreground">
                    Warm Coffee (Light)
                  </span>
                </div>
              </button>

              <button
                onClick={() => setTheme("dark")}
                className={`flex-1 p-6 rounded-2xl border-2 transition-all group ${
                  theme === "dark"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <div className="w-full h-32 bg-[#1A1412] rounded-xl border border-border mb-4 flex items-center justify-center">
                  <span className="text-[#F5E6D3] font-headline font-bold">
                    Dark Theme
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      theme === "dark"
                        ? "border-primary"
                        : "border-muted-foreground"
                    }`}
                  >
                    {theme === "dark" && (
                      <div className="w-2.5 h-2.5 bg-primary rounded-full" />
                    )}
                  </div>
                  <span className="font-medium text-foreground">
                    Espresso (Dark)
                  </span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-card rounded-[2rem] shadow-sm border border-border p-8 text-center text-muted-foreground py-16">
            <span className="material-symbols-outlined text-4xl mb-4 opacity-50">
              construction
            </span>
            <p className="font-medium">More settings coming soon.</p>
          </div>
        </motion.div>
      </main>
    </>
  );
}
