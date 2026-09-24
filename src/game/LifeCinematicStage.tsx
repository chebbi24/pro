import { useEffect, useRef, useState } from 'react'
import type * as PhaserNS from 'phaser'
import { lifeLevels } from '../content/lifeLevels'
import { media } from '../content/media'
import { theme } from '../content/theme'

type Props={levelIndex:number;onComplete:()=>void}
type Actor='amouna'|'sami'|'kais'|'rania'|'hamouda'|'batman'|'nurse'
type StoryBeat={speaker?:string;text?:string;cue?:string;autoMs?:number;showDialogue?:boolean}

const babyBeats:StoryBeat[]=[
  {autoMs:2200,showDialogue:false},
  {autoMs:2400,showDialogue:false},
  {autoMs:2200,showDialogue:false},
  {speaker:'KAIS',text:'She is perfect.',cue:'Amouna has arrived.'},
  {autoMs:2200,showDialogue:false},
  {speaker:'SAMI',text:'Look at her... she already knows she runs this family.',cue:'First family meeting: complete.'},
  {showDialogue:false},
]

const messageBeats:StoryBeat[]=[
  {autoMs:1800,showDialogue:false},
  {autoMs:1900,showDialogue:false},
  {autoMs:1700,showDialogue:false},
  {speaker:'PHONE',text:'Joyeux anniversaire amanii -J',cue:'A familiar sender.'},
  {autoMs:2100,showDialogue:false},
  {speaker:'SYSTEM',text:'ROUND TWO UNLOCKED.',cue:'Next stop: December in Paris.'},
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
        lastPlayedStep=-1
        location:'none'|'exterior'|'hospital'|'apartment'='none'
        babySpawned=false
        familySpawned=false
        phone?:PhaserNS.GameObjects.Container
        constructor(){super('StoryScene')}

        preload(){
          this.load.image('paris-window',`${import.meta.env.BASE_URL}backgrounds/paris.png`)
        }

        create(){
          sceneRef.current=this as unknown as RPGStoryScene
          this.cameras.main.setBackgroundColor(0x10151f)
          this.cameras.main.fadeIn(250,0,0,0)
          this.playStep(0)
        }

        clearWorld(){
          this.tweens.killAll()
          this.time.removeAllEvents()
          this.actors.clear()
          this.babySpawned=false
          this.familySpawned=false
          this.phone=undefined
          this.children.removeAll(true)
          this.cameras.main.setZoom(1)
          this.cameras.main.setScroll(0,0)
        }

        rect(x:number,y:number,w:number,h:number,color:number,stroke?:number,alpha=1){
          const r=this.add.rectangle(x,y,w,h,color,alpha).setOrigin(0)
          if(stroke!==undefined)r.setStrokeStyle(2,stroke)
          return r
        }

        notice(x:number,y:number,text:string){
          return this.add.text(x,y,text,{
            fontFamily:'monospace',fontSize:'13px',color:'#fff',
            backgroundColor:'#080b13e8',padding:{x:9,y:6}
          }).setDepth(80).setOrigin(.5)
        }

        actorName(kind:Actor){
          return ({amouna:'AMOUNA',sami:'SAMI',kais:'KAIS',rania:'RANIA',hamouda:'HAMOUDA',batman:'BATMAN',nurse:'NURSE'})[kind]
        }

        actorAccent(kind:Actor){
          return ({amouna:0xd66a82,sami:0xd6b6a3,kais:0x8796ad,rania:0xc8a05d,hamouda:0x5b78a5,batman:0xc3a33c,nurse:0x74a6bd})[kind]
        }

        makeNamePlate(root:PhaserNS.GameObjects.Container,kind:Actor,scale:number,y=-54){
          const wrap=this.add.container(0,y).setScale(1/scale)
          const name=this.actorName(kind)
          const width=Math.max(58,name.length*8+18)
          const bg=this.add.rectangle(0,0,width,18,0x070a11,.9).setStrokeStyle(1,this.actorAccent(kind),.9)
          const txt=this.add.text(0,0,name,{fontFamily:'monospace',fontSize:'10px',color:'#ffffff'}).setOrigin(.5)
          wrap.add([bg,txt])
          root.add(wrap)
        }

        makePerson(kind:Actor,x:number,y:number,scale=1,showName=true){
          const existing=this.actors.get(kind)
          if(existing)return existing
          const root=this.add.container(x,y).setScale(scale).setDepth(30)
          const sprite=this.add.container(0,0)
          root.add(sprite)

          const cfg={
            sami:{skin:0xd7a17e,hair:0x6f3f2f,body:0xd6b6a3,accent:0xe7d0c2,glasses:false,moustache:false},
            kais:{skin:0xd8a67f,hair:0x2d2421,body:0xc9cbd0,accent:0x29384e,glasses:true,moustache:true},
            rania:{skin:0xd6a079,hair:0x111318,body:0x3a2635,accent:0xc8a05d,glasses:true,moustache:false},
            hamouda:{skin:0xc99672,hair:0x30241f,body:0x1d2a43,accent:0x304769,glasses:true,moustache:false},
            amouna:{skin:0xe0a47f,hair:0x9f3f30,body:0xf2cfd2,accent:0xb65345,glasses:false,moustache:false},
            nurse:{skin:0xd9aa87,hair:0x5b463c,body:0xeaf1f3,accent:0x74a6bd,glasses:false,moustache:false},
            batman:{skin:0xd7a17f,hair:0x08090c,body:0x28313e,accent:0xc3a33c,glasses:false,moustache:false},
          }[kind]

          const shadow=this.add.ellipse(0,18,28,8,0x000000,.2)
          const legs=this.add.rectangle(0,10,18,19,0x292e37).setOrigin(.5,0)
          const torso=this.add.rectangle(0,-3,23,25,cfg.body)
          const neck=this.add.rectangle(0,-18,6,7,cfg.skin)
          const head=this.add.circle(0,-28,10,cfg.skin)
          const eyeL=this.add.circle(-3.8,-29,1.2,0x201d21)
          const eyeR=this.add.circle(3.8,-29,1.2,0x201d21)
          const mouth=this.add.arc(0,-23.5,3,15,165,false,0xa65f5f)
          sprite.add([shadow,legs,torso,neck,head,eyeL,eyeR,mouth])

          if(kind==='amouna'){
            const back=this.add.ellipse(0,-29,24,25,cfg.hair)
            const sideL=this.add.rectangle(-9,-21,6,19,cfg.hair)
            const sideR=this.add.rectangle(9,-21,6,19,cfg.hair)
            const fringe=this.add.rectangle(0,-35,18,6,cfg.hair)
            sprite.addAt(back,4);sprite.add([sideL,sideR,fringe])
          }else if(kind==='sami'){
            const back=this.add.ellipse(0,-30,23,21,cfg.hair)
            const sideL=this.add.rectangle(-8,-22,6,14,cfg.hair)
            const sideR=this.add.rectangle(8,-22,6,14,cfg.hair)
            sprite.addAt(back,4);sprite.add([sideL,sideR])
          }else if(kind==='kais'){
            sprite.add(this.add.arc(0,-32,10,180,360,false,cfg.hair))
          }else if(kind==='rania'){
            const cap=this.add.ellipse(0,-32,22,14,cfg.hair)
            const sideL=this.add.rectangle(-8,-27,5,9,cfg.hair)
            const sideR=this.add.rectangle(8,-27,5,9,cfg.hair)
            const fringe=this.add.rectangle(0,-35,14,4,cfg.hair)
            sprite.addAt(cap,4);sprite.add([sideL,sideR,fringe])
          }else if(kind==='hamouda'){
            for(const [cx,cy] of [[-7,-36],[0,-38],[7,-36],[-8,-31],[8,-31]])sprite.add(this.add.circle(cx,cy,5,cfg.hair))
          }else if(kind==='batman'){
            const cowl=this.add.rectangle(0,-32,22,16,0x08090c)
            const ear1=this.add.triangle(-7,-44,0,10,7,10,4,0,0x08090c)
            const ear2=this.add.triangle(7,-44,0,10,7,10,4,0,0x08090c)
            sprite.add([cowl,ear1,ear2])
          }else{
            sprite.add(this.add.ellipse(0,-32,20,13,cfg.hair))
          }

          if(cfg.glasses){
            const g1=this.add.rectangle(-5,-28,7,5,0x000000,0).setStrokeStyle(1,0x202020)
            const g2=this.add.rectangle(5,-28,7,5,0x000000,0).setStrokeStyle(1,0x202020)
            const bridge=this.add.rectangle(0,-28,3,1,0x202020)
            sprite.add([g1,g2,bridge])
          }
          if(cfg.moustache)sprite.add(this.add.rectangle(0,-22,12,2,0x3b2922))

          if(kind==='sami')sprite.add(this.add.rectangle(0,1,19,5,cfg.accent))
          if(kind==='kais')sprite.add(this.add.rectangle(0,2,18,4,cfg.accent))
          if(kind==='rania')sprite.add(this.add.circle(8,-4,3,cfg.accent))
          if(kind==='amouna')sprite.add(this.add.rectangle(0,-10,17,3,cfg.accent))
          if(kind==='batman')sprite.add(this.add.rectangle(0,-6,14,3,cfg.accent))

          root.setData('sprite',sprite)
          if(showName)this.makeNamePlate(root,kind,scale,-54)
          this.actors.set(kind,root)
          return root
        }

        pose(kind:Actor,angle:number){
          const actor=this.actors.get(kind)
          const sprite=actor?.getData('sprite') as PhaserNS.GameObjects.Container|undefined
          sprite?.setAngle(angle)
        }

        move(kind:Actor,x:number,y:number,duration=800){
          const actor=this.actors.get(kind)
          if(!actor)return
          this.tweens.add({targets:actor,x,y,duration,ease:'Sine.InOut'})
        }

        makeBaby(x:number,y:number){
          const existing=this.actors.get('amouna')
          if(existing)return existing
          const root=this.add.container(x,y).setDepth(34)
          const baby=this.add.container(0,0)
          root.add(baby)
          baby.add([
            this.add.ellipse(0,16,29,7,0x000000,.17),
            this.add.ellipse(0,3,30,25,0xf0cfd3).setStrokeStyle(2,0xc99aa3),
            this.add.circle(0,-9,9,0xe0a47f),
            this.add.rectangle(0,-17,9,3,0x9f3f30),
          ])
          const eyeL=this.add.line(-4,-10,-2,0,2,0,0x34252a).setLineWidth(1.4)
          const eyeR=this.add.line(4,-10,-2,0,2,0,0x34252a).setLineWidth(1.4)
          const mouth=this.add.arc(0,-5,3,180,360,false,0xb6555d)
          const tearL=this.add.circle(-7,-7,2,0x7bc7ea,.95)
          const tearR=this.add.circle(7,-7,2,0x7bc7ea,.95)
          baby.add([eyeL,eyeR,mouth,tearL,tearR])
          this.makeNamePlate(root,'amouna',1,-38)
          this.actors.set('amouna',root)

          this.tweens.add({targets:baby,y:-3,duration:170,yoyo:true,repeat:6,ease:'Sine.InOut'})
          this.tweens.add({targets:[tearL,tearR],y:'+=5',alpha:0,duration:400,repeat:2})
          const cry=this.add.text(24,-31,'WAAH!',{
            fontFamily:'monospace',fontSize:'11px',color:'#fff',
            backgroundColor:'#b34d65dd',padding:{x:5,y:3}
          }).setAlpha(0)
          root.add(cry)
          this.tweens.add({targets:cry,alpha:1,y:-37,duration:220,hold:850,yoyo:true})
          return root
        }

        transition(draw:()=>void){
          this.cameras.main.fadeOut(160,0,0,0)
          this.time.delayedCall(180,()=>{
            this.clearWorld()
            draw()
            this.cameras.main.fadeIn(220,0,0,0)
          })
        }

        hardSwitch(draw:()=>void){
          this.clearWorld()
          draw()
        }

        drawExterior(){
          this.location='exterior'
          this.rect(0,0,960,540,0x79b86e)
          for(let x=0;x<960;x+=48)for(let y=0;y<540;y+=48){
            if((x/48+y/48)%2===0)this.rect(x,y,48,48,0x72af68)
          }
          this.rect(0,342,960,108,0xd3b676)
          this.rect(356,0,248,540,0xd8bd82)
          this.rect(304,18,352,130,0xe7dfce,0x6f655a)
          this.rect(326,38,308,86,0xf3eddf,0x988c7b)
          for(const x of [350,425,500,575])this.rect(x,55,40,34,0x7fb5c4,0x514a43)
          this.rect(458,90,54,58,0x725849,0x46372d)
          this.add.text(377,165,'MUTUELLEVILLE',{fontFamily:'monospace',fontSize:'19px',color:'#fff',backgroundColor:'#111722dd',padding:{x:10,y:5}}).setDepth(20)
          this.add.text(426,196,'TUNIS · 25.09.1999',{fontFamily:'monospace',fontSize:'11px',color:'#e7d5a0',backgroundColor:'#111722cc',padding:{x:8,y:4}}).setDepth(20)
          for(const [x,y] of [[110,120],[195,175],[780,115],[850,200],[100,485],[830,490]]){
            this.rect(x-5,y,10,27,0x765a37)
            this.add.circle(x,y-7,23,0x3f8750);this.add.circle(x-15,y-4,17,0x4a9659);this.add.circle(x+15,y-4,17,0x4a9659)
          }
          this.makePerson('kais',105,405,1.25)
          this.makePerson('sami',165,405,1.25)
          this.time.delayedCall(350,()=>{this.move('kais',450,260,1350);this.move('sami',495,260,1450)})
        }

        drawHospital(showBaby=false,showFamily=false){
          this.location='hospital'
          this.rect(0,0,960,540,0x6e7a89)
          this.rect(28,28,904,484,0xd8e6ed,0x4b5663)
          this.rect(48,48,864,444,0xb7c7d0)
          for(let y=170;y<492;y+=40)for(let x=48;x<912;x+=40)this.rect(x,y,40,40,((x+y)/40)%2?0xb8c5cd:0xc6d1d6)
          this.rect(48,48,864,122,0x9bc8e0)
          this.rect(48,146,864,24,0x6c86a0)

          // Scenic Tunis window, all scenery explicitly behind the frame.
          const view=this.add.graphics().setDepth(1)
          view.fillStyle(0x88c8e4,1)
          view.fillRect(332,57,266,88)
          view.fillStyle(0xf5d37e,1)
          view.fillCircle(552,79,14)
          // distant hills, clipped visually inside the window bounds
          view.fillStyle(0x78958f,1)
          view.fillTriangle(332,145,392,98,452,145)
          view.fillStyle(0x6f8a84,1)
          view.fillTriangle(410,145,470,108,530,145)
          // white Tunis buildings in front of the distant hills
          for(const [bx,bw,bh] of [[350,44,34],[398,56,45],[459,48,30],[512,62,40]]){
            view.fillStyle(0xf0eee6,1)
            view.fillRect(bx,145-bh,bw,bh)
            view.fillStyle(0x5c8296,1)
            view.fillRect(bx+8,145-bh+9,7,9)
          }
          // palm silhouette
          view.fillStyle(0x6b5332,1)
          view.fillRect(574,94,4,48)
          view.fillStyle(0x4c8c5f,1)
          view.fillCircle(576,92,13)
          view.fillCircle(566,94,10)
          view.fillCircle(586,94,10)
          // window frame is always foreground relative to the view
          this.rect(332,57,266,88,0x000000,0,0).setStrokeStyle(3,0x52697d).setDepth(4)
          this.rect(459,57,7,88,0xe8f0f3).setDepth(4)
          this.rect(332,98,266,6,0xe8f0f3).setDepth(4)

          // welcome decoration
          this.add.line(135,94,0,0,185,0,0x6b7081).setLineWidth(2)
          const banner=this.add.text(227,92,'WELCOME AMOUNA',{
            fontFamily:'monospace',fontSize:'15px',color:'#9d4660',
            backgroundColor:'#f7e7d4ee',padding:{x:10,y:5}
          }).setOrigin(.5).setDepth(8)
          banner.setStroke('#fff7ef',1)

          // room props
          this.rect(86,188,150,112,0xe6f0f0,0x78929f)
          for(let x=106;x<220;x+=28)this.rect(x,203,8,82,0xb8d1d4)
          this.rect(320,258,218,86,0xe9eceb,0x69737c)
          this.rect(338,274,78,49,0xfdfbf6,0xb7b5b0)
          this.rect(416,274,104,49,0xa7c7dc,0x7d9bb0)
          this.rect(335,344,190,14,0x66727d)
          this.rect(558,244,74,63,0xc9d0d2,0x77838a)
          this.rect(554,174,92,58,0x121a25,0x536170)
          this.add.text(568,191,'♥ 98',{fontFamily:'monospace',fontSize:'16px',color:'#79e2aa'}).setDepth(10)
          this.rect(680,212,5,125,0x7a8790);this.rect(660,209,45,5,0x7a8790);this.rect(652,218,20,30,0xd8f0f2,0x79949b)
          this.rect(742,194,130,65,0xe5e7e6,0x7b8385);this.rect(763,205,90,32,0xbfd7df,0x798e98)
          this.rect(785,332,92,132,0x725849,0x45382f);this.rect(800,349,62,98,0x896b55);this.add.circle(850,397,4,0xe2c36d)
          this.rect(674,372,60,50,0x5f7e91,0x3c505b);this.rect(682,422,7,32,0x3c505b);this.rect(719,422,7,32,0x3c505b)

          const sami=this.makePerson('sami',386,294,1.25)
          this.pose('sami',-90)
          sami.setDepth(26)
          this.makePerson('kais',574,365,1.18)
          this.makePerson('nurse',708,306,1.14)

          if(showBaby)this.spawnBaby()
          if(showFamily)this.spawnFamily()
        }

        spawnBaby(){
          if(this.babySpawned||this.location!=='hospital')return
          this.babySpawned=true
          this.rect(544,350,114,65,0xe4ecee,0x718088)
          this.rect(558,361,87,39,0xf1d5d8,0xc3a6ab)
          this.makeBaby(601,374)
          this.cameras.main.flash(280,255,245,215)
        }

        spawnFamily(){
          if(this.familySpawned||this.location!=='hospital')return
          this.familySpawned=true
          this.makePerson('hamouda',842,392,1.02)
          this.makePerson('rania',842,455,1.02)
          this.time.delayedCall(220,()=>this.move('hamouda',726,414,760))
          this.time.delayedCall(420,()=>this.move('rania',790,458,820))
        }

        drawParisBedroom(){
          this.location='apartment'
          this.rect(0,0,960,540,0x262331)
          this.rect(28,28,904,484,0x433b4c,0x211d28)
          this.rect(48,320,864,172,0x5a4b45)
          for(let x=48;x<912;x+=80)this.rect(x,320,2,172,0x6d5a50,0,0.45)

          // Paris is the actual view through the large bedroom window.
          const paris=this.add.image(690,168,'paris-window').setDisplaySize(390,220).setDepth(1)
          paris.setCrop(0,0,paris.width,paris.height)
          this.rect(486,48,408,238,0x000000,0,0).setStrokeStyle(10,0xd8d0c4).setDepth(4)
          this.rect(684,48,8,238,0xe4ddd2).setDepth(4)
          this.rect(486,161,408,8,0xe4ddd2).setDepth(4)

          // Bed + headboard + blanket.
          this.rect(76,260,275,132,0x735a69,0x302735)
          this.rect(94,281,240,89,0xe8e1d8,0xb7ada1)
          this.rect(101,287,88,36,0xf9f5ee,0xd4cbc0)
          this.rect(91,355,255,73,0x8f7188,0x604b5d)
          this.rect(104,368,229,42,0xb18ea6,0x7f6478)

          // Night stand, lamp and phone.
          this.rect(386,343,102,75,0x6e5749,0x3d3029)
          this.rect(398,356,78,8,0x927361)
          this.rect(414,279,7,64,0x8d7a68)
          this.add.triangle(418,267,0,30,44,30,22,0,0xe9cf88).setDepth(6)
          this.add.circle(418,300,45,0xf0cb72,.10).setDepth(2)

          this.phone=this.add.container(439,331).setDepth(35)
          const phoneBody=this.add.rectangle(0,0,24,42,0x11151d).setStrokeStyle(2,0x535c6b)
          const phoneScreen=this.add.rectangle(0,-2,17,28,0x6fa7c1).setData('screen',true)
          const phoneDot=this.add.circle(0,17,2,0xdfe7eb)
          this.phone.add([phoneBody,phoneScreen,phoneDot])

          // Rug + small room details.
          this.add.ellipse(595,418,250,78,0x6b546b,.8).setDepth(2)
          this.rect(742,342,112,77,0x2c3340,0x1b2029)
          this.rect(759,355,78,48,0x50627a)
          this.add.circle(821,383,4,0xe3c167)

          // Amouna starts sitting in bed; blanket hides the lower-body standing pose.
          const amouna=this.makePerson('amouna',224,347,1.22,false)
          amouna.setDepth(28)
          const sprite=amouna.getData('sprite') as PhaserNS.GameObjects.Container
          sprite.setScale(1,.88)
          this.add.rectangle(225,382,112,48,0xb18ea6).setDepth(32).setStrokeStyle(2,0x7f6478)

          this.add.text(66,70,'PARIS · 25.09.2025',{fontFamily:'monospace',fontSize:'13px',color:'#f4e6c7',backgroundColor:'#11131bd9',padding:{x:9,y:6}}).setDepth(40)
        }

        vibratePhone(){
          if(!this.phone)return
          this.tweens.add({
            targets:this.phone,x:this.phone.x+4,angle:4,duration:70,yoyo:true,repeat:10,ease:'Sine.InOut',
            onComplete:()=>{if(this.phone){this.phone.setAngle(0)}}
          })
          const ring=this.add.circle(this.phone.x,this.phone.y,28,0x85c8e0,0).setDepth(30)
          this.tweens.add({targets:ring,alpha:.35,scale:1.7,duration:650,yoyo:true,repeat:1,onComplete:()=>ring.destroy()})
        }

        showBirthdayMessage(){
          const card=this.add.container(545,260).setDepth(85).setAlpha(0)
          const panel=this.add.rectangle(0,0,260,122,0xf7f4ee,.97).setStrokeStyle(3,0x1d2330)
          const top=this.add.rectangle(0,-48,260,25,0x1d2330)
          const sender=this.add.text(-112,-55,'MESSAGE',{fontFamily:'monospace',fontSize:'10px',color:'#d8c17c'})
          const message=this.add.text(0,7,'Happy Birthday\n-J',{fontFamily:'Georgia',fontSize:'24px',fontStyle:'bold',color:'#191b22',align:'center'}).setOrigin(.5)
          card.add([panel,top,sender,message])
          this.tweens.add({targets:card,alpha:1,y:248,duration:300,ease:'Back.Out'})
          this.time.delayedCall(1900,()=>this.tweens.add({targets:card,alpha:0,duration:350,onComplete:()=>card.destroy()}))
        }

        heartBurst(){
          for(let i=0;i<22;i++){
            const x=100+((i*97)%760)
            const y=500-((i*41)%180)
            const heart=this.add.container(x,y).setDepth(90).setScale(.45+(i%4)*.12).setAlpha(0)
            const color=i%2?0xe97c9a:0xf1b0bd
            const l=this.add.circle(-6,0,8,color)
            const r=this.add.circle(6,0,8,color)
            const tip=this.add.triangle(0,10,-14,-2,14,-2,0,18,color)
            heart.add([l,r,tip])
            this.tweens.add({
              targets:heart,alpha:1,y:y-120-(i%5)*16,scale:heart.scale+.22,duration:1200+(i%4)*180,
              delay:(i%8)*70,ease:'Sine.Out',onComplete:()=>heart.destroy()
            })
          }
        }

        playStep(step:number){
          if(level.id==='baby'){
            if(step===this.lastPlayedStep)return
            this.lastPlayedStep=step

            if(step===0){
              this.transition(()=>this.drawExterior())
              return
            }

            if(step===1){
              this.transition(()=>this.drawHospital(false,false))
              return
            }

            // From here onward the hospital scene persists. No redraws.
            if(this.location!=='hospital')return

            if(step===2){
              this.move('nurse',626,332,600)
              this.time.delayedCall(420,()=>this.move('kais',540,382,520))
              this.time.delayedCall(850,()=>{
                this.cameras.main.flash(420,255,238,182)
                this.cameras.main.shake(250,.005)
                const halo=this.add.circle(600,365,20,0xffefb0,0).setDepth(60)
                this.tweens.add({targets:halo,alpha:.55,scale:5,duration:600,yoyo:true,onComplete:()=>halo.destroy()})
                const text=this.notice(480,116,'A NEW PLAYER ENTERS THE WORLD')
                this.tweens.add({targets:text,alpha:0,duration:450,delay:1000,onComplete:()=>text.destroy()})
              })
              return
            }

            if(step===3){
              this.spawnBaby()
              return
            }

            if(step===4){
              this.spawnFamily()
              return
            }

            if(step===5){
              this.move('kais',630,388,520)
              return
            }

            if(step===6){
              return
            }
          }else{
            if(step===this.lastPlayedStep)return
            this.lastPlayedStep=step

            if(step===0){
              this.transition(()=>this.drawParisBedroom())
              return
            }
            if(this.location!=='apartment')return

            if(step===1){
              this.vibratePhone()
              return
            }
            if(step===2){
              this.move('amouna',430,372,1050)
              return
            }
            if(step===3){
              this.showBirthdayMessage()
              if(this.phone){
                const screen=this.phone.list.find((child:any)=>child.getData?.('screen')) as PhaserNS.GameObjects.Rectangle|undefined
                screen?.setFillStyle(0xbfeaff)
              }
              return
            }
            if(step===4){
              const batman=this.makePerson('batman',760,382,1.18,false)
              batman.setAlpha(0)
              this.tweens.add({targets:batman,alpha:1,x:720,duration:700,ease:'Sine.Out'})
              this.cameras.main.flash(220,255,210,226)
              this.heartBurst()
              return
            }
            if(step===5){
              this.heartBurst()
              return
            }
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
      i+=1
      setTyped(beat.text!.slice(0,i))
      if(i>=beat.text!.length)window.clearInterval(timer)
    },18)
    return()=>window.clearInterval(timer)
  },[beat])

  useEffect(()=>{
    if(!beat||beat.showDialogue!==false||!beat.autoMs)return
    const t=window.setTimeout(()=>{if(step<beats.length-1)setStep(s=>s+1)},beat.autoMs)
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
        <figure className="rpg-polaroid solo"><img src={media.photos.chapter1Baby1} alt="Amouna baby memory"/><figcaption>THE BEGINNING</figcaption></figure>
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
