// Academic Records Smart Contract ABI
export const ACADEMIC_RECORDS_ABI = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "institution",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "student",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "recordHash",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "RecordIssued",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "institution",
        type: "address",
      },
    ],
    name: "addAuthorizedInstitution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "authorizedInstitutions",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "student",
        type: "address",
      },
      {
        internalType: "string",
        name: "recordHash",
        type: "string",
      },
      {
        internalType: "string",
        name: "recordType",
        type: "string",
      },
      {
        internalType: "string",
        name: "metadata",
        type: "string",
      },
    ],
    name: "issueRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    name: "records",
    outputs: [
      {
        internalType: "address",
        name: "institution",
        type: "address",
      },
      {
        internalType: "address",
        name: "student",
        type: "address",
      },
      {
        internalType: "string",
        name: "recordType",
        type: "string",
      },
      {
        internalType: "string",
        name: "metadata",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "exists",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "institution",
        type: "address",
      },
    ],
    name: "removeAuthorizedInstitution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "studentRecords",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "recordHash",
        type: "string",
      },
    ],
    name: "verifyRecord",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export const CONTRACT_BYTECODE =
  "0x608060405234801561001057600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555061042f806100606000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c80638da5cb5b1461003b578063a4c0ed3614610059575b600080fd5b610043610075565b60405161005091906102a7565b60405180910390f35b610073600480360381019061006e91906103f3565b610099565b005b60008054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b505050565b6000819050919050565b6100b1816100a4565b82525050565b60006020820190506100cc60008301846100a8565b92915050565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610102826100d7565b9050919050565b610112816100f7565b811461011d57600080fd5b50565b60008135905061012f81610109565b92915050565b60008060408385031215610148576101476100d2565b5b600061015685828601610120565b925050602061016785828601610120565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806101b857607f821691505b602082108114156101cc576101cb610171565b5b5091905056fea2646970667358221220a8b1e9e2f8c6d5a1e9f8c6d5a1e9f8c6d5a1e9f8c6d5a1e9f8c6d5a1e9f8c664736f6c63430008070033";

// Contract configuration
export const CONTRACT_CONFIG = {
  // Sepolia testnet configuration
  networkId: 11155111,
  networkName: "Sepolia",
  rpcUrl: "https://sepolia.infura.io/v3/YOUR_INFURA_KEY",
  contractAddress: null, // Will be set after deployment
};

// Record types
export const RECORD_TYPES = {
  DEGREE: "degree",
  CERTIFICATE: "certificate",
  TRANSCRIPT: "transcript",
  DIPLOMA: "diploma",
};
