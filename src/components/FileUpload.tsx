import { useCallback, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
  selectedFile: File | null;
  onBase64Change: (base64: string) => void;
}

export const FileUpload = ({ onFileSelect, selectedFile, onBase64Change }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png"];
    return validTypes.includes(file.type);
  };

  const processFile = (file: File) => {
    if (!validateFile(file)) {
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreview(result);
      const base64Data = result.split(',')[1];
      onBase64Change(base64Data);
    };
    reader.readAsDataURL(file);
    onFileSelect(file);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        processFile(file);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const clearFile = () => {
    setPreview(null);
    onFileSelect(null);
    onBase64Change("");
  };

  return (
    <div className="w-full">
      {!preview ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={cn(
            "relative border-2 border-dashed rounded-[2rem] transition-all duration-500",
            "hover:border-primary/60 cursor-pointer group overflow-hidden",
            isDragging
              ? "border-primary bg-secondary/50 scale-[1.02]"
              : "border-border/50"
          )}
          style={{
            background: isDragging 
              ? 'linear-gradient(135deg, hsl(var(--secondary) / 0.5), hsl(var(--card) / 0.5))'
              : 'linear-gradient(135deg, hsl(var(--secondary) / 0.3), hsl(var(--card) / 0.5))',
            backdropFilter: 'var(--blur-glass)'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileInput}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center relative z-0">
            <div className="w-20 h-20 mb-6 rounded-3xl flex items-center justify-center 
                          shadow-[var(--shadow-elevated)] transition-all duration-500 group-hover:scale-110"
                 style={{
                   background: 'var(--gradient-primary)'
                 }}>
              <Upload className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-foreground">
              Upload an image
            </h3>
            <p className="text-sm text-muted-foreground mb-1">
              Drag and drop or click to browse
            </p>
            <p className="text-xs text-muted-foreground/70">
              JPG, JPEG, or PNG
            </p>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-elevated)] group"
             style={{
               background: 'linear-gradient(135deg, hsl(var(--card)), hsl(var(--secondary) / 0.5))',
               backdropFilter: 'var(--blur-glass)'
             }}>
          <button
            onClick={clearFile}
            className="absolute top-4 right-4 z-10 p-2.5 rounded-2xl bg-destructive/90 text-destructive-foreground 
                     hover:bg-destructive transition-all duration-300 shadow-lg
                     hover:scale-110 backdrop-blur-md flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="p-4">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-72 object-cover rounded-xl"
            />
          </div>
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 text-sm">
              <ImageIcon className="w-4 h-4 text-primary" />
              <span className="font-medium text-foreground truncate">
                {selectedFile?.name}
              </span>
              <span className="text-muted-foreground ml-auto text-xs">
                {(selectedFile?.size! / 1024).toFixed(1)} KB
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
