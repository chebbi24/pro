import { useEffect, useMemo, useState } from 'react'
import { lifeLevels } from '../content/lifeLevels'

type Props = {
  levelIndex: number
  onComplete: () => void
}

type Actor = 'baby'|'mum'|'dad'|'brother'|'sister'|'catwoman'|'batman'
type Mood = 'warm'|'quiet'|'message'|'bright'|'family'
type Shot = 'wide'|'close-left'|'close-right'|'center'|'family'

type Beat = {
  speaker: string
  text: string
  mood: Mood
  shot: Shot
  actors: Actor[]
  focus?: Actor
  kicker?: string
  cue?: string
}

const sequences: Record<string, Beat[]> = {
  baby: [
    {
      speaker: 'NARRATOR',
      text: '25 September 1999. Mutuelleville, Tunis.',
      mood: 'warm',
      shot: 'wide',
      actors: ['mum','dad'],
      kicker: 'THE BEGINNING',
      cue: 'A quiet morning. A brand-new chapter.',
    },
    {
      speaker: 'SYSTEM',
      text: 'NEW PLAYER DETECTED.',
      mood: 'bright',
      shot: 'center',
      actors: ['mum','dad','baby'],
      focus: 'baby',
      kicker: 'PLAYER ONE HAS ARRIVED',
      cue: 'Health: perfect · Potential: suspiciously high',
    },
    {
      speaker: 'DAD',
      text: 'She looks suspiciously smart.',
      mood: 'family',
      shot: 'close-left',
      actors: ['dad','baby'],
      focus: 'dad',
      cue: 'First assessment: entirely objective.',
    },
    {
      speaker: 'MUM',
      text: 'Obviously a genius.',
      mood: 'family',
      shot: 'close-right',
      actors: ['mum','baby'],
      focus: 'mum',
      cue: 'Assessment confirmed immediately.',
    },
    {
      speaker: 'NARRATOR',
      text: 'Her older brother and sister had officially received a new little sister.',
      mood: 'family',
      shot: 'family',
      actors: ['brother','sister','baby'],
      focus: 'baby',
      cue: 'Difficulty level: unknown.',
    },
    {
      speaker: 'NARRATOR',
      text: 'Nobody knew about the trophies, the countries, Paris, Batman, or everything still waiting ahead.',
      mood: 'warm',
      shot: 'family',
      actors: ['mum','dad','brother','sister','baby'],
      focus: 'baby',
      kicker: 'THE STORY HAD STARTED',
      cue: 'Next chapter: rhythm.',
    },
  ],
  'birthday-reunion': [
    {
      speaker: 'NARRATOR',
      text: 'Paris. 25 September 2025. Her birthday.',
      mood: 'quiet',
      shot: 'wide',
      actors: ['catwoman'],
      focus: 'catwoman',
      kicker: 'LATE NIGHT · PARIS',
      cue: 'One ordinary birthday evening.',
    },
    {
      speaker: 'NARRATOR',
      text: 'The city was quiet. The day was almost over. Everything felt normal.',
      mood: 'quiet',
      shot: 'close-right',
      actors: ['catwoman'],
      focus: 'catwoman',
      cue: 'Almost.',
    },
    {
      speaker: 'PHONE',
      text: '1 NEW MESSAGE',
      mood: 'message',
      shot: 'center',
      actors: ['catwoman'],
      focus: 'catwoman',
      kicker: 'INCOMING',
      cue: 'Unknown emotional consequences.',
    },
    {
      speaker: 'BATMAN',
      text: 'Happy birthday.',
      mood: 'bright',
      shot: 'close-left',
      actors: ['catwoman','batman'],
      focus: 'batman',
      cue: 'Sender identified.',
    },
    {
      speaker: 'NARRATOR',
      text: 'A message from someone she had definitely, completely, absolutely forgotten about.',
      mood: 'bright',
      shot: 'wide',
      actors: ['catwoman','batman'],
      focus: 'catwoman',
      cue: 'Narrator credibility: questionable.',
    },
    {
      speaker: 'SYSTEM',
      text: 'OLD CONNECTION DETECTED. REOPENING STORY...',
      mood: 'message',
      shot: 'center',
      actors: ['catwoman','batman'],
      focus: 'catwoman',
      kicker: 'CONNECTION RESTORED',
      cue: 'Round two initializing.',
    },
    {
      speaker: 'NARRATOR',
      text: 'And somehow, without asking permission, the whole world became brighter again.',
      mood: 'bright',
      shot: 'wide',
      actors: ['catwoman','batman'],
      kicker: 'TO BE CONTINUED',
      cue: 'December 2025 · Paris',
    },
  ],
}

const displayNames: Record<Actor,string> = {
  baby:'BABY',
  mum:'MUM',
  dad:'DAD',
  brother:'BROTHER',
  sister:'SISTER',
  catwoman:'CATWOMAN',
  batman:'BATMAN',
}

export function LifeCinematicStage({ levelIndex, onComplete }: Props) {
  const level=lifeLevels[levelIndex]
  const beats=sequences[level.id] || []
  const [step,setStep]=useState(0)
  const [visible,setVisible]=useState(true)
  const [typed,setTyped]=useState('')
  const beat=beats[Math.min(step,beats.length-1)]

  useEffect(()=>{
    setStep(0)
    setVisible(true)
  },[levelIndex])

  useEffect(()=>{
    if(!beat) return
    setTyped('')
    let i=0
    const interval=window.setInterval(()=>{
      i+=1
      setTyped(beat.text.slice(0,i))
      if(i>=beat.text.length) window.clearInterval(interval)
    },18)
    return()=>window.clearInterval(interval)
  },[beat])

  const progress=useMemo(()=>((step+1)/Math.max(1,beats.length))*100,[step,beats.length])

  const next=()=>{
    if(typed.length<beat.text.length){
      setTyped(beat.text)
      return
    }
    if(step>=beats.length-1){
      setVisible(false)
      window.setTimeout(onComplete,320)
      return
    }
    setVisible(false)
    window.setTimeout(()=>{
      setStep(s=>s+1)
      setVisible(true)
    },180)
  }

  if(!beat) return null

  return <section className={'cinematic-pro '+level.id+' mood-'+beat.mood+' shot-'+beat.shot+' '+(visible?'is-visible':'is-changing')}>
    <div className="cinematic-shell">
      <div className="cinematic-topbar">
        <span>ACT II · CHAPTER {String(level.order).padStart(2,'0')}</span>
        <b>{level.worldLabel}</b>
        <span>{String(step+1).padStart(2,'0')} / {String(beats.length).padStart(2,'0')}</span>
      </div>

      <div className="cinematic-stage">
        <div className="cinematic-bg" style={{backgroundImage:`url("${level.backgroundUrl}")`}}/>
        <div className="cinematic-depth"/>
        <div className="cinematic-grain"/>
        <div className="cinematic-light"/>
        <div className="cinematic-kicker">
          {beat.kicker&&<strong>{beat.kicker}</strong>}
          {beat.cue&&<span>{beat.cue}</span>}
        </div>

        <div className="cinematic-actors">
          {beat.actors.map((actor,i)=>
            <Character
              key={actor+i}
              kind={actor}
              index={i}
              total={beat.actors.length}
              active={!beat.focus||beat.focus===actor}
              shot={beat.shot}
            />
          )}
        </div>

        {level.id==='birthday-reunion'&&step>=2&&step<=5&&
          <div className={'cinematic-phone '+(step===2?'is-alert':'is-open')}>
            <div className="phone-notch"/>
            <span>{step===2?'1':'♥'}</span>
            <small>{step===2?'NEW MESSAGE':'RAYAN'}</small>
          </div>}

        {level.id==='baby'&&step===1&&
          <div className="cinematic-badge">
            <span>PLAYER 01</span>
            <strong>NEW GAME+</strong>
          </div>}

        <div className="cinematic-credit">{level.backgroundCredit}</div>
      </div>

      <div className="cinematic-console-divider">
        <i/><span>STORY MODE</span><i/>
      </div>

      <div className="cinematic-dialogue-panel">
        <div className="portrait-card">
          <Portrait kind={(beat.focus||beat.actors[0]) as Actor}/>
          <span>{displayNames[(beat.focus||beat.actors[0]) as Actor]}</span>
        </div>

        <div className="dialogue-card">
          <div className="dialogue-meta">
            <span>{beat.speaker}</span>
            <span>{level.year}</span>
          </div>
          <p>{typed}<span className="type-cursor">▌</span></p>
          <div className="dialogue-footer">
            <div className="scene-progress"><span style={{width:progress+'%'}}/></div>
            <small>{beat.cue}</small>
          </div>
        </div>

        <button className="cinematic-next" onClick={next} aria-label={step===beats.length-1?'Continue story':'Next dialogue'}>
          <span>{step===beats.length-1?'CONTINUE':'NEXT'}</span>
          <b>›</b>
        </button>
      </div>
    </div>
  </section>
}

function Character({kind,index,total,active,shot}:{kind:Actor;index:number;total:number;active:boolean;shot:Shot}){
  let left=50
  if(total===2) left=index===0?35:65
  else if(total===3) left=[28,50,72][index]
  else if(total===4) left=[20,40,60,80][index]
  else if(total>=5) left=14+(index*(72/Math.max(1,total-1)))

  if(shot==='close-left'&&index===0) left=34
  if(shot==='close-right'&&index===0) left=66

  return <div className={'cinematic-character '+kind+' '+(active?'active':'muted')} style={{left:left+'%'}}>
    <div className="character-shadow"/>
    <div className="character-legs"/>
    <div className="character-body"/>
    <div className="character-neck"/>
    <div className="character-head"/>
    <div className="character-hair"/>
    <div className="character-face"><i/><i/><b/></div>
    <div className="character-costume"/>
    <div className="character-accent"/>
    <label>{displayNames[kind]}</label>
  </div>
}

function Portrait({kind}:{kind:Actor}){
  return <div className={'cinematic-portrait '+kind}>
    <div className="portrait-hair"/>
    <div className="portrait-head"/>
    <div className="portrait-face"><i/><i/><b/></div>
    <div className="portrait-body"/>
    <div className="portrait-detail"/>
  </div>
}
