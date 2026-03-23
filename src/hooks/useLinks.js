import { useState, useEffect } from 'react'
const DEFAULTS = { twitter: '#', discord: '#', website: '#', bscscan: 'https://testnet.bscscan.com', bscscan_mainnet: 'https://bscscan.com' }
export function useLinks() {
  const [links, setLinks] = useState(DEFAULTS)
  useEffect(() => {
    fetch('/links.txt').then(r => r.text()).then(txt => {
      const p = { ...DEFAULTS }
      txt.split('\n').forEach(l => {
        const t = l.trim()
        if (!t || t.startsWith('#')) return
        const eq = t.indexOf('=')
        if (eq === -1) return
        const k = t.slice(0, eq).trim(), v = t.slice(eq + 1).trim()
        if (k && v) p[k] = v
      })
      setLinks(p)
    }).catch(() => {})
  }, [])
  return links
}
