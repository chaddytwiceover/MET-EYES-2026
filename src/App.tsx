import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Sparkles,
  Shuffle,
  BookOpen,
  Bookmark,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Layers,
  ArrowUp,
} from "lucide-react";
import { Artwork, Department } from "./types";
import { Header } from "./components/Header";
import { ArtworkCard } from "./components/ArtworkCard";
import { ArtworkModal } from "./components/ArtworkModal";

export default function App() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"gallery" | "saved">("gallery");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [savedArtworks, setSavedArtworks] = useState<Artwork[]>(() => {
    try {
      const stored = localStorage.getItem("met_gallery_saved_pieces");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [showScrollTop, setShowScrollTop] = useState(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // Sync saved artworks to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("met_gallery_saved_pieces", JSON.stringify(savedArtworks));
    } catch (e) {
      console.error("Failed to save to localStorage:", e);
    }
  }, [savedArtworks]);

  // Load departments on mount
  useEffect(() => {
    async function loadDepartments() {
      try {
        const res = await fetch("/api/met/departments");
        if (res.ok) {
          const data = await res.json();
          setDepartments(data.departments || []);
        }
      } catch (e) {
        console.warn("Error loading departments:", e);
      }
    }
    loadDepartments();
  }, []);

  // Fetch artworks
  const fetchArtworks = useCallback(
    async (pageNum: number, isNewSearch: boolean) => {
      if (isNewSearch) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      try {
        let url = `/api/met/artworks?page=${pageNum}&limit=12`;
        if (selectedDepartment) {
          url += `&departmentId=${selectedDepartment}`;
        }
        if (searchQuery.trim()) {
          url += `&q=${encodeURIComponent(searchQuery.trim())}`;
        }

        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to load artworks");
        const data = await res.json();

        const newItems: Artwork[] = data.artworks || [];
        setArtworks((prev) => {
          if (isNewSearch) return newItems;
          // Deduplicate by objectID
          const existingIDs = new Set(prev.map((a) => a.objectID));
          const filtered = newItems.filter((a) => !existingIDs.has(a.objectID));
          return [...prev, ...filtered];
        });

        setHasMore(data.hasMore ?? false);
        setPage(pageNum);
      } catch (err: any) {
        console.error("Error fetching artworks:", err);
        setError("Unable to load artworks from The Met API right now.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [selectedDepartment, searchQuery]
  );

  // Initial & Filter change trigger
  useEffect(() => {
    setPage(1);
    fetchArtworks(1, true);
  }, [selectedDepartment]);

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchArtworks(1, true);
  };

  // Toggle Save Artwork
  const handleToggleSave = (artwork: Artwork) => {
    setSavedArtworks((prev) => {
      const exists = prev.some((a) => a.objectID === artwork.objectID);
      if (exists) {
        return prev.filter((a) => a.objectID !== artwork.objectID);
      } else {
        return [artwork, ...prev];
      }
    });
  };

  // Check if an artwork is saved
  const isArtworkSaved = (artwork: Artwork) => {
    return savedArtworks.some((a) => a.objectID === artwork.objectID);
  };

  // Pick a random surprise masterpiece
  const handleSurpriseMe = () => {
    if (artworks.length > 0) {
      const randomArt = artworks[Math.floor(Math.random() * artworks.length)];
      setSelectedArtwork(randomArt);
    }
  };

  // Scroll to top listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-[#2C2C2C] flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#1A1A1A] border-x-[8px] sm:border-x-[12px] border-[#E5E2DE]">
      {/* Sticky Header */}
      <Header
        departments={departments}
        selectedDepartment={selectedDepartment}
        onSelectDepartment={(id) => {
          setSelectedDepartment(id);
          setActiveTab("gallery");
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        savedCount={savedArtworks.length}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Curatorial Hero Banner */}
        {activeTab === "gallery" && !searchQuery && (
          <div className="relative overflow-hidden bg-[#EAE8E4] border border-[#D1CEC9] p-6 sm:p-10 mb-10 shadow-lg">
            {/* Architectural Gold Corner Accents */}
            <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-[#D4AF37] opacity-60 pointer-events-none" />
            <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-[#D4AF37] opacity-60 pointer-events-none" />

            <div className="relative z-10 max-w-3xl space-y-3">
              <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-bold uppercase tracking-[0.2em]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>The Metropolitan Museum of Art • MetEyes Curatorial Intelligence</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#1A1A1A] tracking-tight leading-tight">
                Discover 5,000 Years of World Art Through The Eyes of AI
              </h2>

              <p className="text-sm sm:text-base text-[#4A4A4A] leading-relaxed max-w-2xl">
                Explore authentic masterpieces from The Met collection. Select any piece to have Gemini reveal hidden mysteries, material secrets, symbolic iconography, and curatorial insights.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <button
                  id="surprise-masterpiece-btn"
                  onClick={handleSurpriseMe}
                  className="bg-[#1A1A1A] hover:bg-[#D4AF37] text-white text-xs font-bold uppercase tracking-[0.2em] px-5 py-3 transition-colors duration-300 flex items-center gap-2 shadow-xs"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Surprise Masterpiece</span>
                </button>

                <div className="flex items-center gap-1.5 text-xs text-[#706E6B] flex-wrap">
                  <span className="font-bold uppercase tracking-wider text-[11px] text-[#8C8881]">Curated:</span>
                  <button
                    onClick={() => {
                      setSearchQuery("Van Gogh");
                      fetchArtworks(1, true);
                    }}
                    className="px-3 py-1 bg-white hover:bg-[#EAE8E4] text-[#4A4A4A] hover:text-[#1A1A1A] border border-[#D1CEC9] text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Van Gogh
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery("Monet");
                      fetchArtworks(1, true);
                    }}
                    className="px-3 py-1 bg-white hover:bg-[#EAE8E4] text-[#4A4A4A] hover:text-[#1A1A1A] border border-[#D1CEC9] text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Monet
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery("Hokusai");
                      fetchArtworks(1, true);
                    }}
                    className="px-3 py-1 bg-white hover:bg-[#EAE8E4] text-[#4A4A4A] hover:text-[#1A1A1A] border border-[#D1CEC9] text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Hokusai
                  </button>
                  <button
                    onClick={() => {
                      setSearchQuery("Armor");
                      fetchArtworks(1, true);
                    }}
                    className="px-3 py-1 bg-white hover:bg-[#EAE8E4] text-[#4A4A4A] hover:text-[#1A1A1A] border border-[#D1CEC9] text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
                  >
                    Armor
                  </button>
                </div>
              </div>

              {/* Geometric Balance Bar */}
              <div className="w-full mt-6 grid grid-cols-4 gap-3 max-w-md">
                <div className="h-1.5 bg-[#D4AF37] rounded-full" />
                <div className="h-1.5 bg-[#D1CEC9] rounded-full" />
                <div className="h-1.5 bg-[#D1CEC9] rounded-full" />
                <div className="h-1.5 bg-[#D1CEC9] rounded-full" />
              </div>
            </div>
          </div>
        )}

        {/* Gallery Tab View */}
        {activeTab === "gallery" && (
          <div>
            {/* Active search or department filter pill bar */}
            {(searchQuery || selectedDepartment) && (
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#E5E2DE] text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[#706E6B] font-bold uppercase tracking-wider text-[11px]">Filtering by:</span>
                  {selectedDepartment && (
                    <span className="bg-white text-[#1A1A1A] px-3 py-1 border border-[#D4AF37] flex items-center gap-1.5 font-semibold text-xs shadow-xs">
                      <span>
                        {departments.find((d) => d.departmentId === selectedDepartment)?.displayName ||
                          "Department"}
                      </span>
                      <button
                        onClick={() => setSelectedDepartment(null)}
                        className="hover:text-[#D4AF37] font-bold text-sm"
                      >
                        ×
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="bg-white text-[#1A1A1A] px-3 py-1 border border-[#D1CEC9] flex items-center gap-1.5 font-semibold text-xs shadow-xs">
                      <span>Query: "{searchQuery}"</span>
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          fetchArtworks(1, true);
                        }}
                        className="hover:text-[#D4AF37] font-bold text-sm"
                      >
                        ×
                      </button>
                    </span>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedDepartment(null);
                    setSearchQuery("");
                    fetchArtworks(1, true);
                  }}
                  className="text-[#706E6B] hover:text-[#1A1A1A] font-bold uppercase tracking-wider underline underline-offset-2"
                >
                  Reset all filters
                </button>
              </div>
            )}

            {/* Error state */}
            {error && (
              <div className="p-6 bg-red-50 border border-red-200 text-center mb-6 shadow-xs">
                <p className="text-sm text-red-700 mb-3">{error}</p>
                <button
                  onClick={() => fetchArtworks(1, true)}
                  className="px-4 py-2 bg-[#1A1A1A] hover:bg-[#D4AF37] text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            )}

            {/* Loading Skeleton Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white overflow-hidden border border-[#D1CEC9] animate-pulse flex flex-col"
                  >
                    <div className="aspect-[4/5] bg-[#EAE8E4]" />
                    <div className="p-4 space-y-2.5 bg-white">
                      <div className="h-4 bg-[#E5E2DE] w-3/4" />
                      <div className="h-3 bg-[#E5E2DE] w-1/2" />
                      <div className="h-3 bg-[#E5E2DE] w-2/3" />
                      <div className="h-8 bg-[#EAE8E4] mt-3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : artworks.length === 0 ? (
              /* Empty state */
              <div className="py-16 text-center max-w-md mx-auto space-y-4 bg-white border border-[#D1CEC9] p-8 shadow-xs">
                <div className="w-16 h-16 bg-[#F5F3EF] border border-[#D1CEC9] flex items-center justify-center mx-auto text-[#706E6B]">
                  <SlidersHorizontal className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-serif font-bold text-[#1A1A1A]">
                  No matching artworks found
                </h3>
                <p className="text-xs text-[#706E6B] leading-relaxed">
                  Try searching with broader terms (e.g. "painting", "sculpture", "Rembrandt", "Greek") or select a different department.
                </p>
                <button
                  onClick={() => {
                    setSelectedDepartment(null);
                    setSearchQuery("");
                    fetchArtworks(1, true);
                  }}
                  className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#D4AF37] text-white text-xs font-bold uppercase tracking-[0.15em] transition-colors shadow-xs"
                >
                  View All Collections
                </button>
              </div>
            ) : (
              /* Artwork Grid */
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {artworks.map((artwork) => (
                    <ArtworkCard
                      key={artwork.objectID}
                      artwork={artwork}
                      onSelect={(art) => setSelectedArtwork(art)}
                      isSaved={isArtworkSaved(artwork)}
                      onToggleSave={handleToggleSave}
                    />
                  ))}
                </div>

                {/* Load More Button */}
                {hasMore && (
                  <div className="mt-12 mb-8 text-center" ref={sentinelRef}>
                    <button
                      id="load-more-artworks-btn"
                      onClick={() => fetchArtworks(page + 1, false)}
                      disabled={loadingMore}
                      className="bg-white hover:bg-[#F5F3EF] border border-[#D1CEC9] hover:border-[#D4AF37] text-[#1A1A1A] font-bold uppercase tracking-widest px-8 py-3.5 text-xs transition-all shadow-xs inline-flex items-center gap-2.5"
                    >
                      {loadingMore ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D4AF37]" />
                          <span>Exploring The Met vaults...</span>
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4 text-[#D4AF37]" />
                          <span>Load More Masterpieces</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Saved Collection Tab View */}
        {activeTab === "saved" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#E5E2DE]">
              <div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
                  <Bookmark className="w-5 h-5 text-[#D4AF37] fill-current" />
                  <span>My Curated Collection</span>
                </h2>
                <p className="text-xs text-[#706E6B] mt-1">
                  Art pieces you have bookmarked for deep study with Gemini
                </p>
              </div>

              {savedArtworks.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm("Clear all saved artworks from your collection?")) {
                      setSavedArtworks([]);
                    }
                  }}
                  className="text-xs text-[#706E6B] hover:text-red-600 font-bold uppercase tracking-wider transition-colors"
                >
                  Clear Collection
                </button>
              )}
            </div>

            {savedArtworks.length === 0 ? (
              <div className="py-20 text-center max-w-sm mx-auto space-y-4 bg-white border border-[#D1CEC9] p-8 shadow-xs">
                <div className="w-16 h-16 bg-[#F5F3EF] border border-[#D1CEC9] flex items-center justify-center mx-auto text-[#8C8881]">
                  <Bookmark className="w-7 h-7" />
                </div>
                <h3 className="text-base font-serif font-bold text-[#1A1A1A]">
                  Your curations are empty
                </h3>
                <p className="text-xs text-[#706E6B] leading-relaxed">
                  Browse the gallery and click the bookmark icon on any piece to curate your own personal exhibition.
                </p>
                <button
                  onClick={() => setActiveTab("gallery")}
                  className="px-5 py-2.5 bg-[#1A1A1A] hover:bg-[#D4AF37] text-white text-xs font-bold uppercase tracking-[0.15em] transition-colors shadow-xs"
                >
                  Browse Masterpieces
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {savedArtworks.map((artwork) => (
                  <ArtworkCard
                    key={artwork.objectID}
                    artwork={artwork}
                    onSelect={(art) => setSelectedArtwork(art)}
                    isSaved={true}
                    onToggleSave={handleToggleSave}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E2DE] bg-[#E5E2DE] py-8 px-6 text-center text-xs text-[#706E6B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-[#1A1A1A] tracking-wider text-sm uppercase">METEYES</span>
            <span className="text-[#8C8881]">•</span>
            <span className="font-medium text-[#4A4A4A]">The Met Collection Explorer & Curatorial Intelligence</span>
          </div>
          <p className="text-[11px] text-[#706E6B]">
            Open Access data & imagery provided by The Metropolitan Museum of Art • Powered by Google Gemini
          </p>
        </div>
      </footer>

      {/* Detail & Gemini Facts Modal */}
      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
          isSaved={isArtworkSaved(selectedArtwork)}
          onToggleSave={handleToggleSave}
        />
      )}

      {/* Floating Scroll to Top button */}
      {showScrollTop && (
        <button
          id="scroll-to-top-btn"
          onClick={scrollToTop}
          title="Scroll to top"
          className="fixed bottom-6 right-6 p-3 bg-white/95 text-[#2C2C2C] hover:text-[#D4AF37] hover:border-[#D4AF37] border border-[#D1CEC9] shadow-lg transition-all duration-200 z-30"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
