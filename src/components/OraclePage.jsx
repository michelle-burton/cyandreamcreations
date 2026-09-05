import { useEffect, useRef, useState } from 'react'
import source from '../assets/oracle/source.md?raw'
import housesImage from '../assets/oracle-four-houses.png'
import sun from '../assets/oracle/emblem-sun.svg'
import moon from '../assets/oracle/emblem-moon.svg'
import creation from '../assets/oracle/emblem-creation.svg'
import voidMark from '../assets/oracle/emblem-void.svg'
import './OraclePage.css'

const houses = [
  { name: 'Sun', word: 'Illuminate', symbol: '☀️', mark: sun, color: '#e8c57a', question: 'What light is mine to give?' },
  { name: 'Moon', word: 'Reflect', symbol: '🌙', mark: moon, color: '#7fe9f5', question: 'Who am I becoming?' },
  { name: 'Creation', word: 'Become', symbol: '🌀', mark: creation, color: '#c7a5ed', question: 'What wants to exist?' },
  { name: 'Void', word: 'Dream', symbol: '🌌', mark: voidMark, color: '#aaa5ef', question: 'What is waiting to emerge?' },
]
const cards = [...source.matchAll(/^### ([0IVX]+) · (.*?) — (.*?)\n([\s\S]*?)(?=\n### |\n---)/gm)].map((match) => {
  const fields = Object.fromEntries([...match[4].matchAll(/^- \*\*(\w+):\*\* (.*)$/gm)].map((field) => [field[1].toLowerCase(), field[2]]))
  return { numeral: match[1], name: match[2], house: houses.filter((house) => match[3].includes(house.symbol)), ...fields }
})
const rituals = [
  ['A small eclipse', 'Let your shoulders soften. Take three gentle breaths, at your own pace. With each exhale, let the day grow a little quieter. Silently offer: “I am here. I am listening.”'],
  ['Return to still water', 'Rest your hands where they feel at ease. Imagine the surface of a dark lake becoming still. Let one question rise, without reaching for its answer.'],
  ['The first spark', 'Bring your attention to the warmth of your palms. Take a quiet breath. Make a little room for the possibility you have not yet named.'],
  ['A doorway of light', 'Unclench your jaw. Feel the ground beneath you. Imagine setting the weight of the day beside a doorway. You may enter just as you are.'],
  ['The listening dark', 'Soften your gaze, or close your eyes if comfortable. Take three easy breaths. Whisper inwardly: “There is room for what is becoming.”'],
]
function shuffled() {
  const deck = [...cards]
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

export default function OraclePage() {
  const [ritual, setRitual] = useState(() => rituals[Math.floor(Math.random() * rituals.length)])
  const [stage, setStage] = useState('ritual')
  const [deck, setDeck] = useState(shuffled)
  const [selected, setSelected] = useState([])
  const [reading, setReading] = useState(null)
  const [readingError, setReadingError] = useState('')
  const [isReading, setIsReading] = useState(false)
  const [intention, setIntention] = useState('')
  const heading = useRef(null)
  useEffect(() => {
    document.title = 'The Oracle · Cyan Dream Creations'
    heading.current?.focus({ preventScroll: true })
  }, [stage])
  const reset = () => {
    setDeck(shuffled()); setSelected([]); setReading(null); setReadingError(''); setIntention(''); setRitual(rituals[Math.floor(Math.random() * rituals.length)]); setStage('ritual')
  }
  const positions = ['What shaped this', 'What is present', 'What is emerging']
  const interpret = async () => {
    if (isReading) return
    setIsReading(true); setReadingError(''); setStage('reading')
    try {
      const response = await fetch('/api/oracle-reading', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: intention, cardIds: selected.map((card) => card.numeral) }), signal: AbortSignal.timeout(50000) })
      if (!response.headers.get('content-type')?.includes('application/json')) throw new Error('Personalized readings are not connected in this preview yet. Explore your selected cards below.')
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'Please try your reading again.')
      setReading(result)
    } catch (error) { setReadingError(error.name === 'TimeoutError' ? 'The reading took too long. You can retry with these same cards.' : error.message) }
    finally { setIsReading(false) }
  }
  return <main className="oracle-sanctuary">
    <nav className="oracle-topline" aria-label="Oracle navigation"><a href="/#top">Cyan Dream Creations</a><span>A celestial mirror for the unseen</span><a href="/#shop">Return to the shop ↗</a></nav>
    <div className="oracle-stars" aria-hidden="true">✧ · ✦ · ✧</div>
    {stage === 'ritual' && <section className="oracle-arrival">
      <p className="oracle-eyebrow">THE CYAN DREAM ORACLE</p>
      <h1 ref={heading} tabIndex="-1">Between the question<br />and the light.</h1>
      <p className="oracle-subtitle">It does not predict. It mirrors.</p>
      <div className="oracle-orb" aria-hidden="true"><span>✦</span></div>
      <p className="oracle-eyebrow">YOUR OPENING RITUAL · {ritual[0]}</p>
      <p className="oracle-ritual">{ritual[1]}</p>
      <form onSubmit={(event) => { event.preventDefault(); setStage('draw') }}><label className="oracle-intention">What question are you bringing?<span>Your question and three cards will be sent to OpenAI when you request your reading.</span><textarea required maxLength="600" rows="3" value={intention} onChange={(event) => setIntention(event.target.value)} placeholder="What is asking for my attention?" /></label>
      <button className="oracle-enter" disabled={!intention.trim()}>✦ <span>Enter the Oracle</span> ✦</button></form>
      <p className="oracle-small">When you feel ready, choose a card. There is no hurry.</p>
    </section>}
    {stage === 'draw' && <section className="oracle-draw">
      <p className="oracle-eyebrow">THREE CARDS · ONE CONNECTED READING</p>
      <h1 ref={heading} tabIndex="-1">Let your attention settle.</h1>
      <p className="oracle-subtitle" aria-live="polite">{selected.length < 3 ? `Choose card ${selected.length + 1} of 3 · ${positions[selected.length]}` : 'Your three cards are ready.'}</p>
      {intention && <p className="oracle-held">Your intention: {intention}</p>}
      <div className="oracle-spread-slots">{positions.map((position, i) => <div key={position}><small>{position}</small><p>{selected[i] ? `${selected[i].numeral} · ${selected[i].name}` : '✧'}</p></div>)}</div>
      <div className="oracle-deck">{deck.map((card, i) => <button key={card.numeral} className="oracle-card-back" disabled={selected.includes(card) || selected.length === 3} aria-label={`Choose face-down card ${i + 1}`} onClick={() => setSelected((current) => current.length < 3 && !current.includes(card) ? [...current, card] : current)}><span className="oracle-mandala" aria-hidden="true">☼<br />☾ ✦ ◯<br />⌁</span><span>{selected.includes(card) ? 'SELECTED' : 'CYAN DREAM'}</span></button>)}</div>
      {selected.length === 3 && <button className="oracle-enter" onClick={interpret}>Reveal the meaning ✦</button>}
      <div><button className="oracle-text-button" onClick={() => { setSelected([]); setStage('ritual') }}>Return to the ritual</button></div>
    </section>}
    {stage === 'reading' && selected.length === 3 && <section className="oracle-reading">
      <p className="oracle-eyebrow">THREE LIGHTS · ONE CONSTELLATION</p>
      <h1 ref={heading} tabIndex="-1">{reading?.title || 'Your question, reflected.'}</h1><p className="oracle-held">{intention}</p>
      <div className="oracle-three-cards">{selected.map((card, i) => <article key={card.numeral} style={{ '--house-light': card.house[0].color }}><p className="oracle-eyebrow">{positions[i]}</p><div className="oracle-revealed"><span>{card.numeral}</span><div className="oracle-reading-marks">{card.house.map((house) => <img key={house.name} src={house.mark} alt={`House of ${house.name}`} />)}</div><h2>{card.name}</h2><p>{card.house.length === 4 ? 'All four Houses' : `House of ${card.house[0].name}`}</p></div><details><summary>Explore this card’s meaning</summary><p>{card.message}</p><p>{card.reflection}</p><p>{card.invitation}</p></details></article>)}</div>
      <div aria-live="polite">{isReading && <div><div className="oracle-orb" aria-hidden="true">✦</div><p>Weaving your question through the three cards…</p></div>}{readingError && <p className="oracle-held" role="alert">{readingError}</p>}</div>
      {reading && <><div className="oracle-woven"><p className="oracle-eyebrow">THE THREAD BETWEEN THE CARDS</p><p>{reading.reading}</p><p className="oracle-eyebrow">A SMALL INVITATION</p><p>{reading.invitation}</p></div><div className="oracle-question"><p className="oracle-eyebrow">A QUESTION TO CARRY</p><p>{reading.reflection}</p></div><p className="oracle-small">An AI-generated reflection grounded in the Cyan Dream deck. Take what resonates; leave room for your own knowing.</p></>}
      {readingError && <button className="oracle-enter" onClick={interpret}>Try the interpretation again</button>}
      {!isReading && <div><button className="oracle-text-button" onClick={reset}>Begin another reflection</button></div>}
    </section>}
    <section className="oracle-houses"><p className="oracle-eyebrow">FOUR HOUSES · ONE TURNING SKY</p><h2>Every light belongs to a greater cycle.</h2><div className="oracle-house-list">{houses.map((house, index) => <details key={house.name} style={{ '--house-light': house.color }}><summary><div className="oracle-house-art" style={{ backgroundImage: `url(${housesImage})`, backgroundPosition: `${index * 100 / 3}% center` }} /><span>House of {house.name}</span><em>{house.word}</em><small>Explore the Core cards +</small></summary><p>{house.question}</p><ul>{cards.filter((card) => card.house.length === 1 && card.house.includes(house)).map((card) => <li key={card.numeral}>{card.numeral} · {card.name}</li>)}</ul></details>)}</div><p className="oracle-small">Origin and Cyan Dream unite all four Houses. The 22 Core cards form this first experience.</p></section>
    <footer className="oracle-ending">Dream · Become · Illuminate · Reflect<br /><a href="/#top">Cyan Dream Creations</a></footer>
  </main>
}
