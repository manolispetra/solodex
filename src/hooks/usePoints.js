import { useState, useCallback, useEffect } from 'react'

const WEEK_MS = 7 * 24 * 60 * 60 * 1000
const KQ  = a => `sdx_v5_qpts_${a}`
const KC  = a => `sdx_v5_qclaimed_${a}`
const KTS = a => `sdx_v5_claimts_${a}`
const getN = k => { try { return Number(localStorage.getItem(k) || 0) } catch { return 0 } }
const setN = (k, v) => localStorage.setItem(k, String(v))

export function usePoints(account, onChainPoints = 0) {
  const addr = account?.toLowerCase() || null
  const [questPts,     setQuestPts]     = useState(0)
  const [questClaimed, setQuestClaimed] = useState(0)
  const [lastClaimTs,  setLastClaimTs]  = useState(0)

  useEffect(() => {
    if (!addr) { setQuestPts(0); setQuestClaimed(0); setLastClaimTs(0); return }
    setQuestPts(getN(KQ(addr)))
    setQuestClaimed(getN(KC(addr)))
    setLastClaimTs(getN(KTS(addr)))
  }, [addr])

  const addQuestPoints = useCallback(pts => {
    if (!addr || pts <= 0) return
    setQuestPts(prev => {
      const n = prev + pts
      setN(KQ(addr), n)
      return n
    })
  }, [addr])

  const markQuestsClaimed = useCallback(() => {
    if (!addr) return
    setQuestPts(prev => {
      setN(KQ(addr), prev); setN(KC(addr), prev); setN(KTS(addr), Date.now())
      setQuestClaimed(prev); setLastClaimTs(Date.now())
      return prev
    })
  }, [addr])

  const totalPoints       = (onChainPoints || 0) + questPts
  const claimableQuestPts = Math.max(0, questPts - questClaimed)
  const canClaimThisWeek  = Date.now() - lastClaimTs >= WEEK_MS
  const nextClaimMs       = Math.max(0, lastClaimTs + WEEK_MS - Date.now())

  return {
    questPts, questClaimed, onChainPoints,
    totalPoints, claimableQuestPts,
    canClaimThisWeek, nextClaimMs,
    addQuestPoints, markQuestsClaimed,
  }
}
