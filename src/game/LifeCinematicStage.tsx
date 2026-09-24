import { useEffect, useRef, useState } from 'react'
import type * as PhaserNS from 'phaser'
import { lifeLevels } from '../content/lifeLevels'
import { media } from '../content/media'
import { theme } from '../content/theme'

type Props={levelIndex:number;onComplete:()=>void}
type Actor='amouna'|'sami'|'kais'|'rania'|'hamouda'|'batman'|'nurse'
type StoryBeat={
  speaker?:string
  text?:string
  cue?:string
  autoMs?:number
  showDialogue?:boolean
}

const babyBeats:StoryBeat[]=[
  {autoMs:2400,showDialogue:false},
  {autoMs:2600,showDialogue:false},
  {autoMs:2300,showDialogue:false},
  {speaker:'SAMI',text:'She is perfect.',cue:'Player One has arrived.'},
  {autoMs:2300,showDialogue:false},
  {speaker:'KAIS',text:'Look at her... she already knows she runs this family.',cue:'First family meeting: complete.'},
  {showDialogue:false},
]

const messageBeats:StoryBeat[]=[
  {autoMs:2200,showDialogue:false},
  {autoMs:2100,showDialogue:false},
  {speaker:'PHONE',text:'1 NEW MESSAGE',cue:'Unknown emotional consequences.'},
  {speaker:'BATMAN',text:'Happy birthday.',cue:'Sender identified.'},
  {speaker:'AMOUNA',text:'...you really chose today to come back?',cue:'Narrator credibility: questionable.'},
  {speaker:'SYSTEM',text:'OLD CONNECTION DETECTED. REOPENING STORY...',cue:'Round two initializing.'},
  {speaker:'AMOUNA',text:'Fine. One message.',cue:'Next stop: December in Paris.'},
]

export function LifeCinematicStage({levelIndex,onComplete}:Props){
  const level=lifeLevels[levelIndex]
  const beats=level.id==='baby'?babyBeats:messageBeats
  const mountRef=useRef<HTMLDivElement|null>(null)
  const sceneRef=useRef<RPGStoryScene|null>(null)
  const [step,setStep]=useState(0)
  const [typed,setTyped]=useState('')
  const beat=beats[Math.min(step,beats.length-1)]
  const isBabyMontage=level.id==='baby'&&step===beats.length-1

  useEffect(()=>{setStep(0);setTyped('')},[levelIndex])

  useEffect(()=>{
    let game:PhaserNS.Game|null=null
    let cancelled=false
    ;(async()=>{
      const Phaser=await import('phaser')
      if(cancelled||!mountRef.current)return

      class StoryScene extends Phaser.Scene{
        actors=new Map<Actor,PhaserNS.GameObjects.Container>()
        currentStep=0
        constructor(){super('StoryScene')}

        create(){
          sceneRef.current=this as unknown as RPGStoryScene
          this.cameras.main.setBackgroundColor(0x10151f)
          this.cameras.main.fadeIn(300,0,0,0)
          this.playStep(0)
        }

        clearWorld(){
          this.tweens.killAll()
          this.actors.clear()
          this.children.removeAll(true)
        }

        rect(x:number,y:number,w:number,h:number,color:number,stroke?:number,alpha=1){
          const r=this.add.rectangle(x,y,w,h,color,alpha).setOrigin(0)
          if(stroke!==undefined)r.setStrokeStyle(2,stroke)
          return r
        }

        label(x:number,y:number,text:string,accent=0xf3c76b){
          return this.add.text(x,y,text,{fontFamily:'monospace',fontSize:'13px',color:'#f6f1e8',backgroundColor:'#080b13e8',padding:{x:8,y:5}})
            .setDepth(50)
            .setStroke('#000000',2)
            .setData('accent',accent)
        }

        makePerson(kind:Actor,x:number,y:number,scale=1){
          const c=this.add.container(x,y).setScale(scale).setDepth(20)
          const shadow=this.add.ellipse(0,16,26,8,0x000000,.18)

          const cfg={
            sami:{skin:0xd7a17e,hair:0x6f3f2f,body:0xd6b6a3,accent:0xe7d0c2,glasses:false,moustache:false,curly:false},
            kais:{skin:0xd8a67f,hair:0x2d2421,body:0xc9cbd0,accent:0x29384e,glasses:true,moustache:true,curly:false},
            rania:{skin:0xd6a079,hair:0x5b372b,body:0x3a2635,accent:0xc8a05d,glasses:true,moustache:false,curly:false},
            hamouda:{skin:0xc99672,hair:0x30241f,body:0x1d2a43,accent:0x304769,glasses:true,moustache:false,curly:true},
            amouna:{skin:0xe0a47f,hair:0x9f3f30,body:0xf2cfd2,accent:0xede6db,glasses:false,moustache:false,curly:false},
            nurse:{skin:0xd9aa87,hair:0x5b463c,body:0xeaf1f3,accent:0x74a6bd,glasses:false,moustache:false,curly:false},
            batman:{skin:0xd7a17f,hair:0x08090c,body:0x28313e,accent:0xc3a33c,glasses:false,moustache:false,curly:false},
          }[kind]

          const legs=this.add.rectangle(0,10,18,18,0x2a2f37).setOrigin(.5,0)
          const body=this.add.rectangle(0,-4,23,23,cfg.body).setOrigin(.5,.5)
          const neck=this.add.rectangle(0,-18,6,7,cfg.skin)
          const head=this.add.circle(0,-27,10,cfg.skin)
          c.add([shadow,legs,body,neck,head])

          if(kind==='amouna'){
            const backHair=this.add.ellipse(0,-28,24,25,cfg.hair)
            const fringe=this.add.rectangle(0,-34,19,6,cfg.hair)
            c.addAt(backHair,4);c.add(fringe)
          }else if(kind==='sami'){
            const hair=this.add.ellipse(0,-29,23,22,cfg.hair)
            const bobL=this.add.rectangle(-8,-22,6,15,cfg.hair)
            const bobR=this.add.rectangle(8,-22,6,15,cfg.hair)
            c.addAt(hair,4);c.add([bobL,bobR])
          }else if(kind==='kais'){
            const hair=this.add.arc(0,-31,10,180,360,false,cfg.hair)
            c.add(hair)
          }else if(kind==='rania'){
            const hair=this.add.ellipse(0,-28,23,24,cfg.hair)
            const left=this.add.rectangle(-8,-20,5,16,cfg.hair)
            const right=this.add.rectangle(8,-20,5,16,cfg.hair)
            c.addAt(hair,4);c.add([left,right])
          }else if(kind==='hamouda'){
            for(const [cx,cy] of [[-7,-35],[0,-37],[7,-35],[-8,-29],[8,-29]]){
              c.add(this.add.circle(cx,cy,5,cfg.hair))
            }
          }else if(kind==='batman'){
            const cowl=this.add.rectangle(0,-31,22,16,0x08090c)
            const ear1=this.add.triangle(-7,-43,0,10,7,10,4,0,0x08090c)
            const ear2=this.add.triangle(7,-43,0,10,7,10,4,0,0x08090c)
            c.add([cowl,ear1,ear2])
          }else{
            c.add(this.add.ellipse(0,-31,20,13,cfg.hair))
          }

          if(cfg.glasses){
            const g1=this.add.rectangle(-5,-27,7,5,0x000000,0).setStrokeStyle(1,0x202020)
            const g2=this.add.rectangle(5,-27,7,5,0x000000,0).setStrokeStyle(1,0x202020)
            const bridge=this.add.rectangle(0,-27,3,1,0x202020)
            c.add([g1,g2,bridge])
          }
          if(cfg.moustache){
            c.add(this.add.rectangle(0,-22,12,2,0x3b2922))
          }

          if(kind==='sami')c.add(this.add.rectangle(0,1,19,5,cfg.accent))
          if(kind==='kais')c.add(this.add.rectangle(0,2,18,4,cfg.accent))
          if(kind==='rania')c.add(this.add.circle(8,-4,3,cfg.accent))
          if(kind==='amouna')c.add(this.add.rectangle(0,-10,17,3,0xb65345))
          if(kind==='batman')c.add(this.add.rectangle(0,-6,14,3,cfg.accent))

          this.actors.set(kind,c)
          return c
        }

        move(kind:Actor,x:number,y:number,duration=800){
          const c=this.actors.get(kind);if(!c)return
          this.tweens.add({targets:c,x,y,duration,ease:'Sine.InOut'})
        }

        fadeTo(draw:()=>void){
          this.cameras.main.fadeOut(180,0,0,0)
          this.time.delayedCall(190,()=>{
            this.clearWorld();draw();this.cameras.main.fadeIn(220,0,0,0)
          })
        }

        drawExterior(){
          // handcrafted top-down neighborhood
          this.rect(0,0,960,540,0x79b86e)
          for(let x=0;x<960;x+=48)for(let y=0;y<540;y+=48){
            if((x/48+y/48)%2===0)this.rect(x,y,48,48,0x72af68)
          }
          this.rect(0,342,960,108,0xd3b676)
          this.rect(356,0,248,540,0xd8bd82)
          this.rect(304,18,352,130,0xe7dfce,0x6f655a)
          this.rect(326,38,308,86,0xf3eddf,0x988c7b)
          for(const x of [350,425,500,575])this.rect(x,55,40,34,0x7fb5c4,0x5c5550)
          this.rect(458,90,54,58,0x725849,0x46372d)
          this.add.text(377,165,'MUTUELLEVILLE',{fontFamily:'monospace',fontSize:'19px',color:'#fff',backgroundColor:'#111722dd',padding:{x:10,y:5}}).setDepth(30)
          this.add.text(426,196,'TUNIS · 25.09.1999',{fontFamily:'monospace',fontSize:'11px',color:'#e7d5a0',backgroundColor:'#111722cc',padding:{x:8,y:4}}).setDepth(30)
          for(const [x,y] of [[110,120],[195,175],[780,115],[850,200],[100,485],[830,490]]){
            this.rect(x-5,y,10,27,0x765a37)
            this.add.circle(x,y-7,23,0x3f8750);this.add.circle(x-15,y-4,17,0x4b9658);this.add.circle(x+15,y-4,17,0x4b9658)
          }
          this.makePerson('sami',150,405,1.35)
          this.makePerson('kais',105,405,1.35)
          this.time.delayedCall(400,()=>{this.move('sami',485,260,1450);this.move('kais',450,260,1350)})
        }

        drawHospital(showBaby=false,showFamily=false){
          // smaller, tighter, more professional room composition
          this.rect(0,0,960,540,0x6e7a89)
          this.rect(28,28,904,484,0xd8e6ed,0x4b5663)
          this.rect(48,48,864,444,0xb7c7d0)
          // floor
          for(let y=170;y<492;y+=40)for(let x=48;x<912;x+=40){
            this.rect(x,y,40,40,((x+y)/40)%2?0xb8c5cd:0xc6d1d6)
          }
          // upper wall strip
          this.rect(48,48,864,122,0x9bc8e0)
          this.rect(48,146,864,24,0x6c86a0)
          // window
          this.rect(340,62,250,78,0x87b9d0,0x52697d)
          this.rect(460,62,7,78,0xe8f0f3)
          // privacy screen
          this.rect(90,190,150,110,0xe6f0f0,0x78929f)
          for(let x=110;x<220;x+=28){this.rect(x,205,8,80,0xb8d1d4)}
          // bed, deliberately compact
          this.rect(322,260,215,84,0xe9eceb,0x69737c)
          this.rect(340,276,76,47,0xfdfbf6,0xb7b5b0)
          this.rect(416,276,101,47,0xa7c7dc,0x7d9bb0)
          this.rect(335,344,190,14,0x66727d)
          // bedside cabinet + monitor
          this.rect(560,245,72,62,0xc9d0d2,0x77838a)
          this.rect(555,174,90,57,0x121a25,0x536170)
          this.add.text(568,191,'♥ 98',{fontFamily:'monospace',fontSize:'16px',color:'#79e2aa'}).setDepth(10)
          // IV stand
          this.rect(680,212,5,125,0x7a8790)
          this.rect(660,209,45,5,0x7a8790)
          this.rect(652,218,20,30,0xd8f0f2,0x79949b)
          // sink
          this.rect(742,194,130,65,0xe5e7e6,0x7b8385)
          this.rect(763,205,90,32,0xbfd7df,0x798e98)
          // door
          this.rect(785,332,92,132,0x725849,0x45382f)
          this.rect(800,349,62,98,0x896b55)
          this.add.circle(850,397,4,0xe2c36d)
          // chair
          this.rect(672,370,62,52,0x5f7e91,0x3c505b)
          this.rect(680,422,7,32,0x3c505b);this.rect(719,422,7,32,0x3c505b)

          // mother on bed: larger character but proportional
          const sami=this.makePerson('sami',385,292,1.45);sami.setAngle(-90)
          this.makePerson('kais',580,365,1.38)
          this.makePerson('nurse',708,305,1.32)

          if(showBaby){
            this.rect(545,352,112,62,0xe4ecee,0x718088)
            this.rect(558,362,86,38,0xf1d5d8,0xc3a6ab)
            this.makePerson('amouna',601,371,.82)
          }
          if(showFamily){
            this.makePerson('hamouda',834,407,1.15)
            this.makePerson('rania',834,455,1.15)
            this.time.delayedCall(250,()=>this.move('hamouda',710,425,850))
            this.time.delayedCall(450,()=>this.move('rania',760,455,900))
          }
        }

        drawApartment(lit=false,glow=false){
          this.rect(0,0,960,540,0x2f3140)
          this.rect(30,30,900,480,0x4a4454,0x202431)
          for(let y=170;y<510;y+=42)for(let x=30;x<930;x+=42)this.rect(x,y,42,42,((x+y)/42)%2?0x51495b:0x484150)
          this.rect(30,30,900,140,lit?0x6c5d4b:0x2b3042)
          this.rect(70,55,280,105,0x172033,0x737b8d)
          this.rect(205,55,6,105,0x737b8d)
          this.add.triangle(208,135,0,85,58,0,116,85,lit?0xd6bc73:0x11151f).setScale(.72).setDepth(2)
          this.rect(520,315,260,86,0x71536d,0x3e3140)
          this.rect(545,291,210,32,0x7d5d75)
          this.rect(410,365,88,58,0x8a735c,0x4b3f35)
          this.rect(438,342,26,40,0x121722,glow?0xffd86f:0x707a88)
          if(glow)this.add.circle(451,362,44,0xffd86f,.22).setDepth(1)
          this.rect(800,220,7,155,0x6e655b)
          this.add.triangle(804,205,0,38,38,38,19,0,lit?0xf0cf82:0x81715b)
          this.makePerson('amouna',180,420,1.35)
        }

        playStep(step:number){
          this.currentStep=step
          if(level.id==='baby'){
            if(step===0)this.fadeTo(()=>this.drawExterior())
            if(step===1)this.fadeTo(()=>this.drawHospital(false,false))
            if(step===2){
              this.drawHospital(false,false)
              this.time.delayedCall(280,()=>this.move('nurse',600,330,600))
              this.time.delayedCall(650,()=>this.move('kais',540,385,500))
              this.time.delayedCall(950,()=>{
                this.cameras.main.flash(300,255,240,190)
                const t=this.label(350,115,'A NEW PLAYER ENTERS THE WORLD')
                this.tweens.add({targets:t,alpha:0,duration:500,delay:900})
              })
            }
            if(step===3)this.fadeTo(()=>this.drawHospital(true,false))
            if(step===4)this.fadeTo(()=>this.drawHospital(true,true))
            if(step===5){
              this.drawHospital(true,true)
              this.time.delayedCall(250,()=>this.move('kais',620,390,500))
            }
            if(step===6)this.fadeTo(()=>this.drawHospital(true,true))
          }else{
            if(step===0)this.fadeTo(()=>{this.drawApartment(false,false);this.time.delayedCall(300,()=>this.move('amouna',350,395,1200))})
            if(step===1){this.drawApartment(false,false);this.makePerson('amouna',350,395,1.35);this.move('amouna',330,300,800)}
            if(step===2)this.fadeTo(()=>{this.drawApartment(false,true);this.makePerson('amouna',330,300,1.35)})
            if(step===3){this.drawApartment(false,true);this.makePerson('amouna',330,300,1.35);this.move('amouna',445,355,850)}
            if(step===4){this.drawApartment(false,true);this.makePerson('amouna',445,355,1.35);this.label(520,190,'BATMAN: HAPPY BIRTHDAY.')}
            if(step===5){this.drawApartment(true,true);this.makePerson('amouna',445,355,1.35);this.cameras.main.flash(260,255,216,111)}
            if(step===6)this.fadeTo(()=>{this.drawApartment(true,true);this.makePerson('amouna',445,355,1.35);this.makePerson('batman',700,395,1.35)})
          }
        }
      }

      game=new Phaser.Game({
        type:Phaser.AUTO,width:theme.game.width,height:theme.game.height,parent:mountRef.current,
        backgroundColor:'#10151f',scene:StoryScene,
        scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},
        render:{antialias:false,pixelArt:true},
      })
    })()
    return()=>{cancelled=true;sceneRef.current=null;game?.destroy(true)}
  },[level.id])

  useEffect(()=>{sceneRef.current?.playStep(step)},[step])

  useEffect(()=>{
    if(!beat?.text){setTyped('');return}
    setTyped('')
    let i=0
    const timer=window.setInterval(()=>{
      i+=1;setTyped(beat.text!.slice(0,i))
      if(i>=beat.text!.length)window.clearInterval(timer)
    },18)
    return()=>window.clearInterval(timer)
  },[beat])

  useEffect(()=>{
    if(!beat||beat.showDialogue!==false||!beat.autoMs)return
    const t=window.setTimeout(()=>{
      if(step<beats.length-1)setStep(s=>s+1)
    },beat.autoMs)
    return()=>window.clearTimeout(t)
  },[beat,step,beats.length])

  const next=()=>{
    if(beat.text&&typed.length<beat.text.length){setTyped(beat.text);return}
    if(step>=beats.length-1){onComplete();return}
    setStep(s=>s+1)
  }

  const showDialogue=beat.showDialogue!==false&&!isBabyMontage

  return <section className="rpg-story-shell">
    <div className="rpg-story-topbar">
      <span>ACT II · CHAPTER {String(level.order).padStart(2,'0')}</span>
      <b>{level.id==='baby'?'AMOUNA · THE BEGINNING':level.worldLabel}</b>
      <span>{String(step+1).padStart(2,'0')} / {String(beats.length).padStart(2,'0')}</span>
    </div>
    <div className="rpg-story-stage">
      <div className="rpg-phaser-mount" ref={mountRef}/>
      {isBabyMontage&&<div className="rpg-photo-montage">
        <div className="rpg-photo-title"><small>25 SEPTEMBER 1999</small><strong>WELCOME, AMOUNA.</strong></div>
        <figure className="rpg-polaroid left"><img src={media.photos.herChildhood1} alt="Amouna baby memory one"/><figcaption>THE BEGINNING</figcaption></figure>
        <figure className="rpg-polaroid right"><img src={media.photos.herChildhood2} alt="Amouna baby memory two"/><figcaption>PLAYER ONE</figcaption></figure>
        <button className="rpg-montage-continue" onClick={next}>NEXT · RHYTHM UNLOCKED ›</button>
      </div>}
    </div>
    {showDialogue&&<div className="rpg-dialogue-box rpg-dialogue-compact">
      <div className="rpg-speaker">{beat.speaker}</div>
      <p>{typed}<span className="type-cursor">▌</span></p>
      <div className="rpg-dialogue-footer"><small>{beat.cue}</small><button onClick={next}>{step===beats.length-1?'CONTINUE STORY':'NEXT ›'}</button></div>
    </div>}
  </section>
}

type RPGStoryScene={playStep:(step:number)=>void}
