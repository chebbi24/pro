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
        batArrivalStarted = false

        constructor() {
          super('StoryScene')
        }

        preload() {
          if (mode === 'reveal') this.load.image('face', `${faceUrl}?v=19`)
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
          const g = this.add.graphics().setAlpha(0.82)
          for (let i = 0; i < 115; i++) {
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

        addBatSignal(animated = false) {
          const signal = this.add.container(0, 0).setAlpha(animated && !reducedMotion ? 0 : 1)

          const cone = this.add.graphics().setAlpha(0.30)
          cone.fillStyle(0xffefad, 1)
          cone.fillTriangle(755, 112, 598, 485, 910, 485)

          const halo = this.add.circle(755, 112, 74, 0xfff0ad, 0.13)
          const lamp = this.add.circle(755, 112, 60, 0xffefad, 0.28)
          lamp.setStrokeStyle(3, 0xfff1b5, 0.58)

          const bat = this.add.graphics()
          bat.fillStyle(0x080b12, 0.98)
          bat.beginPath()
          bat.moveTo(716, 112)
          bat.lineTo(731, 102)
          bat.lineTo(743, 108)
          bat.lineTo(755, 92)
          bat.lineTo(767, 108)
          bat.lineTo(779, 102)
          bat.lineTo(794, 112)
          bat.lineTo(780, 116)
          bat.lineTo(771, 132)
          bat.lineTo(755, 124)
          bat.lineTo(739, 132)
          bat.lineTo(730, 116)
          bat.closePath()
          bat.fillPath()

          signal.add([cone, halo, lamp, bat])

          if (animated && !reducedMotion) {
            this.tweens.add({
              targets: signal,
              alpha: 1,
              duration: 220,
              ease: 'Power2',
            })
            this.tweens.add({
              targets: [halo, lamp],
              alpha: { from: 0.08, to: 0.42 },
              duration: 260,
              yoyo: true,
              repeat: 2,
              ease: 'Sine.InOut',
            })
            this.tweens.add({
              targets: signal,
              scaleX: { from: 0.92, to: 1 },
              scaleY: { from: 0.92, to: 1 },
              duration: 340,
              ease: 'Back.Out',
            })
          } else if (!reducedMotion) {
            this.tweens.add({
              targets: [halo, lamp, cone],
              alpha: { from: 0.20, to: 0.34 },
              duration: 1500,
              yoyo: true,
              repeat: -1,
            })
          }

          return signal
        }

        character(x: number, y: number, kind: 'bat' | 'cat', revealed = false) {
          const c = this.add.container(x, y)
          const isBat = kind === 'bat'
          const suit = isBat ? 0x2e3547 : 0x08090d
          const suitLight = isBat ? 0x66728e : 0x3b3f49
          const black = 0x05070b

          const shadow = this.add.ellipse(0, 37, 50, 10, 0x000000, 0.5)

          const cape = isBat ? this.add.graphics() : null
          if (cape) {
            cape.fillStyle(black, 1)
            cape.beginPath()
            cape.moveTo(-10, -16)
            cape.lineTo(-38, 50)
            cape.lineTo(-20, 42)
            cape.lineTo(-7, 52)
            cape.lineTo(7, 11)
            cape.closePath()
            cape.fillPath()
          }

          const torso = this.add.rectangle(0, -2, isBat ? 32 : 27, 58, suit).setStrokeStyle(2, suitLight, isBat ? 0.9 : 0.75)
          const chestPanel = this.add.rectangle(0, -9, isBat ? 27 : 22, 26, isBat ? 0x374056 : 0x0f1117, 0.95)
          const shoulders = this.add.rectangle(0, -23, isBat ? 42 : 34, 11, isBat ? 0x4a556f : 0x151820, 0.9)
          const hips = this.add.rectangle(0, 17, isBat ? 27 : 23, 14, suit)
          const leftLeg = this.add.rectangle(-7, 34, isBat ? 11 : 9, 30, suit).setStrokeStyle(1, suitLight, 0.55)
          const rightLeg = this.add.rectangle(7, 34, isBat ? 11 : 9, 30, suit).setStrokeStyle(1, suitLight, 0.55)
          const boots = [
            this.add.rectangle(-7, 49, isBat ? 13 : 11, 8, black),
            this.add.rectangle(7, 49, isBat ? 13 : 11, 8, black),
          ]
          const belt = this.add.rectangle(0, 12, isBat ? 32 : 27, 5, isBat ? 0xd0a648 : 0x6a6d74)

          const head = this.add.circle(0, -43, isBat ? 18 : 16, isBat ? 0x111620 : 0x06070a).setStrokeStyle(2, suitLight, 0.85)
          const ears = isBat
            ? [
                this.add.triangle(-9, -62, 0, 18, 7, 18, 4, 0, 0x111620),
                this.add.triangle(9, -62, 0, 18, 7, 18, 4, 0, 0x111620),
              ]
            : [
                this.add.triangle(-9, -60, 0, 17, 8, 17, 4, 0, 0x06070a),
                this.add.triangle(9, -60, 0, 17, 8, 17, 4, 0, 0x06070a),
              ]

          const eyeColor = isBat ? 0xeef3ff : 0xaeefff
          const eyes = [
            this.add.rectangle(-5.5, -44, 5, 2, eyeColor),
            this.add.rectangle(5.5, -44, 5, 2, eyeColor),
          ]

          const arms = [
            this.add.rectangle(-21, 1, isBat ? 8 : 6, 42, suit).setStrokeStyle(1, suitLight),
            this.add.rectangle(21, 1, isBat ? 8 : 6, 42, suit).setStrokeStyle(1, suitLight),
          ]

          c.add([
            shadow,
            cape,
            torso,
            chestPanel,
            shoulders,
            hips,
            leftLeg,
            rightLeg,
            ...boots,
            belt,
            head,
            ...ears,
            ...eyes,
            ...arms,
          ].filter(Boolean) as PhaserNS.GameObjects.GameObject[])

          if (isBat) {
            const emblemOval = this.add.ellipse(0, -9, 25, 11, 0xd8b14e, 0.95)
            const emblem = this.add.graphics()
            emblem.fillStyle(0x10141d, 1)
            emblem.beginPath()
            emblem.moveTo(-10, -9)
            emblem.lineTo(-5, -13)
            emblem.lineTo(0, -10)
            emblem.lineTo(5, -13)
            emblem.lineTo(10, -9)
            emblem.lineTo(6, -7)
            emblem.lineTo(3, -3)
            emblem.lineTo(0, -6)
            emblem.lineTo(-3, -3)
            emblem.lineTo(-6, -7)
            emblem.closePath()
            emblem.fillPath()
            c.add([emblemOval, emblem])

            const gauntlets = [
              this.add.triangle(-25, 4, 0, 0, 8, 5, 0, 11, 0x111722),
              this.add.triangle(25, 4, 0, 0, 8, 5, 0, 11, 0x111722),
            ]
            c.add(gauntlets)
          } else {
            const zipper = this.add.rectangle(0, -2, 1.5, 44, 0xc7cad1, 0.62)
            const gogglesBand = this.add.rectangle(0, -45, 27, 7, 0x111319, 0.95)
            const goggles = [
              this.add.ellipse(-7, -45, 9, 5, 0x7ccddd, 0.75),
              this.add.ellipse(7, -45, 9, 5, 0x7ccddd, 0.75),
            ]
            const gloves = [
              this.add.rectangle(-21, 17, 7, 10, 0x11131a),
              this.add.rectangle(21, 17, 7, 10, 0x11131a),
            ]
            const tail = this.add.graphics()
            tail.lineStyle(4, 0x090a0e, 1)
            tail.beginPath()
            tail.moveTo(12, 22)
            tail.lineTo(30, 19)
            tail.lineTo(38, 6)
            tail.lineTo(34, -2)
            tail.strokePath()
            const purpleAccent = this.add.rectangle(0, 12, 22, 2, 0x6f4a79, 0.85)
            c.add([zipper, gogglesBand, ...goggles, ...gloves, tail, purpleAccent])
          }

          if (revealed && isBat) {
            // Use the real uploaded face photo directly. The previous tiny geometry mask
            // could hide/crop the image depending on the renderer.
            const faceBacking = this.add.circle(0, -43, 24, 0x080b12)
              .setStrokeStyle(3, 0xd0a648, 0.95)
            const face = this.add.image(0, -43, 'face')
              .setDisplaySize(40, 40)
              .setOrigin(0.5)
            const cowlTop = this.add.graphics()
            cowlTop.fillStyle(0x0b1018, 1)
            cowlTop.fillTriangle(-22, -60, -13, -78, -7, -59)
            cowlTop.fillTriangle(22, -60, 13, -78, 7, -59)
            c.add([faceBacking, face, cowlTop])
          }
          return c
        }

        createBatmobile() {
          const car = this.add.container(-190, 446)

          const body = this.add.graphics()
          body.fillStyle(0x07090d, 1)
          body.lineStyle(2, 0x3d4658, 1)
          body.beginPath()
          body.moveTo(-92, 12)
          body.lineTo(-80, -4)
          body.lineTo(-46, -13)
          body.lineTo(-22, -30)
          body.lineTo(24, -30)
          body.lineTo(48, -15)
          body.lineTo(78, -10)
          body.lineTo(96, 4)
          body.lineTo(88, 18)
          body.lineTo(-82, 18)
          body.closePath()
          body.fillPath()
          body.strokePath()

          const canopy = this.add.graphics()
          canopy.fillStyle(0x182232, 1)
          canopy.lineStyle(2, 0x4d617c, 0.85)
          canopy.beginPath()
          canopy.moveTo(-25, -28)
          canopy.lineTo(-7, -48)
          canopy.lineTo(27, -46)
          canopy.lineTo(48, -19)
          canopy.closePath()
          canopy.fillPath()
          canopy.strokePath()

          const leftFin = this.add.triangle(-62, -14, 0, 30, 10, 0, 22, 30, 0x090b10)
          const rightFin = this.add.triangle(58, -15, 0, 30, 11, 0, 23, 30, 0x090b10)
          const rearWing = this.add.rectangle(-70, -22, 46, 5, 0x0a0c12).setStrokeStyle(1, 0x3a4353)

          const intake = this.add.graphics()
          intake.fillStyle(0x020305, 1)
          intake.fillTriangle(66, -3, 91, 4, 66, 10)

          const wheels = [
            this.add.circle(-58, 18, 20, 0x020305).setStrokeStyle(4, 0x242a35),
            this.add.circle(58, 18, 20, 0x020305).setStrokeStyle(4, 0x242a35),
          ]
          const hubs = [
            this.add.circle(-58, 18, 7, 0x596277),
            this.add.circle(58, 18, 7, 0x596277),
          ]

          const headlightL = this.add.rectangle(78, -3, 15, 4, 0xf5d774)
          const headlightR = this.add.rectangle(88, 2, 8, 3, 0xe9bc4c)

          const turbine = this.add.circle(-92, 4, 10, 0x141923).setStrokeStyle(2, 0x566177)
          const exhaustGlow = this.add.ellipse(-111, 4, 24, 8, 0x6ca6ff, 0.42)

          const batNose = this.add.graphics()
          batNose.fillStyle(0x111722, 1)
          batNose.beginPath()
          batNose.moveTo(80, -11)
          batNose.lineTo(91, -20)
          batNose.lineTo(87, -6)
          batNose.lineTo(98, -2)
          batNose.lineTo(85, 1)
          batNose.closePath()
          batNose.fillPath()

          car.add([
            exhaustGlow,
            body,
            canopy,
            leftFin,
            rightFin,
            rearWing,
            intake,
            ...wheels,
            ...hubs,
            headlightL,
            headlightR,
            turbine,
            batNose,
          ])

          if (!reducedMotion) {
            this.tweens.add({
              targets: exhaustGlow,
              scaleX: { from: 0.8, to: 1.35 },
              alpha: { from: 0.25, to: 0.55 },
              duration: 240,
              yoyo: true,
              repeat: -1,
            })
          }

          return car
        }

        summonBatman() {
          if (this.batArrivalStarted || frozen) return
          this.batArrivalStarted = true
          controls.current.left = false
          controls.current.right = false

          this.addBatSignal(true)

          this.time.delayedCall(reducedMotion ? 80 : 480, () => {
            this.vigilante = this.character(695, 250, 'bat')
            this.vigilante.setAlpha(reducedMotion ? 1 : 0)

            const capeBurst = this.add.graphics().setAlpha(reducedMotion ? 0 : 0.75)
            capeBurst.fillStyle(0x080b12, 1)
            capeBurst.fillTriangle(660, 250, 695, 205, 730, 250)

            if (reducedMotion) {
              if (this.vigilante) this.vigilante.y = 438
              capeBurst.destroy()
              this.time.delayedCall(120, () => onInteract?.())
              return
            }

            this.tweens.add({
              targets: this.vigilante,
              alpha: 1,
              y: 438,
              duration: 760,
              ease: 'Cubic.In',
              onComplete: () => {
                if (!this.vigilante) return
                this.tweens.add({
                  targets: this.vigilante,
                  y: 431,
                  duration: 110,
                  yoyo: true,
                  ease: 'Quad.Out',
                  onComplete: () => {
                    this.time.delayedCall(240, () => onInteract?.())
                  },
                })
              },
            })

            this.tweens.add({
              targets: capeBurst,
              y: 170,
              alpha: 0,
              scaleX: 1.5,
              duration: 700,
              ease: 'Power2',
              onComplete: () => capeBurst.destroy(),
            })
          })
        }

        create() {
          const dawn = mode === 'rooftop' || mode === 'finale'
          this.cameras.main.setBackgroundColor(dawn ? 0x2a2434 : 0x090b14)

          if (dawn) {
            this.add.rectangle(480, 150, 960, 300, 0x6f5367).setAlpha(0.25)
            this.add.circle(760, 105, 58, 0xf4a77b, 0.45)
          } else if (!(mode === 'encounter' && !frozen)) {
            this.addBatSignal(false)
          }

          const far = this.makeSkyline(430, dawn ? 0x3b3040 : 0x18213a, 0.96)
          const near = this.makeSkyline(500, dawn ? 0x211b27 : 0x111827, 1)
          this.addWindows()
          this.add.rectangle(480, 505, 960, 70, 0x080b12)
          if (!dawn) this.addRain()

          if (mode === 'encounter') {
            if (frozen) {
              this.heroine = this.character(455, 438, 'cat')
              this.vigilante = this.character(695, 438, 'bat')
            } else {
              this.heroine = this.character(110, 438, 'cat')
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
            this.car = this.createBatmobile()
            if (reducedMotion) {
              this.car.x = 520
              this.time.delayedCall(1000, () => onDriveDone?.())
            } else {
              this.tweens.add({ targets: far, x: -80, duration: 3400, ease: 'Linear' })
              this.tweens.add({ targets: near, x: -180, duration: 3400, ease: 'Linear' })
              this.tweens.add({ targets: this.car, x: 530, duration: 1700, ease: 'Power3.Out' })
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
          if (controls.current.right) this.heroine.x = Math.min(455, this.heroine.x + speed)

          if (this.heroine.x >= 450) {
            this.encounterTriggered = true
            controls.current.left = false
            controls.current.right = false
            this.heroine.x = 455
            this.summonBatman()
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
