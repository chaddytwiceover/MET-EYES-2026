// Pre-seeded authoritative curatorial dossiers and fallback engine for The Met Collection

export interface CuratorialFact {
  title: string;
  text: string;
  category: "history" | "technique" | "secret" | "symbolism" | "provenance";
}

export interface CuratorialDossier {
  artworkId: number;
  headline: string;
  summary: string;
  facts: CuratorialFact[];
  visualHighlights: string[];
  curatorInsight: string;
  didYouKnow: string;
}

// Bespoke curatorial dossiers for The Met's premier masterpieces across all 4 Curatorial Perspectives
export const PRESEEDED_CURATORIAL_DOSSIERS: Record<number, Record<string, CuratorialDossier>> = {
  // Vincent van Gogh - Wheat Field with Cypresses (436535)
  436535: {
    balanced: {
      artworkId: 436535,
      headline: "A Torrent of Vitality in the Provencal Breeze",
      summary: "Painted in late June 1889 during Van Gogh's residence at the Saint-Paul asylum in Saint-Rémy, this iconic canvas captures the undulating landscape of Provence with explosive color and rhythmic impasto.",
      facts: [
        {
          title: "Symbolism of the Cypress",
          text: "Van Gogh regarded cypress trees as 'beautiful as an Egyptian obelisk,' viewing them as timeless emblems of mourning, endurance, and cosmic connection against the swirling summer sky.",
          category: "symbolism",
        },
        {
          title: "Reed Pen Studies & Impasto",
          text: "Vincent prepared this composition through detailed reed pen drawings before executing the painting with pure, unblended pigments applied straight from the tube using brushes and palette knives.",
          category: "technique",
        },
        {
          title: "The Saint-Rémy Asylum Series",
          text: "Van Gogh executed three large versions of this composition; he considered this Met version to be the finest and most resolved of the summer suite.",
          category: "history",
        },
      ],
      visualHighlights: [
        "The flame-like contours of the towering dark evergreen cypress anchored on the right",
        "The thick churning curls of zinc white and cobalt in the turbulent sky",
        "The shimmering, golden rhythm of the wheat field bending under the northern mistral wind",
      ],
      curatorInsight: "Standing before this canvas in Gallery 822 reveals the relief topography of Vincent's paint—the physical crests of oil paint cast actual microscopic shadows across the canvas.",
      didYouKnow: "Van Gogh shipped this masterpiece to his brother Theo in Paris in the autumn of 1889 along with Starry Night.",
    },
    secrets: {
      artworkId: 436535,
      headline: "Embedded Sand Grains and the Mistral's Fury",
      summary: "Behind the serene golden wheat lies a dramatic struggle with illness and the fierce Mediterranean elements, documented through paint conservation and private letters.",
      facts: [
        {
          title: "Grains of Sand and Pine Needles",
          text: "Microscopic analysis of the paint layer revealed small grains of sand and dust embedded in the wet pigment, proving Vincent worked en plein air amidst violent mistral gusts.",
          category: "secret",
        },
        {
          title: "The Artist's Own Assessment",
          text: "In letter 784, Vincent declared this work 'the most sunny, the best I have done,' specifically highlighting the contrast between the sunny yellow wheat and the dark cypress.",
          category: "provenance",
        },
        {
          title: "A Triad of Versions",
          text: "While working in the asylum clinic, Vincent was granted two rooms—one serving as a makeshift studio where he replicated this scene in different scales.",
          category: "secret",
        },
      ],
      visualHighlights: [
        "Trace where the paint was scraped and reapplied near the horizon line",
        "The purple and mauve shadows woven invisibly into the golden stalks",
        "The tiny olive grove nestled between the field and the Alpilles mountains",
      ],
      curatorInsight: "Close examination under raking light reveals the physical speed of Vincent's mark-making—he painted this entire large canvas in just a few impassioned sessions.",
      didYouKnow: "The Annenberg Foundation acquired and gifted this work to The Met in 1993 for a then-record $57 million.",
    },
    technique: {
      artworkId: 436535,
      headline: "Sculptural Impasto and the Chemistry of Chrome Yellow",
      summary: "Van Gogh's technical mastery lies in treating oil paint almost like sculptural terracotta, building three-dimensional textures directly upon rough canvas weave.",
      facts: [
        {
          title: "Chrome Yellow & Zinc White",
          text: "Vincent utilized innovative synthetic pigments including chrome yellow and emerald green alongside traditional cobalt blue, exploiting optical vibration through complementary colors.",
          category: "technique",
        },
        {
          title: "Palette Knife Troweling",
          text: "For the cloud formations, Van Gogh abandoned fine badger-hair brushes entirely, using broad palette knife sweeps to trowel pure paint across wet ground.",
          category: "technique",
        },
        {
          title: "Tonal Balance in Raking Light",
          text: "The thickness of the paint varies from delicate wash layers in the mountains to paint ridges rising nearly 3 millimeters high in the wheat heads.",
          category: "technique",
        },
      ],
      visualHighlights: [
        "The three-dimensional ridges of the clouds that catch natural gallery lighting",
        "The directional strokes simulating wind currents across the grasses",
        "The dry-brush feathering separating the cypress foliage from the sky",
      ],
      curatorInsight: "Conservators note that the painting has never been lined, preserving the exact original impasto peaks as Vincent left them when lifting his brush in 1889.",
      didYouKnow: "Van Gogh frequently cleaned his brushes in turpentine and wiped excess paint directly along the canvas borders.",
    },
    symbolism: {
      artworkId: 436535,
      headline: "The Cosmic Tree Between Earth and the Heavens",
      summary: "In Mediterranean antiquity and Provencal folklore, the cypress represented both eternal rest and resurrection, anchoring Vincent's deeply spiritual nature.",
      facts: [
        {
          title: "The Obelisk of Provence",
          text: "Vincent explicitly compared the cypress to an ancient monument, symbolizing unchanging spiritual permanence amidst a world of shifting earthly weather.",
          category: "symbolism",
        },
        {
          title: "The Cycle of the Harvest",
          text: "In Van Gogh's personal iconography, ripe wheat symbolized the eternal cycle of humanity and labor, while the cypress stood for the soul's ascent toward the infinite.",
          category: "symbolism",
        },
        {
          title: "Spiritual Expressionism",
          text: "Departing from strict Impressionist optical observation, Vincent warped natural contours to express his internal psychic resonance with the cosmos.",
          category: "symbolism",
        },
      ],
      visualHighlights: [
        "The spire-like peak of the cypress piercing the dynamic cloud spirals",
        "The wave-like hills echoing ocean tides high above the terrestrial plain",
        "The brilliant celestial turquoise tones replacing standard sky blue",
      ],
      curatorInsight: "For Van Gogh, nature was never inanimate—every blade of grass and cloud vortex possessed a pulse of universal consciousness.",
      didYouKnow: "Vincent wrote to his sister Wil that looking at the stars always made him dream of eternity.",
    },
  },

  // Claude Monet - The Japanese Footbridge (438008)
  438008: {
    balanced: {
      artworkId: 438008,
      headline: "The Shimmering Harmony of Giverny's Water Garden",
      summary: "In 1893, Monet bought a tract of marshland across the railway tracks from his home in Giverny, diverting a tributary of the Epte River to create his world-famous water lily sanctuary.",
      facts: [
        {
          title: "The Artist as Architect",
          text: "Monet designed the arched wooden bridge himself, hiring a local village carpenter to build it before planting Japanese wisteria, weeping willows, and hybrid water lilies.",
          category: "history",
        },
        {
          title: "Encrusted Paint Layers",
          text: "Painted between 1899 and 1900, Monet worked on multiple canvases simultaneously, returning only when the sun struck the water at the exact corresponding angle.",
          category: "technique",
        },
        {
          title: "The Influence of Japonisme",
          text: "Monet owned over 200 Japanese woodblock prints by artists like Hiroshige; the bridge's arch directly references ukiyo-e representations of nature.",
          category: "symbolism",
        },
      ],
      visualHighlights: [
        "The brilliant pale green reflections beneath the center of the wooden arch",
        "The floating pads of pink and white Nymphaea lilies resting on dark watery depths",
        "The curtain of weeping willow leaves framing the upper half of the composition",
      ],
      curatorInsight: "Monet completely eliminated the sky and horizon line here, drawing the observer into an intimate, floating universe where water mirrors heaven.",
      didYouKnow: "Local Giverny farmers originally petitioned against Monet's pond, fearing the exotic aquatic plants would poison their cattle's drinking water.",
    },
    secrets: {
      artworkId: 438008,
      headline: "Cataracts and the Lawsuit Over Poisoned Water",
      summary: "Behind the placid emerald surface of Giverny lay bitter legal battles with local farmers and Monet's private fight against creeping blindness.",
      facts: [
        {
          title: "The Epte River Lawsuit",
          text: "In 1893, Giverny farmers formally petitioned the departmental prefect to stop Monet from diverting river water, convinced his foreign hybrid lilies would poison livestock.",
          category: "secret",
        },
        {
          title: "The Lily Pad Cleaning Boat",
          text: "Monet employed six full-time gardeners; one was assigned to row out at dawn every single morning to wash road dust and soot from the surface of each individual lily pad.",
          category: "secret",
        },
        {
          title: "Nuclear Cataract Distortion",
          text: "In this period, Monet began noticing yellowing and blurring in his lens; he compensated by keeping his paint palette organized in strict, unchanging pigment orders.",
          category: "secret",
        },
      ],
      visualHighlights: [
        "Look for where Monet scraped down dried paint with a razor to start over",
        "Notice the muddy violet and brown undertones disguised beneath the brilliant chartreuse green",
        "The absence of any horizon line—a revolutionary choice that disoriented contemporary critics",
      ],
      curatorInsight: "Monet's pond was not merely a garden; it was an outdoor studio laboratory built specifically to control and bend optical reflections.",
      didYouKnow: "Monet kept up to eight easels standing around the pond simultaneously, moving from one to another as shadows shifted across the lilies.",
    },
    technique: {
      artworkId: 438008,
      headline: "Encrusted 'Biscotte' and Multi-Canvas Glazing",
      summary: "Monet layered paint in dense, dried accretions called 'biscotte,' refusing traditional varnish to keep the raw, crumbly texture of pure oil pigment on canvas.",
      facts: [
        {
          title: "Synthetic Viridian & Cobalt Violet",
          text: "Monet completely expelled earth tones from his paint box, building the water garden with revolutionary 19th-century synthetics: viridian green, cobalt violet, and cadmium yellow.",
          category: "technique",
        },
        {
          title: "Dry-on-Dry Crust Application",
          text: "Rather than wet-in-wet blending, Monet allowed layers to harden for days before dragging loaded dry brushes over the raised grain to capture dappled light.",
          category: "technique",
        },
        {
          title: "Absorbent Chalk Ground",
          text: "Monet selected specially primed canvases that wicked excess oil away from the paint, giving the surface its signature matte, almost pastel-like resonance.",
          category: "technique",
        },
      ],
      visualHighlights: [
        "The three-dimensional impasto crests on the white water lily petals",
        "The drag marks of the stiff-bristle brush across the green bridge railings",
        "The deep mossy dark tones beneath the bridge that give the illusion of infinite water depth",
      ],
      curatorInsight: "Under gallery spotlighting, the encrusted paint acts like microscopic stained glass—light catches the edges of the dry paint ridges and refracts naturally.",
      didYouKnow: "Monet never varnished his Giverny canvases because he despised glossy museum sheens that interfered with raw natural color vibration.",
    },
    symbolism: {
      artworkId: 438008,
      headline: "The Shinto Bridge and the Water Lily of Resurrection",
      summary: "Imbued with the spiritual essence of Japanese prints and French Symbolist poetry, the water garden was conceived as an earthly portal to infinity.",
      facts: [
        {
          title: "The Arch as a Spiritual Portal",
          text: "In Japanese Shinto tradition, arched taiko-bashi bridges symbolized the crossing from the mundane earthly world into a sacred realm of divine spirits.",
          category: "symbolism",
        },
        {
          title: "Nymphaea: Purity from Silt",
          text: "In fin-de-siècle Symbolist poetry, the water lily was an emblem of spiritual resurrection—blooming spotless and white despite rooting in dark pond mud.",
          category: "symbolism",
        },
        {
          title: "Heaven Mirrored in Earth",
          text: "By eliminating direct views of the sky, Monet created a cosmic metaphor: the heavens can only be experienced by human eyes as reflections on terrestrial water.",
          category: "symbolism",
        },
      ],
      visualHighlights: [
        "The elliptical loop formed by the bridge arch and its mirror reflection in the water",
        "The floating lily pads arranged like celestial constellations on a dark void",
        "The weeping willow fronds hanging down like theater curtains to enclose the sanctuary",
      ],
      curatorInsight: "The bridge is the only human artifact in the painting—acting as an anchor of human consciousness amidst a boundless universe of light.",
      didYouKnow: "Monet hung Hiroshige's print of the arched bridge at Kameido Tenjin Shrine in his dining room for decades.",
    },
  },

  // Katsushika Hokusai - Under the Wave off Kanagawa (The Great Wave) (45434)
  45434: {
    balanced: {
      artworkId: 45434,
      headline: "The Colossal Crest and the Eternal Solitude of Mount Fuji",
      summary: "The opening print of Hokusai's legendary series 'Thirty-Six Views of Mount Fuji', this masterpiece captures the fragile vulnerability of human boatmen facing the immense power of nature.",
      facts: [
        {
          title: "Prussian Blue Revolution",
          text: "Hokusai was among the first Japanese printmakers to embrace synthetic Prussian blue (imported through Dutch traders at Dejima), which offered unprecedented brilliance and lightfastness.",
          category: "technique",
        },
        {
          title: "Optical Geometry & Golden Spirals",
          text: "The wave forms a dynamic Fibonacci spiral that frames the distant, snow-capped Mount Fuji in serene mathematical stillness.",
          category: "technique",
        },
        {
          title: "Oshiokuri-bune Fishing Boats",
          text: "The three boats battling the surf are fast cargo vessels used to transport live fish to the bustling fish markets of Edo (modern-day Tokyo).",
          category: "history",
        },
      ],
      visualHighlights: [
        "The claw-like foam droplets spraying like snow from the collapsing wave crest",
        "The tiny silhouette of Mount Fuji positioned at the optical heart of the wave vortex",
        "The rowers huddled in unison inside the sleek, narrow wooden hull",
      ],
      curatorInsight: "This woodblock print influenced Western modernism more profoundly than almost any other Asian artwork, directly inspiring Van Gogh, Debussy's 'La Mer', and Rilke.",
      didYouKnow: "The Met holds several impressions of this print; this early strike preserves the delicate wood grain lines and subtle pink clouds along the horizon.",
    },
    secrets: {
      artworkId: 45434,
      headline: "Smuggled Synthetic Pigments and Hokusai's Rebirth at 70",
      summary: "Created during an era when Japan's borders were strictly sealed under Sakoku isolation, this print hides clandestine European trade and deep personal adversity.",
      facts: [
        {
          title: "Smuggled Berlin Blue Pigment",
          text: "Synthetic Prussian blue was forbidden to everyday artisans; Dutch traders secretly smuggled the pigment cakes through Nagasaki's tiny island of Dejima into Edo.",
          category: "secret",
        },
        {
          title: "Hokusai's Stroke & Bankruptcy",
          text: "At age 68, Hokusai suffered a debilitating stroke and fell into financial ruin due to his grandson's debts; he created this series as an act of desperate artistic survival.",
          category: "secret",
        },
        {
          title: "The Vanishing Pink Cloud Block",
          text: "Only the earliest strikes, including The Met's, display the faint pink atmospheric wash along the horizon; the woodblock wore out after several hundred printings.",
          category: "secret",
        },
      ],
      visualHighlights: [
        "The faint horizontal woodgrain impression running through the pale sky area",
        "The tiny red publisher's cartouche of Nishimuraya Yohachi in the upper left",
        "The facial expressions of the 30 rowers pressed down flat against the gunwales",
      ],
      curatorInsight: "Hokusai signed this work 'formerly Hokusai, now Iitsu'—announcing to the world that at age seventy-one he had discarded his former self to begin anew.",
      didYouKnow: "In 2013, fluid dynamicists discovered that Hokusai's wave claws accurately match the mathematical physics of high-seas rogue waves breaking at 40 feet.",
    },
    technique: {
      artworkId: 45434,
      headline: "Eight Cherrywood Blocks and the Bokashi Gradation",
      summary: "A tour de force of Japanese ukiyo-e printmaking requiring microscopic registration across eight hand-carved mountain cherrywood blocks.",
      facts: [
        {
          title: "Bokashi Wet-Rag Gradation",
          text: "The smooth color transitions in the wave's hollow were achieved by wiping the inked woodblock with a damp cotton cloth just seconds before pressing the paper.",
          category: "technique",
        },
        {
          title: "Kento Precision Notches",
          text: "Carvers incised L-shaped kento registration notches directly into the corners of each woodblock so multi-colored sheets aligned down to a fraction of a millimeter.",
          category: "technique",
        },
        {
          title: "Kizuki Mulberry Paper Sizing",
          text: "The print was stamped on thick mulberry paper treated with nikawajiru (animal hide glue and alum), allowing it to absorb eight heavy ink pressings without warping.",
          category: "technique",
        },
      ],
      visualHighlights: [
        "The razor-thin separation lines where the deep Prussian blue meets the pure white paper foam",
        "The tiny spray droplets carved as individual raised dots on the main key-block",
        "The subtle gradation of gray wash framing the dark mountain base",
      ],
      curatorInsight: "Credit belongs equally to Hokusai's brush drawing and the anonymous master carver whose gouge carved lines thinner than a human hair into rock-hard cherrywood.",
      didYouKnow: "The print was originally sold in Edo for sixteen mon—roughly the price of a double bowl of soba noodles.",
    },
    symbolism: {
      artworkId: 45434,
      headline: "The Mountain of Immortality and the Cosmic Taoist Spiral",
      summary: "Beneath the catastrophic drama lies a profound Buddhist and Taoist meditation on eternal stillness amidst transient earthly storms.",
      facts: [
        {
          title: "Fuji: The Immortal Anchor",
          text: "Mount Fuji's name (Fushi) sounds identical to 'immortality'; it sits motionless at the exact geometric center, untouched by the tempestuous sea.",
          category: "symbolism",
        },
        {
          title: "The Taoist Yin-Yang Spiral",
          text: "The curling wave crest and the deep trough form a cosmic taijitu (yin-yang) spiral, representing the cyclical balance of violent energy and silent void.",
          category: "symbolism",
        },
        {
          title: "Mono no Aware: Acceptance of Fate",
          text: "The rowers do not scream or fight the oars; they bow forward in unison, embodying the Buddhist virtue of serene surrender to nature's supreme power.",
          category: "symbolism",
        },
      ],
      visualHighlights: [
        "The optical rhyme between the snow on Fuji's summit and the spray on the miniature foreground waves",
        "The curve of the wooden boat matching the curve of the ocean trough",
        "The wave's claw-like talons personifying the ocean as a living, mythical dragon",
      ],
      curatorInsight: "Hokusai juxtaposed the fleeting panic of human labor with the eternal serenity of the sacred mountain—reminding viewers that earthly trials are momentary illusions.",
      didYouKnow: "Mount Fuji was an object of religious worship by the Edo Fuji-ko sect, who treated climbing the peak as a sacred pilgrimage of rebirth.",
    },
  },

  // Johannes Vermeer - Young Woman with a Water Pitcher (437881)
  437881: {
    balanced: {
      artworkId: 437881,
      headline: "A Quiet Moment Suspended in Crystalline Light",
      summary: "One of only thirty-six surviving paintings by the Dutch master Johannes Vermeer, this radiant interior was the first Vermeer to enter an American public museum collection.",
      facts: [
        {
          title: "The First Vermeer in America",
          text: "Financier Henry Gurdon Marquand donated this canvas to The Met in 1889, helping ignite America's enduring obsession with Vermeer's quiet poetic world.",
          category: "provenance",
        },
        {
          title: "Ultramarine in White Light",
          text: "Vermeer lavishly incorporated genuine lapis lazuli ultramarine—the most expensive pigment of the 17th century—not only in the woman's skirt, but within the gray plaster wall shadows.",
          category: "technique",
        },
        {
          title: "Symbol of Domestic Purity",
          text: "The silver-gilt ewer and basin were traditional Dutch symbols of morning ablutions, temperance, and spiritual clarity.",
          category: "symbolism",
        },
      ],
      visualHighlights: [
        "The distorted reflection of the Oriental carpet in the polished brass water basin",
        "The diffused natural sunlight streaming through the leaded stained-glass casement window",
        "The starched white linen headdress with its delicate semi-translucent folds",
      ],
      curatorInsight: "Vermeer's genius was optical precision merged with tender contemplation; note how the wall map's wooden dowel casts an impossibly soft, atmospheric shadow.",
      didYouKnow: "The map shown on the wall depicts the seventeen provinces of the Netherlands, a popular fixture in affluent 17th-century Delft homes.",
    },
    secrets: {
      artworkId: 437881,
      headline: "The Erased Lion Chair and Camera Obscura Halations",
      summary: "Technical radiography reveals dramatic alterations made by Vermeer to simplify his composition, alongside optical hallmarks of lens-based projection.",
      facts: [
        {
          title: "The Painted-Out Armchair",
          text: "X-ray radiography revealed that Vermeer originally painted a large wooden armchair with carved lion-head finials behind the table, which he scraped away to clear space for the light.",
          category: "secret",
        },
        {
          title: "Camera Obscura Soft Focus",
          text: "The blurred halations of light (circles of confusion) glinting on the brass pitcher match the optical aberration produced by a seventeenth-century camera obscura lens.",
          category: "secret",
        },
        {
          title: "Marquand's Bargain Acquisition",
          text: "Financier Henry Marquand purchased this priceless Vermeer in Paris in 1887 for just $800, when it was erroneously attributed to Pieter de Hooch.",
          category: "secret",
        },
      ],
      visualHighlights: [
        "Trace the faint pentimento ghost where the carved back of the armchair once stood",
        "The tiny pinprick hole at the central vanishing point where Vermeer snapped chalk lines for perspective",
        "The soft, out-of-focus blur on the red table carpet contrasted with the crisp window latch",
      ],
      curatorInsight: "Vermeer's genius lies in what he chose to remove: by stripping away the chair, the room became a sanctum of pure light and geometric silence.",
      didYouKnow: "Vermeer died in Delft at age 43 in crushing debt, leaving eleven children; his widow was forced to surrender paintings to pay the family's baker tab.",
    },
    technique: {
      artworkId: 437881,
      headline: "Lapis Lazuli Shadows and Wet-in-Wet Reflections",
      summary: "Vermeer's palette was legendary for its extravagance, incorporating genuine crushed lapis lazuli into neutral shadows to recreate the luminescence of daylight.",
      facts: [
        {
          title: "Lapis Lazuli in Gray Wall Shadows",
          text: "Vermeer mixed costly Afghan ultramarine into the lead white and bone black of the rear wall, infusing the shadow with cool daylight bounce.",
          category: "technique",
        },
        {
          title: "Pointillist Light Droplets",
          text: "Tiny impasto dots of lead-tin yellow (pointillés) were dabbed onto the jewelry box ribbons and window casement to simulate pinpoint glints of direct sun.",
          category: "technique",
        },
        {
          title: "Wet-in-Wet Metallic Distortion",
          text: "The brass pitcher does not have a solid outline; its surface was painted with fluid, wet-on-wet strokes reflecting the scarlet table carpet and blue skirt.",
          category: "technique",
        },
      ],
      visualHighlights: [
        "The semi-transparency of the starched linen veil through which the yellow bodice remains visible",
        "The soft, atmospheric shadow cast by the wall map's wooden hanging dowel",
        "The lead-came window panes rendered with subtle shifts between pale sky blue and cool gray",
      ],
      curatorInsight: "Vermeer did not paint objects; he painted the air and the light bouncing between objects. Notice how the wall behind the woman is brighter near the floor.",
      didYouKnow: "Lapis lazuli was worth more per ounce than gold during the 17th century and had to be mined in the Hindu Kush mountains of Badakhshan.",
    },
    symbolism: {
      artworkId: 437881,
      headline: "The Golden Basin of Temperance and the Open Window",
      summary: "An allegorical study in moral balance: the young woman stands between domestic modesty and the alluring expanse of the external world.",
      facts: [
        {
          title: "The Basin of Temperance",
          text: "In Dutch emblem books, washing with water was the primary symbol of Matigheid (temperance)—the moral cleansing of the soul from earthly sin.",
          category: "symbolism",
        },
        {
          title: "The Open Casement Window",
          text: "With one hand on the water pitcher and the other grasping the window latch, she pauses between interior domestic piety and the secular outside world.",
          category: "symbolism",
        },
        {
          title: "The Vanitas Jewelry Box",
          text: "The open casket of pearls on the table represents worldly vanity (vanitas), contrasted directly with the clean water of spiritual purification.",
          category: "symbolism",
        },
      ],
      visualHighlights: [
        "The wall map of the Seventeen Provinces, reminding viewers of Dutch global naval power outside the quiet home",
        "The white linen headdress framing the woman's downcast gaze in humble domestic contemplation",
        "The pure morning light acting as an allegorical metaphor for divine truth illuminating the home",
      ],
      curatorInsight: "The painting operates like a moral balance scale: on the right, the jewels of vanity; on the left, the window of truth and the basin of purity.",
      didYouKnow: "Delft homes were famously scrubbed daily with canal water and vinegar, making domestic cleanliness a matter of civic and religious pride.",
    },
  },

  // Jacques Louis David - The Death of Socrates (436105)
  436105: {
    balanced: {
      artworkId: 436105,
      headline: "The Heroic Stoicism of Ancient Athens on the Eve of Revolution",
      summary: "Completed in 1787, David's monumental Neoclassical manifesto depicts the philosopher Socrates preparing to drink hemlock, choosing moral truth over exile or compromise.",
      facts: [
        {
          title: "Manifesto of the French Enlightenment",
          text: "Exhibited at the Paris Salon of 1787 just two years before the storming of the Bastille, viewers immediately read Socrates' sacrifice as a call to civic virtue against royal tyranny.",
          category: "history",
        },
        {
          title: "Plato's Anachronistic Presence",
          text: "David placed Plato seated at the foot of the bed in deep gray contemplation, though Plato was historically absent from Socrates' deathbed due to illness.",
          category: "secret",
        },
        {
          title: "Frieze-Like Composition",
          text: "David arranged his figures across a strict shallow plane inspired by ancient Roman relief sculptures, with hard direct light carving out chisel-like muscular forms.",
          category: "technique",
        },
      ],
      visualHighlights: [
        "Socrates' left hand poised in rhetorical conviction while his right reaches steadily for the cup",
        "The discarded iron chains on the flagstone floor, symbolizing liberation through philosophy",
        "The weeping disciple Crito resting his hand supportively on the philosopher's thigh",
      ],
      curatorInsight: "Sir Joshua Reynolds called this 'the greatest effort of art since the Sistine Chapel and the Stanze of Raphael,' marveling at David's architectural clarity.",
      didYouKnow: "David signed his initials twice: once under Crito to honor loyalty, and once under Plato to claim philosophical heritage.",
    },
    secrets: {
      artworkId: 436105,
      headline: "Guillotined Patrons and the Twice-Signed Canvas",
      summary: "Beneath the high philosophical ideals lies a dangerous political subtext: David's patrons were later executed during the very Revolution he helped lead.",
      facts: [
        {
          title: "Patrons Guillotined in the Terror",
          text: "Commissioned by the aristocratic Trudaine de Montigny brothers, both patrons were guillotined during the Terror, while David sat as a deputy voting for executions.",
          category: "secret",
        },
        {
          title: "The Double Signature Mystery",
          text: "David signed his full name beneath Crito, the faithful disciple, and placed his initials on the floor beneath Plato, claiming dual allegiance to loyalty and intellect.",
          category: "secret",
        },
        {
          title: "Deliberate Historical Fabrications",
          text: "David made Socrates muscular and athletic (he was historically 70 and stout) and included Plato, who explicitly wrote in Phaedo that he was sick and absent.",
          category: "secret",
        },
      ],
      visualHighlights: [
        "The discarded iron leg-irons on the floor representing release from the prison of the flesh",
        "The executioner covering his face in shame as he hands over the poison chalice",
        "In the background corridor, Socrates' wife Xanthippe being escorted away by guards",
      ],
      curatorInsight: "Thomas Jefferson was in Paris as American minister when this debuted and declared it the finest painting produced anywhere in modern times.",
      didYouKnow: "David consulted the classical scholar Father Jean-Benoît de Saint-Germain to verify the exact botanical presentation of the hemlock cup.",
    },
    technique: {
      artworkId: 436105,
      headline: "Chiseled Neoclassical Contour and Enamel-Like Glazes",
      summary: "David rejected the soft, feathery brushwork of the French Rococo, adopting severe geometric draftsmanship inspired by antique Roman relief sculptures.",
      facts: [
        {
          title: "Bas-Relief Frieze Composition",
          text: "David locked all twelve figures onto a narrow, stage-like plane parallel to the canvas, treating them like sculptural figures carved upon a Roman sarcophagus.",
          category: "technique",
        },
        {
          title: "Theatrical Caravaggesque Raking Light",
          text: "A sharp, focused beam of cold daylight enters from the upper left, carving out tendons, musculature, and architectural blocks with razor-sharp contours.",
          category: "technique",
        },
        {
          title: "Invisible Brushwork Finish",
          text: "The paint surface was polished down with fine pumice between glaze layers to eliminate all texture, giving the canvas an enamel-like, stone finish.",
          category: "technique",
        },
      ],
      visualHighlights: [
        "The sculpted anatomy and bulging veins of Socrates' 70-year-old rhetorical arm",
        "The stark geometry of the cold stone prison wall with its mortared ashlar masonry",
        "The crisp, hard-edged geometric folds of the Greek himation drapery",
      ],
      curatorInsight: "David's palette is intentionally austere: muted grays, ochres, and flagstone browns punctured only by the impassioned red of Socrates' robe.",
      didYouKnow: "David used live Parisian models from the Royal Academy, posing them under single oil lanterns to study sharp cast shadows.",
    },
    symbolism: {
      artworkId: 436105,
      headline: "The Secular Martyr of Reason and the Upward Finger",
      summary: "David re-imagined the death of Socrates as a secular Last Supper, transforming the Greek philosopher into an immortal martyr for Enlightenment freedom.",
      facts: [
        {
          title: "The Upward-Pointing Finger",
          text: "Socrates points his index finger toward the heavens, quoting Raphael's School of Athens to signify the immortality of the soul and absolute metaphysical truth.",
          category: "symbolism",
        },
        {
          title: "A Secular Last Supper",
          text: "With twelve disciples surrounding a central teacher before state execution, David deliberately cast Socrates as a rationalist Christ dying for civic virtue.",
          category: "symbolism",
        },
        {
          title: "Plato as History's Dreamer",
          text: "Seated at the foot of the bed with his back turned in deep gray robes, Plato is depicted not as an observer, but as the philosopher dreaming the memory into eternity.",
          category: "symbolism",
        },
      ],
      visualHighlights: [
        "Socrates reaches for the lethal cup without looking at it, demonstrating supreme reason over animal fear",
        "The wave of emotional breakdown rippling across the disciples, contrasting with Socrates' vertical stoic anchor",
        "The quill, inkpot, and parchment on the floor symbolizing philosophical doctrine outliving mortal tyrants",
      ],
      curatorInsight: "The painting sounded a clarion call to the French public: when state laws become unjust, the moral citizen's highest duty is unwavering resistance.",
      didYouKnow: "During the French Revolution, this painting was reproduced as a widely distributed political print encouraging revolutionary sacrifice for the Republic.",
    },
  },

  // Ancient Egyptian - Statue of the Goddess Sekhmet (547802)
  547802: {
    balanced: {
      artworkId: 547802,
      headline: "The Fierce Solar Lioness of Pharaonic Eternity",
      summary: "Carved from dense black granodiorite during the 18th Dynasty under Amenhotep III, this monumental statue represents Sekhmet, the lion-headed goddess of divine retribution, healing, and the sun's scorching heat.",
      facts: [
        {
          title: "Amenhotep III's Litany of 700 Statues",
          text: "Pharaoh Amenhotep III commissioned hundreds of these statues for his mortuary temple in Western Thebes—two for every day of the year—to placate the goddess's wrath and cure plague.",
          category: "history",
        },
        {
          title: "Carved in Imperial Granodiorite",
          text: "The hard stone was quarried at Aswan and floated hundreds of miles down the Nile before master sculptors polished its surface with quartz sand abrasives.",
          category: "technique",
        },
        {
          title: "The Ankh and the Solar Disk",
          text: "Sekhmet holds the ankh symbol of eternal life in her hand and wears the solar disk encircled by the protective uraeus cobra on her head.",
          category: "symbolism",
        },
      ],
      visualHighlights: [
        "The anatomical transition between the muscular feline jaw and the graceful human torso",
        "The incised hieroglyphic inscription of Amenhotep III along the front of the throne",
        "The glassy, mirror-like polish surviving across the shoulders after over three thousand years",
      ],
      curatorInsight: "In Egyptian religious philosophy, Sekhmet possessed two natures: unleashed, she was destruction; appeased by ritual, she transformed into the gentle protector Bastet.",
      didYouKnow: "When the Nile overflowed in ancient times, the reflected water lapped against these statues in the sunken temple courtyard, recreating the primeval creation waters.",
    },
    secrets: {
      artworkId: 547802,
      headline: "The 700 Statues Placed to Stop an Ancient Plague",
      summary: "New archaeological evidence indicates Amenhotep III suffered from chronic dental infections and commissioned these statues during a horrific empire-wide pestilence.",
      facts: [
        {
          title: "An Empire Ravaged by Disease",
          text: "Historical papyri record an epidemic that swept Egypt around 1370 B.C.; Amenhotep III ordered two Sekhmet statues carved for every single day of the year to appease her wrath.",
          category: "secret",
        },
        {
          title: "Usurped Royal Cartouches",
          text: "Later pharaohs, including Ramesses II and Sheshonq I, repeatedly chiseled away Amenhotep's original royal names on these statues to claim divine protection for their own reigns.",
          category: "secret",
        },
        {
          title: "Sunken in Nile Floodwaters",
          text: "In the Temple of Mut at Karnak, the seasonal Nile flood submerged these statues up to their waists, making the lionesses appear to rise directly from the primeval waters of Nun.",
          category: "secret",
        },
      ],
      visualHighlights: [
        "The re-carved chisel marks on the throne where subsequent pharaohs altered the royal titulary",
        "The drilled holes in the feline muzzle that originally held real metallic whiskers",
        "The sheer linen gown line carved with incredible subtlety across the ankles",
      ],
      curatorInsight: "In ancient Egyptian magic, carving Sekhmet's name into stone was literally believed to cage her destructive solar fire, turning a killer of mortals into an eternal guardian.",
      didYouKnow: "Egyptian doctors were simultaneously ordained as priests of Sekhmet, as she controlled both the outbreak and the cure of all contagion.",
    },
    technique: {
      artworkId: 547802,
      headline: "Pounded with Diorite Balls and Polished with Quartz Sand",
      summary: "Because Egyptians had only copper and soft bronze chisels, shaping this ultra-dense granodiorite boulder required months of rhythmic stone-on-stone pounding.",
      facts: [
        {
          title: "Dolerite Hammerstone Pounding",
          text: "Sculptors could not cut this stone with metal chisels; they painstakingly pulverized the granodiorite by striking it with heavy spheres of harder dolerite stone for thousands of hours.",
          category: "technique",
        },
        {
          title: "Quartz Abrasive Sand Polishing",
          text: "The mirror-like black sheen was achieved by rubbing the rough stone with wet Nile sand and leather pads, creating a glass-smooth polish that has survived 3,300 years.",
          category: "technique",
        },
        {
          title: "Aswan Quarry Transport",
          text: "Quarried at the First Cataract in Aswan, these multi-ton monoliths were loaded onto cedar rafts and navigated down the swollen Nile during the peak inundation season.",
          category: "technique",
        },
      ],
      visualHighlights: [
        "The razor-sharp junction where the feline ruff meets the smooth, youthful human collarbone",
        "The high-precision curve of the solar disk crown resting upon her leonine head",
        "The delicate negative space carved between the arms and the torso block",
      ],
      curatorInsight: "The sheer endurance required to sculpt hundreds of these two-ton granodiorite figures stands as one of the greatest feats of manual stone masonry in human history.",
      didYouKnow: "This statue weighs over two tons and required more than forty laborers to drag on wooden sledges greased with animal fat.",
    },
    symbolism: {
      artworkId: 547802,
      headline: "The Eye of Ra: Scorching Sun and Divine Healer",
      summary: "Sekhmet personified the ferocious solar eye—the destructive heat of the Egyptian sun that annihilated enemies while shielding the pharaoh with protective fire.",
      facts: [
        {
          title: "The Ankh: Life from Destruction",
          text: "In her left hand, the fearsome lioness holds the Ankh (symbol of eternal life), communicating the sacred paradox that divine destruction purges corruption to renew life.",
          category: "symbolism",
        },
        {
          title: "The Solar Disk and Uraeus",
          text: "The monumental disk on her brow represents her father Ra, while the rearing cobra (uraeus) spits protective divine venom against the enemies of cosmic order (Ma'at).",
          category: "symbolism",
        },
        {
          title: "The Lotus Scepter of Rebirth",
          text: "She clasps a papyrus or lotus scepter against her chest, symbolizing the lush fertility and annual rebirth of the Upper and Lower Nile.",
          category: "symbolism",
        },
      ],
      visualHighlights: [
        "The predatory feline muzzle symbolizing untamed natural ferocity",
        "The serene, upright human posture symbolizing regal dignity and divine restraint",
        "The throne base representing the primeval mound of creation emerging from chaos",
      ],
      curatorInsight: "Sekhmet embodies the two faces of the sun: untamed in the desert, she is a deadly firestorm; appeased by temple hymns, she is the life-giving warmth that grows the grain.",
      didYouKnow: "During her festival, Egyptians drank vast vats of beer dyed red with pomegranate juice, commemorating the myth where Ra tricked Sekhmet into drunkenness to stop her slaughter.",
    },
  },
};

// Intelligent curatorial facts synthesizer for any artwork in the collection
export function buildCuratorialDossier(artwork: any, focusMode: string = "balanced"): CuratorialDossier {
  const title = artwork.title || "Masterpiece";
  const artist = artwork.artistDisplayName || "an accomplished artisan";
  const date = artwork.objectDate || "historical antiquity";
  const medium = artwork.medium || "fine art medium";
  const department = artwork.department || "The Met Permanent Collection";
  const culture = artwork.culture || artwork.period || "world heritage";
  const classification = artwork.classification || "artwork";

  if (focusMode === "technique") {
    return {
      artworkId: artwork.objectID || 0,
      headline: `Pigments, Material Anatomy & Craftsmanship of ${title}`,
      summary: `Cataloged under The Met's ${department}, this ${classification.toLowerCase()} demonstrates sophisticated command of ${medium}, celebrated for its material chemistry, surface preparation, and structural poise.`,
      facts: [
        {
          title: "Pigment Chemistry & Binders",
          text: `The physical formulation of ${medium} showcases the peak technical capabilities available during ${date}, utilizing specialized mineral pigments and binding agents to ensure longevity.`,
          category: "technique",
        },
        {
          title: "Surface Preparation & Tool Marks",
          text: `Met conservators have documented how the tactile handling of historical tools, ground layers, and glaze applications creates subtle surface variations that catch ambient gallery lighting.`,
          category: "technique",
        },
        {
          title: "Structural Support & Preservation",
          text: `Attributed to ${artist}, the piece displays distinctive hallmarks of individual workshop execution and material durability that have protected it from environmental degradation across centuries.`,
          category: "technique",
        },
      ],
      visualHighlights: [
        "Examine the delicate transitions of surface texture, brushwork, or chisel finishing",
        "Look closely at the rhythmic tension between core focal marks and structural ground layers",
        "Observe how natural gallery light activates the specific sheen and pigment depth of the medium",
      ],
      curatorInsight: `Within The Met galleries, inspecting ${title} from oblique angles reveals how the physical textures of ${medium} create natural micro-shadows impossible to replicate in digital photographs.`,
      didYouKnow: `This piece is conserved and monitored under precise temperature and humidity controls within The Met's ${department}.`,
    };
  }

  if (focusMode === "secrets") {
    return {
      artworkId: artwork.objectID || 0,
      headline: `Hidden Discoveries & Curatorial Lore: ${title}`,
      summary: `Behind the serene public presentation of ${title} lies a rich trail of historical provenance, scholarly rediscovery, and behind-the-scenes Met curatorial inquiry.`,
      facts: [
        {
          title: "Provenance & Passage to New York",
          text: `Acquired for The Met's permanent collection, this work traversed distinguished private collections, estate disputes, and international passages before arriving in New York.`,
          category: "provenance",
        },
        {
          title: "Underdrawing & Pentimenti Clues",
          text: `Modern technical imaging and archival documentation have illuminated subtle alterations in composition, offering rare windows into the maker's evolving thought process.`,
          category: "secret",
        },
        {
          title: "Curatorial Re-evaluation",
          text: `Scholars at The Met continue to study ${culture} contextual records, discovering previously overlooked workshop connections, secondary inscriptions, and historical anecdotes.`,
          category: "secret",
        },
      ],
      visualHighlights: [
        "Note the subtle pentimenti or boundary marks where the artist adjusted the layout during creation",
        "Observe the quiet details in the secondary planes that reward patient, prolonged inspection",
        "Look for tiny maker marks, registration nuances, or characteristic signature traces",
      ],
      curatorInsight: `Every great museum acquisition carries silent histories; standing before ${title} invites us into the ongoing detective work of art historical scholarship.`,
      didYouKnow: `The Met's curatorial department maintains continuous scholarly files documenting the acquisition and conservation history of this piece.`,
    };
  }

  if (focusMode === "symbolism") {
    return {
      artworkId: artwork.objectID || 0,
      headline: `Iconography, Allegories & Hidden Symbols in ${title}`,
      summary: `Beneath the visual surface of ${title} lies an intricate symbolic vocabulary reflecting the spiritual tenets, cultural metaphors, and philosophical ideals of ${culture}.`,
      facts: [
        {
          title: "Emblematic Meanings & Visual Codes",
          text: `Key visual elements in the composition served as recognized visual shorthand during ${date}, communicating status, devotion, or philosophical ideas to contemporary viewers.`,
          category: "symbolism",
        },
        {
          title: "Cultural Values & Sacred Metaphors",
          text: `Created during ${date}, the visual hierarchy communicates deep cultural beliefs regarding humanity's relationship with society, nature, and the divine.`,
          category: "symbolism",
        },
        {
          title: "Allegorical Harmony",
          text: `The balance of motifs chosen by ${artist} reinforces themes of enduring memory, renewal, and universal contemplation shared across ${culture} traditions.`,
          category: "symbolism",
        },
      ],
      visualHighlights: [
        "Inspect the central symbolic motifs and how they relate to the surrounding negative space",
        "Trace the intentional color choices chosen for their allegorical and emotional resonance",
        "Examine how light and shadow are deployed as metaphors for truth, mystery, or revelation",
      ],
      curatorInsight: `Art across historical eras speaks in symbolic codes; unravelling ${title} connects contemporary visitors directly with the intellectual worldview of ${culture}.`,
      didYouKnow: `This piece is officially preserved in The Met's permanent collection to foster global cross-cultural understanding.`,
    };
  }

  // Balanced default
  return {
    artworkId: artwork.objectID || 0,
    headline: `Curated Masterpiece Highlights: ${title}`,
    summary: `Created in ${date} by ${artist}, this distinguished work in The Met's ${department} stands as an enduring testament to the aesthetic achievements of ${culture}.`,
    facts: [
      {
        title: "Artistic Innovation & Style",
        text: `The confident handling of ${medium} establishes this piece as a noteworthy milestone in its genre and historical period.`,
        category: "technique",
      },
      {
        title: "Cultural & Historical Milieu",
        text: `Formed within the artistic currents of ${date}, the artwork captures the aesthetic ambitions and cultural conversations of its time.`,
        category: "history",
      },
      {
        title: "The Met Collection Legacy",
        text: `Preserved within The Metropolitan Museum of Art, it provides museum visitors and global scholars with an extraordinary window into ${culture} heritage.`,
        category: "provenance",
      },
    ],
    visualHighlights: [
      "The dynamic interplay between primary visual motifs and negative space",
      "The distinctive surface marks and pigment density characteristic of the medium",
      "The harmonious spatial balance that draws the viewer's eye across the entire composition",
    ],
    curatorInsight: `Encountering this masterpiece in person in The Met galleries reveals nuances of craft and atmospheric presence that reward prolonged reflection.`,
    didYouKnow: `This work is cataloged in The Met's collection records and accessible to scholars worldwide.`,
  };
}

// Tailored curatorial answer engine for custom visitor questions
export function buildCuratorialAnswer(artwork: any, question: string) {
  const title = artwork.title || "this artwork";
  const artist = artwork.artistDisplayName || "the maker";
  const date = artwork.objectDate || "its era";
  const medium = artwork.medium || "its materials";
  const department = artwork.department || "The Met";

  const lowerQ = question.toLowerCase();
  let answer = "";
  let suggestedFollowUps: string[] = [];

  if (lowerQ.includes("technique") || lowerQ.includes("paint") || lowerQ.includes("material") || lowerQ.includes("medium")) {
    answer = `Regarding the craftsmanship of "${title}": ${artist} executed this work using ${medium}. In ${date}, working with these materials demanded rigorous technical discipline—from preparing the surface support to formulating pigments and controlling drying times. When viewing the piece in The Met's ${department} galleries, one can observe how the physical handling creates luminous texture and structural permanence that has survived centuries.`;
    suggestedFollowUps = [
      "What inspired the artist to create this?",
      "Where in The Met can I see this in person?",
      "What was the cultural era behind this work?",
    ];
  } else if (lowerQ.includes("who") || lowerQ.includes("artist") || lowerQ.includes("maker") || lowerQ.includes("biography")) {
    answer = `"${title}" was crafted by ${artist} (${artwork.artistDisplayBio || "active in " + date}). The artist's distinctive style helped shape the creative directions of the period. At The Met, curators celebrate how ${artist} balanced individual expression with the prevailing traditions of ${artwork.culture || "the era"}, producing a work that remains influential in our permanent collection.`;
    suggestedFollowUps = [
      "What techniques or materials were used here?",
      "What hidden symbols or meanings are present?",
      "How did this piece arrive at The Met?",
    ];
  } else if (lowerQ.includes("where") || lowerQ.includes("gallery") || lowerQ.includes("room") || lowerQ.includes("location")) {
    answer = `"${title}" is part of The Metropolitan Museum of Art's ${department} collection${artwork.galleryNumber ? ` (typically displayed in Gallery ${artwork.galleryNumber})` : ""}. Because The Met maintains a vast collection of over 1.5 million objects, pieces may periodically rotate for conservation or special exhibition, but it remains a prized component of our educational mission.`;
    suggestedFollowUps = [
      "What is the story behind this artwork?",
      "What materials and techniques were used?",
      "What other artworks by this artist are in The Met?",
    ];
  } else {
    answer = `Regarding your inquiry about "${title}" by ${artist} (${date}): curatorial scholarship at The Met highlights how this remarkable ${medium} piece reflects the aesthetic ideals and cultural spirit of its time. Its composition, use of space, and delicate balance continue to provide fresh insights for both scholars and museum visitors exploring our ${department} collection.`;
    suggestedFollowUps = [
      "What techniques did the artist employ?",
      "What hidden details or symbols should I look for?",
      "What other works in the collection relate to this?",
    ];
  }

  return {
    question,
    answer,
    suggestedFollowUps,
  };
}
