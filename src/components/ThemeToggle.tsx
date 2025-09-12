import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative overflow-hidden transition-all duration-300 hover:scale-110"
    >
      {theme === 'light' ? (
        <Moon className="h-5 w-5 text-primary animate-float" />
      ) : (
        <Sun className="h-5 w-5 text-primary-glow animate-glow-pulse" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}