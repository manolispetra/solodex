import React, { useState } from 'react'

const MOCK = [
  { rank:1, addr:'0x9f2a…b8e4', pts:84200, swaps:312, streak:14, tier:'Genesis',  tierC:'#00d4ff', pct:100 },
  { rank:2, addr:'0x3b8c…fa12', pts:71550, swaps:268, streak:9,  tier:'Pioneer',  tierC:'#22c55e', pct:85  },
  { rank:3, addr:'0xd4f1…20c7', pts:58900, swaps:214, streak:7,  tier:'Pioneer',  tierC:'#22c55e', pct:70  },
  { rank:4, addr:'0x4a9f…3b2c', pts:12450, swaps:48,  streak:7,  tier:'Builder',  tierC:'#aa66ff', pct:15, you:true },
  { rank:5, addr:'0x7c2e…a1f9', pts:9800,  swaps:34,  streak:3,  tier:'Builder',  tierC:'#aa66ff', pct:12  },
  { rank:6, addr:'0x1d8b…4e7a', pts:7620,  swaps:28,  streak:5,  tier:'Degen',    tierC:'#f59e0b', pct:9   },
  { rank:7, addr:'0xf3a2…9c14', pts:5490,  swaps:19,  streak:2,  tier:'Degen',    tierC:'#f59e0b', pct:7   },
  { rank:8, addr:'0x8e6d…2b5f', pts:3210,  swaps:12,  streak:1,  tier:'Tester',   tierC:'#ff4466', pct:4   },
]

const PODIUM_COLS = {1:{bg:'rgba(240,192,32,.12)',border:'rgba(240,192,32,.28)',avatar:'rgba(240,192,32,.15)',text:'#f0c020'},2:{bg:'rgba(192,192,192,.08)',border:'rgba(192,192,192,.2)',avatar:'rgba(192,192,192,.08)',text:'#bbbbbb'},3:{bg:'rgba(205,127,50,.08)',border:'rgba(205,127,50,.2)',avatar:'rgba(205,127,50,.1)',text:'#c87f32'}}

function PodiumCard({ entry, height }) {
  const c = PODIUM_COLS[entry.rank]
  return (
    <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:8,background:c.bg,border:`1px solid ${c.border}`,borderBottom:'none',borderRadius:'14px 14px 0 0',padding:'16px 8px 12px',paddingTop:entry.rank===1?16:10,cursor:'default',transition:'transform .15s',minHeight:height}}
      onMouseEnter={e=>e.currentTarget.style.transform='translateY(-3px)'}
      onMouseLeave={e=>e.currentTarget.style.transform=''}
    >
      {entry.rank===1&&<div style={{fontSize:18,lineHeight:1}}>👑</div>}
      <div style={{fontSize:20,fontWeight:800,color:c.text,opacity:.5,lineHeight:1}}>#{entry.rank}</div>
      <div style={{width:44,height:44,borderRadius:'50%',background:c.avatar,border:`2px solid ${c.text}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:13,fontWeight:700,fontFamily:'var(--mono)',color:c.text}}>
        {entry.addr.slice(2,4).toUpperCase()}
      </div>
      <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text)'}}>{entry.addr}</div>
      <div style={{fontFamily:'var(--mono)',fontSize:14,fontWeight:700,color:c.text}}>{entry.pts.toLocaleString()}</div>
      <div style={{fontSize:10,fontWeight:700,background:`${c.avatar}`,border:`1px solid ${c.border}`,borderRadius:4,padding:'2px 7px',color:c.text,fontFamily:'var(--mono)'}}>{entry.tier}</div>
    </div>
  )
}

export default function LeaderboardPanel({ dex, wallet }) {
  const [filter, setFilter] = useState('')
  const filtered = MOCK.filter(r=>!filter||r.addr.toLowerCase().includes(filter.toLowerCase()))
  const you = MOCK.find(r=>r.you)

  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:20,flexWrap:'wrap',gap:10}}>
        <div>
          <h2 style={{fontSize:22,fontWeight:800,color:'var(--white)'}}>Leaderboard</h2>
          <p style={{fontSize:13,color:'var(--text-dim)',marginTop:3}}>Live rankings · Updates on every on-chain event</p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:6,fontFamily:'var(--mono)',fontSize:11,color:'var(--text-dim)'}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:'var(--green)',animation:'blink 1.5s ease infinite'}}/>
          Live
        </div>
      </div>

      {/* Stats strip */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:10,marginBottom:20}}>
        {[['847','Participants'],['2.4M','Total SDX'],['12,480','Transactions']].map(([v,l])=>(
          <div key={l} style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:14,padding:'14px',textAlign:'center'}}>
            <div style={{fontFamily:'var(--mono)',fontSize:22,fontWeight:700,color:'var(--green-bright)',display:'block',marginBottom:3}}>{v}</div>
            <div style={{fontSize:10,color:'var(--text-dim)',letterSpacing:'.08em',textTransform:'uppercase'}}>{l}</div>
          </div>
        ))}
      </div>

      {/* Your position callout */}
      {you && (
        <div style={{background:'rgba(34,197,94,.07)',border:'1px solid rgba(34,197,94,.2)',borderRadius:16,padding:'12px 16px',marginBottom:18,display:'flex',alignItems:'center',gap:14,flexWrap:'wrap',gap:10}}>
          <div style={{width:38,height:38,borderRadius:'50%',background:'rgba(34,197,94,.12)',border:'1px solid rgba(34,197,94,.28)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,fontFamily:'var(--mono)',color:'var(--green-bright)',flexShrink:0}}>{wallet.account?.slice(2,4).toUpperCase()||'YU'}</div>
          <div style={{flex:1}}>
            <div style={{fontSize:12,fontWeight:700,color:'var(--white)'}}>Your ranking</div>
            <div style={{fontFamily:'var(--mono)',fontSize:11,color:'var(--text-dim)'}}>Rank #{you.rank} of {MOCK.length} · {you.pts.toLocaleString()} SDX</div>
          </div>
          <div style={{display:'flex',gap:10}}>
            {[['Streak',`🔥 ${you.streak}d`,'var(--amber)'],['Tier',you.tier,you.tierC]].map(([l,v,c])=>(
              <div key={l} style={{textAlign:'center'}}>
                <div style={{fontSize:10,color:'var(--text-mute)',marginBottom:3,letterSpacing:'.08em',textTransform:'uppercase'}}>{l}</div>
                <div style={{fontFamily:'var(--mono)',fontSize:13,fontWeight:700,color:c}}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Podium */}
      <div style={{display:'flex',alignItems:'flex-end',justifyContent:'center',gap:8,marginBottom:20,padding:'0 8px'}}>
        {[MOCK[1],MOCK[0],MOCK[2]].map((e,i)=><PodiumCard key={e.rank} entry={e} height={i===1?220:180}/>)}
      </div>

      {/* Search */}
      <div style={{display:'flex',alignItems:'center',gap:8,background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:100,padding:'8px 14px',marginBottom:12,transition:'border-color .15s'}}
        onFocusCapture={e=>e.currentTarget.style.borderColor='var(--border-md)'}
        onBlurCapture={e=>e.currentTarget.style.borderColor='var(--border)'}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="Search by address…"
          style={{background:'none',border:'none',outline:'none',fontFamily:'var(--mono)',fontSize:12,color:'var(--text)',flex:1}}/>
      </div>

      {/* List */}
      <div style={{background:'var(--bg2)',border:'1px solid var(--border)',borderRadius:20,overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'40px 1fr 100px 70px 80px',gap:10,padding:'10px 16px',borderBottom:'1px solid var(--border)',background:'rgba(5,8,7,.5)'}}>
          {['#','Wallet','SDX Points','Swaps','Streak'].map((h,i)=>(
            <div key={i} style={{fontSize:9,fontWeight:700,color:'var(--text-mute)',letterSpacing:'.12em',textTransform:'uppercase',textAlign:i>1?'right':'left'}}>{h}</div>
          ))}
        </div>
        {filtered.map((r,i)=>(
          <div key={r.rank} style={{display:'grid',gridTemplateColumns:'40px 1fr 100px 70px 80px',gap:10,padding:'13px 16px',borderBottom:i<filtered.length-1?'1px solid rgba(34,197,94,.04)':'none',alignItems:'center',background:r.you?'rgba(34,197,94,.05)':'transparent',borderLeft:r.you?'2px solid var(--green)':'none',transition:'background .15s'}}
            onMouseEnter={e=>!r.you&&(e.currentTarget.style.background='rgba(34,197,94,.03)')}
            onMouseLeave={e=>!r.you&&(e.currentTarget.style.background='transparent')}
          >
            <div style={{fontFamily:'var(--mono)',fontSize:13,fontWeight:700,color:r.rank<=3?['var(--gold)','#aaa','#c87f32'][r.rank-1]:'var(--text-dim)'}}>{r.rank}</div>
            <div style={{display:'flex',alignItems:'center',gap:10}}>
              <div style={{width:30,height:30,borderRadius:'50%',background:r.you?'rgba(34,197,94,.12)':'rgba(255,255,255,.04)',border:`1px solid ${r.you?'rgba(34,197,94,.28)':'var(--border)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:700,fontFamily:'var(--mono)',color:r.you?'var(--green-bright)':'var(--text-dim)',flexShrink:0}}>
                {r.addr.slice(2,4).toUpperCase()}
              </div>
              <div>
                <div style={{display:'flex',alignItems:'center',gap:6}}>
                  <span style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--text)'}}>{r.addr}</span>
                  {r.you&&<span style={{fontSize:9,fontWeight:700,color:'var(--green-bright)',background:'rgba(34,197,94,.12)',border:'1px solid rgba(34,197,94,.22)',borderRadius:4,padding:'1px 5px',fontFamily:'var(--mono)'}}>you</span>}
                </div>
                <div style={{fontSize:10,color:r.tierC,marginTop:2,fontFamily:'var(--mono)'}}>{r.tier}</div>
              </div>
            </div>
            <div style={{textAlign:'right'}}>
              <div style={{fontFamily:'var(--mono)',fontSize:13,fontWeight:700,color:'var(--green-bright)'}}>{r.pts.toLocaleString()}</div>
              <div style={{height:3,borderRadius:2,background:'var(--bg3)',overflow:'hidden',marginTop:4,width:60,marginLeft:'auto'}}>
                <div style={{height:'100%',borderRadius:2,background:'linear-gradient(90deg,var(--green),var(--accent-teal))',width:`${r.pct}%`}}/>
              </div>
            </div>
            <div style={{fontFamily:'var(--mono)',fontSize:12,color:'var(--text)',textAlign:'right'}}>{r.swaps}</div>
            <div style={{display:'flex',alignItems:'center',gap:4,justifyContent:'flex-end',fontFamily:'var(--mono)',fontSize:12,color:'var(--amber)'}}>🔥 {r.streak}d</div>
          </div>
        ))}
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:.5}50%{opacity:1}}`}</style>
    </div>
  )
}
