import { useEffect, useMemo, useRef, useState } from 'react'
import type * as PhaserNS from 'phaser'
import { lifeLevels, type CollectibleKind, type GoalKind, type LifeLevel, type LifeMemory } from '../content/lifeLevels'
import { media, type PhotoKey } from '../content/media'
import { theme } from '../content/theme'

type Props = {
  levelIndex: number
  onLevelComplete: () => void
  onMemoryOpen: (memory: LifeMemory) => void
  paused: boolean
}

type CompanionMode='none'|'follow'|'fly'

export function LifeJourneyStage({ levelIndex, onLevelComplete, onMemoryOpen, paused }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const gameRef = useRef<PhaserNS.Game | null>(null)
  const pausedRef = useRef(paused)
  const controls = useRef({ left: false, right: false, jump: false })
  const level = lifeLevels[levelIndex]
  const [hint, setHint] = useState('MOVE · JUMP · COLLECT THE STORY ITEMS')
  const palette = useMemo(() => getPalette(level), [level])

  pausedRef.current = paused

  useEffect(() => {
    controls.current = { left: false, right: false, jump: false }
    setHint('MOVE · JUMP · COLLECT THE STORY ITEMS')
  }, [levelIndex])

  useEffect(() => {
    let game: PhaserNS.Game | null = null
    let cancelled = false

    ;(async () => {
      const Phaser = await import('phaser')
      if (cancelled || !mountRef.current) return
      const parent = mountRef.current

      class LifeScene extends Phaser.Scene {
        player!: PhaserNS.Types.Physics.Arcade.SpriteWithDynamicBody
        platforms!: PhaserNS.Physics.Arcade.StaticGroup
        obstacles!: PhaserNS.Physics.Arcade.StaticGroup
        memories!: PhaserNS.Physics.Arcade.Group
        goal!: PhaserNS.Physics.Arcade.Sprite
        companion?: PhaserNS.GameObjects.Sprite
        companionMode:CompanionMode='none'
        completed = false
        celebrating = false
        memoryCooldown = false
        milestoneIndex = 0
        collectedCount = 0
        podiumStartedAt = 0
        progressFill?: PhaserNS.GameObjects.Rectangle
        itemCounter?: PhaserNS.GameObjects.Text

        constructor() { super('LifeScene') }

        createTexture(name:string, draw:(g:PhaserNS.GameObjects.Graphics)=>void, w:number, h:number) {
          const g=this.add.graphics()
          draw(g)
          g.generateTexture(name,w,h)
          g.destroy()
        }

        createPlayerTexture() {
          this.createTexture('life-player', g => {
            const style=level.avatarStyle

            if(style==='boat'){
              // Travel chapters 11–12: Catwoman + Batman share one playable boat.
              g.fillStyle(0x5a3825,1)
              g.fillRoundedRect(8,42,80,20,8)
              g.fillStyle(0x9e6d42,1)
              g.fillTriangle(4,42,92,42,78,67)
              g.fillStyle(0xe7c98c,1)
              g.fillRect(43,18,4,26)
              g.fillStyle(0xf3e8c8,1)
              g.fillTriangle(47,19,47,40,73,40)
              // Catwoman
              g.fillStyle(0x08090c,1); g.fillRoundedRect(20,23,15,20,5); g.fillCircle(27,18,7)
              g.fillTriangle(20,13,24,6,26,15); g.fillTriangle(29,15,32,6,35,13)
              g.fillStyle(0x8bd7e7,1); g.fillRect(23,17,3,2); g.fillRect(29,17,3,2)
              // Batman
              g.fillStyle(0x151a23,1); g.fillRoundedRect(58,23,15,20,5); g.fillCircle(65,18,7)
              g.fillStyle(0x050608,1); g.fillTriangle(58,13,61,6,63,15); g.fillTriangle(67,15,70,6,73,13)
              g.fillStyle(0xc3a33c,1); g.fillRect(60,33,10,2)
              return
            }

            if(style==='black-dress'){
              g.fillStyle(0xf0c7ae,1)
              g.fillCircle(24,13,10)
              g.fillStyle(0x9f3f30,1)
              g.fillRoundedRect(11,1,26,18,8)
              g.fillRect(9,10,7,24); g.fillRect(32,10,7,24)
              g.fillStyle(0x161318,1)
              g.fillTriangle(10,25,38,25,42,57)
              g.fillTriangle(10,25,42,57,6,57)
              g.fillStyle(0xf0c7ae,1)
              g.fillRect(7,28,5,23); g.fillRect(36,28,5,23)
              g.fillRect(16,55,5,10); g.fillRect(27,55,5,10)
              // black heels
              g.fillStyle(0x07070a,1)
              g.fillRoundedRect(13,64,12,5,2); g.fillRect(21,67,3,5)
              g.fillRoundedRect(25,64,12,5,2); g.fillRect(33,67,3,5)
              return
            }

            if(style==='gymnast'||style==='champion'){
              g.fillStyle(0xf0c7ae,1); g.fillCircle(24,13,10)
              g.fillStyle(0x9f3f30,1); g.fillRoundedRect(11,0,26,17,8); g.fillRect(9,9,7,22); g.fillRect(32,9,7,22)
              g.fillStyle(0x772d27,1); g.fillRect(16,7,16,5)
              g.fillStyle(0x7d3f91,1); g.fillTriangle(9,24,39,24,24,55)
              g.fillStyle(0xd7ad3f,1); g.fillTriangle(16,27,31,27,24,40)
              g.fillStyle(0xf0c7ae,1); g.fillRect(7,27,5,23); g.fillRect(36,27,5,23); g.fillRect(17,52,5,14); g.fillRect(27,52,5,14)
              g.fillStyle(0xd6b999,1); g.fillRoundedRect(14,64,10,5,2); g.fillRoundedRect(26,64,10,5,2)
              return
            }

            // Catwoman-like story avatar used for travel/relationship chapters.
            g.fillStyle(0x07080b,1); g.fillRoundedRect(10,18,28,42,7)
            g.fillStyle(0x050609,1); g.fillCircle(24,13,11)
            g.fillTriangle(13,7,17,0,20,9); g.fillTriangle(28,9,31,0,35,7)
            g.fillStyle(0x8bd7e7,1); g.fillRect(16,12,5,2); g.fillRect(27,12,5,2)
            g.fillStyle(0x4c4f59,1); g.fillRect(12,38,24,3)
            g.fillStyle(0x030407,1); g.fillRoundedRect(12,55,10,16,3); g.fillRoundedRect(27,55,10,16,3)
          }, level.avatarStyle==='boat'?96:48,72)
        }

        createCompanionTextures(){
          this.createTexture('batman-companion',g=>{
            g.fillStyle(0x000000,.2); g.fillEllipse(24,66,34,8)
            g.fillStyle(0x222a37,1); g.fillRoundedRect(12,25,25,35,6)
            g.fillStyle(0xd6a17c,1); g.fillCircle(24,18,9)
            g.fillStyle(0x08090c,1); g.fillRect(14,9,20,12)
            g.fillTriangle(14,9,18,1,20,11); g.fillTriangle(28,11,31,1,34,9)
            g.fillStyle(0xc3a33c,1); g.fillRect(16,45,17,3)
            g.fillStyle(0x111722,1); g.fillTriangle(8,30,13,25,13,58); g.fillTriangle(40,30,35,25,35,58)
          },48,72)

          this.createTexture('friend-companion',g=>{
            g.fillStyle(0x000000,.18); g.fillEllipse(24,66,32,8)
            g.fillStyle(0xf0c7ae,1); g.fillCircle(24,17,9)
            g.fillStyle(0x6d4935,1); g.fillRoundedRect(13,8,22,14,7); g.fillRect(12,14,6,10); g.fillRect(30,14,6,10)
            g.fillStyle(0xe8e5df,1); g.fillRoundedRect(12,27,24,25,5)
            g.fillStyle(0x49617b,1); g.fillRect(15,50,8,15); g.fillRect(27,50,8,15)
            g.fillStyle(0xead6bd,1); g.fillRoundedRect(12,64,12,5,2); g.fillRoundedRect(26,64,12,5,2)
          },48,72)
        }

        drawCollectible(g:PhaserNS.GameObjects.Graphics,kind:CollectibleKind){
          // Physical-looking collectible badge: shadow + object, no emoji glyphs.
          g.fillStyle(0x000000,.28); g.fillEllipse(24,40,34,8)
          g.fillStyle(0xf6f0e5,.94); g.fillCircle(24,22,20)
          g.lineStyle(3,palette.accent,1); g.strokeCircle(24,22,18)

          if(kind==='ribbon'){
            g.lineStyle(4,0xc75aa4,1); g.beginPath(); g.moveTo(10,13); g.lineTo(35,16); g.lineTo(14,27); g.lineTo(37,34); g.strokePath()
            g.fillStyle(0xd4ad45,1); g.fillCircle(10,12,3)
          }else if(kind==='hoop'){
            g.lineStyle(5,0x9b5cc0,1); g.strokeCircle(24,22,12)
            g.lineStyle(2,0xe8b95b,1); g.strokeCircle(24,22,8)
          }else if(kind==='ball'){
            g.fillStyle(0xc85c95,1); g.fillCircle(24,22,11)
            g.lineStyle(2,0xf6d9e8,.9); g.strokeCircle(24,22,7)
          }else if(kind==='clubs'){
            g.fillStyle(0xd5b35b,1); g.fillRoundedRect(15,10,5,23,2); g.fillCircle(17.5,9,4); g.fillRoundedRect(28,12,5,23,2); g.fillCircle(30.5,11,4)
          }else if(kind==='trophy'){
            g.fillStyle(0xd8ae3f,1); g.fillRoundedRect(17,11,14,13,2); g.fillRect(22,24,4,8); g.fillRect(16,32,16,4)
            g.lineStyle(3,0xd8ae3f,1); g.strokeCircle(15,17,6); g.strokeCircle(33,17,6)
          }else if(kind==='graduation-cap'){
            g.fillStyle(0x171b24,1); g.fillTriangle(8,17,24,9,40,17); g.fillTriangle(12,17,24,24,36,17)
            g.fillRect(22,23,4,9); g.fillStyle(0xd0aa45,1); g.fillCircle(24,33,3)
          }else if(kind==='greece'){
            g.fillStyle(0x2d69bb,1); g.fillRect(11,11,26,22)
            g.fillStyle(0xffffff,1); g.fillRect(11,16,26,4); g.fillRect(17,11,4,12)
            g.lineStyle(2,0xffffff,1); g.lineBetween(22,25,37,25); g.lineBetween(22,30,37,30)
          }else if(kind==='friend'){
            g.fillStyle(0x6d4935,1); g.fillCircle(24,15,7)
            g.fillStyle(0xe8e5df,1); g.fillRoundedRect(17,23,14,15,4)
            g.fillStyle(0x49617b,1); g.fillRect(18,35,5,7); g.fillRect(26,35,5,7)
          }else if(kind==='whistle'){
            g.fillStyle(0xb7bec8,1); g.fillCircle(20,22,8); g.fillRect(26,18,12,7)
            g.fillStyle(0x26303e,1); g.fillCircle(20,22,3)
          }else if(kind==='heart'||kind==='love'){
            g.fillStyle(0xc94d68,1); g.fillCircle(18,19,8); g.fillCircle(30,19,8); g.fillTriangle(10,22,38,22,24,37)
          }else if(kind==='broken-heart'){
            g.fillStyle(0xc94d68,1); g.fillCircle(18,19,8); g.fillCircle(30,19,8); g.fillTriangle(10,22,38,22,24,37)
            g.lineStyle(3,0xf7e8df,1); g.lineBetween(25,13,21,23); g.lineBetween(21,23,27,31)
          }else if(kind==='phone'){
            g.fillStyle(0x171b22,1); g.fillRoundedRect(17,7,14,31,3); g.fillStyle(0x78a9c3,1); g.fillRect(20,11,8,20)
            g.fillStyle(0xe7ecef,1); g.fillCircle(24,35,1.5)
          }else if(kind==='suitcase'){
            g.fillStyle(0x7f5032,1); g.fillRoundedRect(11,18,27,18,3); g.lineStyle(3,0x4f321f,1); g.strokeRect(18,13,12,7)
            g.fillStyle(0xd5ad63,1); g.fillRect(23,18,3,18)
          }else if(kind==='boat'){
            g.fillStyle(0x8a5737,1); g.fillTriangle(9,25,39,25,31,36); g.fillStyle(0xe8d69b,1); g.fillRect(22,10,3,15); g.fillTriangle(25,11,25,23,37,23)
          }else if(kind==='camera'){
            g.fillStyle(0x242a33,1); g.fillRoundedRect(10,16,29,21,3); g.fillStyle(0x596779,1); g.fillRect(15,12,9,5)
            g.fillStyle(0x8fc2d7,1); g.fillCircle(25,26,7); g.lineStyle(2,0x11161d,1); g.strokeCircle(25,26,7)
          }else if(kind==='star'){
            g.fillStyle(0xd4ad45,1); g.fillTriangle(24,8,28,19,40,19); g.fillTriangle(40,19,30,27,34,39); g.fillTriangle(34,39,24,31,14,39); g.fillTriangle(14,39,18,27,8,19)
          }else{
            g.fillStyle(palette.accent,1); g.fillCircle(24,22,10)
          }
        }

        drawGoal(g:PhaserNS.GameObjects.Graphics,kind:GoalKind){
          const gold=palette.accent
          g.fillStyle(0x000000,.25); g.fillEllipse(36,67,54,8)
          g.fillStyle(gold,1)
          if(kind==='podium'){
            g.fillStyle(0xede7dc,1); g.fillRect(8,45,18,19); g.fillRect(27,31,18,33); g.fillRect(46,49,18,15)
            g.lineStyle(2,0xd1aa3e,1); g.strokeRect(27,31,18,33)
            g.fillStyle(0xd1aa3e,1); g.fillCircle(36,24,8)
          }else if(kind==='plane'){
            g.fillTriangle(7,36,64,27,64,45); g.fillTriangle(31,33,47,10,50,34); g.fillTriangle(29,39,46,62,49,38)
          }else if(kind==='gym-door'){
            g.fillStyle(0x6c4f38,1); g.fillRoundedRect(17,12,38,55,4); g.fillStyle(0x171b22,1); g.fillRect(26,25,20,42); g.fillStyle(0xd5ad63,1); g.fillCircle(48,44,3)
          }else if(kind==='bat-signal'){
            g.fillStyle(0xe2c35f,1); g.fillCircle(36,34,27); g.fillStyle(0x141821,1); g.fillTriangle(14,34,28,24,36,31); g.fillTriangle(58,34,44,24,36,31); g.fillTriangle(25,39,47,39,36,50)
          }else if(kind==='graduation'){
            g.fillStyle(0x171b24,1); g.fillTriangle(8,28,36,14,64,28); g.fillTriangle(13,28,36,39,59,28); g.fillRect(34,39,4,19)
          }else if(kind==='message'){
            g.fillStyle(0x181c24,1); g.fillRoundedRect(23,7,26,60,5); g.fillStyle(0x79b6d1,1); g.fillRect(27,14,18,39)
          }else if(kind==='paris-heart'||kind==='sunset-heart'){
            g.fillStyle(0xd15a72,1); g.fillCircle(27,28,13); g.fillCircle(45,28,13); g.fillTriangle(14,33,58,33,36,64)
          }else if(kind==='milan-arch'||kind==='cliff-arch'){
            g.fillStyle(0xc8a67c,1); g.fillRoundedRect(10,10,52,58,4); g.fillStyle(0x111827,1); g.fillCircle(36,53,19); g.fillRect(17,52,38,20)
          }else if(kind==='dock'){
            g.fillStyle(0x7c5638,1); g.fillRect(8,46,56,7); g.fillRect(15,53,5,17); g.fillRect(52,53,5,17)
          }else{
            g.fillStyle(gold,1); g.fillCircle(36,36,24)
          }
        }

        createWorldTextures(){
          this.createTexture('platform',g=>{
            const stone=['paris','paris-romance','milan','como','etretat','mallorca','meet-breakup'].includes(level.theme)
            if(level.theme==='gymnastics'){
              g.fillStyle(0xd9a98d,1); g.fillRoundedRect(0,5,160,14,5)
              g.fillStyle(0xf0cbbb,1); g.fillRect(7,7,146,3)
              g.fillStyle(0x6a4d42,1); g.fillRect(20,19,8,5); g.fillRect(132,19,8,5)
            }else if(level.theme==='usa'){
              g.fillStyle(0x242a33,.96); g.fillRoundedRect(0,8,160,10,3)
              g.fillStyle(0xa9b2bf,.8); g.fillRect(5,8,150,2)
            }else if(level.theme==='coach'){
              g.fillStyle(0xc78b65,1); g.fillRoundedRect(0,5,160,14,4)
              g.fillStyle(0xeac4a9,1); g.fillRect(5,7,150,3)
            }else if(stone){
              g.fillStyle(0x766957,.92); g.fillRoundedRect(0,2,160,20,4)
              g.fillStyle(0xb9a88e,.85); g.fillRect(0,2,160,5)
              g.lineStyle(1,0x4a4035,.7); for(let x=24;x<160;x+=35)g.lineBetween(x,7,x,21)
            }else{
              g.fillStyle(palette.ground,.95); g.fillRoundedRect(0,2,160,20,4); g.fillStyle(palette.groundTop,1); g.fillRect(0,2,160,5)
            }
          },160,24)

          this.createTexture('obstacle',g=>{
            if(level.theme==='coach'){
              g.fillStyle(0xf08a4b,1); g.fillTriangle(4,30,16,4,28,30); g.fillStyle(0xffffff,1); g.fillRect(10,17,12,4)
            }else{
              g.fillStyle(0x4e4439,.95); g.fillRoundedRect(4,8,24,24,4); g.fillStyle(0x6f8b58,1); g.fillCircle(16,8,9)
            }
          },32,36)

          level.memories.forEach((memory,i)=>this.createTexture('memory-'+i,g=>this.drawCollectible(g,memory.collectible),48,48))
          this.createTexture('goal',g=>this.drawGoal(g,level.goalKind),72,72)
          this.createCompanionTextures()

          this.createTexture('podium-low',g=>{
            g.fillStyle(0xe8e2d8,1); g.fillRoundedRect(0,3,76,19,3); g.fillStyle(0xc6a44a,1); g.fillRect(0,3,76,4)
          },76,22)
          this.createTexture('podium-mid',g=>{
            g.fillStyle(0xe8e2d8,1); g.fillRoundedRect(0,3,84,35,3); g.fillStyle(0xc6a44a,1); g.fillRect(0,3,84,4)
          },84,38)
          this.createTexture('podium-first',g=>{
            g.fillStyle(0xf0ebe3,1); g.fillRoundedRect(0,3,92,55,3); g.fillStyle(0xd4ad45,1); g.fillRect(0,3,92,5)
            g.fillStyle(0xb88f2d,1); g.fillCircle(46,27,10)
            g.fillStyle(0xffffff,1); g.fillRect(43,20,6,14)
          },92,58)
        }

        drawBackdrop(){
          const tint=this.add.rectangle(900,270,1800,540,palette.sky,0.10).setDepth(-10)
          tint.setBlendMode(Phaser.BlendModes.MULTIPLY)
          this.add.rectangle(900,270,1800,540,0x05070c,.08).setDepth(-9)
        }

        createThemeDecor(){
          // Keep the rich photographic backgrounds visible; only functional scene-matching structures remain.
          if(level.theme==='usa'){
            for(const [x,y,w] of [[620,414,150],[930,382,145],[1240,414,155]]){
              this.add.rectangle(x,y,w,7,0x202632,.95).setDepth(3)
              this.add.rectangle(x-w/2+9,y+28,6,54,0x202632,.9).setDepth(2)
              this.add.rectangle(x+w/2-9,y+28,6,54,0x202632,.9).setDepth(2)
            }
          }
        }

        createGameHud(){
          const x=620,y=34,width=286
          this.add.rectangle(x,y,width,38,0x090d15,.80).setScrollFactor(0).setDepth(45).setStrokeStyle(1,0x626d82,.75)
          this.add.text(x-width/2+12,y-12,'STORY PROGRESS',{fontFamily:'monospace',fontSize:'9px',color:'#c7d0dc'}).setScrollFactor(0).setDepth(46)
          this.add.rectangle(x-width/2+12,y+8,width-116,5,0x303a4b).setOrigin(0,.5).setScrollFactor(0).setDepth(46)
          this.progressFill=this.add.rectangle(x-width/2+12,y+8,width-116,5,palette.accent).setOrigin(0,.5).setScrollFactor(0).setDepth(47)
          this.progressFill.scaleX=0
          this.itemCounter=this.add.text(x+width/2-94,y-5,`MEMORIES 0/${level.memories.length}`,{fontFamily:'monospace',fontSize:'9px',color:'#f0d58a'}).setScrollFactor(0).setDepth(46)
        }

        addPodium(){
          const third=this.platforms.create(1578,475,'podium-low') as PhaserNS.Physics.Arcade.Sprite
          const first=this.platforms.create(1665,452,'podium-first') as PhaserNS.Physics.Arcade.Sprite
          const second=this.platforms.create(1753,467,'podium-mid') as PhaserNS.Physics.Arcade.Sprite
          third.refreshBody(); first.refreshBody(); second.refreshBody()
          this.goal=this.physics.add.sprite(1665,350,'goal')
          this.goal.setImmovable(true)
          ;(this.goal.body as PhaserNS.Physics.Arcade.Body).setAllowGravity(false)
          this.add.text(1665,413,'1',{fontFamily:'Georgia',fontSize:'24px',fontStyle:'bold',color:'#9a7622'}).setOrigin(.5).setDepth(8)
        }

        spawnMemory(memory:LifeMemory,i:number,x:number,y:number){
          if(level.id==='meet-breakup'&&i===0){
            const actor=this.physics.add.sprite(x,y+15,'batman-companion')
            actor.setData('memory',memory); actor.setData('special','batman-meet'); actor.setDepth(9)
            ;(actor.body as PhaserNS.Physics.Arcade.Body).setAllowGravity(false)
            this.memories.add(actor)
            return
          }
          if(level.id==='paris'&&i===1){
            const actor=this.physics.add.sprite(x,y+15,'friend-companion')
            actor.setData('memory',memory); actor.setData('special','friend-meet'); actor.setDepth(9)
            ;(actor.body as PhaserNS.Physics.Arcade.Body).setAllowGravity(false)
            this.memories.add(actor)
            return
          }
          const icon=this.memories.create(x,y,'memory-'+i) as PhaserNS.Physics.Arcade.Sprite
          icon.setData('memory',memory); icon.setDepth(9)
          this.tweens.add({targets:icon,y:y-8,duration:900,yoyo:true,repeat:-1,ease:'Sine.InOut'})
        }

        activateCompanion(icon:PhaserNS.Physics.Arcade.Sprite){
          this.memories.remove(icon,false,false)
          if(icon.body)(icon.body as PhaserNS.Physics.Arcade.Body).enable=false
          this.companion=icon
          this.companionMode='follow'
          icon.setDepth(8)
        }

        breakupEffect(){
          if(!this.companion)return
          const bat=this.companion
          this.companionMode='fly'
          this.cameras.main.shake(260,.005)
          for(let i=0;i<10;i++){
            const shard=this.add.triangle(bat.x,bat.y-25,0,0,7,4,0,9,0xc94d68).setDepth(20)
            const a=(Math.PI*2*i)/10
            this.tweens.add({targets:shard,x:bat.x+Math.cos(a)*80,y:bat.y-25+Math.sin(a)*65,alpha:0,duration:650,onComplete:()=>shard.destroy()})
          }
          this.tweens.add({
            targets:bat,x:bat.x+270,y:bat.y-260,angle:28,alpha:0,duration:900,ease:'Cubic.In',
            onComplete:()=>{bat.destroy();this.companion=undefined;this.companionMode='none'}
          })
        }

        showMilestone(text:string){
          const popup=this.add.text(theme.game.width/2,104,text.toUpperCase(),{
            fontFamily:'monospace',fontSize:'17px',color:'#fff',backgroundColor:'#080b14e8',padding:{x:14,y:9}
          }).setOrigin(.5).setScrollFactor(0).setDepth(50).setAlpha(0)
          this.tweens.add({targets:popup,alpha:1,y:94,duration:220,hold:850,yoyo:true,onComplete:()=>popup.destroy()})
        }

        firework(cx:number,cy:number,color:number,delay:number){
          this.time.delayedCall(delay,()=>{
            const core=this.add.circle(cx,cy,5,color,1).setScrollFactor(0).setDepth(81)
            this.tweens.add({targets:core,scale:2,alpha:0,duration:500,onComplete:()=>core.destroy()})
            for(let i=0;i<18;i++){
              const a=(Math.PI*2*i)/18
              const spark=this.add.circle(cx,cy,3,color,1).setScrollFactor(0).setDepth(82)
              this.tweens.add({
                targets:spark,x:cx+Math.cos(a)*(55+(i%4)*10),y:cy+Math.sin(a)*(55+(i%4)*10),
                alpha:0,scale:.35,duration:850,ease:'Quad.Out',onComplete:()=>spark.destroy()
              })
            }
          })
        }

        celebrateGymnastics(){
          if(this.celebrating)return
          this.celebrating=true
          this.completed=true
          this.player.setVelocity(0,0)
          this.physics.pause()
          setHint('WORLD CHAMPION')
          this.add.rectangle(theme.game.width/2,theme.game.height/2,theme.game.width,theme.game.height,0x080914,.70)
            .setScrollFactor(0).setDepth(78)
          this.add.text(theme.game.width/2,theme.game.height/2-28,'WORLD CHAMPION',{
            fontFamily:'Georgia',fontSize:'42px',fontStyle:'bold',color:'#ffffff',
            stroke:'#8d6a1f',strokeThickness:3,align:'center'
          }).setOrigin(.5).setScrollFactor(0).setDepth(84)
          this.add.text(theme.game.width/2,theme.game.height/2+28,'1ST PLACE · AMOUNA',{
            fontFamily:'monospace',fontSize:'15px',color:'#f5d26f',letterSpacing:2
          }).setOrigin(.5).setScrollFactor(0).setDepth(84)
          ;[0xf6c85f,0xe06f9e,0x8fc6e8,0xf2f0e8].forEach((col,i)=>{
            this.firework(160+i*205,125+(i%2)*70,col,i*180)
            this.firework(250+i*155,330-(i%2)*55,col,400+i*130)
          })
          for(let i=0;i<35;i++){
            const conf=this.add.rectangle((i*79)%theme.game.width,-20-(i%5)*20,5+(i%3)*2,12,(i%3===0?0xf4c84e:i%3===1?0xd9699d:0x91c7e4),1)
              .setScrollFactor(0).setDepth(83).setRotation(i*.37)
            this.tweens.add({targets:conf,y:theme.game.height+40,x:conf.x+((i%2)?45:-45),angle:conf.angle+4,duration:1600+(i%7)*120,delay:(i%8)*70})
          }
          this.time.delayedCall(2800,()=>onLevelComplete())
        }

        create(){
          this.physics.world.setBounds(0,0,1800,theme.game.height)
          this.cameras.main.setBounds(0,0,1800,theme.game.height)
          this.drawBackdrop()
          this.createPlayerTexture()
          this.createWorldTextures()
          this.createThemeDecor()
          this.createGameHud()

          this.add.text(28,26,`CHAPTER ${String(level.order).padStart(2,'0')} // ${level.worldLabel}`,{
            fontFamily:'monospace',fontSize:'15px',color:'#f4f0e6',backgroundColor:'#06080dbd',padding:{x:10,y:7}
          }).setScrollFactor(0).setDepth(20)

          this.platforms=this.physics.add.staticGroup()
          for(let x=80;x<1800;x+=155){
            const p=this.platforms.create(x,500,'platform') as PhaserNS.Physics.Arcade.Sprite
            p.refreshBody()
          }

          const elevated=level.theme==='gymnastics'
            ?[{x:430,y:412},{x:755,y:382},{x:1050,y:410},{x:1330,y:385}]
            :level.theme==='usa'
              ?[{x:620,y:414},{x:930,y:382},{x:1240,y:414}]
              :[{x:420,y:420},{x:760,y:398},{x:1110,y:420},{x:1420,y:400}]
          elevated.forEach(({x,y})=>{
            const p=this.platforms.create(x,y,'platform') as PhaserNS.Physics.Arcade.Sprite
            p.setScale(.72,1).refreshBody()
          })

          if(level.theme==='gymnastics')this.addPodium()

          this.obstacles=this.physics.add.staticGroup()
          const obstacleXs=Array.from({length:level.obstacleCount},(_,i)=>370+i*Math.max(240,1120/Math.max(1,level.obstacleCount-1)))
          obstacleXs.forEach(x=>{
            const obstacle=this.obstacles.create(x,466,'obstacle') as PhaserNS.Physics.Arcade.Sprite
            obstacle.refreshBody()
          })

          this.player=this.physics.add.sprite(95,430,'life-player')
          this.player.setCollideWorldBounds(true)
          this.player.setBounce(.03)
          this.player.setDepth(10)
          this.physics.add.collider(this.player,this.platforms)
          this.physics.add.collider(this.player,this.obstacles)

          this.memories=this.physics.add.group({allowGravity:false,immovable:true})
          level.memories.forEach((memory,i)=>{
            let x=500+i*Math.max(340,780/Math.max(1,level.memories.length))
            let y=i%2===0?365:330
            if(level.theme==='gymnastics'){
              const xs=[250,500,745,955,1170,1370,1515]; x=xs[Math.min(i,xs.length-1)]; y=i<4?330:300
            }else if(level.id==='coach'){
              x=[620,1120][i]??1120; y=i===0?340:315
            }else if(level.id==='meet-breakup'){
              x=[500,1080][i]??1080; y=350
            }else if(level.id==='paris'){
              x=[600,1120][i]??1120; y=345
            }
            this.spawnMemory(memory,i,x,y)
          })

          if(level.theme!=='gymnastics'){
            this.goal=this.physics.add.sprite(1680,425,'goal')
            this.goal.setImmovable(true)
            ;(this.goal.body as PhaserNS.Physics.Arcade.Body).setAllowGravity(false)
            this.physics.add.overlap(this.player,this.goal,()=>{
              if(this.completed||pausedRef.current)return
              this.completed=true
              this.physics.pause()
              setHint('CHAPTER COMPLETE')
              this.time.delayedCall(300,()=>onLevelComplete())
            })
          }

          // Batman is a persistent travel companion in chapters 8–10.
          if(level.order>=8&&level.order<=10){
            this.companion=this.add.sprite(35,430,'batman-companion').setDepth(8)
            this.companionMode='follow'
          }

          this.physics.add.overlap(this.player,this.memories,(_player,target)=>{
            if(this.memoryCooldown||pausedRef.current)return
            const icon=target as PhaserNS.Physics.Arcade.Sprite
            const memory=icon.getData('memory') as LifeMemory
            const special=icon.getData('special') as string|undefined
            this.memoryCooldown=true

            if(special==='batman-meet'||special==='friend-meet'){
              this.activateCompanion(icon)
            }else{
              icon.disableBody(true,true)
            }
            if(memory.id==='breakup')this.breakupEffect()

            this.collectedCount+=1
            this.itemCounter?.setText(`MEMORIES ${this.collectedCount}/${level.memories.length}`)
            this.physics.pause()
            setHint('MEMORY UNLOCKED')
            onMemoryOpen(memory)
            this.time.delayedCall(300,()=>{this.memoryCooldown=false})
          })

          this.cameras.main.startFollow(this.player,true,.08,.08,-240,40)
        }

        update(){
          if(pausedRef.current||this.completed||!this.player?.body){
            if(this.player?.body)this.player.setVelocityX(0)
            return
          }

          if(this.progressFill)this.progressFill.scaleX=Math.max(0,Math.min(1,this.player.x/1680))

          while(this.milestoneIndex<level.milestones.length&&this.player.x>=level.milestones[this.milestoneIndex].x){
            this.showMilestone(level.milestones[this.milestoneIndex].text)
            this.milestoneIndex++
          }

          const speed=level.avatarStyle==='boat'?205:225
          if(controls.current.left){
            this.player.setVelocityX(-speed); this.player.setFlipX(true)
          }else if(controls.current.right){
            this.player.setVelocityX(speed); this.player.setFlipX(false)
          }else this.player.setVelocityX(0)

          const body=this.player.body as PhaserNS.Physics.Arcade.Body
          const grounded=body.blocked.down||body.touching.down
          if(controls.current.jump&&grounded){
            this.player.setVelocityY(level.avatarStyle==='boat'?-430:-525)
            controls.current.jump=false
          }

          if(this.companion&&this.companionMode==='follow'){
            const behind=this.player.flipX?58:-58
            this.companion.x=Phaser.Math.Linear(this.companion.x,this.player.x+behind,.10)
            this.companion.y=Phaser.Math.Linear(this.companion.y,this.player.y+2,.12)
            this.companion.setFlipX(this.player.flipX)
          }

          if(level.theme==='gymnastics'){
            const onFirst=this.player.x>1622&&this.player.x<1708&&this.player.y<430&&grounded
            if(onFirst){
              if(!this.podiumStartedAt)this.podiumStartedAt=this.time.now
              if(this.time.now-this.podiumStartedAt>650)this.celebrateGymnastics()
            }else this.podiumStartedAt=0
          }
        }
      }

      game=new Phaser.Game({
        type:Phaser.AUTO,
        width:theme.game.width,
        height:theme.game.height,
        parent,
        transparent:true,
        physics:{default:'arcade',arcade:{gravity:{x:0,y:760},debug:false}},
        scene:LifeScene,
        scale:{mode:Phaser.Scale.FIT,autoCenter:Phaser.Scale.CENTER_BOTH},
        render:{antialias:true,pixelArt:false},
      })
      gameRef.current=game
    })()

    return()=>{
      cancelled=true
      controls.current={left:false,right:false,jump:false}
      gameRef.current=null
      game?.destroy(true)
    }
  },[levelIndex,level,onLevelComplete,onMemoryOpen,palette])

  useEffect(()=>{
    const scene=gameRef.current?.scene.getScene('LifeScene') as PhaserNS.Scene|undefined
    if(!scene?.physics?.world)return
    if(paused){
      scene.physics.world.pause()
      controls.current.left=false;controls.current.right=false;controls.current.jump=false
    }else scene.physics.world.resume()
  },[paused])

  useEffect(()=>{
    const down=(event:KeyboardEvent)=>{
      const key=event.key.toLowerCase()
      if(key==='a'||event.key==='ArrowLeft')controls.current.left=true
      if(key==='d'||event.key==='ArrowRight')controls.current.right=true
      if(key==='w'||event.key==='ArrowUp'||event.key===' ')controls.current.jump=true
    }
    const up=(event:KeyboardEvent)=>{
      const key=event.key.toLowerCase()
      if(key==='a'||event.key==='ArrowLeft')controls.current.left=false
      if(key==='d'||event.key==='ArrowRight')controls.current.right=false
      if(key==='w'||event.key==='ArrowUp'||event.key===' ')controls.current.jump=false
    }
    window.addEventListener('keydown',down);window.addEventListener('keyup',up)
    return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up)}
  },[])

  const press=(key:keyof typeof controls.current,value:boolean)=>{controls.current[key]=value}

  return <section className="life-game-shell">
    <div className="life-game-hud">
      <div>
        <span className="life-level-kicker">ACT II // HER STORY</span>
        <strong>{level.title}</strong>
        <small>{level.subtitle}</small>
      </div>
      <span>{levelIndex+1}/{lifeLevels.length}</span>
    </div>
    <div className="life-stage-frame">
      <div className="life-photo-background" style={{backgroundImage:`url("${level.backgroundUrl}")`}}/>
      <div className="life-photo-shade"/>
      <div className="life-game-canvas" ref={mountRef}/>
      {level.backgroundCredit&&<div className="life-photo-credit">{level.backgroundCredit}</div>}
    </div>
    <div className="life-game-hint">{hint}</div>
    <div className="life-controls">
      <button onPointerDown={()=>press('left',true)} onPointerUp={()=>press('left',false)} onPointerLeave={()=>press('left',false)}>←</button>
      <button onPointerDown={()=>press('jump',true)} onPointerUp={()=>press('jump',false)} onPointerLeave={()=>press('jump',false)}>JUMP</button>
      <button onPointerDown={()=>press('right',true)} onPointerUp={()=>press('right',false)} onPointerLeave={()=>press('right',false)}>→</button>
    </div>
  </section>
}

export function MemoryOverlay({memory,onClose}:{memory:LifeMemory;onClose:()=>void}){
  const imgs=memory.photoKeys.map(key=>media.photos[key as PhotoKey]).filter(Boolean)
  return <div className="memory-overlay" role="dialog" aria-modal="true" aria-label={memory.title}>
    <div className="memory-panel">
      <div className="memory-panel-top"><span>MEMORY PAUSED</span><button onClick={onClose}>×</button></div>
      <div className="memory-gallery">
        {imgs.map((src,i)=><figure key={src+i} className={'memory-shot shot-'+i}><img src={src} alt={memory.title+' photo '+(i+1)}/><figcaption>MEMORY // {String(i+1).padStart(2,'0')}</figcaption></figure>)}
      </div>
      <div className="memory-copy">
        <p className="eyebrow">STORY UNLOCKED</p>
        <h2>{memory.title}</h2>
        <p>{memory.caption}</p>
        <button className="primary-btn" onClick={onClose}>CONTINUE LEVEL</button>
      </div>
    </div>
  </div>
}

function getPalette(level:LifeLevel){
  const palettes:Record<string,{sky:number;skyCss:string;ground:number;groundTop:number;obstacle:number;accent:number;accentSoft:number}>={
    'tunis-baby':{sky:0x8eb6c8,skyCss:'#8eb6c8',ground:0x6f5d42,groundTop:0xc8a96e,obstacle:0x3f6c5d,accent:0xf3c76b,accentSoft:0xffe3a4},
    gymnastics:{sky:0xcad6e8,skyCss:'#cad6e8',ground:0x6f7490,groundTop:0xe8d0e8,obstacle:0xb26b97,accent:0x8f5bbb,accentSoft:0xe3b5ff},
    champion:{sky:0x18233b,skyCss:'#18233b',ground:0x242d43,groundTop:0xd3aa3c,obstacle:0x6a2132,accent:0xf3c76b,accentSoft:0xffdf80},
    usa:{sky:0x0e1d36,skyCss:'#0e1d36',ground:0x323b4c,groundTop:0xb5434e,obstacle:0x454f63,accent:0xe25c67,accentSoft:0xf6a0a7},
    coach:{sky:0xe8dcd0,skyCss:'#e8dcd0',ground:0x97806c,groundTop:0xd8aac4,obstacle:0x8a6680,accent:0xbd6d9d,accentSoft:0xefbad8},
    'meet-breakup':{sky:0x2b2034,skyCss:'#2b2034',ground:0x312237,groundTop:0xe56a8c,obstacle:0x5a344c,accent:0xf07c9c,accentSoft:0xffb2c6},
    paris:{sky:0x25344d,skyCss:'#25344d',ground:0x31333b,groundTop:0xe1c48e,obstacle:0x6b5d5d,accent:0xf0c675,accentSoft:0xffe3a3},
    'birthday-reunion':{sky:0x101726,skyCss:'#101726',ground:0x242739,groundTop:0xffce69,obstacle:0x463a55,accent:0xffd86f,accentSoft:0xffedb5},
    'paris-romance':{sky:0x2b2035,skyCss:'#2b2035',ground:0x2a2330,groundTop:0xe1819d,obstacle:0x56354a,accent:0xf198ad,accentSoft:0xffc7d3},
    milan:{sky:0xc8b59d,skyCss:'#c8b59d',ground:0x756955,groundTop:0xe0c095,obstacle:0x6e5445,accent:0xe0b365,accentSoft:0xffdc9c},
    como:{sky:0x8fb6cb,skyCss:'#8fb6cb',ground:0x516e66,groundTop:0xcac08b,obstacle:0x547066,accent:0xf2d77a,accentSoft:0xffedaa},
    etretat:{sky:0x83adbd,skyCss:'#83adbd',ground:0x6e746e,groundTop:0xe3dfd4,obstacle:0x9b9a91,accent:0xf1d690,accentSoft:0xffefb8},
    mallorca:{sky:0x53afc2,skyCss:'#53afc2',ground:0xb68b57,groundTop:0xf0d18f,obstacle:0x936d4b,accent:0xffd26a,accentSoft:0xffe5a4},
  }
  return palettes[level.theme]
}
