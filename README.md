# Blockchain Academic Records System - Degree Vault

A secure, decentralized platform for issuing, storing, and verifying academic credentials using blockchain technology.

## Features

### Core Functionality

- **Secure Record Issuance**: Authorized institutions can issue tamper-proof academic records
- **Blockchain Verification**: All records are stored on Ethereum blockchain for immutability
- **Student Access**: Students can view, share, and download their verified credentials
- **Public Verification**: Anyone can verify record authenticity using record hashes
- **MetaMask Integration**: Secure wallet-based authentication and transactions

### Security & Trust

- Cryptographic hash generation for document integrity
- Smart contract access control for authorized institutions
- Immutable blockchain storage prevents tampering
- Transparent verification process

## Technology Stack

- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui
- **Blockchain**: Ethereum + Solidity Smart Contracts
- **Web3**: Web3.js + MetaMask Integration
- **UI/UX**: Responsive design with Lucide React icons

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask browser extension
- Access to Ethereum testnet (Sepolia recommended)

### Installation

```bash
npm install
npm run dev
```

### MetaMask Setup

1. Install MetaMask extension
2. Create or import wallet
3. Switch to Sepolia Testnet
4. Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

## Usage Guide

### For Institutions (Admin Portal)

1. Connect authorized institution wallet
2. Upload academic documents (PDF, DOC, TXT)
3. Enter student wallet address
4. Add record metadata (course, degree info)
5. Issue record to blockchain

### For Students (Student Portal)

1. Connect student wallet
2. View all issued academic records
3. Share verification links with employers
4. Download record certificates

### For Verifiers (Verification Portal)

1. No wallet required - public access
2. Enter record hash from student
3. View verification results
4. Confirm authenticity and details

## Smart Contract

The `AcademicRecords.sol` contract provides:

- Record issuance by authorized institutions
- Immutable storage of record hashes
- Public verification functions
- Student record management
- Institution authorization control

### Key Functions

```solidity
function issueRecord(address student, string recordHash, string recordType, string metadata)
function verifyRecord(string recordHash) returns (bool, address, address, uint256)
function getStudentRecords(address student) returns (string[])
```

## Development

### Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── AdminPortal.jsx  # Institution interface
│   ├── StudentPortal.jsx # Student interface
│   ├── VerificationPortal.jsx # Public verification
│   └── WalletConnection.jsx # MetaMask integration
├── lib/
│   ├── web3.js         # Web3 service class
│   ├── contracts.js    # Contract ABI and config
│   └── utils.js        # Utility functions
└── App.jsx             # Main application
```

### Environment Configuration

Update `src/lib/contracts.js` with deployed contract address:

```javascript
export const CONTRACT_CONFIG = {
  networkId: 11155111, // Sepolia
  contractAddress: "0x...", // Your deployed contract
};
```

## Deployment

### Smart Contract Deployment

1. Deploy `AcademicRecords.sol` to Sepolia testnet
2. Authorize institution addresses using `addAuthorizedInstitution()`
3. Update frontend configuration with contract address

### Frontend Deployment

```bash
npm run build
npm run preview
```

## Network Support

### Sepolia Testnet (Recommended)

- Network ID: 11155111
- Free test ETH available
- Stable testnet environment

### Ethereum Mainnet

- Production deployment
- Real ETH required for transactions
- Higher security and permanence

## Contributing

This project demonstrates blockchain implementation for academic record management. Key areas for enhancement:

- IPFS integration for document storage
- Multi-signature institution approval
- Batch record processing
- Mobile app development
- Integration with existing student information systems

## License

MIT License - see LICENSE file for details

## Support

For technical issues or questions about blockchain implementation, please refer to:

- [Web3.js Documentation](https://web3js.readthedocs.io/)
- [MetaMask Developer Docs](https://docs.metamask.io/)
- [Ethereum Development Resources](https://ethereum.org/developers/)

---

Built with ❤️ for secure academic credential management+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
