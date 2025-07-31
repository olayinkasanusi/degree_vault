// Sample Test Data for Degree Vault
// Use these in your Admin Portal to create test records

export const sampleTestData = [
  {
    studentAddress: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    recordType: "Bachelor of Science",
    institution: "MIT",
    studentName: "Alice Johnson",
    date: "2024-06-15",
    additionalInfo: "Computer Science, Magna Cum Laude, GPA: 3.9"
  },
  {
    studentAddress: "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC",
    recordType: "Master of Arts", 
    institution: "Harvard University",
    studentName: "Bob Smith",
    date: "2024-05-20",
    additionalInfo: "Business Administration, Dean's List"
  },
  {
    studentAddress: "0x90F79bf6EB2c4f870365E785982E1f101E93b906",
    recordType: "PhD",
    institution: "Stanford University", 
    studentName: "Carol Davis",
    date: "2024-04-10",
    additionalInfo: "Artificial Intelligence, Summa Cum Laude"
  }
];

// Expected record hashes (will be generated when you issue these records)
// Save these after issuing to test verification portal:

/*
TESTING WORKFLOW:

1. Start Ganache: ganache --deterministic --accounts 10 --host 0.0.0.0
2. Connect MetaMask to Ganache network (localhost:8545, Chain ID: 1337)
3. Import the first account from Ganache (this becomes the admin/owner)
4. Go to Admin Portal and issue records using the sample data above
5. Copy the generated record hashes 
6. Switch to student accounts in MetaMask to view their records
7. Use the Verification Portal with the record hashes to verify

GANACHE DETERMINISTIC ACCOUNTS (always the same):
Account 0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (Admin/Owner)
Account 1: 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 (Alice)
Account 2: 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC (Bob)
Account 3: 0x90F79bf6EB2c4f870365E785982E1f101E93b906 (Carol)

Private Keys (for importing to MetaMask):
Account 0: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
Account 1: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d
Account 2: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a
Account 3: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6
*/

// Quick test record for verification:
export const quickTestRecord = {
  recordType: "Test Certificate",
  institution: "Test University", 
  studentName: "Test Student",
  date: "2024-01-01",
  additionalInfo: "Sample test record for verification"
};

console.log("Sample test data loaded. Check TESTING_GUIDE.md for full instructions.");
