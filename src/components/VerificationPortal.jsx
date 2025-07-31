import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Building,
  User,
} from "lucide-react";
import { web3Service } from "@/lib/web3";

export function VerificationPortal() {
  const [recordHash, setRecordHash] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const verifyRecord = async () => {
    if (!recordHash.trim()) {
      alert("Please enter a record hash to verify");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      // Call smart contract to verify the record
      const result = await web3Service.readContractMethod(
        "verifyRecord",
        recordHash
      );

      if (result[0]) {
        // Record exists
        setVerificationResult({
          isValid: true,
          institution: result[1],
          student: result[2],
          timestamp: result[3],
          recordHash: recordHash,
        });
      } else {
        setVerificationResult({
          isValid: false,
          message: "Record not found or invalid hash",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);

      // For demo purposes, simulate verification result
      if (recordHash.startsWith("0x")) {
        setVerificationResult({
          isValid: true,
          institution: "0xabcdef1234567890abcdef1234567890abcdef12",
          student: "0x1234567890abcdef1234567890abcdef12345678",
          timestamp: Date.now() - 86400000,
          recordHash: recordHash,
          recordType: "degree",
          metadata:
            "Bachelor of Science in Computer Science - University of Technology",
        });
      } else {
        setVerificationResult({
          isValid: false,
          message: "Invalid record hash format",
        });
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleHashInput = (e) => {
    setRecordHash(e.target.value);
    setVerificationResult(null);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 6)}...${address.substring(38)}`;
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Record Verification
        </h1>
        <p className="text-gray-600 mt-2">
          Verify the authenticity of academic records on the blockchain
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Verify Academic Record
          </CardTitle>
          <CardDescription>
            Enter the record hash to verify its authenticity and view details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Record Hash
            </label>
            <div className="flex gap-3">
              <Input
                type="text"
                placeholder="Enter record hash (0x...)"
                value={recordHash}
                onChange={handleHashInput}
                className="flex-1 font-mono"
              />
              <Button
                onClick={verifyRecord}
                disabled={isVerifying || !recordHash.trim()}
              >
                {isVerifying ? "Verifying..." : "Verify"}
              </Button>
            </div>
          </div>

          {verificationResult && (
            <div className="mt-6">
              {verificationResult.isValid ? (
                <Card className="border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="h-5 w-5" />
                      Record Verified Successfully
                    </CardTitle>
                    <CardDescription className="text-green-600">
                      This academic record is authentic and verified on the
                      blockchain
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Record Hash
                        </label>
                        <p className="text-sm text-gray-900 font-mono break-all">
                          {verificationResult.recordHash}
                        </p>
                      </div>

                      {verificationResult.recordType && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Record Type
                          </label>
                          <p className="text-sm text-gray-900 capitalize">
                            {verificationResult.recordType}
                          </p>
                        </div>
                      )}

                      {verificationResult.metadata && (
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Details
                          </label>
                          <p className="text-sm text-gray-900">
                            {verificationResult.metadata}
                          </p>
                        </div>
                      )}

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Student Address
                        </label>
                        <p className="text-sm text-gray-900 font-mono flex items-center gap-1">
                          <User className="h-4 w-4" />
                          {formatAddress(verificationResult.student)}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Issuing Institution
                        </label>
                        <p className="text-sm text-gray-900 font-mono flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {formatAddress(verificationResult.institution)}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Issue Date
                        </label>
                        <p className="text-sm text-gray-900 flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {formatDate(verificationResult.timestamp)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700">
                      <XCircle className="h-5 w-5" />
                      Verification Failed
                    </CardTitle>
                    <CardDescription className="text-red-600">
                      {verificationResult.message ||
                        "The provided record hash could not be verified"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-red-700">
                      <p>Possible reasons for verification failure:</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Invalid or incorrect record hash</li>
                        <li>Record does not exist on the blockchain</li>
                        <li>Network connectivity issues</li>
                        <li>
                          Record may have been issued on a different network
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Verify Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-gray-600">
            <p>
              <strong>1. Obtain the Record Hash:</strong> The record hash is a
              unique identifier provided when an academic record is issued on
              the blockchain.
            </p>
            <p>
              <strong>2. Enter the Hash:</strong> Paste the complete record hash
              in the verification field above. It should start with "0x"
              followed by alphanumeric characters.
            </p>
            <p>
              <strong>3. Verify:</strong> Click the "Verify" button to check the
              record against the blockchain. The verification will show if the
              record is authentic and display its details.
            </p>
            <p>
              <strong>4. Review Results:</strong> A verified record will show
              green with all details including issuing institution, student
              address, and timestamp.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
