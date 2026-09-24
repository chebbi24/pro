import { useEffect, useRef, useState } from 'react'
import type * as PhaserNS from 'phaser'
import { media } from '../content/media'
import { theme } from '../content/theme'

export type GameMode = 'encounter' | 'reveal' | 'drive' | 'rooftop' | 'finale'

type Props = {
  mode: GameMode
  onReadyToInteract?: () => void
  onInteract?: () => void
  onDriveDone?: () => void
  reducedMotion?: boolean
}

export function GameStage({ mode, onReadyToInteract, onInteract, onDriveDone, reducedMotion = false }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null)
  const controls = useRef({ left: false, right: false })
  const canInteractRef = useRef(false)
  const [canInteract, setCanInteract] = useState(false)

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
        interactLabel?: PhaserNS.GameObjects.Text
        driveFinished = false

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
          const g = this.add.graphics().setAlpha(0.65)
          for (let i = 0; i < 100; i++) {
            g.fillStyle(i % 5 === 0 ? 0xf3c76b : 0x48577f, i % 4 === 0 ? 0.9 : 0.45)
            g.fillRect(Phaser.Math.Between(20, 940), Phaser.Math.Between(180, 410), 3, 5)
          }
        }

        addRain() {
          if (reducedMotion) return
          const g = this.add.graphics().setAlpha(0.28)
          g.lineStyle(1, 0x91a6c4, 1)
          for (let i = 0; i < 80; i++) {
            const x = Phaser.Math.Between(0, 960)
            const y = Phaser.Math.Between(-40, 540)
            g.lineBetween(x, y, x - 8, y + 25)
          }
          this.tweens.add({ targets: g, y: 35, duration: 750, repeat: -1, ease: 'Linear' })
        }

        character(x: number, y: number, kind: 'bat' | 'cat', revealed = false) {
          const c = this.add.container(x, y)
          const shadow = this.add.ellipse(0, 34, 38, 9, 0x000000, 0.35)
          const body = this.add.rectangle(0, 0, 23, 53, kind === 'bat' ? 0x131826 : 0x251b2f)
          const legs = this.add.rectangle(0, 30, 19, 22, kind === 'bat' ? 0x0f1420 : 0x1d1525)
          const head = this.add.circle(0, -35, 15, kind === 'bat' ? 0x101521 : 0x24172e)
          const cape = kind === 'bat' ? this.add.triangle(-7, 4, 0, 0, -34, 52, 2, 46, 0x090d17) : null
          const ears = kind === 'cat'
            ? [this.add.triangle(-8, -50, 0, 12, 8, 12, 4, 0, 0x24172e), this.add.triangle(8, -50, 0, 12, 8, 12, 4, 0, 0x24172e)]
            : [this.add.triangle(-8, -50, 0, 12, 8, 12, 4, 0, 0x101521), this.add.triangle(8, -50, 0, 12, 8, 12, 4, 0, 0x101521)]
          const belt = this.add.rectangle(0, 10, 25, 4, kind === 'bat' ? 0xc39a42 : 0x6e5c7f)
          const eye = this.add.rectangle(kind === 'bat' ? 4 : -4, -36, 4, 2, 0xe7eaf2)
          c.add([shadow, cape, body, legs, head, ...ears, belt, eye].filter(Boolean) as PhaserNS.GameObjects.GameObject[])
          if (revealed && kind === 'bat') {
            const face = this.add.image(0, -35, 'face').setDisplaySize(24, 24)
            const mask = this.add.graphics()
            mask.fillStyle(0xffffff)
            mask.fillCircle(0, -35, 12)
            face.setMask(mask.createGeometryMask())
            c.add([face, mask])
          }
          return c
        }

        create() {
          const bg = mode === 'rooftop' || mode === 'finale' ? 0x2a2434 : 0x090b14
          this.cameras.main.setBackgroundColor(bg)

          if (mode === 'rooftop' || mode === 'finale') {
            this.add.rectangle(480, 150, 960, 300, 0x6f5367).setAlpha(0.25)
            this.add.circle(760, 105, 58, 0xf4a77b, 0.45)
          } else {
            this.add.circle(760, 105, 58, 0xd5d9e8, 0.16)
          }

          const far = this.makeSkyline(430, mode === 'rooftop' || mode === 'finale' ? 0x3b3040 : 0x12182a, 0.9)
          const near = this.makeSkyline(500, mode === 'rooftop' || mode === 'finale' ? 0x211b27 : 0x0d1220, 1)
          this.addWindows()
          this.add.rectangle(480, 505, 960, 70, 0x070912)
          if (mode !== 'rooftop' && mode !== 'finale') this.addRain()

          if (mode === 'encounter') {
            this.vigilante = this.character(125, 438, 'bat')
            this.heroine = this.character(790, 438, 'cat')
            this.interactLabel = this.add.text(790, 340, 'INTERACT', {
              fontFamily: 'monospace', fontSize: '13px', color: '#f3c76b', backgroundColor: '#090b14cc', padding: { x: 8, y: 5 },
            }).setOrigin(0.5).setVisible(false)
          }

          if (mode === 'reveal') {
            this.vigilante = this.character(410, 438, 'bat', true)
            this.heroine = this.character(550, 438, 'cat')
            const bang = this.add.text(550, 345, '!', { fontFamily: 'monospace', fontSize: '28px', color: '#f3c76b' }).setOrigin(0.5)
            if (!reducedMotion) this.tweens.add({ targets: bang, y: 334, duration: 450, yoyo: true, repeat: -1 })
          }

          if (mode === 'drive') {
            const car = this.add.container(-140, 450)
            const base = this.add.rectangle(0, 0, 120, 26, 0x0d111b).setStrokeStyle(2, 0x434d66)
            const cabin = this.add.rectangle(6, -20, 62, 30, 0x141b2b)
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
                const star = this.add.circle(Phaser.Math.Between(110, 850), Phaser.Math.Between(50, 300), Phaser.Math.Between(2, 5), [0xf3c76b, 0xdb6f90, 0x8f7cff][i % 3], 0.8)
                this.tweens.add({ targets: star, alpha: 0.1, scale: 0.3, duration: Phaser.Math.Between(500, 1200), yoyo: true, repeat: -1 })
              }
            }
          }
        }

        update() {
          if (mode !== 'encounter' || !this.vigilante) return
          const speed = 3.3
          if (controls.current.left) this.vigilante.x = Math.max(55, this.vigilante.x - speed)
          if (controls.current.right) this.vigilante.x = Math.min(755, this.vigilante.x + speed)
          const ready = this.vigilante.x > 690
          if (ready !== canInteractRef.current) {
            canInteractRef.current = ready
            setCanInteract(ready)
            this.interactLabel?.setVisible(ready)
            if (ready) onReadyToInteract?.()
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
  }, [mode, onDriveDone, onReadyToInteract, reducedMotion])

  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase()
      if (key === 'a' || event.key === 'ArrowLeft') controls.current.left = true
      if (key === 'd' || event.key === 'ArrowRight') controls.current.right = true
      if ((event.key === ' ' || event.key === 'Enter') && canInteractRef.current) onInteract?.()
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
  }, [onInteract])

  const press = (direction: 'left' | 'right', value: boolean) => {
    controls.current[direction] = value
  }

  return (
    <div className="game-shell" aria-label="Interactive Gotham game scene">
      <div className="game-mount" ref={mountRef} />
      {mode === 'encounter' && (
        <div className="mobile-controls" aria-label="Game controls">
          <button type="button" onPointerDown={() => press('left', true)} onPointerUp={() => press('left', false)} onPointerCancel={() => press('left', false)} onPointerLeave={() => press('left', false)}>←</button>
          <button type="button" className="interact" disabled={!canInteract} onClick={() => canInteract && onInteract?.()}>INTERACT</button>
          <button type="button" onPointerDown={() => press('right', true)} onPointerUp={() => press('right', false)} onPointerCancel={() => press('right', false)} onPointerLeave={() => press('right', false)}>→</button>
        </div>
      )}
    </div>
  )
}
