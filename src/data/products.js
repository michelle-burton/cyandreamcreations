import heroSuncatcher from '../assets/hero-suncatcher.png'
import radianceAtmospheric from '../assets/products/radiance-within/radiance-within-atmospheric.png'
import radianceOne from '../assets/products/radiance-within/radiance-within-01.jpg'
import radianceTwo from '../assets/products/radiance-within/radiance-within-02.jpg'
import radianceThree from '../assets/products/radiance-within/radiance-within-03.jpg'
import radianceVideo from '../assets/products/radiance-within/radiance-within-video.mp4'

const radianceStory = [
  'Radiance Within belongs to the House of the Sun—the realm of presence, courage, warmth, and the light that asks to be seen. The Sun does not wait for certainty before it rises. It illuminates what is already here and invites us to meet ourselves with the same openness.',
  'At the crown of this piece, a radiant sun rests within the curve of a crescent moon. Together, they offer a gentle reminder that reflection and expression are not opposites. The quiet inner self gives meaning to the light we share, while the courage to be visible allows that inner truth to take form.',
  'Hung near a window, its clear crystals and iridescent prisms gather passing sunlight and release it as small, shifting colors. Let it mark a place where you create, begin again, or remember the light that belongs to you. Carry the question of the Sun: How do I shine?',
]

const products = [
  {
    id: 'radiance-within',
    name: 'Radiance Within Sun Catcher',
    price: 42,
    inventory: 1,
    house: 'Sun',
    houseSymbol: '☀',
    guidingWord: 'Illuminate',
    shortDescription: 'A one-of-a-kind celestial sun catcher with antique-gold-toned metalwork, clear faceted crystals, and iridescent prisms that scatter shifting light throughout your space.',
    meaning: 'Created as a reminder of the radiance you already carry.',
    image: radianceAtmospheric,
    imagePosition: 'center',
    imageFit: 'contain',
    gallery: [
      { src: radianceAtmospheric, position: 'center', fit: 'contain', alt: 'Radiance Within sun catcher hanging beside an elegant dark window' },
      { src: radianceOne, position: 'center 20%', fit: 'contain', alt: 'Close view of the celestial sun and crescent centerpiece' },
      { src: radianceTwo, position: 'center', fit: 'contain', alt: 'Full view of Radiance Within hanging outdoors in sunlight' },
      { src: radianceThree, position: 'center 70%', fit: 'contain', alt: 'Close view of the three long hanging crystal prisms' },
    ],
    videoLabel: 'See the catcher move in sunlight',
    videoSrc: radianceVideo,
    videoPoster: radianceAtmospheric,
    details: [
      'Handmade and one of a kind',
      'Approximately 16 inches overall',
      '4-inch hanging chain',
      'Approximately 4 inches wide',
      'Ready to hang',
    ],
    storyTitle: 'The Story of Radiance Within',
    story: radianceStory,
    lore: {
      energy: 'Presence',
      motion: 'Radiates outward',
      gift: 'The courage to exist out loud',
      question: 'How do I shine?',
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
