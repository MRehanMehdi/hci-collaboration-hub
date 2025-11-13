import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Progress } from "./ui/progress";
import {
  Upload,
  Search,
  Filter,
  Download,
  Eye,
  Trash2,
  History,
  FileText,
  FileSpreadsheet,
  File as FileIcon,
  FileImage,
} from "lucide-react";
import { File, User } from "../types";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { toast } from "sonner";

interface FileSharingProps {
  files: File[];
  users: User[];
  onUploadFile: (file: Partial<File>) => void;
  onDeleteFile: (fileId: string) => void;
}

export function FileSharing({
  files,
  users,
  onUploadFile,
  onDeleteFile,
}: FileSharingProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === "all" || file.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      setUploadProgress(0);

      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsUploading(false);

            const fileExtension = file.name.split(".").pop() || "file";
            onUploadFile({
              name: file.name,
              type: fileExtension,
              size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
              uploaderId: "1",
              uploadDate: new Date().toISOString().split("T")[0],
              projectId: "1",
              version: 1,
              url: "#",
            });

            toast.success("File uploaded successfully!");
            return 0;
          }
          return prev + 10;
        });
      }, 200);
    }
  };

  const handleDelete = (fileId: string) => {
    onDeleteFile(fileId);
    toast.success("File deleted successfully!");
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case "docx":
        return <FileText className="h-8 w-8 text-blue-400" />;
      case "xlsx":
        return <FileSpreadsheet className="h-8 w-8 text-green-400" />;
      case "pptx":
        return <FileIcon className="h-8 w-8 text-orange-400" />;
      case "pdf":
        return <FileText className="h-8 w-8 text-red-400" />;
      case "fig":
        return <FileImage className="h-8 w-8 text-purple-400" />;
      default:
        return <FileIcon className="h-8 w-8 text-gray-400" />;
    }
  };

  const getUploader = (uploaderId: string) =>
    users.find((u) => u.id === uploaderId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="mb-1">File Sharing</h1>
          <p className="text-gray-400">Upload and manage project files</p>
        </div>
        <div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
          />
          <label htmlFor="file-upload">
            <Button
              className="bg-teal-600 hover:bg-teal-700 cursor-pointer"
              asChild
            >
              <span>
                <Upload className="mr-2 h-4 w-4" />
                Upload File
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <Card className="bg-gray-800 border-gray-700 p-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span>Uploading file...</span>
              <span className="text-teal-400">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
          </div>
        </Card>
      )}

      {/* Search and Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[180px] bg-gray-800 border-gray-700">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="docx">Documents</SelectItem>
            <SelectItem value="xlsx">Spreadsheets</SelectItem>
            <SelectItem value="pptx">Presentations</SelectItem>
            <SelectItem value="pdf">PDFs</SelectItem>
            <SelectItem value="fig">Figma</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* File Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file, index) => {
          const uploader = getUploader(file.uploaderId);

          return (
            <motion.div
              key={file.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="bg-gray-800 border-gray-700 hover:border-teal-600 transition-all group">
                <div className="p-4 space-y-4">
                  {/* File Icon and Type */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.type)}
                      <div className="flex-1 min-w-0">
                        <h4 className="truncate">{file.name}</h4>
                        <p className="text-gray-400 text-sm">{file.size}</p>
                      </div>
                    </div>
                    <Badge className="bg-gray-700 text-xs">
                      v{file.version}
                    </Badge>
                  </div>

                  {/* Uploader Info */}
                  {uploader && (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={uploader.avatar} />
                        <AvatarFallback className="text-xs">
                          {uploader.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-400 truncate">
                          {uploader.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(file.uploadDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-700">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 hover:bg-gray-700"
                      onClick={() => setSelectedFile(file)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Preview
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-gray-700"
                      onClick={() => toast.success("Download started!")}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-gray-700"
                    >
                      <History className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-red-700 hover:text-red-400"
                      onClick={() => handleDelete(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredFiles.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <FileIcon className="h-12 w-12 mx-auto mb-4 text-gray-600" />
          <p>No files found matching your criteria.</p>
        </div>
      )}

      {/* File Preview Modal */}
      <Dialog
        open={!!selectedFile}
        onOpenChange={(open) => !open && setSelectedFile(null)}
      >
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-3xl">
          {selectedFile && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedFile.name}</DialogTitle>
                <DialogDescription>File preview and details</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Type:</span>
                    <span className="ml-2">.{selectedFile.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Size:</span>
                    <span className="ml-2">{selectedFile.size}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Version:</span>
                    <span className="ml-2">v{selectedFile.version}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Uploaded:</span>
                    <span className="ml-2">
                      {new Date(selectedFile.uploadDate).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" }
                      )}
                    </span>
                  </div>
                </div>

                <div className="bg-gray-900 rounded-lg p-8 flex items-center justify-center h-64">
                  <div className="text-center text-gray-500">
                    {getFileIcon(selectedFile.type)}
                    <p className="mt-4">File preview not available</p>
                    <Button className="mt-4 bg-teal-600 hover:bg-teal-700">
                      <Download className="h-4 w-4 mr-2" />
                      Download to View
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
