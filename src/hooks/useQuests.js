/**
 * useQuests — reads /public/quests.txt
 * Format per line: URL | Title
 * If no title, shows URL slug
 * 1 click = done, points stored via usePoints
 */
import { useState, useEffect, useCallback } from 'react'

const KEY_DONE = addr => `sdx_quests_v3_${addr}`

function parseLine(line){
  const trimmed = line.trim()
  if(!trimmed||trimmed.startsWith('#')) return null
  const pipeIdx = trimmed.indexOf('|')
  if(pipeIdx===-1){
    // just URL
    const url = trimmed
    const tweetId = url.match(/status\/(\d+)/)?.[1]
    return { url, title: tweetId ? `Post #${tweetId.slice(-6)}` : url, pts:250 }
  }
  const url   = trimmed.slice(0,pipeIdx).trim()
  const title = trimmed.slice(pipeIdx+1).trim()
  return { url, title: title||url, pts:250 }
}

export function useQuests(account){
  const [quests,    setQuests]    = useState([])
  const [completed, setCompleted] = useState({})
  const [loading,   setLoading]   = useState(true)

  useEffect(()=>{
    fetch('/quests.txt')
      .then(r=>r.text())
      .then(txt=>{
        const parsed = txt.split('\n').map((l,i)=>{
          const q=parseLine(l)
          return q ? {...q, id:`tweet_${i}`} : null
        }).filter(Boolean)
        setQuests(parsed)
        setLoading(false)
      })
      .catch(()=>setLoading(false))
  },[])

  useEffect(()=>{
    if(!account) return
    try{
      const saved=JSON.parse(localStorage.getItem(KEY_DONE(account.toLowerCase()))||'{}')
      setCompleted(saved)
    }catch{ setCompleted({}) }
  },[account])

  // Returns points earned (0 if already done)
  const completeQuest = useCallback((id, url)=>{
    window.open(url,'_blank')
    if(!account||completed[id]) return 0
    const quest = quests.find(q=>q.id===id)
    const pts = quest?.pts||250
    const updated={...completed,[id]:{ts:Date.now(),pts}}
    localStorage.setItem(KEY_DONE(account.toLowerCase()), JSON.stringify(updated))
    setCompleted(updated)
    return pts
  },[account,completed,quests])

  const twitterEarned = Object.values(completed).reduce((a,v)=>a+(v?.pts||0),0)

  return { quests, completed, loading, completeQuest, twitterEarned }
}
