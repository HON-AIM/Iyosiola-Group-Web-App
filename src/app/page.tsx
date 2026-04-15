"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import Preloader from "@/components/Preloader";
import { ArrowRight, ArrowLeft, Star, Truck, Shield, Award, Phone, ChevronRight } from "lucide-react";

/* ─── Carousel Slides ─── */
const heroSlides = [
  {
    id: 1,
    title: "Pure Wheat Flour",
    subtitle: "Enriched • Premium Quality",
    description: "Made from the finest quality wheat. Vitamin-enriched and milled to perfection for all your baking needs.",
    cta: { text: "Shop Wheat Flour", href: "/shop?category=WHEAT" },
    gradient: "from-primary-900 via-primary-800 to-primary-700",
    image: "/uploads/hero-pure-wheat-flour.jpg",
  },
  {
    id: 2,
    title: "Pure Cane Sugar",
    subtitle: "Premium Quality • Naturally Sweet",
    description: "Made from the finest quality sugarcane. 100% natural and extra fine for all your baking and cooking needs.",
    cta: { text: "Shop Sugar", href: "/shop" },
    gradient: "from-[#1a365d] via-[#1e3a5f] to-[#2d5a7b]",
    image: "/uploads/hero-pure-cane-sugar.jpg",
  },
  {
    id: 3,
    title: "Pure Cane Sugar Cubes",
    subtitle: "Pure Cane • Extra Fine • 100% Natural",
    description: "Premium sugar cubes for your tea, coffee, and everyday sweetening. Perfectly shaped, consistently sweet.",
    cta: { text: "Shop Sugar Cubes", href: "/shop" },
    gradient: "from-[#2d3748] via-[#1a365d] to-[#2a4365]",
    image: "/uploads/hero-sugar-cubes.jpg",
  },
  {
    id: 4,
    title: "Premium Baking Flour",
    subtitle: "Perfect Rise, Every Time",
    description: "Crafted for professional bakers and home cooks who demand consistent, exceptional results.",
    cta: { text: "Shop Baking Flour", href: "/shop?category=BAKING" },
    gradient: "from-primary-900 via-[#1e3a6e] to-accent-700",
    image: "/uploads/hero-baking-flour.png",
  },
];

/* ─── Static Data ─── */
const featuredProducts = [
  { id: 1, name: "Premium Baking Flour 1kg", price: 850, badge: "Best Seller", image: "/uploads/hero-baking-flour.png" },
  { id: 2, name: "Golden Semolina 2kg", price: 1500, badge: null, image: "/uploads/hero-semolina.png" },
  { id: 3, name: "All-Purpose Flour 2.5kg", price: 1200, badge: "Value Pack", image: "/uploads/hero-all-purpose.png" },
  { id: 4, name: "Whole Wheat Flour 1kg", price: 950, badge: null, image: "/uploads/hero-wheat-flour.png" },
];

const testimonials = [
  { name: "Amaka O.", role: "Baker, Lagos", text: "Best flour I've used in 10 years of baking. Consistent quality every time!", rating: 5 },
  { name: "Chef Emeka", role: "Restaurant Owner", text: "Iyosi Foods delivers on their promise. My bread rises perfectly every single time.", rating: 5 },
  { name: "Mrs. Folake A.", role: "Home Cook", text: "My family loves the difference. The texture and taste are unmatched.", rating: 5 },
];

const trustBadges = [
  { icon: Truck, label: "Nationwide Delivery", desc: "Fast & reliable across Nigeria" },
  { icon: Shield, label: "Quality Assured", desc: "100% satisfaction guaranteed" },
  { icon: Award, label: "15+ Years", desc: "Trusted excellence since 2009" },
];

const stats = [
  { value: "15+", label: "Years of Excellence" },
  { value: "500+", label: "Happy Customers" },
  { value: "36", label: "States Covered" },
  { value: "100%", label: "Quality Guaranteed" },
];

/* ─── Hero Carousel Component ─── */
function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartX = useRef(0);

  const goTo = useCallback((index: number) => {
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % heroSlides.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  }, []);

  // Auto-advance
  useEffect(() => {
    if (isPaused) return;
    intervalRef.current = setInterval(next, 6000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isPaused, next]);

  // Touch handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      diff > 0 ? next() : prev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [next, prev]);

  const slide = heroSlides[current];

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section
      className="relative min-h-[90vh] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Featured products"
    >
      <AnimatePresence custom={direction} mode="wait">
        <motion.div
          key={slide.id}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.gradient}`}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-[600px] h-[600px] rounded-full"
                style={{
                  background: "radial-gradient(circle, rgba(255,255,255,0.06) 0%, transparent 70%)",
                  left: `${i * 30 - 10}%`,
                  top: `${i * 20 - 15}%`,
                }}
                animate={{ x: [0, 40, 0], y: [0, 20, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 15 + i * 3, repeat: Infinity, ease: "easeInOut", delay: i * 2 }}
              />
            ))}
          </div>

          {/* Content */}
          <div className="container mx-auto px-4 relative z-10 h-full min-h-[90vh] flex items-center">
            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16 w-full py-20">
              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="flex-1 text-center lg:text-left"
              >
                <motion.span
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-accent-300 font-semibold px-5 py-2 rounded-full text-sm mb-6 border border-accent-400/30"
                >
                  <Star className="w-4 h-4 text-accent-400" />
                  {slide.subtitle}
                </motion.span>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="font-heading text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 leading-[1.08]"
                >
                  {slide.title.split(" ").slice(0, -1).join(" ")}{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 via-accent-400 to-accent-300">
                    {slide.title.split(" ").slice(-1)}
                  </span>
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="text-lg md:text-xl text-white/80 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed"
                >
                  {slide.description}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                >
                  <Link
                    href={slide.cta.href}
                    className="group px-8 py-4 bg-accent-500 hover:bg-accent-600 text-white font-bold rounded-xl shadow-2xl shadow-accent-500/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    {slide.cta.text}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/shop"
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2 backdrop-blur-sm"
                  >
                    View All Products
                  </Link>
                </motion.div>
              </motion.div>

              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="flex-1 flex justify-center"
              >
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-accent-500/15 rounded-full blur-3xl scale-95" />
                  <div className="relative w-72 h-72 md:w-[420px] md:h-[420px] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                    <Image
                      src={slide.image}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      priority
                      sizes="(max-width: 768px) 288px, 420px"
                    />
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
        aria-label="Previous slide"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white transition-all hover:scale-110"
        aria-label="Next slide"
      >
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-10 h-3 bg-accent-400"
                : "w-3 h-3 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === current ? "true" : undefined}
          />
        ))}
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-surface-50 to-transparent z-10" />
    </section>
  );
}

/* ─── Main Homepage ─── */
export default function HomePage() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem("iyosi_visited");
    if (hasVisited) {
      setIsLoading(false);
    }
  }, []);

  const handlePreloaderComplete = () => {
    sessionStorage.setItem("iyosi_visited", "true");
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence>{isLoading && <Preloader onComplete={handlePreloaderComplete} />}</AnimatePresence>

      <div className="flex flex-col min-h-screen bg-surface-50">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Stats Bar */}
        <section className="bg-white py-12 border-b border-surface-100">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 text-center">
              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-primary-600">{stat.value}</div>
                  <div className="text-surface-500 text-sm mt-1 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
              <div>
                <h2 className="text-sm font-bold text-accent-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <span className="w-8 h-1 bg-accent-500 rounded-full" />
                  Our Bestsellers
                </h2>
                <h3 className="font-heading text-3xl md:text-4xl font-extrabold text-primary-900">Featured Products</h3>
              </div>
              <Link
                href="/shop"
                className="text-primary-600 font-semibold hover:text-primary-800 flex items-center gap-2 group"
              >
                View All Products
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Link
                    href="/shop"
                    className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-surface-100 hover:border-surface-200"
                  >
                    <div className="relative aspect-square bg-gradient-to-br from-surface-50 to-surface-100 flex items-center justify-center p-4 overflow-hidden">
                      {product.badge && (
                        <span className="absolute top-4 left-4 bg-accent-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
                          {product.badge}
                        </span>
                      )}
                      <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500">
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        />
                      </div>
                    </div>
                    <div className="p-5">
                      <h4 className="font-semibold text-surface-800 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 min-h-[3rem]">
                        {product.name}
                      </h4>
                      <div className="flex items-center gap-1 mb-3">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        ))}
                        <span className="text-xs text-surface-500 ml-1">(128)</span>
                      </div>
                      <p className="text-primary-600 font-bold text-xl">
                        ₦{product.price.toLocaleString()}
                      </p>
                      <button className="mt-4 w-full bg-primary-600 group-hover:bg-primary-700 text-white font-semibold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
                        Add to Cart
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust / Why Choose Us */}
        <section className="bg-gradient-to-r from-primary-900 via-primary-800 to-primary-900 py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-sm font-bold text-accent-400 uppercase tracking-widest mb-2">Why Choose Us</h2>
              <h3 className="font-heading text-3xl md:text-4xl font-extrabold text-white">The Iyosi Foods Difference</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {trustBadges.map((badge, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/10 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="w-16 h-16 bg-accent-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <badge.icon className="w-8 h-8 text-accent-400" />
                  </div>
                  <h4 className="text-xl font-bold text-white mb-2">{badge.label}</h4>
                  <p className="text-primary-200">{badge.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 px-4 bg-surface-100">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-sm font-bold text-accent-600 uppercase tracking-widest mb-2">Testimonials</h2>
              <h3 className="font-heading text-3xl md:text-4xl font-extrabold text-primary-900">What Our Customers Say</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className="bg-white rounded-2xl p-8 shadow-sm border border-surface-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-surface-700 mb-6 leading-relaxed italic">&ldquo;{testimonial.text}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-bold text-lg">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-surface-900">{testimonial.name}</p>
                      <p className="text-sm text-surface-500">{testimonial.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-accent-600 to-accent-500 py-16 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
              <div>
                <h2 className="font-heading text-2xl md:text-3xl font-extrabold text-white mb-2">Need Help Choosing?</h2>
                <p className="text-accent-100">Our team is ready to assist you with product recommendations.</p>
              </div>
              <Link
                href="/contact"
                className="flex items-center gap-3 bg-white text-primary-900 font-bold px-8 py-4 rounded-xl hover:bg-surface-50 transition-colors shadow-lg"
              >
                <Phone className="w-5 h-5" />
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
