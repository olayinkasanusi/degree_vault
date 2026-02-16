import { useState, useEffect } from "react";
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
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  User,
} from "lucide-react";
import { web3Service } from "@/lib/web3";
import { supabase } from "@/lib/supabase";

export function StudentPortal() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [studentAddress, setStudentAddress] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const pageSize = 5;

  useEffect(() => {
    const init = async () => {
      const account = web3Service.account;
      setStudentAddress(account);
      await loadAllRecords(1);
    };
    init();
  }, []);

  const loadAllRecords = async (page) => {
    try {
      setIsLoading(true);
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("records")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      setRecords(data || []);
      setTotalCount(count || 0);
    } catch (error) {
      console.error("Error loading records:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    loadAllRecords(newPage);
  };

  const getPublicUrl = (filePath) => {
    const { data } = supabase.storage
      .from("academic-records")
      .getPublicUrl(filePath);
    return data.publicUrl;
  };

  const generateVerificationLink = (recordHash) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/verify?hash=${recordHash}`;
  };

  const shareRecord = (record) => {
    const verificationLink = generateVerificationLink(record.record_hash);

    if (navigator.share) {
      navigator.share({
        title: `Academic Record Verification`,
        text: `Verify ${record.record_type}: ${record.metadata}`,
        url: verificationLink,
      });
    } else {
      navigator.clipboard.writeText(verificationLink).then(() => {
        alert("Verification link copied to clipboard!");
      });
    }
  };

  const downloadRecord = (record) => {
    const verificationData = {
      recordHash: record.record_hash,
      recordType: record.record_type,
      metadata: record.metadata,
      timestamp: record.created_at,
      studentAddress: record.student_address,
      verificationLink: generateVerificationLink(record.record_hash),
    };

    const blob = new Blob([JSON.stringify(verificationData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `record-${record.record_hash.substring(0, 8)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getRecordIcon = (recordType) => {
    switch (recordType?.toLowerCase()) {
      case "degree":
      case "diploma":
        return <GraduationCap className="h-5 w-5 text-blue-600" />;
      default:
        return <GraduationCap className="h-5 w-5 text-gray-600" />;
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse text-lg text-gray-600">
            Loading all academic records...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Global Academic Registry
        </h1>
        <p className="text-gray-600 mt-2">
          Public directory of all blockchain-verified academic credentials
        </p>
      </div>

      {records.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <GraduationCap className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Records Found
            </h3>
            <p className="text-gray-600">
              The blockchain registry is currently empty.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {records.map((record) => (
            <Card
              key={record.id}
              className="overflow-hidden border-l-4 border-l-slate-800 shadow-sm"
            >
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getRecordIcon(record.record_type)}
                    <div>
                      <div className="capitalize text-lg">
                        {record.record_type}
                      </div>
                      <div className="text-sm text-gray-500 font-normal">
                        {record.metadata}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700"
                    onClick={() =>
                      window.open(getPublicUrl(record.file_path), "_blank")
                    }
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Doc
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Student Address
                    </label>
                    <div className="flex items-center gap-2 text-xs text-gray-900 font-mono bg-blue-50 p-2 rounded">
                      <User className="h-3 w-3 text-blue-500" />
                      {record.student_address}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Issue Date
                    </label>
                    <p className="text-sm text-gray-900 flex items-center gap-1 py-1">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      {formatDate(record.created_at)}
                    </p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                      Blockchain Hash
                    </label>
                    <p className="text-[10px] md:text-xs text-gray-400 font-mono break-all italic">
                      {record.record_hash}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={() => shareRecord(record)}
                    variant="outline"
                    className="flex-1 md:flex-none flex items-center gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Verification
                  </Button>
                  <Button
                    onClick={() => downloadRecord(record)}
                    variant="outline"
                    className="flex-1 md:flex-none flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Metadata
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {totalCount > pageSize && (
            <div className="flex items-center justify-between mt-4 px-2">
              <p className="text-sm text-gray-600">
                Showing {records.length} of {totalCount} records
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage * pageSize >= totalCount}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
