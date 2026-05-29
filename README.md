# OPNfi — Real World Assets on OPN Chain

> Tokenize and trade fractional ownership of real-world properties, fully on-chain via smart contracts on the OPN Testnet.

![OPNfi](https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&q=80)

---

## Overview

OPNfi is a decentralized Real World Asset (RWA) platform built on the [IOPn](https://iopn.tech) blockchain. It allows users to buy fractional shares of real estate properties — from Jakarta residences to Dubai skyscrapers — with full on-chain transparency and verifiability.

Each property is tokenized as an ERC-1155 multi-token on the OPN Testnet. Ownership is recorded directly on the blockchain and verifiable via the block explorer.

---

## Features

- 🏠 **Fractional Property Ownership** — Buy shares of real estate starting from 0.001 OPN
- 🔗 **Fully On-Chain** — All transactions recorded on OPN Testnet smart contract
- 📊 **Live Portfolio** — Track your shares and ownership percentage in real-time
- 🗺️ **Location Map** — Google Maps integration for each property
- 📜 **Recent Transactions** — Live transaction feed from the block explorer
- 👥 **Top Holders** — See the largest shareholders per property
- 🛠️ **Admin Panel** — Owner can list new properties directly on-chain
- 💀 **Loading Skeleton** — Smooth UX while fetching blockchain data

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite |
| Styling | CSS Variables (dark theme) |
| Blockchain | ethers.js v6 |
| Smart Contract | ERC-1155 (Solidity) |
| Network | OPN Testnet (Chain ID: 984) |
| Images | Pexels API |
| Maps | Google Maps Embed API |
| Explorer | [testnet.iopn.tech](https://testnet.iopn.tech) |

---

## Smart Contract

| | |
|---|---|
| **Address** | `0x29c57355C070f27E54cF499114EeC8F3865f0321` |
| **Network** | OPN Testnet |
| **Chain ID** | 984 |
| **RPC** | `https://testnet-rpc.iopn.tech` |
| **Explorer** | `https://testnet.iopn.tech` |

### ABI Methods

```solidity
function nextPropertyId() view returns (uint256)
function getProperty(uint256) view returns (tuple(...))
function balanceOf(address, uint256) view returns (uint256)
function buyShares(uint256 id, uint256 amount) payable
function listProperty(string, string, uint256, uint256, uint256) returns (uint256)
function owner() view returns (address)
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- MetaMask browser extension

### Installation

```bash
git clone https://github.com/frankxeth/opnfi.git
cd opnfi
npm install
npm run dev
```

### Connect to OPN Testnet

Add the network to MetaMask manually or click **Connect Wallet** in the app — it will prompt you to add the network automatically.

| Field | Value |
|---|---|
| Network Name | OPN Testnet |
| RPC URL | `https://testnet-rpc.iopn.tech` |
| Chain ID | 984 |
| Symbol | OPN |
| Explorer | `https://testnet.iopn.tech` |

### Get Testnet OPN

Get free testnet tokens from the official faucet: [faucet.iopn.tech](https://faucet.iopn.tech/)

---

## Usage

### Buying Shares

1. Connect your MetaMask wallet
2. Browse properties in the **Market** tab
3. Click a property to view details
4. Enter the number of shares (minimum: 1 share)
5. Click **Buy Shares** and confirm the transaction in MetaMask

### Viewing Your Portfolio

Go to the **Portfolio** tab to see all properties you own, your share count, investment value, and ownership percentage.

### Listing a Property (Admin Only)

Go to the **Admin** tab (visible only to the contract owner):

| Field | Example |
|---|---|
| Property Name | Kos Eksklusif Malioboro |
| Location | Malioboro, Yogyakarta |
| Total Value (OPN) | 10 |
| Total Shares | 500 |
| Price per Share (OPN) | 0.02 |

> ⚠️ Make sure `Total Value = Total Shares × Price per Share` for consistency.

---

## Project Structure

```
src/
├── App.jsx        # Main application component
├── index.css      # Global styles & design system
└── main.jsx       # React entry point
```

---

## Properties Listed

| # | Property | Location | Price/Share |
|---|---|---|---|
| 0 | Menteng Residence | Jakarta Pusat | 0.1000 OPN |
| 5 | Gedung MPR/DPR RI | Senayan, Jakarta Pusat | 0.0500 OPN |
| 6 | Kos Eksklusif Malioboro | Malioboro, Yogyakarta | 0.0200 OPN |
| 7 | Villa Ubud Bali | Ubud, Bali | 0.0150 OPN |
| 8 | Burj Khalifa Residences | Downtown Dubai, UAE | 0.2000 OPN |
| 9 | Shibuya Sky Tower | Shibuya, Tokyo, Japan | 0.1500 OPN |

---

## Community

| Platform | Link |
|---|---|
| Twitter/X | [@l1luna_](https://x.com/l1luna_) — Builder |
| Telegram | [t.me/iopn_io](https://t.me/iopn_io) |
| Discord | [discord.gg/iopn](https://discord.gg/iopn) |

---

## License

MIT © 2026 OPNfi — Built on [IOPn](https://iopn.tech)

> One chain. One identity. Fully sovereign.