import React, { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'
import IDENTITY_CFG from '../config/identityContract.json'
import s from '../styles/App.module.css'

const ABI = [
  'function mint() external payable',
  'function hasMinted(address) view returns (bool)',
  'function MINT_FEE_WEI() view returns (uint256)',
  'function getMintInfo(address) view returns (bool canMint, uint256 feeWei, string nextTier)',
  'function totalMinted() view returns (uint256)',
]

const TIERS  = ['Genesis','Pioneer','Builder','Degen','Tester']
const COLORS = ['#00d4ff','#22c55e','#aa66ff','#f59e0b','#ff4466']

function getTier(total) {
  if (total < 100)  return 0
  if (total < 500)  return 1
  if (total < 2000) return 2
  if (total < 5000) return 3
  return 4
}

function BadgePreview({ tier, tokenNum }) {
  const color = COLORS[tier]
  const tierName = TIERS[tier]
  return (
    <div className={s.identityBadge}>
      <div className={s.badgeSvgWrap} style={{ borderColor: color }}>
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="bbg" cx="50%" cy="45%" r="65%">
              <stop offset="0%" stopColor="#0d1a10"/>
              <stop offset="100%" stopColor="#020a04"/>
            </radialGradient>
            <radialGradient id="bgl" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={color} stopOpacity="0.18"/>
              <stop offset="100%" stopColor={color} stopOpacity="0"/>
            </radialGradient>
          </defs>
          <rect width="200" height="200" fill="url(#bbg)"/>
          <rect width="200" height="200" fill="url(#bgl)"/>
          <circle cx="100" cy="90" r="58" fill="none" stroke={color} strokeWidth="1" strokeDasharray="5,4" opacity="0.4"/>
          {/* S-logo */}
          <path d="M100 62 A22 22 0 0 1 122 84" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"/>
          <polygon points="122,77 130,86 114,87" fill={color}/>
          <path d="M122 84 Q100 95 78 106" fill="none" stroke={color} strokeWidth="5" strokeLinecap="round" opacity="0.5"/>
          <path d="M78 106 A22 22 0 0 0 100 128" fill="none" stroke={color} strokeWidth="7" strokeLinecap="round"/>
          <polygon points="100,121 90,131 110,131" fill={color}/>
          {/* Labels */}
          <text x="100" y="158" textAnchor="middle" fontFamily="Arial Black" fontSize="13" fontWeight="900" fill={color} letterSpacing="2">SOLODEX</text>
          <text x="100" y="172" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={color} opacity="0.5" letterSpacing="2">IDENTITY</text>
          <text x="100" y="185" textAnchor="middle" fontFamily="monospace" fontSize="7" fill={color} opacity="0.7">{tierName} #{tokenNum}</text>
        </svg>
      </div>
      <div className={s.badgeTierName} style={{ color }}>{tierName} Tier</div>
      <div className={s.badgeSerial}>Mint #{tokenNum} · BNB Mainnet</div>
    </div>
  )
}

export default function IdentityMint({ wallet }) {
  const [info,    setInfo]    = useState(null)
  const [loading, setLoading] = useState(false)
  const [minting, setMinting] = useState(false)
  const [minted,  setMinted]  = useState(false)
  const [txHash,  setTxHash]  = useState(null)
  const [error,   setError]   = useState(null)

  const deployed = IDENTITY_CFG.SoloDEXIdentity !== '0x0000000000000000000000000000000000000000'
  const feeWei   = BigInt(IDENTITY_CFG.mintFeeWei || '3000000000000000')
  const feeEth   = ethers.formatEther(feeWei)

  const load = useCallback(async () => {
    if (!wallet.account || !deployed) return
    setLoading(true)
    try {
      // Use mainnet provider (read-only)
      const mainnetRpc = new ethers.JsonRpcProvider('https://bsc-dataseed1.binance.org/')
      const contract   = new ethers.Contract(IDENTITY_CFG.SoloDEXIdentity, ABI, mainnetRpc)
      const [hasMinted, total] = await Promise.all([
        contract.hasMinted(wallet.account),
        contract.totalMinted(),
      ])
      setInfo({ hasMinted, total: Number(total) })
      if (hasMinted) setMinted(true)
    } catch (e) {
      console.warn('Identity contract read:', e.message)
    }
    setLoading(false)
  }, [wallet.account, deployed])

  useEffect(() => { load() }, [load])

  const handleMint = async () => {
    if (!wallet.signer || !deployed) return
    setMinting(true); setError(null)
    try {
      // Must be on BNB mainnet (chainId 56)
      if (wallet.chainId !== 56) {
        await wallet.switchToMainnet()
        await new Promise(r => setTimeout(r, 1500))
      }
      const contract = new ethers.Contract(IDENTITY_CFG.SoloDEXIdentity, ABI, wallet.signer)
      const tx = await contract.mint({ value: feeWei })
      setTxHash(tx.hash)
      await tx.wait()
      setMinted(true)
      await load()
    } catch (e) {
      setError(e.reason || e.shortMessage || e.message || 'Transaction failed')
    }
    setMinting(false)
  }

  const tier     = info ? getTier(info.total) : 0
  const tokenNum = info ? info.total + 1 : '?'

  return (
    <div>
      <h2 className={s.panelTitle}>Identity Badge</h2>
      <p className={s.panelSub}>Mint your on-chain proof of testnet participation · BNB Smart Chain Mainnet</p>

      <div className={s.identityWrap}>
        <BadgePreview tier={tier} tokenNum={tokenNum}/>

        <div>
          <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 16 }}>
            A fully on-chain SVG NFT minted directly to your wallet on BNB Mainnet.
            One per wallet. Early minters get rarer tier status.
          </p>

          <div className={s.tierList}>
            {TIERS.map((t, i) => (
              <div key={t} className={s.tierRow}>
                <span className={s.tierDot} style={{ background: COLORS[i] }}/>
                <span className={s.tierLabel}>{t}</span>
                <span className={s.tierRange} style={{ color: COLORS[i] }}>
                  {['#1–100','#101–500','#501–2000','#2001–5000','#5001+'][i]}
                </span>
              </div>
            ))}
          </div>

          {!deployed && (
            <div className={s.notDeployed}>
              Contract not yet deployed to BNB Mainnet.<br/>
              Run <code>npm run deploy:identity</code> from the contracts folder.
            </div>
          )}

          {deployed && (
            <>
              <div className={s.feeRow}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Mint fee</div>
                  <div className={s.feeAmt}>{parseFloat(feeEth).toFixed(4)} BNB</div>
                  <div className={s.feeUsd}>≈ $2.00 USD</div>
                </div>
                {info && (
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>Minted so far</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 18, fontWeight: 700, color: COLORS[tier] }}>
                      {info.total.toLocaleString()}
                    </div>
                  </div>
                )}
              </div>

              {error && <div className={s.mintError}>{error}</div>}

              {!wallet.account && (
                <p style={{ fontSize: 12, color: 'var(--text-dim)', textAlign: 'center', padding: '12px 0' }}>
                  Connect your wallet to mint
                </p>
              )}

              {wallet.account && (
                minted ? (
                  <div className={s.mintedBox}>
                    <div className={s.mintedText}>✓ Identity badge minted!</div>
                    {txHash && (
                      <a href={`https://bscscan.com/tx/${txHash}`} target="_blank" rel="noreferrer" className={s.mintedTx}>
                        View on BSCScan ↗
                      </a>
                    )}
                  </div>
                ) : (
                  <button
                    className={s.mintBtn}
                    onClick={handleMint}
                    disabled={minting || loading || !wallet.account}
                  >
                    {minting ? 'Minting...' : loading ? 'Loading...' : `Mint Identity Badge — ${parseFloat(feeEth).toFixed(4)} BNB`}
                  </button>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
