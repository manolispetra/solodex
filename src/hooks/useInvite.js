import { useState, useEffect, useCallback, useRef } from 'react'

const EARLY_DEADLINE = new Date('2026-05-30T23:59:59Z').getTime()
const WEEK_MS        = 7 * 24 * 60 * 60 * 1000
const CODES_PER_WEEK = 2
const TEAM_SLICE     = 100

const K_UNLOCKED = 'sdx_v5_unlocked'
const K_USED     = 'sdx_v5_used'
const K_USR_REG  = 'sdx_v5_user_reg'
const K_ISSUED   = a => `sdx_v5_issued_${a}`
const K_LASTGEN  = a => `sdx_v5_lastgen_${a}`
const K_EARLY    = a => `sdx_v5_early_${a}`

const norm = c => (c || '').toUpperCase().trim()

function getUsed() { try { return JSON.parse(localStorage.getItem(K_USED) || '{}') } catch { return {} } }
function markUsed(c) { const u = getUsed(); u[norm(c)] = Date.now(); localStorage.setItem(K_USED, JSON.stringify(u)) }
function isUsed(c) { return !!getUsed()[norm(c)] }
function getArr(k) { try { return JSON.parse(localStorage.getItem(k) || '[]') } catch { return [] } }
function setArr(k, v) { localStorage.setItem(k, JSON.stringify(v)) }

let _cache = null
async function loadAllCodes() {
  if (_cache) return _cache
  try { const r = await fetch('/invite-codes.json'); _cache = (await r.json()).map(norm); return _cache }
  catch { return [] }
}

async function isTeamCode(c) { return (await loadAllCodes()).slice(0, TEAM_SLICE).includes(norm(c)) }
function isUserCode(c) { return getArr(K_USR_REG).includes(norm(c)) }

function walletSlot(addr, weekNum, poolSize) {
  let h = 0; const s = addr + String(weekNum)
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h) % poolSize
}

async function issueWeeklyCodes(addr) {
  const all = await loadAllCodes()
  const pool = all.slice(TEAM_SLICE)
  const usedMap = getUsed()
  const regSet = new Set(getArr(K_USR_REG))
  const now = Date.now()
  const weekNum = Math.floor(now / WEEK_MS)
  const lastGen = parseInt(localStorage.getItem(K_LASTGEN(addr)) || '0')
  const issued = getArr(K_ISSUED(addr))
  const active = issued.filter(x => !usedMap[x.code])

  if (now - lastGen < WEEK_MS && active.length >= CODES_PER_WEEK) return issued

  const fresh = []
  const start = walletSlot(addr, weekNum, pool.length)
  for (let i = 0; i < pool.length && fresh.length < CODES_PER_WEEK; i++) {
    const c = pool[(start + i) % pool.length]
    if (!usedMap[c] && !regSet.has(c) && !issued.find(x => x.code === c) && !fresh.find(x => x.code === c)) {
      fresh.push({ code: c, issuedAt: now })
    }
  }
  if (fresh.length) setArr(K_USR_REG, [...getArr(K_USR_REG), ...fresh.map(x => x.code)])
  const updated = [...active, ...fresh]
  setArr(K_ISSUED(addr), updated)
  localStorage.setItem(K_LASTGEN(addr), String(now))
  return updated
}

export function useInvite(account, isRegisteredOnChain = false) {
  const [unlocked,     setUnlocked]     = useState(false)
  const [checking,     setChecking]     = useState(false)
  const [error,        setError]        = useState(null)
  const [myCodes,      setMyCodes]      = useState([])
  const [earlyDone,    setEarlyDone]    = useState(false)
  const [earlyExpired, setEarlyExpired] = useState(Date.now() > EARLY_DEADLINE)
  const didAutoUnlock = useRef(false)

  const addr = account?.toLowerCase() || null

  const refreshCodes = useCallback(async a => {
    const issued = await issueWeeklyCodes(a)
    const usedMap = getUsed()
    setMyCodes(issued.map(({ code, issuedAt }) => ({ code, issuedAt, usedAt: usedMap[code] || null })))
  }, [])

  useEffect(() => {
    if (!addr) return
    const ok = localStorage.getItem(K_UNLOCKED) === addr
    setUnlocked(ok)
    setEarlyDone(!!localStorage.getItem(K_EARLY(addr)))
    setEarlyExpired(Date.now() > EARLY_DEADLINE)
    if (ok) refreshCodes(addr)
  }, [addr, refreshCodes])

  // KEY FIX: if wallet is already registered on-chain, bypass gate regardless of localStorage
  useEffect(() => {
    if (!addr || didAutoUnlock.current) return
    if (isRegisteredOnChain) {
      didAutoUnlock.current = true
      localStorage.setItem(K_UNLOCKED, addr)
      if (!unlocked) {
        setUnlocked(true)
        refreshCodes(addr)
      }
    }
  }, [addr, isRegisteredOnChain, unlocked, refreshCodes])

  useEffect(() => {
    if (!addr || !unlocked) return
    const t = setInterval(() => refreshCodes(addr), 60_000)
    return () => clearInterval(t)
  }, [addr, unlocked, refreshCodes])

  const submitCode = useCallback(async raw => {
    if (!addr || !raw.trim()) return
    const code = norm(raw)
    setChecking(true); setError(null)
    if (isUsed(code)) { setError('Code already used.'); setChecking(false); return }
    const vTeam = await isTeamCode(code)
    const vUser = !vTeam && isUserCode(code)
    if (!vTeam && !vUser) { setError('Invalid code — check for typos.'); setChecking(false); return }
    markUsed(code)
    localStorage.setItem(K_UNLOCKED, addr)
    setUnlocked(true)
    setChecking(false)
    await refreshCodes(addr)
  }, [addr, refreshCodes])

  const claimEarlyTester = useCallback(() => {
    if (!addr || earlyDone || earlyExpired) return false
    localStorage.setItem(K_EARLY(addr), '1'); setEarlyDone(true); return true
  }, [addr, earlyDone, earlyExpired])

  const nextRefresh = addr ? parseInt(localStorage.getItem(K_LASTGEN(addr)) || '0') + WEEK_MS : 0

  return { unlocked, checking, error, myCodes, earlyDone, earlyExpired, submitCode, claimEarlyTester, nextRefresh, EARLY_DEADLINE }
}
