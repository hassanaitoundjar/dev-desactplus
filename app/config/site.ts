export const siteConfig = {
  name: 'Desact Plus',
  tagline: 'L\'art de vivre autrement',
  description: 'Mobilier et design d\'intérieur d\'exception. Des pièces uniques qui transforment chaque espace en une expérience.',
  url: 'https://desactplus.ma',
  locale: 'fr_MA',
  language: 'fr',
  currency: 'MAD',
  currencyLocale: 'fr-MA',

  contact: {
    phone: '+212 6 12 34 56 78',
    email: 'contact@desactplus.ma',
    address: '23, Boulevard Mohammed V, Casablanca, Maroc',
    hours: 'Lundi – Samedi : 10h00 – 19h00',
  },

  social: {
    instagram: 'https://instagram.com/desactplus',
    facebook: 'https://facebook.com/desactplus',
    pinterest: 'https://pinterest.com/desactplus',
  },

  seo: {
    titleTemplate: '%s — Desact Plus',
    defaultTitle: 'Desact Plus — Mobilier & Design d\'Intérieur d\'Exception',
    defaultDescription: 'Découvrez Desact Plus : mobilier haut de gamme, design d\'intérieur sur mesure et collections exclusives pour des espaces uniques.',
    defaultImage: '/images/og-default.jpg',
    keywords: [
      'mobilier de luxe',
      'design intérieur Maroc',
      'meubles haut de gamme',
      'décoration intérieure',
      'mobilier contemporain',
      'aménagement intérieur Casablanca',
    ],
  },
} as const

export type SiteConfig = typeof siteConfig
