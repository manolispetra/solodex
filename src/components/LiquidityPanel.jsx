import React, { useState } from 'react'

const POOLS = [
  { a:'tWBNB', b:'tUSDT', sa:'W', sb:'U', ca:'245,158,11', cb:'34,197,94', apr:'24.6%', tvl:'$142.8K', vol:'$28.4K', fee:'0.30%', split:[52,48], hot:true },
  { a:'tUSDT', b:'tBUSD', sa:'U', sb:'B', ca:'34,197,94',  cb:'167,139,250', apr:'8.2%', tvl:'$89.3K',  vol:'$15.2K', fee:'0.05%', split:[50,50] },
  { a:'tWBNB', b:'tBUSD', sa:'W', sb:'B', ca:'245,158,11', cb:'167,139,250', apr:'16.8%', tvl:'$61.5K', vol:'$9.9K',  fee:'0.30%', split:[55,45] },
]

export default function LiquidityPanel({ wallet, dex }) {
  const [sel, setSel] = useState(null)
  const [amtA, setAmtA] = useState('')
  const [amtB, setAmtB] = useState('')

  const handleA = v => { setAmtA(v); setAmtB(v ? (parseFloat(v)*665.21).toFixed(2) : '') }
  const handleB = v => { setAmtB(v); setAmtA(v ? (parseFloat(v)/665.21).toFixed(6) : '') }
  const pool = sel!==null ? POOLS[sel] : null

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:10}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:800,color:'var(--white)'}}>Liquidity Pools</h2>
          <p style={{fontSize:13,color:'var(--text-dim)',marginTop:3}}>Provide liquidity, earn trading fees · +500 SDX on first deposit</p>
        </div>
        <input placeholder="Search pools…" style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:100,padding:'8px 16px',fontSize:12,fontFamily:'var(--mono)',color:'var(--text)',outline:'none',width:200,transition:'border-color .15s'}}
          onFocus={e=>e.target.style.borderColor='var(--border-md)'} onBlur={e=>e.target.style.borderColor='var(--border)'}/>
      </div>

      {/* Table */}
      <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:20,overflow:'hidden',marginBottom:18}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 80px 90px 90px 1fr 90px',gap:10,padding:'10px 16px',borderBottom:'1px solid var(--border)',background:'rgba(5,8,7,.5)'}}>
          {['Pool','APR','TVL','24h Vol','Composition',''].map((h,i)=>(
            <div key={i} style={{fontSize:9,fontWeight:700,color:'var(--text-mute)',letterSpacing:'.12em',textTransform:'uppercase',textAlign:i>0?'right':'left'}}>{h}</div>
          ))}
        </div>
        {POOLS.map((p,i)=>(
          <div key={i} onClick={()=>setSel(sel===i?null:i)} style={{display:'grid',gridTemplateColumns:'2fr 80px 90px 90px 1fr 90px',gap:10,padding:'14px 16px',borderBottom:i<POOLS.length-1?'1px solid rgba(34,197,94,.05)':'none',alignItems:'center',cursor:'pointer',background:sel===i?'rgba(34,197,94,.04)':'transparent',transition:'background .15s'}}>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{display:'flex'}}>
                {[p.sa,p.sb].map((s,j)=><div key={j} style={{width:28,height:28,borderRadius:'50%',border:'1.5px solid var(--bg1)',background:`rgba(${j===0?p.ca:p.cb},.12)`,color:`rgb(${j===0?p.ca:p.cb})`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,marginLeft:j>0?-8:0}}>{s}</div>)}
              </div>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:'var(--white)',display:'flex',alignItems:'center',gap:6}}>
                  {p.a} / {p.b}
                  {p.hot&&<span style={{fontSize:9,fontWeight:700,background:'rgba(245,158,11,.12)',border:'1px solid rgba(245,158,11,.22)',borderRadius:100,padding:'1px 6px',color:'var(--amber)',fontFamily:'var(--mono)'}}>HOT</span>}
                </div>
                <div style={{fontSize:10,color:'var(--text-dim)',marginTop:2,fontFamily:'var(--mono)'}}>{p.fee} fee</div>
              </div>
            </div>
            <div style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:700,color:'var(--green-bright)',textAlign:'right'}}>{p.apr}</div>
            <div style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--text)',textAlign:'right'}}>{p.tvl}</div>
            <div style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--text)',textAlign:'right'}}>{p.vol}</div>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:9,fontFamily:'var(--mono)',color:'var(--text-dim)',marginBottom:4}}>{p.split[0]}% / {p.split[1]}%</div>
              <div style={{height:4,borderRadius:2,display:'flex',overflow:'hidden',width:80,marginLeft:'auto'}}>
                <div style={{background:'var(--green)',width:`${p.split[0]}%`}}/>
                <div style={{background:'var(--accent-teal)',width:`${p.split[1]}%`}}/>
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:5,padding:'6px 13px',borderRadius:8,background:'rgba(34,197,94,.1)',border:'1px solid rgba(34,197,94,.22)',color:'var(--green-bright)',fontSize:11,fontWeight:700,fontFamily:'var(--font)',cursor:'pointer'}}>
                + Add
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Deposit form */}
      {pool && (
        <div style={{background:'var(--bg2)',border:'1px solid rgba(34,197,94,.18)',borderRadius:20,padding:20}}>
          <div style={{fontSize:16,fontWeight:700,color:'var(--white)',marginBottom:16}}>Deposit — {pool.a} / {pool.b}</div>
          {[[pool.a,pool.sa,pool.ca,amtA,handleA,'10.00'],[pool.b,pool.sb,pool.cb,amtB,handleB,'120.00']].map(([tok,sym,col,amt,fn,bal],i)=>(
            <div key={i}>
              <div style={{background:'var(--bg3)',border:'1px solid var(--border)',borderRadius:14,padding:'14px 16px',marginBottom:i===0?10:14,transition:'border-color .15s'}}
                onFocus={e=>e.currentTarget.style.borderColor='var(--border-md)',{}}
                onBlur={e=>e.currentTarget.style.borderColor='var(--border)',{}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
                  <span style={{fontSize:10,fontWeight:700,color:'var(--text-mute)',letterSpacing:'.1em',textTransform:'uppercase'}}>{tok}</span>
                  <span style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text-dim)'}}>Balance: {bal}</span>
                </div>
                <div style={{display:'flex',alignItems:'center',gap:10}}>
                  <input value={amt} onChange={e=>fn(e.target.value)} placeholder="0.0"
                    style={{flex:1,background:'none',border:'none',outline:'none',fontFamily:'var(--mono)',fontSize:22,fontWeight:700,color:'var(--white)'}}/>
                  <div style={{width:32,height:32,borderRadius:'50%',background:`rgba(${col},.12)`,border:`1.5px solid rgba(${col},.25)`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,color:`rgb(${col})`}}>{sym}</div>
                </div>
              </div>
              {i===0&&<div style={{textAlign:'center',color:'var(--text-dim)',fontSize:18,margin:'4px 0'}}>+</div>}
            </div>
          ))}
          <div style={{background:'rgba(34,197,94,.07)',border:'1px solid rgba(34,197,94,.15)',borderRadius:12,padding:'10px 14px',marginBottom:14,display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
            {[['APR',pool.apr,'var(--green-bright)'],['TVL',pool.tvl,'var(--text)'],['Your share',amtA?((parseFloat(amtA)/142820*100).toFixed(4)+'%'):'—','var(--text)']].map(([l,v,c])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:10,color:'var(--text-dim)',marginBottom:3,textTransform:'uppercase',letterSpacing:'.08em'}}>{l}</div>
                <div style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:700,color:c}}>{v}</div>
              </div>
            ))}
          </div>
          <button
            disabled={!amtA||!wallet.account}
            style={{width:'100%',padding:14,borderRadius:16,border:'none',cursor:(!amtA||!wallet.account)?'not-allowed':'pointer',background:'linear-gradient(135deg,var(--green),var(--green-dim))',color:'#021a0c',fontSize:14,fontWeight:800,letterSpacing:'.06em',fontFamily:'var(--font)',position:'relative',overflow:'hidden',opacity:(!amtA||!wallet.account)?0.5:1,transition:'all .18s'}}
            onMouseEnter={e=>{if(!e.currentTarget.disabled){e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 0 32px rgba(34,197,94,.25)'}}}
            onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow=''}}
          >
            <div style={{position:'absolute',inset:0,background:'linear-gradient(135deg,rgba(255,255,255,.14),transparent)',pointerEvents:'none'}}/>
            {!wallet.account?'Connect Wallet':!amtA?'Enter Amounts':'Add Liquidity +500 SDX'}
          </button>
        </div>
      )}
    </div>
  )
}
