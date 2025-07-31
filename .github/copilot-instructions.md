<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Copilot Instructions for Degree Vault

## Project Overview

This is a blockchain-based academic records management system built with React, Web3.js, and Ethereum smart contracts. The application allows institutions to issue tamper-proof academic credentials and enables public verification.

## Technology Stack

- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui components
- **Blockchain**: Ethereum + Solidity smart contracts
- **Web3**: Web3.js library for blockchain interaction
- **Wallet**: MetaMask integration for authentication
- **Styling**: Tailwind CSS with custom design system
- **Icons**: Lucide React icon library

## Code Style Guidelines

### React Components

- Use functional components with hooks
- Implement proper error handling for blockchain operations
- Include loading states for async operations
- Use TypeScript-style prop validation when possible

### Web3 Integration

- Always check for MetaMask availability before web3 operations
- Handle network switching and account changes
- Implement proper gas estimation for transactions
- Use try-catch blocks for all blockchain calls

### State Management

- Use React hooks (useState, useEffect) for local state
- Implement proper cleanup in useEffect hooks
- Handle async operations with proper loading/error states

### UI/UX Patterns

- Use shadcn/ui components for consistency
- Implement responsive design with Tailwind CSS
- Include proper accessibility attributes
- Provide clear feedback for user actions

### Blockchain Specific

- Validate addresses before transactions
- Generate secure hashes for documents
- Implement proper contract interaction patterns
- Handle different network configurations

## File Structure

- `/src/components/` - React components (AdminPortal, StudentPortal, VerificationPortal)
- `/src/lib/` - Utility functions (web3.js, contracts.js, utils.js)
- `/src/components/ui/` - Reusable UI components (Button, Card, Input, etc.)
- `/contracts/` - Solidity smart contracts

## Best Practices

- Always validate user inputs, especially wallet addresses
- Implement proper error boundaries for React components
- Use semantic HTML and proper ARIA labels
- Test with different MetaMask network configurations
- Implement proper loading and error states for blockchain operations
- Use environment variables for sensitive configuration

## Common Patterns

- Wallet connection management with state persistence
- Contract interaction with error handling and gas estimation
- Hash generation for document verification
- Responsive layout with mobile-first approach

When suggesting code improvements or new features, prioritize security, user experience, and blockchain best practices.
