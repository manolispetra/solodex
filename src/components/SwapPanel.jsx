import React, { useState, useCallback } from 'react'

const RATE = 665.21
const G = 'var(--green)', GB = 'var(--green-bright)', GD = 'var(--green-dim)'
const bg2 = 'var(--bg2)', bg3 = 'var(--bg3)'
const bdr = '1px solid var(--border)', bdm = '1px solid var(--border-md)'

function TokenBox({ label, balance, amount, onChange, token, sym, color, readonly, usdVal }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{background:bg2,border:focused?bdm:bdr,borderRadius:20,padding:'18px 20px',transition:'border .18s',position:'relative',overflow:'hidden'}}>
      <div style={{position:'absolute',top:0,left:0,right:0,height:1,background:'linear-gradient(90deg,transparent,rgba(34,197,94,.15),transparent)'}}/>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14}}>
        <span style={{fontSize:10,fontWeight:700,color:'var(--text-mute)',letterSpacing:'.12em',textTransform:'uppercase'}}>{label}</span>
        <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text-dim)',cursor:onChange?'pointer':'default'}} onClick={()=>onChange&&onChange(balance)}>
          Balance: {balance}{onChange?' → Max':''}
        </span>
      </div>
      <div style={{display:'flex',alignItems:'center',gap:12}}>
        <input
          style={{flex:1,background:'none',border:'none',outline:'none',fontFamily:'var(--mono)',fontSize:26,fontWeight:700,color:readonly?GB:'var(--white)',minWidth:0,width:'100%'}}
          placeholder="0.0" value={amount}
          onChange={e=>onChange&&onChange(e.target.value)}
          onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
          readOnly={readonly}
        />
        <div style={{display:'flex',alignItems:'center',gap:9,background:bg3,border:bdr,borderRadius:12,padding:'9px 12px',cursor:'pointer',flexShrink:0}}>
          <div style={{width:28,height:28,borderRadius:'50%',background:`rgba(${color},.12)`,border:`1.5px solid rgba(${color},.25)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:`rgb(${color})`}}>{sym}</div>
          <span style={{fontSize:14,fontWeight:700,color:'var(--white)'}}>{token}</span>
          <span style={{color:'var(--text-dim)',fontSize:10}}>▾</span>
        </div>
      </div>
      {usdVal!==undefined&&<div style={{fontFamily:'var(--mono)',fontSize:12,color:readonly?'rgba(74,222,128,.6)':'var(--text-dim)',marginTop:10}}>≈ ${usdVal} USD</div>}
    </div>
  )
}

export default function SwapPanel({ wallet, dex }) {
  const [from, setFrom] = useState('')
  const [to, setTo]     = useState('')
  const [flip, setFlip] = useState(false)
  const [slip, setSlip] = useState(0.5)

  const A = flip?'tUSDT':'tWBNB', B = flip?'tWBNB':'tUSDT'
  const Ac = flip?'34,197,94':'245,158,11', Bc = flip?'245,158,11':'34,197,94'
  const Abal = flip?'120.00':'10.00', Bbal = flip?'10.00':'120.00'
  const Asym = flip?'U':'W', Bsym = flip?'W':'U'

  const calc = useCallback(v=>{
    setFrom(v)
    const n=parseFloat(v)||0
    setTo(flip?(n/RATE*(1-0.003)).toFixed(6):(n*RATE*(1-0.003)).toFixed(2))
  },[flip])

  const doFlip = ()=>{
    setFlip(f=>!f); setFrom(to)
    setTo((parseFloat(to)||0)*(flip?RATE:1/RATE)*0.997+'')
  }

  const fn=parseFloat(from)||0, tn=parseFloat(to)||0
  const fUsd=(fn*(flip?1:RATE)).toFixed(2)
  const tUsd=(tn*(flip?RATE:1)).toFixed(2)
  const impact=(fn*0.08).toFixed(2)
  const minOut=(tn*(1-slip/100)).toFixed(flip?6:2)

  const btnText=!wallet.account?'Connect Wallet':!wallet.isCorrectNetwork?'Switch Network':!from?'Enter Amount':'Swap Tokens'
  const btnDisabled=!from||!wallet.account||!wallet.isCorrectNetwork

  return (
    <div style={{maxWidth:480,margin:'0 auto'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20}}>
        <h2 style={{fontSize:22,fontWeight:800,color:'var(--white)',letterSpacing:'.03em'}}>Swap</h2>
        <div style={{display:'flex',alignItems:'center',gap:6,background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.22)',borderRadius:100,padding:'5px 12px',fontSize:11,fontWeight:700,color:GB,fontFamily:'var(--mono)'}}>
          <div style={{width:6,height:6,borderRadius:'50%',background:G,animation:'blink 1.5s ease infinite'}}/>
          +100 SDX / swap
        </div>
      </div>

      <TokenBox label="You Pay" balance={Abal} amount={from} onChange={calc} token={A} sym={Asym} color={Ac} usdVal={fUsd}/>

      <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:'6px 0',position:'relative'}}>
        <div style={{position:'absolute',left:0,right:0,height:1,background:'var(--border)'}}/>
        <div onClick={doFlip} style={{width:40,height:40,borderRadius:'50%',background:bg2,border:bdr,display:'flex',alignItems:'center',justifyContent:'center',cursor:'pointer',zIndex:1,position:'relative',transition:'all .22s'}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor='var(--border-hi)';e.currentTarget.style.transform='rotate(180deg)'}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor='var(--border)';e.currentTarget.style.transform=''}}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="2" x2="12" y2="22"/><polyline points="19 9 12 2 5 9"/></svg>
        </div>
      </div>

      <TokenBox label="You Receive" balance={Bbal} amount={to} token={B} sym={Bsym} color={Bc} readonly usdVal={tUsd}/>

      {/* Route */}
      <div style={{margin:'14px 0 6px',fontSize:10,fontWeight:700,color:'var(--text-mute)',letterSpacing:'.12em',textTransform:'uppercase'}}>Route</div>
      <div style={{display:'flex',alignItems:'center',gap:0,overflowX:'auto',padding:'2px',scrollbarWidth:'none'}}>
        {[{sym:Asym,col:Ac,lbl:A,act:true},null,{sym:'S',col:'167,139,250',lbl:'SOLODEX',act:false},null,{sym:Bsym,col:Bc,lbl:B,act:true}].map((n,i)=>n===null?(
          <div key={i} style={{flex:1,minWidth:24,display:'flex',flexDirection:'column',alignItems:'center',gap:2,padding:'0 2px'}}>
            <div style={{height:1,background:'linear-gradient(90deg,var(--green),var(--accent-teal))',width:'100%',position:'relative'}}>
              <span style={{position:'absolute',right:-4,top:-5,fontSize:8,color:'var(--accent-teal)'}}>▶</span>
            </div>
            <span style={{fontSize:9,fontFamily:'var(--mono)',color:'var(--text-dim)'}}>0.30%</span>
          </div>
        ):(
          <div key={i} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4,flexShrink:0}}>
            <div style={{width:36,height:36,borderRadius:'50%',border:n.act?`1.5px solid rgb(${n.col})`:'1.5px solid var(--border)',background:n.act?`rgba(${n.col},.14)`:'var(--bg2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:n.act?`rgb(${n.col})`:'var(--text-dim)',boxShadow:n.act?`0 0 10px rgba(${n.col},.2)`:''}}>{n.sym}</div>
            <span style={{fontSize:9,fontFamily:'var(--mono)',color:'var(--text-dim)',whiteSpace:'nowrap'}}>{n.lbl}</span>
          </div>
        ))}
      </div>

      {/* Info */}
      <div style={{background:bg2,border:bdr,borderRadius:14,padding:'14px 16px',margin:'14px 0'}}>
        {[
          {l:'Exchange rate',v:`1 ${A} = ${flip?(1/RATE).toFixed(6):RATE.toFixed(2)} ${B}`,c:GB},
          {l:'Price impact',v:`${impact}%`,c:parseFloat(impact)>1?'var(--red)':GB},
          'divider',
          {l:'Protocol fee (0.30%)',v:'included',c:'var(--text)'},
          {l:'Min. received',v:`${minOut} ${B}`,c:'var(--text)'},
          'divider',
          {l:'SDX points earned',v:'+100 SDX',c:GB},
        ].map((r,i)=>r==='divider'?(
          <div key={i} style={{height:1,background:'var(--border)',margin:'6px 0'}}/>
        ):(
          <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'4px 0'}}>
            <span style={{fontSize:12,color:'var(--text-dim)'}}>{r.l}</span>
            <span style={{fontFamily:'var(--mono)',fontSize:12,fontWeight:700,color:r.c}}>{r.v}</span>
          </div>
        ))}
      </div>

      {/* Slippage */}
      <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:14}}>
        <span style={{fontSize:11,color:'var(--text-dim)'}}>Slippage:</span>
        {[0.1,0.5,1.0].map(v=>(
          <button key={v} onClick={()=>setSlip(v)} style={{padding:'4px 10px',borderRadius:6,fontSize:11,fontWeight:700,fontFamily:'var(--mono)',background:slip===v?'rgba(34,197,94,.12)':'transparent',border:slip===v?'1px solid rgba(34,197,94,.3)':bdr,color:slip===v?GB:'var(--text-dim)',cursor:'pointer',transition:'all .15s'}}>{v}%</button>
        ))}
      </div>

      <button
        onClick={()=>dex?.swap?.(A,B,from)}
        disabled={btnDisabled}
        style={{width:'100%',padding:16,borderRadius:20,border:'none',cursor:btnDisabled?'not-allowed':'pointer',background:'linear-gradient(135deg,var(--green) 0%,var(--green-dim) 100%)',color:'#021a0c',fontSize:15,fontWeight:800,letterSpacing:'.06em',fontFamily:'var(--font)',position:'relative',overflow:'hidden',transition:'all .18s',opacity:btnDisabled?.5:1}}
        onMouseEnter={e=>{if(!btnDisabled){e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 0 36px rgba(34,197,94,.28)'}}}
        onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=''}}
      >
        <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(255,255,255,.14),transparent)',pointerEvents:'none'}}/>
        {btnText}
      </button>
    </div>
  )
}
