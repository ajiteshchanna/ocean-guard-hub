import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Waves, BarChart3, FileText, User } from 'lucide-react';

interface NavbarProps {
  isAuthenticated?: boolean;
}

export function Navbar({ isAuthenticated = false }: NavbarProps) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/report', label: 'Report', icon: FileText },
    { path: '/insights', label: 'Insights', icon: Waves },
    { path: '/profile', label: 'My Profile', icon: User },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-primary/10 bg-card/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="relative">
            <Waves className="h-8 w-8 text-primary group-hover:animate-float" />
            <div className="absolute inset-0 bg-primary-glow/20 rounded-full animate-glow-pulse" />
          </div>
          <span className="text-xl font-bold text-primary">Ocean Guard</span>
        </Link>

        {/* Navigation Items (only show if authenticated) */}
        {isAuthenticated && (
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "ocean" : "ghost"}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        )}

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {!isAuthenticated && (
            <div className="flex items-center space-x-2">
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="ocean" size="sm">
                  Get Started
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}