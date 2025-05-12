export interface Exhibition {
  _id: string;
  title: string;
  date_end: string;
  location: string;
  url: string;
  exh_url?: string;
  artists?: string;
  date_end_st: string;
  image_reference: string[];
  exhibition_url: string;
}

export type ExhibitionSummary = Pick<
  Exhibition,
  "title" | "location" | "url" | "image_reference" | "exhibition_url"
>;

export interface Location {
  latitude: number;
  longitude: number;
  domain: string;
  name: string;
  hasMultipleLocations?: boolean;
}

export interface GroupedExhibition {
  key: string;
  domain: string;
  location: string | null;
  exhibitions: Exhibition[];
}

export interface ProcessedData {
  processedLocations: Location[];
  groupedExhibitions: GroupedExhibition[];
}
