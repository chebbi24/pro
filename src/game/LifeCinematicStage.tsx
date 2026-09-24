import { useEffect, useRef, useState } from 'react'
import type * as PhaserNS from 'phaser'
import { lifeLevels } from '../content/lifeLevels'
import { media } from '../content/media'
import { theme } from '../content/theme'

type Props = {
  levelIndex: number
  onComplete: () => void
}

type Actor = 'baby'|'mum'|'dad'|'brother'|'sister'|'catwoman'|'batman'|'nurse'

type Beat = {
  speaker: string
  text: string
  cue?: string
}

const babyBeats: Beat[] = [
  { speaker:'NARRATOR', text:'25 September 1999. Mutuelleville, Tunis.', cue:'A quiet morning. A brand-new chapter.' },
  { speaker:'NARRATOR', text:'Inside, the room is getting ready. Mum is in bed. Dad is trying very hard to look calm.', cue:'The room holds its breath.' },
  { speaker:'NARRATOR', text:'And then, after one last moment of waiting, she arrives.', cue:'A new player enters the world.' },
  { speaker:'NARRATOR', text:'Tiny blanket. Tiny hands. Absolutely no idea how much trouble she is going to cause.', cue:'Player One has arrived.' },
  { speaker:'NARRATOR', text:'Her older brother and sister come in to meet the newest member of the family.', cue:'First family meeting: complete.' },
  { speaker:'NARRATOR', text:'Nobody knew yet about the trophies, the countries, Paris, Batman, or everything still waiting ahead.', cue:'The story had started.' },
]

const messageBeats: Beat[] = [
  { speaker:'NARRATOR', text:'Paris. 25 September 2025. Her birthday.', cue:'Late night. One ordinary evening.' },
  { speaker:'NARRATOR', text:'The city is quiet. She is home. The day is almost over.', cue:'Almost.' },
  { speaker:'PHONE', text:'1 NEW MESSAGE', cue:'Unknown emotional consequences.' },
  { speaker:'BATMAN', text:'Happy birthday.', cue:'Sender identified.' },
  { speaker:'NARRATOR', text:'A message from someone she had definitely, completely, absolutely forgotten about.', cue:'Narrator credibility: questionable.' },
  { speaker:'SYSTEM', text:'OLD CONNECTION DETECTED. REOPENING STORY...', cue:'Round two initializing.' },
  { speaker:'NARRATOR', text:'And somehow, without asking permission, the whole world becomes brighter again.', cue:'Next stop: December in Paris.' },
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

  useEffect(()=>{
    setStep(0)
    setTyped('')
  },[levelIndex])

  useEffect(()=>{
    let game:PhaserNS.Game|null=null
    let cancelled=false
    ;(async()=>{
      const Phaser=await import('phaser')
      if(cancelled||!mountRef.current) return

      class StoryScene extends Phaser.Scene {
        actors = new Map<Actor, PhaserNS.GameObjects.Sprite>()
        props: PhaserNS.GameObjects.GameObject[]=[]
        currentStep=0
        mapKind:'exterior'|'room'|'apartment'='exterior'

        constructor(){ super('StoryScene') }

        create(){
          sceneRef.current=this as unknown as RPGStoryScene
          this.cameras.main.setBackgroundColor(0x111827)
          this.cameras.main.fadeIn(350,0,0,0)
          this.makeTextures()
          this.playStep(0)
        }

        makeTextures(){
          this.makeActorTexture('mum',0x8a536f,0x6f4a38)
          this.makeActorTexture('dad',0x344a67,0x4f4038)
          this.makeActorTexture('brother',0x4e6b56,0x5d4534)
          this.makeActorTexture('sister',0x725c88,0x6a493c)
          this.makeActorTexture('catwoman',0x111319,0x090a0d,true)
          this.makeActorTexture('batman',0x2d3645,0x090a0d,true)
          this.makeActorTexture('nurse',0xe8eef0,0x705044)
          this.makeBabyTexture()
        }

        makeActorTexture(name:Actor, body:number, hair:number, cowl=false){
          if(this.textures.exists(name)) return
          const g=this.add.graphics()
          g.fillStyle(0x000000,0.18); g.fillEllipse(16,38,22,7)
          g.fillStyle(body,1); g.fillRoundedRect(8,18,16,18,5)
          g.fillStyle(0xe9bc9d,1); g.fillCircle(16,12,7)
          g.fillStyle(hair,1); g.fillRoundedRect(9,5,14,8,4)
          if(cowl){
            g.fillTriangle(9,7,11,0,14,7)
            g.fillTriangle(18,7,21,0,23,7)
          }
          g.fillStyle(0x20242d,1); g.fillRect(9,34,5,6); g.fillRect(18,34,5,6)
          g.generateTexture(name,32,42); g.destroy()
        }

        makeBabyTexture(){
          if(this.textures.exists('baby')) return
          const g=this.add.graphics()
          g.fillStyle(0x000000,0.16); g.fillEllipse(15,27,20,6)
          g.fillStyle(0xf2c2a5,1); g.fillCircle(15,11,7)
          g.fillStyle(0x9f584a,1); g.fillRect(12,5,6,2)
          g.fillStyle(0xf0cfd3,1); g.fillRoundedRect(6,17,18,12,6)
          g.generateTexture('baby',30,32); g.destroy()
        }

        clearWorld(){
          this.tweens.killAll()
          this.actors.clear()
          this.children.removeAll(true)
          this.props=[]
        }

        tileRect(x:number,y:number,w:number,h:number,color:number,stroke?:number){
          const r=this.add.rectangle(x,y,w,h,color).setOrigin(0)
          if(stroke!==undefined) r.setStrokeStyle(2,stroke)
          return r
        }

        pixelLabel(x:number,y:number,text:string){
          return this.add.text(x,y,text,{fontFamily:'monospace',fontSize:'13px',color:'#f6f1e8',backgroundColor:'#080b13dd',padding:{x:8,y:5}}).setDepth(20)
        }

        actor(kind:Actor,x:number,y:number,scale=1){
          const s=this.add.sprite(x,y,kind).setScale(scale).setDepth(10)
          this.actors.set(kind,s)
          return s
        }

        move(kind:Actor,x:number,y:number,duration=700,onComplete?:()=>void){
          const s=this.actors.get(kind); if(!s) return
          this.tweens.add({targets:s,x,y,duration,ease:'Sine.InOut',onComplete})
        }

        fadeSwitch(draw:()=>void){
          this.cameras.main.fadeOut(220,0,0,0)
          this.time.delayedCall(240,()=>{
            this.clearWorld()
            draw()
            this.cameras.main.fadeIn(260,0,0,0)
          })
        }

        drawExterior(){
          this.mapKind='exterior'
          const T=48
          for(let yy=0;yy<12;yy++) for(let xx=0;xx<20;xx++){
            const col=(xx+yy)%2?0x73b764:0x79bd68
            this.tileRect(xx*T,yy*T,T,T,col)
          }
          // paths
          this.tileRect(330,0,300,540,0xd8bd82)
          this.tileRect(0,330,960,150,0xd8bd82)
          // clinic/house
          this.tileRect(300,0,360,120,0xd7d0bd,0x6d6256)
          this.tileRect(325,20,310,82,0xe8e2d2,0x8c7e6d)
          for(const x of [355,430,505,580]) this.tileRect(x,40,42,36,0x77a8b8,0x514a43)
          this.tileRect(455,76,70,44,0x72594a,0x44382f)
          this.pixelLabel(388,128,'MUTUELLEVILLE · TUNIS')
          // trees
          for(const [x,y] of [[90,90],[160,160],[760,80],[840,155],[100,520],[830,500]]){
            this.tileRect(x-7,y,14,32,0x795c38)
            this.add.circle(x,y-8,28,0x3f8750); this.add.circle(x-18,y,20,0x4a9659); this.add.circle(x+18,y,20,0x4a9659)
          }
          const dad=this.actor('dad',110,410,1.2)
          dad.setFlipX(false)
          this.actor('mum',165,410,1.2)
          this.time.delayedCall(350,()=>{
            this.move('dad',445,275,1500)
            this.move('mum',500,275,1650)
          })
        }

        drawRoom(withBaby=false,withSiblings=false){
          this.mapKind='room'
          // floor + walls
          this.tileRect(0,0,960,540,0xb8a98f)
          this.tileRect(0,0,960,86,0xcbd6d4,0x8d9997)
          for(let y=90;y<540;y+=48) for(let x=0;x<960;x+=48){
            const c=((x+y)/48)%2?0xc8b79b:0xbfab8d
            this.tileRect(x,y,48,48,c)
          }
          // room boundary
          this.tileRect(0,80,960,18,0x6c6258)
          this.tileRect(0,522,960,18,0x6c6258)
          this.tileRect(0,80,18,460,0x6c6258)
          this.tileRect(942,80,18,460,0x6c6258)
          // window
          this.tileRect(80,112,150,90,0x9bc9d8,0x5c6d72)
          this.tileRect(152,112,6,90,0xf0eee7)
          this.tileRect(80,154,150,6,0xf0eee7)
          // bed
          this.tileRect(245,250,300,120,0xece7db,0x746a5f)
          this.tileRect(260,266,100,54,0xffffff,0xbeb8ae)
          this.tileRect(360,275,170,80,0xaec8db,0x879cae)
          // door
          this.tileRect(820,120,88,124,0x765d49,0x46372c)
          this.tileRect(835,138,58,88,0x8d7059)
          this.add.circle(883,184,4,0xe3c36f)
          // table/monitor
          this.tileRect(625,245,88,70,0xd8d0c4,0x756d62)
          this.tileRect(640,175,94,58,0x111821,0x697381)
          this.add.text(652,190,'♥ 98',{fontFamily:'monospace',fontSize:'17px',color:'#7ce6a4'}).setDepth(8)
          // bassinet
          if(withBaby){
            this.tileRect(585,350,145,70,0xdce5e5,0x7d898c)
            this.tileRect(600,360,115,45,0xf1d0d4,0xc29fa5)
            this.actor('baby',658,371,1.15)
          }
          this.actor('mum',315,275,1.3).setAngle(-90)
          this.actor('dad',560,330,1.25)
          this.actor('nurse',760,320,1.25)
          if(withSiblings){
            this.actor('brother',860,205,1.1)
            this.actor('sister',860,255,1.1)
            this.time.delayedCall(250,()=>this.move('brother',745,430,900))
            this.time.delayedCall(450,()=>this.move('sister',805,430,950))
          }
        }

        drawApartment(lit=false,phoneGlow=false){
          this.mapKind='apartment'
          this.tileRect(0,0,960,540,0x35313a)
          for(let y=90;y<540;y+=48) for(let x=0;x<960;x+=48){
            this.tileRect(x,y,48,48,((x+y)/48)%2?0x51495a:0x484151)
          }
          this.tileRect(0,0,960,86,lit?0x66543f:0x222637)
          // giant window / Paris
          this.tileRect(70,110,280,170,0x172033,0x7a8091)
          this.tileRect(207,110,6,170,0x7a8091)
          this.tileRect(70,191,280,6,0x7a8091)
          // Eiffel silhouette
          this.add.triangle(210,208,0,90,60,0,120,90,lit?0xd9bb70:0x11151f).setScale(.75).setDepth(2)
          // sofa
          this.tileRect(500,310,270,95,0x6e4f69,0x392d38)
          this.tileRect(525,285,220,40,0x775a70)
          // table + phone
          this.tileRect(405,365,90,60,0x8a735c,0x4b3f35)
          const glow=phoneGlow?0xffd86f:0x7e8798
          this.tileRect(435,342,28,42,0x121722,glow)
          if(phoneGlow) this.add.circle(449,363,42,0xffd86f,.2).setDepth(1)
          // lamp
          this.tileRect(790,220,8,160,0x6e655b)
          this.add.triangle(794,205,0,40,40,40,20,0,lit?0xf0cf82:0x82725b)
          const cat=this.actor('catwoman',180,420,1.25)
          cat.setDepth(12)
        }

        playStep(step:number){
          this.currentStep=step
          if(level.id==='baby'){
            if(step===0) this.fadeSwitch(()=>this.drawExterior())
            if(step===1) this.fadeSwitch(()=>this.drawRoom(false,false))
            if(step===2){
              this.drawRoom(false,false)
              this.time.delayedCall(250,()=>this.move('nurse',625,355,700))
              this.time.delayedCall(480,()=>this.move('dad',545,395,450))
              this.time.delayedCall(800,()=>{
                this.cameras.main.flash(350,255,239,184)
                this.pixelLabel(330,165,'A NEW PLAYER ENTERS THE WORLD')
              })
            }
            if(step===3) this.fadeSwitch(()=>this.drawRoom(true,false))
            if(step===4) this.fadeSwitch(()=>this.drawRoom(true,true))
            if(step===5){
              // handled by React photo montage overlay
              this.fadeSwitch(()=>this.drawRoom(true,true))
            }
          }else{
            if(step===0){
              this.fadeSwitch(()=>{
                this.drawApartment(false,false)
                this.time.delayedCall(300,()=>this.move('catwoman',360,385,1200))
              })
            }
            if(step===1){
              this.drawApartment(false,false)
              this.actor('catwoman',360,385,1.25)
              this.move('catwoman',300,280,800)
            }
            if(step===2){
              this.fadeSwitch(()=>{
                this.drawApartment(false,true)
                this.actor('catwoman',300,280,1.25)
                this.tweens.add({targets:this.cameras.main,zoom:1.07,duration:600,yoyo:true,hold:400})
              })
            }
            if(step===3){
              this.drawApartment(false,true)
              this.actor('catwoman',300,280,1.25)
              this.move('catwoman',430,350,900)
            }
            if(step===4){
              this.drawApartment(false,true)
              this.actor('catwoman',430,350,1.25)
              this.pixelLabel(525,180,'BATMAN: HAPPY BIRTHDAY.')
            }
            if(step===5){
              this.drawApartment(true,true)
              this.actor('catwoman',430,350,1.25)
              this.cameras.main.flash(260,255,216,111)
            }
            if(step===6){
              this.fadeSwitch(()=>{
                this.drawApartment(true,true)
                this.actor('catwoman',430,350,1.25)
                this.actor('batman',690,380,1.25)
              })
            }
          }
        }
      }

      game=new Phaser.Game({
        type:Phaser.AUTO,
        width:theme.game.width,
        height:theme.game.height,
        parent:mountRef.current,
        backgroundColor:'#111827',
        scene:StoryScene,
        scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},
        render:{antialias:false,pixelArt:true},
      })
    })()

    return()=>{
      cancelled=true
      sceneRef.current=null
      game?.destroy(true)
    }
  },[level.id])

  useEffect(()=>{
    sceneRef.current?.playStep(step)
  },[step])

  useEffect(()=>{
    setTyped('')
    let i=0
    const timer=window.setInterval(()=>{
      i+=1
      setTyped(beat.text.slice(0,i))
      if(i>=beat.text.length) window.clearInterval(timer)
    },18)
    return()=>window.clearInterval(timer)
  },[beat])

  const next=()=>{
    if(typed.length<beat.text.length){setTyped(beat.text);return}
    if(step>=beats.length-1){onComplete();return}
    setStep(s=>s+1)
  }

  return <section className="rpg-story-shell">
    <div className="rpg-story-topbar">
      <span>ACT II · CHAPTER {String(level.order).padStart(2,'0')}</span>
      <b>{level.worldLabel}</b>
      <span>{String(step+1).padStart(2,'0')} / {String(beats.length).padStart(2,'0')}</span>
    </div>
    <div className="rpg-story-stage">
      <div className="rpg-phaser-mount" ref={mountRef}/>
      {isBabyMontage&&<div className="rpg-photo-montage">
        <div className="rpg-photo-title"><small>CHAPTER 01 COMPLETE</small><strong>PLAYER ONE ARRIVES</strong></div>
        <figure className="rpg-polaroid left"><img src={media.photos.herChildhood1} alt="Baby memory one"/><figcaption>25.09.1999</figcaption></figure>
        <figure className="rpg-polaroid right"><img src={media.photos.herChildhood2} alt="Baby memory two"/><figcaption>THE BEGINNING</figcaption></figure>
        <div className="rpg-next-tease">NEXT · RHYTHM UNLOCKED</div>
      </div>}
    </div>
    <div className="rpg-dialogue-box">
      <div className="rpg-speaker">{beat.speaker}</div>
      <p>{typed}<span className="type-cursor">▌</span></p>
      <div className="rpg-dialogue-footer"><small>{beat.cue}</small><button onClick={next}>{step===beats.length-1?'CONTINUE STORY':'NEXT ›'}</button></div>
    </div>
  </section>
}

type RPGStoryScene = {
  playStep:(step:number)=>void
}
