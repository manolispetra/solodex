import React, { useEffect, useRef, useState } from 'react'
import { NFT_COLLECTION } from '../utils/nftData'
import s from '../styles/NFTGallery.module.css'

function NFTCard({ nft, onClick }){
  const canvasRef = useRef()
  const [rendered, setRendered] = useState(false)

  useEffect(()=>{
    const c = canvasRef.current
    if(!c) return
    const ctx = c.getContext('2d')
    try{ nft.draw(ctx); setRendered(true) }catch(e){ console.error(e) }
  },[nft])

  return (
    <div className={s.card} onClick={()=>onClick(nft)}>
      <div className={s.canvasWrap}>
        <canvas ref={canvasRef} width={300} height={300} className={s.canvas}/>
        {!rendered&&<div className={s.placeholder}>Loading...</div>}
      </div>
      <div className={s.cardInfo}>
        <div className={s.cardTop}>
          <span className={s.cardId}>{nft.id}</span>
          <span className={s.cardRarity} style={{color:nft.rarityColor,background:nft.rarityColor+'15',borderColor:nft.rarityColor+'40'}}>{nft.rarity}</span>
        </div>
        <h3 className={s.cardName}>{nft.name}</h3>
        <p className={s.cardDesc}>{nft.description}</p>
        <div className={s.traits}>
          {nft.traits.map(t=><span key={t} className={s.trait}>{t}</span>)}
        </div>
      </div>
    </div>
  )
}

function Modal({ nft, onClose }){
  const canvasRef = useRef()
  useEffect(()=>{
    if(!nft||!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    try{ nft.draw(ctx) }catch{}
  },[nft])
  if(!nft) return null

  return (
    <div className={s.modalBg} onClick={onClose}>
      <div className={s.modal} onClick={e=>e.stopPropagation()}>
        <button className={s.modalClose} onClick={onClose}>✕</button>
        <canvas ref={canvasRef} width={300} height={300} className={s.modalCanvas}/>
        <div className={s.modalInfo}>
          <div className={s.modalTop}>
            <span className={s.cardId}>{nft.id}</span>
            <span className={s.cardRarity} style={{color:nft.rarityColor,background:nft.rarityColor+'15',borderColor:nft.rarityColor+'40'}}>{nft.rarity}</span>
          </div>
          <h2 className={s.modalName}>{nft.name}</h2>
          <p className={s.modalDesc}>{nft.description}</p>
          <div className={s.traits} style={{marginBottom:14}}>
            {nft.traits.map(t=><span key={t} className={s.trait}>{t}</span>)}
          </div>
          <div className={s.modalNote}>
            <span>◆</span>
            This NFT will be deployed on BNB Smart Chain mainnet at launch.
            Win it via the DEGEN SLOTS or claim through the airdrop.
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NFTGallery(){
  const [selected, setSelected] = useState(null)
  const rarityOrder = {Mythic:0,Legendary:1,Epic:2,Rare:3,Uncommon:4,Common:5}
  const sorted = [...NFT_COLLECTION].sort((a,b)=>(rarityOrder[a.rarity]??9)-(rarityOrder[b.rarity]??9))
  const counts = NFT_COLLECTION.reduce((acc,n)=>{acc[n.rarity]=(acc[n.rarity]||0)+1;return acc},{})

  return (
    <div className={s.wrap}>
      <div className={s.header}>
        <div>
          <h2 className={s.title}>Degen Entities</h2>
          <p className={s.subtitle}>Genesis Collection · 10 Unique Survivors · BNB Smart Chain</p>
        </div>
        <div className={s.rarityLegend}>
          {Object.entries(counts).map(([r,c])=>(
            <div key={r} className={s.rarityItem}>
              <span className={s.rarityDot} style={{background:NFT_COLLECTION.find(n=>n.rarity===r)?.rarityColor||'#888'}}/>
              <span className={s.rarityName}>{r}</span>
              <span className={s.rarityCount}>×{c}</span>
            </div>
          ))}
        </div>
      </div>

      <div className={s.grid}>
        {sorted.map(nft=>(
          <NFTCard key={nft.id} nft={nft} onClick={setSelected}/>
        ))}
      </div>

      <div className={s.footer}>
        <p>Click any NFT to view details · Win NFTs via the DEGEN SLOTS tab (2% chance per spin)</p>
        <p>Winners receive an IOU token redeemable at mainnet launch</p>
      </div>

      {selected&&<Modal nft={selected} onClose={()=>setSelected(null)}/>}
    </div>
  )
}
