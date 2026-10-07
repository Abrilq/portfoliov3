"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

const portfolioStyles = [
  { id: "minimalist", label: "Minimalist", symbol: "○" },
  { id: "brutalist", label: "Brutalist", symbol: "▦" },
  { id: "neubrutalist", label: "Neubrutalist", symbol: "✳" },
  { id: "bauhaus", label: "Bauhaus", symbol: "◒" },
  { id: "neumorphism", label: "Neumorphism", symbol: "◍" },
  { id: "retro-futurism", label: "Retro futurism", symbol: "✦" },
  { id: "cyberpunk", label: "Cyberpunk", symbol: "⌁" },
  { id: "glassmorphism", label: "Glassmorphism", symbol: "◌" },
] as const;

type PortfolioStyle = (typeof portfolioStyles)[number]["id"];
const storageKey = "portfolio-visual-style";
const styleChangeEvent = "portfolio-style-change";

type StyleContextValue = {
  style: PortfolioStyle;
  setStyle: (style: PortfolioStyle) => void;
};

const PortfolioStyleContext = createContext<StyleContextValue | null>(null);

function getStoredStyle(): PortfolioStyle {
  if (typeof window === "undefined") return "minimalist";

  const storedStyle = window.localStorage.getItem(storageKey);
  return portfolioStyles.find(({ id }) => id === storedStyle)?.id ?? "minimalist";
}

function subscribeToStyle(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(styleChangeEvent, onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(styleChangeEvent, onChange);
  };
}

function getServerStyle(): PortfolioStyle {
  return "minimalist";
}

export function PortfolioStyleProvider({ children }: { children: ReactNode }) {
  const style = useSyncExternalStore(subscribeToStyle, getStoredStyle, getServerStyle);
  const setStyle = (nextStyle: PortfolioStyle) => {
    window.localStorage.setItem(storageKey, nextStyle);
    window.dispatchEvent(new Event(styleChangeEvent));
  };

  return (
    <PortfolioStyleContext.Provider value={{ style, setStyle }}>
      <div className="portfolio-theme" data-style={style}>
        {children}
      </div>
    </PortfolioStyleContext.Provider>
  );
}

export function PortfolioStylePicker() {
  const context = useContext(PortfolioStyleContext);

  if (!context) {
    throw new Error("PortfolioStylePicker must be used inside PortfolioStyleProvider.");
  }

  return (
    <nav className="style-picker" aria-label="Portfolio visual styles">
      <p className="eyebrow">Try a different visual style</p>
      <div className="style-picker-options">
        {portfolioStyles.map(({ id, label, symbol }) => (
          <button
            className="style-option"
            type="button"
            key={id}
            aria-pressed={context.style === id}
            onClick={() => context.setStyle(id)}
          >
            <span aria-hidden="true">{symbol}</span>
            {label}
          </button>
        ))}
      </div>
    </nav>
  );
}
