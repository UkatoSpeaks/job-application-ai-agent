'use client';

import React, { useSyncExternalStore } from 'react';
import { useTheme } from 'next-themes';
import { Sun, Moon } from 'lucide-react';

const emptySubscribe = () => () => {};

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const { resolvedTheme, setTheme } = useTheme();
  // Hydration-safe "has this mounted on the client yet" check, without an
  // effect-triggered setState render pass.
  const mounted = useSyncExternalStore(emptySubscribe, () => true, () => false);

  const isDark = mounted && resolvedTheme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label="Toggle theme"
      className={`relative w-9 h-9 shrink-0 flex items-center justify-center rounded-md border-2 border-line bg-surface text-ink shadow-brutal-xs hover:-translate-y-0.5 hover:shadow-brutal-sm active:translate-y-0 active:shadow-none transition-all duration-150 ${className}`}
    >
      {mounted && (isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />)}
    </button>
  );
};
