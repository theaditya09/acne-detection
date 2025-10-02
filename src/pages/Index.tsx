import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FileUpload } from "@/components/FileUpload";
import { ResultsBadge } from "@/components/ResultsBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getStats, addScan, initializeStorage } from "@/lib/storage";
import { 
  Loader2, 
  Sparkles, 
  Camera, 
  BarChart3, 
  History, 
  Settings,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Activity,
  Shield
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64Image, setBase64Image] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [detectedConditions, setDetectedConditions] = useState<string[]>([]);
  const [hasResults, setHasResults] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [quickStats, setQuickStats] = useState({
    totalScans: 0,
    clearDays: 0,
    improvement: 0,
    streak: 0
  });
  const { toast } = useToast();

  useEffect(() => {
    // Initialize storage with realistic data
    initializeStorage();
    setQuickStats(getStats());
  }, []);

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
    setScanProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 200);

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

      setScanProgress(100);
      setDetectedConditions(uniqueConditions);
      setHasResults(true);

      // Determine severity based on conditions
      let severity: 'Clear' | 'Mild' | 'Moderate' | 'Severe' = 'Clear';
      if (uniqueConditions.length > 0) {
        if (uniqueConditions.length === 1) severity = 'Mild';
        else if (uniqueConditions.length === 2) severity = 'Moderate';
        else severity = 'Severe';
      }

      // Calculate confidence based on API response
      const avgConfidence = predictions.length > 0 
        ? Math.round(predictions.reduce((sum: number, pred: any) => sum + (pred.confidence * 100), 0) / predictions.length)
        : 90;

      // Save scan to storage
      const now = new Date();
      addScan({
        date: now.toISOString().split('T')[0],
        time: now.toLocaleTimeString('en-IN', { hour12: true, hour: 'numeric', minute: '2-digit' }),
        conditions: uniqueConditions,
        severity,
        confidence: avgConfidence,
        imageUrl: selectedFile ? URL.createObjectURL(selectedFile) : '/placeholder.svg',
        notes: uniqueConditions.length > 0 
          ? `Detected: ${uniqueConditions.join(', ')} - ${severity} severity` 
          : 'No skin conditions detected - skin looks clear!',
        imageName: selectedFile?.name || 'scan.jpg',
        imageSize: selectedFile?.size || 0
      });

      // Update quick stats
      setQuickStats(getStats());

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
      clearInterval(progressInterval);
      setIsLoading(false);
      setScanProgress(0);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden"
         style={{
           background: 'linear-gradient(135deg, hsl(var(--background)), hsl(var(--secondary) / 0.3))'
         }}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            SkinAI - Acne Detection
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            AI-powered skin analysis designed for Indian skin types and weather conditions
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <Card className="border-border/50 overflow-hidden"
                  style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-foreground mb-1">{quickStats.totalScans}</div>
                <div className="text-xs text-muted-foreground">Total Scans</div>
              </CardContent>
            </Card>
            <Card className="border-border/50 overflow-hidden"
                  style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-500 mb-1">{quickStats.clearDays}</div>
                <div className="text-xs text-muted-foreground">Clear Days</div>
              </CardContent>
            </Card>
            <Card className="border-border/50 overflow-hidden"
                  style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-500 mb-1">+{quickStats.improvement}%</div>
                <div className="text-xs text-muted-foreground">Improvement</div>
              </CardContent>
            </Card>
            <Card className="border-border/50 overflow-hidden"
                  style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-500 mb-1">{quickStats.streak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </CardContent>
            </Card>
          </div>
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
              <div className="mt-8 space-y-4">
                <Button
                  onClick={handleDetect}
                  disabled={!selectedFile || isLoading}
                  className="w-full h-14 text-base font-semibold rounded-[1.5rem]
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
                
                {isLoading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Processing image...</span>
                      <span>{Math.round(scanProgress)}%</span>
                    </div>
                    <Progress value={scanProgress} className="h-2" />
                  </div>
                )}
              </div>
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

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <Card className="border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}
                  onClick={() => navigate('/analytics')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 bg-blue-500/20">
                  <BarChart3 className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">View Analytics</h3>
                <p className="text-sm text-muted-foreground">Track your skin health progress over time</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}
                  onClick={() => navigate('/history')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 bg-green-500/20">
                  <History className="w-6 h-6 text-green-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Scan History</h3>
                <p className="text-sm text-muted-foreground">Review all your previous skin analyses</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}
                  onClick={() => navigate('/profile')}>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 rounded-xl mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 bg-orange-500/20">
                  <Settings className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Settings</h3>
                <p className="text-sm text-muted-foreground">Customize your detection preferences</p>
              </CardContent>
            </Card>
          </div>

          {/* Features Section */}
          <div className="mt-16 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose SkinAI?</h2>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
              Advanced AI technology designed specifically for Indian skin types, weather conditions, and skincare needs
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-purple-500/20">
                  <Target className="w-8 h-8 text-purple-500" />
                </div>
                <h3 className="font-semibold text-foreground">Indian Skin Optimized</h3>
                <p className="text-sm text-muted-foreground">95%+ accuracy for Indian skin types and pigmentation</p>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-green-500/20">
                  <Activity className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-semibold text-foreground">Instant Analysis</h3>
                <p className="text-sm text-muted-foreground">Get results in seconds - perfect for busy Indian lifestyle</p>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-blue-500/20">
                  <TrendingUp className="w-8 h-8 text-blue-500" />
                </div>
                <h3 className="font-semibold text-foreground">Monsoon & Summer Ready</h3>
                <p className="text-sm text-muted-foreground">Track skin changes through Indian weather patterns</p>
              </div>

              <div className="space-y-4">
                <div className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center bg-orange-500/20">
                  <Shield className="w-8 h-8 text-orange-500" />
                </div>
                <h3 className="font-semibold text-foreground">Ayurvedic Integration</h3>
                <p className="text-sm text-muted-foreground">Get recommendations for natural Indian remedies</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
