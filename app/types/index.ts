export interface Exhibition {
  _id?: string;
  title: string;
  date_begin_st?: string;
  date_end_st: string;
  location: string;
  url: string;
  domain: string;
  artists?: string;
  image_reference: string[];
  exhibition_url?: string;
  origin?: string;
  city?: string;
  missing_date_searched?: boolean;
  show: boolean;
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
