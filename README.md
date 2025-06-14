# SecureChat: Privacy-Focused Secure Chat Web Application

## Overview
A decentralized, privacy-centric web-based chat application using homomorphic encryption for searchable, end-to-end encrypted messaging. Features zero-knowledge proof authentication, self-destructing messages, encrypted file sharing, and decentralized storage on IPFS and Polygon.

## Tech Stack
- **Frontend:** Svelte, TailwindCSS, D3.js, Web Crypto API
- **Backend:** Node.js/Express, SQLite, Socket.IO
- **Advanced:** Homomorphic encryption (SEAL/OpenFHE), ZKP (zkSync/circom), Rust (Actix-web)
- **Storage:** IPFS (Pinata), Polygon, MongoDB

## Getting Started
### Frontend
```sh
cd frontend
npm install
npm run dev
```

### Backend
```sh
cd backend
npm install
npm run dev
```

## Features
- End-to-end encrypted messaging (homomorphic encryption)
- Real-time chat (Socket.IO)
- Zero-knowledge proof authentication
- Encrypted file sharing (IPFS)
- Self-destructing messages
- Offline message queuing
- Analytics dashboard (D3.js)

## Roadmap
1. MVP: Real-time chat, basic encryption
2. Homomorphic encryption integration
3. ZKP authentication and blockchain storage
4. Advanced features and analytics

---

For more details, see individual directories and code comments.