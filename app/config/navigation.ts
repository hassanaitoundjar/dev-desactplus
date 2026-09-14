import type { NavLink } from '~/types/navigation'

export const mainNavigation: NavLink[] = [
  {
    label: 'Collections',
    href: '/collections',
    megaMenu: [
      {
        title: 'Par Espace',
        links: [
          { label: 'Salon', href: '/collections/salon', description: 'Canapés, fauteuils et tables basses' },
          { label: 'Salle à manger', href: '/collections/salle-a-manger', description: 'Tables, chaises et buffets' },
          { label: 'Chambre', href: '/collections/chambre', description: 'Lits, commodes et chevets' },
          { label: 'Bureau', href: '/collections/bureau', description: 'Bureaux et rangements' },
        ],
      },
      {
        title: 'Par Style',
        links: [
          { label: 'Contemporain', href: '/collections?style=contemporain' },
          { label: 'Minimaliste', href: '/collections?style=minimaliste' },
          { label: 'Art Déco', href: '/collections?style=art-deco' },
          { label: 'Organique', href: '/collections?style=organique' },
        ],
      },
      {
        title: 'En Vedette',
        links: [
          { label: 'Nouveautés', href: '/products?sort=newest' },
          { label: 'Meilleures ventes', href: '/products?sort=popular' },
          { label: 'Édition limitée', href: '/collections/edition-limitee' },
        ],
      },
    ],
  },
  {
    label: 'Produits',
    href: '/products',
  },
  {
    label: 'Projets',
    href: '/projects',
  },
  {
    label: 'Services',
    href: '/services',
  },
  {
    label: 'À Propos',
    href: '/about',
  },
  {
    label: 'Contact',
    href: '/contact',
  },
]

export const footerNavigation = {
  shop: {
    title: 'Boutique',
    links: [
      { label: 'Toutes les collections', href: '/collections' },
      { label: 'Nouveautés', href: '/products?sort=newest' },
      { label: 'Salon', href: '/categories/salon' },
      { label: 'Salle à manger', href: '/categories/salle-a-manger' },
      { label: 'Chambre', href: '/categories/chambre' },
      { label: 'Décoration', href: '/categories/decoration' },
    ],
  },
  company: {
    title: 'L\'Entreprise',
    links: [
      { label: 'Notre histoire', href: '/about' },
      { label: 'Nos projets', href: '/projects' },
      { label: 'Nos services', href: '/services' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  support: {
    title: 'Support',
    links: [
      { label: 'FAQ', href: '/faq' },
      { label: 'Livraison', href: '/livraison' },
      { label: 'Retours', href: '/retours' },
      { label: 'Garantie', href: '/garantie' },
    ],
  },
}
