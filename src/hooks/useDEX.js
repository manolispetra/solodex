import { useState, useCallback, useEffect } from 'react'
import { ethers } from 'ethers'
import DEPLOYMENTS_RAW from '../deployments.json'

const D = DEPLOYMENTS_RAW || {}

const DEX_ABI = [
  "function register(bytes32) external",
  "function userReferralCode(address) view returns (bytes32)",
  "function userStats(address) view returns (uint256 totalPoints, uint256 claimedPoints, uint256 lastWeeklyClaim, uint256 swapsCount, address referrer, bool registered, bool questDiscord, bool questTwitterFollow, bool questTelegram, bool questEarlyTester, uint256 twitterEngagementPts)",
  "function currentStreak(address) view returns (uint256)",
  "function claimWeeklySDX() external",
  "function nextClaimTime(address) view returns (uint256)",
  "function claimableSDX(address) view returns (uint256)",
  "function getPoolId(address,address) pure returns (bytes32)",
  "function getAmountOut(address,address,uint256) view returns (uint256)",
  "function addLiquidity(address,address,uint256,uint256,uint256,uint256) external returns (uint256)",
  "function swap(address,address,uint256,uint256,address) external returns (uint256)",
  "function stake(address,uint256) external",
  "function unstake(address,uint256) external",
  "function claimStakeReward(address) external",
  "function pendingStakeRewards(address,address) view returns (uint256)",
  "function stakes(address,address) view returns (uint256 amount, uint256 lastClaim, bool active)",
  "function getLeaderboard(uint256) view returns (address[],uint256[])",
  "function getUserCount() view returns (uint256)",
]

const TOKEN_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function approve(address,uint256) external returns (bool)",
  "function allowance(address,address) view returns (uint256)",
  "function faucet() external",
]

// Listen for PointsAwarded events to catch referral points
const POINTS_EVENT_ABI = [
  "event PointsAwarded(address indexed user, uint256 pts, string reason)",
]

export function useDEX(signer, account) {
  const [dex,       setDex]       = useState(null)
  const [tokens,    setTokens]    = useState({})
  const [userInfo,  setUserInfo]  = useState(null)
  const [streak,    setStreak]    = useState(0)
  const [balances,  setBalances]  = useState({})
  const [stakeInfo, setStakeInfo] = useState({})
  const [loading,   setLoading]   = useState(false)
  const [txHash,    setTxHash]    = useState(null)

  useEffect(() => {
    if (!signer || !D.contracts) return
    const d = new ethers.Contract(D.contracts.SoloDEX, DEX_ABI, signer)
    setDex(d)
    const toks = {}
    for (const [sym, addr] of Object.entries(D.contracts)) {
      if (sym !== 'SoloDEX' && sym !== 'SDXToken')
        toks[sym] = new ethers.Contract(addr, TOKEN_ABI, signer)
    }
    setTokens(toks)
  }, [signer])

  const refreshUser = useCallback(async () => {
    if (!dex || !account) return
    try {
      const s  = await dex.userStats(account)
      const st = await dex.currentStreak(account)
      setUserInfo({
        totalPoints:        Number(s.totalPoints),
        claimedPoints:      Number(s.claimedPoints),
        swapsCount:         Number(s.swapsCount),
        registered:         s.registered,
        referrer:           s.referrer,
        questEarlyTester:   s.questEarlyTester,
        questDiscord:       s.questDiscord,
        questTwitterFollow: s.questTwitterFollow,
      })
      setStreak(Number(st))
    } catch {}
  }, [dex, account])

  const refreshBalances = useCallback(async () => {
    if (!account || !Object.keys(tokens).length) return
    const b = {}
    for (const [sym, tok] of Object.entries(tokens)) {
      try { b[sym] = ethers.formatEther(await tok.balanceOf(account)) } catch {}
    }
    setBalances(b)
  }, [tokens, account])

  const refreshStakes = useCallback(async () => {
    if (!dex || !account || !D.contracts) return
    const info = {}
    for (const [sym, addr] of Object.entries(D.contracts)) {
      if (sym === 'SoloDEX' || sym === 'SDXToken') continue
      try {
        const pos  = await dex.stakes(addr, account)
        const pend = await dex.pendingStakeRewards(addr, account)
        info[sym]  = {
          amount:  ethers.formatEther(pos.amount),
          active:  pos.active,
          pending: Number(pend),
        }
      } catch {}
    }
    setStakeInfo(info)
  }, [dex, account])

  useEffect(() => {
    refreshUser()
    refreshBalances()
    refreshStakes()
  }, [refreshUser, refreshBalances, refreshStakes])

  // ── Listen for PointsAwarded events (catches referral points) ──
  useEffect(() => {
    if (!dex || !account || !D.contracts) return
    try {
      const filter = dex.filters.PointsAwarded(account)
      const handler = () => { refreshUser() }
      dex.on(filter, handler)
      return () => { dex.off(filter, handler) }
    } catch {}
  }, [dex, account, refreshUser])

  const register = useCallback(async (refCode) => {
    if (!dex) return
    setLoading(true)
    try {
      const code = refCode
        ? ethers.encodeBytes32String(refCode.slice(0, 31))
        : ethers.ZeroHash
      const tx = await dex.register(code)
      setTxHash(tx.hash)
      await tx.wait()
      await refreshUser()
    } catch(e) { console.error(e) }
    setLoading(false)
  }, [dex, refreshUser])

  const faucet = useCallback(async (sym) => {
    const tok = tokens[sym]; if (!tok) return
    setLoading(true)
    try {
      const tx = await tok.faucet()
      setTxHash(tx.hash)
      await tx.wait()
      await refreshBalances()
    } catch(e) { console.error(e) }
    setLoading(false)
  }, [tokens, refreshBalances])

  const approveAndSwap = useCallback(async (inSym, outSym, amtIn, minOut) => {
    if (!dex || !D.contracts) return false
    setLoading(true)
    try {
      const tok = tokens[inSym]
      const amt = ethers.parseEther(String(amtIn))
      if (await tok.allowance(account, D.contracts.SoloDEX) < amt)
        await (await tok.approve(D.contracts.SoloDEX, ethers.MaxUint256)).wait()
      const tx = await dex.swap(
        D.contracts[inSym], D.contracts[outSym],
        amt, ethers.parseEther(String(Number(minOut) * 0.99)), account
      )
      setTxHash(tx.hash)
      await tx.wait()
      await refreshUser()
      await refreshBalances()
      return true
    } catch(e) { console.error(e); return false }
    finally { setLoading(false) }
  }, [dex, tokens, account, refreshUser, refreshBalances])

  const addLiquidity = useCallback(async (sA, sB, aA, aB) => {
    if (!dex || !D.contracts) return false
    setLoading(true)
    try {
      for (const [s, a] of [[sA, aA], [sB, aB]]) {
        const w = ethers.parseEther(String(a))
        if (await tokens[s].allowance(account, D.contracts.SoloDEX) < w)
          await (await tokens[s].approve(D.contracts.SoloDEX, ethers.MaxUint256)).wait()
      }
      const tx = await dex.addLiquidity(
        D.contracts[sA], D.contracts[sB],
        ethers.parseEther(String(aA)), ethers.parseEther(String(aB)), 0, 0
      )
      setTxHash(tx.hash)
      await tx.wait()
      await refreshUser()
      await refreshBalances()
      return true
    } catch(e) { console.error(e); return false }
    finally { setLoading(false) }
  }, [dex, tokens, account, refreshUser, refreshBalances])

  const stakeToken = useCallback(async (sym, amount) => {
    if (!dex || !D.contracts) return false
    setLoading(true)
    try {
      const amt = ethers.parseEther(String(amount))
      if (await tokens[sym].allowance(account, D.contracts.SoloDEX) < amt)
        await (await tokens[sym].approve(D.contracts.SoloDEX, ethers.MaxUint256)).wait()
      const tx = await dex.stake(D.contracts[sym], amt)
      setTxHash(tx.hash)
      await tx.wait()
      await refreshUser()
      await refreshBalances()
      await refreshStakes()
      return true
    } catch(e) { console.error(e); return false }
    finally { setLoading(false) }
  }, [dex, tokens, account, refreshUser, refreshBalances, refreshStakes])

  const unstakeToken = useCallback(async (sym, amount) => {
    if (!dex || !D.contracts) return false
    setLoading(true)
    try {
      const tx = await dex.unstake(D.contracts[sym], ethers.parseEther(String(amount)))
      setTxHash(tx.hash)
      await tx.wait()
      await refreshUser()
      await refreshBalances()
      await refreshStakes()
      return true
    } catch(e) { console.error(e); return false }
    finally { setLoading(false) }
  }, [dex, account, refreshUser, refreshBalances, refreshStakes])

  const claimRewards = useCallback(async (sym) => {
    if (!dex || !D.contracts) return false
    setLoading(true)
    try {
      const tx = await dex.claimStakeReward(D.contracts[sym])
      setTxHash(tx.hash)
      await tx.wait()
      await refreshUser()
      await refreshStakes()
      return true
    } catch(e) { console.error(e); return false }
    finally { setLoading(false) }
  }, [dex, refreshUser, refreshStakes])

  const getAmountOut = useCallback(async (inSym, outSym, amt) => {
    if (!dex || !D.contracts || !amt) return '0'
    try {
      const out = await dex.getAmountOut(
        D.contracts[inSym], D.contracts[outSym],
        ethers.parseEther(String(amt))
      )
      return ethers.formatEther(out)
    } catch { return '0' }
  }, [dex])

  const getLeaderboard = useCallback(async () => {
    if (!dex) return []
    try {
      const [users, pts] = await dex.getLeaderboard(20)
      return users.map((u, i) => ({ address: u, points: Number(pts[i]) }))
    } catch { return [] }
  }, [dex])

  const getReferralCode = useCallback(async () => {
    if (!dex || !account) return null
    try {
      const c = await dex.userReferralCode(account)
      return c === ethers.ZeroHash ? null : c
    } catch { return null }
  }, [dex, account])

  return {
    dex, userInfo, streak, balances, stakeInfo, loading, txHash,
    register, faucet, approveAndSwap, addLiquidity,
    stakeToken, unstakeToken, claimRewards,
    getAmountOut, getLeaderboard, getReferralCode,
    refreshUser, deployments: D,
  }
}
