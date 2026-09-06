import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Sparkles,
  Volume2,
  VolumeX,
  Bookmark,
  ExternalLink,
  Info,
  Layers,
  Search,
  MessageSquare,
  HelpCircle,
  ChevronRight,
  ZoomIn,
  RefreshCw,
  Share2,
  Check,
  Send,
  Eye,
} from "lucide-react";
import { Artwork, ArtFacts, ArtAnswer } from "../types";

interface ArtworkModalProps {
  artwork: Artwork | null;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (artwork: Artwork) => void;
}

export const ArtworkModal: React.FC<ArtworkModalProps> = ({
  artwork,
  onClose,
  isSaved,
  onToggleSave,
}) => {
  if (!artwork) return null;

  // Selected image (primary or additional)
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  // Gemini facts state
  const [focusMode, setFocusMode] = useState<"balanced" | "secrets" | "technique" | "symbolism">("balanced");
  const [facts, setFacts] = useState<ArtFacts | null>(null);
  const [factsLoading, setFactsLoading] = useState(false);
  const [factsError, setFactsError] = useState<string | null>(null);

  // Audio speech narration state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Q&A state
  const [userQuestion, setUserQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState<ArtAnswer[]>([]);
  const [isAsking, setIsAsking] = useState(false);
  const [copied, setCopied] = useState(false);

  const allImages = [
    artwork.primaryImage || artwork.primaryImageSmall,
    ...(artwork.additionalImages || []),
  ].filter(Boolean);

  const currentImage = allImages[activeImageIndex] || artwork.primaryImage;

  // Fetch facts whenever artwork or focusMode changes
  useEffect(() => {
    let isMounted = true;
    stopSpeech();

    async function loadFacts() {
      if (!artwork) return;
      setFactsLoading(true);
      setFacts(null);
      setFactsError(null);

      try {
        const res = await fetch("/api/gemini/facts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            objectId: artwork.objectID,
            title: artwork.title,
            artist: artwork.artistDisplayName,
            date: artwork.objectDate,
            medium: artwork.medium,
            culture: artwork.culture,
            period: artwork.period,
            department: artwork.department,
            classification: artwork.classification,
            focusMode,
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to load Gemini facts");
        }

        const data = await res.json();
        if (isMounted) {
          setFacts(data.facts);
        }
      } catch (err: any) {
        console.warn("Notice fetching facts:", err);
        if (isMounted) {
          setFactsError("Could not retrieve AI facts at this moment.");
        }
      } finally {
        if (isMounted) {
          setFactsLoading(false);
        }
      }
    }

    loadFacts();

    return () => {
      isMounted = false;
      stopSpeech();
    };
  }, [artwork?.objectID, focusMode]);

  // Handle Speech Narration (Audio Guide)
  const toggleSpeech = () => {
    if (!("speechSynthesis" in window)) {
      alert("Audio speech synthesis is not supported on this browser.");
      return;
    }

    if (isSpeaking) {
      stopSpeech();
      return;
    }

    if (!facts) return;

    window.speechSynthesis.cancel();

    const narrationText = `${facts.headline}. ${facts.summary}. Here are key facts: ${facts.facts
      .map((f) => `${f.title}: ${f.text}`)
      .join(". ")}. Curator reflection: ${facts.curatorInsight}`;

    const utterance = new SpeechSynthesisUtterance(narrationText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    // Pick a natural sounding English voice if available
    const voices = window.speechSynthesis.getVoices();
    const englishVoice =
      voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Serena"))) ||
      voices.find((v) => v.lang.startsWith("en"));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    speechUtteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const stopSpeech = () => {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  };

  // Handle custom visitor question
  const handleAskQuestion = async (e?: React.FormEvent, customQ?: string) => {
    if (e) e.preventDefault();
    const query = (customQ || userQuestion).trim();
    if (!query || isAsking || !artwork) return;

    setIsAsking(true);
    setUserQuestion("");

    try {
      const res = await fetch("/api/gemini/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          artwork: {
            title: artwork.title,
            artistDisplayName: artwork.artistDisplayName,
            artistDisplayBio: artwork.artistDisplayBio,
            objectDate: artwork.objectDate,
            medium: artwork.medium,
            dimensions: artwork.dimensions,
            culture: artwork.culture,
            period: artwork.period,
            department: artwork.department,
            classification: artwork.classification,
          },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQaHistory((prev) => [data, ...prev]);
      }
    } catch (err) {
      console.warn("Notice in ask question:", err);
    } finally {
      setIsAsking(false);
    }
  };

  // Copy facts text
  const handleCopyFacts = () => {
    if (!facts) return;
    const text = `🎨 ${artwork.title} (${artwork.objectDate}) by ${artwork.artistDisplayName}\n\n${facts.headline}\n${facts.summary}\n\nKey Insights:\n${facts.facts
      .map((f) => `• ${f.title}: ${f.text}`)
      .join("\n")}\n\nCurator Insight: ${facts.curatorInsight}\n\nSource: The Metropolitan Museum of Art via Met Gallery Explorer`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Close modal on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-[#1A1A1A]/80 backdrop-blur-md overflow-y-auto">
      {/* Click outside backdrop */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Modal Container */}
      <div
        id="artwork-detail-modal"
        className="relative z-10 w-full max-w-6xl max-h-[94vh] bg-[#F9F8F6] border-[8px] sm:border-[12px] border-[#E5E2DE] shadow-2xl flex flex-col overflow-hidden text-[#2C2C2C] animate-in fade-in zoom-in-95 duration-200 my-auto"
      >
        {/* Top Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E2DE] bg-[#F9F8F6]">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-serif text-[#1A1A1A] text-sm font-bold tracking-tight uppercase shrink-0">
              MetEyes
            </span>
            <span className="text-[#8C8881]">•</span>
            <span className="text-xs font-bold uppercase tracking-widest text-[#706E6B] truncate">
              {artwork.department || "Curatorial Dossier"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Save Button */}
            <button
              id="modal-save-btn"
              onClick={() => onToggleSave(artwork)}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.15em] flex items-center gap-1.5 transition-colors shadow-xs ${
                isSaved
                  ? "bg-[#D4AF37] text-white"
                  : "bg-[#1A1A1A] hover:bg-[#D4AF37] text-white"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
              <span className="hidden sm:inline">{isSaved ? "In Collection" : "Add to My Gallery"}</span>
            </button>

            {/* Share / Copy Button */}
            <button
              id="modal-share-btn"
              onClick={handleCopyFacts}
              title="Copy facts to clipboard"
              className="p-2 bg-white hover:bg-[#EAE8E4] text-[#4A4A4A] hover:text-[#1A1A1A] border border-[#D1CEC9] transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            {/* Official Met link */}
            {artwork.objectURL && (
              <a
                id="modal-met-link"
                href={artwork.objectURL}
                target="_blank"
                rel="noopener noreferrer"
                title="View on Official Met Collection Site"
                className="p-2 bg-white hover:bg-[#EAE8E4] text-[#4A4A4A] hover:text-[#1A1A1A] border border-[#D1CEC9] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}

            {/* Close Button */}
            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-2 bg-white hover:bg-[#EAE8E4] text-[#4A4A4A] hover:text-[#1A1A1A] border border-[#D1CEC9] transition-colors ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-y-auto divide-y lg:divide-y-0 lg:divide-x divide-[#E5E2DE]">
          {/* Left Column: Artwork Presentation & Met Catalog Info */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-[#F9F8F6]">
            <div>
              {/* Image Viewport with Geometric Framing */}
              <div
                className={`relative w-full overflow-hidden bg-[#EAE8E4] border border-[#D1CEC9] shadow-inner flex items-center justify-center p-4 transition-all ${
                  isZoomed ? "cursor-zoom-out min-h-[420px]" : "cursor-zoom-in min-h-[320px] max-h-[460px]"
                }`}
                onClick={() => setIsZoomed(!isZoomed)}
              >
                {/* Architectural Gold Corner Accents */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37] opacity-60 pointer-events-none" />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37] opacity-60 pointer-events-none" />

                <img
                  src={currentImage}
                  alt={artwork.title}
                  referrerPolicy="no-referrer"
                  className={`w-full object-contain transition-all duration-300 ${
                    isZoomed ? "scale-125" : "max-h-[440px]"
                  }`}
                />

                {/* Zoom prompt badge */}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md px-2.5 py-1 text-[11px] font-medium text-[#4A4A4A] flex items-center gap-1 border border-[#D1CEC9] pointer-events-none shadow-xs">
                  <ZoomIn className="w-3 h-3 text-[#D4AF37]" />
                  <span>{isZoomed ? "Reset zoom" : "Click to zoom"}</span>
                </div>
              </div>

              {/* Geometric Balance Indicator */}
              <div className="w-full mt-3 grid grid-cols-4 gap-2">
                <div className="h-1 bg-[#D4AF37] rounded-full" />
                <div className="h-1 bg-[#E5E2DE] rounded-full" />
                <div className="h-1 bg-[#E5E2DE] rounded-full" />
                <div className="h-1 bg-[#E5E2DE] rounded-full" />
              </div>

              {/* Multi-image thumbnail strip if available */}
              {allImages.length > 1 && (
                <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
                  {allImages.map((img, idx) => (
                    <button
                      key={idx}
                      id={`thumb-img-${idx}`}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-14 h-14 overflow-hidden border-2 shrink-0 transition-all ${
                        activeImageIndex === idx
                          ? "border-[#D4AF37] ring-2 ring-[#D4AF37]/30"
                          : "border-[#D1CEC9] opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={img}
                        alt="thumbnail"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Tombstone Title & Artist */}
              <div className="mt-6">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A] tracking-tight leading-snug">
                  {artwork.title}
                </h2>
                <p className="text-base text-[#D4AF37] font-semibold mt-1 tracking-wide">
                  {artwork.artistDisplayName || "Unknown Artist"}
                </p>
                {artwork.artistDisplayBio && (
                  <p className="text-xs text-[#706E6B] mt-0.5">
                    {artwork.artistDisplayBio}
                  </p>
                )}
              </div>
            </div>

            {/* Met Museum Tombstone Specs Table */}
            <div className="mt-6 pt-5 border-t border-[#E5E2DE] text-xs space-y-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 text-[#2C2C2C]">
                {artwork.objectDate && (
                  <div>
                    <span className="text-[#8C8881] block text-[10px] uppercase tracking-widest font-bold">
                      Date
                    </span>
                    <span className="font-semibold">{artwork.objectDate}</span>
                  </div>
                )}
                {artwork.medium && (
                  <div>
                    <span className="text-[#8C8881] block text-[10px] uppercase tracking-widest font-bold">
                      Medium
                    </span>
                    <span className="font-semibold">{artwork.medium}</span>
                  </div>
                )}
                {artwork.dimensions && (
                  <div>
                    <span className="text-[#8C8881] block text-[10px] uppercase tracking-widest font-bold">
                      Dimensions
                    </span>
                    <span className="font-semibold">{artwork.dimensions}</span>
                  </div>
                )}
                {artwork.culture && (
                  <div>
                    <span className="text-[#8C8881] block text-[10px] uppercase tracking-widest font-bold">
                      Culture
                    </span>
                    <span className="font-semibold">{artwork.culture}</span>
                  </div>
                )}
                {artwork.classification && (
                  <div>
                    <span className="text-[#8C8881] block text-[10px] uppercase tracking-widest font-bold">
                      Classification
                    </span>
                    <span className="font-semibold">{artwork.classification}</span>
                  </div>
                )}
                {artwork.galleryNumber && (
                  <div>
                    <span className="text-[#8C8881] block text-[10px] uppercase tracking-widest font-bold">
                      On View at The Met
                    </span>
                    <span className="font-bold text-[#D4AF37]">
                      Gallery {artwork.galleryNumber}
                    </span>
                  </div>
                )}
              </div>

              {artwork.creditLine && (
                <div className="pt-2 text-[11px] text-[#706E6B] border-t border-[#E5E2DE]">
                  <span className="text-[#8C8881] font-bold uppercase tracking-wider text-[10px]">Credit: </span>
                  {artwork.creditLine}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: The Gemini Art Historian & Interactive Guide */}
          <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between bg-white overflow-y-auto shadow-inner">
            <div>
              {/* Gemini Curatorial Header & Focus Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E5E2DE]">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#6366f1] to-[#a855f7] flex items-center justify-center text-white shadow-xs">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-[#6366f1]">
                      Gemini Insights
                    </h3>
                    <p className="text-[11px] text-[#706E6B]">
                      Authentic curatorial analysis & historical revelations
                    </p>
                  </div>
                </div>

                {/* Audio Guide Narration Button */}
                <button
                  id="audio-guide-toggle-btn"
                  onClick={toggleSpeech}
                  disabled={factsLoading || !facts}
                  className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-xs ${
                    isSpeaking
                      ? "bg-[#D4AF37] text-white animate-pulse"
                      : "bg-[#F5F3EF] hover:bg-[#EAE8E4] text-[#2C2C2C] border border-[#D1CEC9]"
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span>Stop Audio Guide</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Listen to Audio Guide</span>
                    </>
                  )}
                </button>
              </div>

              {/* Focus Perspectives (Pills) */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] uppercase tracking-widest text-[#8C8881] font-bold">
                    Curatorial Perspective:
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#D4AF37] font-bold">
                    {focusMode === "balanced" && "General Synthesis"}
                    {focusMode === "secrets" && "Hidden Curiosities"}
                    {focusMode === "technique" && "Pigments & Craft"}
                    {focusMode === "symbolism" && "Decoded Meaning"}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    id="focus-balanced-btn"
                    onClick={() => setFocusMode("balanced")}
                    className={`text-xs py-2 px-2 font-bold uppercase tracking-wider transition-all rounded-xs flex items-center justify-center gap-1.5 ${
                      focusMode === "balanced"
                        ? "bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-xs"
                        : "bg-[#F5F3EF] text-[#5A5854] hover:text-[#1A1A1A] hover:bg-[#EAE8E4] border border-[#D1CEC9]"
                    }`}
                  >
                    <span>✨</span>
                    <span>Curated</span>
                  </button>
                  <button
                    id="focus-secrets-btn"
                    onClick={() => setFocusMode("secrets")}
                    className={`text-xs py-2 px-2 font-bold uppercase tracking-wider transition-all rounded-xs flex items-center justify-center gap-1.5 ${
                      focusMode === "secrets"
                        ? "bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-xs"
                        : "bg-[#F5F3EF] text-[#5A5854] hover:text-[#1A1A1A] hover:bg-[#EAE8E4] border border-[#D1CEC9]"
                    }`}
                  >
                    <span>🔍</span>
                    <span>Mysteries</span>
                  </button>
                  <button
                    id="focus-technique-btn"
                    onClick={() => setFocusMode("technique")}
                    className={`text-xs py-2 px-2 font-bold uppercase tracking-wider transition-all rounded-xs flex items-center justify-center gap-1.5 ${
                      focusMode === "technique"
                        ? "bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-xs"
                        : "bg-[#F5F3EF] text-[#5A5854] hover:text-[#1A1A1A] hover:bg-[#EAE8E4] border border-[#D1CEC9]"
                    }`}
                  >
                    <span>🧪</span>
                    <span>Pigments</span>
                  </button>
                  <button
                    id="focus-symbolism-btn"
                    onClick={() => setFocusMode("symbolism")}
                    className={`text-xs py-2 px-2 font-bold uppercase tracking-wider transition-all rounded-xs flex items-center justify-center gap-1.5 ${
                      focusMode === "symbolism"
                        ? "bg-[#1A1A1A] text-white border border-[#1A1A1A] shadow-xs"
                        : "bg-[#F5F3EF] text-[#5A5854] hover:text-[#1A1A1A] hover:bg-[#EAE8E4] border border-[#D1CEC9]"
                    }`}
                  >
                    <span>📜</span>
                    <span>Symbolism</span>
                  </button>
                </div>

                {/* Perspective Explanatory Subtitle */}
                <div className="mt-2 text-[11px] text-[#706E6B] italic flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-[#D4AF37] shrink-0" />
                  {focusMode === "balanced" && (
                    <span>Curated Overview: Comprehensive artistic, historical, and collection heritage synthesis.</span>
                  )}
                  {focusMode === "secrets" && (
                    <span>Mysteries & Secrets: Underdrawings, pentimenti, archival intrigue, and hidden curiosities.</span>
                  )}
                  {focusMode === "technique" && (
                    <span>Pigments & Craft: Chemical pigments, binders, physical brushwork, and conservation science.</span>
                  )}
                  {focusMode === "symbolism" && (
                    <span>Symbolism & Iconography: Deciphering cultural emblems, spiritual allegories, and visual metaphors.</span>
                  )}
                </div>
              </div>

              {/* Facts Content Area */}
              <div className="mt-5 space-y-4">
                {factsLoading ? (
                  <div className="p-8 bg-[#F9F8F6] border border-[#E5E2DE] text-center space-y-3">
                    <RefreshCw className="w-6 h-6 text-[#D4AF37] animate-spin mx-auto" />
                    <p className="text-sm font-serif italic text-[#4A4A4A]">
                      {focusMode === "secrets" && "Gemini is examining archival records for hidden mysteries and pentimenti..."}
                      {focusMode === "technique" && "Gemini is analyzing pigment chemistry, brushwork, and material craft..."}
                      {focusMode === "symbolism" && "Gemini is decoding allegories, spiritual iconography, and metaphors..."}
                      {focusMode === "balanced" && "Gemini is curating authoritative historical insights..."}
                    </p>
                    <p className="text-xs text-[#8C8881] font-mono uppercase tracking-wider">
                      Generating {focusMode} perspective dossier
                    </p>
                  </div>
                ) : factsError ? (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs">
                    {factsError}
                  </div>
                ) : facts ? (
                  <>
                    {/* Headline Banner */}
                    <div className="p-4 bg-[#F9F8F6] border-l-4 border-[#D4AF37] border-y border-r border-[#E5E2DE]">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-widest font-bold px-2 py-0.5 bg-[#1A1A1A] text-[#D4AF37] rounded-xs">
                          {focusMode === "balanced" && "✨ Curated Overview"}
                          {focusMode === "secrets" && "🔍 Mysteries & Lore"}
                          {focusMode === "technique" && "🧪 Pigments & Craft"}
                          {focusMode === "symbolism" && "📜 Symbolism & Allegory"}
                        </span>
                      </div>
                      <h4 className="font-serif text-sm font-bold text-[#1A1A1A] tracking-tight">
                        {facts.headline}
                      </h4>
                      <p className="text-xs text-[#4A4A4A] mt-1.5 leading-relaxed">
                        {facts.summary}
                      </p>
                    </div>

                    {/* Did You Know Trivia Pill */}
                    {facts.didYouKnow && (
                      <div className="p-3.5 bg-[#F5F3EF] border border-[#E5E2DE] flex items-start gap-2.5">
                        <Info className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                        <div className="text-xs text-[#4A4A4A] leading-relaxed">
                          <strong className="text-[#1A1A1A] font-bold">
                            {focusMode === "secrets" && "Secret Discovery: "}
                            {focusMode === "technique" && "Material Fact: "}
                            {focusMode === "symbolism" && "Symbolic Key: "}
                            {focusMode === "balanced" && "Did you know? "}
                          </strong>
                          {facts.didYouKnow}
                        </div>
                      </div>
                    )}

                    {/* Curated Interesting Facts Cards */}
                    <div className="space-y-3">
                      <h5 className="text-xs font-bold uppercase tracking-widest text-[#706E6B] flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>
                          {focusMode === "balanced" && "Curatorial Highlights"}
                          {focusMode === "secrets" && "Curatorial Mysteries & Secrets"}
                          {focusMode === "technique" && "Pigments, Chemistry & Physical Craft"}
                          {focusMode === "symbolism" && "Decoded Symbols & Allegories"}
                        </span>
                      </h5>

                      {facts.facts.map((fact, index) => (
                        <div
                          key={index}
                          className="p-4 bg-[#F9F8F6] border border-[#E5E2DE] hover:border-[#D4AF37] transition-all"
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <h6 className="text-xs font-serif font-bold text-[#1A1A1A]">
                              {fact.title}
                            </h6>
                            <span className={`text-[10px] px-2.5 py-0.5 rounded-full border uppercase font-bold tracking-wider ${
                              fact.category === "secret" ? "bg-amber-50 text-amber-900 border-amber-300" :
                              fact.category === "technique" ? "bg-emerald-50 text-emerald-900 border-emerald-300" :
                              fact.category === "symbolism" ? "bg-purple-50 text-purple-900 border-purple-300" :
                              fact.category === "provenance" ? "bg-blue-50 text-blue-900 border-blue-300" :
                              "bg-stone-50 text-stone-800 border-stone-300"
                            }`}>
                              {fact.category}
                            </span>
                          </div>
                          <p className="text-xs text-[#4A4A4A] leading-relaxed">
                            {fact.text}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* What to Look For (Visual Highlights) */}
                    {facts.visualHighlights && facts.visualHighlights.length > 0 && (
                      <div className="p-4 bg-[#F9F8F6] border border-[#E5E2DE] space-y-2">
                        <h5 className="text-xs font-bold uppercase tracking-widest text-[#706E6B] flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
                          <span>
                            {focusMode === "secrets" && "Hidden Clues & Details to Spot"}
                            {focusMode === "technique" && "Brushwork, Pigments & Textures to Inspect"}
                            {focusMode === "symbolism" && "Symbolic Motifs & Metaphors to Spot"}
                            {focusMode === "balanced" && "Visual Focal Points to Inspect"}
                          </span>
                        </h5>
                        <ul className="space-y-1.5 text-xs text-[#4A4A4A] list-disc list-inside">
                          {facts.visualHighlights.map((highlight, idx) => (
                            <li key={idx} className="leading-relaxed">
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Curator Reflection */}
                    {facts.curatorInsight && (
                      <div className="p-4 bg-[#F5F3EF] border-l-4 border-[#D1CEC9] border-y border-r border-[#E5E2DE] text-xs italic text-[#4A4A4A]">
                        <p className="font-serif">"{facts.curatorInsight}"</p>
                        <span className="text-[10px] text-[#8C8881] not-italic block mt-1 uppercase font-bold tracking-wider">
                          {focusMode === "secrets" && "— Curatorial Investigation Note, The Met"}
                          {focusMode === "technique" && "— Conservation Laboratory Analysis, The Met"}
                          {focusMode === "symbolism" && "— Iconographic Decryption, The Met"}
                          {focusMode === "balanced" && "— Curatorial Note, The Met"}
                        </span>
                      </div>
                    )}
                  </>
                ) : null}
              </div>

              {/* Ask Gemini Section */}
              <div className="mt-6 pt-5 border-t border-[#E5E2DE]">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                    Ask Gemini About This Piece
                  </span>
                </div>

                {/* Question Input */}
                <form onSubmit={(e) => handleAskQuestion(e)} className="flex items-center gap-2">
                  <input
                    id="ask-gemini-input"
                    type="text"
                    value={userQuestion}
                    onChange={(e) => setUserQuestion(e.target.value)}
                    placeholder="e.g. What pigments were used? Who commissioned it?"
                    className="flex-1 bg-[#F9F8F6] border border-[#D1CEC9] hover:border-[#A8A49E] focus:border-[#D4AF37] px-3.5 py-2 text-xs text-[#1A1A1A] placeholder-[#8C8881] outline-none transition-all"
                  />
                  <button
                    id="ask-gemini-submit-btn"
                    type="submit"
                    disabled={isAsking || !userQuestion.trim()}
                    className="bg-[#1A1A1A] hover:bg-[#D4AF37] disabled:opacity-40 text-white font-bold uppercase tracking-wider px-3.5 py-2 text-xs flex items-center gap-1.5 transition-all shadow-xs"
                  >
                    {isAsking ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Send className="w-3.5 h-3.5" />
                    )}
                    <span>Ask</span>
                  </button>
                </form>

                {/* Quick Prompts Suggestions */}
                <div className="flex items-center gap-1.5 mt-2.5 flex-wrap text-[11px]">
                  <span className="text-[#8C8881]">Try asking:</span>
                  <button
                    onClick={() => handleAskQuestion(undefined, "What is the historical significance of this artwork?")}
                    className="text-[#706E6B] hover:text-[#D4AF37] underline underline-offset-2"
                  >
                    Historical significance?
                  </button>
                  <span className="text-[#D1CEC9]">•</span>
                  <button
                    onClick={() => handleAskQuestion(undefined, "What techniques or pigments did the artist use here?")}
                    className="text-[#706E6B] hover:text-[#D4AF37] underline underline-offset-2"
                  >
                    Techniques & pigments?
                  </button>
                  <span className="text-[#D1CEC9]">•</span>
                  <button
                    onClick={() => handleAskQuestion(undefined, "How did The Met acquire this artwork?")}
                    className="text-[#706E6B] hover:text-[#D4AF37] underline underline-offset-2"
                  >
                    Acquisition story?
                  </button>
                </div>

                {/* Q&A Response Feed */}
                {qaHistory.length > 0 && (
                  <div className="mt-4 space-y-3">
                    {qaHistory.map((qa, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-[#F9F8F6] border border-[#E5E2DE] text-xs space-y-2 animate-in fade-in duration-200"
                      >
                        <div className="flex items-start gap-2 text-[#1A1A1A] font-semibold">
                          <HelpCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-[#D4AF37]" />
                          <span>"{qa.question}"</span>
                        </div>
                        <p className="text-[#4A4A4A] leading-relaxed pl-5">
                          {qa.answer}
                        </p>

                        {qa.suggestedFollowUps && qa.suggestedFollowUps.length > 0 && (
                          <div className="pt-2.5 border-t border-[#E5E2DE] pl-5">
                            <span className="text-[10px] uppercase font-bold tracking-wider text-[#8C8881] block mb-1">
                              Explore next:
                            </span>
                            <div className="flex flex-col gap-1">
                              {qa.suggestedFollowUps.map((fu, fidx) => (
                                <button
                                  key={fidx}
                                  onClick={() => handleAskQuestion(undefined, fu)}
                                  className="text-left text-[11px] text-[#D4AF37] hover:text-[#1A1A1A] flex items-center gap-1 font-medium group"
                                >
                                  <ChevronRight className="w-3 h-3 text-[#8C8881] group-hover:translate-x-0.5 transition-transform" />
                                  <span>{fu}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer metadata */}
            <div className="mt-6 pt-3 text-center text-[10px] text-[#8C8881] border-t border-[#E5E2DE]">
              Art imagery & catalog data courtesy of The Metropolitan Museum of Art Open Access • Curated by MetEyes & Google Gemini
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
