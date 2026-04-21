"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Save,
  ImageIcon,
  Megaphone,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Loader2,
  Eye,
  EyeOff,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

type HeroBanner = {
  id: string;
  title: string;
  subtitle: string | null;
  ctaText: string | null;
  ctaLink: string | null;
  badgeText: string | null;
  bgColor: string | null;
  textColor: string | null;
  image: string | null;
  sortOrder: number;
  isActive: boolean;
};

type PromoBanner = {
  id: string;
  title: string;
  subtitle: string | null;
  link: string | null;
  bgGradient: string | null;
  icon: string | null;
  sortOrder: number;
  isActive: boolean;
};

export default function ShopContentPage() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [promos, setPromos] = useState<PromoBanner[]>([]);
  const [flashSaleEndTime, setFlashSaleEndTime] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [savingBanner, setSavingBanner] = useState<string | null>(null);
  const [savingPromo, setSavingPromo] = useState<string | null>(null);
  const [savingFlash, setSavingFlash] = useState(false);
  const [expandedBanner, setExpandedBanner] = useState<string | null>(null);
  const [expandedPromo, setExpandedPromo] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [bannersRes, promosRes, settingsRes] = await Promise.all([
        fetch("/api/admin/banners"),
        fetch("/api/admin/promos"),
        fetch("/api/admin/settings"),
      ]);

      if (bannersRes.ok) {
        const data = await bannersRes.json();
        setBanners(data.banners || []);
      }
      if (promosRes.ok) {
        const data = await promosRes.json();
        setPromos(data.promos || []);
      }
      if (settingsRes.ok) {
        const data = await settingsRes.json();
        const endTime = data.flashSaleEndTime || data.settings?.flashSaleEndTime;
        if (endTime) {
          const date = new Date(endTime);
          setFlashSaleEndTime(date.toISOString().slice(0, 16));
        }
      }
    } catch {
      toast.error("Failed to load shop content");
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Hero Banner CRUD ──────────────────────────
  const addBanner = async () => {
    try {
      const res = await fetch("/api/admin/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Banner",
          subtitle: "Subtitle text here",
          ctaText: "SHOP NOW",
          ctaLink: "/shop",
          badgeText: "NEW",
          bgColor: "#1e3a8a",
          sortOrder: banners.length,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setBanners((prev) => [...prev, data.banner]);
        setExpandedBanner(data.banner.id);
        toast.success("Banner created");
      }
    } catch {
      toast.error("Failed to create banner");
    }
  };

  const updateBanner = async (banner: HeroBanner) => {
    setSavingBanner(banner.id);
    try {
      const res = await fetch("/api/admin/banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(banner),
      });
      if (res.ok) {
        toast.success("Banner saved");
      } else {
        toast.error("Failed to save banner");
      }
    } catch {
      toast.error("Failed to save banner");
    } finally {
      setSavingBanner(null);
    }
  };

  const deleteBanner = async (id: string) => {
    if (!confirm("Delete this banner?")) return;
    try {
      const res = await fetch(`/api/admin/banners?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== id));
        toast.success("Banner deleted");
      }
    } catch {
      toast.error("Failed to delete banner");
    }
  };

  const updateBannerField = (id: string, field: string, value: unknown) => {
    setBanners((prev) =>
      prev.map((b) => (b.id === id ? { ...b, [field]: value } : b))
    );
  };

  // ─── Promo Banner CRUD ──────────────────────────
  const addPromo = async () => {
    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "New Promo",
          subtitle: "Promo description",
          link: "/shop",
          bgGradient: "from-orange-500 to-red-500",
          icon: "Zap",
          sortOrder: promos.length,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setPromos((prev) => [...prev, data.promo]);
        setExpandedPromo(data.promo.id);
        toast.success("Promo created");
      }
    } catch {
      toast.error("Failed to create promo");
    }
  };

  const updatePromo = async (promo: PromoBanner) => {
    setSavingPromo(promo.id);
    try {
      const res = await fetch("/api/admin/promos", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promo),
      });
      if (res.ok) {
        toast.success("Promo saved");
      } else {
        toast.error("Failed to save promo");
      }
    } catch {
      toast.error("Failed to save promo");
    } finally {
      setSavingPromo(null);
    }
  };

  const deletePromo = async (id: string) => {
    if (!confirm("Delete this promo?")) return;
    try {
      const res = await fetch(`/api/admin/promos?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setPromos((prev) => prev.filter((p) => p.id !== id));
        toast.success("Promo deleted");
      }
    } catch {
      toast.error("Failed to delete promo");
    }
  };

  const updatePromoField = (id: string, field: string, value: unknown) => {
    setPromos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  // ─── Flash Sale Timer ──────────────────────────
  const saveFlashSaleTime = async () => {
    setSavingFlash(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flashSaleEndTime: flashSaleEndTime ? new Date(flashSaleEndTime).toISOString() : null,
        }),
      });
      if (res.ok) {
        toast.success("Flash sale timer saved");
      } else {
        toast.error("Failed to save flash sale timer");
      }
    } catch {
      toast.error("Failed to save");
    } finally {
      setSavingFlash(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Shop Content</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage hero banners, promotional sections, and flash sale timer displayed on the shop homepage
        </p>
      </div>

      {/* ─── Flash Sale Timer ──────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-red-50 flex items-center gap-3">
          <Clock className="h-5 w-5 text-red-600" />
          <h2 className="text-lg font-bold text-gray-900">Flash Sale Countdown Timer</h2>
        </div>
        <div className="p-6">
          <p className="text-sm text-gray-500 mb-4">
            Set the end time for the flash sale countdown displayed on the shop. Leave empty to hide the flash sale section.
          </p>
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Flash Sale End Time
              </label>
              <input
                type="datetime-local"
                value={flashSaleEndTime}
                onChange={(e) => setFlashSaleEndTime(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>
            <button
              onClick={saveFlashSaleTime}
              disabled={savingFlash}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 disabled:opacity-70 flex items-center gap-2"
            >
              {savingFlash ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save
            </button>
          </div>
        </div>
      </div>

      {/* ─── Hero Banners ──────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-blue-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ImageIcon className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-bold text-gray-900">Hero Banner Carousel</h2>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
              {banners.length} slides
            </span>
          </div>
          <button
            onClick={addBanner}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Slide
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {banners.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No banners yet. Click &quot;Add Slide&quot; to create your first hero banner.</p>
            </div>
          ) : (
            banners.map((banner) => (
              <div key={banner.id} className="border-l-4 border-l-blue-400">
                {/* Collapsed Header */}
                <div
                  className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    setExpandedBanner(expandedBanner === banner.id ? null : banner.id)
                  }
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-gray-300" />
                    <div
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: banner.bgColor || "#1e3a8a" }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{banner.title}</p>
                      <p className="text-xs text-gray-500">{banner.subtitle || "No subtitle"}</p>
                    </div>
                    {!banner.isActive && (
                      <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateBannerField(banner.id, "isActive", !banner.isActive);
                        updateBanner({ ...banner, isActive: !banner.isActive });
                      }}
                      className="p-1.5 hover:bg-gray-100 rounded"
                      title={banner.isActive ? "Hide" : "Show"}
                    >
                      {banner.isActive ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteBanner(banner.id);
                      }}
                      className="p-1.5 hover:bg-red-50 rounded text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {expandedBanner === banner.id ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Editor */}
                {expandedBanner === banner.id && (
                  <div className="px-5 pb-5 pt-2 bg-gray-50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
                        <input
                          type="text"
                          value={banner.title}
                          onChange={(e) => updateBannerField(banner.id, "title", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={banner.subtitle || ""}
                          onChange={(e) => updateBannerField(banner.id, "subtitle", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">CTA Button Text</label>
                        <input
                          type="text"
                          value={banner.ctaText || ""}
                          onChange={(e) => updateBannerField(banner.id, "ctaText", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">CTA Link</label>
                        <input
                          type="text"
                          value={banner.ctaLink || ""}
                          onChange={(e) => updateBannerField(banner.id, "ctaLink", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Badge Text</label>
                        <input
                          type="text"
                          value={banner.badgeText || ""}
                          onChange={(e) => updateBannerField(banner.id, "badgeText", e.target.value)}
                          placeholder="e.g. Flash Sale"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Image URL</label>
                        <input
                          type="text"
                          value={banner.image || ""}
                          onChange={(e) => updateBannerField(banner.id, "image", e.target.value)}
                          placeholder="https://..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Background Color</label>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={banner.bgColor || "#1e3a8a"}
                            onChange={(e) => updateBannerField(banner.id, "bgColor", e.target.value)}
                            className="w-12 h-10 rounded border border-gray-200 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={banner.bgColor || "#1e3a8a"}
                            onChange={(e) => updateBannerField(banner.id, "bgColor", e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Sort Order</label>
                        <input
                          type="number"
                          value={banner.sortOrder}
                          onChange={(e) =>
                            updateBannerField(banner.id, "sortOrder", parseInt(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => updateBanner(banner)}
                        disabled={savingBanner === banner.id}
                        className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-70 flex items-center gap-2"
                      >
                        {savingBanner === banner.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Save Banner
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ─── Promo Banners ──────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 bg-orange-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Megaphone className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-bold text-gray-900">Promotional Banners</h2>
            <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-medium">
              {promos.length} banners
            </span>
          </div>
          <button
            onClick={addPromo}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Add Promo
          </button>
        </div>
        <div className="divide-y divide-gray-100">
          {promos.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              <Megaphone className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No promos yet. Click &quot;Add Promo&quot; to create promotional banners.</p>
            </div>
          ) : (
            promos.map((promo) => (
              <div key={promo.id} className="border-l-4 border-l-orange-400">
                <div
                  className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                  onClick={() =>
                    setExpandedPromo(expandedPromo === promo.id ? null : promo.id)
                  }
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 text-gray-300" />
                    <div>
                      <p className="font-medium text-gray-900">{promo.title}</p>
                      <p className="text-xs text-gray-500">{promo.subtitle || "No subtitle"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePromo(promo.id);
                      }}
                      className="p-1.5 hover:bg-red-50 rounded text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {expandedPromo === promo.id ? (
                      <ChevronUp className="h-4 w-4 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-gray-400" />
                    )}
                  </div>
                </div>
                {expandedPromo === promo.id && (
                  <div className="px-5 pb-5 pt-2 bg-gray-50 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
                        <input
                          type="text"
                          value={promo.title}
                          onChange={(e) => updatePromoField(promo.id, "title", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Subtitle</label>
                        <input
                          type="text"
                          value={promo.subtitle || ""}
                          onChange={(e) => updatePromoField(promo.id, "subtitle", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Link</label>
                        <input
                          type="text"
                          value={promo.link || ""}
                          onChange={(e) => updatePromoField(promo.id, "link", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Gradient (Tailwind classes)
                        </label>
                        <select
                          value={promo.bgGradient || "from-orange-500 to-red-500"}
                          onChange={(e) => updatePromoField(promo.id, "bgGradient", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        >
                          <option value="from-orange-500 to-red-500">Orange → Red</option>
                          <option value="from-blue-500 to-indigo-600">Blue → Indigo</option>
                          <option value="from-green-500 to-emerald-600">Green → Emerald</option>
                          <option value="from-purple-500 to-pink-500">Purple → Pink</option>
                          <option value="from-amber-500 to-orange-600">Amber → Orange</option>
                          <option value="from-teal-500 to-cyan-600">Teal → Cyan</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Icon</label>
                        <select
                          value={promo.icon || "Zap"}
                          onChange={(e) => updatePromoField(promo.id, "icon", e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        >
                          <option value="Zap">⚡ Zap</option>
                          <option value="Truck">🚛 Truck</option>
                          <option value="Percent">% Percent</option>
                          <option value="Gift">🎁 Gift</option>
                          <option value="Tag">🏷️ Tag</option>
                          <option value="Star">⭐ Star</option>
                          <option value="ShoppingBag">🛍️ Shopping Bag</option>
                          <option value="Package">📦 Package</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Sort Order</label>
                        <input
                          type="number"
                          value={promo.sortOrder}
                          onChange={(e) =>
                            updatePromoField(promo.id, "sortOrder", parseInt(e.target.value) || 0)
                          }
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => updatePromo(promo)}
                        disabled={savingPromo === promo.id}
                        className="px-5 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 disabled:opacity-70 flex items-center gap-2"
                      >
                        {savingPromo === promo.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        Save Promo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
