import { 
  LayoutGrid, Utensils, Layout, Lightbulb, Paintbrush, 
  Briefcase, Armchair, Sofa, Archive, Image as ImageIcon, Puzzle 
} from 'lucide-vue-next'

export const productCategories = [
  { label: 'Tous les produits', value: 'all', icon: LayoutGrid },
  { label: 'Tables à manger', value: 'tables-a-manger', icon: Utensils, image: '/images/collection-dining.png' },
  { label: 'Tables basses', value: 'tables-basses', icon: Layout, image: '/images/collection-salon.png' },
  { label: 'Éclairage', value: 'eclairage', icon: Lightbulb, image: '/images/collection-lighting.png' },
  { label: 'Objets de décoration', value: 'decoration', icon: Paintbrush, image: '/images/kitchen.jpeg' },
  { label: 'Bureaux', value: 'bureau', icon: Briefcase, image: '/images/collection-office.png' },
  { label: 'Chaises', value: 'chaise', icon: Armchair, image: '/images/collection-dining.png' },
  { label: 'Tables', value: 'table', icon: Utensils, image: '/images/collection-salon.png' },
  { label: 'Canapés', value: 'canape', icon: Sofa, image: '/images/collection-salon.png' },
  { label: 'Fauteuils', value: 'fauteuil', icon: Armchair, image: '/images/collection-bedroom.png' },
  { label: 'Rangements', value: 'rangement', icon: Archive, image: '/images/kitchen.jpeg' },
  { label: 'Tableaux muraux', value: 'tableaux muraux', icon: ImageIcon, image: '/images/kitchen.jpeg' },
  { label: 'Accessoires', value: 'accessoires', icon: Puzzle, image: '/images/bathrom.jpeg' },
]
