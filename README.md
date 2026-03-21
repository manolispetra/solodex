# SOLODEX Frontend v5

## Setup

```bash
npm install
npm run dev
```

## WalletConnect Setup (REQUIRED)

1. Go to https://cloud.walletconnect.com — create free account
2. Create new project → copy Project ID
3. Open `src/hooks/useWallet.js`
4. Replace `YOUR_WALLETCONNECT_PROJECT_ID` with your project ID

Without a valid projectId, WalletConnect QR modal will not open.
MetaMask works independently without any setup.

## Deploy contracts

```bash
cd ../
npm install
cp .env.example .env   # add PRIVATE_KEY
npx hardhat run scripts/deploy-identity.js --network bnbMainnet
```
