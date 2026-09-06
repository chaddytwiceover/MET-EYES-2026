import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import dotenv from "dotenv";
import {
  PRESEEDED_CURATORIAL_DOSSIERS,
  buildCuratorialDossier,
  buildCuratorialAnswer,
} from "./curatorialData";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google GenAI
const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Gemini features will return fallback insights.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Candidate models in priority order
// gemini-3.1-flash-lite has a separate free tier quota and minimal latency
const CANDIDATE_MODELS = [
  "gemini-3.1-flash-lite",
  "gemini-3.8-flash",
  "gemini-flash-latest",
];

// Circuit-breaker: track per-model rate limit cooldowns to prevent repetitive 429 failures
const modelCooldowns = new Map<string, number>();

function getAvailableCandidateModels(): string[] {
  const now = Date.now();
  return CANDIDATE_MODELS.filter((model) => {
    const cooldownUntil = modelCooldowns.get(model);
    return !cooldownUntil || now > cooldownUntil;
  });
}

function handleModelQuotaOrError(model: string, error: any) {
  const errorMsg = typeof error === "string" ? error : error?.message || JSON.stringify(error);
  if (errorMsg.includes("429") || errorMsg.includes("RESOURCE_EXHAUSTED") || errorMsg.includes("quota")) {
    let delayMs = 60000;
    const retryMatch = errorMsg.match(/retry(?:Delay)?["':\s]+([0-9.]+)/i);
    if (retryMatch && retryMatch[1]) {
      const parsed = parseFloat(retryMatch[1]);
      if (!isNaN(parsed) && parsed > 0) {
        delayMs = Math.ceil(parsed * 1000) + 1000;
      }
    }
    modelCooldowns.set(model, Date.now() + delayMs);
    console.info(`[Curator AI] Model ${model} is currently at quota limit. Cooling down for ${Math.round(delayMs / 1000)}s.`);
  } else {
    console.warn(`[Curator AI] Model ${model} returned non-fatal note:`, errorMsg.slice(0, 120));
  }
}

// In-memory cache for artworks and facts
const artworkCache = new Map<number, any>();
const factsCache = new Map<string, any>();
let cachedDepartmentList: any[] | null = null;
let cachedHighlightIDs: number[] | null = null;

// Seed factsCache with authoritative dossiers for iconic Met masterpieces
for (const [artIdStr, dossiers] of Object.entries(PRESEEDED_CURATORIAL_DOSSIERS)) {
  const artId = Number(artIdStr);
  for (const [mode, dossier] of Object.entries(dossiers)) {
    factsCache.set(`${artId}-${mode}`, dossier);
  }
}

// Verified iconic Met highlights with high-res public domain images
const CURATED_ICONIC_ARTWORKS = [
  {
    objectID: 436535,
    title: "Wheat Field with Cypresses",
    artistDisplayName: "Vincent van Gogh",
    artistDisplayBio: "Dutch, Zundert 1853–1890 Auvers-sur-Oise",
    objectDate: "1889",
    medium: "Oil on canvas",
    dimensions: "28 7/8 × 36 3/4 in. (73.2 × 93.4 cm)",
    department: "European Paintings",
    culture: "Dutch",
    period: "Post-Impressionism",
    primaryImage: "https://images.metmuseum.org/CRDImages/ep/original/DP-42549-001.jpg",
    primaryImageSmall: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-42549-001.jpg",
    additionalImages: [
      "https://images.metmuseum.org/CRDImages/ep/original/DP-42549-002.jpg",
      "https://images.metmuseum.org/CRDImages/ep/original/DT1947.jpg"
    ],
    objectURL: "https://www.metmuseum.org/art/collection/search/436535",
    classification: "Paintings",
    creditLine: "Purchase, The Annenberg Foundation Gift, 1993",
    galleryNumber: "822",
  },
  {
    objectID: 438008,
    title: "The Japanese Footbridge",
    artistDisplayName: "Claude Monet",
    artistDisplayBio: "French, Paris 1840–1926 Giverny",
    objectDate: "1899",
    medium: "Oil on canvas",
    dimensions: "32 × 40 in. (81.3 × 101.6 cm)",
    department: "European Paintings",
    culture: "French",
    period: "Impressionism",
    primaryImage: "https://images.metmuseum.org/CRDImages/ep/original/DP-18753-001.jpg",
    primaryImageSmall: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-18753-001.jpg",
    additionalImages: [],
    objectURL: "https://www.metmuseum.org/art/collection/search/438008",
    classification: "Paintings",
    creditLine: "Theodore M. Davis Collection, Bequest of Theodore M. Davis, 1915",
    galleryNumber: "819",
  },
  {
    objectID: 45434,
    title: "Under the Wave off Kanagawa (The Great Wave)",
    artistDisplayName: "Katsushika Hokusai",
    artistDisplayBio: "Japanese, Tokyo (Edo) 1760–1849 Tokyo (Edo)",
    objectDate: "ca. 1830–32",
    medium: "Woodblock print; ink and color on paper",
    dimensions: "10 1/8 x 14 15/16 in. (25.7 x 37.9 cm)",
    department: "Asian Art",
    culture: "Japan",
    period: "Edo period (1615–1868)",
    primaryImage: "https://images.metmuseum.org/CRDImages/as/original/DP130155.jpg",
    primaryImageSmall: "https://images.metmuseum.org/CRDImages/as/web-large/DP130155.jpg",
    additionalImages: [],
    objectURL: "https://www.metmuseum.org/art/collection/search/45434",
    classification: "Prints",
    creditLine: "H. O. Havemeyer Collection, Bequest of Mrs. H. O. Havemeyer, 1929",
    galleryNumber: "223",
  },
  {
    objectID: 437881,
    title: "Young Woman with a Water Pitcher",
    artistDisplayName: "Johannes Vermeer",
    artistDisplayBio: "Dutch, Delft 1632–1675 Delft",
    objectDate: "ca. 1662",
    medium: "Oil on canvas",
    dimensions: "18 × 16 in. (45.7 × 40.6 cm)",
    department: "European Paintings",
    culture: "Dutch",
    period: "Dutch Golden Age",
    primaryImage: "https://images.metmuseum.org/CRDImages/ep/original/DP145922.jpg",
    primaryImageSmall: "https://images.metmuseum.org/CRDImages/ep/web-large/DP145922.jpg",
    additionalImages: [],
    objectURL: "https://www.metmuseum.org/art/collection/search/437881",
    classification: "Paintings",
    creditLine: "Marquand Collection, Gift of Henry G. Marquand, 1889",
    galleryNumber: "630",
  },
  {
    objectID: 437984,
    title: "Self-Portrait with a Straw Hat",
    artistDisplayName: "Vincent van Gogh",
    artistDisplayBio: "Dutch, Zundert 1853–1890 Auvers-sur-Oise",
    objectDate: "1887",
    medium: "Oil on canvas",
    dimensions: "16 × 12 1/2 in. (40.6 × 31.8 cm)",
    department: "European Paintings",
    culture: "Dutch",
    period: "Post-Impressionism",
    primaryImage: "https://images.metmuseum.org/CRDImages/ep/original/DP130999.jpg",
    primaryImageSmall: "https://images.metmuseum.org/CRDImages/ep/web-large/DP130999.jpg",
    additionalImages: [
      "https://images.metmuseum.org/CRDImages/ep/original/DP131000.jpg"
    ],
    objectURL: "https://www.metmuseum.org/art/collection/search/437984",
    classification: "Paintings",
    creditLine: "Bequest of Miss Adelaide Milton de Groot (1876–1967), 1967",
    galleryNumber: "822",
  },
  {
    objectID: 547802,
    title: "Statue of the Goddess Sekhmet",
    artistDisplayName: "Ancient Egyptian Sculptor",
    artistDisplayBio: "Reign of Amenhotep III, Dynasty 18",
    objectDate: "ca. 1390–1352 B.C.",
    medium: "Granodiorite",
    dimensions: "H. 80 1/4 in. (204 cm); W. 19 1/2 in. (49.5 cm)",
    department: "Egyptian Art",
    culture: "Egyptian",
    period: "New Kingdom",
    primaryImage: "https://images.metmuseum.org/CRDImages/eg/original/DP122421.jpg",
    primaryImageSmall: "https://images.metmuseum.org/CRDImages/eg/web-large/DP122421.jpg",
    additionalImages: [
      "https://images.metmuseum.org/CRDImages/eg/original/DP122422.jpg"
    ],
    objectURL: "https://www.metmuseum.org/art/collection/search/547802",
    classification: "Sculpture",
    creditLine: "Gift of Henry Walters, 1915",
    galleryNumber: "119",
  },
  {
    objectID: 436105,
    title: "The Death of Socrates",
    artistDisplayName: "Jacques Louis David",
    artistDisplayBio: "French, Paris 1748–1825 Brussels",
    objectDate: "1787",
    medium: "Oil on canvas",
    dimensions: "51 × 77 1/4 in. (129.5 × 196.2 cm)",
    department: "European Paintings",
    culture: "French",
    period: "Neoclassicism",
    primaryImage: "https://images.metmuseum.org/CRDImages/ep/original/DP-13139-001.jpg",
    primaryImageSmall: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-13139-001.jpg",
    additionalImages: [],
    objectURL: "https://www.metmuseum.org/art/collection/search/436105",
    classification: "Paintings",
    creditLine: "Catharine Lorillard Wolfe Collection, Wolfe Fund, 1931",
    galleryNumber: "614",
  },
  {
    objectID: 24699,
    title: "Armor for Field and Tournament",
    artistDisplayName: "Anton Peffenhauser",
    artistDisplayBio: "German, Augsburg 1525–1603 Augsburg",
    objectDate: "ca. 1580–90",
    medium: "Steel, etched and gilded; brass, leather",
    dimensions: "H. 68 1/2 in. (174 cm); Wt. 56 lb. 4 oz. (25.5 kg)",
    department: "Arms and Armor",
    culture: "German, Augsburg",
    period: "Late Renaissance",
    primaryImage: "https://images.metmuseum.org/CRDImages/aa/original/DP-14981-001.jpg",
    primaryImageSmall: "https://images.metmuseum.org/CRDImages/aa/web-large/DP-14981-001.jpg",
    additionalImages: [],
    objectURL: "https://www.metmuseum.org/art/collection/search/24699",
    classification: "Armor for Man",
    creditLine: "Gift of William H. Riggs, 1913",
    galleryNumber: "371",
  },
  {
    objectID: 437133,
    title: "Water Lilies",
    artistDisplayName: "Claude Monet",
    artistDisplayBio: "French, Paris 1840–1926 Giverny",
    objectDate: "1919",
    medium: "Oil on canvas",
    dimensions: "39 3/4 × 79 in. (101 × 200.7 cm)",
    department: "European Paintings",
    culture: "French",
    period: "Impressionism",
    primaryImage: "https://images.metmuseum.org/CRDImages/ep/original/DP-25465-001.jpg",
    primaryImageSmall: "https://images.metmuseum.org/CRDImages/ep/web-large/DP-25465-001.jpg",
    additionalImages: [],
    objectURL: "https://www.metmuseum.org/art/collection/search/437133",
    classification: "Paintings",
    creditLine: "The Walter H. and Leonore Annenberg Collection, 1997",
    galleryNumber: "819",
  },
  {
    objectID: 255570,
    title: "Marble statue of a wounded Amazon",
    artistDisplayName: "Roman copy of a Greek bronze original",
    artistDisplayBio: "Original attributed to Polykleitos (ca. 440–430 B.C.)",
    objectDate: "1st–2nd century A.D.",
    medium: "Marble",
    dimensions: "H. 80 1/4 in. (203.8 cm)",
    department: "Greek and Roman Art",
    culture: "Roman",
    period: "Imperial",
    primaryImage: "https://images.metmuseum.org/CRDImages/gr/original/DP140994.jpg",
    primaryImageSmall: "https://images.metmuseum.org/CRDImages/gr/web-large/DP140994.jpg",
    additionalImages: [],
    objectURL: "https://www.metmuseum.org/art/collection/search/255570",
    classification: "Sculpture",
    creditLine: "Gift of John D. Rockefeller Jr., 1932",
    galleryNumber: "153",
  },
  {
    objectID: 436524,
    title: "Madame Cézanne in a Red Dress",
    artistDisplayName: "Paul Cézanne",
    artistDisplayBio: "French, Aix-en-Provence 1839–1906 Aix-en-Provence",
    objectDate: "ca. 1888–90",
    medium: "Oil on canvas",
    dimensions: "45 7/8 × 35 1/4 in. (116.5 × 89.5 cm)",
    department: "European Paintings",
    culture: "French",
    period: "Post-Impressionism",
    primaryImage: "https://images.metmuseum.org/CRDImages/ep/original/DP134888.jpg",
    primaryImageSmall: "https://images.metmuseum.org/CRDImages/ep/web-large/DP134888.jpg",
    additionalImages: [],
    objectURL: "https://www.metmuseum.org/art/collection/search/436524",
    classification: "Paintings",
    creditLine: "The Mr. and Mrs. Henry Ittleson Jr. Purchase Fund, 1962",
    galleryNumber: "825",
  },
  {
    objectID: 544436,
    title: "Statue of the God Anubis",
    artistDisplayName: "Ancient Egyptian Artisan",
    artistDisplayBio: "Ptolemaic Period",
    objectDate: "332–30 B.C.",
    medium: "Wood, gesso, paint",
    dimensions: "H. 16 1/2 in. (41.9 cm); L. 36 in. (91.4 cm)",
    department: "Egyptian Art",
    culture: "Egyptian",
    period: "Ptolemaic Period",
    primaryImage: "https://images.metmuseum.org/CRDImages/eg/original/DP241285.jpg",
    primaryImageSmall: "https://images.metmuseum.org/CRDImages/eg/web-large/DP241285.jpg",
    additionalImages: [],
    objectURL: "https://www.metmuseum.org/art/collection/search/544436",
    classification: "Woodwork",
    creditLine: "Rogers Fund, 1912",
    galleryNumber: "133",
  }
];

// Seed cache with iconic works
for (const art of CURATED_ICONIC_ARTWORKS) {
  artworkCache.set(art.objectID, art);
}

// Fetch single object from Met API with caching
async function fetchMetObject(objectID: number): Promise<any | null> {
  if (artworkCache.has(objectID)) {
    return artworkCache.get(objectID);
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) return null;
    const data = await res.json();

    // Must have at least a small or primary image to be enjoyable to scroll
    if (!data.primaryImageSmall && !data.primaryImage) {
      return null;
    }

    const formatted = {
      objectID: data.objectID,
      title: data.title || "Untitled",
      artistDisplayName: data.artistDisplayName || "Unknown Artist",
      artistDisplayBio: data.artistDisplayBio || "",
      objectDate: data.objectDate || "Date unknown",
      medium: data.medium || "Unknown medium",
      dimensions: data.dimensions || "",
      department: data.department || "",
      culture: data.culture || "",
      period: data.period || "",
      primaryImage: data.primaryImage || data.primaryImageSmall,
      primaryImageSmall: data.primaryImageSmall || data.primaryImage,
      additionalImages: data.additionalImages || [],
      objectURL: data.objectURL || `https://www.metmuseum.org/art/collection/search/${data.objectID}`,
      classification: data.classification || "",
      creditLine: data.creditLine || "",
      galleryNumber: data.GalleryNumber || "",
      objectWikidata_URL: data.objectWikidata_URL || "",
    };

    artworkCache.set(objectID, formatted);
    return formatted;
  } catch (err) {
    console.error(`Error fetching object ${objectID}:`, err);
    return null;
  }
}

// API: Health
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", cachedObjects: artworkCache.size });
});

// API: Get departments
app.get("/api/met/departments", async (_req: Request, res: Response) => {
  if (cachedDepartmentList) {
    return res.json({ departments: cachedDepartmentList });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    const apiRes = await fetch("https://collectionapi.metmuseum.org/public/collection/v1/departments", {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (apiRes.ok) {
      const data = await apiRes.json();
      cachedDepartmentList = data.departments || [];
      return res.json({ departments: cachedDepartmentList });
    }
  } catch (err) {
    console.warn("Failed to fetch departments from Met API, using fallback list:", err);
  }

  // Fallback departments
  const fallbackDepartments = [
    { departmentId: 11, displayName: "European Paintings" },
    { departmentId: 6, displayName: "Asian Art" },
    { departmentId: 10, displayName: "Egyptian Art" },
    { departmentId: 13, displayName: "Greek and Roman Art" },
    { departmentId: 4, displayName: "Arms and Armor" },
    { departmentId: 1, displayName: "American Decorative Arts" },
    { departmentId: 19, displayName: "Photographs" },
    { departmentId: 14, displayName: "Islamic Art" },
    { departmentId: 12, displayName: "European Sculpture and Decorative Arts" },
  ];
  cachedDepartmentList = fallbackDepartments;
  res.json({ departments: fallbackDepartments });
});

// API: Artworks Feed (Highlight feed or search results)
app.get("/api/met/artworks", async (req: Request, res: Response) => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(24, Math.max(4, parseInt(req.query.limit as string) || 12));
  const departmentId = req.query.departmentId ? parseInt(req.query.departmentId as string) : undefined;
  const q = typeof req.query.q === "string" ? req.query.q.trim() : "";

  try {
    let candidateIDs: number[] = [];

    if (q || departmentId) {
      // Search with images
      let searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true`;
      if (departmentId) {
        searchUrl += `&departmentId=${departmentId}`;
      }
      if (q) {
        searchUrl += `&q=${encodeURIComponent(q)}`;
      } else {
        searchUrl += `&isHighlight=true&q=*`;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6000);
      const searchRes = await fetch(searchUrl, { signal: controller.signal });
      clearTimeout(timeout);

      if (searchRes.ok) {
        const data = await searchRes.json();
        candidateIDs = data.objectIDs || [];
      }
    } else {
      // General highlights
      if (!cachedHighlightIDs) {
        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 6000);
          const searchRes = await fetch(
            "https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&isHighlight=true&q=art",
            { signal: controller.signal }
          );
          clearTimeout(timeout);
          if (searchRes.ok) {
            const data = await searchRes.json();
            cachedHighlightIDs = data.objectIDs || [];
          }
        } catch (e) {
          console.warn("Could not fetch remote highlights list:", e);
        }
      }

      const curatedIDs = CURATED_ICONIC_ARTWORKS.map((a) => a.objectID);
      const remoteIDs = cachedHighlightIDs || [];
      // Interleave curated with remote highlights
      const merged = Array.from(new Set([...curatedIDs, ...remoteIDs]));
      candidateIDs = merged;
    }

    if (candidateIDs.length === 0) {
      // If no IDs found and it was a search, return empty
      if (q || departmentId) {
        return res.json({
          artworks: [],
          total: 0,
          page,
          hasMore: false,
        });
      }
      // Otherwise return curated list
      return res.json({
        artworks: CURATED_ICONIC_ARTWORKS.slice(0, limit),
        total: CURATED_ICONIC_ARTWORKS.length,
        page: 1,
        hasMore: false,
      });
    }

    const startIndex = (page - 1) * limit;
    // We over-fetch slightly because some Met objects might fail image verification
    const sliceIDs = candidateIDs.slice(startIndex, startIndex + limit + 8);

    const fetchedArtworks = await Promise.all(sliceIDs.map((id) => fetchMetObject(id)));
    const validArtworks = fetchedArtworks.filter(
      (a): a is NonNullable<typeof a> => a !== null && Boolean(a.primaryImageSmall || a.primaryImage)
    );

    const paginatedArtworks = validArtworks.slice(0, limit);
    const hasMore = startIndex + limit < candidateIDs.length;

    res.json({
      artworks: paginatedArtworks,
      total: candidateIDs.length,
      page,
      hasMore,
    });
  } catch (err) {
    console.error("Error in /api/met/artworks:", err);
    // Fallback to curated iconic artworks
    const start = (page - 1) * limit;
    const items = CURATED_ICONIC_ARTWORKS.slice(start, start + limit);
    res.json({
      artworks: items,
      total: CURATED_ICONIC_ARTWORKS.length,
      page,
      hasMore: start + limit < CURATED_ICONIC_ARTWORKS.length,
    });
  }
});

// API: Single artwork
app.get("/api/met/object/:id", async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "Invalid object ID" });
  }

  const artwork = await fetchMetObject(id);
  if (!artwork) {
    return res.status(404).json({ error: "Artwork not found or has no images" });
  }

  res.json({ artwork });
});

// API: Gemini Facts generator
app.post("/api/gemini/facts", async (req: Request, res: Response) => {
  const {
    objectId,
    title,
    artist,
    date,
    medium,
    culture,
    period,
    department,
    classification,
    focusMode = "balanced", // 'balanced' | 'secrets' | 'technique' | 'symbolism'
  } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Artwork title is required" });
  }

  const cacheKey = `${objectId || title}-${focusMode}`;
  if (factsCache.has(cacheKey)) {
    return res.json({ facts: factsCache.get(cacheKey), fromCache: true });
  }

  const ai = getAiClient();
  if (!ai) {
    const fallbackFacts = buildCuratorialDossier(req.body, focusMode);
    factsCache.set(cacheKey, fallbackFacts);
    return res.json({ facts: fallbackFacts, fromCache: false, fallback: true });
  }

  let focusInstruction = "";
  let categoryDesc = "One of: history, technique, secret, symbolism, provenance";

  if (focusMode === "secrets") {
    focusInstruction = `CRITICAL PERSPECTIVE REQUIREMENT: "MYSTERIES, PENTIMENTI & CURATORIAL SECRETS"
The user selected the "Mysteries" perspective. You MUST dedicate the ENTIRE analysis to mysteries, secrets, and hidden dimensions:
1. Underdrawings, pentimenti (artist changes), infrared reflectography, or x-ray discoveries.
2. Provenance intrigue, lost ownership, thefts, controversies, or archival discoveries.
3. Behind-the-scenes artist lore, private correspondence, or scandalous contemporary reception.
DO NOT provide generic textbook history.
Every fact's category MUST be "secret" or "provenance".
Visual highlights must guide the viewer to spot hidden clues or overlooked details.
The headline, summary, and curator reflection must delve into curatorial mysteries.`;
    categoryDesc = "Must be 'secret' or 'provenance'";
  } else if (focusMode === "technique") {
    focusInstruction = `CRITICAL PERSPECTIVE REQUIREMENT: "PIGMENTS, CHEMISTRY & MATERIAL CRAFT"
The user selected the "Pigments" perspective. You MUST dedicate the ENTIRE analysis to physical materials, chemistry, and craftsmanship:
1. Exact physical pigments (e.g., lapis lazuli, vermilion, lead white, cobalt violet, Prussian blue, ochre), binder chemistry (walnut oil, egg tempera, gum arabic), or kiln atmospheres.
2. Physical mark-making: impasto thickness, brushwork dynamics (scumbling, glazing, wet-in-wet), chisel marks, or woodblock carving precision.
3. Surface preparation, grounds, supports, and conservation science at The Met.
DO NOT provide generic biographical summaries.
Every fact's category MUST be "technique".
Visual highlights must guide the viewer to analyze brushstrokes, pigment sheen, relief ridges, or material textures.
The headline, summary, and curator reflection must speak from a master conservator's perspective.`;
    categoryDesc = "Must be 'technique'";
  } else if (focusMode === "symbolism") {
    focusInstruction = `CRITICAL PERSPECTIVE REQUIREMENT: "SYMBOLISM, ALLEGORY & ICONOGRAPHY"
The user selected the "Symbolism" perspective. You MUST dedicate the ENTIRE analysis to decoding symbolic meaning:
1. Deciphering symbolic emblems, allegorical figures, philosophical metaphors, and sacred iconography.
2. Spiritual, theological, or mythological systems embedded in the composition.
3. What specific colors, postures, botanical elements, or objects communicated to the people of ${culture || "the era"}.
DO NOT provide generic technical descriptions.
Every fact's category MUST be "symbolism".
Visual highlights must tell the viewer where to find each symbolic motif.
The headline, summary, and curator reflection must speak from an iconographer's perspective.`;
    categoryDesc = "Must be 'symbolism'";
  } else {
    focusInstruction = `PERSPECTIVE: "CURATED MASTERPIECE OVERVIEW"
Provide an authoritative, poetic curatorial synthesis balancing aesthetic breakthroughs, cultural context, and permanent collection significance at The Met.`;
  }

  const prompt = `Analyze this artwork from The Metropolitan Museum of Art:
Title: "${title}"
Artist/Maker: "${artist || "Unknown"}"
Date: "${date || "Unknown"}"
Medium: "${medium || "Unknown"}"
Culture: "${culture || "Unknown"}"
Period: "${period || "Unknown"}"
Department: "${department || "Unknown"}"
Classification: "${classification || "Unknown"}"

${focusInstruction}

Generate authentic, historically grounded, and fascinating facts and insights strictly conforming to this perspective.`;

  const availableModels = getAvailableCandidateModels();
  let generatedResult: any = null;

  for (const model of availableModels) {
    try {
      const config: any = {
        systemInstruction: `You are a brilliant, world-class art historian and curator at The Metropolitan Museum of Art. You communicate with poetic elegance, precision, and infectious curiosity. You strictly adhere to the requested Curatorial Perspective, ensuring every headline, fact, visual highlight, and curator insight directly explores that specific perspective without drifting into generic trivia.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            artworkId: { type: Type.INTEGER, description: "The Met object ID or 0" },
            headline: { type: Type.STRING, description: "An intriguing, poetic 5-10 word headline matching the perspective" },
            summary: { type: Type.STRING, description: "A compelling 2-3 sentence overview focused entirely on the chosen perspective" },
            facts: {
              type: Type.ARRAY,
              description: "3 to 4 distinct, fascinating facts adhering to the perspective",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Catchy title for the fact" },
                  text: { type: Type.STRING, description: "2-3 sentences explaining the fact vividly" },
                  category: {
                    type: Type.STRING,
                    description: categoryDesc,
                  },
                },
                required: ["title", "text", "category"],
              },
            },
            visualHighlights: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 specific visual details relevant to the perspective for a viewer to zoom in on",
            },
            curatorInsight: { type: Type.STRING, description: "A deep, contemplative reflection from the curator or conservator on this perspective" },
            didYouKnow: { type: Type.STRING, description: "A surprising, memorable 1-sentence trivia fact about this perspective" },
          },
          required: ["headline", "summary", "facts", "visualHighlights", "curatorInsight", "didYouKnow"],
        },
      };

      if (model.includes("3.8") || model.includes("3.1")) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }

      const timeoutMs = 12000;
      const response: any = await Promise.race([
        ai.models.generateContent({
          model,
          contents: prompt,
          config,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Gemini request timed out")), timeoutMs)
        ),
      ]);

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim());
        if (parsed && parsed.headline && Array.isArray(parsed.facts)) {
          parsed.artworkId = objectId || 0;
          generatedResult = parsed;
          break;
        }
      }
    } catch (err: any) {
      handleModelQuotaOrError(model, err);
      // Continue loop to try next model in cascade
    }
  }

  if (generatedResult) {
    factsCache.set(cacheKey, generatedResult);
    return res.json({ facts: generatedResult, fromCache: false });
  }

  // Gracefully serve scholarly synthesized dossier when quotas are exhausted or models in cooldown
  const fallbackFacts = buildCuratorialDossier(req.body, focusMode);
  factsCache.set(cacheKey, fallbackFacts);
  return res.json({ facts: fallbackFacts, fromCache: false, fallback: true });
});

// API: Ask Gemini a custom question about the artwork
app.post("/api/gemini/ask", async (req: Request, res: Response) => {
  const { question, artwork } = req.body;

  if (!question || !artwork) {
    return res.status(400).json({ error: "Both question and artwork context are required" });
  }

  const ai = getAiClient();
  if (!ai) {
    return res.json(buildCuratorialAnswer(artwork, question));
  }

  const prompt = `Artwork Context:
Title: "${artwork.title}"
Artist: "${artwork.artistDisplayName}" (${artwork.artistDisplayBio || ""})
Date: "${artwork.objectDate}"
Medium: "${artwork.medium}"
Dimensions: "${artwork.dimensions}"
Culture: "${artwork.culture}"
Period: "${artwork.period}"
Department: "${artwork.department}"
Classification: "${artwork.classification}"

Visitor Question: "${question}"

Provide an insightful, accurate, and conversational answer as a Met Museum curator. Also propose 2-3 engaging follow-up questions the visitor might want to explore next.`;

  const availableModels = getAvailableCandidateModels();
  let generatedAnswer: any = null;

  for (const model of availableModels) {
    try {
      const config: any = {
        systemInstruction: "You are the resident art scholar at The Metropolitan Museum of Art. Your tone is warm, highly knowledgeable, articulate, and encouraging.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            answer: { type: Type.STRING, description: "Detailed yet approachable answer (2-4 paragraphs max)" },
            suggestedFollowUps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "2 or 3 short follow-up questions",
            },
          },
          required: ["question", "answer", "suggestedFollowUps"],
        },
      };

      if (model.includes("3.8") || model.includes("3.1")) {
        config.thinkingConfig = { thinkingLevel: ThinkingLevel.LOW };
      }

      const timeoutMs = 12000;
      const response: any = await Promise.race([
        ai.models.generateContent({
          model,
          contents: prompt,
          config,
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Gemini ask timed out")), timeoutMs)
        ),
      ]);

      if (response && response.text) {
        const parsed = JSON.parse(response.text.trim());
        if (parsed && parsed.answer) {
          generatedAnswer = parsed;
          break;
        }
      }
    } catch (err: any) {
      handleModelQuotaOrError(model, err);
      // Continue loop to try next model in cascade
    }
  }

  if (generatedAnswer) {
    return res.json(generatedAnswer);
  }

  // Gracefully serve curatorial assistant answer
  return res.json(buildCuratorialAnswer(artwork, question));
});

// Vite middleware & production static handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Met Gallery Explorer server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
