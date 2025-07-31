# Degree Vault Testing Guide

## 🎯 How to Test Your Blockchain Academic Records System

### Prerequisites
1. **Install MetaMask**: Add the MetaMask browser extension
2. **Development Server**: Your app is running on `http://localhost:3000`

---

## 🔧 Setup Instructions

### Step 1: Set Up a Local Test Network
1. Open a new terminal and run:
   ```bash
   ganache --deterministic --accounts 10 --host 0.0.0.0
   ```
2. This will start a local blockchain with 10 test accounts and show you the account addresses and private keys

### Step 2: Configure MetaMask
1. Open MetaMask and click "Add Network"
2. Select "Add a network manually"
3. Enter these details:
   - **Network Name**: Ganache Local
   - **New RPC URL**: http://127.0.0.1:8545
   - **Chain ID**: 1337
   - **Currency Symbol**: ETH
4. Save the network

### Step 3: Import Test Accounts
1. Copy one of the private keys from the Ganache output
2. In MetaMask, click "Import Account"
3. Paste the private key to import a test account with ETH

---

## 🧪 Testing Scenarios

### Test 1: Connect Wallet
1. Go to `http://localhost:3000`
2. Click "Connect Wallet"
3. Select your Ganache account in MetaMask
4. ✅ **Expected**: Wallet should connect and show your address

### Test 2: Issue Academic Record (Admin Portal)
1. Go to **Admin Portal** tab
2. Fill in the form:
   - **Student Address**: Use another Ganache account address
   - **Record Type**: "Bachelor's Degree"
   - **Institution**: "Test University" 
   - **Student Name**: "John Doe"
   - **Date**: "2024-01-15"
   - **Additional Info**: "Computer Science"
3. Click "Issue Record"
4. ✅ **Expected**: Transaction should be sent and record hash generated

### Test 3: View Records (Student Portal)
1. Switch to the student account in MetaMask (the one you issued the record to)
2. Go to **Student Portal** tab
3. ✅ **Expected**: You should see the issued record

### Test 4: Verify Record (Verification Portal)
1. Go to **Verification Portal** tab
2. Copy the record hash from Step 2
3. Paste it in the "Record Hash" field
4. Click "Verify"
5. ✅ **Expected**: Record details should be displayed with green checkmarks

---

## 📋 Sample Test Data

### Sample Record Hashes to Test (after issuing records):
The record hash is generated from the document content. Here are some examples:

**For testing, you can use these sample inputs:**
- **Student Address**: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- **Record Type**: `Bachelor of Science`
- **Institution**: `University of Technology`
- **Student Name**: `Alice Johnson`
- **Date**: `2024-06-15`
- **Additional Info**: `Computer Science, GPA: 3.8`

This will generate a specific hash that you can then verify.

---

## 🚀 Advanced Testing

### Test Smart Contract Functions Directly
You can also test the smart contract functions:

1. **Check if address is authorized**:
   ```javascript
   // In browser console (F12)
   await window.web3Service.contract.methods.isAuthorizedInstitution(yourAddress).call()
   ```

2. **Get student record count**:
   ```javascript
   await window.web3Service.contract.methods.getStudentRecordCount(studentAddress).call()
   ```

### Test Different User Roles
1. **Owner/Admin**: First account from Ganache (can authorize institutions)
2. **Institution**: Any authorized account (can issue records)
3. **Student**: Any account (can view their records)
4. **Public**: Any account (can verify records)

---

## 🐛 Common Issues & Solutions

### Issue: "Transaction Failed"
- **Solution**: Make sure you have enough ETH in your account
- **Solution**: Check that you're connected to the Ganache network

### Issue: "Record Not Found"
- **Solution**: Make sure the record hash is correct and the record was actually issued
- **Solution**: Check that you're using the same network where the record was issued

### Issue: "MetaMask Not Connecting"
- **Solution**: Refresh the page and try again
- **Solution**: Make sure MetaMask is unlocked and on the correct network

---

## 📊 What to Expect

### ✅ Successfully Working Features:
- Wallet connection with MetaMask
- Record issuance by authorized institutions
- Record verification by hash
- Student dashboard showing their records
- Responsive UI with proper styling

### 🔍 Key Testing Points:
1. **Security**: Only authorized institutions can issue records
2. **Integrity**: Record hashes match the document content
3. **Transparency**: Anyone can verify records with just the hash
4. **Immutability**: Records cannot be altered once issued

---

## 📝 Next Steps

After successful testing:
1. Deploy to a testnet (like Sepolia or Goerli)
2. Add more institution management features
3. Implement batch record issuance
4. Add record expiration functionality
5. Create admin dashboard for system management

Happy Testing! 🎉
