import { useEffect, useRef } from "react"

interface Tuft { x: number; h: number; lean: number; phase: number; alpha: number }
interface Bloom { x: number; y: number; s: number; petals: number; color: string; phase: number; glow: number }
interface Fly { x: number; y: number; turn: number; phase: number; pulse: number }
interface Bush { x: number; y: number; blobs: { dx: number; dy: number; r: number }[] }

const FLOWER_COLORS = ["#34d399", "#f97316", "#60a5fa", "#f472b6"]

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max)

function makeBush(x: number, y: number): Bush {
  const n = 3 + Math.floor(Math.random() * 3)
  const blobs = []
  for (let i = 0; i < n; i++) {
    blobs.push({
      dx: (i - (n - 1) / 2) * 16 + (Math.random() - 0.5) * 8,
      dy: -(Math.random() * 10),
      r: 12 + Math.random() * 14,
    })
  }
  return { x, y, blobs }
}

export default function GardenBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let W = 0
    let H = 0
    let groundH = 0
    let raf = 0
    let disposed = false

    const tufts: Tuft[] = []
    const blooms: Bloom[] = []
    const bushes: Bush[] = []
    const flies: Fly[] = []

    const mouse = { x: -9999, y: -9999, last: 0 }
    const duck = {
      x: 120, y: 0, dir: 1, bob: 0, peck: 0, wing: 0, moving: false,
      targetX: 120, targetY: 0, wanderAt: 0, restUntil: 0,
      quackAt: 0, quackAfter: 0, quackAlpha: 0,
    }

    let overlay: CanvasGradient | null = null

    const build = () => {
      W = window.innerWidth
      H = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.floor(W * dpr)
      canvas.height = Math.floor(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      groundH = Math.min(170, H * 0.22)

      tufts.length = 0
      blooms.length = 0
      bushes.length = 0
      flies.length = 0

      for (let x = 0; x < W; x += 12) {
        tufts.push({
          x: x + Math.random() * 8,
          h: 7 + Math.random() * 20,
          lean: (Math.random() - 0.5) * 10,
          phase: Math.random() * Math.PI * 2,
          alpha: 0.08 + Math.random() * 0.2,
        })
      }

      const bloomCount = Math.max(8, Math.round(W / 130))
      for (let i = 0; i < bloomCount; i++) {
        blooms.push({
          x: Math.random() * W,
          y: H - groundH + 12 + Math.random() * (groundH - 28),
          s: 3 + Math.random() * 3,
          petals: 5 + Math.floor(Math.random() * 2),
          color: FLOWER_COLORS[i % FLOWER_COLORS.length],
          phase: Math.random() * Math.PI * 2,
          glow: 0,
        })
      }

      bushes.push(makeBush(80, H - 24), makeBush(W - 100, H - 18))

      const flyCount = Math.min(42, Math.max(14, Math.round((W * H) / 42000)))
      for (let i = 0; i < flyCount; i++) {
        flies.push({
          x: Math.random() * W,
          y: Math.random() * H,
          turn: Math.random() * Math.PI * 2,
          phase: Math.random() * Math.PI * 2,
          pulse: Math.random() * Math.PI * 2,
        })
      }

      duck.x = clamp(duck.x, 60, W - 60)
      duck.y = H - groundH + 34
      duck.targetX = duck.x
      duck.targetY = duck.y
      duck.wanderAt = 0

      overlay = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, Math.max(W, H) * 0.72)
      overlay.addColorStop(0, "rgba(9,9,11,0.6)")
      overlay.addColorStop(0.55, "rgba(9,9,11,0.38)")
      overlay.addColorStop(1, "rgba(9,9,11,0.08)")
    }

    const stepDuck = (dt: number, now: number) => {
      const mouseActive = now - mouse.last < 5000

      if (mouseActive) {
        duck.targetX = clamp(mouse.x, 46, W - 46)
        duck.targetY = clamp(mouse.y + 44, H - groundH + 12, H - 44)
      } else if (now > duck.wanderAt) {
        duck.wanderAt = now + 5000 + Math.random() * 4000
        duck.targetX = 60 + Math.random() * (W - 120)
        duck.targetY = H - groundH + 20 + Math.random() * (groundH - 74)
      }

      const dx = duck.targetX - duck.x
      const dy = duck.targetY - duck.y
      const d = Math.hypot(dx, dy)

      if (duck.restUntil > now && d < 26) {
        duck.moving = false
      } else if (d > 22) {
        const speed = mouseActive ? 130 : 46
        const step = Math.min(d, speed * dt)
        duck.x += (dx / d) * step
        duck.y += (dy / d) * step * 0.9
        if (Math.abs(dx) > 2) duck.dir = dx > 0 ? 1 : -1
        duck.bob += dt * 14
        duck.wing += dt * (mouseActive ? 20 : 9)
        duck.moving = true
      } else {
        duck.moving = false
        duck.wing += dt * 2
        if (!mouseActive && duck.restUntil < now) duck.restUntil = now + 1500 + Math.random() * 2500
      }

      duck.x = clamp(duck.x, 24, W - 24)
      duck.y = clamp(duck.y, H - groundH + 12, H - 44)

      if (!duck.moving) duck.peck += dt * 2.4

      if (
        mouseActive &&
        Math.hypot(mouse.x - duck.x, mouse.y - duck.y) < 80 &&
        now > duck.quackAt
      ) {
        duck.quackAt = now + 8000 + Math.random() * 9000
        duck.quackAfter = now + 250
      }
      const quackTarget = now > duck.quackAfter && now < duck.quackAfter + 1800 ? 1 : 0
      duck.quackAlpha += (quackTarget - duck.quackAlpha) * Math.min(1, dt * 6)
    }

    const stepFlies = (dt: number, now: number) => {
      const mouseActive = now - mouse.last < 5000
      for (const f of flies) {
        f.turn += (Math.random() - 0.5) * 5 * dt
        f.x += Math.cos(f.turn) * 24 * dt
        f.y += Math.sin(f.turn) * 17 * dt
        f.phase += dt

        if (mouseActive) {
          const mdx = mouse.x - f.x
          const mdy = mouse.y - f.y
          const md = Math.hypot(mdx, mdy) || 1
          if (md < 170) {
            f.x += (mdx / md) * 20 * dt
            f.y += (mdy / md) * 20 * dt
          }
        }

        if (f.x < 24) { f.turn = 0; f.x = 24 }
        if (f.x > W - 24) { f.turn = Math.PI; f.x = W - 24 }
        if (f.y < 24) { f.turn = Math.PI / 2; f.y = 24 }
        if (f.y > H - 24) { f.turn = -Math.PI / 2; f.y = H - 24 }
      }
    }

    const drawBush = (bush: Bush, t: number) => {
      const sway = Math.sin(t * 0.9 + bush.x) * 1.2
      for (const bl of bush.blobs) {
        ctx.beginPath()
        ctx.arc(bush.x + bl.dx + sway, bush.y + bl.dy, bl.r, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(6,78,59,0.5)"
        ctx.fill()
        ctx.strokeStyle = "rgba(16,185,129,0.18)"
        ctx.lineWidth = 1
        ctx.stroke()
      }
      ctx.fillStyle = "rgba(52,211,153,0.45)"
      for (let i = 0; i < bush.blobs.length * 2; i++) {
        const bl = bush.blobs[i % bush.blobs.length]
        ctx.beginPath()
        ctx.arc(
          bush.x + bl.dx + sway + Math.cos(i * 2.4) * bl.r * 0.4,
          bush.y + bl.dy + Math.sin(i * 1.7) * bl.r * 0.4,
          1.5, 0, Math.PI * 2
        )
        ctx.fill()
      }
    }

    const draw = (t: number) => {
      ctx.clearRect(0, 0, W, H)

      const gTop = H - groundH
      const soil = ctx.createLinearGradient(0, gTop, 0, H)
      soil.addColorStop(0, "rgba(24,24,27,0)")
      soil.addColorStop(0.25, "rgba(24,24,27,0.7)")
      soil.addColorStop(1, "rgba(24,24,27,0.95)")
      ctx.fillStyle = soil
      ctx.fillRect(0, gTop, W, groundH)
      ctx.fillStyle = "rgba(39,39,42,0.5)"
      ctx.fillRect(0, gTop, W, 1)

      ctx.strokeStyle = "rgba(9,9,11,0.3)"
      ctx.lineWidth = 1
      for (let y = gTop + 18; y < H; y += 18) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
        ctx.stroke()
      }

      ctx.lineWidth = 1.2
      for (const tf of tufts) {
        const sway = Math.sin(t * 1.3 + tf.phase) * 2.2
        ctx.strokeStyle = `rgba(16,185,129,${tf.alpha})`
        ctx.beginPath()
        ctx.moveTo(tf.x, gTop + 2)
        ctx.quadraticCurveTo(tf.x + tf.lean * 0.5, gTop - tf.h * 0.6, tf.x + tf.lean + sway, gTop - tf.h)
        ctx.stroke()
      }

      for (const b of blooms) {
        const near = Math.hypot(mouse.x - b.x, mouse.y - b.y) < 130
        b.glow += ((near ? 1 : 0) - b.glow) * 0.08
        const sway = Math.sin(t * 1.1 + b.phase) * (2 + b.s * 0.4)
        const topX = b.x + sway
        const topY = b.y - b.s * 6

        ctx.strokeStyle = "rgba(52,211,153,0.35)"
        ctx.lineWidth = 1.2
        ctx.beginPath()
        ctx.moveTo(b.x, b.y)
        ctx.quadraticCurveTo(b.x + sway * 0.4, b.y - b.s * 3, topX, topY)
        ctx.stroke()

        ctx.strokeStyle = "rgba(16,185,129,0.25)"
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.ellipse(b.x + b.s * 0.9, b.y - b.s * 2.4, b.s * 0.9, b.s * 0.35, -0.6, 0, Math.PI * 2)
        ctx.stroke()

        if (b.glow > 0.02) {
          ctx.shadowColor = b.color
          ctx.shadowBlur = 12 * b.glow
        }
        ctx.fillStyle = b.color
        ctx.globalAlpha = 0.5 + b.glow * 0.5
        for (let p = 0; p < b.petals; p++) {
          const ang = (p / b.petals) * Math.PI * 2 + b.phase + t * 0.12
          ctx.beginPath()
          ctx.arc(topX + Math.cos(ang) * b.s * 0.95, topY + Math.sin(ang) * b.s * 0.95, b.s * 0.62, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.shadowBlur = 0
        ctx.globalAlpha = 1
        ctx.fillStyle = "#f97316"
        ctx.beginPath()
        ctx.arc(topX, topY, b.s * 0.38, 0, Math.PI * 2)
        ctx.fill()
      }

      drawBush(bushes[0], t)
      drawBush(bushes[1], t)

      for (let i = 0; i < flies.length; i++) {
        const a = flies[i]
        for (let j = i + 1; j < flies.length; j++) {
          const b = flies[j]
          const dx = a.x - b.x
          const dy = a.y - b.y
          const d2 = dx * dx + dy * dy
          if (d2 < 110 * 110) {
            const alpha = (1 - Math.sqrt(d2) / 110) * 0.3
            ctx.strokeStyle = `rgba(52,211,153,${alpha})`
            ctx.lineWidth = 0.7
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.stroke()
          }
        }
        const mdx = mouse.x - a.x
        const mdy = mouse.y - a.y
        const md = Math.hypot(mdx, mdy)
        if (md < 150) {
          ctx.strokeStyle = `rgba(249,115,22,${(1 - md / 150) * 0.4})`
          ctx.lineWidth = 0.7
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(mouse.x, mouse.y)
          ctx.stroke()
        }
      }

      for (const f of flies) {
        const glow = 0.55 + Math.sin(t * 2.2 + f.pulse) * 0.45
        ctx.shadowColor = "#34d399"
        ctx.shadowBlur = 9 * glow
        ctx.fillStyle = `rgba(52,211,153,${0.35 + glow * 0.55})`
        ctx.beginPath()
        ctx.arc(f.x, f.y, 1.6, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0
      }

      if (overlay) {
        ctx.fillStyle = overlay
        ctx.fillRect(0, 0, W, H)
      }

      const headDip = duck.moving ? 0 : Math.max(0, Math.sin(duck.peck)) ** 3
      const bobY = duck.moving ? Math.sin(duck.bob) * 1.6 : 0
      const chasing = performance.now() - mouse.last < 5000

      ctx.save()
      ctx.translate(duck.x, duck.y + bobY)
      ctx.scale(duck.dir, 1)
      if (duck.moving) ctx.rotate(Math.sin(duck.bob) * 0.06)

      ctx.strokeStyle = "#f97316"
      ctx.lineWidth = 1.6
      if (duck.moving) {
        const s1 = Math.sin(duck.bob * 2) * 4
        ctx.beginPath(); ctx.moveTo(-5, 8); ctx.lineTo(-5 + s1, 12); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(3, 8); ctx.lineTo(3 - s1, 12); ctx.stroke()
      } else {
        ctx.beginPath(); ctx.moveTo(-5, 8); ctx.lineTo(-6, 12); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(3, 8); ctx.lineTo(3, 12); ctx.stroke()
      }

      ctx.fillStyle = "#d6d3d1"
      ctx.beginPath()
      ctx.moveTo(-14, -1)
      ctx.quadraticCurveTo(-21, -7, -17, 2)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = "#e7e5e4"
      ctx.beginPath()
      ctx.ellipse(0, 0, 13, 9, 0, 0, Math.PI * 2)
      ctx.fill()

      ctx.save()
      ctx.translate(-1, -1)
      ctx.rotate(0.2 - Math.sin(duck.wing) * (duck.moving ? (chasing ? 0.75 : 0.35) : 0))
      ctx.fillStyle = "#d6d3d1"
      ctx.beginPath()
      ctx.ellipse(-2, 0, 8, 5, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      const hx = 10 + headDip * 3
      const hy = -9 + headDip * 6
      ctx.fillStyle = "#e7e5e4"
      ctx.beginPath()
      ctx.arc(hx, hy, 6, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = "#f97316"
      ctx.beginPath()
      ctx.moveTo(hx + 5, hy - 1)
      ctx.lineTo(hx + 12, hy + 0.5)
      ctx.lineTo(hx + 5, hy + 2)
      ctx.closePath()
      ctx.fill()

      ctx.fillStyle = "#18181b"
      ctx.beginPath()
      ctx.arc(hx + 2.5, hy - 2.5, 1.2, 0, Math.PI * 2)
      ctx.fill()

      ctx.restore()

      if (duck.quackAlpha > 0.02) {
        ctx.save()
        ctx.globalAlpha = duck.quackAlpha
        ctx.font = "11px 'Fira Code', monospace"
        const text = "quack!"
        const tw = ctx.measureText(text).width
        const bx = clamp(duck.x + duck.dir * 26, tw / 2 + 10, W - tw / 2 - 10)
        const by = clamp(duck.y - 42, 16, H - 16)
        const bw = tw + 16
        ctx.fillStyle = "rgba(24,24,27,0.92)"
        ctx.strokeStyle = "rgba(63,63,70,0.9)"
        ctx.lineWidth = 1
        ctx.beginPath()
        if (ctx.roundRect) {
          ctx.roundRect(bx - bw / 2, by - 10, bw, 20, 6)
        } else {
          ctx.rect(bx - bw / 2, by - 10, bw, 20)
        }
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = "#a1a1aa"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(text, bx, by + 0.5)
        ctx.restore()
      }
    }

    let prev = performance.now()
    const frame = (now: number) => {
      if (disposed) return
      const dt = Math.min((now - prev) / 1000, 0.05)
      prev = now
      if (!document.hidden) {
        const t = now / 1000
        stepDuck(dt, now)
        stepFlies(dt, now)
        draw(t)
      }
      raf = requestAnimationFrame(frame)
    }

    const onResize = () => {
      build()
      if (reducedMotion) draw(0)
    }
    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX
      mouse.y = e.clientY
      mouse.last = performance.now()
    }
    const onLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
    }

    build()

    if (reducedMotion) {
      draw(0)
      window.addEventListener("resize", onResize)
      return () => {
        disposed = true
        window.removeEventListener("resize", onResize)
      }
    }

    window.addEventListener("resize", onResize)
    window.addEventListener("pointermove", onMove)
    document.documentElement.addEventListener("pointerleave", onLeave)
    raf = requestAnimationFrame(frame)

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      window.removeEventListener("resize", onResize)
      window.removeEventListener("pointermove", onMove)
      document.documentElement.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="garden-canvas" aria-hidden="true" />
}
