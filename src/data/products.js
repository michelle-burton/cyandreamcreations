import solarHero from '../assets/products/solar-radiance/solar-radiance-hero.png'
import solarFull from '../assets/products/solar-radiance/solar-radiance-full.jpg'
import solarCenter from '../assets/products/solar-radiance/solar-radiance-center.jpg'
import solarBeads from '../assets/products/solar-radiance/solar-radiance-beads.jpg'
import radianceAtmospheric from '../assets/products/radiance-within/radiance-within-atmospheric.png'
import radianceOne from '../assets/products/radiance-within/radiance-within-01.jpg'
import radianceTwo from '../assets/products/radiance-within/radiance-within-02.jpg'
import radianceThree from '../assets/products/radiance-within/radiance-within-03.jpg'
import radianceVideo from '../assets/products/radiance-within/radiance-within-video.mp4'
import bestFriendHero from '../assets/products/best-friends-light/best-friends-light-hero.png'
import bestFriendOne from '../assets/products/best-friends-light/best-friends-light-01.jpg'
import bestFriendTwo from '../assets/products/best-friends-light/best-friends-light-02.jpg'
import bestFriendThree from '../assets/products/best-friends-light/best-friends-light-03.jpg'
import gildedDuskHero from '../assets/products/gilded-dusk/gilded-dusk-hero.png'
import gildedDuskOne from '../assets/products/gilded-dusk/gilded-dusk-01.jpg'
import gildedDuskTwo from '../assets/products/gilded-dusk/gilded-dusk-02.jpg'
import gildedDuskThree from '../assets/products/gilded-dusk/gilded-dusk-03.jpg'
import midnightWingsHero from '../assets/products/midnight-wings/midnight-wings-hero.png'
import midnightWingsOne from '../assets/products/midnight-wings/midnight-wings-01.jpg'
import midnightWingsTwo from '../assets/products/midnight-wings/midnight-wings-02.jpg'
import midnightWingsThree from '../assets/products/midnight-wings/midnight-wings-03.jpg'
import circlesOfDreamsHero from '../assets/products/circles-of-dreams/circles-of-dreams-hero.png'
import circlesOfDreamsOne from '../assets/products/circles-of-dreams/circles-of-dreams-01.jpg'
import circlesOfDreamsTwo from '../assets/products/circles-of-dreams/circles-of-dreams-02.jpg'
import circlesOfDreamsThree from '../assets/products/circles-of-dreams/circles-of-dreams-03.jpg'

const radianceStory = [
  'Radiance Within belongs to the House of the Sun—the realm of presence, courage, warmth, and the light that asks to be seen. The Sun does not wait for certainty before it rises. It illuminates what is already here and invites us to meet ourselves with the same openness.',
  'At the crown of this piece, a radiant sun rests within the curve of a crescent moon. Together, they offer a gentle reminder that reflection and expression are not opposites. The quiet inner self gives meaning to the light we share, while the courage to be visible allows that inner truth to take form.',
  'Hung near a window, its clear crystals and iridescent prisms gather passing sunlight and release it as small, shifting colors. Let it mark a place where you create, begin again, or remember the light that belongs to you. Carry the question of the Sun: How do I shine?',
]

const products = [
  {
    id: 'radiance-within',
    sku: 'radiance-within',
    status: 'available',
    name: 'Radiance Within Sun Catcher',
    price: 42,
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
      { src: radianceTwo, position: 'center', fit: 'contain', alt: 'Full view of the Radiance Within celestial sun catcher against a dark background' },
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
    sku: 'solar-radiance',
    checkoutUrl: 'https://square.link/u/ukVQgXBJ',
    status: 'available',
    name: 'Solar Radiance Sun Catcher',
    price: 62,
    house: 'Sun',
    houseSymbol: '☀',
    shortDescription: 'A radiant crystal catcher created to celebrate presence, warmth, and being seen.',
    image: solarHero,
    imagePosition: 'center',
    imageFit: 'contain',
    gallery: [
      { src: solarHero, position: 'center', fit: 'contain', alt: 'Solar Radiance heart sun catcher in a dark window setting' },
      { src: solarFull, position: 'center', fit: 'contain', alt: 'Full view of the Solar Radiance sun catcher with two crystal-wrapped hoops and an iridescent heart' },
      { src: solarCenter, position: 'center', fit: 'contain', alt: 'Close-up of the iridescent heart framed by two crystal-wrapped gold hoops' },
      { src: solarBeads, position: 'center', fit: 'contain', alt: 'Detail of the clear crystal drops and colorful faceted accents on Solar Radiance' },
    ],
    details: ['Handmade', 'Ready to hang', 'One of a kind'],
  },
  {
    id: 'best-friends-light',
    sku: 'best-friends-light',
    status: 'coming-soon',
    name: 'Best Friend’s Light Sun Catcher',
    price: 42,
    house: 'Moon',
    houseSymbol: '☾',
    shortDescription: 'Three silver-toned hoops frame luminous aqua crystals, twin faceted prisms, and a heartfelt “Best Friend” paw charm. Designed to scatter gentle rainbows throughout your space, this one-of-a-kind piece honors friendship, devotion, and the light our companions leave behind.',
    meaning: 'A heartfelt crystal sun catcher celebrating the companions whose love stays with us.',
    image: bestFriendHero,
    imagePosition: 'center',
    imageFit: 'contain',
    gallery: [
      { src: bestFriendHero, position: 'center', fit: 'contain', alt: 'Best Friend’s Light sun catcher hanging in a moonlit window' },
      { src: bestFriendOne, position: 'center', fit: 'contain', alt: 'Full view of the three silver hoops, aqua crystals, and Best Friend charm' },
      { src: bestFriendTwo, position: 'center', fit: 'contain', alt: 'Close-up of the pink heart bead and Best Friend paw-print heart charm' },
      { src: bestFriendThree, position: 'center', fit: 'contain', alt: 'Close-up of a clear faceted prism framed by pale aqua crystal beads' },
    ],
    details: [
      'Handmade and one of a kind',
      'Three connected silver-toned hoops',
      'Clear and pale-aqua faceted crystals',
      'Twin hanging prism crystals',
      '“Best Friend” paw-print heart charm',
      'Ready to hang',
    ],
  },
  {
    id: 'gilded-dusk',
    sku: 'gilded-dusk',
    status: 'coming-soon',
    name: 'Gilded Dusk Sun Catcher',
    price: 58,
    house: 'Sun',
    houseSymbol: '☀',
    shortDescription: 'An antique-gold sun face rests above cascading strands of blush, peach, champagne, and iridescent crystals. Three ornate crystal drops gather the fading light, while smaller sun medallions shimmer between the strands—capturing the quiet radiance found at the edge of day.',
    meaning: 'A reminder that endings can glow just as beautifully as beginnings.',
    image: gildedDuskHero,
    imagePosition: 'center',
    imageFit: 'contain',
    gallery: [
      { src: gildedDuskHero, position: 'center', fit: 'contain', alt: 'Gilded Dusk sun catcher glowing in a dark blue-hour window' },
      { src: gildedDuskOne, position: 'center', fit: 'contain', alt: 'Full view of the antique-gold sun catcher with five cascading crystal strands' },
      { src: gildedDuskTwo, position: 'center', fit: 'contain', alt: 'Close-up of the sun-face centerpiece with a crescent moon on its forehead' },
      { src: gildedDuskThree, position: 'center', fit: 'contain', alt: 'Close-up of three ornate clear crystal prisms and blush crystal accents' },
    ],
    details: [
      'Handmade and one of a kind',
      'Antique-gold-toned celestial centerpiece',
      'Blush, peach, and iridescent faceted crystals',
      'Three ornate hanging crystal prisms',
      'Five cascading chain strands',
      'Ready to hang',
    ],
  },
  {
    id: 'midnight-wings',
    sku: 'midnight-wings',
    status: 'coming-soon',
    name: 'Midnight Wings Sun Catcher',
    price: 54,
    house: 'Creation',
    houseSymbol: '◉',
    shortDescription: 'A dark filigree butterfly opens above five cascading strands of clear, aqua, violet, and iridescent crystals. Tiny stars, butterflies, and radiant charms lead to a luminous rainbow heart—creating a one-of-a-kind piece that shifts between shadow and color as the light changes.',
    meaning: 'A reminder that transformation often begins quietly, before our wings are visible.',
    image: midnightWingsHero,
    imagePosition: 'center',
    imageFit: 'contain',
    gallery: [
      { src: midnightWingsHero, position: 'center', fit: 'contain', alt: 'Midnight Wings butterfly sun catcher hanging in a moonlit garden window' },
      { src: midnightWingsOne, position: 'center', fit: 'contain', alt: 'Full view of the dark butterfly sun catcher with five cascading crystal strands' },
      { src: midnightWingsTwo, position: 'center', fit: 'contain', alt: 'Close-up of the filigree butterfly centerpiece and mixed-link strands' },
      { src: midnightWingsThree, position: 'center', fit: 'contain', alt: 'Close-up of the iridescent heart prism, stars, and crystal accents' },
    ],
    details: [
      'Handmade and one of a kind',
      'Dark filigree butterfly centerpiece',
      'Five cascading mixed-link strands',
      'Clear, aqua, violet, and iridescent crystals',
      'Star, butterfly, and radiant accent charms',
      'Large iridescent heart prism',
      'Ready to hang',
    ],
  },
  {
    id: 'circles-of-dreams',
    sku: 'circles-of-dreams',
    status: 'coming-soon',
    name: 'Circles of Dreams Sun Catcher',
    price: 44,
    house: 'Void',
    houseSymbol: '◯',
    shortDescription: 'Two gold-toned hoops, hand-wrapped with clear, aqua, teal, and iridescent crystals, encircle a single faceted prism. As light moves across the nested rings, the piece shimmers like one dream unfolding gently inside another.',
    meaning: 'A reminder that every dream contains another possibility waiting within.',
    image: circlesOfDreamsHero,
    imagePosition: 'center',
    imageFit: 'contain',
    gallery: [
      { src: circlesOfDreamsHero, position: 'center', fit: 'contain', alt: 'Circles of Dreams sun catcher glowing in a deep indigo nighttime window' },
      { src: circlesOfDreamsOne, position: 'center', fit: 'contain', alt: 'Full view of the two nested crystal-wrapped gold hoops and central prism' },
      { src: circlesOfDreamsTwo, position: 'center', fit: 'contain', alt: 'Close-up of the inner crystal ring and central faceted prism' },
      { src: circlesOfDreamsThree, position: 'center', fit: 'contain', alt: 'Close-up of the hand-wrapped clear, aqua, teal, and iridescent beads' },
    ],
    details: [
      'Handmade and one of a kind',
      'Two nested gold-toned hoops',
      'Clear, aqua, teal, and iridescent beads',
      'Hand-wrapped gold wirework',
      'Central faceted crystal prism',
      'Ready to hang',
    ],
  },
]

export const formatPrice = (price) => `$${price.toFixed(2)}`

export const productStatuses = {
  available: { label: 'Available', message: 'Available to purchase' },
  'sold-out': { label: 'Sold Out', message: 'This piece is currently sold out' },
  reserved: { label: 'Reserved', message: 'This piece is currently reserved' },
  sold: { label: 'Sold', message: 'This one-of-a-kind piece has found its home' },
  'coming-soon': { label: 'Coming Soon', message: 'This piece is still taking form' },
}

export const getProductStatus = (product) => productStatuses[product.status] || productStatuses.available

export const isPurchasable = (product) => product.status === 'available'

export const applyProductAvailability = (product, availability = {}) => {
  if (!product || product.status !== 'available') return product
  if (availability[product.id] !== false) return product
  return { ...product, status: 'sold-out' }
}

export const findProduct = (id) => products.find((product) => product.id === id)

export default products
