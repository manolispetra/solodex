import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useWallet }      from './hooks/useWallet'
import { useDEX }         from './hooks/useDEX'
import { useInvite }      from './hooks/useInvite'
import { usePoints }      from './hooks/usePoints'
import { useQuests }      from './hooks/useQuests'
import { useLinks }       from './hooks/useLinks'
import CinematicBg        from './components/CinematicBg'
import SwapPanel          from './components/SwapPanel'
import StakingPanel       from './components/StakingPanel'
import LiquidityPanel     from './components/LiquidityPanel'
import FaucetPanel        from './components/FaucetPanel'
import LeaderboardPanel   from './components/LeaderboardPanel'
import SDXClaimPanel      from './components/SDXClaimPanel'
import NFTGallery         from './components/NFTGallery'
import SlotMachine        from './components/SlotMachine'
import IdentityMint       from './components/IdentityMint'
import s from './styles/App.module.css'

const INVITE_DEADLINE = new Date('2026-05-30T23:59:59Z').getTime()
const EARLY_DEADLINE  = new Date('2026-05-30T23:59:59Z').getTime()

// ── Animated S-logo ──────────────────────────────────────────────────────────
function SLogo({ size = 28 }) {
  const [angle, setAngle] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setAngle(a => (a + 0.6) % 360), 16)
    return () => clearInterval(t)
  }, [])
  const cx = size / 2
  const r  = size * 0.42
  const ox = cx + r * Math.cos(angle * Math.PI / 180)
  const oy = cx + r * Math.sin(angle * Math.PI / 180)
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <defs>
        <radialGradient id="slg">
          <stop offset="0%"   stopColor="#22c55e" stopOpacity=".14"/>
          <stop offset="100%" stopColor="#22c55e" stopOpacity="0"/>
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cx} r={cx} fill="url(#slg)"/>
      <circle cx={cx} cy={cx} r={r + 1.5} fill="none" stroke="rgba(34,197,94,.12)" strokeWidth=".5"/>
      <path d={`M${cx} ${cx*.3} A${r*.8} ${r*.8} 0 0 1 ${cx+r*.8} ${cx*.7}`} fill="none" stroke="#22c55e" strokeWidth={size*.09} strokeLinecap="round"/>
      <polygon points={`${cx+r*.8},${cx*.55} ${cx+r*1.1},${cx*.74} ${cx+r*.5},${cx*.76}`} fill="#22c55e"/>
      <path d={`M${cx+r*.8} ${cx*.7} Q${cx} ${cx*.95} ${cx-r*.8} ${cx*1.2}`} fill="none" stroke="#22c55e" strokeWidth={size*.065} strokeLinecap="round" opacity=".5"/>
      <path d={`M${cx-r*.8} ${cx*1.2} A${r*.8} ${r*.8} 0 0 0 ${cx} ${cx*1.6}`} fill="none" stroke="#22c55e" strokeWidth={size*.09} strokeLinecap="round"/>
      <polygon points={`${cx},${cx*1.5} ${cx-r*.4},${cx*1.65} ${cx+r*.4},${cx*1.65}`} fill="#22c55e"/>
      <circle cx={ox} cy={oy} r={size*.04} fill="#22c55e" opacity=".85"/>
    </svg>
  )
}

// ── Wallet connect modal ──────────────────────────────────────────────────────
function WalletModal({ onClose, onMM, onWC, connecting }) {
  return (
    <div className={s.wcModal} onClick={onClose}>
      <div className={s.wcCard} onClick={e => e.stopPropagation()}>
        <div className={s.wcTitle}>Connect Wallet</div>
        <div className={s.wcSub}>Choose how to connect to SOLODEX</div>
        <div className={s.wcOpts}>
          <button className={s.wcOpt} onClick={onMM} disabled={connecting}>
            <div className={s.wcOptIcon} style={{ background: '#F6851B' }}>
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
            <div className={s.wcOptIcon} style={{ background: '#3B99FC' }}>
              <svg viewBox="0 0 40 40" width="24" height="24">
                <path fill="#fff" d="M8 15C14 9 26 9 32 15L34 17 36 15C28 7 12 7 4 15L6 17 8 15zm4 4C16 15 24 15 28 19L30 21 32 19C26 13 14 13 8 19L10 21 12 19zm4 4l2-2 2 2 2-2 2 2-6 6-6-6 2 2z"/>
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

// ── Points badge ──────────────────────────────────────────────────────────────
function PtsBadge({ total }) {
  const [bump, setBump] = useState(false)
  const prev = useRef(0)
  useEffect(() => {
    if (total > prev.current && prev.current > 0) {
      setBump(true)
      setTimeout(() => setBump(false), 600)
    }
    prev.current = total
  }, [total])
  return (
    <div className={`${s.ptsBadge} ${bump ? s.bump : ''}`} title={`${total.toLocaleString()} SDX points`}>
      <span className={s.ptsVal}>{total.toLocaleString()}</span>
      <span className={s.ptsLbl}>SDX</span>
    </div>
  )
}

// ── Wallet button + dropdown ──────────────────────────────────────────────────
function WalletArea({ wallet, onOpenModal }) {
  const [open, setOpen] = useState(false)
  const ref = useRef()
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [])

  if (!wallet.account) {
    return (
      <button className={s.walletBtn} onClick={onOpenModal} disabled={wallet.connecting}>
        {wallet.connecting ? 'Connecting…' : 'Connect'}
      </button>
    )
  }

  const short = wallet.account.slice(0, 6) + '…' + wallet.account.slice(-4)
  return (
    <div className={s.walletArea} ref={ref}>
      <button className={`${s.walletBtn} ${s.walletBtnConnected}`} onClick={() => setOpen(o => !o)}>
        <div className={s.walletAvatar}>{wallet.account.slice(2, 4).toUpperCase()}</div>
        <span className={s.walletAddr}>{short}</span>
        <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor" opacity=".5">
          <path d="M1 3l4 4 4-4"/>
        </svg>
      </button>
      {open && (
        <div className={s.dropMenu}>
          <div className={s.dropItem} style={{ cursor: 'default', pointerEvents: 'none' }}>
            {wallet.chainId === 97 ? 'BSC Testnet' : wallet.chainId === 56 ? 'BSC Mainnet' : `Chain ${wallet.chainId}`}
          </div>
          <div className={s.dropDivider}/>
          {!wallet.isCorrectNetwork && (
            <button className={s.dropItem} onClick={() => { wallet.switchToTestnet(); setOpen(false) }}>
              Switch to BSC Testnet
            </button>
          )}
          <button className={`${s.dropItem} ${s.danger}`} onClick={() => { wallet.disconnect(); setOpen(false) }}>
            Disconnect
          </button>
        </div>
      )}
    </div>
  )
}

// ── Invite gate ───────────────────────────────────────────────────────────────
function InviteGate({ invite }) {
  const [code, setCode] = useState('')
  return (
    <div className={s.gate}>
      <div className={s.gateCard}>
        <SLogo size={52}/>
        <div className={s.gateTitle}>SOLODEX</div>
        <div className={s.gateSub}>
          Invite-only until 30 May 2026.<br/>
          Enter your 6-character invite code.
        </div>
        <input
          className={s.gateInput}
          placeholder="e.g. AB3X9Z"
          value={code}
          onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6))}
          onKeyDown={e => { if (e.key === 'Enter' && code.length === 6) invite.submitCode(code) }}
          maxLength={6}
          autoFocus
          autoComplete="off"
          spellCheck={false}
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

// ── Dashboard sidebar ─────────────────────────────────────────────────────────
function DashCard({ title, children }) {
  return (
    <div className={s.dashCard}>
      {title && <div className={s.dashCardTitle}>{title}</div>}
      {children}
    </div>
  )
}

function PointsSidebar({ points }) {
  return (
    <DashCard title="Points">
      {[
        { label: 'On-chain', val: points.onChainPoints || 0 },
        { label: 'Quests', val: points.questPts },
        { label: 'Claimable', val: points.claimableQuestPts },
      ].map(r => (
        <div key={r.label} className={s.ptsRow}>
          <span className={s.ptsRowLabel}>{r.label}</span>
          <span className={s.ptsRowVal}>{r.val.toLocaleString()}</span>
        </div>
      ))}
      <div className={s.ptsTotal}>
        <span className={s.ptsTotalLabel}>Total</span>
        <span className={s.ptsTotalVal}>{points.totalPoints.toLocaleString()}</span>
      </div>
    </DashCard>
  )
}

function InviteCodesSidebar({ invite }) {
  const [copied, setCopied] = useState(null)

  const copy = (code, i) => {
    navigator.clipboard.writeText(code)
      .then(() => { setCopied(i); setTimeout(() => setCopied(null), 1500) })
      .catch(() => {})
  }

  const msLeft   = Math.max(0, invite.nextRefresh - Date.now())
  const days     = Math.floor(msLeft / 86400000)
  const hrs      = Math.floor((msLeft % 86400000) / 3600000)
  const resetStr = msLeft > 0 ? `New codes in ${days}d ${hrs}h` : 'Refreshing…'

  return (
    <DashCard title="Invite Codes">
      <p style={{ fontSize: 11, color: 'var(--tm)', marginBottom: 10 }}>{resetStr}</p>
      {invite.myCodes.length === 0 ? (
        <p style={{ fontSize: 12, color: 'var(--td)' }}>No codes yet</p>
      ) : (
        invite.myCodes.map(({ code, usedAt }, i) => (
          <div
            key={code}
            className={s.codeItem}
            onClick={() => { if (!usedAt) copy(code, i) }}
            style={{ opacity: usedAt ? 0.4 : 1, cursor: usedAt ? 'default' : 'pointer' }}
          >
            <span style={{
              textDecoration: usedAt ? 'line-through' : 'none',
              fontFamily: 'var(--mono)',
              fontSize: 13,
              letterSpacing: '.1em',
              color: usedAt ? 'var(--td)' : 'var(--green)',
            }}>
              {code}
            </span>
            <span className={s.codeCopyTag} style={{
              color: usedAt ? 'var(--red)' : copied === i ? 'var(--green)' : 'var(--tm)',
            }}>
              {usedAt ? 'used' : copied === i ? '✓' : 'copy'}
            </span>
          </div>
        ))
      )}
    </DashCard>
  )
}

// ── Quests panel ──────────────────────────────────────────────────────────────
function QuestsPanel({ wallet, invite, points }) {
  const { quests, completed, loading, completeQuest } = useQuests(wallet.account)
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    const tick = () => {
      const d = EARLY_DEADLINE - Date.now()
      if (d <= 0) { setCountdown('Expired'); return }
      const dy = Math.floor(d / 86400000)
      const hr = Math.floor((d % 86400000) / 3600000)
      setCountdown(`${dy}d ${hr}h left`)
    }
    tick()
    const t = setInterval(tick, 60000)
    return () => clearInterval(t)
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
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 className={s.panelTitle}>Quests</h2>
          <p className={s.panelSub}>Complete tasks · Earn SDX · Claim weekly</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>
            {totalEarned.toLocaleString()}
          </div>
          <div style={{ fontSize: 10, color: 'var(--tm)' }}>SDX earned</div>
        </div>
      </div>

      {/* Early tester */}
      <div style={{
        background: invite.earlyDone ? 'var(--bg2)' : 'var(--gf)',
        border: `1px solid ${invite.earlyDone ? 'var(--border)' : 'rgba(34,197,94,.2)'}`,
        borderRadius: 'var(--rl)', padding: '14px 16px', marginBottom: 16,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--tw)', marginBottom: 3 }}>Early Tester Badge</div>
          <div style={{ fontSize: 11, color: 'var(--td)' }}>
            {invite.earlyDone ? 'Claimed — genesis cohort confirmed.'
              : invite.earlyExpired ? 'Offer expired.'
              : `Available until 30 May 2026 · ${countdown}`}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--mono)', fontSize: 13, fontWeight: 700, color: 'var(--green)' }}>+1000 SDX</span>
          {invite.earlyDone ? (
            <span style={{ fontSize: 11, color: 'var(--green)' }}>Done</span>
          ) : invite.earlyExpired ? (
            <span style={{ fontSize: 11, color: 'var(--tm)' }}>Expired</span>
          ) : (
            <button
              onClick={handleEarly}
              disabled={!wallet.account}
              style={{ background: 'var(--green)', color: '#000', fontWeight: 700, fontSize: 12, padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer', fontFamily: 'var(--font)' }}
            >
              Claim
            </button>
          )}
        </div>
      </div>

      {/* Twitter quests */}
      <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--tm)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 12 }}>
        Twitter / X Quests
      </div>

      {loading && <div style={{ fontSize: 12, color: 'var(--td)', padding: '20px 0', textAlign: 'center' }}>Loading…</div>}
      {!loading && quests.length === 0 && (
        <div style={{ fontSize: 12, color: 'var(--td)', padding: '20px 0', textAlign: 'center', lineHeight: 1.8 }}>
          No active quests yet.<br/>Check back soon.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {quests.map(q => {
          const done = !!completed[q.id]
          return (
            <div
              key={q.id}
              style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 'var(--rl)', padding: '12px 14px',
                display: 'flex', alignItems: 'center', gap: 12,
                opacity: done ? .65 : 1, transition: 'opacity .2s',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#1d9bf0" style={{ flexShrink: 0 }}>
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.91-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, color: 'var(--tw)', fontWeight: 500, marginBottom: 2 }}>{q.title}</div>
                <a
                  href={q.url}
                  target="_blank"
                  rel="noreferrer"
                  onClick={e => e.stopPropagation()}
                  style={{ fontSize: 11, color: 'var(--tm)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}
                >
                  {q.url.slice(0, 50)}{q.url.length > 50 ? '…' : ''}
                </a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5, flexShrink: 0 }}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: 12, fontWeight: 700, color: 'var(--green)' }}>
                  +{q.pts}
                </span>
                {done ? (
                  <span style={{ fontSize: 10, color: 'var(--green)' }}>Done</span>
                ) : (
                  <button
                    onClick={() => handleTweet(q.id, q.url)}
                    disabled={!wallet.account}
                    style={{ background: '#1d9bf0', color: '#fff', fontWeight: 600, fontSize: 11, padding: '4px 10px', borderRadius: 5, border: 'none', cursor: 'pointer' }}
                  >
                    Go
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <p style={{ fontSize: 11, color: 'var(--tm)', marginTop: 16, lineHeight: 1.7 }}>
        Quest points are claimable from the <strong style={{ color: 'var(--td)' }}>Claim SDX</strong> tab.
      </p>
    </div>
  )
}

// ── Tabs definition ───────────────────────────────────────────────────────────
const TABS = [
  { id: 'swap',        label: 'Swap',      cls: '' },
  { id: 'staking',     label: 'Stake',     cls: '' },
  { id: 'liquidity',   label: 'Pool',      cls: '' },
  { id: 'quests',      label: 'Quests',    cls: '' },
  { id: 'claim',       label: 'Claim SDX', cls: '' },
  { id: 'identity',    label: 'Identity',  cls: s.tabIdentity },
  { id: 'faucet',      label: 'Faucet',    cls: '' },
  { id: 'leaderboard', label: 'Ranks',     cls: '' },
  { id: 'nft',         label: 'NFTs',      cls: s.tabNft },
  { id: 'slots',       label: 'Slots',     cls: s.tabSlot },
]

const FULL_WIDTH = new Set(['nft', 'slots'])

const NAV_PATHS = {
  swap:    'M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0 4-4m-4 4-4-4',
  staking: 'M13 10V3L4 14h7v7l9-11h-7z',
  quests:  'M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  nft:     'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
  slots:   'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z',
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const wallet = useWallet()
  const dex    = useDEX(wallet.signer, wallet.account)
  const links  = useLinks()

  // Pass isRegisteredOnChain to bypass invite gate for existing users
  const alreadyRegistered = !!dex.userInfo?.registered
  const invite = useInvite(wallet.account, alreadyRegistered)
  const points = usePoints(wallet.account, dex.userInfo?.totalPoints || 0)

  const [tab,       setTab]       = useState('swap')
  const [showModal, setShowModal] = useState(false)
  const [regRef,    setRegRef]    = useState('')
  const [scrolled,  setScrolled]  = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 4)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const gateActive = !!wallet.account
    && !invite.unlocked
    && !alreadyRegistered
    && Date.now() < INVITE_DEADLINE

  const handleMM = useCallback(async () => {
    setShowModal(false)
    await wallet.connectMetaMask()
  }, [wallet])

  const handleWC = useCallback(async () => {
    setShowModal(false)
    await wallet.connectWalletConnect()
  }, [wallet])

  const isFullWidth = FULL_WIDTH.has(tab)

  return (
    <div className={s.app}>
      <CinematicBg/>

      {/* Invite gate */}
      {gateActive && <InviteGate invite={invite}/>}

      {/* WalletConnect modal */}
      {showModal && (
        <WalletModal
          onClose={() => setShowModal(false)}
          onMM={handleMM}
          onWC={handleWC}
          connecting={wallet.connecting}
        />
      )}

      {/* Header */}
      <header className={`${s.header} ${scrolled ? s.scrolled : ''}`}>
        <div className={s.headerInner}>
          <div className={s.logo}>
            <SLogo size={28}/>
            <span style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: 13,
              fontWeight: 400,
              color: 'rgba(235,235,235,.82)',
              letterSpacing: '.36em',
              textTransform: 'uppercase',
            }}>
              SOLODEX
            </span>
            <span className={s.chainBadge}>
              <span className={s.chainDot}/>
              97
            </span>
          </div>

          <nav style={{ display: 'flex', gap: 4, marginLeft: 18 }}>
            {[['twitter', 'Twitter'], ['discord', 'Discord']].map(([k, l]) =>
              links[k] && links[k] !== '#' ? (
                <a key={k} href={links[k]} target="_blank" rel="noreferrer" className={s.navLink}>{l}</a>
              ) : null
            )}
          </nav>

          <div className={s.sep}/>

          <div className={s.right}>
            {wallet.account && alreadyRegistered && (
              <>
                {dex.streak >= 2 && (
                  <span className={s.streak}>{dex.streak}d streak</span>
                )}
                <PtsBadge total={points.totalPoints}/>
              </>
            )}
            <WalletArea wallet={wallet} onOpenModal={() => setShowModal(true)}/>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={s.main}>

        {/* Not connected */}
        {!wallet.account && (
          <div className={s.connectScreen}>
            <div style={{ marginBottom: 12 }}><SLogo size={72}/></div>
            <h1 className={s.connectHero}>SOLODEX</h1>
            <p className={s.connectTagline}>
              Incentivised testnet DEX on BNB Smart Chain.<br/>
              Swap · Stake · Earn SDX · Win NFTs.
            </p>
            <button className={s.connectBtn} onClick={() => setShowModal(true)}>
              Connect Wallet
            </button>
          </div>
        )}

        {/* Connected, gate passed */}
        {wallet.account && !gateActive && (
          <>
            {/* Wrong network */}
            {!wallet.isCorrectNetwork && (
              <div className={s.netBanner}>
                <span className={s.netText}>Switch to BNB Smart Chain Testnet (Chain ID 97)</span>
                <button className={s.netBtn} onClick={wallet.switchToTestnet}>Switch</button>
              </div>
            )}

            {/* Register */}
            {wallet.isCorrectNetwork && dex.userInfo && !dex.userInfo.registered && (
              <div className={s.regBanner}>
                <span className={s.regLabel}>Register to start earning SDX</span>
                <input
                  className={s.regInput}
                  placeholder="Referral code (optional)"
                  value={regRef}
                  onChange={e => setRegRef(e.target.value)}
                />
                <button
                  className={s.regBtn}
                  onClick={() => dex.register(regRef)}
                  disabled={dex.loading}
                >
                  {dex.loading ? 'Registering…' : 'Register +250 SDX'}
                </button>
              </div>
            )}

            {/* Main layout */}
            <div className={s.layout} style={isFullWidth ? { gridTemplateColumns: '1fr' } : {}}>
              <div>
                <div className={s.tabsWrap}>
                  <nav className={s.tabs}>
                    {TABS.map(t => (
                      <button
                        key={t.id}
                        className={`${s.tab} ${t.cls} ${tab === t.id ? s.tabActive : ''}`}
                        onClick={() => setTab(t.id)}
                      >
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

              {!isFullWidth && (
                <aside className={s.sidebar}>
                  <PointsSidebar points={points}/>
                  <InviteCodesSidebar invite={invite}/>
                </aside>
              )}
            </div>
          </>
        )}
      </main>

      {/* Mobile bottom nav */}
      <nav className={s.mobileNav}>
        {['swap', 'staking', 'quests', 'nft', 'slots'].map(id => (
          <button
            key={id}
            className={`${s.mobileNavBtn} ${tab === id ? s.active : ''}`}
            onClick={() => setTab(id)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d={NAV_PATHS[id] || NAV_PATHS.swap}/>
            </svg>
            <span>{id.charAt(0).toUpperCase() + id.slice(1)}</span>
          </button>
        ))}
      </nav>

      {/* Transaction toast */}
      {dex.txHash && (
        <div className={s.toast}>
          <span className={s.toastDot}/>
          <span className={s.toastText}>Transaction submitted</span>
          <a
            href={`https://testnet.bscscan.com/tx/${dex.txHash}`}
            target="_blank"
            rel="noreferrer"
            className={s.toastLink}
          >
            View ↗
          </a>
        </div>
      )}
    </div>
  )
}
