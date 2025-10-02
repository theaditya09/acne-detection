import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getScans, getScansBySeverity, deleteScan, ScanResult } from "@/lib/storage";
import { 
  Search, 
  Filter, 
  Calendar, 
  Camera, 
  AlertTriangle, 
  CheckCircle,
  Download,
  Eye,
  Trash2,
  Clock
} from "lucide-react";

const History = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [scanHistory, setScanHistory] = useState<ScanResult[]>([]);

  useEffect(() => {
    setScanHistory(getScans());
  }, []);

  const handleDeleteScan = (id: string) => {
    deleteScan(id);
    setScanHistory(getScans());
  };

  const filteredHistory = scanHistory.filter(scan => {
    const matchesSearch = scan.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         scan.conditions.some(condition => 
                           condition.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    const matchesSeverity = filterSeverity === "all" || scan.severity.toLowerCase() === filterSeverity;
    return matchesSearch && matchesSeverity;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'clear': return 'bg-green-500';
      case 'mild': return 'bg-yellow-500';
      case 'moderate': return 'bg-orange-500';
      case 'severe': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'clear': return CheckCircle;
      case 'mild':
      case 'moderate':
      case 'severe': return AlertTriangle;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Scan History</h1>
          <p className="text-muted-foreground">View and manage your skin analysis history</p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-border/50 overflow-hidden"
              style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search scans by condition or notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 rounded-xl"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                  <SelectTrigger className="w-40 rounded-xl">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Severity</SelectItem>
                    <SelectItem value="clear">Clear</SelectItem>
                    <SelectItem value="mild">Mild</SelectItem>
                    <SelectItem value="moderate">Moderate</SelectItem>
                    <SelectItem value="severe">Severe</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" className="rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/50 overflow-hidden"
                style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-foreground mb-2">{scanHistory.length}</div>
              <div className="text-sm text-muted-foreground">Total Scans</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 overflow-hidden"
                style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">
                {scanHistory.filter(s => s.severity === 'Clear').length}
              </div>
              <div className="text-sm text-muted-foreground">Clear Days</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 overflow-hidden"
                style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-500 mb-2">
                {scanHistory.filter(s => s.severity === 'Moderate' || s.severity === 'Severe').length}
              </div>
              <div className="text-sm text-muted-foreground">Issues Detected</div>
            </CardContent>
          </Card>
          <Card className="border-border/50 overflow-hidden"
                style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-foreground mb-2">
                {Math.round(scanHistory.reduce((acc, scan) => acc + scan.confidence, 0) / scanHistory.length)}%
              </div>
              <div className="text-sm text-muted-foreground">Avg Confidence</div>
            </CardContent>
          </Card>
        </div>

        {/* Scan History List */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 rounded-xl">
            <TabsTrigger value="all">All Scans</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="issues">With Issues</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {filteredHistory.map((scan) => {
              const SeverityIcon = getSeverityIcon(scan.severity);
              return (
                <Card key={scan.id} className="border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300"
                      style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      {/* Image Preview */}
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                        <Camera className="w-8 h-8 text-muted-foreground" />
                      </div>

                      {/* Scan Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getSeverityColor(scan.severity)}`} />
                          <h3 className="font-semibold text-foreground">
                            {new Date(scan.date).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </h3>
                          <span className="text-sm text-muted-foreground">{scan.time}</span>
                          <Badge variant={scan.severity === 'Clear' ? 'default' : 'destructive'}>
                            {scan.severity}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <SeverityIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {scan.conditions.length > 0 ? scan.conditions.join(', ') : 'No issues detected'}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {scan.confidence}% confidence
                          </span>
                        </div>

                        {scan.notes && (
                          <p className="text-sm text-muted-foreground mb-3">{scan.notes}</p>
                        )}

                        <div className="flex items-center gap-2">
                          <Button size="sm" variant="outline" className="rounded-lg">
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm" variant="outline" className="rounded-lg">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                          <Button size="sm" variant="ghost" className="rounded-lg text-destructive hover:text-destructive">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {filteredHistory.slice(0, 3).map((scan) => {
              const SeverityIcon = getSeverityIcon(scan.severity);
              return (
                <Card key={scan.id} className="border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300"
                      style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                        <Camera className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getSeverityColor(scan.severity)}`} />
                          <h3 className="font-semibold text-foreground">
                            {new Date(scan.date).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </h3>
                          <span className="text-sm text-muted-foreground">{scan.time}</span>
                          <Badge variant={scan.severity === 'Clear' ? 'default' : 'destructive'}>
                            {scan.severity}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <SeverityIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {scan.conditions.length > 0 ? scan.conditions.join(', ') : 'No issues detected'}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {scan.confidence}% confidence
                          </span>
                        </div>
                        {scan.notes && (
                          <p className="text-sm text-muted-foreground mb-3">{scan.notes}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            {filteredHistory.filter(scan => scan.conditions.length > 0).map((scan) => {
              const SeverityIcon = getSeverityIcon(scan.severity);
              return (
                <Card key={scan.id} className="border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300"
                      style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                        <Camera className="w-8 h-8 text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`w-3 h-3 rounded-full ${getSeverityColor(scan.severity)}`} />
                          <h3 className="font-semibold text-foreground">
                            {new Date(scan.date).toLocaleDateString('en-IN', { 
                              day: 'numeric', 
                              month: 'short', 
                              year: 'numeric' 
                            })}
                          </h3>
                          <span className="text-sm text-muted-foreground">{scan.time}</span>
                          <Badge variant="destructive">
                            {scan.severity}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <SeverityIcon className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">
                              {scan.conditions.join(', ')}
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {scan.confidence}% confidence
                          </span>
                        </div>
                        {scan.notes && (
                          <p className="text-sm text-muted-foreground mb-3">{scan.notes}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default History;
