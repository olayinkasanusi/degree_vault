import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  GraduationCap,
  Share2,
  Download,
  Calendar,
  Building,
} from "lucide-react";
import { web3Service } from "@/lib/web3";

export function StudentPortal() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentAddress, setStudentAddress] = useState("");

  useEffect(() => {
    loadStudentRecords();
  }, []);

  const loadStudentRecords = async () => {
    try {
      setIsLoading(true);
      const account = web3Service.account;
      setStudentAddress(account);

      if (!account) {
        console.warn("No account connected");
        setRecords([]);
        return;
      }

      // Fetch student records from blockchain
      // Note: This requires implementing a function in the smart contract
      // For now, we'll use the public records mapping and loop through them
      // In production, add a proper getStudentRecords function to the contract

      // For demo, show a placeholder until contract function is available
      const recordsData = [];

      // Try to fetch from blockchain if contract is loaded
      if (web3Service.contract) {
        try {
          // This would need a getStudentRecords() function in the contract
          // For now, display a message to deploy that function
          console.log("To enable full functionality, add getStudentRecords() to smart contract");
        } catch (error) {
          console.warn("Contract function not yet available:", error);
        }
      }

      setRecords(recordsData);
    } catch (error) {
      console.error("Error loading records:", error);
      setRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const generateVerificationLink = (recordHash) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/verify?hash=${recordHash}`;
  };

  const shareRecord = (record) => {
    const verificationLink = generateVerificationLink(record.hash);

    if (navigator.share) {
      navigator.share({
        title: `Academic Record Verification`,
        text: `Verify my ${record.recordType}: ${record.metadata}`,
        url: verificationLink,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(verificationLink).then(() => {
        alert("Verification link copied to clipboard!");
      });
    }
  };

  const downloadRecord = (record) => {
    // In a real implementation, this would download the actual document
    // For now, we'll create a verification document
    const verificationData = {
      recordHash: record.hash,
      recordType: record.recordType,
      metadata: record.metadata,
      timestamp: record.timestamp,
      studentAddress: studentAddress,
      verificationLink: generateVerificationLink(record.hash),
    };

    const blob = new Blob([JSON.stringify(verificationData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `academic-record-${record.recordType}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRecordIcon = (recordType) => {
    switch (recordType) {
      case "degree":
      case "diploma":
        return <GraduationCap className="h-5 w-5" />;
      default:
        return <GraduationCap className="h-5 w-5" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">
            Loading your academic records...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          My Academic Records
        </h1>
        <p className="text-gray-600 mt-2">
          View and share your blockchain-verified academic credentials
        </p>
        {studentAddress && (
          <p className="text-sm text-gray-500 mt-1">
            Wallet: {studentAddress.substring(0, 6)}...
            {studentAddress.substring(38)}
          </p>
        )}
      </div>

      {records.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Academic Records Found
            </h3>
            <p className="text-gray-600">
              You don't have any blockchain-verified academic records yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {records.map((record) => (
            <Card key={record.id} className="overflow-hidden">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  {getRecordIcon(record.recordType)}
                  <div>
                    <div className="capitalize text-lg">
                      {record.recordType}
                    </div>
                    <div className="text-sm text-gray-600 font-normal">
                      {record.metadata}
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Record Hash
                    </label>
                    <p className="text-sm text-gray-900 font-mono break-all">
                      {record.hash}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issue Date
                    </label>
                    <p className="text-sm text-gray-900 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(record.timestamp)}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Issuing Institution
                    </label>
                    <p className="text-sm text-gray-900 flex items-center gap-1 font-mono">
                      <Building className="h-4 w-4" />
                      {record.institution}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => shareRecord(record)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share for Verification
                  </Button>
                  <Button
                    onClick={() => downloadRecord(record)}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
