import { useEffect, useState } from 'react'
import { lifeLevels } from '../content/lifeLevels'

type Props = {
  levelIndex: number
  onComplete: () => void
}

type Beat = {
  speaker?: string
  text: string
  mood?: 'warm'|'message'|'bright'
  actors: Array<'baby'|'mum'|'dad'|'brother'|'sister'|'catwoman'|'batman'>
}

const sequences: Record<string, Beat[]> = {
  baby: [
    {
      text: '25 September 1999. Mutuelleville, Tunis.',
      actors: ['mum','dad'],
      mood: 'warm',
    },
    {
      speaker: 'SYSTEM',
      text: 'A new player has entered the world.',
      actors: ['mum','dad','baby'],
      mood: 'warm',
    },
    {
      speaker: 'DAD',
      text: 'She looks suspiciously smart.',
      actors: ['dad','baby'],
      mood: 'warm',
    },
    {
      speaker: 'MUM',
      text: 'Obviously a genius.',
      actors: ['mum','baby'],
      mood: 'warm',
    },
    {
      speaker: 'FAMILY',
      text: 'Her older brother and sister have officially been assigned a new little sister. Difficulty level: unknown.',
      actors: ['brother','sister','baby'],
      mood: 'warm',
    },
    {
      speaker: 'NARRATOR',
      text: 'Nobody knew yet about the trophies, the countries, Paris, Batman or everything still waiting ahead. But the story had started.',
      actors: ['mum','dad','brother','sister','baby'],
      mood: 'bright',
    },
  ],
  'birthday-reunion': [
    {
      text: 'Paris. 25 September 2025. Her birthday.',
      actors: ['catwoman'],
      mood: 'message',
    },
    {
      speaker: 'NARRATOR',
      text: 'The day is almost over. Paris is quiet. Everything is normal.',
      actors: ['catwoman'],
      mood: 'message',
    },
    {
      speaker: 'PHONE',
      text: '1 NEW MESSAGE',
      actors: ['catwoman'],
      mood: 'bright',
    },
    {
      speaker: 'BATMAN',
      text: 'Happy birthday.',
      actors: ['catwoman','batman'],
      mood: 'bright',
    },
    {
      speaker: 'NARRATOR',
      text: 'A message from someone she definitely, completely, absolutely forgot about.',
      actors: ['catwoman','batman'],
      mood: 'bright',
    },
    {
      speaker: 'SYSTEM',
      text: 'Old connection detected. Reopening story...',
      actors: ['catwoman','batman'],
      mood: 'bright',
    },
    {
      speaker: 'NARRATOR',
      text: 'And somehow, the world gets brighter again.',
      actors: ['catwoman','batman'],
      mood: 'bright',
    },
  ],
}

export function LifeCinematicStage({ levelIndex, onComplete }: Props) {
  const level=lifeLevels[levelIndex]
  const beats=sequences[level.id] || []
  const [step,setStep]=useState(0)
  const beat=beats[Math.min(step,beats.length-1)]

  useEffect(()=>setStep(0),[levelIndex])

  const next=()=>{
    if(step<beats.length-1) setStep(s=>s+1)
    else onComplete()
  }

  if(!beat) return null

  return <section className={'ds-cinematic mood-'+(beat.mood||'warm')}>
    <div className="ds-top-screen">
      <div className="ds-photo" style={{backgroundImage:`url("${level.backgroundUrl}")`}}/>
      <div className="ds-film-shade"/>
      <div className="ds-screen-hud">
        <span>CHAPTER {String(level.order).padStart(2,'0')}</span>
        <span>{level.worldLabel}</span>
      </div>
      <div className="ds-actors">
        {beat.actors.map((actor,i)=><Avatar key={actor+i} kind={actor} index={i} total={beat.actors.length}/>)}
      </div>
      {level.id==='birthday-reunion'&&step>=2&&<div className="ds-phone-pulse"><span>{step===2?'1':'♥'}</span></div>}
      <div className="ds-credit">{level.backgroundCredit}</div>
    </div>
    <div className="ds-hinge"/>
    <div className="ds-bottom-screen">
      <div className="ds-dialogue">
        <div className="ds-speaker">{beat.speaker||'NARRATOR'}</div>
        <p>{beat.text}</p>
        <div className="ds-progress">{beats.map((_,i)=><i key={i} className={i<=step?'active':''}/>)}</div>
      </div>
      <button className="ds-next" onClick={next}>{step===beats.length-1?'CONTINUE STORY':'NEXT'}</button>
    </div>
  </section>
}

function Avatar({kind,index,total}:{kind:string;index:number;total:number}){
  const left=total===1?50:16+(index*(68/Math.max(1,total-1)))
  return <div className={'ds-avatar '+kind} style={{left:left+'%'}}>
    <div className="av-hair"/>
    <div className="av-head"/>
    <div className="av-body"/>
    <div className="av-detail"/>
    <span>{kind==='mum'?'MUM':kind==='dad'?'DAD':kind==='brother'?'BROTHER':kind==='sister'?'SISTER':kind==='baby'?'BABY':kind==='batman'?'BATMAN':'CATWOMAN'}</span>
  </div>
}
