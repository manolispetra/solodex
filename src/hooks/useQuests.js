import { useState, useEffect, useCallback } from 'react'
const KEY = a => `sdx_v5_quests_${a}`

function parseLine(line) {
  const t = line.trim()
  if (!t || t.startsWith('#')) return null
  const pipe = t.indexOf('|')
  if (pipe === -1) {
    const id = t.match(/status\/(\d+)/)?.[1]
    return { url: t, title: id ? `Post #${id.slice(-6)}` : t.slice(0, 40), pts: 250, id: `q_${t.slice(-12)}` }
  }
  const url   = t.slice(0, pipe).trim()
  const title = t.slice(pipe + 1).trim()
  return { url, title: title || url.slice(0, 40), pts: 250, id: `q_${url.slice(-12)}` }
}

export function useQuests(account) {
  const [quests,    setQuests]    = useState([])
  const [completed, setCompleted] = useState({})
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    fetch('/quests.txt').then(r => r.text()).then(txt => {
      setQuests(txt.split('\n').map(parseLine).filter(Boolean))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!account) return
    try { setCompleted(JSON.parse(localStorage.getItem(KEY(account.toLowerCase())) || '{}')) }
    catch { setCompleted({}) }
  }, [account])

  const completeQuest = useCallback((id, url) => {
    window.open(url, '_blank')
    if (!account || completed[id]) return 0
    const q = quests.find(x => x.id === id)
    const pts = q?.pts || 250
    const updated = { ...completed, [id]: { ts: Date.now(), pts } }
    localStorage.setItem(KEY(account.toLowerCase()), JSON.stringify(updated))
    setCompleted(updated)
    return pts
  }, [account, completed, quests])

  return { quests, completed, loading, completeQuest }
}
