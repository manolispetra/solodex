import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import s from '../styles/Claim.module.css'

function useCountdown(ts) {
  const [left, setLeft] = useState(0)
  useEffect(() => {
    const tick = () => setLeft(Math.max(0, ts * 1000 - Date.now()))
    tick(); const t = setInterval(tick, 1000)
    return () => clearInterval(t)
  }, [ts])
  return left
}

function fmtMs(ms) {
  if (ms <= 0) return null
  const sec = Math.floor(ms / 1000)
  const d = Math.floor(sec / 86400)
  const h = Math.floor((sec % 86400) / 3600)
  const m = Math.floor((sec % 3600) / 60)
  if (d > 0) return `${d}d ${h}h ${m}m`
  if (h > 0) return `${h}h ${m}m`
  return `${m}m ${sec % 60}s`
}

export default function SDXClaimPanel({ wallet, dex, points }) {
  const [onChainClaimable, setOnChainClaimable] = useState(0n)
  const [contractNextTs,   setContractNextTs]   = useState(0)
  const [success,          setSuccess]          = useState(false)
  const [loading,          setLoading]          = useState(false)

  // Contract cooldown countdown
  const contractCountdown = useCountdown(contractNextTs)

  const loadContract = async () => {
    if (!dex.dex || !wallet.account) return
    try {
      setOnChainClaimable(await dex.dex.claimableSDX(wallet.account))
      setContractNextTs(Number(await dex.dex.nextClaimTime(wallet.account)))
    } catch {}
  }

  useEffect(() => { loadContract() }, [dex.dex, wallet.account, dex.userInfo?.totalPoints])

  // ── Combined totals ──────────────────────────────────────
  // On-chain unclaimed (from contract)
  const onChainPts = dex.userInfo
    ? dex.userInfo.totalPoints - (dex.userInfo.claimedPoints || 0)
    : 0

  // Off-chain quest points not yet claimed
  const questPts = points?.claimableQuestPts || 0

  // Total claimable this week
  const totalClaimable = onChainPts + questPts

  // Weekly window: use the STRICTER of contract cooldown vs local cooldown
  // (they should align after first combined claim)
  const localCooldownMs = points?.nextClaimMs || 0
  const contractCooldownMs = contractCountdown

  // Can claim if BOTH cooldowns are done (or one is 0 = no activity yet)
  const onChainReady  = onChainPts > 0 && contractCountdown === 0
  const questReady    = questPts > 0 && (points?.canClaimThisWeek ?? true)
  const canClaim      = (onChainReady || questReady) && totalClaimable > 0

  // Show the longer countdown as the wait time
  const waitMs = Math.max(contractCooldownMs, localCooldownMs)

  const handleClaim = async () => {
    if (!wallet.account) return
    setLoading(true)
    try {
      // 1. Claim on-chain points if available
      if (onChainPts > 0 && contractCountdown === 0 && dex.dex) {
        const tx = await dex.dex.claimWeeklySDX()
        await tx.wait()
        await dex.refreshUser()
      }

      // 2. Mark quest points as claimed (regardless of on-chain)
      if (questPts > 0 && points?.markQuestsClaimed) {
        points.markQuestsClaimed()
      }

      setSuccess(true)
      await loadContract()
      setTimeout(() => setSuccess(false), 4000)
    } catch(e) {
      console.error(e)
    }
    setLoading(false)
  }

  const isConnected = wallet.account && wallet.isCorrectNetwork
  const isRegistered = dex.userInfo?.registered

  return (
    <div className={s.panel}>
      <div className={s.header}>
        <h2 className={s.title}>Weekly SDX Claim</h2>
        <span className={s.freq}>1× per week</span>
      </div>

      <p className={s.desc}>
        All your points — swaps, staking, liquidity, quests — accumulate here and
        can be minted as real SDX tokens once per week.
      </p>

      <div className={s.box}>
        {/* On-chain breakdown */}
        <div className={s.row}>
          <span className="dim">On-chain points (swaps, staking, LP)</span>
          <span className="mono">{onChainPts.toLocaleString()}</span>
        </div>

        {/* Quest points */}
        <div className={s.row}>
          <span className="dim">Quest points (early tester, Twitter)</span>
          <span className="mono" style={{color: questPts > 0 ? 'var(--green)' : 'var(--text-dim)'}}>
            {questPts.toLocaleString()}
          </span>
        </div>

        <div className={s.divider}/>

        <div className={s.row}>
          <span style={{color:'var(--white)',fontWeight:500}}>Total claimable this week</span>
          <span className="mono" style={{color:'var(--green)',fontSize:20,fontWeight:500}}>
            {totalClaimable.toLocaleString()} SDX
          </span>
        </div>

        {/* Cooldown timer */}
        <div className={s.timer}>
          <span className="dim" style={{fontSize:11}}>Next claim window</span>
          <span className={`${s.timerVal} ${waitMs === 0 ? s.ready : ''}`}>
            {waitMs === 0
              ? (totalClaimable > 0 ? 'Ready to claim' : 'No points yet')
              : fmtMs(waitMs) || 'Available now'}
          </span>
        </div>

        {success && (
          <div className={s.success}>
            ✓ {totalClaimable.toLocaleString()} SDX claimed successfully!
          </div>
        )}

        <button
          className={`${s.btn} ${canClaim && isConnected && isRegistered ? s.btnReady : ''}`}
          onClick={handleClaim}
          disabled={!isConnected || !isRegistered || !canClaim || loading}
        >
          {!isConnected     ? 'Connect Wallet'
           : !isRegistered  ? 'Register First'
           : loading        ? 'Processing…'
           : waitMs > 0     ? `Next claim in ${fmtMs(waitMs)}`
           : totalClaimable === 0 ? 'No points to claim'
           : `Claim ${totalClaimable.toLocaleString()} SDX`}
        </button>
      </div>

      {/* Lifetime stats */}
      {dex.userInfo && (
        <div className={s.statsRow}>
          <div className={s.statItem}>
            <span className={s.statVal}>{dex.userInfo.totalPoints.toLocaleString()}</span>
            <span className={s.statLabel}>Total earned (all time)</span>
          </div>
          <div className={s.statItem}>
            <span className={s.statVal}>{(dex.userInfo.claimedPoints || 0).toLocaleString()}</span>
            <span className={s.statLabel}>Already minted</span>
          </div>
          <div className={s.statItem}>
            <span className={s.statVal}>{(points?.questPts || 0).toLocaleString()}</span>
            <span className={s.statLabel}>Quest points (lifetime)</span>
          </div>
        </div>
      )}

      <p className={s.note}>
        After claiming, your SDX balance is visible at{' '}
        <a href="https://testnet.bscscan.com" target="_blank" rel="noreferrer">
          testnet.bscscan.com
        </a>.
        The team uses on-chain balances for the mainnet airdrop.
      </p>
    </div>
  )
}
