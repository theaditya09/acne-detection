import { useState } from "react";
import axios from "axios";
import { FileUpload } from "@/components/FileUpload";
import { ResultsBadge } from "@/components/ResultsBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Sparkles } from "lucide-react";

const Index = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [detectedConditions, setDetectedConditions] = useState<string[]>([]);
  const [hasResults, setHasResults] = useState(false);
  const { toast } = useToast();

  const handleDetect = async () => {
    if (!selectedFile || !base64Image) {
      toast({
        title: "No image selected",
        description: "Please upload an image before detecting.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setHasResults(false);

    try {
      const response = await axios({
        method: "POST",
        url: "https://serverless.roboflow.com/pimples-detection/4",
        params: { api_key: "JrsflqJlI98Re0vrfdf6" },
        data: base64Image,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      const predictions = response.data.predictions || [];
      
      const uniqueConditions = Array.from(
        new Set(predictions.map((pred: any) => pred.class))
      ) as string[];

      setDetectedConditions(uniqueConditions);
      setHasResults(true);

      toast({
        title: "Detection complete",
        description: `Found ${uniqueConditions.length} condition${uniqueConditions.length !== 1 ? 's' : ''}`,
      });
    } catch (error) {
      toast({
        title: "Detection failed",
        description: "Unable to analyze the image. Please try again.",
        variant: "destructive",
      });
      console.error("Detection error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, hsl(var(--background)), hsl(var(--secondary) / 0.3))'
         }}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-[2rem] mb-8
                        shadow-[var(--shadow-elevated)] transition-all duration-500 hover:scale-105"
               style={{
                 background: 'var(--gradient-primary)'
               }}>
            <Sparkles className="w-12 h-12 text-primary-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-4"
              style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            Acne Detection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            AI-powered skin analysis
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Upload Card */}
          <div className="rounded-[2rem] overflow-hidden shadow-[var(--shadow-elevated)] 
                        border border-border/50 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-100"
               style={{
                 background: 'var(--gradient-glass)',
                 backdropFilter: 'var(--blur-glass)'
               }}>
            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-semibold text-foreground mb-2">Upload Image</h2>
                <p className="text-muted-foreground">
                  Select a clear image of the affected skin area
                </p>
              </div>
              <FileUpload
                selectedFile={selectedFile}
                onFileSelect={setSelectedFile}
                onBase64Change={setBase64Image}
              />
              <Button
                onClick={handleDetect}
                disabled={!selectedFile || isLoading}
                className="w-full mt-8 h-14 text-base font-semibold rounded-[1.5rem]
                         shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-elevated)]
                         transition-all duration-500 hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
                style={{
                  background: 'var(--gradient-primary)'
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Detect Conditions
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Results Card */}
          {hasResults && (
            <div className="rounded-[2rem] overflow-hidden shadow-[var(--shadow-elevated)] 
                          border border-border/50 animate-in fade-in slide-in-from-bottom-5 duration-700"
                 style={{
                   background: 'var(--gradient-glass)',
                   backdropFilter: 'var(--blur-glass)'
                 }}>
              <div className="p-8">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">Detection Results</h2>
                  <p className="text-muted-foreground">
                    AI-identified skin conditions
                  </p>
                </div>
                <ResultsBadge conditions={detectedConditions} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
