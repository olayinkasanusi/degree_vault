import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Wallet, AlertCircle, CheckCircle, ExternalLink } from "lucide-react";
import { web3Service } from "@/lib/web3";
import { ACADEMIC_RECORDS_ABI, CONTRACT_CONFIG } from "@/lib/contracts";

export function WalletConnection({ onConnectionChange }) {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("");
  const [network, setNetwork] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    checkConnection();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (accounts.length > 0) {
          await connectWallet();
        }
      } catch (error) {
        console.error("Error checking connection:", error);
      }
    }
  };

  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      setAccount(accounts[0]);
      loadAccountData(accounts[0]);
    }
  };

  const handleChainChanged = () => {
    window.location.reload();
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    setError("");

    try {
      const account = await web3Service.connectWallet();
      setAccount(account);
      setIsConnected(true);

      // Load contract from environment variable or localStorage
      const contractAddress =
        import.meta.env.VITE_CONTRACT_ADDRESS ||
        localStorage.getItem("contractAddress");

      if (contractAddress) {
        await web3Service.loadContract(ACADEMIC_RECORDS_ABI, contractAddress);
      } else {
        setError("Contract address not found. Please deploy the contract and add VITE_CONTRACT_ADDRESS to .env.local");
      }

      await loadAccountData(account);

      if (onConnectionChange) {
        onConnectionChange(true, account);
      }
    } catch (error) {
      console.error("Connection error:", error);
      setError(error.message);
    } finally {
      setIsConnecting(false);
    }
  };

  const loadAccountData = async (accountAddress) => {
    try {
      const balance = await web3Service.getBalance();
      const networkId = await web3Service.getNetwork();

      setBalance(parseFloat(balance).toFixed(4));
      setNetwork(getNetworkName(networkId));
    } catch (error) {
      console.error("Error loading account data:", error);
    }
  };

  const getNetworkName = (networkId) => {
    const networks = {
      1: "Ethereum Mainnet",
      3: "Ropsten Testnet",
      4: "Rinkeby Testnet",
      5: "Goerli Testnet",
      11155111: "Sepolia Testnet",
      1337: "Local Network",
    };
    return networks[networkId] || `Network ${networkId}`;
  };

  const disconnect = () => {
    setIsConnected(false);
    setAccount("");
    setBalance("");
    setNetwork("");
    setError("");

    if (onConnectionChange) {
      onConnectionChange(false, "");
    }
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

  if (!window.ethereum) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            MetaMask Required
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4">
            This application requires MetaMask to interact with the blockchain.
            Please install MetaMask to continue.
          </p>
          <Button asChild className="w-full">
            <a
              href="https://metamask.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Install MetaMask
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!isConnected) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Wallet
          </CardTitle>
          <CardDescription>
            Connect your MetaMask wallet to access the blockchain academic
            records system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full"
          >
            {isConnecting ? "Connecting..." : "Connect MetaMask"}
          </Button>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Make sure you're connected to the correct network:</p>
            <p>• Sepolia Testnet (recommended for testing)</p>
            <p>• Ethereum Mainnet (for production)</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-600">
          <CheckCircle className="h-5 w-5" />
          Wallet Connected
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Account
          </label>
          <p className="text-sm font-mono">{formatAddress(account)}</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Balance
          </label>
          <p className="text-sm">{balance} ETH</p>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">
            Network
          </label>
          <p className="text-sm">{network}</p>
        </div>

        <Button
          onClick={disconnect}
          variant="outline"
          size="sm"
          className="w-full"
        >
          Disconnect
        </Button>
      </CardContent>
    </Card>
  );
}
