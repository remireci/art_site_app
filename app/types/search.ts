export interface SearchResult {
  _id: string;
  source: "agenda" | "articles";
  title: string;

  domain?: string;
  location?: string;
  url?: string;

  artists?: string | null;
  date_end_st?: string | null;
  date_begin_st?: string | null;

  image_reference?: string[] | string | null;
  exhibition_url?: string | string[] | null;

  snippet?: string;
}
