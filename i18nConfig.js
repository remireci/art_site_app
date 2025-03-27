const { prefix } = require("@fortawesome/free-solid-svg-icons");

const i18nConfig = {
  locales: ['en', 'nl', 'fr'],
  defaultLocale: 'en',
  prefixDefault: true,
  localDetection: true,
  pages: {
    "*": ["common"],
    "/": ["home"],
  }
};

module.exports = i18nConfig;