import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { getStats, getRecentScans, getMonthlyData, refreshStats, ScanResult } from "@/lib/storage";
import { 
  TrendingUp, 
  Camera, 
  CheckCircle, 
  AlertTriangle, 
  Calendar,
  BarChart3,
  Sparkles,
  Activity
} from "lucide-react";

const Dashboard = () => {
  const [stats, setStats] = useState(getStats());
  const [recentScans, setRecentScans] = useState<ScanResult[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);

  useEffect(() => {
    // Refresh stats to ensure they're calculated correctly
    refreshStats();
    setStats(getStats());
    setRecentScans(getRecentScans());
    setMonthlyData(getMonthlyData());
  }, []);

  // Calculate this week's scans
  const thisWeekScans = recentScans.length;
  const clearSkinPercentage = stats.totalScans > 0 ? Math.round((stats.clearDays / stats.totalScans) * 100) : 0;

  const weeklyData = [
    { day: "Mon", scans: 0, issues: 0 },
    { day: "Tue", scans: 0, issues: 0 },
    { day: "Wed", scans: 0, issues: 0 },
    { day: "Thu", scans: 0, issues: 0 },
    { day: "Fri", scans: 0, issues: 0 },
    { day: "Sat", scans: 0, issues: 0 },
    { day: "Sun", scans: 0, issues: 0 },
  ];

  // Populate weekly data based on recent scans (last 7 days only)
  const last7Days = recentScans.filter(scan => {
    const scanDate = new Date(scan.date);
    const daysDiff = Math.floor((Date.now() - scanDate.getTime()) / (1000 * 60 * 60 * 24));
    return daysDiff <= 7;
  });
  
  last7Days.forEach(scan => {
    const dayIndex = new Date(scan.date).getDay();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = dayNames[dayIndex];
    
    const dayData = weeklyData.find(d => d.day === dayName);
    if (dayData) {
      dayData.scans++;
      if (scan.conditions.length > 0) {
        dayData.issues++;
      }
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Track your skin health progress and insights</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/50 overflow-hidden"
                style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Scans</p>
                  <p className="text-3xl font-bold text-foreground">{stats.totalScans}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/20">
                  <Camera className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">+{thisWeekScans} this week</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 overflow-hidden"
                style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Clear Skin Days</p>
                  <p className="text-3xl font-bold text-foreground">{stats.clearDays}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-500/20">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <div className="mt-4">
                <Progress value={clearSkinPercentage} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">{clearSkinPercentage}% success rate</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 overflow-hidden"
                style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Issues Detected</p>
                  <p className="text-3xl font-bold text-foreground">{stats.issuesDetected}</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-500/20">
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <div className="mt-4">
                <Badge variant="secondary" className="text-xs">
                  {stats.issuesDetected > 0 ? "Requires attention" : "All clear"}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 overflow-hidden"
                style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Improvement</p>
                  <p className="text-3xl font-bold text-foreground">+{stats.improvement}%</p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-purple-500/20">
                  <Activity className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">vs last month</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Scans */}
          <Card className="border-border/50 overflow-hidden"
                style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Scans
              </CardTitle>
              <CardDescription>Your latest skin analysis results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentScans.slice(0, 4).map((scan) => (
                  <div key={scan.id} className="flex items-center justify-between p-4 rounded-xl border border-border/30">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        scan.severity === 'Clear' ? 'bg-green-500' : 
                        scan.severity === 'Mild' ? 'bg-yellow-500' : 
                        scan.severity === 'Moderate' ? 'bg-orange-500' : 'bg-red-500'
                      }`} />
                      <div>
                        <p className="font-medium text-foreground">
                          {new Date(scan.date).toLocaleDateString('en-IN', { 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {scan.conditions.length > 0 ? scan.conditions.join(', ') : 'No issues detected'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={scan.severity === 'Clear' ? 'default' : 'destructive'}>
                        {scan.severity}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{scan.confidence}% confidence</p>
                    </div>
                  </div>
                ))}
                {recentScans.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Camera className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No recent scans</p>
                    <p className="text-sm">Start by uploading an image</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Activity */}
          <Card className="border-border/50 overflow-hidden"
                style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Weekly Activity
              </CardTitle>
              <CardDescription>Your scanning activity this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <div key={day.day} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-muted-foreground w-8">{day.day}</span>
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < day.scans ? 'bg-primary' : 'bg-muted'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-foreground">{day.scans} scans</span>
                      {day.issues > 0 && (
                        <span className="text-xs text-destructive ml-2">{day.issues} issues</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8 border-border/50 overflow-hidden"
              style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>Start a new skin analysis or view detailed reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Button className="h-12 px-6 rounded-xl"
                      style={{ background: 'var(--gradient-primary)' }}>
                <Camera className="w-5 h-5 mr-2" />
                New Scan
              </Button>
              <Button variant="outline" className="h-12 px-6 rounded-xl">
                <BarChart3 className="w-5 h-5 mr-2" />
                View Analytics
              </Button>
              <Button variant="outline" className="h-12 px-6 rounded-xl">
                <Calendar className="w-5 h-5 mr-2" />
                Scan History
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
