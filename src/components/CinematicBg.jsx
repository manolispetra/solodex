import React, { useEffect, useRef } from 'react'

export default function CinematicBg() {
  const ref = useRef()
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let W, H, particles = [], animId

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Particles
    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * 1000, y: Math.random() * 1000,
        vx: (Math.random() - .5) * .25, vy: (Math.random() - .5) * .25,
        r: Math.random() * 1.4 + .3, o: Math.random() * .4 + .1,
        hue: Math.random() > .8 ? 160 : 145,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // Connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach(b => {
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d < 130) {
            ctx.strokeStyle = `rgba(34,197,94,${.06 * (1 - d / 130)})`
            ctx.lineWidth = .4
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke()
          }
        })
      })

      // Particles
      particles.forEach(p => {
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue},80%,55%,${p.o})`
        ctx.fill()
        p.x += p.vx; p.y += p.vy
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0
        if (p.y < 0) p.y = H; if (p.y > H) p.y = 0
      })

      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        opacity: .35,
      }}
    />
  )
}
