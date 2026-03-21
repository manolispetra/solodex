import React, { useState } from 'react'

const POOLS = [
  { token:'tWBNB', sym:'W', apr:18.4, tvl:'$8.4K', col:'245,158,11', badge:'HOT', badgeCol:'245,158,11' },
  { token:'tUSDT', sym:'U', apr:12.1, tvl:'$5.9K', col:'34,197,94',  badge:'NEW', badgeCol:'96,165,250' },
]

export default function StakingPanel({ wallet, dex }) {
  const [sel,    setSel]    = useState(null)
  const [amount, setAmount] = useState('')
  const [loading,setLoading]= useState(false)

  const pool = sel !== null ? POOLS[sel] : null
  const bal  = pool?.token === 'tWBNB' ? '10.00' : '120.00'
  const daily= amount && pool ? (parseFloat(amount)*(pool.apr/100/365)*665).toFixed(4) : '0.0000'
  const pct  = amount && bal   ? Math.min(100, parseFloat(amount)/parseFloat(bal)*100) : 0

  const card = (p,i) => (
    <div key={i} onClick={()=>{setSel(i);setAmount('')}}
      style={{background:'var(--bg2)',border:`1px solid ${sel===i?`rgba(${p.col},.4)`:'var(--border)'}`,borderRadius:20,padding:20,cursor:'pointer',transition:'all .18s',position:'relative',overflow:'hidden'}}
      onMouseEnter={e=>e.currentTarget.style.transform='translateY(-2px)'}
      onMouseLeave={e=>e.currentTarget.style.transform=''}
    >
      <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,rgb(${p.col}),var(--accent-teal))`}}/>
      <div style={{display:'inline-flex',alignItems:'center',gap:5,fontSize:9,fontWeight:700,letterSpacing:'.1em',textTransform:'uppercase',borderRadius:100,padding:'3px 9px',marginBottom:14,fontFamily:'var(--mono)',background:`rgba(${p.badgeCol},.12)`,border:`1px solid rgba(${p.badgeCol},.25)`,color:`rgb(${p.badgeCol})`}}>
        {p.badge}
      </div>
      <div style={{fontSize:32,fontWeight:800,color:`rgb(${p.col})`,lineHeight:1,marginBottom:4}}>{p.apr}%</div>
      <div style={{fontSize:10,color:'var(--text-dim)',marginBottom:14,fontFamily:'var(--mono)'}}>APR — resets daily</div>
      <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:12}}>
        <div style={{width:26,height:26,borderRadius:'50%',background:`rgba(${p.col},.12)`,border:`1.5px solid rgba(${p.col},.25)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,color:`rgb(${p.col})`}}>{p.sym}</div>
        <span style={{fontSize:14,fontWeight:700,color:'var(--white)'}}>{p.token}</span>
      </div>
      <div style={{display:'flex',gap:18}}>
        <div>
          <div style={{fontSize:10,color:'var(--text-mute)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:3}}>TVL</div>
          <div style={{fontFamily:'var(--mono)',fontSize:13,fontWeight:700,color:'var(--text)'}}>{p.tvl}</div>
        </div>
        <div>
          <div style={{fontSize:10,color:'var(--text-mute)',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:3}}>Your Stake</div>
          <div style={{fontFamily:'var(--mono)',fontSize:13,fontWeight:700,color:'var(--text)'}}>0.00</div>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:10}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:800,color:'var(--white)'}}>Stake</h2>
          <p style={{fontSize:13,color:'var(--text-dim)',marginTop:3}}>Lock tokens, earn SDX · +800 pts on stake · +50 pts/day</p>
        </div>
        <div style={{display:'flex',gap:8}}>
          {[['14.2K','Total Staked','var(--green-bright)'],['12h 34m','Next Reward','var(--amber)']].map(([v,l,c])=>(
            <div key={l} style={{background:`rgba(34,197,94,.07)`,border:'1px solid var(--border)',borderRadius:'var(--r)',padding:'8px 14px',textAlign:'center'}}>
              <div style={{fontFamily:'var(--mono)',fontSize:18,fontWeight:700,color:c}}>{v}</div>
              <div style={{fontSize:10,color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:'.08em'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:18}}>
        {POOLS.map((p,i)=>card(p,i))}
      </div>

      {/* Input */}
      <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:20,padding:20}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
          <span style={{fontSize:14,fontWeight:700,color:'var(--white)'}}>
            {pool ? `Stake ${pool.token}` : 'Select a pool above'}
          </span>
          {pool && <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text-dim)'}}>Balance: {bal} {pool.token}</span>}
        </div>

        <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:14}}>
          <input
            value={amount} onChange={e=>{setAmount(e.target.value)}}
            placeholder="0.0" disabled={!pool}
            style={{flex:1,background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:14,padding:'12px 14px',fontFamily:'var(--mono)',fontSize:18,fontWeight:700,color:'var(--white)',outline:'none',transition:'border-color .15s',opacity:pool?1:.5}}
            onFocus={e=>e.target.style.borderColor='var(--border-md)'}
            onBlur={e=>e.target.style.borderColor='var(--border)'}
          />
          <button onClick={()=>setAmount(bal)} disabled={!pool} style={{padding:'8px 14px',borderRadius:'var(--r)',background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.22)',color:'var(--green-bright)',fontSize:11,fontWeight:700,cursor:pool?'pointer':'not-allowed',fontFamily:'var(--mono)',transition:'all .15s',opacity:pool?1:.5}}>MAX</button>
        </div>

        {/* Progress bar */}
        <div style={{height:6,borderRadius:3,background:'var(--bg3)',marginBottom:6,overflow:'hidden'}}>
          <div style={{height:'100%',borderRadius:3,background:'linear-gradient(90deg,var(--green),var(--accent-teal))',width:`${pct}%`,transition:'width .4s ease'}}/>
        </div>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:10,fontFamily:'var(--mono)',color:'var(--text-dim)',marginBottom:14}}>
          {['0%','25%','50%','75%','100%'].map(l=><span key={l}>{l}</span>)}
        </div>

        {/* Daily reward estimate */}
        <div style={{display:'flex',alignItems:'center',gap:10,background:'rgba(34,197,94,.07)',border:'1px solid rgba(34,197,94,.15)',borderRadius:14,padding:'12px 14px',marginBottom:14}}>
          <div style={{width:32,height:32,borderRadius:'50%',background:'rgba(34,197,94,.12)',border:'1px solid rgba(34,197,94,.22)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <div>
            <div style={{fontFamily:'var(--mono)',fontSize:18,fontWeight:700,color:'var(--green-bright)'}}>{daily} SDX</div>
            <div style={{fontSize:11,color:'var(--text-dim)'}}>Estimated daily reward</div>
          </div>
          {pool && amount && <div style={{marginLeft:'auto',textAlign:'right'}}>
            <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text-dim)'}}>Yearly</div>
            <div style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:700,color:'var(--amber)'}}>{(parseFloat(daily)*365).toFixed(1)} SDX</div>
          </div>}
        </div>

        <button
          disabled={!amount||!pool||!wallet.account||loading}
          onClick={async()=>{setLoading(true);await dex?.stake?.(pool.token,amount).catch(()=>{});setLoading(false)}}
          style={{width:'100%',padding:16,borderRadius:20,border:'none',cursor:(!amount||!pool||!wallet.account||loading)?'not-allowed':'pointer',background:'linear-gradient(135deg,var(--green) 0%,var(--green-dim) 100%)',color:'#021a0c',fontSize:15,fontWeight:800,letterSpacing:'.06em',fontFamily:'var(--font)',position:'relative',overflow:'hidden',transition:'all .18s',opacity:(!amount||!pool||!wallet.account)?0.5:1}}
          onMouseEnter={e=>{if(!e.currentTarget.disabled){e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 0 36px rgba(34,197,94,.28)'}}}
          onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=''}}
        >
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(255,255,255,.14),transparent)',pointerEvents:'none'}}/>
          {loading?'Staking…':!wallet.account?'Connect Wallet':!pool?'Select Pool':!amount?'Enter Amount':'Stake Tokens'}
        </button>
      </div>
    </div>
  )
}
