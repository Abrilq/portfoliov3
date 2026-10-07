"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

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
type StyleContextValue = {
  style: PortfolioStyle;
  setStyle: (style: PortfolioStyle) => void;
};

const PortfolioStyleContext = createContext<StyleContextValue | null>(null);

export function PortfolioStyleProvider({ children }: { children: ReactNode }) {
  const [style, setStyle] = useState<PortfolioStyle>("minimalist");

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
