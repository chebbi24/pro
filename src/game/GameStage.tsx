import { useEffect, useRef } from 'react'
import type * as PhaserNS from 'phaser'
import { media } from '../content/media'
import { theme } from '../content/theme'

export type GameMode = 'encounter' | 'reveal' | 'drive' | 'rooftop' | 'finale'

type Props = {
  mode: GameMode
  onInteract?: () => void
  onDriveDone?: () => void
  reducedMotion?: boolean
  frozen?: boolean
}

export function GameStage({ mode, onInteract, onDriveDone, reducedMotion = false, frozen = false }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const controls = useRef({ left: false, right: false })

  useEffect(() => {
    let game: PhaserNS.Game | null = null
    let cancelled = false

    ;(async () => {
      const Phaser = await import('phaser')
      if (cancelled || !mountRef.current) return

      const faceUrl = media.photos.rayanFace
      const parent = mountRef.current

      class StoryScene extends Phaser.Scene {
        vigilante?: PhaserNS.GameObjects.Container
        heroine?: PhaserNS.GameObjects.Container
        car?: PhaserNS.GameObjects.Container
        driveFinished = false
        encounterTriggered = false

        constructor() {
          super('StoryScene')
        }

        preload() {
          if (mode === 'reveal') this.load.image('face', faceUrl)
        }

        makeSkyline(y: number, shade: number, alpha = 1) {
          const g = this.add.graphics().setAlpha(alpha)
          g.fillStyle(shade, 1)
          let x = 0
          while (x < theme.game.width + 80) {
            const w = Phaser.Math.Between(38, 92)
            const h = Phaser.Math.Between(70, 210)
            g.fillRect(x, y - h, w, h)
            x += w + Phaser.Math.Between(4, 12)
          }
          return g
        }

        addWindows() {
          const g = this.add.graphics().setAlpha(0.8)
          for (let i = 0; i < 110; i++) {
            g.fillStyle(i % 6 === 0 ? 0xf3c76b : 0x61709b, i % 4 === 0 ? 0.95 : 0.55)
            g.fillRect(Phaser.Math.Between(20, 940), Phaser.Math.Between(180, 410), 3, 5)
          }
        }

        addRain() {
          if (reducedMotion) return
          const g = this.add.graphics().setAlpha(0.34)
          g.lineStyle(1, 0xb7c5da, 1)
          for (let i = 0; i < 80; i++) {
            const x = Phaser.Math.Between(0, 960)
            const y = Phaser.Math.Between(-40, 540)
            g.lineBetween(x, y, x - 8, y + 25)
          }
          this.tweens.add({ targets: g, y: 35, duration: 750, repeat: -1, ease: 'Linear' })
        }

        addBatSignal() {
          const cone = this.add.graphics().setAlpha(0.24)
          cone.fillStyle(0xf6e8aa, 1)
          cone.fillTriangle(755, 118, 600, 485, 900, 485)

          const lamp = this.add.circle(755, 118, 62, 0xffefad, 0.2)
          lamp.setStrokeStyle(3, 0xffefad, 0.42)

          const bat = this.add.graphics()
          bat.fillStyle(0x111827, 0.95)
          bat.beginPath()
          bat.moveTo(720, 118)
          bat.lineTo(735, 108)
          bat.lineTo(744, 113)
          bat.lineTo(755, 98)
          bat.lineTo(766, 113)
          bat.lineTo(776, 108)
          bat.lineTo(790, 118)
          bat.lineTo(777, 120)
          bat.lineTo(770, 134)
          bat.lineTo(755, 125)
          bat.lineTo(740, 134)
          bat.lineTo(733, 120)
          bat.closePath()
          bat.fillPath()

          if (!reducedMotion) {
            this.tweens.add({ targets: [lamp, cone], alpha: { from: 0.18, to: 0.34 }, duration: 1400, yoyo: true, repeat: -1 })
          }
        }

        character(x: number, y: number, kind: 'bat' | 'cat', revealed = false) {
          const c = this.add.container(x, y)
          const isBat = kind === 'bat'
          const suit = isBat ? 0x2d3447 : 0x4a294f
          const suitLight = isBat ? 0x515d79 : 0x7c447f
          const black = 0x080b12

          const shadow = this.add.ellipse(0, 36, 48, 10, 0x000000, 0.45)

          const cape = isBat ? this.add.graphics() : null
          if (cape) {
            cape.fillStyle(black, 1)
            cape.beginPath()
            cape.moveTo(-10, -14)
            cape.lineTo(-34, 48)
            cape.lineTo(-16, 40)
            cape.lineTo(-3, 50)
            cape.lineTo(8, 10)
            cape.closePath()
            cape.fillPath()
          }

          const torso = this.add.rectangle(0, -1, 30, 58, suit).setStrokeStyle(2, suitLight, 0.9)
          const shoulders = this.add.rectangle(0, -20, 40, 12, suitLight, 0.45)
          const legs = this.add.rectangle(0, 30, 25, 26, suit).setStrokeStyle(1, suitLight, 0.75)
          const boots = this.add.rectangle(0, 43, 28, 8, black)
          const belt = this.add.rectangle(0, 12, 31, 5, isBat ? 0xd0a648 : 0xb991c2)

          const head = this.add.circle(0, -39, 18, isBat ? 0x121722 : 0x2b1830).setStrokeStyle(2, suitLight, 0.9)
          const ears = isBat
            ? [
                this.add.triangle(-9, -57, 0, 16, 7, 16, 4, 0, 0x121722),
                this.add.triangle(9, -57, 0, 16, 7, 16, 4, 0, 0x121722),
              ]
            : [
                this.add.triangle(-10, -58, 0, 16, 8, 16, 4, 0, 0x2b1830),
                this.add.triangle(10, -58, 0, 16, 8, 16, 4, 0, 0x2b1830),
              ]

          const eyes = [
            this.add.rectangle(-6, -40, 6, 2, isBat ? 0xeef3ff : 0xa7e8f6),
            this.add.rectangle(6, -40, 6, 2, isBat ? 0xeef3ff : 0xa7e8f6),
          ]

          const arms = [
            this.add.rectangle(-20, 2, 7, 42, suit).setStrokeStyle(1, suitLight),
            this.add.rectangle(20, 2, 7, 42, suit).setStrokeStyle(1, suitLight),
          ]

          c.add([shadow, cape, torso, shoulders, legs, boots, belt, head, ...ears, ...eyes, ...arms].filter(Boolean) as PhaserNS.GameObjects.GameObject[])

          if (isBat) {
            const emblem = this.add.graphics()
            emblem.fillStyle(0xe3bd59, 1)
            emblem.beginPath()
            emblem.moveTo(-11, -8)
            emblem.lineTo(-5, -13)
            emblem.lineTo(0, -9)
            emblem.lineTo(5, -13)
            emblem.lineTo(11, -8)
            emblem.lineTo(6, -6)
            emblem.lineTo(3, -1)
            emblem.lineTo(0, -4)
            emblem.lineTo(-3, -1)
            emblem.lineTo(-6, -6)
            emblem.closePath()
            emblem.fillPath()
            c.add(emblem)

            const gauntlets = [
              this.add.triangle(-23, 4, 0, 0, 7, 5, 0, 10, 0x111722),
              this.add.triangle(23, 4, 0, 0, 7, 5, 0, 10, 0x111722),
            ]
            c.add(gauntlets)
          } else {
            const zipper = this.add.rectangle(0, -2, 2, 45, 0xd5b8dc, 0.7)
            const goggles = this.add.rectangle(0, -42, 28, 7, 0x11141c, 0.7).setStrokeStyle(1, 0xa7e8f6, 0.9)
            const tail = this.add.graphics()
            tail.lineStyle(4, 0x4a294f, 1)
            tail.beginPath()
            tail.moveTo(13, 22)
            tail.lineTo(30, 20)
            tail.lineTo(36, 5)
            tail.strokePath()
            c.add([zipper, goggles, tail])
          }

          if (revealed && isBat) {
            const face = this.add.image(0, -39, 'face').setDisplaySize(28, 28)
            const mask = this.add.graphics()
            mask.fillStyle(0xffffff)
            mask.fillCircle(0, -39, 14)
            face.setMask(mask.createGeometryMask())
            c.add([face, mask])
          }
          return c
        }

        create() {
          const dawn = mode === 'rooftop' || mode === 'finale'
          this.cameras.main.setBackgroundColor(dawn ? 0x2a2434 : 0x090b14)

          if (dawn) {
            this.add.rectangle(480, 150, 960, 300, 0x6f5367).setAlpha(0.25)
            this.add.circle(760, 105, 58, 0xf4a77b, 0.45)
          } else {
            this.addBatSignal()
          }

          const far = this.makeSkyline(430, dawn ? 0x3b3040 : 0x18213a, 0.96)
          const near = this.makeSkyline(500, dawn ? 0x211b27 : 0x111827, 1)
          this.addWindows()
          this.add.rectangle(480, 505, 960, 70, 0x080b12)
          if (!dawn) this.addRain()

          if (mode === 'encounter') {
            const catX = frozen ? 640 : 125
            this.heroine = this.character(catX, 438, 'cat')
            this.vigilante = this.character(frozen ? 760 : 850, 438, 'bat')

            if (!frozen && this.vigilante) {
              this.tweens.add({
                targets: this.vigilante,
                x: 760,
                duration: reducedMotion ? 1 : 900,
                delay: reducedMotion ? 0 : 350,
                ease: 'Power2',
              })
            }
          }

          if (mode === 'reveal') {
            this.heroine = this.character(520, 438, 'cat')
            this.vigilante = this.character(420, 438, 'bat', true)
            const bang = this.add.text(520, 340, '!', {
              fontFamily: 'monospace', fontSize: '30px', color: '#f3c76b',
            }).setOrigin(0.5)
            if (!reducedMotion) this.tweens.add({ targets: bang, y: 330, duration: 450, yoyo: true, repeat: -1 })
          }

          if (mode === 'drive') {
            const car = this.add.container(-140, 450)
            const base = this.add.rectangle(0, 0, 120, 26, 0x0d111b).setStrokeStyle(2, 0x5d6b8d)
            const cabin = this.add.rectangle(6, -20, 62, 30, 0x141b2b).setStrokeStyle(1, 0x394763)
            const glow = this.add.rectangle(64, 3, 18, 5, 0xf3c76b)
            const wheels = [this.add.circle(-42, 18, 12, 0x05070c), this.add.circle(42, 18, 12, 0x05070c)]
            car.add([base, cabin, glow, ...wheels])
            this.car = car
            if (reducedMotion) {
              car.x = 520
              this.time.delayedCall(1000, () => onDriveDone?.())
            } else {
              this.tweens.add({ targets: far, x: -80, duration: 3400, ease: 'Linear' })
              this.tweens.add({ targets: near, x: -180, duration: 3400, ease: 'Linear' })
              this.tweens.add({ targets: car, x: 520, duration: 1600, ease: 'Power2' })
              this.time.delayedCall(3100, () => {
                if (!this.driveFinished) {
                  this.driveFinished = true
                  onDriveDone?.()
                }
              })
            }
          }

          if (mode === 'rooftop' || mode === 'finale') {
            this.vigilante = this.character(445, 438, 'bat')
            this.heroine = this.character(520, 438, 'cat')
            if (mode === 'finale' && !reducedMotion) {
              for (let i = 0; i < 24; i++) {
                const star = this.add.circle(
                  Phaser.Math.Between(110, 850),
                  Phaser.Math.Between(50, 300),
                  Phaser.Math.Between(2, 5),
                  [0xf3c76b, 0xdb6f90, 0x8f7cff][i % 3],
                  0.8,
                )
                this.tweens.add({
                  targets: star,
                  alpha: 0.1,
                  scale: 0.3,
                  duration: Phaser.Math.Between(500, 1200),
                  yoyo: true,
                  repeat: -1,
                })
              }
            }
          }
        }

        update() {
          if (mode !== 'encounter' || frozen || !this.heroine || this.encounterTriggered) return
          const speed = 3.2
          if (controls.current.left) this.heroine.x = Math.max(55, this.heroine.x - speed)
          if (controls.current.right) this.heroine.x = Math.min(655, this.heroine.x + speed)

          if (this.heroine.x >= 625) {
            this.encounterTriggered = true
            controls.current.left = false
            controls.current.right = false
            this.heroine.x = 625
            this.time.delayedCall(160, () => onInteract?.())
          }
        }
      }

      game = new Phaser.Game({
        type: Phaser.AUTO,
        width: theme.game.width,
        height: theme.game.height,
        parent,
        transparent: true,
        backgroundColor: '#090b14',
        scene: StoryScene,
        scale: { mode: Phaser.Scale.FIT, autoCenter: Phaser.Scale.CENTER_BOTH },
        render: { antialias: false, pixelArt: true },
      })
    })()

    return () => {
      cancelled = true
      game?.destroy(true)
    }
  }, [mode, onDriveDone, onInteract, reducedMotion, frozen])

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (key === 'a' || event.key === 'ArrowLeft') controls.current.left = true
      if (key === 'd' || event.key === 'ArrowRight') controls.current.right = true
    }
    const up = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (key === 'a' || event.key === 'ArrowLeft') controls.current.left = false
      if (key === 'd' || event.key === 'ArrowRight') controls.current.right = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  const press = (direction: 'left' | 'right', value: boolean) => {
    controls.current[direction] = value
  }

  return (
    <div className="game-shell" aria-label="Interactive Gotham game scene">
      <div className="game-mount" ref={mountRef} />
      {mode === 'encounter' && !frozen && (
        <div className="mobile-controls" aria-label="Game controls">
          <button
            type="button"
            onPointerDown={() => press('left', true)}
            onPointerUp={() => press('left', false)}
            onPointerCancel={() => press('left', false)}
            onPointerLeave={() => press('left', false)}
          >
            ←
          </button>
          <button
            type="button"
            onPointerDown={() => press('right', true)}
            onPointerUp={() => press('right', false)}
            onPointerCancel={() => press('right', false)}
            onPointerLeave={() => press('right', false)}
          >
            →
          </button>
        </div>
      )}
    </div>
  )
}
