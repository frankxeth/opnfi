<div align="center">
  <img src="/public/logo.svg" alt="OPNfi Logo" width="545" />
  
  # OPNfi — Real World Assets on OPN Chain

  ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
  ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
  ![Ethers.js](https://img.shields.io/badge/Ethers.js-3C3C3D?style=for-the-badge&logo=ethereum&logoColor=white)
  ![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
  ![OPN Chain](https://img.shields.io/badge/OPN_Chain-4F6EF7?style=for-the-badge)

  Tokenize and trade fractional ownership of real-world properties,
  fully on-chain via smart contracts on the OPN Testnet.

  [![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-00D4FF?style=for-the-badge)](https://op-nfi.vercel.app/)
  [![Contract](https://img.shields.io/badge/📜_Smart_Contract-4F6EF7?style=for-the-badge)](https://testnet.iopn.tech/address/0x29c57355C070f27E54cF499114EeC8F3865f0321)
  [![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github)](https://github.com/frankxeth/OPNfi)

</div>

---

## 📋 Table of Contents

1. 🤖 [Introduction](#-introduction)
2. ⚙️ [Tech Stack](#️-tech-stack)
3. 🔋 [Features](#-features)
4. 🤸 [Quick Start](#-quick-start)
5. 🔗 [Smart Contract](#-smart-contract)
6. 🌐 [IOPn Ecosystem](#-iopn-ecosystem)
7. 🏘️ [Properties Listed](#️-properties-listed)

---

## 🤖 Introduction

**OPNfi** is a decentralized Real World Asset (RWA) platform built on [OPN Chain](https://chain.iopn.io) — the sovereign Layer 1 blockchain powering the Internet of People (IOPn) ecosystem.

It allows users to buy fractional shares of real estate properties — from Jakarta residences to Dubai skyscrapers and Tokyo towers — with full on-chain transparency. Each property is tokenized as an ERC-1155 multi-token on the OPN Testnet. Ownership is recorded directly on the blockchain and verifiable via the block explorer.

Built as part of the **IOPn Season 1 · DeFi & Open Finance** hackathon.

> If you're getting started or run into issues, join the [IOPn Discord](https://discord.gg/iopn) or [Telegram](https://t.me/iopn_io) community.

---

## ⚙️ Tech Stack

| Technology | Purpose |
|---|---|
| **React + Vite** | Frontend framework & build tool |
| **ethers.js v6** | Blockchain interaction |
| **Solidity (ERC-1155)** | Smart contract standard |
| **OPN Chain** | Layer 1 blockchain (Chain ID: 984) |
| **Pexels API** | Dynamic property images |
| **Google Maps Embed** | Property location maps |
| **CSS Variables** | Dark theme design system |

---

## 🔋 Features

👉 **Fractional Property Ownership** — Buy shares of real estate starting from 0.001 OPN

👉 **Fully On-Chain** — All transactions recorded on OPN Testnet smart contract

👉 **Live Portfolio** — Track your shares and ownership percentage in real-time

👉 **Wallet Integration** — Connect MetaMask, Rabby, OKX, or any EVM wallet

👉 **Wallet Dropdown** — Copy address, view on explorer, disconnect in one click

👉 **Property Detail Page** — Full info with location map, top holders, recent transactions

👉 **Loading Skeleton** — Smooth shimmer animation while fetching blockchain data

👉 **Faucet Page** — Get testnet OPN tokens with step-by-step guide

👉 **About Page** — Full IOPn ecosystem overview with links to all official projects

👉 **Admin Panel** — Owner can list new properties directly on-chain

👉 **Animated Logo** — Hexagon logo inspired by IOPn with pulse animation

👉 **Typing Effect** — Animated tagline in footer

---

## 🤸 Quick Start

**Prerequisites**

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/) v18+
- [MetaMask](https://metamask.io/) or any EVM wallet

**Clone & Install**

```bash
git clone https://github.com/frankxeth/OPNfi.git
cd OPNfi
npm install
npm run dev
```

Open http://localhost:5173

**Connect to OPN Testnet**

| Field | Value |
|---|---|
| Network Name | OPN Testnet |
| RPC URL | `https://testnet-rpc.iopn.tech` |
| Chain ID | `984` |
| Symbol | `OPN` |
| Explorer | `https://testnet.iopn.tech` |

**Get Testnet OPN**

Visit: **[faucet.iopn.tech](https://faucet.iopn.tech/)**

---

## 🔗 Smart Contract

| | |
|---|---|
| **Address** | `0x29c57355C070f27E54cF499114EeC8F3865f0321` |
| **Standard** | ERC-1155 |
| **Network** | OPN Testnet · Chain ID 984 |
| **Explorer** | [View ↗](https://testnet.iopn.tech/address/0x29c57355C070f27E54cF499114EeC8F3865f0321) |

---

## 🌐 IOPn Ecosystem

| Project | Description | Link |
|---|---|---|
| ⛓️ OPN Chain | Layer 1 blockchain (Cosmos SDK + EVM) | [chain.iopn.io](https://chain.iopn.io) |
| 🔄 OPN Swap | Decentralized exchange on IOPn | [swap.iopn.tech](https://swap.iopn.tech) |
| 🎓 IOPn Learn | Learn & earn OPN rewards | [learn.iopn.tech](https://learn.iopn.tech) |
| 💧 Faucet | Get testnet OPN tokens | [faucet.iopn.tech](https://faucet.iopn.tech) |
| 🏗️ Builders | Hackathon & builder program | [builders.iopn.tech](https://builders.iopn.tech) |
| 🔍 Explorer | Block explorer | [testnet.iopn.tech](https://testnet.iopn.tech) |

---

## 🏘️ Properties Listed

| # | Property | Location | Price/Share |
|---|---|---|---|
| 0 | Menteng Residence | Jakarta Pusat | 0.1000 OPN |
| 5 | Gedung MPR/DPR RI | Senayan, Jakarta | 0.0500 OPN |
| 6 | Kos Eksklusif Malioboro | Yogyakarta | 0.0200 OPN |
| 7 | Villa Ubud Bali | Ubud, Bali | 0.0150 OPN |
| 8 | Burj Khalifa Residences | Dubai, UAE | 0.2000 OPN |
| 9 | Shibuya Sky Tower | Tokyo, Japan | 0.1500 OPN |

---

<div align="center">

Built with ❤️ by [@frankxeth](https://github.com/frankxeth) on [IOPn](https://iopn.io)

*One chain. One identity. Fully sovereign.*

[![Built on IOPn](https://img.shields.io/badge/Built_on-IOPn-4F6EF7?style=for-the-badge)](https://iopn.io)
[![Live on Vercel](https://img.shields.io/badge/Live_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://op-nfi.vercel.app/)

</div>
