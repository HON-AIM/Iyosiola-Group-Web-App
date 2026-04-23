"use client";

import { useEffect, useState } from "react";

interface PreloaderProps {
  onComplete: () => void;
  duration?: number;
}

const featuredProducts = [
  { name: "Premium Baking Flour", tagline: "Perfect rise every time" },
  { name: "Golden Semolina", tagline: "Authentic Nigerian taste" },
  { name: "All-Purpose Flour", tagline: "Versatile excellence" },
  { name: "Whole Wheat Flour", tagline: "Heart-healthy choice" },
];

export default function Preloader({ onComplete, duration = 3500 }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [currentProduct, setCurrentProduct] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, duration / 100);

    const productInterval = setInterval(() => {
      setCurrentProduct((prev) => (prev + 1) % featuredProducts.length);
    }, 800);

    const timeout = setTimeout(() => {
      onComplete();
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearInterval(productInterval);
      clearTimeout(timeout);
    };
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white/5 animate-pulse"
            style={{
              width: `${300 + i * 100}px`,
              height: `${300 + i * 100}px`,
              left: `${10 + i * 15}%`,
              top: `${10 + i * 12}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${4 + i}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <div className="mb-10">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20 shadow-2xl">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-accent-400 to-accent-600 flex items-center justify-center">
              <span className="text-3xl md:text-4xl font-black text-white">IF</span>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-wider mb-2">IYOSI FOODS</h1>
          <div className="flex items-center justify-center gap-2">
            <span className="h-px w-12 bg-accent-500"></span>
            <p className="text-primary-200 text-sm md:text-base font-medium tracking-wide">Quality You Can Taste</p>
            <span className="h-px w-12 bg-accent-500"></span>
          </div>
        </div>

        <div key={currentProduct} className="h-16 mb-10 flex flex-col items-center justify-center">
          <p className="text-white/40 text-xs uppercase tracking-[0.3em] mb-1">Featured Product</p>
          <h2 className="text-xl md:text-2xl font-semibold text-white">{featuredProducts[currentProduct].name}</h2>
          <p className="text-accent-300 text-sm mt-0.5">{featuredProducts[currentProduct].tagline}</p>
        </div>

        <div className="w-72 md:w-80">
          <div className="flex justify-between text-xs text-white/60 mb-2">
            <span>Loading</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent-500 to-accent-400 rounded-full relative transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="text-white/30 text-xs mt-8 tracking-wide">Since 2009 - Nigeria's Trusted Flour Brand</p>
      </div>
    </div>
  );
}