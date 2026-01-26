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
import { Upload, Hash, CheckCircle, AlertCircle } from "lucide-react";
import { web3Service } from "@/lib/web3";
import { ACADEMIC_RECORDS_ABI, RECORD_TYPES } from "@/lib/contracts";

export function AdminPortal() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [studentAddress, setStudentAddress] = useState("");
  const [recordType, setRecordType] = useState(RECORD_TYPES.DEGREE);
  const [metadata, setMetadata] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [recordHash, setRecordHash] = useState("");

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setUploadStatus(null);
    setRecordHash(""); // Clear hash when new file is selected
  };

  const generateRecordHash = async (file, studentAddress, metadata) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          // Use ArrayBuffer for binary safety
          const fileBuffer = e.target.result;
          // Combine file buffer and metadata
          const metaString = studentAddress + metadata + Date.now();
          const metaBuffer = new TextEncoder().encode(metaString);
          // Concatenate buffers
          const combined = new Uint8Array(fileBuffer.byteLength + metaBuffer.byteLength);
          combined.set(new Uint8Array(fileBuffer), 0);
          combined.set(metaBuffer, fileBuffer.byteLength);
          const hash = await web3Service.generateHash(combined.buffer);
          resolve(hash);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    if (!selectedFile || !studentAddress || !metadata) {
      setUploadStatus({
        type: "error",
        message: "Please fill in all required fields and select a file.",
      });
      return;
    }

    if (!web3Service.isValidAddress(studentAddress)) {
      setUploadStatus({
        type: "error",
        message: "Please enter a valid student wallet address.",
      });
      return;
    }


    setIsUploading(true);
    setUploadStatus({ type: "info", message: "Generating record hash..." });

    try {
      // Generate hash for the academic record
      const hash = await generateRecordHash(
        selectedFile,
        studentAddress,
        metadata
      );
      setRecordHash(hash);

      setUploadStatus({ type: "info", message: "Uploading to blockchain..." });

      // Issue record on blockchain
      await web3Service.callContractMethod(
        "issueRecord",
        studentAddress,
        hash,
        recordType,
        metadata
      );

      setUploadStatus({
        type: "success",
        message: `Academic record successfully issued! Hash: ${hash.substring(0, 10)}...`,
      });

      // Reset form except for recordHash
      setSelectedFile(null);
      setStudentAddress("");
      setMetadata("");
      if (document.getElementById("file-input")) {
        document.getElementById("file-input").value = "";
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadStatus({
        type: "error",
        message: `Failed to issue record: ${error.message}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Portal</h1>
        <p className="text-gray-600 mt-2">
          Issue and manage academic records on the blockchain
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Issue New Academic Record
          </CardTitle>
          <CardDescription>
            Upload academic documents and issue them as blockchain-verified
            records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Academic Document
            </label>
            <input
              id="file-input"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileSelect}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {selectedFile.name} (
                {(selectedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Student Wallet Address
            </label>
            <Input
              type="text"
              placeholder="0x..."
              value={studentAddress}
              onChange={(e) => setStudentAddress(e.target.value)}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Record Type
            </label>
            <select
              value={recordType}
              onChange={(e) => setRecordType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={RECORD_TYPES.DEGREE}>Degree</option>
              <option value={RECORD_TYPES.CERTIFICATE}>Certificate</option>
              <option value={RECORD_TYPES.TRANSCRIPT}>Transcript</option>
              <option value={RECORD_TYPES.DIPLOMA}>Diploma</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Metadata (Course, Institution, etc.)
            </label>
            <textarea
              placeholder="Enter additional information about the record..."
              value={metadata}
              onChange={(e) => setMetadata(e.target.value)}
              rows={3}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {uploadStatus && (
            <div
              className={`p-4 rounded-md flex items-center gap-2 ${uploadStatus.type === "success"
                  ? "bg-green-50 text-green-700"
                  : uploadStatus.type === "error"
                    ? "bg-red-50 text-red-700"
                    : "bg-blue-50 text-blue-700"
                }`}
            >
              {uploadStatus.type === "success" ? (
                <CheckCircle className="h-5 w-5" />
              ) : uploadStatus.type === "error" ? (
                <AlertCircle className="h-5 w-5" />
              ) : (
                <Hash className="h-5 w-5" />
              )}
              <span>{uploadStatus.message}</span>
            </div>
          )}


          {recordHash && (
            <div className="p-4 bg-gray-50 rounded-md">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">
                  Record Hash Generated
                </h3>
                <button
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 focus:outline-none"
                  onClick={() => {
                    navigator.clipboard.writeText(recordHash);
                  }}
                  title="Copy hash to clipboard"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm text-gray-600 break-all">{recordHash}</p>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={
              isUploading || !selectedFile || !studentAddress || !metadata
            }
            className="w-full"
          >
            {isUploading ? "Issuing Record..." : "Issue Academic Record"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
