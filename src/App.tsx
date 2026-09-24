import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import { story } from './content/story'
import { lifeLevels, type LifeMemory } from './content/lifeLevels'
import { media } from './content/media'
import { GameStage, type GameMode } from './game/GameStage'
import { LifeJourneyStage, MemoryOverlay } from './game/LifeJourneyStage'
import { LifeCinematicStage } from './game/LifeCinematicStage'

type Scene = 'entry'|'encounter'|'dialogue'|'access'|'reveal'|'drive'|'act2intro'|'journey'|'rooftop'|'letter'|'gift'|'finale'
const KEY='gotham-birthday-progress-v3'
const BUILD='2026-09-24-travel-memories-v13'

function App(){
  const saved=(()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}})()
  const [scene,setScene]=useState<Scene>(saved.scene||'entry')
  const [dialogue,setDialogue]=useState(0)
  const [noCount,setNoCount]=useState(0)
  const [name,setName]=useState('')
  const [attempts,setAttempts]=useState(0)
  const [feedback,setFeedback]=useState('')
  const [lifeLevel,setLifeLevel]=useState<number>(saved.lifeLevel||0)
  const [activeMemory,setActiveMemory]=useState<LifeMemory|null>(null)
  const [showLevelIntro,setShowLevelIntro]=useState(false)
  const [muted,setMuted]=useState(saved.muted||false)
  const [giftOpen,setGiftOpen]=useState(false)
  const [giftClaimed,setGiftClaimed]=useState(false)
  const [continued,setContinued]=useState(false)
  const [settings,setSettings]=useState(false)
  const audio=useRef<HTMLAudioElement|null>(null)

  useEffect(()=>{ localStorage.setItem(KEY,JSON.stringify({scene,lifeLevel,muted})) },[scene,lifeLevel,muted])
  useEffect(()=>{ const a=new Audio(media.audio.theme); a.loop=true;a.volume=.32;audio.current=a; return()=>a.pause() },[])
  useEffect(()=>{ if(audio.current) audio.current.muted=muted },[muted])

  const enter=async()=>{setScene('encounter');if(!muted)try{await audio.current?.play()}catch{}}
  const verify=(e:FormEvent)=>{
    e.preventDefault()
    const v=name.trim().toLowerCase()
    if(story.access.acceptedNames.includes(v)){
      setFeedback(story.access.success)
      setTimeout(()=>setScene('reveal'),500)
    }else{
      const n=attempts+1
      setAttempts(n)
      setFeedback(story.access.wrong[Math.min(n-1,2)])
    }
  }

  const completeLifeLevel=useCallback(()=>{
    setActiveMemory(null)
    if(lifeLevel<lifeLevels.length-1){
      setLifeLevel(current=>current+1)
      setShowLevelIntro(true)
    }else{
      setScene('rooftop')
    }
  },[lifeLevel])

  const beginEncounter=useCallback(()=>{
    setDialogue(0)
    setScene('dialogue')
  },[])

  const finishDrive=useCallback(()=>{
    setScene('act2intro')
  },[])

  const jumpTo=(target:Scene, level?:number)=>{
    setActiveMemory(null)
    setShowLevelIntro(false)
    if(typeof level==='number') setLifeLevel(Math.max(0,Math.min(level,lifeLevels.length-1)))
    if(target==='gift'){setGiftOpen(true);setGiftClaimed(false)}
    if(target==='finale'){setContinued(false)}
    setScene(target)
    setSettings(false)
  }

  const reset=()=>{
    localStorage.removeItem(KEY)
    setScene('entry')
    setLifeLevel(0)
    setDialogue(0)
    setNoCount(0)
    setAttempts(0)
    setFeedback('')
    setActiveMemory(null)
    setShowLevelIntro(false)
    setGiftOpen(false)
    setGiftClaimed(false)
    setContinued(false)
  }

  let mode:GameMode|null=null
  if(['encounter','dialogue','access'].includes(scene))mode='encounter'
  if(scene==='reveal')mode='reveal'
  if(scene==='drive')mode='drive'
  if(scene==='rooftop')mode='rooftop'
  if(scene==='finale')mode='finale'

  return <main className="app">
    <div className="build-ribbon">RPG BUILD V13</div>
    <div className="global-actions">
      <button className="icon-btn" onClick={()=>setMuted(!muted)} aria-label={muted?'Unmute':'Mute'}>{muted?'🔇':'🔊'}</button>
      <button className="icon-btn" onClick={()=>setSettings(!settings)} aria-label="Settings">⚙</button>
    </div>

    {settings&&<aside className="settings test-settings">
      <b>SETTINGS</b>
      <p>Progress is stored only in this browser.</p>
      <p className="build-version">BUILD · {BUILD}</p>
      <div className="test-nav">
        <span>TEST NAVIGATION</span>
        <div className="test-nav-grid">
          <button onClick={reset}>Restart game</button>
          <button onClick={()=>jumpTo('finale')}>Go to end</button>
          <button onClick={()=>jumpTo('encounter')}>Gotham</button>
          <button onClick={()=>jumpTo('access')}>Secret access</button>
          <button onClick={()=>jumpTo('act2intro')}>Act II intro</button>
          <button onClick={()=>jumpTo('rooftop')}>Rooftop</button>
          <button onClick={()=>jumpTo('letter')}>Birthday letter</button>
          <button onClick={()=>jumpTo('gift')}>Gift reveal</button>
        </div>
        <label htmlFor="test-level">Jump to Act II chapter</label>
        <select id="test-level" value={lifeLevel} onChange={e=>jumpTo('journey',Number(e.target.value))}>
          {lifeLevels.map((level,i)=><option key={level.id} value={i}>{String(i+1).padStart(2,'0')} · {level.title}</option>)}
        </select>
        <div className="test-level-controls">
          <button disabled={lifeLevel===0} onClick={()=>jumpTo('journey',lifeLevel-1)}>← Previous</button>
          <button onClick={()=>jumpTo('journey',lifeLevel)}>Replay current</button>
          <button disabled={lifeLevel===lifeLevels.length-1} onClick={()=>jumpTo('journey',lifeLevel+1)}>Next →</button>
        </div>
      </div>
    </aside>}

    {scene==='entry'&&<section className="entry scene-fade">
      <div className="frequency-line"/>
      <p className="eyebrow">{story.entry.eyebrow}</p>
      <h1>{story.entry.title}</h1>
      <p className="muted">{story.entry.note}</p>
      <button className="primary-btn" onClick={enter}>{story.entry.button}</button>
      <div className="signal">▂ ▆ ▃ █ ▅ ▇</div>
    </section>}

    {mode&&<section className="game-section scene-fade">
      <GameStage
        mode={mode}
        frozen={scene!=='encounter' && mode==='encounter'}
        onInteract={beginEncounter}
        onDriveDone={finishDrive}
      />
      {scene==='encounter'&&<div className="hint">YOU ARE CATWOMAN · WALK RIGHT · A/D OR ←/→</div>}
      {scene==='dialogue'&&<Dialogue
        index={dialogue}
        noCount={noCount}
        onNext={()=>setDialogue(Math.min(dialogue+1,2))}
        onYes={()=>setScene('access')}
        onNo={()=>setNoCount(noCount+1)}
      />}
      {scene==='access'&&<section className="terminal">
        <div className="terminal-topbar">
          <div><span className="terminal-dot red"/><span className="terminal-dot amber"/><span className="terminal-dot green"/></div>
          <span>WAYNE SECURE TERMINAL // NODE 01</span>
          <span className="terminal-status">ENCRYPTED</span>
        </div>
        <div className="terminal-brand">
          <div className="wayne-mark">W</div>
          <div><p className="eyebrow">{story.access.system}</p><h2>{story.access.title}</h2></div>
        </div>
        <div className="terminal-readout">
          <span>ACCESS CHANNEL</span><b>GOTHAM-PRIVATE</b>
          <span>AUTH LEVEL</span><b>ALPHA</b>
          <span>SESSION</span><b>ACTIVE</b>
        </div>
        <form onSubmit={verify}>
          <label htmlFor="secret">{story.access.question}</label>
          <div className="terminal-input-row">
            <span>&gt;</span>
            <input id="secret" value={name} onChange={e=>setName(e.target.value)} autoFocus autoComplete="off"/>
            <button className="primary-btn">VERIFY</button>
          </div>
        </form>
        {feedback&&<p className={feedback===story.access.success?'ok terminal-feedback':'bad terminal-feedback'}>{feedback}</p>}
        <div className="terminal-footer">WAYNE ENTERPRISES // SECURE SYSTEMS DIVISION // 01:17:42</div>
      </section>}
      {scene==='reveal'&&<section className="dialogue-box">
        <p className="eyebrow">BATMAN</p>
        <p>{story.reveal.line}</p>
        <p className="muted">{story.reveal.next}</p>
        <button className="primary-btn" onClick={()=>setScene('drive')}>GET IN THE CAR</button>
      </section>}
      {scene==='drive'&&<div className="destination">{story.drive.destination}</div>}
      {scene==='rooftop'&&<section className="dialogue-box centered">
        <p>{story.rooftop.line}</p>
        <button className="primary-btn" onClick={()=>setScene('letter')}>OPEN THE FINAL MESSAGE</button>
      </section>}
      {scene==='finale'&&<Finale continued={continued} onContinue={()=>setContinued(true)} onReplay={reset}/>}
    </section>}

    {scene==='act2intro'&&<section className="act2-prologue scene-fade">
      <div className="act2-prologue-card">
        <p className="eyebrow">ACT II // HER STORY</p>
        <div className="prologue-date">25 // 09 // 1999</div>
        <h1>On this day, a legend was born.</h1>
        <p>Long before Gotham, before trophies, before Paris, before us — the story begins in Tunis.</p>
        <p className="muted">One life. Twelve chapters. Every chapter changes the world around her.</p>
        <div className="prologue-line"><span/>MUTUELLEVILLE · TUNIS<span/></div>
        <button className="primary-btn" onClick={()=>{setLifeLevel(0);setShowLevelIntro(false);setScene('journey')}}>BEGIN HER STORY</button>
      </div>
    </section>}

    {scene==='journey'&&<section className="life-act scene-fade">
      {lifeLevels[lifeLevel].mode==='cinematic'
        ?<LifeCinematicStage key={lifeLevel} levelIndex={lifeLevel} onComplete={completeLifeLevel}/>
        :<LifeJourneyStage
          key={lifeLevel}
          levelIndex={lifeLevel}
          onLevelComplete={completeLifeLevel}
          onMemoryOpen={setActiveMemory}
          paused={Boolean(activeMemory)||showLevelIntro}
        />}
      {showLevelIntro&&<LevelIntro levelIndex={lifeLevel} onStart={()=>setShowLevelIntro(false)}/>}
      {activeMemory&&<MemoryOverlay memory={activeMemory} onClose={()=>setActiveMemory(null)}/>}
    </section>}

    {scene==='letter'&&<section className="letter scene-fade">
      <div className="final-photo"><img src={media.photos.finalPhoto} alt="Final couple memory"/><span/></div>
      <div>
        <p className="eyebrow">FINAL MEMORY</p>
        <h1>{story.birthday.title}</h1>
        <p className="letter-text">{story.birthday.message}</p>
        <button className="primary-btn" onClick={()=>setScene('gift')}>ONE MORE THING</button>
      </div>
    </section>}

    {scene==='gift'&&<section className="gift scene-fade">
      <p className="eyebrow">{story.gift.intro}</p>
      {!giftOpen?<button className="crate" onClick={()=>setGiftOpen(true)}><b>?</b><small>OPEN</small></button>:
      <div className="gift-card">
        <p className="eyebrow">{story.gift.acquired}</p>
        <h1>{story.gift.title}</h1>
        <p>RARITY · {story.gift.rarity}</p>
        <p>PLAYER · {story.gift.player}</p>
        <p>COMPANION · {story.gift.companion}</p>
        {!giftClaimed
          ?<button className="primary-btn" onClick={()=>setGiftClaimed(true)}>CLAIM YOUR SURPRISE</button>
          :<div className="claim"><p>{story.gift.reveal}</p><button className="primary-btn" onClick={()=>setScene('finale')}>FINISH THE LEVEL</button></div>}
      </div>}
    </section>}
  </main>
}

function LevelIntro({levelIndex,onStart}:{levelIndex:number,onStart:()=>void}){
  const level=lifeLevels[levelIndex]
  return <div className="level-intro-overlay">
    <div className="level-intro-card">
      <p className="eyebrow">CHAPTER {String(levelIndex+1).padStart(2,'0')} / {String(lifeLevels.length).padStart(2,'0')}</p>
      <span className="level-intro-year">{level.year}</span>
      <h2>{level.title}</h2>
      <p>{level.subtitle}</p>
      <div className="level-intro-location">{level.worldLabel}</div>
      <button className="primary-btn" onClick={onStart}>{levelIndex===0?'ENTER LEVEL':'CONTINUE STORY'}</button>
    </div>
  </div>
}

function Dialogue({index,noCount,onNext,onYes,onNo}:{index:number,noCount:number,onNext:()=>void,onYes:()=>void,onNo:()=>void}){
  const l=story.encounter.lines[index]
  return <section className="dialogue-box">
    <p className="eyebrow">{l.speaker}</p>
    <p>{l.text}</p>
    {index<2
      ?<button className="secondary-btn" onClick={onNext}>NEXT →</button>
      :<div className="choices"><button className="primary-btn" onClick={onYes}>YES</button><button className="secondary-btn" onClick={onNo}>NO</button></div>}
    {noCount>0&&<p className="bad">{story.encounter.no[Math.min(noCount-1,2)]}</p>}
  </section>
}

function Finale({continued,onContinue,onReplay}:{continued:boolean,onContinue:()=>void,onReplay:()=>void}){
  return <section className="finale">
    <div className="big-heart">♥</div>
    {story.finale.lines.map(x=><h2 key={x}>{x}</h2>)}
    <div className="credits">{story.finale.credits.map(x=><p key={x}>{x}</p>)}</div>
    {!continued
      ?<><p className="eyebrow">{story.finale.continueQuestion}</p><button className="primary-btn" onClick={onContinue}>YES</button></>
      :<><p>{story.finale.continueAnswer}</p><button className="secondary-btn" onClick={onReplay}>Replay journey</button></>}
  </section>
}

export default App
