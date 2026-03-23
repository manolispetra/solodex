/**
 * useWallet — MetaMask + WalletConnect v2
 * Replace WC_PROJECT_ID with your own from cloud.walletconnect.com (free)
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { ethers } from 'ethers'

const WC_PROJECT_ID = 'YOUR_PROJECT_ID' // ← replace at cloud.walletconnect.com

const BSC_TESTNET = {
  chainId: '0x61', chainName: 'BNB Smart Chain Testnet',
  nativeCurrency: { name: 'BNB', symbol: 'tBNB', decimals: 18 },
  rpcUrls: ['https://data-seed-prebsc-1-s1.bnbchain.org:8545'],
  blockExplorerUrls: ['https://testnet.bscscan.com'],
}
const BSC_MAINNET = {
  chainId: '0x38', chainName: 'BNB Smart Chain',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  rpcUrls: ['https://bsc-dataseed1.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com'],
}

let _wc = null

async function getWC() {
  if (_wc) return _wc
  const { EthereumProvider } = await import('@walletconnect/ethereum-provider')
  _wc = await EthereumProvider.init({
    projectId: WC_PROJECT_ID,
    chains: [97],
    optionalChains: [56, 1],
    showQrModal: true,
    qrModalOptions: {
      themeMode: 'dark',
      themeVariables: {
        '--wcm-background-color': '#090f0b',
        '--wcm-accent-color': '#22c55e',
        '--wcm-accent-fill-color': '#000',
        '--wcm-z-index': '9999',
      },
    },
    metadata: {
      name: 'SOLODEX',
      description: 'Incentivised DEX Testnet — BNB Smart Chain',
      url: typeof window !== 'undefined' ? window.location.origin : 'https://solodex.io',
      icons: ['https://solodex.io/favicon.svg'],
    },
  })
  return _wc
}

export function useWallet() {
  const [account,   setAccount]   = useState(null)
  const [provider,  setProvider]  = useState(null)
  const [signer,    setSigner]    = useState(null)
  const [chainId,   setChainId]   = useState(null)
  const [connecting,setConnecting]= useState(false)
  const [connType,  setConnType]  = useState(null)
  const [error,     setError]     = useState(null)
  const wcRef = useRef(null)

  const isCorrectNetwork = chainId === 97

  const setup = useCallback(async (raw, type) => {
    try {
      const p   = new ethers.BrowserProvider(raw)
      const s   = await p.getSigner()
      const a   = await s.getAddress()
      const net = await p.getNetwork()
      setProvider(p); setSigner(s); setAccount(a)
      setChainId(Number(net.chainId)); setConnType(type); setError(null)
    } catch (e) { setError(e.message) }
  }, [])

  // Auto-reconnect MetaMask
  useEffect(() => {
    if (!window.ethereum) return
    window.ethereum.request({ method: 'eth_accounts' })
      .then(a => { if (a.length) setup(window.ethereum, 'metamask') })
      .catch(() => {})
  }, [setup])

  useEffect(() => {
    if (!window.ethereum) return
    const onAcc = a => {
      if (!a.length) { setAccount(null); setSigner(null); setConnType(null) }
      else setup(window.ethereum, 'metamask')
    }
    const onChain = c => setChainId(parseInt(c, 16))
    window.ethereum.on('accountsChanged', onAcc)
    window.ethereum.on('chainChanged', onChain)
    return () => {
      window.ethereum.removeListener('accountsChanged', onAcc)
      window.ethereum.removeListener('chainChanged', onChain)
    }
  }, [setup])

  const connectMetaMask = useCallback(async () => {
    if (!window.ethereum) { window.open('https://metamask.io/download/', '_blank'); return }
    setConnecting(true); setError(null)
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      await setup(window.ethereum, 'metamask')
    } catch (e) { if (e.code !== 4001) setError(e.message) }
    setConnecting(false)
  }, [setup])

  const connectWalletConnect = useCallback(async () => {
    setConnecting(true); setError(null)
    try {
      const wc = await getWC()
      wcRef.current = wc
      if (wc.session) { try { await wc.disconnect() } catch {} }
      await wc.connect()
      await setup(wc, 'walletconnect')
      wc.on('disconnect', () => {
        setAccount(null); setSigner(null); setProvider(null); setConnType(null)
        _wc = null; wcRef.current = null
      })
      wc.on('accountsChanged', () => setup(wc, 'walletconnect'))
      wc.on('chainChanged', c => setChainId(Number(c)))
    } catch (e) {
      const m = e?.message || ''
      if (!m.includes('User rejected') && !m.includes('closed')) setError(m)
      _wc = null
    }
    setConnecting(false)
  }, [setup])

  const disconnect = useCallback(async () => {
    if (connType === 'walletconnect' && wcRef.current) {
      try { await wcRef.current.disconnect() } catch {}
      _wc = null; wcRef.current = null
    }
    setAccount(null); setSigner(null); setProvider(null); setChainId(null); setConnType(null)
  }, [connType])

  const switchChain = useCallback(async params => {
    const raw = connType === 'walletconnect' ? wcRef.current : window.ethereum
    if (!raw) return
    try {
      await raw.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: params.chainId }] })
    } catch (e) {
      if (e.code === 4902) await raw.request({ method: 'wallet_addEthereumChain', params: [params] })
    }
  }, [connType])

  return {
    account, provider, signer, chainId,
    connecting, connType, error, isCorrectNetwork,
    connectMetaMask, connectWalletConnect, disconnect,
    switchToTestnet: () => switchChain(BSC_TESTNET),
    switchToMainnet: () => switchChain(BSC_MAINNET),
  }
}
