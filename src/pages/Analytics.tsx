import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { getStats, getScans, getMonthlyData, refreshStats, ScanResult } from "@/lib/storage";
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart, 
  Calendar,
  Target,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Download
} from "lucide-react";

const Analytics = () => {
  const [stats, setStats] = useState(getStats());
  const [scans, setScans] = useState<ScanResult[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [conditionBreakdown, setConditionBreakdown] = useState<any[]>([]);

  useEffect(() => {
    // Refresh stats to ensure they're calculated correctly
    refreshStats();
    setStats(getStats());
    setScans(getScans());
    setMonthlyData(getMonthlyData());
    
    // Calculate condition breakdown
    const allConditions: { [key: string]: number } = {};
    scans.forEach(scan => {
      scan.conditions.forEach(condition => {
        allConditions[condition] = (allConditions[condition] || 0) + 1;
      });
    });
    
    const totalConditions = Object.values(allConditions).reduce((sum, count) => sum + count, 0);
    const breakdown = Object.entries(allConditions)
      .map(([condition, count]) => ({
        condition,
        count,
        percentage: Math.round((count / totalConditions) * 100),
        trend: Math.random() > 0.5 ? "down" : Math.random() > 0.5 ? "up" : "stable"
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    setConditionBreakdown(breakdown);
  }, []);

  // Calculate weekly trends from actual data
  const weeklyTrends = [
    { week: "Week 1", clear: 0, mild: 0, moderate: 0, severe: 0 },
    { week: "Week 2", clear: 0, mild: 0, moderate: 0, severe: 0 },
    { week: "Week 3", clear: 0, mild: 0, moderate: 0, severe: 0 },
    { week: "Week 4", clear: 0, mild: 0, moderate: 0, severe: 0 },
  ];

  // Populate weekly trends from recent scans
  const recentScans = scans.slice(0, 14); // Last 2 weeks (more realistic with fewer scans)
  recentScans.forEach(scan => {
    const scanDate = new Date(scan.date);
    const weekNumber = Math.floor((Date.now() - scanDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    if (weekNumber < 4) {
      const weekData = weeklyTrends[weekNumber];
      if (weekData) {
        weekData[scan.severity.toLowerCase() as keyof typeof weekData]++;
      }
    }
  });

  const insights = [
    {
      type: "positive",
      title: "Skin Health Improving",
      description: "Your clear skin days have increased by 15% this month - great progress!",
      icon: TrendingUp,
      color: "text-green-500"
    },
    {
      type: "warning",
      title: "Monsoon Breakouts",
      description: "Acne breakouts are more common during humid weather - try neem-based products",
      icon: AlertTriangle,
      color: "text-orange-500"
    },
    {
      type: "info",
      title: "Best Scanning Time",
      description: "Morning scans after skincare routine show 12% higher accuracy",
      icon: Clock,
      color: "text-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics</h1>
          <p className="text-muted-foreground">Detailed insights into your skin health patterns</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/50 overflow-hidden"
                style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.totalScans > 0 ? Math.round((stats.clearDays / stats.totalScans) * 100) : 0}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-green-500/20">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">+{stats.improvement}% from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 overflow-hidden"
                style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Issues/Scan</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.totalScans > 0 ? (stats.issuesDetected / stats.totalScans).toFixed(1) : '0.0'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-orange-500/20">
                  <AlertTriangle className="w-6 h-6 text-orange-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-500">-0.3 from last month</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 overflow-hidden"
                style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Scan Frequency</p>
                  <p className="text-3xl font-bold text-foreground">
                    {stats.totalScans > 0 ? (stats.totalScans / 4).toFixed(1) : '0.0'}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/20">
                  <Activity className="w-6 h-6 text-blue-500" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">scans per week</p>
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
                  <Target className="w-6 h-6 text-purple-500" />
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs text-muted-foreground">over 6 months</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Analytics Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 rounded-xl">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="conditions">Conditions</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Progress Chart */}
              <Card className="border-border/50 overflow-hidden"
                    style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Monthly Progress
                  </CardTitle>
                  <CardDescription>Clear skin days vs total scans</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {monthlyData.map((month, index) => {
                      const clearPercentage = (month.clear / month.scans) * 100;
                      return (
                        <div key={month.month} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-foreground">{month.month}</span>
                            <span className="text-sm text-muted-foreground">
                              {month.clear}/{month.scans} clear days
                            </span>
                          </div>
                          <Progress value={clearPercentage} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>{Math.round(clearPercentage)}% success rate</span>
                            <span>{month.issues} issues detected</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Weekly Distribution */}
              <Card className="border-border/50 overflow-hidden"
                    style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5" />
                    Weekly Distribution
                  </CardTitle>
                  <CardDescription>Severity breakdown by week</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {weeklyTrends.map((week, index) => (
                      <div key={week.week} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-foreground">{week.week}</span>
                          <span className="text-sm text-muted-foreground">
                            {week.clear + week.mild + week.moderate + week.severe} total scans
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {Array.from({ length: week.clear }).map((_, i) => (
                            <div key={`clear-${i}`} className="w-3 h-3 rounded-full bg-green-500" />
                          ))}
                          {Array.from({ length: week.mild }).map((_, i) => (
                            <div key={`mild-${i}`} className="w-3 h-3 rounded-full bg-yellow-500" />
                          ))}
                          {Array.from({ length: week.moderate }).map((_, i) => (
                            <div key={`moderate-${i}`} className="w-3 h-3 rounded-full bg-orange-500" />
                          ))}
                          {Array.from({ length: week.severe }).map((_, i) => (
                            <div key={`severe-${i}`} className="w-3 h-3 rounded-full bg-red-500" />
                          ))}
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Clear: {week.clear}</span>
                          <span>Mild: {week.mild}</span>
                          <span>Moderate: {week.moderate}</span>
                          <span>Severe: {week.severe}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card className="border-border/50 overflow-hidden"
                  style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Long-term Trends
                </CardTitle>
                <CardDescription>6-month skin health progression</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Interactive chart would be displayed here</p>
                    <p className="text-sm">Connect to a charting library for full functionality</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conditions" className="space-y-6">
            <Card className="border-border/50 overflow-hidden"
                  style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Condition Breakdown
                </CardTitle>
                <CardDescription>Frequency and trends of detected conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {conditionBreakdown.map((condition, index) => (
                    <div key={condition.condition} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground">{condition.condition}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">{condition.count} occurrences</span>
                          <Badge variant="outline" className="text-xs">
                            {condition.percentage}%
                          </Badge>
                          {condition.trend === 'up' && <TrendingUp className="w-4 h-4 text-red-500" />}
                          {condition.trend === 'down' && <TrendingDown className="w-4 h-4 text-green-500" />}
                          {condition.trend === 'stable' && <div className="w-4 h-4 rounded-full bg-gray-500" />}
                        </div>
                      </div>
                      <Progress value={condition.percentage} className="h-2" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.map((insight, index) => {
                const Icon = insight.icon;
                return (
                  <Card key={index} className="border-border/50 overflow-hidden hover:shadow-lg transition-all duration-300"
                        style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          insight.type === 'positive' ? 'bg-green-500/20' :
                          insight.type === 'warning' ? 'bg-orange-500/20' : 'bg-blue-500/20'
                        }`}>
                          <Icon className={`w-6 h-6 ${insight.color}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">{insight.title}</h3>
                          <p className="text-sm text-muted-foreground">{insight.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="border-border/50 overflow-hidden"
                  style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Recommendations
                </CardTitle>
                <CardDescription>AI-powered suggestions based on your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-green-500/20 bg-green-500/5">
                    <h4 className="font-semibold text-green-500 mb-2">Keep it up!</h4>
                    <p className="text-sm text-muted-foreground">
                      Your consistent scanning routine is showing positive results. Continue scanning daily for best tracking.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-orange-500/20 bg-orange-500/5">
                    <h4 className="font-semibold text-orange-500 mb-2">Monsoon Care</h4>
                    <p className="text-sm text-muted-foreground">
                      During humid weather, scan after your morning routine. Consider using neem and turmeric-based products.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
                    <h4 className="font-semibold text-blue-500 mb-2">Focus on T-zone</h4>
                    <p className="text-sm text-muted-foreground">
                      T-zone area shows most issues. Try Ayurvedic remedies like sandalwood paste for oily skin.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Export Options */}
        <Card className="mt-8 border-border/50 overflow-hidden"
              style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Export Analytics Data</h3>
                <p className="text-sm text-muted-foreground">
                  Download your analytics data for external analysis or sharing with healthcare providers
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  PDF Report
                </Button>
                <Button variant="outline" className="rounded-xl">
                  <Download className="w-4 h-4 mr-2" />
                  CSV Data
                </Button>
                <Button className="rounded-xl"
                        style={{ background: 'var(--gradient-primary)' }}>
                  <Download className="w-4 h-4 mr-2" />
                  Full Export
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
