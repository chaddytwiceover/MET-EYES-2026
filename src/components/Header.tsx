import React from "react";
import { Search, Sparkles, SlidersHorizontal, BookOpen, Bookmark, X, Eye } from "lucide-react";
import { Department } from "../types";

interface HeaderProps {
  departments: Department[];
  selectedDepartment: number | null;
  onSelectDepartment: (deptId: number | null) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  savedCount: number;
  activeTab: "gallery" | "saved";
  onTabChange: (tab: "gallery" | "saved") => void;
}

export const Header: React.FC<HeaderProps> = ({
  departments,
  selectedDepartment,
  onSelectDepartment,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  savedCount,
  activeTab,
  onTabChange,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F9F8F6]/95 backdrop-blur-md border-b border-[#E5E2DE] transition-colors">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-sm bg-[#1A1A1A] border border-[#D1CEC9] flex items-center justify-center text-[#D4AF37] shadow-xs">
              <Eye className="w-5 h-5 text-[#D4AF37]" />
            </div>
            <div>
              <div className="flex items-baseline gap-2.5">
                <h1 className="text-xl sm:text-2xl font-serif tracking-tight font-bold text-[#1A1A1A] uppercase">
                  MetEyes
                </h1>
                <span className="text-[10px] font-semibold px-2.5 py-0.5 bg-[#D4AF37] text-white rounded-full uppercase tracking-widest flex items-center gap-1 shadow-xs">
                  <Sparkles className="w-2.5 h-2.5 text-white" />
                  Intelligence
                </span>
              </div>
              <p className="text-xs text-[#706E6B] tracking-normal mt-0.5">
                The Metropolitan Museum of Art • Curatorial Intelligence
              </p>
            </div>
          </div>

          {/* Navigation Tabs (Mobile) */}
          <div className="flex md:hidden items-center gap-1 bg-[#EAE8E4] p-1 rounded-lg border border-[#D1CEC9]">
            <button
              id="mobile-tab-gallery-btn"
              onClick={() => onTabChange("gallery")}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === "gallery"
                  ? "bg-[#1A1A1A] text-white shadow-xs"
                  : "text-[#5A5854] hover:text-[#1A1A1A]"
              }`}
            >
              Gallery
            </button>
            <button
              id="mobile-tab-saved-btn"
              onClick={() => onTabChange("saved")}
              className={`px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1 ${
                activeTab === "saved"
                  ? "bg-[#1A1A1A] text-white shadow-xs"
                  : "text-[#5A5854] hover:text-[#1A1A1A]"
              }`}
            >
              <Bookmark className="w-3 h-3" />
              <span>Saved ({savedCount})</span>
            </button>
          </div>
        </div>

        {/* Search Bar & Desktop Tabs */}
        <div className="flex items-center gap-3 flex-1 max-w-xl">
          <form onSubmit={onSearchSubmit} className="relative flex-1">
            <Search className="w-4 h-4 text-[#8C8881] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="search-artworks-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search Van Gogh, Monet, Egyptian artifacts, armor..."
              className="w-full bg-white border border-[#D1CEC9] hover:border-[#A8A49E] focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] rounded-full pl-10 pr-9 py-2 text-sm text-[#1A1A1A] placeholder-[#8C8881] transition-all outline-none shadow-xs"
            />
            {searchQuery && (
              <button
                id="clear-search-btn"
                type="button"
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C8881] hover:text-[#1A1A1A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Desktop Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-[#EAE8E4] p-1 rounded-full border border-[#D1CEC9]">
            <button
              id="desktop-tab-gallery-btn"
              onClick={() => onTabChange("gallery")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === "gallery"
                  ? "bg-[#1A1A1A] text-white shadow-xs"
                  : "text-[#5A5854] hover:text-[#1A1A1A]"
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Explore Gallery</span>
            </button>
            <button
              id="desktop-tab-saved-btn"
              onClick={() => onTabChange("saved")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 ${
                activeTab === "saved"
                  ? "bg-[#1A1A1A] text-white shadow-xs"
                  : "text-[#5A5854] hover:text-[#1A1A1A]"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>My Curations ({savedCount})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Departments Filter Row */}
      {activeTab === "gallery" && (
        <div className="border-t border-[#E5E2DE] bg-[#F5F3EF] px-4 sm:px-6 lg:px-8 py-2.5 overflow-x-auto scrollbar-none flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#706E6B] shrink-0 mr-1">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Departments:</span>
          </div>

          <button
            id="dept-filter-all"
            onClick={() => onSelectDepartment(null)}
            className={`shrink-0 text-xs px-3.5 py-1 rounded-full transition-all uppercase tracking-wider font-semibold ${
              selectedDepartment === null
                ? "bg-[#D4AF37] text-white border border-[#D4AF37] shadow-xs"
                : "bg-white text-[#5A5854] hover:text-[#1A1A1A] hover:bg-[#EAE8E4] border border-[#D1CEC9]"
            }`}
          >
            All Collections
          </button>

          {departments.map((dept) => (
            <button
              key={dept.departmentId}
              id={`dept-filter-${dept.departmentId}`}
              onClick={() => onSelectDepartment(dept.departmentId)}
              className={`shrink-0 text-xs px-3.5 py-1 rounded-full transition-all font-medium ${
                selectedDepartment === dept.departmentId
                  ? "bg-[#D4AF37] text-white border border-[#D4AF37] shadow-xs"
                  : "bg-white text-[#5A5854] hover:text-[#1A1A1A] hover:bg-[#EAE8E4] border border-[#D1CEC9]"
              }`}
            >
              {dept.displayName}
            </button>
          ))}
        </div>
      )}
    </header>
  );
};
