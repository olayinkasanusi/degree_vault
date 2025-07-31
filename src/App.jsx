import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminPortal } from "@/components/AdminPortal";
import { StudentPortal } from "@/components/StudentPortal";
import { VerificationPortal } from "@/components/VerificationPortal";
import { WalletConnection } from "@/components/WalletConnection";
import { GraduationCap, Settings, User, Search } from "lucide-react";

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [connectedAccount, setConnectedAccount] = useState("");
  const [activeTab, setActiveTab] = useState("verify");

  const handleConnectionChange = (connected, account) => {
    setIsWalletConnected(connected);
    setConnectedAccount(account);

    // Switch to student portal when wallet is connected
    if (connected && activeTab === "verify") {
      setActiveTab("student");
    }
  };

  useEffect(() => {
    // Check URL parameters for verification links
    const urlParams = new URLSearchParams(window.location.search);
    const hash = urlParams.get("hash");
    if (hash) {
      setActiveTab("verify");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Degree Vault
                </h1>
                <p className="text-sm text-gray-600">
                  Blockchain Academic Records System
                </p>
              </div>
            </div>

            {isWalletConnected && (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>Connected:</span>
                <span className="font-mono">
                  {connectedAccount.substring(0, 6)}...
                  {connectedAccount.substring(38)}
                </span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        {!isWalletConnected ? (
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Welcome to Degree Vault
              </h2>
              <p className="text-gray-600">
                A secure, blockchain-based system for issuing, storing, and
                verifying academic records. Connect your wallet to get started
                or use the verification portal to check records.
              </p>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="verify" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Verify Records
                </TabsTrigger>
                <TabsTrigger
                  value="connect"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Connect Wallet
                </TabsTrigger>
              </TabsList>

              <TabsContent value="verify" className="mt-6">
                <VerificationPortal />
              </TabsContent>

              <TabsContent value="connect" className="mt-6">
                <WalletConnection onConnectionChange={handleConnectionChange} />
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-8">
              <TabsTrigger value="student" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Student
              </TabsTrigger>
              <TabsTrigger value="admin" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Admin
              </TabsTrigger>
              <TabsTrigger value="verify" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Verify
              </TabsTrigger>
            </TabsList>

            <TabsContent value="student">
              <StudentPortal />
            </TabsContent>

            <TabsContent value="admin">
              <AdminPortal />
            </TabsContent>

            <TabsContent value="verify">
              <VerificationPortal />
            </TabsContent>
          </Tabs>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">
                About Degree Vault
              </h3>
              <p className="text-sm text-gray-600">
                A secure, decentralized platform for managing academic
                credentials using blockchain technology. Ensuring authenticity,
                immutability, and easy verification of educational records.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Features</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Blockchain-based security</li>
                <li>• Tamper-proof records</li>
                <li>• Instant verification</li>
                <li>• Easy sharing and access</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Support</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• MetaMask wallet required</li>
                <li>• Sepolia testnet recommended</li>
                <li>• Gas fees may apply</li>
                <li>• 24/7 verification available</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-6 text-center">
            <p className="text-sm text-gray-600">
              © 2025 Degree Vault. Built with React, Web3, and Ethereum.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
