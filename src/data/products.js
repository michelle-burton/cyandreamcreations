import heroSuncatcher from '../assets/hero-suncatcher.png'

const moonStory = [
  'The Moonlit Guardian belongs to the House of the Moon—the realm of reflection, intuition, memory, dreams, and the quiet self. The Moon does not make its own light. It receives what has already shone and carries it gently inward, where experience can soften into wisdom.',
  'Suspended near a window, this catcher turns passing sunlight into small drifting reflections. It was created as a symbol of quiet protection: a reminder to pause, listen beneath the noise, and honor the private knowing that does not need to announce itself to be true.',
  'Let it mark a place of rest, journaling, or reflection. As the light moves through its crystal, carry the question of the Moon: Who am I becoming?',
]

const products = [
  {
    id: 'moonlit-guardian',
    name: 'Moonlit Guardian Sun Catcher',
    price: 48,
    house: 'Moon',
    houseSymbol: '☾',
    shortDescription: 'Handmade with crystal and brass to bring shifting color and quiet light into your space.',
    image: heroSuncatcher,
    imagePosition: '64% center',
    gallery: [
      { src: heroSuncatcher, position: '64% center', alt: 'Moonlit Guardian sun catcher beside a dark window' },
      { src: heroSuncatcher, position: '49% 78%', alt: 'Close view of the hanging crystal prism' },
      { src: heroSuncatcher, position: '57% 43%', alt: 'Close view of the celestial brass centerpiece' },
      { src: heroSuncatcher, position: '84% center', alt: 'Rainbow reflections cast by the sun catcher' },
    ],
    videoLabel: 'See the catcher move in sunlight',
    videoSrc: null,
    videoPoster: heroSuncatcher,
    details: ['Handmade', 'Ready to hang', 'One of a kind'],
    story: moonStory,
    lore: {
      energy: 'Reflection',
      motion: 'Gathers inward',
      gift: 'Hear yourself beneath the noise',
      question: 'Who am I becoming?',
    },
  },
  {
    id: 'solar-radiance',
    name: 'Solar Radiance Sun Catcher',
    price: 52,
    house: 'Sun',
    houseSymbol: '☀',
    shortDescription: 'A radiant crystal catcher created to celebrate presence, warmth, and being seen.',
    image: heroSuncatcher,
    imagePosition: '72% center',
    gallery: [{ src: heroSuncatcher, position: '72% center', alt: 'Solar Radiance sun catcher concept' }],
    details: ['Handmade', 'Ready to hang', 'One of a kind'],
  },
  {
    id: 'tree-of-light',
    name: 'Tree of Light Sun Catcher',
    price: 50,
    house: 'Creation',
    houseSymbol: '◉',
    shortDescription: 'A symbol of growth and becoming, made to scatter living color through your space.',
    image: heroSuncatcher,
    imagePosition: '58% center',
    gallery: [{ src: heroSuncatcher, position: '58% center', alt: 'Tree of Light sun catcher concept' }],
    details: ['Handmade', 'Ready to hang', 'One of a kind'],
  },
]

export const formatPrice = (price) => `$${price.toFixed(2)}`

export const findProduct = (id) => products.find((product) => product.id === id)

export default products
