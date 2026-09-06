import React, { useState } from "react";
import { Sparkles, Bookmark, Eye, ExternalLink, Calendar, MapPin } from "lucide-react";
import { Artwork } from "../types";

interface ArtworkCardProps {
  artwork: Artwork;
  onSelect: (artwork: Artwork) => void;
  isSaved: boolean;
  onToggleSave: (artwork: Artwork) => void;
}

export const ArtworkCard: React.FC<ArtworkCardProps> = ({
  artwork,
  onSelect,
  isSaved,
  onToggleSave,
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const imageUrl = artwork.primaryImageSmall || artwork.primaryImage;

  return (
    <div
      id={`artwork-card-${artwork.objectID}`}
      className="group relative bg-white overflow-hidden border border-[#D1CEC9] hover:border-[#D4AF37] transition-all duration-300 flex flex-col hover:shadow-xl hover:shadow-[#2C2C2C]/10"
    >
      {/* Artwork Image Container with Geometric Framing */}
      <div
        onClick={() => onSelect(artwork)}
        className="relative w-full aspect-[4/5] bg-[#EAE8E4] overflow-hidden cursor-pointer flex items-center justify-center border-b border-[#E5E2DE]"
      >
        {/* Geometric Corner Accents */}
        <div className="absolute top-2.5 left-2.5 w-4 h-4 border-t-2 border-l-2 border-[#D4AF37] opacity-0 group-hover:opacity-70 transition-opacity z-10 pointer-events-none" />
        <div className="absolute bottom-2.5 right-2.5 w-4 h-4 border-b-2 border-r-2 border-[#D4AF37] opacity-0 group-hover:opacity-70 transition-opacity z-10 pointer-events-none" />

        {/* Shimmer loading placeholder */}
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-[#EAE8E4] animate-pulse flex items-center justify-center text-[#8C8881]">
            <span className="text-xs uppercase tracking-widest font-mono">Loading Artwork...</span>
          </div>
        )}

        {/* Fallback if image fails */}
        {imageError ? (
          <div className="p-6 text-center text-[#8C8881] flex flex-col items-center justify-center">
            <Eye className="w-8 h-8 mb-2 opacity-40 text-[#A8A49E]" />
            <p className="text-xs font-serif italic text-[#706E6B]">Image available in Met archive</p>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={artwork.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/90 via-[#1A1A1A]/25 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="flex items-center justify-between text-xs text-stone-200 mb-1">
            <span className="font-mono text-[#D4AF37] flex items-center gap-1 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              Explore Gemini Facts
            </span>
            <span className="text-stone-300 bg-[#1A1A1A]/90 px-2 py-0.5 rounded border border-stone-700 text-[11px] font-mono">
              #{artwork.objectID}
            </span>
          </div>
        </div>

        {/* Department tag top-left */}
        {artwork.department && (
          <span className="absolute top-2.5 left-2.5 z-10 text-[10px] tracking-wider uppercase font-semibold px-2.5 py-0.5 rounded-full bg-white/90 backdrop-blur-md text-[#2C2C2C] border border-[#D1CEC9] shadow-xs">
            {artwork.department.split(" ")[0]}
          </span>
        )}

        {/* Bookmark save button top-right */}
        <button
          id={`save-btn-${artwork.objectID}`}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSave(artwork);
          }}
          aria-label={isSaved ? "Remove from saved collection" : "Save to my collection"}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
            isSaved
              ? "bg-[#D4AF37] text-white"
              : "bg-white/90 text-[#4A4A4A] hover:text-[#D4AF37] hover:bg-white border border-[#D1CEC9]"
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* Info Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between bg-white">
        <div>
          {/* Title */}
          <h3
            onClick={() => onSelect(artwork)}
            className="text-base font-serif font-bold text-[#1A1A1A] hover:text-[#D4AF37] transition-colors cursor-pointer line-clamp-2 leading-snug tracking-tight"
            title={artwork.title}
          >
            {artwork.title}
          </h3>

          {/* Artist & Date */}
          <p className="text-xs text-[#4A4A4A] mt-1 font-semibold line-clamp-1">
            {artwork.artistDisplayName || "Artist Unknown"}
          </p>
          
          <div className="flex items-center gap-2 text-[11px] text-[#706E6B] mt-1.5 flex-wrap font-medium">
            {artwork.objectDate && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#A8A49E]" />
                {artwork.objectDate}
              </span>
            )}
            {artwork.culture && (
              <span className="text-[#A8A49E]">• {artwork.culture}</span>
            )}
            {artwork.galleryNumber && (
              <span className="flex items-center gap-1 text-[#D4AF37] font-semibold text-[10px]">
                <MapPin className="w-2.5 h-2.5" />
                Gallery {artwork.galleryNumber}
              </span>
            )}
          </div>

          {/* Medium */}
          {artwork.medium && (
            <p className="text-[11px] text-[#8C8881] mt-1.5 line-clamp-1 italic">
              {artwork.medium}
            </p>
          )}
        </div>

        {/* Actions Button */}
        <div className="mt-4 pt-3 border-t border-[#E5E2DE] flex items-center gap-2">
          <button
            id={`open-facts-btn-${artwork.objectID}`}
            onClick={() => onSelect(artwork)}
            className="flex-1 bg-[#1A1A1A] hover:bg-[#D4AF37] text-white font-bold text-xs uppercase tracking-[0.15em] py-2.5 px-3 transition-colors duration-300 flex items-center justify-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-white" />
            <span>Discover Facts</span>
          </button>

          {artwork.objectURL && (
            <a
              href={artwork.objectURL}
              target="_blank"
              rel="noopener noreferrer"
              title="View on metmuseum.org"
              className="p-2.5 bg-[#F5F3EF] hover:bg-[#EAE8E4] text-[#706E6B] hover:text-[#1A1A1A] border border-[#D1CEC9] transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
