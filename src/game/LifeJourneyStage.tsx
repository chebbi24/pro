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
        completed = false
        memoryCooldown = false
        milestoneIndex = 0
        collectedCount = 0
        progressFill?: PhaserNS.GameObjects.Rectangle
        itemCounter?: PhaserNS.GameObjects.Text

        constructor() {
          super('LifeScene')
        }

        createTexture(name: string, draw: (g: PhaserNS.GameObjects.Graphics) => void, w: number, h: number) {
          const g = this.add.graphics()
          draw(g)
          g.generateTexture(name, w, h)
          g.destroy()
        }

        createPlayerTexture() {
          this.createTexture('life-player', g => {
            const style = level.avatarStyle

            if (style === 'baby') {
              g.fillStyle(0xf5d9c4, 1)
              g.fillCircle(25, 14, 11)
              g.fillStyle(0xd95d65, 1)
              g.fillRoundedRect(10, 23, 30, 29, 9)
              g.fillStyle(0xf6e7dc, 1)
              g.fillTriangle(10, 30, 40, 30, 25, 60)
              g.fillStyle(0x9c4f43, 1)
              g.fillRect(20, 8, 10, 3)
              return
            }

            if (style === 'gymnast' || style === 'champion') {
              // Amouna identity: auburn/red hair with fringe
              g.fillStyle(0xf0c7ae, 1)
              g.fillCircle(24, 13, 10)
              g.fillStyle(0x9f3f30, 1)
              g.fillRoundedRect(11, 0, 26, 17, 8)
              g.fillRect(9, 9, 7, 22)
              g.fillRect(32, 9, 7, 22)
              g.fillStyle(0x772d27, 1)
              g.fillRect(16, 7, 16, 5)
              // leotard
              g.fillStyle(0x7d3f91, 1)
              g.fillTriangle(9, 24, 39, 24, 24, 55)
              g.fillStyle(0xd7ad3f, 1)
              g.fillTriangle(16, 27, 31, 27, 24, 40)
              // arms + legs
              g.fillStyle(0xf0c7ae, 1)
              g.fillRect(7, 27, 5, 23)
              g.fillRect(36, 27, 5, 23)
              g.fillRect(17, 52, 5, 14)
              g.fillRect(27, 52, 5, 14)
              // competition boots / shoes
              g.fillStyle(0x23242b, 1)
              g.fillRoundedRect(14, 64, 10, 7, 3)
              g.fillRoundedRect(26, 64, 10, 7, 3)
              return
            }

            if (style === 'tiger') {
              g.fillStyle(0xf2c7ad, 1)
              g.fillCircle(24, 13, 11)
              g.fillStyle(0xa63f31, 1)
              g.fillRoundedRect(10, 0, 28, 18, 9)
              g.fillRect(9, 9, 7, 24)
              g.fillRect(32, 9, 7, 24)
              g.fillStyle(0x7f2f27, 1)
              g.fillRect(16, 7, 16, 5)
              g.fillStyle(0xd18a3d, 1)
              g.fillTriangle(10, 25, 38, 25, 24, 58)
              g.fillStyle(0x151515, 1)
              g.fillRect(15, 30, 3, 18)
              g.fillRect(23, 28, 3, 23)
              g.fillRect(31, 30, 3, 18)
              g.fillStyle(0xd18a3d, 1)
              g.fillStyle(0x1a1717, 1)
              g.fillRect(15, 30, 3, 18)
              g.fillRect(23, 28, 3, 23)
              g.fillRect(31, 30, 3, 18)
              g.fillStyle(0xf2c7ad, 1)
              g.fillRect(7, 28, 5, 23)
              g.fillRect(36, 28, 5, 23)
              g.fillRect(17, 56, 5, 10)
              g.fillRect(27, 56, 5, 10)
              g.fillStyle(0x251d1a, 1)
              g.fillRoundedRect(13, 64, 11, 7, 3)
              g.fillRoundedRect(26, 64, 11, 7, 3)
              return
            }

            g.fillStyle(0x07080b, 1)
            g.fillRoundedRect(10, 18, 28, 42, 7)
            g.fillStyle(0x050609, 1)
            g.fillCircle(24, 13, 11)
            g.fillTriangle(13, 7, 17, 0, 20, 9)
            g.fillTriangle(28, 9, 31, 0, 35, 7)
            g.fillStyle(0x8bd7e7, 1)
            g.fillRect(16, 12, 5, 2)
            g.fillRect(27, 12, 5, 2)
            g.fillStyle(0x4c4f59, 1)
            g.fillRect(12, 38, 24, 3)
            g.lineStyle(3, 0x08090c, 1)
            g.beginPath()
            g.moveTo(36, 44)
            g.lineTo(46, 40)
            g.lineTo(47, 28)
            g.strokePath()
            // tall Catwoman boots
            g.fillStyle(0x030407, 1)
            g.fillRoundedRect(12, 55, 10, 16, 3)
            g.fillRoundedRect(27, 55, 10, 16, 3)
          }, 48, 72)
        }

        drawCollectible(g: PhaserNS.GameObjects.Graphics, kind: CollectibleKind) {
          g.fillStyle(palette.accent, 0.18)
          g.fillCircle(24, 24, 23)
          g.lineStyle(3, palette.accent, 1)
          g.strokeCircle(24, 24, 18)
          g.fillStyle(palette.accent, 1)

          if (kind === 'family') {
            g.fillCircle(17, 19, 5); g.fillCircle(31, 19, 5); g.fillCircle(24, 31, 5)
          } else if (kind === 'ribbon') {
            g.lineStyle(4, palette.accent, 1)
            g.beginPath(); g.moveTo(12, 14); g.lineTo(34, 18); g.lineTo(15, 30); g.lineTo(35, 36); g.strokePath()
          } else if (kind === 'hoop') {
            g.lineStyle(5, palette.accent, 1); g.strokeCircle(24, 24, 13)
          } else if (kind === 'ball') {
            g.fillCircle(24, 24, 12)
            g.lineStyle(2, 0xffffff, .6); g.strokeCircle(24, 24, 7)
          } else if (kind === 'clubs') {
            g.fillRoundedRect(16, 12, 5, 22, 2); g.fillCircle(18.5, 11, 4)
            g.fillRoundedRect(28, 14, 5, 22, 2); g.fillCircle(30.5, 13, 4)
          } else if (kind === 'trophy') {
            g.fillRect(18, 13, 12, 13); g.fillRect(22, 26, 4, 8); g.fillRect(17, 34, 14, 4)
            g.lineStyle(3, palette.accent, 1); g.strokeCircle(15, 19, 6); g.strokeCircle(33, 19, 6)
          } else if (kind === 'star') {
            g.fillTriangle(24, 9, 28, 21, 40, 21); g.fillTriangle(40, 21, 30, 28, 34, 40)
            g.fillTriangle(34, 40, 24, 32, 14, 40); g.fillTriangle(14, 40, 18, 28, 8, 21)
          } else if (kind === 'whistle') {
            g.fillCircle(20, 24, 9); g.fillRect(26, 20, 12, 7); g.fillCircle(20, 24, 3)
          } else if (kind === 'heart' || kind === 'love') {
            g.fillCircle(18, 20, 8); g.fillCircle(30, 20, 8); g.fillTriangle(10, 23, 38, 23, 24, 39)
          } else if (kind === 'broken-heart') {
            g.fillCircle(18, 20, 8); g.fillCircle(30, 20, 8); g.fillTriangle(10, 23, 38, 23, 24, 39)
            g.lineStyle(3, 0x111111, 1); g.lineBetween(25, 15, 21, 25); g.lineBetween(21, 25, 27, 33)
          } else if (kind === 'diploma') {
            g.fillRoundedRect(12, 15, 24, 17, 3); g.lineStyle(2, 0x111111, 1); g.lineBetween(15, 21, 32, 21); g.fillCircle(32, 34, 5)
          } else if (kind === 'phone') {
            g.fillRoundedRect(17, 9, 14, 30, 3); g.fillStyle(0x111827, 1); g.fillRect(20, 13, 8, 19)
          } else if (kind === 'suitcase') {
            g.fillRoundedRect(12, 18, 24, 18, 3); g.lineStyle(3, palette.accent, 1); g.strokeRect(19, 13, 10, 7)
          } else if (kind === 'boat') {
            g.fillTriangle(10, 29, 38, 29, 30, 38); g.fillRect(22, 13, 3, 16); g.fillTriangle(25, 14, 25, 27, 36, 27)
          } else if (kind === 'camera') {
            g.fillRoundedRect(11, 17, 27, 20, 3); g.fillCircle(24, 27, 7); g.fillRect(16, 13, 8, 5)
          }
        }

        drawGoal(g: PhaserNS.GameObjects.Graphics, kind: GoalKind) {
          const gold = palette.accent
          g.fillStyle(gold, 1)
          if (kind === 'home') {
            g.fillRect(16, 28, 40, 37); g.fillTriangle(10, 28, 36, 8, 62, 28); g.fillStyle(0x1a1c22, 1); g.fillRect(31, 43, 10, 22)
          } else if (kind === 'ribbon-gate') {
            g.lineStyle(6, gold, 1); g.strokeCircle(36, 36, 24)
          } else if (kind === 'podium') {
            g.fillRect(11, 46, 18, 18); g.fillRect(29, 34, 18, 30); g.fillRect(47, 51, 18, 13)
          } else if (kind === 'plane') {
            g.fillTriangle(8, 36, 62, 27, 62, 45); g.fillTriangle(31, 33, 46, 11, 49, 34); g.fillTriangle(29, 39, 45, 61, 48, 38)
          } else if (kind === 'gym-door') {
            g.fillRect(18, 13, 36, 54); g.fillStyle(0x111827, 1); g.fillRect(27, 25, 18, 42)
          } else if (kind === 'bat-signal') {
            g.fillCircle(36, 34, 27); g.fillStyle(0x111827, 1); g.fillTriangle(15, 34, 28, 24, 36, 31); g.fillTriangle(57, 34, 44, 24, 36, 31); g.fillTriangle(26, 38, 46, 38, 36, 49)
          } else if (kind === 'graduation') {
            g.fillTriangle(8, 28, 36, 14, 64, 28); g.fillTriangle(13, 28, 36, 39, 59, 28); g.fillRect(34, 39, 4, 19)
          } else if (kind === 'message') {
            g.fillRoundedRect(23, 7, 26, 60, 5); g.fillStyle(0x111827, 1); g.fillRect(27, 14, 18, 39)
          } else if (kind === 'paris-heart' || kind === 'sunset-heart') {
            g.fillCircle(27, 28, 13); g.fillCircle(45, 28, 13); g.fillTriangle(14, 33, 58, 33, 36, 64)
          } else if (kind === 'milan-arch' || kind === 'cliff-arch') {
            g.fillRoundedRect(10, 10, 52, 58, 4); g.fillStyle(0x111827, 1); g.fillCircle(36, 53, 19); g.fillRect(17, 52, 38, 20)
          } else if (kind === 'dock') {
            g.fillRect(8, 46, 56, 7); g.fillRect(15, 53, 5, 17); g.fillRect(52, 53, 5, 17)
          }
        }

        createWorldTextures() {
          this.createTexture('platform', g => {
            g.fillStyle(palette.ground, 0.96)
            g.fillRoundedRect(0, 0, 160, 24, 4)
            g.fillStyle(palette.groundTop, 1)
            g.fillRect(0, 0, 160, 6)
            g.fillStyle(0xffffff, 0.12)
            for (let x=10; x<155; x+=24) g.fillRect(x, 9, 15, 2)
            if (level.theme === 'gymnastics') {
              g.fillStyle(0xf0d9ee, .35)
              g.fillRect(0, 18, 160, 4)
            }
          }, 160, 24)

          this.createTexture('obstacle', g => {
            g.fillStyle(palette.obstacle, 0.95)
            if (level.theme === 'gymnastics') {
              g.fillRoundedRect(2, 10, 28, 20, 5)
              g.fillStyle(palette.accent, .9)
              g.fillRect(5, 14, 22, 3)
            } else if (level.theme === 'usa') {
              g.fillCircle(16, 17, 14)
              g.fillStyle(0x5b6470, 1)
              g.fillCircle(16, 17, 6)
            } else if (level.theme === 'coach') {
              g.fillTriangle(3, 31, 16, 2, 29, 31)
            } else if (level.theme === 'meet-breakup') {
              g.fillCircle(11, 12, 9)
              g.fillCircle(21, 12, 9)
              g.fillTriangle(4, 14, 28, 14, 16, 31)
            } else {
              g.fillRoundedRect(1, 8, 30, 23, 4)
            }
          }, 32, 32)

          level.memories.forEach((memory, i) => {
            this.createTexture('memory-' + i, g => this.drawCollectible(g, memory.collectible), 48, 48)
          })

          this.createTexture('goal', g => this.drawGoal(g, level.goalKind), 72, 72)
        }

        drawBackdrop() {
          const tint = this.add.rectangle(900, 270, 1800, 540, palette.sky, 0.18)
          tint.setDepth(-10)
          const vignette = this.add.rectangle(900, 270, 1800, 540, 0x05070c, 0.12)
          vignette.setDepth(-9)
        }

        createThemeDecor() {
          if (level.theme === 'gymnastics') {
            const ribbon=this.add.graphics().setDepth(2)
            ribbon.lineStyle(5,0xd86fb2,.95)
            ribbon.beginPath()
            ribbon.moveTo(170,290)
            ribbon.lineTo(240,230)
            ribbon.lineTo(300,300)
            ribbon.lineTo(360,235)
            ribbon.strokePath()

            const hoop=this.add.graphics().setDepth(3)
            hoop.lineStyle(7,0x9b5cc0,1)
            hoop.strokeCircle(505,330,38)

            this.add.circle(745,342,24,0xc85c95).setStrokeStyle(4,0xf0bfd9).setDepth(3)

            for (const x of [900,930]) {
              this.add.rectangle(x,338,8,58,0xd5b35b).setRotation(x===900?-.28:.24).setDepth(3)
              this.add.circle(x+(x===900?-8:8),309,7,0xd5b35b).setDepth(3)
            }

            const beamX=610, beamY=407
            this.add.rectangle(beamX,beamY,210,14,0xe2b293).setStrokeStyle(3,0x8a5d49).setDepth(4)
            this.add.rectangle(beamX-78,beamY+34,11,55,0x6b4c40).setDepth(3)
            this.add.rectangle(beamX+78,beamY+34,11,55,0x6b4c40).setDepth(3)
            this.add.rectangle(beamX,beamY+58,185,8,0x5a4038).setDepth(2)
            this.add.rectangle(beamX,beamY-3,190,3,0xf5d7c8,.7).setDepth(5)

            const podiums=[
              {x:1190,w:82,h:28},
              {x:1395,w:96,h:38},
              {x:1580,w:112,h:48},
            ]
            podiums.forEach((p,i)=>{
              this.add.rectangle(p.x,455,p.w,p.h,0x252b3a).setStrokeStyle(3,0xd4ad45).setDepth(3)
              this.add.circle(p.x,245,40+i*8,0xf3c76b,.08+i*.02).setDepth(1)
              this.add.circle(p.x,245,8+i*2,0xf3c76b,.9).setDepth(2)
            })
          } else if (level.theme === 'usa') {
            for (const x of [620,690,760]) {
              this.add.circle(x,438,24,0x181b20).setStrokeStyle(6,0x505965).setDepth(3)
            }
            this.add.rectangle(1050,410,120,10,0x687057).setDepth(3)
            this.add.rectangle(1230,372,120,10,0x687057).setDepth(3)
          } else if (level.theme === 'coach') {
            for (const [x,y] of [[650,435],[720,435],[790,435]]) {
              this.add.triangle(x,y,0,28,15,0,30,28,0xe78e58).setDepth(3)
            }
          }
        }

        createGameHud() {
          const x=620, y=35, width=280
          this.add.rectangle(x,y,width,42,0x070a12,.88)
            .setScrollFactor(0).setDepth(45).setStrokeStyle(1,0x4a5670)
          this.add.text(x-width/2+12,y-14,'PROGRESS',{
            fontFamily:'monospace',fontSize:'9px',color:'#9eabc2'
          }).setScrollFactor(0).setDepth(46)
          this.add.rectangle(x-width/2+12,y+7,width-110,6,0x293247)
            .setOrigin(0,.5).setScrollFactor(0).setDepth(46)
          this.progressFill=this.add.rectangle(x-width/2+12,y+7,width-110,6,palette.accent)
            .setOrigin(0,.5).setScrollFactor(0).setDepth(47)
          this.progressFill.scaleX=0
          this.itemCounter=this.add.text(x+width/2-88,y-6,`ITEMS 0/${level.memories.length}`,{
            fontFamily:'monospace',fontSize:'10px',color:'#f3c76b'
          }).setScrollFactor(0).setDepth(46)
        }

        create() {
          this.physics.world.setBounds(0, 0, 1800, theme.game.height)
          this.cameras.main.setBounds(0, 0, 1800, theme.game.height)
          this.drawBackdrop()
          this.createPlayerTexture()
          this.createWorldTextures()
          this.createThemeDecor()
          this.createGameHud()

          this.add.text(28, 26, `LEVEL ${String(level.order).padStart(2, '0')} // ${level.worldLabel}`, {
            fontFamily: 'monospace', fontSize: '16px', color: '#f4f0e6',
            backgroundColor: '#06080dcc', padding: { x: 10, y: 7 },
          }).setScrollFactor(0).setDepth(20)

          this.platforms = this.physics.add.staticGroup()
          for (let x = 80; x < 1800; x += 155) {
            const p = this.platforms.create(x, 500, 'platform')
            p.refreshBody()
          }

          const elevated = level.theme === 'gymnastics'
            ? [{x:420,y:410},{x:730,y:370},{x:1020,y:405},{x:1320,y:350}]
            : [{x:380,y:420},{x:700,y:390},{x:1050,y:420},{x:1350,y:375}]
          elevated.forEach(({x,y}) => {
            const p = this.platforms.create(x, y, 'platform')
            p.setScale(0.7, 1).refreshBody()
          })

          this.obstacles = this.physics.add.staticGroup()
          const obstacleXs = Array.from({length: level.obstacleCount}, (_, i) =>
            350 + i * Math.max(230, 1180 / Math.max(1, level.obstacleCount - 1))
          )
          obstacleXs.forEach(x => {
            const obstacle = this.obstacles.create(x, 468, 'obstacle')
            obstacle.refreshBody()
          })

          this.player = this.physics.add.sprite(95, 430, 'life-player')
          this.player.setCollideWorldBounds(true)
          this.player.setBounce(0.03)
          this.player.setDepth(10)
          this.physics.add.collider(this.player, this.platforms)
          this.physics.add.collider(this.player, this.obstacles)

          this.memories = this.physics.add.group({ allowGravity: false, immovable: true })
          level.memories.forEach((memory, i) => {
            const gymXs=[260,500,745,955,1180,1390,1570]
            const x = level.theme==='gymnastics'
              ? gymXs[Math.min(i,gymXs.length-1)]
              : 500 + i * Math.max(360, 760 / Math.max(1, level.memories.length))
            const y = level.theme==='gymnastics'
              ? (i<4 ? 330 : 300)
              : (i % 2 === 0 ? 368 : 330)
            const icon = this.memories.create(x, y, 'memory-' + i) as PhaserNS.Physics.Arcade.Sprite
            icon.setData('memory', memory)
            icon.setDepth(9)
            this.tweens.add({ targets: icon, y: y - 9, duration: 850, yoyo: true, repeat: -1, ease: 'Sine.InOut' })
          })

          this.goal = this.physics.add.sprite(1680, 425, 'goal')
          this.goal.setImmovable(true)
          ;(this.goal.body as PhaserNS.Physics.Arcade.Body).setAllowGravity(false)

          this.physics.add.overlap(this.player, this.memories, (_player, target) => {
            if (this.memoryCooldown || pausedRef.current) return
            const icon = target as PhaserNS.Physics.Arcade.Sprite
            const memory = icon.getData('memory') as LifeMemory
            this.memoryCooldown = true
            icon.disableBody(true, true)
            this.collectedCount += 1
            this.itemCounter?.setText(`ITEMS ${this.collectedCount}/${level.memories.length}`)
            this.physics.pause()
            setHint('STORY ITEM FOUND')
            onMemoryOpen(memory)
            this.time.delayedCall(300, () => { this.memoryCooldown = false })
          })

          this.physics.add.overlap(this.player, this.goal, () => {
            if (this.completed || pausedRef.current) return
            this.completed = true
            this.physics.pause()
            setHint('CHAPTER COMPLETE')
            this.time.delayedCall(250, () => onLevelComplete())
          })

          this.cameras.main.startFollow(this.player, true, 0.08, 0.08, -240, 40)
        }

        showMilestone(text: string) {
          const popup=this.add.text(theme.game.width/2,105,text.toUpperCase(),{
            fontFamily:'monospace',
            fontSize:'18px',
            color:'#f4f0e6',
            backgroundColor:'#080b14e8',
            padding:{x:14,y:9},
          }).setOrigin(0.5).setScrollFactor(0).setDepth(40).setAlpha(0)
          this.tweens.add({
            targets:popup,
            alpha:1,
            y:95,
            duration:220,
            ease:'Quad.Out',
            hold:850,
            yoyo:true,
            onComplete:()=>popup.destroy(),
          })
        }

        update() {
          if (pausedRef.current || this.completed || !this.player?.body) {
            if (this.player?.body) this.player.setVelocityX(0)
            return
          }

          if (this.progressFill) this.progressFill.scaleX = Math.max(0, Math.min(1, this.player.x / 1680))

          while(this.milestoneIndex<level.milestones.length && this.player.x>=level.milestones[this.milestoneIndex].x){
            this.showMilestone(level.milestones[this.milestoneIndex].text)
            this.milestoneIndex++
          }

          const speed = level.avatarStyle === 'baby' ? 205 : 225
          if (controls.current.left) {
            this.player.setVelocityX(-speed)
            this.player.setFlipX(true)
          } else if (controls.current.right) {
            this.player.setVelocityX(speed)
            this.player.setFlipX(false)
          } else {
            this.player.setVelocityX(0)
          }

          const body = this.player.body as PhaserNS.Physics.Arcade.Body
          const grounded = body.blocked.down || body.touching.down
          if (controls.current.jump && grounded) {
            this.player.setVelocityY(level.avatarStyle === 'baby' ? -500 : -525)
            controls.current.jump = false
          }
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        width: theme.game.width,
        height: theme.game.height,
        parent,
        transparent: true,
        physics: { default: 'arcade', arcade: { gravity: { x: 0, y: 760 }, debug: false } },
        scene: LifeScene,
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        render: { antialias: false, pixelArt: true },
      })
      gameRef.current = game
    })()

    return () => {
      cancelled = true
      controls.current = { left: false, right: false, jump: false }
      gameRef.current = null
      game?.destroy(true)
    }
  }, [levelIndex, level, onLevelComplete, onMemoryOpen, palette])

  useEffect(() => {
    const scene = gameRef.current?.scene.getScene('LifeScene') as PhaserNS.Scene | undefined
    if (!scene?.physics?.world) return
    if (paused) {
      scene.physics.world.pause()
      controls.current.left = false
      controls.current.right = false
      controls.current.jump = false
    } else {
      scene.physics.world.resume()
    }
  }, [paused])

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (key === 'a' || event.key === 'ArrowLeft') controls.current.left = true
      if (key === 'd' || event.key === 'ArrowRight') controls.current.right = true
      if (key === 'w' || event.key === 'ArrowUp' || event.key === ' ') controls.current.jump = true
    }
    const up = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (key === 'a' || event.key === 'ArrowLeft') controls.current.left = false
      if (key === 'd' || event.key === 'ArrowRight') controls.current.right = false
      if (key === 'w' || event.key === 'ArrowUp' || event.key === ' ') controls.current.jump = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  const press = (key: keyof typeof controls.current, value: boolean) => {
    controls.current[key] = value
  }

  return (
    <section className="life-game-shell">
      <div className="life-game-hud">
        <div>
          <span className="life-level-kicker">ACT II // HER STORY</span>
          <strong>{level.title}</strong>
          <small>{level.subtitle}</small>
        </div>
        <span>{levelIndex + 1}/{lifeLevels.length}</span>
      </div>
      <div className="life-stage-frame">
        <div className="life-photo-background" style={{backgroundImage:`url("${level.backgroundUrl}")`}} />
        <div className="life-photo-shade" />
        <div className="life-game-canvas" ref={mountRef} />
        <div className="life-photo-credit">{level.backgroundCredit}</div>
      </div>
      <div className="life-game-hint">{hint}</div>
      <div className="life-controls">
        <button onPointerDown={()=>press('left',true)} onPointerUp={()=>press('left',false)} onPointerLeave={()=>press('left',false)}>←</button>
        <button onPointerDown={()=>press('jump',true)} onPointerUp={()=>press('jump',false)} onPointerLeave={()=>press('jump',false)}>JUMP</button>
        <button onPointerDown={()=>press('right',true)} onPointerUp={()=>press('right',false)} onPointerLeave={()=>press('right',false)}>→</button>
      </div>
    </section>
  )
}

export function MemoryOverlay({ memory, onClose }: { memory: LifeMemory; onClose: () => void }) {
  const imgs = memory.photoKeys.map(key => media.photos[key as PhotoKey]).filter(Boolean)
  return (
    <div className="memory-overlay" role="dialog" aria-modal="true" aria-label={memory.title}>
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
  )
}

function getPalette(level: LifeLevel) {
  const palettes: Record<string,{sky:number;skyCss:string;ground:number;groundTop:number;obstacle:number;accent:number;accentSoft:number}> = {
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
