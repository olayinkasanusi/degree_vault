import { useState } from "react";
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
  User,
  FileText,
  ExternalLink,
  Download,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export function VerificationPortal() {
  const [recordHash, setRecordHash] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const getFileUrl = (path) => {
    const { data } = supabase.storage
      .from("academic-records")
      .getPublicUrl(path);
    return data.publicUrl;
  };

  const verifyRecord = async () => {
    if (!recordHash.trim()) {
      alert("Please enter a record hash to verify");
      return;
    }

    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const { data, error } = await supabase
        .from("records")
        .select("*")
        .eq("record_hash", recordHash.trim())
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setVerificationResult({
          isValid: true,
          student: data.student_address,
          timestamp: data.created_at,
          recordHash: data.record_hash,
          recordType: data.record_type,
          metadata: data.metadata,
          fileUrl: getFileUrl(data.file_path),
          fileName: data.file_path.split("/").pop(),
        });
      } else {
        setVerificationResult({
          isValid: false,
          message: "No record found with this hash in the global registry.",
        });
      }
    } catch (error) {
      console.error("Verification error:", error);
      setVerificationResult({
        isValid: false,
        message: `System error during verification: ${error.message}`,
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleHashInput = (e) => {
    setRecordHash(e.target.value);
    if (verificationResult) setVerificationResult(null);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Record Verification
        </h1>
        <p className="text-gray-600 mt-2">
          Verify authenticity and access original academic documents
        </p>
      </div>

      <Card className="border-2 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Verify Academic Record
          </CardTitle>
          <CardDescription>
            Enter the unique blockchain hash to retrieve the verified document
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-3">
            <Input
              type="text"
              placeholder="0x..."
              value={recordHash}
              onChange={handleHashInput}
              className="flex-1 font-mono"
              onKeyDown={(e) => e.key === "Enter" && verifyRecord()}
            />
            <Button
              onClick={verifyRecord}
              disabled={isVerifying || !recordHash.trim()}
            >
              {isVerifying ? "Searching..." : "Verify Record"}
            </Button>
          </div>

          {verificationResult && (
            <div className="mt-6 animate-in fade-in slide-in-from-top-4 duration-300">
              {verificationResult.isValid ? (
                <div className="space-y-6">
                  <Card className="border-green-200 bg-green-50/30">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-green-700 text-lg">
                        <CheckCircle className="h-5 w-5" />
                        Authenticity Confirmed
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div className="md:col-span-2 bg-white p-3 rounded border border-green-100 mb-2">
                          <span className="block text-[10px] font-bold text-gray-400 uppercase">
                            Document Fingerprint
                          </span>
                          <span className="font-mono break-all text-xs">
                            {verificationResult.recordHash}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">
                            Record Type
                          </span>
                          <span className="font-semibold capitalize">
                            {verificationResult.recordType}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">Issued On</span>
                          <span className="font-semibold">
                            {formatDate(verificationResult.timestamp)}
                          </span>
                        </div>
                        <div className="md:col-span-2">
                          <span className="text-gray-500 block">
                            Student Wallet
                          </span>
                          <span className="font-mono text-xs flex items-center gap-1">
                            <User className="h-3 w-3" />{" "}
                            {verificationResult.student}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-200 shadow-sm">
                    <CardHeader className="bg-blue-50/50 pb-4">
                      <CardTitle className="text-md flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                        Verified Document Access
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 border rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-white rounded shadow-sm">
                            <FileText className="h-8 w-8 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                              {verificationResult.fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              Academic Credential
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full md:w-auto">
                          <Button
                            variant="outline"
                            className="flex-1 md:flex-none"
                            onClick={() =>
                              window.open(verificationResult.fileUrl, "_blank")
                            }
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = verificationResult.fileUrl;
                              link.download = verificationResult.fileName;
                              link.click();
                            }}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <Card className="border-red-200 bg-red-50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-700 text-lg">
                      <XCircle className="h-5 w-5" />
                      Verification Failed
                    </CardTitle>
                    <p className="text-sm text-red-600 mt-1">
                      {verificationResult.message}
                    </p>
                  </CardHeader>
                </Card>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
