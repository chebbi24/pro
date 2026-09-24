import { useEffect, useMemo, useState } from 'react'
import { lifeLevels } from '../content/lifeLevels'
import { media } from '../content/media'

type Props = {
  levelIndex: number
  onComplete: () => void
}

type Actor = 'baby'|'mum'|'dad'|'brother'|'sister'|'catwoman'|'batman'
type Mood = 'warm'|'quiet'|'message'|'bright'|'family'
type Shot = 'wide'|'close-left'|'close-right'|'center'|'family'
type BabyScene = 'exterior'|'room'|'birth'|'reveal'|'family'|'montage'

type Beat = {
  speaker: string
  text: string
  mood: Mood
  shot: Shot
  actors: Actor[]
  focus?: Actor
  kicker?: string
  cue?: string
  babyScene?: BabyScene
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
      babyScene: 'exterior',
    },
    {
      speaker: 'SYSTEM',
      text: 'Inside, the room is getting ready. Mum is in bed. Dad is trying very hard to look calm.',
      mood: 'bright',
      shot: 'center',
      actors: ['mum','dad','baby'],
      focus: 'baby',
      kicker: 'PLAYER ONE HAS ARRIVED',
      cue: 'The room holds its breath.',
      babyScene: 'room',
    },
    {
      speaker: 'NARRATOR',
      text: 'And then, after one last moment of waiting, she arrives.'
      mood: 'family',
      shot: 'close-left',
      actors: ['dad','baby'],
      focus: 'dad',
      cue: 'And then — light.',
      babyScene: 'birth',
    },
    {
      speaker: 'NARRATOR',
      text: 'Tiny blanket. Tiny hands. Absolutely no idea how much trouble she is going to cause.'
      mood: 'family',
      shot: 'close-right',
      actors: ['mum','baby'],
      focus: 'mum',
      cue: 'Tiny. Loud. Already running the room.',
      babyScene: 'reveal',
    },
    {
      speaker: 'NARRATOR',
      text: 'Mum and Dad finally get their first proper look. Her older brother and sister come in to meet the newest member of the family.'
      mood: 'family',
      shot: 'family',
      actors: ['brother','sister','baby'],
      focus: 'baby',
      cue: 'First family meeting: complete.'
      babyScene: 'family',
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
      babyScene: 'montage',
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
        {level.id==='baby'
          ?<BirthScene scene={beat.babyScene||'exterior'} levelBackground={level.backgroundUrl}/>
          :<>
            <div className="cinematic-bg" style={{backgroundImage:`url("${level.backgroundUrl}")`}}/>
            <div className="cinematic-depth"/>
            <div className="cinematic-grain"/>
            <div className="cinematic-light"/>
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
          </>
        }

        <div className="cinematic-grain"/>
        <div className="cinematic-kicker">
          {beat.kicker&&<strong>{beat.kicker}</strong>}
          {beat.cue&&<span>{beat.cue}</span>}
        </div>

        {level.id==='baby'&&step===1&&
          <div className="cinematic-badge">
            <span>25 · 09 · 1999</span>
            <strong>ARRIVAL IMMINENT</strong>
          </div>}

        <div className="cinematic-credit">{level.id==='baby'&&beat.babyScene!=='exterior'?'2D STORY SCENE':level.backgroundCredit}</div>
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


function BirthScene({scene,levelBackground}:{scene:BabyScene;levelBackground:string}){
  if(scene==='exterior'){
    return <>
      <div className="cinematic-bg birth-exterior-bg" style={{backgroundImage:`url("${levelBackground}")`}}/>
      <div className="birth-exterior-wash"/>
      <div className="birth-location-card">
        <small>TUNIS · 1999</small>
        <strong>MUTUELLEVILLE</strong>
        <span>25 SEPTEMBER</span>
      </div>
    </>
  }

  if(scene==='montage'){
    return <div className="baby-photo-finale">
      <div className="baby-photo-title">
        <small>CHAPTER 01 COMPLETE</small>
        <strong>PLAYER ONE ARRIVES</strong>
      </div>
      <div className="baby-photo-stack">
        <figure className="baby-photo-card card-a">
          <img src={media.photos.herChildhood1} alt="Baby memory one"/>
          <figcaption>25.09.1999</figcaption>
        </figure>
        <figure className="baby-photo-card card-b">
          <img src={media.photos.herChildhood2} alt="Baby memory two"/>
          <figcaption>THE BEGINNING</figcaption>
        </figure>
      </div>
      <div className="baby-next-tease">NEXT · RHYTHM UNLOCKED</div>
    </div>
  }

  return <div className={'birth-room scene-'+scene}>
    <div className="room-wall"/>
    <div className="room-window"><i/><i/><span/></div>
    <div className="room-curtain left"/><div className="room-curtain right"/>
    <div className="room-picture"><span>1999</span></div>
    <div className="room-lamp"><i/><span/></div>
    <div className="room-floor"/>
    <div className="room-bed">
      <div className="bed-frame"/>
      <div className="bed-mattress"/>
      <div className="bed-pillow"/>
      <div className="room-mum">
        <div className="mini-head"/><div className="mini-hair"/><div className="mini-body"/>
      </div>
      <div className="bed-blanket"/>
    </div>
    <div className="room-dad"><div className="mini-head"/><div className="mini-hair"/><div className="mini-body"/></div>
    <div className="room-nurse"><div className="mini-head"/><div className="mini-cap"/><div className="mini-body"/></div>
    <div className="room-monitor"><b>♥</b><span>98</span></div>
    <div className="room-side-table"><i/><span/></div>

    {(scene==='birth'||scene==='reveal'||scene==='family')&&<div className="birth-glow"/>}
    {(scene==='reveal'||scene==='family')&&<div className="baby-bassinet">
      <div className="bassinet-body"/>
      <div className="bassinet-blanket"/>
      <div className="bassinet-baby"><div className="mini-head"/><div className="mini-hair"/></div>
    </div>}

    {scene==='birth'&&<div className="birth-moment-card"><small>11:__</small><strong>A NEW PLAYER ENTERS THE WORLD</strong></div>}

    {scene==='family'&&<div className="family-enter">
      <div className="family-kid brother"><div className="mini-head"/><div className="mini-hair"/><div className="mini-body"/></div>
      <div className="family-kid sister"><div className="mini-head"/><div className="mini-hair"/><div className="mini-body"/></div>
    </div>}
  </div>
}
