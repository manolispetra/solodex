import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useWallet }        from './hooks/useWallet'
import { useDEX }           from './hooks/useDEX'
import { useInvite }        from './hooks/useInvite'
import { usePoints }        from './hooks/usePoints'
import { useQuests }        from './hooks/useQuests'
import { useLinks }         from './hooks/useLinks'
import CinematicBg          from './components/CinematicBg'
import SwapPanel            from './components/SwapPanel'
import StakingPanel         from './components/StakingPanel'
import LiquidityPanel       from './components/LiquidityPanel'
import FaucetPanel          from './components/FaucetPanel'
import LeaderboardPanel     from './components/LeaderboardPanel'
import SDXClaimPanel        from './components/SDXClaimPanel'
import NFTGallery           from './components/NFTGallery'
import SlotMachine          from './components/SlotMachine'
import IdentityMint         from './components/IdentityMint'
import s from './styles/App.module.css'

const INVITE_DEADLINE = new Date('2026-05-30T23:59:59Z').getTime()
const EARLY_DEADLINE  = new Date('2026-05-30T23:59:59Z').getTime()

// Animated S-logo
function SLogo({ size = 28 }) {
  const [a, setA] = useState(0)
  useEffect(() => { const t = setInterval(() => setA(p => (p + 0.6) % 360), 16); return () => clearInterval(t) }, [])
  const r = size * 0.42, cx = size / 2
  const ox = cx + r * Math.cos(a * Math.PI / 180)
  const oy = cx + r * Math.sin(a * Math.PI / 180)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="sg"><stop offset="0%" stopColor="#22c55e" stopOpacity=".14"/><stop offset="100%" stopColor="#22c55e" stopOpacity="0"/></radialGradient>
      </defs>
      <circle cx={cx} cy={cx} r={cx} fill="url(#sg)"/>
      <circle cx={cx} cy={cx} r={r+1.5} fill="none" stroke="rgba(34,197,94,.12)" strokeWidth=".5"/>
      <path d={`M${cx} ${cx*.3} A${r*.8} ${r*.8} 0 0 1 ${cx+r*.8} ${cx*.7}`} fill="none" stroke="#22c55e" strokeWidth={size*.09} strokeLinecap="round"/>
      <polygon points={`${cx+r*.8},${cx*.55} ${cx+r*1.1},${cx*.74} ${cx+r*.5},${cx*.76}`} fill="#22c55e"/>
      <path d={`M${cx+r*.8} ${cx*.7} Q${cx} ${cx*.95} ${cx-r*.8} ${cx*1.2}`} fill="none" stroke="#22c55e" strokeWidth={size*.065} strokeLinecap="round" opacity=".5"/>
      <path d={`M${cx-r*.8} ${cx*1.2} A${r*.8} ${r*.8} 0 0 0 ${cx} ${cx*1.6}`} fill="none" stroke="#22c55e" strokeWidth={size*.09} strokeLinecap="round"/>
      <polygon points={`${cx},${cx*1.5} ${cx-r*.4},${cx*1.65} ${cx+r*.4},${cx*1.65}`} fill="#22c55e"/>
      <circle cx={ox} cy={oy} r={size*.04} fill="#22c55e" opacity=".85"/>
    </svg>
  )
}

// Wallet connect modal
function WalletModal({ onClose, onMetaMask, onWC, connecting }) {
  return (
    <div className={s.wcModal} onClick={onClose}>
      <div className={s.wcCard} onClick={e => e.stopPropagation()}>
        <div className={s.wcTitle}>Connect Wallet</div>
        <div className={s.wcSub}>Choose how to connect to SOLODEX</div>
        <div className={s.wcOptions}>
          <button className={s.wcOpt} onClick={onMetaMask} disabled={connecting}>
            <div className={s.wcOptIconSvg} style={{ background: '#F6851B', borderRadius: 10 }}>
              <svg viewBox="0 0 60 60" width="24" height="24">
                <path fill="#fff" d="M30 5L12 20l3 18 6 2 3-5 6 5 6-5 3 5 6-2 3-18z"/>
              </svg>
            </div>
            <div>
              <div className={s.wcOptName}>MetaMask</div>
              <div className={s.wcOptSub}>Browser extension</div>
            </div>
          </button>
          <button className={s.wcOpt} onClick={onWC} disabled={connecting}>
            <div className={s.wcOptIconSvg} style={{ background: '#3B99FC', borderRadius: 10 }}>
              <svg viewBox="0 0 40 40" width="24" height="24">
                <path fill="#fff" d="M8 15 C14 9 26 9 32 15 L34 17 36 15 C28 7 12 7 4 15 L6 17 8 15zm4 4 C16 15 24 15 28 19 L30 21 32 19 C26 13 14 13 8 19 L10 21 12 19zm4 4 2-2 2 2 2-2 2 2-6 6-6-6 2 2z"/>
              </svg>
            </div>
            <div>
              <div className={s.wcOptName}>WalletConnect</div>
              <div className={s.wcOptSub}>Mobile wallet · QR code</div>
            </div>
          </button>
        </div>
        <button className={s.wcClose} onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}

// Points badge
function PtsBadge({ total }) {
  const [bump, setBump] = useState(false)
  const prev = useRef(0)
  useEffect(() => {
    if (total > prev.current && prev.current > 0) { setBump(true); setTimeout(() => setBump(false), 600) }
    prev.current = total
  }, [total])
  return (
    <div className={`${s.ptsBadge} ${bump ? s.bump : ''}`} title={`${total.toLocaleString()} SDX points (on-chain + quests)`}>
      <span className={s.ptsVal}>{total.toLocaleString()}</span>
      <span className={s.ptsLbl}>SDX</span>
    </div>
  )
}

// Wallet button + dropdown
function WalletArea({ wallet, onOpenModal }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn); return () => document.removeEventListener('mousedown', fn)
  }, [])
  if (!wallet.account) return (
    <button className={s.walletBtn} onClick={onOpenModal} disabled={wallet.connecting}>
      {wallet.connecting ? 'Connecting…' : 'Connect'}
    </button>
  )
  const short = wallet.account.slice(0, 6) + '…' + wallet.account.slice(-4)
  return (
    <div className={s.walletArea} ref={ref}>
      <button className={`${s.walletBtn} ${s.walletBtnConnected}`} onClick={() => setOpen(o => !o)}>
        <div className={s.walletAvatar}>{wallet.account.slice(2, 4).toUpperCase()}</div>
        <span className={s.walletAddr}>{short}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" opacity=".5">
          <path d="M2 4l4 4 4-4"/>
        </svg>
      </button>
      {open && (
        <div className={s.dropMenu}>
          <div className={s.dropItem} style={{ cursor: 'default' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/></svg>
            Chain: {wallet.chainId === 97 ? 'BSC Testnet' : wallet.chainId === 56 ? 'BSC Mainnet' : `Chain ${wallet.chainId}`}
          </div>
          <div className={s.dropDivider}/>
          {!wallet.isCorrectNetwork && (
            <button className={s.dropItem} onClick={() => { wallet.switchToTestnet(); setOpen(false) }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12A9 9 0 1 1 3 12"/><path d="M21 3v9h-9"/></svg>
              Switch to BSC Testnet
            </button>
          )}
          <button className={`${s.dropItem} ${s.danger}`} onClick={() => { wallet.disconnect(); setOpen(false) }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}

// InviteGate
function InviteGate({ invite }) {
  const [code, setCode] = useState('')
  return (
    <div className={s.gate}>
      <div className={s.gateCard}>
        <SLogo size={48}/>
        <div className={s.gateTitle}>SOLODEX</div>
        <div className={s.gateSub}>
          Invite-only until 30 May 2026.<br/>Enter your invite code to access the testnet.
        </div>
        <input
          className={s.gateInput}
          placeholder="Enter 6-character code"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'').slice(0,6))}
          onKeyDown={e => e.key === 'Enter' && code.length >= 6 && invite.submitCode(code)}
          maxLength={6}
          autoFocus
        />
        <button
          className={s.gateBtn}
          onClick={() => invite.submitCode(code)}
          disabled={invite.checking || code.length < 6}
        >
          {invite.checking ? 'Checking…' : 'Enter SOLODEX'}
        </button>
        {invite.error && <div className={s.gateError}>{invite.error}</div>}
      </div>
    </div>
  )
}

// Dashboard sidebar card
function DashCard({ title, children }) {
  return (
    <div className={s.dashCard}>
      {title && <div className={s.dashTitle}>{title}</div>}
      {children}
    </div>
  )
}

// Points breakdown sidebar
function PointsSidebar({ points, dex }) {
  const rows = [
    { label: 'On-chain (swaps/stake/LP)', val: points.onChainPoints || 0 },
    { label: 'Quest points', val: points.questPts },
    { label: 'Claimable this week', val: points.claimableQuestPts },
  ]
  return (
    <DashCard title="Points Breakdown">
      {rows.map(r => (
        <div key={r.label} className={s.ptsRow}>
          <span className={s.ptsRowLabel}>{r.label}</span>
          <span className={s.ptsRowVal}>{r.val.toLocaleString()}</span>
        </div>
      ))}
      <div className={s.ptsRow} style={{ borderTop: '1px solid var(--green)', marginTop: 4, paddingTop: 8 }}>
        <span className={s.ptsRowLabel} style={{ fontWeight: 600, color: 'var(--text)' }}>Total</span>
        <span className={s.ptsRowVal} style={{ fontSize: 16 }}>{points.totalPoints.toLocaleString()}</span>
      </div>
    </DashCard>
  )
}

// Invite codes sidebar
function InviteCodesSidebar({ invite }) {
  const [copied, setCopied] = useState(null)
  const copy = (code, i) => {
    navigator.clipboard.writeText(code).then(() => { setCopied(i); setTimeout(() => setCopied(null), 1500) })
  }
  const now = Date.now()
  const msLeft = Math.max(0, invite.nextRefresh - now)
  const days = Math.floor(msLeft / 86400000), hrs = Math.floor((msLeft % 86400000) / 3600000)
  const resetStr = msLeft > 0 ? `New codes in ${days}d ${hrs}h` : 'Refreshing…'

  return (
    <DashCard title="Your Invite Codes">
      <p style={{ fontSize: 11, color: 'var(--text-mute)', marginBottom: 10 }}>{resetStr}</p>
      {invite.myCodes.length === 0 ? (
        <p style={{ fontSize: 12, color: 'var(--text-dim)' }}>No active codes</p>
      ) : invite.myCodes.map(({ code, usedAt }, i) => (
        <div key={code} className={s.codeItem}
          onClick={() => !usedAt && copy(code, i)}
          style={{ opacity: usedAt ? 0.45 : 1, cursor: usedAt ? 'default' : 'pointer' }}
        >
          <span style={{ textDecoration: usedAt ? 'line-through' : 'none', fontFamily: 'var(--mono)', fontSize: 12, letterSpacing: '.08em' }}>{code}</span>
          <span className={s.codeCopy} style={{ color: usedAt ? 'var(--red)' : copied === i ? 'var(--green)' : undefined }}>
            {usedAt ? 'used' : copied === i ? '✓' : 'copy'}
          </span>
        </div>
      ))}
    </DashCard>
  )
}

// Quests panel (inline, not separate component to avoid import issues)
function QuestsPanel({ wallet, invite, points }) {
  const { quests, completed, loading, completeQuest } = useQuests(wallet.account)
  const links = useLinks()
  const [earlyT, setEarlyT] = useState('')

  useEffect(() => {
    const tick = () => {
      const d = EARLY_DEADLINE - Date.now()
      if (d <= 0) { setEarlyT('Expired'); return }
      const days = Math.floor(d/86400000), hrs = Math.floor((d%86400000)/3600000)
      setEarlyT(`${days}d ${hrs}h left`)
    }
    tick(); const t = setInterval(tick, 60000); return () => clearInterval(t)
  }, [])

  const handleEarly = () => {
    const ok = invite.claimEarlyTester()
    if (ok) points.addQuestPoints(1000)
  }
  const handleTweet = (id, url) => {
    const pts = completeQuest(id, url)
    if (pts > 0) points.addQuestPoints(pts)
  }
  const twitterTotal = Object.values(completed).reduce((a, v) => a + (v?.pts || 0), 0)
  const totalEarned  = twitterTotal + (invite.earlyDone ? 1000 : 0)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <h2 className={s.panelTitle}>Quests</h2>
          <p className={s.panelSub}>Complete tasks · Earn SDX · Claim weekly</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 20, fontWeight: 700, color: 'var(--green)' }}>{totalEarned.toLocaleString()}</div>
          <div style={{ fontSize: 10, color: 'var(--text-mute)' }}>SDX earned</div>
        </div>
      </div>

      {/* Early tester */}
      <div style={{ background: invite.earlyDone ? 'var(--bg2)' : 'var(--green-faint)', border: `1px solid ${invite.earlyDone ? 'var(--border)' : 'rgba(34,197,94,.2)'}`, borderRadius: 'var(--r-lg)', padding: '14px 16px', marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--white)', marginBottom: 3 }}>⭐ Early Tester</div>
          <div style={{ fontSize: 11, color: 'var(--text-dim)' }}>
            {invite.earlyDone ? 'Claimed — genesis cohort confirmed.' : invite.earlyExpired ? 'Expired.' : `Available until 30 May 2026 · ${earlyT}`}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>+1000 SDX</span>
          {invite.earlyDone ? (
            <span style={{ fontSize: 11, color: 'var(--green)', background: 'var(--green-faint)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 4, padding: '3px 8px' }}>✓ Done</span>
          ) : invite.earlyExpired ? (
            <span style={{ fontSize: 11, color: 'var(--text-mute)' }}>Expired</span>
          ) : (
            <button onClick={handleEarly} disabled={!wallet.account} style={{ background: 'var(--green)', color: '#000', fontWeight: 700, fontSize: 12, padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', opacity: wallet.account ? 1 : .5 }}>Claim</button>
          )}
        </div>
      </div>

      {/* Twitter quests */}
      <div style={{ fontSize: 11, color: 'var(--text-mute)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
        Twitter / X
        {Object.keys(completed).length > 0 && <span style={{ color: 'var(--green)', fontSize: 10 }}>{Object.keys(completed).length}/{quests.length} done</span>}
      </div>

      {loading && <div style={{ fontSize: 12, color: 'var(--text-dim)', padding: '20px 0', textAlign: 'center' }}>Loading quests…</div>}
      {!loading && quests.length === 0 && <div style={{ fontSize: 12, color: 'var(--text-dim)', padding: '20px 0', textAlign: 'center' }}>No active quests · check back soon.</div>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {quests.map(q => {
          const done = !!completed[q.id]
          return (
            <div key={q.id} style={{ background: done ? 'var(--bg2)' : 'var(--bg2)', border: `1px solid ${done ? 'var(--border)' : 'var(--border)'}`, borderRadius: 'var(--r-lg)', padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 12, opacity: done ? .7 : 1 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1d9bf0" style={{ flexShrink: 0 }}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--white)', fontWeight: 500, marginBottom: 2 }}>{q.title}</div>
                <a href={q.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: 'var(--text-mute)', wordBreak: 'break-all' }} onClick={e => e.stopPropagation()}>{q.url.slice(0, 48)}{q.url.length > 48 ? '…' : ''}</a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>+{q.pts}</span>
                {done ? (
                  <span style={{ fontSize: 10, color: 'var(--green)' }}>✓ Done</span>
                ) : (
                  <button onClick={() => handleTweet(q.id, q.url)} disabled={!wallet.account} style={{ background: '#1d9bf0', color: '#fff', fontWeight: 600, fontSize: 11, padding: '4px 10px', borderRadius: 5, border: 'none', cursor: wallet.account ? 'pointer' : 'not-allowed', opacity: wallet.account ? 1 : .5 }}>Go →</button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ fontSize: 11, color: 'var(--text-mute)', marginTop: 14, lineHeight: 1.6 }}>
        Quest points accumulate weekly. Claim all from the <strong style={{ color: 'var(--text-dim)' }}>Claim SDX</strong> tab.
      </p>
    </div>
  )
}

// Mobile nav icons
const NAV_ICONS = {
  swap:    <path d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>,
  staking: <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>,
  quests:  <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>,
  nft:     <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>,
  slots:   <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none"/>,
}

const TABS = [
  { id: 'swap',        label: 'Swap',        cls: '' },
  { id: 'staking',     label: 'Stake',       cls: '' },
  { id: 'liquidity',   label: 'Pool',        cls: '' },
  { id: 'quests',      label: 'Quests',      cls: '' },
  { id: 'claim',       label: 'Claim SDX',   cls: '' },
  { id: 'identity',    label: 'Identity',    cls: s.tabIdentity, icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  { id: 'faucet',      label: 'Faucet',      cls: '' },
  { id: 'leaderboard', label: 'Ranks',       cls: '', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
  { id: 'nft',         label: 'NFTs',        cls: s.tabNft },
  { id: 'slots',       label: 'Slots',       cls: s.tabSlot, icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
]

const FULL_WIDTH_TABS = new Set(['nft', 'slots'])

export default function App() {
  const wallet = useWallet()
  const dex    = useDEX(wallet.signer, wallet.account)
  const alreadyRegistered = !!dex.userInfo?.registered
  const invite = useInvite(wallet.account, alreadyRegistered)
  const points = usePoints(wallet.account, dex.userInfo?.totalPoints || 0)
  const links  = useLinks()

  const [tab,        setTab]        = useState('swap')
  const [showModal,  setShowModal]  = useState(false)
  const [ref,        setRef]        = useState('')
  const [scrolled,   setScrolled]   = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', fn); return () => window.removeEventListener('scroll', fn)
  })

  // Auto-unlock if already registered on-chain (handles wiped localStorage)
  useEffect(() => {
    if (alreadyRegistered && wallet.account && !invite.unlocked) {
      localStorage.setItem(`sdx_v4_unlocked`, wallet.account.toLowerCase())
    }
  }, [alreadyRegistered, wallet.account, invite.unlocked])
  }, [])

  // Bypass gate if wallet already registered on-chain (survives cookie/localStorage wipe)
  const gateActive = !!wallet.account && !invite.unlocked && !alreadyRegistered && Date.now() < INVITE_DEADLINE

  const handleMM = useCallback(async () => { setShowModal(false); await wallet.connectMetaMask() }, [wallet])
  const handleWC = useCallback(async () => { setShowModal(false); await wallet.connectWalletConnect() }, [wallet])

  const isFullWidth = FULL_WIDTH_TABS.has(tab)

  return (
    <div className={s.app}>
      <CinematicBg/>

      {/* Gate */}
      {gateActive && <InviteGate invite={invite}/>}

      {/* WalletConnect modal */}
      {showModal && (
        <WalletModal
          onClose={() => setShowModal(false)}
          onMetaMask={handleMM}
          onWC={handleWC}
          connecting={wallet.connecting}
        />
      )}

      {/* Header */}
      <header className={`${s.header} ${scrolled ? s.scrolled : ''}`}>
        <div className={s.headerInner}>
          <div className={s.logo}>
            <SLogo size={28}/>
            <span style={{fontFamily:"'Syne',sans-serif",fontSize:13,fontWeight:400,color:'rgba(235,235,235,.82)',letterSpacing:'.38em',textTransform:'uppercase'}}>SOLODEX</span>
            <span className={s.chainBadge}>
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              97
            </span>
          </div>

          <nav style={{ display: 'flex', gap: 18, marginLeft: 20 }}>
            {[['twitter','Twitter'],['discord','Discord']].map(([k,l]) => (
              links[k] && <a key={k} href={links[k]} target="_blank" rel="noreferrer" style={{ fontSize: 12, color: 'var(--text-dim)', fontWeight: 500 }}>{l}</a>
            ))}
          </nav>

          <div className={s.headerSep}/>

          <div className={s.headerRight}>
            {wallet.account && dex.userInfo?.registered && (
              <>
                {dex.streak >= 2 && <span className={s.streakBadge}>🔥 {dex.streak}d</span>}
                <PtsBadge total={points.totalPoints}/>
              </>
            )}
            <WalletArea wallet={wallet} onOpenModal={() => setShowModal(true)}/>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className={s.main}>

        {!wallet.account && (
          <div className={s.connectScreen}>
            <div className={s.connectLogo}><SLogo size={72}/></div>
            <h1 className={s.connectTitle}>SOLODEX</h1>
            <p className={s.connectSub}>Incentivised testnet DEX on BNB Smart Chain. Swap, stake, earn SDX, win NFTs.</p>
            <button className={s.connectBtn} onClick={() => setShowModal(true)}>Connect Wallet</button>
          </div>
        )}

        {wallet.account && !gateActive && (
          <>
            {/* Wrong network banner */}
            {!wallet.isCorrectNetwork && (
              <div className={s.netBanner}>
                <span className={s.netBannerText}>Switch to BNB Smart Chain Testnet (Chain ID 97)</span>
                <button className={s.netSwitch} onClick={wallet.switchToTestnet}>Switch Network</button>
              </div>
            )}

            {/* Register banner */}
            {wallet.isCorrectNetwork && dex.userInfo && !dex.userInfo.registered && (
              <div className={s.regBanner}>
                <span style={{ fontSize: 13, color: 'var(--green)', fontWeight: 600, flexShrink: 0 }}>Register to start earning</span>
                <input className={s.regInput} placeholder="Referral code (optional)" value={ref} onChange={e => setRef(e.target.value)}/>
                <button className={s.regBtn} onClick={() => dex.register(ref)} disabled={dex.loading}>
                  {dex.loading ? 'Registering…' : 'Register +250 SDX'}
                </button>
              </div>
            )}

            {/* Layout */}
            <div className={s.layout} style={isFullWidth ? { gridTemplateColumns: '1fr' } : {}}>
              <div>
                {/* Tabs */}
                <div className={s.tabsWrap}>
                  <nav className={s.tabs}>
                    {TABS.map(t => (
                      <button key={t.id} className={`${s.tab} ${t.cls} ${tab === t.id ? s.tabActive : ''}`} onClick={() => setTab(t.id)}>
                        {t.icon && (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:5,verticalAlign:'middle'}}>
                            <path d={t.icon}/>
                          </svg>
                        )}
                        {t.label}
                      </button>
                    ))}
                  </nav>
                  <div className={s.panelBody}>
                    {tab === 'swap'        && <SwapPanel        wallet={wallet} dex={dex}/>}
                    {tab === 'staking'     && <StakingPanel     wallet={wallet} dex={dex}/>}
                    {tab === 'liquidity'   && <LiquidityPanel   wallet={wallet} dex={dex}/>}
                    {tab === 'quests'      && <QuestsPanel      wallet={wallet} invite={invite} points={points}/>}
                    {tab === 'claim'       && <SDXClaimPanel    wallet={wallet} dex={dex} points={points}/>}
                    {tab === 'identity'    && <IdentityMint     wallet={wallet}/>}
                    {tab === 'faucet'      && <FaucetPanel      wallet={wallet} dex={dex}/>}
                    {tab === 'leaderboard' && <LeaderboardPanel dex={dex} wallet={wallet}/>}
                    {tab === 'nft'         && <NFTGallery/>}
                    {tab === 'slots'       && <SlotMachine account={wallet.account}/>}
                  </div>
                </div>
              </div>

              {/* Sidebar — hidden on mobile, hidden on full-width tabs */}
              {!isFullWidth && (
                <aside className={s.sidebar}>
                  <PointsSidebar points={points} dex={dex}/>
                  <InviteCodesSidebar invite={invite}/>
                </aside>
              )}
            </div>
          </>
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav className={s.mobileNav}>
        {[['swap','swap'],['staking','staking'],['quests','quests'],['nft','nft'],['slots','slots']].map(([id, icon]) => (
          <button key={id} className={`${s.mobileNavBtn} ${tab === id ? s.active : ''}`} onClick={() => setTab(id)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">{NAV_ICONS[icon]}</svg>
            <span>{id === 'slots' ? '🎰' : id.charAt(0).toUpperCase() + id.slice(1)}</span>
          </button>
        ))}
      </nav>

      {/* TX toast */}
      {dex.txHash && (
        <div className={s.toast}>
          <span className={s.toastText}>Transaction submitted</span>
          <a href={`https://testnet.bscscan.com/tx/${dex.txHash}`} target="_blank" rel="noreferrer" className={s.toastLink}>View ↗</a>
        </div>
      )}
    </div>
  )
}
