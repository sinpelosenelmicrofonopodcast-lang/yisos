import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        popover: "hsl(var(--popover))",
        "popover-foreground": "hsl(var(--popover-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        yisos: {
          black: "#0b0a0b",
          charcoal: "#1a1513",
          tobacco: "#64371d",
          olive: "#5a620f",
          military: "#848326",
          gold: "#c89434",
          bone: "#e7c37a",
          stitch: "#f2eee3",
          ember: "#9b4f23"
        }
      },
      boxShadow: {
        glow: "0 15px 45px rgba(184, 138, 59, 0.2)",
        panel: "0 24px 55px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        grain: "radial-gradient(circle at 1px 1px, rgba(255,255,255,.02) 1px, transparent 0)",
        smoke: "radial-gradient(circle at 30% 20%, rgba(216, 200, 168, 0.16), transparent 55%), radial-gradient(circle at 70% 60%, rgba(89, 99, 74, 0.12), transparent 60%)"
      },
      fontFamily: {
        display: ["var(--font-cinzel)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"]
      },
      animation: {
        "float-smoke": "floatSmoke 9s ease-in-out infinite"
      },
      keyframes: {
        floatSmoke: {
          "0%, 100%": { transform: "translateY(0) translateX(0)", opacity: "0.4" },
          "50%": { transform: "translateY(-15px) translateX(10px)", opacity: "0.65" }
        }
      }
    }
  },
  plugins: []
};

export default config;
