type CitySeoConfig = {
  displayName: string;
  introSecondParagraph?: string;
  priorityDomains?: string[];
  priorityLocationKeywords?: string[];
  cityAliases?: string[];
};

export const CITY_SEO_CONFIG: Record<string, CitySeoConfig> = {
  paris: {
    displayName: "Paris",
    introSecondParagraph:
      "From major museums and foundations to contemporary art centers and galleries, Paris offers a dense and constantly changing exhibition landscape. This page highlights a selection of notable shows currently on view or opening soon.",
    priorityDomains: [
      "centrepompidou.fr",
      "palaisdetokyo.com",
      "mam.paris.fr",
      "fondationlouisvuitton.fr",
      "grandpalais.fr",
    ],
    priorityLocationKeywords: [
      "centre pompidou",
      "palais de tokyo",
      "musée d'art moderne de paris",
      "musee d'art moderne de paris",
      "fondation louis vuitton",
      "grand palais",
    ],
  },

  berlin: {
    displayName: "Berlin",
    introSecondParagraph:
      "Berlin has one of Europe’s most active contemporary art scenes, spanning major museums, kunsthalles, and a dense network of galleries and project spaces.",
    priorityDomains: [
      "smb.museum",
      "kw-berlin.de",
      "gropiusbau.de",
      "berlinischegalerie.de",
    ],
    priorityLocationKeywords: [
      "staatliche museen zu berlin",
      "kw berlin",
      "gropius bau",
      "martin-gropius-bau",
      "berlinische galerie",
    ],
  },

  amsterdam: {
    displayName: "Amsterdam",
    introSecondParagraph:
      "Amsterdam offers a strong mix of modern and contemporary art, with major museums alongside experimental institutions and gallery spaces.",
    priorityDomains: [
      "stedelijk.nl",
      "eye.nl",
      "huismarseille.nl",
      "foam.org",
      "rijksmuseum.nl", // less contemporary but still high authority
    ],
    priorityLocationKeywords: [
      "stedelijk museum",
      "eye filmmuseum",
      "huis marseille",
      "foam",
      "rijksmuseum",
    ],
  },

  brussels: {
    displayName: "Brussels",
    introSecondParagraph:
      "Brussels combines major museums with a strong contemporary gallery scene, making it an important hub for modern and contemporary art in Europe.",
    priorityDomains: [
      "kanal.brussels",
      "bozar.be",
      "wiels.org",
      "fine-arts-museum.be",
    ],
    priorityLocationKeywords: [
      "kanal centre pompidou",
      "bozar",
      "wiels",
      "royal museums of fine arts",
    ],
  },

  zurich: {
    displayName: "Zurich",
    introSecondParagraph:
      "Zurich has a compact but influential contemporary art scene, with leading institutions and internationally active galleries.",
    priorityDomains: [
      "kunsthaus.ch",
      "migrosmuseum.ch",
      "westbau.com",
      "hauserwirth.com",
    ],
    priorityLocationKeywords: [
      "kunsthaus zürich",
      "migros museum",
      "luma westbau",
      "hauser & wirth",
    ],
  },
};

export const SEO_CITY_ROUTE_BY_CITY_SLUG: Record<string, string> = {
  paris: "paris-art-exhibitions",
  berlin: "berlin-art-exhibitions",
  amsterdam: "amsterdam-art-exhibitions",
  brussel: "brussels-art-exhibitions",
  brussels: "brussels-art-exhibitions",
  zurich: "zurich-art-exhibitions",
  zürich: "zurich-art-exhibitions",
};

export const SEO_CITY_HUB_LINKS = [
  { route: "paris-art-exhibitions", label: "Paris" },
  { route: "berlin-art-exhibitions", label: "Berlin" },
  { route: "amsterdam-art-exhibitions", label: "Amsterdam" },
  { route: "brussels-art-exhibitions", label: "Brussels" },
  { route: "zurich-art-exhibitions", label: "Zurich" },
];
