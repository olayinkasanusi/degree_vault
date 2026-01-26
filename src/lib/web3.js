
// MOCK/DEMO Web3Service for UI prototyping (no real blockchain interaction)
export class Web3Service {
  constructor() {
    this.web3 = null;
    this.account = "0x2CCa4F7892233d74Eb0289A5C5C6dCC743048217";
    this.contract = null;
  }

  async connectWallet() {
    // Instantly "connect" with a fake account
    return this.account;
  }

  async getNetwork() {
    return 11155111; // Sepolia
  }

  async getBalance() {
    return "10.0"; // 10 ETH
  }

  async deployContract() {
    return "0x6e2A8e6e6b6e6e6e6e6e6e6e6e6e6e6e6e6e6e6e";
  }

  async loadContract() {
    return true;
  }


  async callContractMethod(methodName, ...args) {
    // Only handle 'issueRecord' for localStorage mock
    if (methodName === "issueRecord") {
      const [student, recordHash, recordType, metadata] = args;
      const record = {
        institution: this.account,
        student,
        recordType,
        metadata,
        timestamp: Date.now(),
        exists: true
      };
      // Store in localStorage by hash
      let all = JSON.parse(localStorage.getItem("mockRecords") || "{}")
      all[recordHash] = record;
      localStorage.setItem("mockRecords", JSON.stringify(all));
      // Also store for student
      let studentMap = JSON.parse(localStorage.getItem("mockStudentRecords") || "{}")
      if (!studentMap[student]) studentMap[student] = [];
      studentMap[student].push(recordHash);
      localStorage.setItem("mockStudentRecords", JSON.stringify(studentMap));
      return { status: true, transactionHash: "0xMOCKTX" };
    }
    // Simulate a successful transaction for other methods
    return { status: true, transactionHash: "0xMOCKTX" };
  }

  async readContractMethod(methodName, ...args) {
    if (methodName === "verifyRecord") {
      const [recordHash] = args;
      let all = JSON.parse(localStorage.getItem("mockRecords") || "{}");
      const record = all[recordHash];
      if (record && record.exists) {
        // Solidity returns: (bool exists, address institution, address student, uint256 timestamp)
        return [true, record.institution, record.student, record.timestamp];
      } else {
        return [false, "0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000", 0];
      }
    }
    if (methodName === "getStudentRecords") {
      const [student] = args;
      let studentMap = JSON.parse(localStorage.getItem("mockStudentRecords") || "{}")
      return studentMap[student] || [];
    }
    // Add more mocks as needed
    return [];
  }


  async generateHash(data) {
    // Use browser SubtleCrypto to hash any string or ArrayBuffer
    let buffer;
    if (typeof data === "string") {
      buffer = new TextEncoder().encode(data);
    } else if (data instanceof ArrayBuffer) {
      buffer = new Uint8Array(data);
    } else {
      throw new Error("Unsupported data type for hashing");
    }
    const hashBuffer = await window.crypto.subtle.digest("SHA-256", buffer);
    // Convert buffer to hex string
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return "0x" + hashHex;
  }

  isValidAddress(address) {
    return true;
  }
}

export const web3Service = new Web3Service();
