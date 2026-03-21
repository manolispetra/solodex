/**
 * useWallet v5
 * - MetaMask: direct injection
 * - WalletConnect v2: uses @walletconnect/ethereum-provider with QR modal
 *   IMPORTANT: Replace projectId with your own from cloud.walletconnect.com (free)
 */
import { useState, useEffect, useCallback, useRef } from 'react'
import { ethers } from 'ethers'

const BSC_TESTNET = {
  chainId: '0x61',
  chainName: 'BNB Smart Chain Testnet',
  nativeCurrency: { name: 'BNB', symbol: 'tBNB', decimals: 18 },
  rpcUrls: ['https://data-seed-prebsc-1-s1.bnbchain.org:8545'],
  blockExplorerUrls: ['https://testnet.bscscan.com'],
}
const BSC_MAINNET = {
  chainId: '0x38',
  chainName: 'BNB Smart Chain',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  rpcUrls: ['https://bsc-dataseed1.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com'],
}

// !! REPLACE with your projectId from cloud.walletconnect.com !!
const WC_PROJECT_ID = 'c063cc22e1fe5c536def4243efd5d90b'

let _wcProvider = null
let _wcInitializing = false

async function initWC() {
  if (_wcProvider) return _wcProvider
  if (_wcInitializing) {
    // Wait for ongoing init
    await new Promise(r => { const t = setInterval(() => { if(!_wcInitializing){clearInterval(t);r()}},100) })
    return _wcProvider
  }
  _wcInitializing = true
  try {
    const { EthereumProvider } = await import('@walletconnect/ethereum-provider')
    _wcProvider = await EthereumProvider.init({
      projectId: WC_PROJECT_ID,
      chains: [97],
      optionalChains: [56, 1, 137],
      showQrModal: true,
      qrModalOptions: {
        themeMode: 'dark',
        themeVariables: {
          '--wcm-background-color': '#090f0b',
          '--wcm-accent-color': '#22c55e',
          '--wcm-accent-fill-color': '#000',
          '--wcm-font-family': 'system-ui, sans-serif',
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
  } finally {
    _wcInitializing = false
  }
  return _wcProvider
}

export function useWallet() {
  const [account,        setAccount]        = useState(null)
  const [provider,       setProvider]       = useState(null)
  const [signer,         setSigner]         = useState(null)
  const [chainId,        setChainId]        = useState(null)
  const [connecting,     setConnecting]     = useState(false)
  const [connectionType, setConnectionType] = useState(null)
  const [error,          setError]          = useState(null)
  const [balance,        setBalance]        = useState(null)
  const wcRef = useRef(null)

  const isCorrectNetwork = chainId === 97

  const _setup = useCallback(async (rawProvider, type) => {
    try {
      const p = new ethers.BrowserProvider(rawProvider)
      const s = await p.getSigner()
      const addr = await s.getAddress()
      const net  = await p.getNetwork()
      const cid  = Number(net.chainId)
      const bal  = await p.getBalance(addr)
      setProvider(p); setSigner(s); setAccount(addr)
      setChainId(cid); setConnectionType(type)
      setBalance(ethers.formatEther(bal)); setError(null)
      return { provider: p, signer: s, account: addr }
    } catch(e) { setError(e.message); return null }
  }, [])

  // Auto-reconnect MetaMask on load
  useEffect(() => {
    if (!window.ethereum) return
    window.ethereum.request({ method: 'eth_accounts' })
      .then(accs => { if (accs.length) _setup(window.ethereum, 'metamask') })
      .catch(() => {})
  }, [_setup])

  // MetaMask event listeners
  useEffect(() => {
    if (!window.ethereum) return
    const onAccounts = accs => {
      if (!accs.length) { setAccount(null); setSigner(null); setProvider(null); setConnectionType(null) }
      else _setup(window.ethereum, 'metamask')
    }
    const onChain = cid => setChainId(parseInt(cid, 16))
    window.ethereum.on('accountsChanged', onAccounts)
    window.ethereum.on('chainChanged', onChain)
    return () => {
      window.ethereum.removeListener('accountsChanged', onAccounts)
      window.ethereum.removeListener('chainChanged', onChain)
    }
  }, [_setup])

  const connectMetaMask = useCallback(async () => {
    if (!window.ethereum) {
      window.open('https://metamask.io/download/', '_blank')
      return
    }
    setConnecting(true); setError(null)
    try {
      await window.ethereum.request({ method: 'eth_requestAccounts' })
      await _setup(window.ethereum, 'metamask')
    } catch(e) {
      if (e.code !== 4001) setError(e.message)
    }
    setConnecting(false)
  }, [_setup])

  const connectWalletConnect = useCallback(async () => {
    setConnecting(true); setError(null)
    try {
      const wc = await initWC()
      wcRef.current = wc

      // Disconnect stale session if exists
      if (wc.session) {
        try { await wc.disconnect() } catch {}
      }

      // This opens the WC QR modal automatically
      await wc.connect()
      await _setup(wc, 'walletconnect')

      // Attach listeners
      wc.on('disconnect', () => {
        setAccount(null); setSigner(null); setProvider(null)
        setChainId(null); setConnectionType(null)
        _wcProvider = null; wcRef.current = null
      })
      wc.on('accountsChanged', () => _setup(wc, 'walletconnect'))
      wc.on('chainChanged', cid => setChainId(Number(cid)))

    } catch(e) {
      const msg = e?.message || ''
      if (!msg.includes('User rejected') && !msg.includes('closed') && !msg.includes('modal')) {
        setError(msg)
      }
      // Reset provider on failure so next attempt starts fresh
      _wcProvider = null
    }
    setConnecting(false)
  }, [_setup])

  const disconnect = useCallback(async () => {
    if (connectionType === 'walletconnect' && wcRef.current) {
      try { await wcRef.current.disconnect() } catch {}
      _wcProvider = null; wcRef.current = null
    }
    setAccount(null); setSigner(null); setProvider(null)
    setChainId(null); setConnectionType(null); setBalance(null)
  }, [connectionType])

  const _switchChain = useCallback(async (params) => {
    const raw = connectionType === 'walletconnect' ? wcRef.current : window.ethereum
    if (!raw) return
    try {
      await raw.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: params.chainId }] })
    } catch(e) {
      if (e.code === 4902) {
        await raw.request({ method: 'wallet_addEthereumChain', params: [params] })
      }
    }
  }, [connectionType])

  const switchToTestnet = useCallback(() => _switchChain(BSC_TESTNET), [_switchChain])
  const switchToMainnet = useCallback(() => _switchChain(BSC_MAINNET), [_switchChain])

  return {
    account, provider, signer, chainId,
    connecting, connectionType, error, balance,
    isCorrectNetwork,
    connectMetaMask, connectWalletConnect,
    disconnect, switchToTestnet, switchToMainnet,
  }
}
