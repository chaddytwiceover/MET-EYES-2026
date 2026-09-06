export interface Artwork {
  objectID: number;
  title: string;
  artistDisplayName: string;
  artistDisplayBio: string;
  objectDate: string;
  medium: string;
  dimensions: string;
  department: string;
  culture: string;
  period: string;
  primaryImage: string;
  primaryImageSmall: string;
  additionalImages: string[];
  objectURL: string;
  classification: string;
  creditLine: string;
  galleryNumber?: string;
  objectWikidata_URL?: string;
}

export interface FactItem {
  title: string;
  text: string;
  category: 'history' | 'technique' | 'secret' | 'symbolism' | 'provenance';
}

export interface ArtFacts {
  artworkId: number;
  headline: string;
  summary: string;
  facts: FactItem[];
  visualHighlights: string[];
  curatorInsight: string;
  didYouKnow: string;
}

export interface Department {
  departmentId: number;
  displayName: string;
}

export interface ArtAnswer {
  question: string;
  answer: string;
  suggestedFollowUps: string[];
}
