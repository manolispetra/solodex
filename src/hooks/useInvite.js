/**
 * useInvite — SOLODEX Invite System
 *
 * Codes: 6 uppercase alphanumeric characters (e.g. AB3X9Z)
 * - invite-codes.json contains 3000 codes
 * - codes[0..99]   = team Discord codes
 * - codes[100..2999] = auto-distributed pool
 *
 * Each unlocked user gets 2 fresh codes per week,
 * drawn deterministically from the pool by wallet+weekNumber hash.
 *
 * On-chain bypass: if wallet is already registered on the DEX contract,
 * the gate is skipped automatically — even after clearing localStorage.
 *
 * Used codes are tracked with timestamp for strikethrough UI.
 */
import { useState, useEffect, useCallback, useRef } from 'react'

const EARLY_DEADLINE = new Date('2026-05-30T23:59:59Z').getTime()
const WEEK_MS        = 7 * 24 * 60 * 60 * 1000
const PER_WEEK       = 2
const TEAM_SLICE     = 100

// localStorage keys (v5 to avoid conflicts with old data)
const K_UNLOCKED = 'sdx_v5_unlocked'        // value = lowercase wallet address
const K_USED_MAP = 'sdx_v5_used'            // JSON: { [code]: timestamp }
const K_USR_REG  = 'sdx_v5_user_reg'       // JSON: string[] all ever-issued user codes
const K_ISSUED   = a => `sdx_v5_issued_${a}` // JSON: [{code,issuedAt}]
const K_LASTGEN  = a => `sdx_v5_lastgen_${a}`
const K_EARLY    = a => `sdx_v5_early_${a}`

// ── Storage helpers ──────────────────────────────────────────────────────────
const norm   = c => (c || '').toUpperCase().trim()
const getObj = k => { try { return JSON.parse(localStorage.getItem(k) || '{}') } catch { return {} } }
const getArr = k => { try { return JSON.parse(localStorage.getItem(k) || '[]') } catch { return [] } }
const setJ   = (k, v) => localStorage.setItem(k, JSON.stringify(v))

function getUsedMap() { return getObj(K_USED_MAP) }
function markCodeUsed(c) {
  const m = getUsedMap()
  m[norm(c)] = Date.now()
  setJ(K_USED_MAP, m)
}
function isCodeUsed(c) { return !!getUsedMap()[norm(c)] }

// ── Code loading ─────────────────────────────────────────────────────────────
let _codesCache = null
async function loadCodes() {
  if (_codesCache) return _codesCache
  try {
    const r = await fetch('/invite-codes.json')
    if (!r.ok) throw new Error('fetch failed')
    _codesCache = (await r.json()).map(norm)
    return _codesCache
  } catch {
    return []
  }
}

async function isTeamCode(c) {
  const all = await loadCodes()
  return all.slice(0, TEAM_SLICE).includes(norm(c))
}

function isUserCode(c) {
  return getArr(K_USR_REG).includes(norm(c))
}

// ── Weekly code issuance ─────────────────────────────────────────────────────
function hashSlot(addr, weekNum, poolSize) {
  let h = 0
  const s = addr + String(weekNum)
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  }
  return Math.abs(h) % poolSize
}

async function issueWeekly(addr) {
  const all     = await loadCodes()
  const pool    = all.slice(TEAM_SLICE)         // codes[100..2999]
  const usedMap = getUsedMap()
  const regSet  = new Set(getArr(K_USR_REG))

  const now     = Date.now()
  const weekNum = Math.floor(now / WEEK_MS)
  const lastGen = parseInt(localStorage.getItem(K_LASTGEN(addr)) || '0')
  const prevIssued = getArr(K_ISSUED(addr))     // [{code, issuedAt}]
  const stillActive = prevIssued.filter(x => !usedMap[x.code])

  // Only issue new codes if week has passed or fewer than PER_WEEK active
  if (now - lastGen < WEEK_MS && stillActive.length >= PER_WEEK) {
    return prevIssued
  }

  // Pick deterministically
  const fresh = []
  const start = hashSlot(addr, weekNum, pool.length)
  for (let i = 0; i < pool.length && fresh.length < PER_WEEK; i++) {
    const c = pool[(start + i) % pool.length]
    const alreadyHave = prevIssued.some(x => x.code === c)
    if (!usedMap[c] && !regSet.has(c) && !alreadyHave && !fresh.some(x => x.code === c)) {
      fresh.push({ code: c, issuedAt: now })
    }
  }

  if (fresh.length > 0) {
    setJ(K_USR_REG, [...getArr(K_USR_REG), ...fresh.map(x => x.code)])
  }

  const updated = [...stillActive, ...fresh]
  setJ(K_ISSUED(addr), updated)
  localStorage.setItem(K_LASTGEN(addr), String(now))
  return updated
}

// ── Annotate with usedAt for UI ───────────────────────────────────────────────
function annotate(issued) {
  const usedMap = getUsedMap()
  return issued.map(({ code, issuedAt }) => ({
    code,
    issuedAt,
    usedAt: usedMap[code] || null,
  }))
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useInvite(account, isRegisteredOnChain = false) {
  const [unlocked,     setUnlocked]     = useState(false)
  const [checking,     setChecking]     = useState(false)
  const [error,        setError]        = useState(null)
  const [myCodes,      setMyCodes]      = useState([])
  const [earlyDone,    setEarlyDone]    = useState(false)
  const [earlyExpired, setEarlyExpired] = useState(Date.now() > EARLY_DEADLINE)

  const addr         = account?.toLowerCase() || null
  const didAutoUnlock = useRef(false)

  const refresh = useCallback(async a => {
    const issued = await issueWeekly(a)
    setMyCodes(annotate(issued))
  }, [])

  // Load state when account changes
  useEffect(() => {
    if (!addr) {
      setUnlocked(false); setMyCodes([]); return
    }
    const ok = localStorage.getItem(K_UNLOCKED) === addr
    setUnlocked(ok)
    setEarlyDone(!!localStorage.getItem(K_EARLY(addr)))
    setEarlyExpired(Date.now() > EARLY_DEADLINE)
    if (ok) refresh(addr)
  }, [addr, refresh])

  // On-chain bypass: wallet already registered → auto-unlock silently
  useEffect(() => {
    if (!addr || didAutoUnlock.current) return
    if (isRegisteredOnChain) {
      didAutoUnlock.current = true
      localStorage.setItem(K_UNLOCKED, addr)
      setUnlocked(true)
      refresh(addr)
    }
  }, [addr, isRegisteredOnChain, refresh])

  // Periodic refresh (for code expiry / new week)
  useEffect(() => {
    if (!addr || !unlocked) return
    const t = setInterval(() => refresh(addr), 60_000)
    return () => clearInterval(t)
  }, [addr, unlocked, refresh])

  // Submit invite code
  const submitCode = useCallback(async rawInput => {
    if (!addr || !rawInput.trim()) return
    const code = norm(rawInput)

    setChecking(true)
    setError(null)

    if (isCodeUsed(code)) {
      setError('This code has already been used.')
      setChecking(false)
      return
    }

    const vTeam = await isTeamCode(code)
    const vUser = !vTeam && isUserCode(code)

    if (!vTeam && !vUser) {
      setError('Invalid code. Check for typos.')
      setChecking(false)
      return
    }

    markCodeUsed(code)
    localStorage.setItem(K_UNLOCKED, addr)
    setUnlocked(true)
    setChecking(false)
    await refresh(addr)
  }, [addr, refresh])

  // Claim early tester
  const claimEarlyTester = useCallback(() => {
    if (!addr || earlyDone || earlyExpired) return false
    localStorage.setItem(K_EARLY(addr), '1')
    setEarlyDone(true)
    return true
  }, [addr, earlyDone, earlyExpired])

  const nextRefresh = addr
    ? parseInt(localStorage.getItem(K_LASTGEN(addr)) || '0') + WEEK_MS
    : 0

  return {
    unlocked,
    checking,
    error,
    myCodes,       // [{code, issuedAt, usedAt}] — usedAt !== null → strikethrough
    earlyDone,
    earlyExpired,
    submitCode,
    claimEarlyTester,
    nextRefresh,
    EARLY_DEADLINE,
  }
}
