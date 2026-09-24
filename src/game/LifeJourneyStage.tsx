import { useEffect, useMemo, useRef, useState } from 'react'
import type * as PhaserNS from 'phaser'
import { lifeLevels, type LifeLevel, type LifeMemory } from '../content/lifeLevels'
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
  const controls = useRef({ left: false, right: false, jump: false })
  const level = lifeLevels[levelIndex]
  const [hint, setHint] = useState('MOVE · JUMP · TOUCH THE MEMORY ICONS')

  const palette = useMemo(() => getPalette(level), [level])

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
          const scale = level.avatarStage === 'baby' ? 0.72 : level.avatarStage === 'teen' ? 0.88 : 1
          const w = Math.round(44 * scale)
          const h = Math.round(70 * scale)
          this.createTexture('life-player', g => {
            g.fillStyle(0x08090d, 1)
            g.fillRoundedRect(8 * scale, 18 * scale, 28 * scale, 40 * scale, 7 * scale)
            g.fillStyle(0x11131a, 1)
            g.fillCircle(22 * scale, 14 * scale, 12 * scale)
            g.fillTriangle(13 * scale, 6 * scale, 17 * scale, 0, 19 * scale, 9 * scale)
            g.fillTriangle(25 * scale, 9 * scale, 27 * scale, 0, 31 * scale, 6 * scale)
            g.fillStyle(0x86dbea, 1)
            g.fillRect(15 * scale, 13 * scale, 6 * scale, 2 * scale)
            g.fillRect(24 * scale, 13 * scale, 6 * scale, 2 * scale)
            g.fillStyle(0x6f4a79, 1)
            g.fillRect(12 * scale, 39 * scale, 20 * scale, 2 * scale)
            g.lineStyle(Math.max(2, 3 * scale), 0x0a0b0f, 1)
            g.beginPath()
            g.moveTo(32 * scale, 43 * scale)
            g.lineTo(42 * scale, 38 * scale)
            g.lineTo(43 * scale, 28 * scale)
            g.strokePath()
          }, w, h)
        }

        createWorldTextures() {
          this.createTexture('platform', g => {
            g.fillStyle(palette.ground, 1)
            g.fillRect(0, 0, 160, 24)
            g.fillStyle(palette.groundTop, 1)
            g.fillRect(0, 0, 160, 5)
          }, 160, 24)

          this.createTexture('obstacle', g => {
            g.fillStyle(palette.obstacle, 1)
            g.fillRect(0, 10, 32, 22)
            g.fillStyle(palette.accent, 0.9)
            g.fillTriangle(0, 10, 8, 0, 16, 10)
            g.fillTriangle(10, 10, 18, 0, 26, 10)
            g.fillTriangle(20, 10, 26, 2, 32, 10)
          }, 32, 32)

          this.createTexture('memory', g => {
            g.fillStyle(palette.accent, 0.16)
            g.fillCircle(24, 24, 23)
            g.lineStyle(3, palette.accent, 1)
            g.strokeCircle(24, 24, 18)
            g.fillStyle(palette.accent, 1)
            g.fillRect(19, 14, 10, 20)
            g.fillTriangle(13, 25, 24, 14, 24, 36)
            g.fillTriangle(35, 25, 24, 14, 24, 36)
          }, 48, 48)

          this.createTexture('goal', g => {
            g.fillStyle(palette.accent, 1)
            g.fillRect(4, 0, 4, 62)
            g.fillStyle(palette.accentSoft, 1)
            g.fillTriangle(8, 4, 36, 14, 8, 24)
          }, 40, 64)
        }

        drawBackdrop() {
          this.cameras.main.setBackgroundColor(palette.sky)
          const back = this.add.graphics()

          if (level.theme === 'tunis-baby') {
            back.fillStyle(0xdcbf8f, 1)
            for (let i = 0; i < 11; i++) {
              back.fillRect(i * 110, 320 - (i % 3) * 22, 85, 140 + (i % 3) * 22)
              back.fillStyle(0x4d7d6a, 1)
              back.fillRect(i * 110 + 24, 350, 9, 70)
              back.fillCircle(i * 110 + 29, 340, 20)
              back.fillStyle(0xdcbf8f, 1)
            }
          } else if (level.theme === 'gymnastics' || level.theme === 'champion') {
            back.fillStyle(0xd9e0ed, 1)
            back.fillRect(0, 120, 1800, 350)
            back.lineStyle(3, palette.accent, 0.35)
            for (let x = 0; x < 1800; x += 120) back.lineBetween(x, 150, x, 455)
            for (let y = 170; y < 450; y += 70) back.lineBetween(0, y, 1800, y)
            if (level.theme === 'champion') {
              for (let i = 0; i < 6; i++) {
                back.fillStyle(0xd3aa3c, 1)
                back.fillCircle(260 + i * 240, 180, 18)
                back.fillRect(254 + i * 240, 198, 12, 36)
              }
            }
          } else if (level.theme === 'usa') {
            back.fillStyle(0x21304c, 1)
            for (let i = 0; i < 12; i++) {
              back.fillRect(i * 140, 260 - (i % 4) * 24, 90, 200 + (i % 4) * 24)
            }
            back.fillStyle(0x9a2d35, 0.7)
            back.fillRect(1160, 110, 180, 15)
            back.fillStyle(0xf4f0e6, 0.75)
            back.fillRect(1160, 125, 180, 15)
            back.fillStyle(0x263b72, 0.8)
            back.fillRect(1160, 110, 60, 60)
          } else if (level.theme === 'coach') {
            back.fillStyle(0xefe6dc, 1)
            back.fillRect(0, 150, 1800, 320)
            for (let i = 0; i < 8; i++) {
              back.fillStyle(i % 2 ? 0xf4b7c3 : 0xbcccf1, 0.9)
              back.fillCircle(260 + i * 150, 330, 15)
              back.fillRect(250 + i * 150, 345, 20, 45)
            }
          } else if (level.theme === 'meet-breakup') {
            back.fillStyle(0x3c2941, 1)
            back.fillStyle(0xe56a8c, 0.6)
            for (let i = 0; i < 10; i++) back.fillCircle(160 + i * 170, 210 + (i % 2) * 30, 8)
            back.lineStyle(2, 0xe56a8c, 0.28)
            back.lineBetween(0, 290, 1800, 290)
          } else if (level.theme === 'paris' || level.theme === 'birthday-reunion' || level.theme === 'paris-romance') {
            back.fillStyle(0x243149, 1)
            for (let i = 0; i < 13; i++) back.fillRect(i * 130, 270 - (i % 3) * 25, 90, 190 + (i % 3) * 25)
            back.fillStyle(0x101820, 1)
            back.fillTriangle(780, 430, 880, 145, 980, 430)
            back.fillRect(867, 170, 26, 260)
            if (level.theme === 'birthday-reunion') {
              back.fillStyle(0xffd86f, 0.28)
              back.fillCircle(880, 170, 135)
            }
          } else if (level.theme === 'milan') {
            back.fillStyle(0xdbc8ad, 1)
            back.fillRect(0, 180, 1800, 290)
            back.fillStyle(0xb6a084, 1)
            for (let i = 0; i < 18; i++) back.fillTriangle(i * 100, 220, i * 100 + 35, 150, i * 100 + 70, 220)
          } else if (level.theme === 'como') {
            back.fillStyle(0x94bed6, 1)
            back.fillRect(0, 320, 1800, 150)
            back.fillStyle(0x557a6f, 1)
            for (let i = 0; i < 7; i++) back.fillTriangle(i * 300, 350, i * 300 + 140, 120 + (i % 2) * 70, i * 300 + 300, 350)
          } else if (level.theme === 'etretat') {
            back.fillStyle(0x8fb4c2, 1)
            back.fillRect(0, 320, 1800, 150)
            back.fillStyle(0xe3dfd4, 1)
            back.fillRect(960, 180, 360, 250)
            back.fillStyle(palette.sky, 1)
            back.fillCircle(1080, 330, 110)
          } else if (level.theme === 'mallorca') {
            back.fillStyle(0x59b7cc, 1)
            back.fillRect(0, 340, 1800, 130)
            back.fillStyle(0xf1d59d, 1)
            back.fillRect(0, 300, 1800, 70)
            back.fillStyle(0xf7c66f, 0.85)
            back.fillCircle(1430, 120, 65)
          }
        }

        create() {
          this.physics.world.setBounds(0, 0, 1800, theme.game.height)
          this.cameras.main.setBounds(0, 0, 1800, theme.game.height)

          this.drawBackdrop()
          this.createPlayerTexture()
          this.createWorldTextures()

          this.add.text(28, 26, `LEVEL ${String(level.order).padStart(2, '0')} // ${level.worldLabel}`, {
            fontFamily: 'monospace',
            fontSize: '16px',
            color: '#f4f0e6',
            backgroundColor: '#06080dcc',
            padding: { x: 10, y: 7 },
          }).setScrollFactor(0).setDepth(20)

          this.add.text(28, 62, level.title, {
            fontFamily: 'monospace',
            fontSize: '12px',
            color: '#f3c76b',
            backgroundColor: '#06080dcc',
            padding: { x: 8, y: 5 },
          }).setScrollFactor(0).setDepth(20)

          this.platforms = this.physics.add.staticGroup()
          for (let x = 80; x < 1800; x += 155) {
            const p = this.platforms.create(x, 500, 'platform')
            p.refreshBody()
          }

          const elevated = [
            { x: 380, y: 420 },
            { x: 700, y: 385 },
            { x: 1050, y: 420 },
            { x: 1350, y: 365 },
          ]
          elevated.forEach(({ x, y }) => {
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
            const x = 520 + i * Math.max(360, 760 / Math.max(1, level.memories.length))
            const y = i % 2 === 0 ? 368 : 330
            const icon = this.memories.create(x, y, 'memory') as PhaserNS.Physics.Arcade.Sprite
            icon.setData('memory', memory)
            icon.setDepth(9)
            this.tweens.add({ targets: icon, y: y - 9, duration: 850, yoyo: true, repeat: -1, ease: 'Sine.InOut' })
          })

          this.goal = this.physics.add.sprite(1690, 435, 'goal')
          this.goal.setImmovable(true)
          ;(this.goal.body as PhaserNS.Physics.Arcade.Body).setAllowGravity(false)

          this.physics.add.overlap(this.player, this.memories, (_player, target) => {
            if (this.memoryCooldown || paused) return
            const icon = target as PhaserNS.Physics.Arcade.Sprite
            const memory = icon.getData('memory') as LifeMemory
            this.memoryCooldown = true
            icon.disableBody(true, true)
            this.physics.pause()
            setHint('MEMORY FOUND')
            onMemoryOpen(memory)
            this.time.delayedCall(450, () => { this.memoryCooldown = false })
          })

          this.physics.add.overlap(this.player, this.goal, () => {
            if (this.completed || paused) return
            this.completed = true
            this.physics.pause()
            setHint('LEVEL COMPLETE')
            this.time.delayedCall(300, () => onLevelComplete())
          })

          this.cameras.main.startFollow(this.player, true, 0.08, 0.08, -240, 40)
        }

        update() {
          if (paused || this.completed || !this.player?.body) {
            if (this.player?.body) this.player.setVelocityX(0)
            return
          }

          const speed = level.avatarStage === 'baby' ? 205 : 220
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
            this.player.setVelocityY(level.avatarStage === 'baby' ? -500 : -525)
            controls.current.jump = false
          }

          if (this.player.y > 560) {
            this.player.setPosition(Math.max(90, this.player.x - 120), 420)
            this.player.setVelocity(0, 0)
          }
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        width: theme.game.width,
        height: theme.game.height,
        parent,
        backgroundColor: palette.skyCss,
        physics: {
          default: 'arcade',
          arcade: { gravity: { x: 0, y: 760 }, debug: false },
        },
        scene: LifeScene,
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        render: { antialias: false, pixelArt: true },
      })
      gameRef.current = game
    })()

    return () => {
      cancelled = true
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
      <div className="life-game-canvas" ref={mountRef} />
      <div className="life-game-hint">{hint}</div>
      <div className="life-controls">
        <button
          onPointerDown={() => press('left', true)}
          onPointerUp={() => press('left', false)}
          onPointerLeave={() => press('left', false)}
          onPointerCancel={() => press('left', false)}
        >←</button>
        <button
          onPointerDown={() => press('jump', true)}
          onPointerUp={() => press('jump', false)}
          onPointerLeave={() => press('jump', false)}
          onPointerCancel={() => press('jump', false)}
        >JUMP</button>
        <button
          onPointerDown={() => press('right', true)}
          onPointerUp={() => press('right', false)}
          onPointerLeave={() => press('right', false)}
          onPointerCancel={() => press('right', false)}
        >→</button>
      </div>
    </section>
  )
}

export function MemoryOverlay({ memory, onClose }: { memory: LifeMemory; onClose: () => void }) {
  const imgs = memory.photoKeys.map(key => media.photos[key as PhotoKey]).filter(Boolean)
  return (
    <div className="memory-overlay" role="dialog" aria-modal="true" aria-label={memory.title}>
      <div className="memory-panel">
        <div className="memory-panel-top">
          <span>MEMORY PAUSED</span>
          <button onClick={onClose} aria-label="Close memory">×</button>
        </div>
        <div className="memory-gallery">
          {imgs.map((src, i) => (
            <figure key={src + i} className={'memory-shot shot-' + i}>
              <img src={src} alt={memory.title + ' photo ' + (i + 1)} />
              <figcaption>MEMORY // {String(i + 1).padStart(2, '0')}</figcaption>
            </figure>
          ))}
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
  const palettes: Record<string, { sky: number; skyCss: string; ground: number; groundTop: number; obstacle: number; accent: number; accentSoft: number }> = {
    'tunis-baby': { sky: 0x8eb6c8, skyCss: '#8eb6c8', ground: 0x6f5d42, groundTop: 0xc8a96e, obstacle: 0x3f6c5d, accent: 0xf3c76b, accentSoft: 0xffe3a4 },
    gymnastics: { sky: 0xcad6e8, skyCss: '#cad6e8', ground: 0x6f7490, groundTop: 0xe8d0e8, obstacle: 0xb26b97, accent: 0x8f5bbb, accentSoft: 0xe3b5ff },
    champion: { sky: 0x18233b, skyCss: '#18233b', ground: 0x242d43, groundTop: 0xd3aa3c, obstacle: 0x6a2132, accent: 0xf3c76b, accentSoft: 0xffdf80 },
    usa: { sky: 0x0e1d36, skyCss: '#0e1d36', ground: 0x323b4c, groundTop: 0xb5434e, obstacle: 0x454f63, accent: 0xe25c67, accentSoft: 0xf6a0a7 },
    coach: { sky: 0xe8dcd0, skyCss: '#e8dcd0', ground: 0x97806c, groundTop: 0xd8aac4, obstacle: 0x8a6680, accent: 0xbd6d9d, accentSoft: 0xefbad8 },
    'meet-breakup': { sky: 0x2b2034, skyCss: '#2b2034', ground: 0x312237, groundTop: 0xe56a8c, obstacle: 0x5a344c, accent: 0xf07c9c, accentSoft: 0xffb2c6 },
    paris: { sky: 0x25344d, skyCss: '#25344d', ground: 0x31333b, groundTop: 0xe1c48e, obstacle: 0x6b5d5d, accent: 0xf0c675, accentSoft: 0xffe3a3 },
    'birthday-reunion': { sky: 0x101726, skyCss: '#101726', ground: 0x242739, groundTop: 0xffce69, obstacle: 0x463a55, accent: 0xffd86f, accentSoft: 0xffedb5 },
    'paris-romance': { sky: 0x2b2035, skyCss: '#2b2035', ground: 0x2a2330, groundTop: 0xe1819d, obstacle: 0x56354a, accent: 0xf198ad, accentSoft: 0xffc7d3 },
    milan: { sky: 0xc8b59d, skyCss: '#c8b59d', ground: 0x756955, groundTop: 0xe0c095, obstacle: 0x6e5445, accent: 0xe0b365, accentSoft: 0xffdc9c },
    como: { sky: 0x8fb6cb, skyCss: '#8fb6cb', ground: 0x516e66, groundTop: 0xcac08b, obstacle: 0x547066, accent: 0xf2d77a, accentSoft: 0xffedaa },
    etretat: { sky: 0x83adbd, skyCss: '#83adbd', ground: 0x6e746e, groundTop: 0xe3dfd4, obstacle: 0x9b9a91, accent: 0xf1d690, accentSoft: 0xffefb8 },
    mallorca: { sky: 0x53afc2, skyCss: '#53afc2', ground: 0xb68b57, groundTop: 0xf0d18f, obstacle: 0x936d4b, accent: 0xffd26a, accentSoft: 0xffe5a4 },
  }
  return palettes[level.theme]
}
