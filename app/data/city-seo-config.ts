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
      "Paris has a dense and constantly evolving exhibition landscape, with institutions such as the Centre Pompidou, Palais de Tokyo, and the Fondation Louis Vuitton, alongside a wide network of galleries and contemporary art spaces.",
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
      "Berlin has one of Europe’s most active contemporary art scenes, anchored by institutions within the Staatliche Museen zu Berlin and venues such as Hamburger Bahnhof and KW Institute for Contemporary Art, alongside a dense network of galleries and project spaces.",
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
      "Amsterdam offers a strong mix of modern and contemporary art, with institutions such as the Stedelijk Museum alongside experimental art spaces and galleries.",
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
      "Brussels combines major museums such as BOZAR and WIELS with a strong contemporary gallery scene, making it an important hub for modern and contemporary art in Europe.",
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
      "Zurich has a compact but influential contemporary art scene, with institutions such as Kunsthaus Zürich and Migros Museum alongside internationally active galleries.",
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

export const THIS_WEEK_CITY_ROUTE_BY_CITY_SLUG: Record<string, string> = {
  paris: "paris-art-exhibitions/this-week",
};
