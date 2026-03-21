import React, { useState, useEffect } from 'react'

const TOKENS = [
  { name:'tWBNB', sym:'W', amount:10,  col:'245,158,11', desc:'Wrapped BNB' },
  { name:'tUSDT', sym:'U', amount:50,  col:'34,197,94',  desc:'Tether USD' },
  { name:'tBUSD', sym:'B', amount:50,  col:'167,139,250',desc:'Binance USD' },
]

export default function FaucetPanel({ wallet, dex }) {
  const [loading, setLoading] = useState(false)
  const [done,    setDone]    = useState(false)
  const [cdStr,   setCdStr]   = useState('')

  useEffect(()=>{
    const next = Date.now() + (18*3600+44*60)*1000
    const tick = ()=>{
      const d = next - Date.now()
      if(d<=0){setCdStr('Ready to claim!');return}
      const h=Math.floor(d/3600000),m=Math.floor((d%3600000)/60000)
      setCdStr(`Next drip in: ${h}h ${m}m`)
    }
    tick(); const t=setInterval(tick,30000); return()=>clearInterval(t)
  },[])

  const claim = async()=>{
    setLoading(true)
    await Promise.all(TOKENS.map(t=>dex?.faucet?.(t.name,t.amount).catch(()=>{}))).catch(()=>{})
    setLoading(false); setDone(true)
  }

  return (
    <div style={{maxWidth:520,margin:'0 auto'}}>
      {/* Hero card */}
      <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:24,padding:28,marginBottom:18,textAlign:'center',position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',top:0,left:0,right:0,height:2,background:'linear-gradient(90deg,transparent,var(--accent-teal),var(--green),transparent)'}}/>

        {/* Orb */}
        <div style={{width:88,height:88,borderRadius:'50%',margin:'0 auto 20px',background:'radial-gradient(circle at 35% 35%,rgba(6,214,160,.22),rgba(34,197,94,.1) 60%,transparent 80%)',border:'1px solid rgba(34,197,94,.2)',display:'flex',alignItems:'center',justifyContent:'center',position:'relative'}}>
          <div style={{position:'absolute',width:108,height:108,borderRadius:'50%',border:'1px solid rgba(34,197,94,.07)',top:-10,left:-10,animation:'orbPulse 3s ease infinite'}}/>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 22V2M2 12h20"/><circle cx="12" cy="12" r="9" opacity=".3"/>
          </svg>
        </div>

        <h2 style={{fontSize:24,fontWeight:800,color:'var(--white)',marginBottom:6}}>Testnet Faucet</h2>
        <p style={{fontSize:13,color:'var(--text-dim)',lineHeight:1.65,marginBottom:18}}>
          Get free testnet tokens to explore SOLODEX.<br/>
          Drip resets every 24 hours per wallet address.
        </p>

        <div style={{fontFamily:'var(--mono)',fontSize:13,fontWeight:700,color:'var(--amber)',background:'rgba(245,158,11,.1)',border:'1px solid rgba(245,158,11,.2)',borderRadius:8,padding:'7px 16px',display:'inline-block'}}>
          {cdStr}
        </div>
      </div>

      {/* Token cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:18}}>
        {TOKENS.map(t=>(
          <div key={t.name} style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:20,padding:18,textAlign:'center',transition:'all .18s',position:'relative',overflow:'hidden',cursor:'default'}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=`rgba(${t.col},.35)`;e.currentTarget.style.transform='translateY(-2px)'}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform=''}}>
            <div style={{position:'absolute',bottom:0,left:0,right:0,height:2,background:`linear-gradient(90deg,transparent,rgb(${t.col}),transparent)`,opacity:0,transition:'opacity .2s'}}/>
            <div style={{width:48,height:48,borderRadius:'50%',margin:'0 auto 12px',background:`rgba(${t.col},.12)`,border:`1.5px solid rgba(${t.col},.22)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,fontWeight:800,color:`rgb(${t.col})`}}>{t.sym}</div>
            <div style={{fontSize:14,fontWeight:700,color:'var(--white)',marginBottom:3}}>{t.name}</div>
            <div style={{fontFamily:'var(--mono)',fontSize:24,fontWeight:700,color:`rgb(${t.col})`,lineHeight:1,marginBottom:4}}>{t.amount}</div>
            <div style={{fontSize:10,color:'var(--text-dim)',textTransform:'uppercase',letterSpacing:'.08em'}}>Per 24h</div>
          </div>
        ))}
      </div>

      {/* Address / stats */}
      <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:16,padding:'14px 18px',marginBottom:16}}>
        {[
          ['Your address', wallet.account ? wallet.account.slice(0,6)+'…'+wallet.account.slice(-4) : 'Not connected'],
          ['Network', 'BNB Smart Chain Testnet'],
          ['Total claimed', done?'Just now':'—'],
        ].map(([l,v])=>(
          <div key={l} style={{display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid rgba(34,197,94,.06)'}}>
            <span style={{fontSize:12,color:'var(--text-dim)'}}>{l}</span>
            <span style={{fontFamily:'var(--mono)',fontSize:12,color:done&&l==='Total claimed'?'var(--green-bright)':'var(--text)'}}>{v}</span>
          </div>
        ))}
      </div>

      {done ? (
        <div style={{background:'rgba(34,197,94,.08)',border:'1px solid rgba(34,197,94,.22)',borderRadius:20,padding:'20px',textAlign:'center'}}>
          <div style={{fontSize:32,marginBottom:8}}>✓</div>
          <div style={{fontSize:16,fontWeight:700,color:'var(--green-bright)',marginBottom:4}}>Tokens sent!</div>
          <div style={{fontSize:13,color:'var(--text-dim)'}}>10 tWBNB · 50 tUSDT · 50 tBUSD dispatched to your wallet</div>
        </div>
      ) : (
        <button
          onClick={claim} disabled={loading||!wallet.account||!wallet.isCorrectNetwork}
          style={{width:'100%',padding:16,borderRadius:20,border:'none',cursor:(loading||!wallet.account||!wallet.isCorrectNetwork)?'not-allowed':'pointer',background:'linear-gradient(135deg,var(--accent-teal) 0%,var(--green) 100%)',color:'#021a0c',fontSize:14,fontWeight:800,letterSpacing:'.06em',fontFamily:'var(--font)',position:'relative',overflow:'hidden',transition:'all .18s',opacity:(loading||!wallet.account||!wallet.isCorrectNetwork)?0.55:1}}
          onMouseEnter={e=>{if(!e.currentTarget.disabled){e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 0 32px rgba(6,214,160,.28)'}}}
          onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=''}}
        >
          <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(255,255,255,.14),transparent)',pointerEvents:'none'}}/>
          {loading?'Sending tokens…':!wallet.account?'Connect Wallet':!wallet.isCorrectNetwork?'Switch to BSC Testnet':'Claim All Tokens'}
        </button>
      )}

      <style>{`@keyframes orbPulse{0%,100%{transform:scale(1);opacity:.5}50%{transform:scale(1.1);opacity:1}}`}</style>
    </div>
  )
}
