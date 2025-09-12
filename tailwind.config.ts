import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        ocean: {
          surface: "hsl(var(--ocean-surface))",
          deep: "hsl(var(--ocean-deep))",
          wave: "hsl(var(--wave))",
        },
        seafoam: "hsl(var(--seafoam))",
        coral: "hsl(var(--coral))",
      },
      backgroundImage: {
        'gradient-ocean': 'var(--gradient-ocean)',
        'gradient-deep': 'var(--gradient-deep)',
        'gradient-wave': 'var(--gradient-wave)',
        'gradient-coral': 'var(--gradient-coral)',
      },
      boxShadow: {
        'wave': 'var(--shadow-wave)',
        'deep': 'var(--shadow-deep)',
        'glow': 'var(--shadow-glow)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        "wave": {
          "0%, 100%": { transform: "translateX(0) translateY(0) scaleY(1)" },
          "50%": { transform: "translateX(-25px) translateY(-10px) scaleY(0.8)" },
        },
        "bubble-float": {
          "0%": { 
            transform: "translateY(100vh) scale(0)",
            opacity: "0",
          },
          "10%": {
            opacity: "1",
          },
          "90%": {
            opacity: "1",
          },
          "100%": { 
            transform: "translateY(-100px) scale(1)",
            opacity: "0",
          },
        },
        "glow-pulse": {
          "0%, 100%": { 
            boxShadow: "var(--shadow-glow)",
          },
          "50%": { 
            boxShadow: "0 0 50px hsl(var(--primary-glow) / 0.8)",
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "wave": "wave 8s ease-in-out infinite",
        "bubble-float": "bubble-float 6s ease-in-out infinite",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
