import placeholderImage from '../assets/square_placeholder.jpeg'

export const productCatalog = {
  collares: {
    title: 'Collares',
    subtitle: 'Antojate! Hay mucho para ver',
    products: [
      { id: 'col-1', name: 'Collar #1', price: 5000, color: 'Verde', image: placeholderImage },
      { id: 'col-2', name: 'Collar #2', price: 6500, color: 'Vino', image: placeholderImage },
      { id: 'col-3', name: 'Collar #3', price: 7000, color: 'Naranja', image: placeholderImage },
    ],
  },
  manillas: {
    title: 'Manillas',
    subtitle: 'Detalles que elevan tu estilo',
    products: [
      { id: 'man-1', name: 'Manilla #1', price: 3500, color: 'Verde', image: placeholderImage },
      { id: 'man-2', name: 'Manilla #2', price: 4200, color: 'Miel', image: placeholderImage },
      { id: 'man-3', name: 'Manilla #3', price: 5000, color: 'Vino', image: placeholderImage },
    ],
  },
  aretes: {
    title: 'Aretes',
    subtitle: 'Elegancia para cada ocasion',
    products: [
      { id: 'ear-1', name: 'Arete #1', price: 3000, color: 'Perla', image: placeholderImage },
      { id: 'ear-2', name: 'Arete #2', price: 4500, color: 'Dorado', image: placeholderImage },
      { id: 'ear-3', name: 'Arete #3', price: 5500, color: 'Negro', image: placeholderImage },
    ],
  },
}
