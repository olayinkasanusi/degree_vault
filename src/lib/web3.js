import Web3 from "web3";

export class Web3Service {
  constructor() {
    this.web3 = null;
    this.account = null;
    this.contract = null;
  }

  async connectWallet() {
    if (typeof window.ethereum !== "undefined") {
      try {
        // Request account access
        await window.ethereum.request({ method: "eth_requestAccounts" });

        this.web3 = new Web3(window.ethereum);
        const accounts = await this.web3.eth.getAccounts();
        this.account = accounts[0];

        return this.account;
      } catch (error) {
        console.error("Error connecting wallet:", error);
        throw error;
      }
    } else {
      throw new Error(
        "MetaMask not detected. Please install MetaMask to use this application."
      );
    }
  }

  async getNetwork() {
    if (!this.web3) throw new Error("Web3 not initialized");

    const networkId = await this.web3.eth.net.getId();
    return networkId;
  }

  async getBalance() {
    if (!this.web3 || !this.account)
      throw new Error("Web3 or account not initialized");

    const balance = await this.web3.eth.getBalance(this.account);
    return this.web3.utils.fromWei(balance, "ether");
  }

  async deployContract(abi, bytecode, ...constructorArgs) {
    if (!this.web3 || !this.account)
      throw new Error("Web3 or account not initialized");

    const contract = new this.web3.eth.Contract(abi);

    const deployTx = contract.deploy({
      data: bytecode,
      arguments: constructorArgs,
    });

    const gas = await deployTx.estimateGas({ from: this.account });

    const result = await deployTx.send({
      from: this.account,
      gas: gas,
      gasPrice: await this.web3.eth.getGasPrice(),
    });

    this.contract = new this.web3.eth.Contract(abi, result.options.address);
    return result.options.address;
  }

  async loadContract(abi, address) {
    if (!this.web3) throw new Error("Web3 not initialized");

    this.contract = new this.web3.eth.Contract(abi, address);
    return this.contract;
  }

  async callContractMethod(methodName, ...args) {
    if (!this.contract || !this.account)
      throw new Error("Contract or account not initialized");

    return await this.contract.methods[methodName](...args).send({
      from: this.account,
      gas: 3000000,
    });
  }

  async readContractMethod(methodName, ...args) {
    if (!this.contract) throw new Error("Contract not initialized");

    return await this.contract.methods[methodName](...args).call();
  }

  generateHash(data) {
    return this.web3.utils.keccak256(data);
  }

  isValidAddress(address) {
    return this.web3.utils.isAddress(address);
  }
}

export const web3Service = new Web3Service();
