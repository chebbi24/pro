import { useEffect, useRef, useState, type FormEvent } from 'react'
import { story, type Chapter } from './content/story'
import { media, type PhotoKey } from './content/media'
import { GameStage, type GameMode } from './game/GameStage'

type Scene = 'entry'|'encounter'|'dialogue'|'access'|'reveal'|'drive'|'journey'|'rooftop'|'letter'|'gift'|'finale'
const KEY='gotham-birthday-progress-v1'

function App(){
  const saved=(()=>{try{return JSON.parse(localStorage.getItem(KEY)||'{}')}catch{return {}}})()
  const [scene,setScene]=useState<Scene>(saved.scene||'entry')
  const [dialogue,setDialogue]=useState(0)
  const [noCount,setNoCount]=useState(0)
  const [name,setName]=useState('')
  const [attempts,setAttempts]=useState(0)
  const [feedback,setFeedback]=useState('')
  const [chapter,setChapter]=useState(saved.chapter||0)
  const [hearts,setHearts]=useState<string[]>(saved.hearts||[])
  const [muted,setMuted]=useState(saved.muted||false)
  const [giftOpen,setGiftOpen]=useState(false)
  const [giftClaimed,setGiftClaimed]=useState(false)
  const [continued,setContinued]=useState(false)
  const [settings,setSettings]=useState(false)
  const audio=useRef<HTMLAudioElement|null>(null)
  const current=story.chapters[chapter]

  useEffect(()=>{ localStorage.setItem(KEY,JSON.stringify({scene,chapter,hearts,muted})) },[scene,chapter,hearts,muted])
  useEffect(()=>{ const a=new Audio(media.audio.theme); a.loop=true;a.volume=.32;audio.current=a; return()=>a.pause() },[])
  useEffect(()=>{ if(audio.current) audio.current.muted=muted },[muted])

  const enter=async()=>{setScene('encounter');if(!muted)try{await audio.current?.play()}catch{}}
  const verify=(e:FormEvent)=>{e.preventDefault();const v=name.trim().toLowerCase();if(story.access.acceptedNames.includes(v)){setFeedback(story.access.success);setTimeout(()=>setScene('reveal'),500)}else{const n=attempts+1;setAttempts(n);setFeedback(story.access.wrong[Math.min(n-1,2)])}}
  const collect=(c:Chapter)=>{if(c.heartId&&!hearts.includes(c.heartId))setHearts([...hearts,c.heartId])}
  const nextChapter=()=>{collect(current);if(chapter<story.chapters.length-1)setChapter(chapter+1);else setScene('rooftop')}
  const reset=()=>{localStorage.removeItem(KEY);setScene('entry');setChapter(0);setHearts([]);setDialogue(0);setNoCount(0);setAttempts(0);setFeedback('');setGiftOpen(false);setGiftClaimed(false);setContinued(false)}

  let mode:GameMode|null=null
  if(['encounter','dialogue','access'].includes(scene))mode='encounter'
  if(scene==='reveal')mode='reveal'
  if(scene==='drive')mode='drive'
  if(scene==='rooftop')mode='rooftop'
  if(scene==='finale')mode='finale'

  return <main className="app">
    <div className="global-actions">
      <button className="icon-btn" onClick={()=>setMuted(!muted)} aria-label={muted?'Unmute':'Mute'}>{muted?'🔇':'🔊'}</button>
      <button className="icon-btn" onClick={()=>setSettings(!settings)} aria-label="Settings">⚙</button>
    </div>
    {settings&&<aside className="settings"><b>SETTINGS</b><p>Progress is stored only in this browser.</p><button className="secondary-btn" onClick={reset}>Reset progress</button></aside>}

    {scene==='entry'&&<section className="entry scene-fade">
      <div className="frequency-line"/><p className="eyebrow">{story.entry.eyebrow}</p><h1>{story.entry.title}</h1><p className="muted">{story.entry.note}</p>
      <button className="primary-btn" onClick={enter}>{story.entry.button}</button>
      <div className="signal">▂ ▆ ▃ █ ▅ ▇</div>
    </section>}

    {mode&&<section className="game-section scene-fade">
      <GameStage mode={mode} onInteract={()=>{setDialogue(0);setScene('dialogue')}} onDriveDone={()=>setScene('journey')}/>
      {scene==='encounter'&&<div className="hint">MOVE TOWARD CATWOMAN · A/D OR ←/→</div>}
      {scene==='dialogue'&&<Dialogue index={dialogue} noCount={noCount} onNext={()=>setDialogue(Math.min(dialogue+1,2))} onYes={()=>setScene('access')} onNo={()=>setNoCount(noCount+1)}/>}
      {scene==='access'&&<section className="terminal">
        <p className="eyebrow">{story.access.system}</p><h2>{story.access.title}</h2>
        <form onSubmit={verify}><label htmlFor="secret">{story.access.question}</label><input id="secret" value={name} onChange={e=>setName(e.target.value)} autoFocus/><button className="primary-btn">VERIFY</button></form>
        {feedback&&<p className={feedback===story.access.success?'ok':'bad'}>{feedback}</p>}
      </section>}
      {scene==='reveal'&&<section className="dialogue-box"><p className="eyebrow">BATMAN</p><p>{story.reveal.line}</p><p className="muted">{story.reveal.next}</p><button className="primary-btn" onClick={()=>setScene('drive')}>GET IN THE CAR</button></section>}
      {scene==='drive'&&<div className="destination">{story.drive.destination}</div>}
      {scene==='rooftop'&&<section className="dialogue-box centered"><p>{story.rooftop.line}</p><button className="primary-btn" onClick={()=>setScene('letter')} disabled={hearts.length<5}>{hearts.length===5?'OPEN THE FINAL MESSAGE':'RECOVER ALL HEARTS ('+hearts.length+'/5)'}</button></section>}
      {scene==='finale'&&<Finale continued={continued} onContinue={()=>setContinued(true)} onReplay={reset}/>}
    </section>}

    {scene==='journey'&&<Journey c={current} index={chapter} hearts={hearts} onCollect={()=>collect(current)} onNext={nextChapter}/>}

    {scene==='letter'&&<section className="letter scene-fade">
      <div className="final-photo"><img src={media.photos.finalPhoto} alt="Final couple memory"/><span/></div>
      <div><p className="eyebrow">FINAL MEMORY</p><h1>{story.birthday.title}</h1><p className="letter-text">{story.birthday.message}</p><button className="primary-btn" onClick={()=>setScene('gift')}>ONE MORE THING</button></div>
    </section>}

    {scene==='gift'&&<section className="gift scene-fade"><p className="eyebrow">{story.gift.intro}</p>
      {!giftOpen?<button className="crate" onClick={()=>setGiftOpen(true)}><b>?</b><small>OPEN</small></button>:
      <div className="gift-card"><p className="eyebrow">{story.gift.acquired}</p><h1>{story.gift.title}</h1><p>RARITY · {story.gift.rarity}</p><p>PLAYER · {story.gift.player}</p><p>COMPANION · {story.gift.companion}</p>
        {!giftClaimed?<button className="primary-btn" onClick={()=>setGiftClaimed(true)}>CLAIM YOUR SURPRISE</button>:<div className="claim"><p>{story.gift.reveal}</p><button className="primary-btn" onClick={()=>setScene('finale')}>FINISH THE LEVEL</button></div>}
      </div>}
    </section>}
  </main>
}

function Dialogue({index,noCount,onNext,onYes,onNo}:{index:number,noCount:number,onNext:()=>void,onYes:()=>void,onNo:()=>void}){
  const l=story.encounter.lines[index]
  return <section className="dialogue-box"><p className="eyebrow">{l.speaker}</p><p>{l.text}</p>
    {index<2?<button className="secondary-btn" onClick={onNext}>NEXT →</button>:<div className="choices"><button className="primary-btn" onClick={onYes}>YES ❤️</button><button className="secondary-btn" onClick={onNo}>NO 🙄</button></div>}
    {noCount>0&&<p className="bad">{story.encounter.no[Math.min(noCount-1,2)]}</p>}
  </section>
}

function Journey({c,index,hearts,onCollect,onNext}:{c:Chapter,index:number,hearts:string[],onCollect:()=>void,onNext:()=>void}){
  const imgs=c.images.map(k=>media.photos[k as PhotoKey])
  const got=!c.heartId||hearts.includes(c.heartId)
  return <section className="journey scene-fade">
    <header><div><p className="eyebrow">HER LIFE // CHAPTER {String(index+1).padStart(2,'0')}</p><h1>{c.title}</h1><p className="muted">{c.subtitle}</p></div><div className="heart-count">♥ {hearts.length}/5</div></header>
    <Route active={index} total={story.chapters.length}/>
    {c.id==='before-us'&&<Split/>}
    <Memory c={c} imgs={imgs}/>
    <div className="story-copy"><b>{c.year}</b><p>{c.body}</p>{c.quote&&<blockquote>“{c.quote}”</blockquote>}</div>
    <div className="journey-actions">{c.heartId&&!got&&<button className="heart-btn" onClick={onCollect}>♥ RECOVER MEMORY FRAGMENT</button>}{c.heartId&&got&&<span className="acquired">♥ MEMORY FRAGMENT ACQUIRED</span>}<button className="primary-btn" onClick={onNext}>{index===story.chapters.length-1?'TO THE ROOFTOP':'NEXT STOP →'}</button></div>
  </section>
}

function Route({active,total}:{active:number,total:number}){
  return <div className="route"><div className="route-line"/>{Array.from({length:total}).map((_,i)=><span key={i} className={i<=active?'node active':'node'} style={{left:(4+i*92/(total-1))+'%',top:(48+Math.sin(i*1.7)*25)+'%'}}/>)}<b style={{left:(3+active*90/(total-1))+'%'}}>▰</b></div>
}

function Memory({c,imgs}:{c:Chapter,imgs:string[]}){
  if(c.style==='film')return <div className="film">{imgs.map((s,i)=><figure key={s}><img src={s} alt={c.title+' memory '+(i+1)}/><figcaption>FRAME 0{i+1}</figcaption></figure>)}</div>
  if(c.style==='evidence')return <div className="evidence">{imgs.map((s,i)=><figure key={s} className={'ev ev'+i}><i/><img src={s} alt={c.title+' memory '+(i+1)}/><figcaption>CASE NOTE / {c.year}</figcaption></figure>)}</div>
  return <div className="desk">{imgs.map((s,i)=><figure key={s} className={'polaroid p'+i}><i/><img src={s} alt={c.title+' memory '+(i+1)}/><figcaption>{c.title} / {c.year}</figcaption></figure>)}</div>
}

function Split(){
  return <div className="split"><p>{story.splitPath.lead}</p><div><section>🐈<b>{story.splitPath.left}</b><small>● · ● · ● · ●</small></section><strong>♥<small>{story.splitPath.date}</small></strong><section>🦇<b>{story.splitPath.right}</b><small>● · ● · ● · ●</small></section></div><h3>{story.splitPath.convergence}</h3></div>
}

function Finale({continued,onContinue,onReplay}:{continued:boolean,onContinue:()=>void,onReplay:()=>void}){
  return <section className="finale"><div className="big-heart">♥</div>{story.finale.lines.map(x=><h2 key={x}>{x}</h2>)}<div className="credits">{story.finale.credits.map(x=><p key={x}>{x}</p>)}</div>{!continued?<><p className="eyebrow">{story.finale.continueQuestion}</p><button className="primary-btn" onClick={onContinue}>YES</button></>:<><p>{story.finale.continueAnswer}</p><button className="secondary-btn" onClick={onReplay}>Replay journey</button></>}</section>
}

export default App
