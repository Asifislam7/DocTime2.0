"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Trash2, 
  Search, 
  Plus,
  FileImage,
  File
} from "lucide-react";
import { useToast } from "@/components/ui/toast";

// Types
interface Prescription {
  _id: string;
  title: string;
  description?: string;
  documentType: string;
  fileName: string;
  originalFileName: string;
  fileSize: number;
  mimeType: string;
  status: string;
  extractedText?: string;
  metadata?: {
    doctorName?: string;
    dateIssued?: string;
    medicationNames?: string[];
    dosage?: string[];
    instructions?: string[];
  };
  tags?: string[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface PrescriptionStats {
  total: number;
  byType: Record<string, number>;
  byStatus: Record<string, number>;
  totalSize: number;
}

const DOCUMENT_TYPES = [
  { value: 'prescription', label: 'Prescription' },
  { value: 'lab_report', label: 'Lab Report' },
  { value: 'x_ray', label: 'X-Ray' },
  { value: 'mri', label: 'MRI' },
  { value: 'ct_scan', label: 'CT Scan' },
  { value: 'ultrasound', label: 'Ultrasound' },
  { value: 'medical_certificate', label: 'Medical Certificate' },
  { value: 'discharge_summary', label: 'Discharge Summary' },
  { value: 'other', label: 'Other' }
];

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  processed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
};

export default function MyPrescriptions() {
  const { user } = useUser();
  const { addToast } = useToast();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [stats, setStats] = useState<PrescriptionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Upload form state
  const [uploadForm, setUploadForm] = useState({
    title: "",
    description: "",
    documentType: "prescription",
    tags: "",
    isPublic: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch prescriptions
  const fetchPrescriptions = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
        ...(filterType && filterType !== 'all' && { documentType: filterType }),
        ...(filterStatus && filterStatus !== 'all' && { status: filterStatus })
      });

      const response = await fetch(`http://localhost:3001/api/v1/prescriptions/user/${user.id}?${params}`);
      const data = await response.json();

      if (data.success) {
        setPrescriptions(data.data.prescriptions);
        setTotalPages(data.data.totalPages);
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          message: data.message || 'Failed to fetch prescriptions'
        });
      }
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to fetch prescriptions'
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, currentPage, searchTerm, filterType, filterStatus, addToast]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    if (!user?.id) return;

    try {
      const response = await fetch(`http://localhost:3001/api/v1/prescriptions/user/${user.id}/stats`);
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchPrescriptions();
    fetchStats();
  }, [fetchPrescriptions, fetchStats]);

  // Handle file upload
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !selectedFile) return;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('clerkUserId', user.id);
      formData.append('title', uploadForm.title);
      formData.append('description', uploadForm.description);
      formData.append('documentType', uploadForm.documentType);
      formData.append('tags', uploadForm.tags);
      formData.append('isPublic', uploadForm.isPublic.toString());

      const response = await fetch('http://localhost:3001/api/v1/prescriptions/upload', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        addToast({
          type: 'success',
          title: 'Success',
          message: 'Document uploaded successfully'
        });
        setUploadForm({
          title: "",
          description: "",
          documentType: "prescription",
          tags: "",
          isPublic: false
        });
        setSelectedFile(null);
        setShowUploadForm(false);
        fetchPrescriptions();
        fetchStats();
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          message: data.message || 'Failed to upload document'
        });
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to upload document'
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle download
  const handleDownload = async (prescriptionId: string, fileName: string) => {
    if (!user?.id) return;

    try {
      const response = await fetch(`http://localhost:3001/api/v1/prescriptions/${prescriptionId}/user/${user.id}/download`);
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        addToast({
          type: 'success',
          title: 'Success',
          message: 'File downloaded successfully'
        });
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to download file'
        });
      }
    } catch (error) {
      console.error('Error downloading file:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to download file'
      });
    }
  };

  // Handle delete
  const handleDelete = async (prescriptionId: string) => {
    if (!user?.id) return;

    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await fetch(`http://localhost:3001/api/v1/prescriptions/${prescriptionId}/user/${user.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        addToast({
          type: 'success',
          title: 'Success',
          message: 'Document deleted successfully'
        });
        fetchPrescriptions();
        fetchStats();
      } else {
        addToast({
          type: 'error',
          title: 'Error',
          message: data.message || 'Failed to delete document'
        });
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      addToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete document'
      });
    }
  };

  // Get file icon based on mime type
  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return <File className="h-5 w-5 text-red-500" />;
    if (mimeType.includes('image')) return <FileImage className="h-5 w-5 text-blue-500" />;
    return <File className="h-5 w-5 text-gray-500" />;
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            My Prescriptions & Documents
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Upload, manage, and organize your medical documents and prescriptions
          </p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {stats.total}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Processed
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats.byStatus.processed || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  {stats.byStatus.pending || 0}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Total Size
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  {formatFileSize(stats.totalSize)}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search documents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {DOCUMENT_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processed">Processed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setShowUploadForm(true)} className="bg-[#06A3DA] hover:bg-[#057bb5]">
            <Plus className="h-4 w-4 mr-2" />
            Upload Document
          </Button>
        </div>

        {/* Upload Form Modal */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Upload Document</CardTitle>
                <CardDescription>
                  Upload a medical document or prescription for processing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleFileUpload} className="space-y-4">
                  <div>
                    <Label htmlFor="file">Select File</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.tiff,.bmp,.doc,.docx,.txt"
                      onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                      required
                      className="mt-1"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Supported formats: PDF, Images, Documents (Max 10MB)
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={uploadForm.title}
                      onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                      placeholder="Enter document title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={uploadForm.description}
                      onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                      placeholder="Enter document description"
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="documentType">Document Type *</Label>
                    <Select
                      value={uploadForm.documentType}
                      onValueChange={(value) => setUploadForm({ ...uploadForm, documentType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select document type" />
                      </SelectTrigger>
                      <SelectContent>
                        {DOCUMENT_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="tags">Tags (comma-separated)</Label>
                    <Input
                      id="tags"
                      value={uploadForm.tags}
                      onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                      placeholder="e.g., urgent, follow-up, medication"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={uploadForm.isPublic}
                      onChange={(e) => setUploadForm({ ...uploadForm, isPublic: e.target.checked })}
                      className="rounded"
                    />
                    <Label htmlFor="isPublic">Make this document public</Label>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowUploadForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={uploading}
                      className="bg-[#06A3DA] hover:bg-[#057bb5]"
                    >
                      {uploading ? 'Uploading...' : 'Upload Document'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Documents List */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#06A3DA]"></div>
          </div>
        ) : prescriptions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No documents found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Upload your first medical document or prescription to get started
              </p>
              <Button onClick={() => setShowUploadForm(true)} className="bg-[#06A3DA] hover:bg-[#057bb5]">
                <Plus className="h-4 w-4 mr-2" />
                Upload Document
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {prescriptions.map((prescription) => (
              <Card key={prescription._id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="flex-shrink-0">
                        {getFileIcon(prescription.mimeType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                          {prescription.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {prescription.description || 'No description'}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline">
                            {DOCUMENT_TYPES.find(t => t.value === prescription.documentType)?.label}
                          </Badge>
                          <Badge className={STATUS_COLORS[prescription.status as keyof typeof STATUS_COLORS]}>
                            {prescription.status}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {formatFileSize(prescription.fileSize)}
                          </span>
                          <span className="text-sm text-gray-500">
                            {formatDate(prescription.createdAt)}
                          </span>
                        </div>
                        {prescription.tags && prescription.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {prescription.tags.map((tag, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(prescription._id, prescription.originalFileName)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(prescription._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-2 mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
