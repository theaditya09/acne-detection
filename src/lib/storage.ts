// Local storage utilities for scan data
export interface ScanResult {
  id: string;
  date: string;
  time: string;
  conditions: string[];
  severity: 'Clear' | 'Mild' | 'Moderate' | 'Severe';
  confidence: number;
  imageUrl: string;
  notes: string;
  imageName: string;
  imageSize: number;
}

export interface UserStats {
  totalScans: number;
  clearDays: number;
  issuesDetected: number;
  improvement: number;
  streak: number;
  memberSince: string;
}

const STORAGE_KEYS = {
  SCANS: 'skinAI_scans',
  STATS: 'skinAI_stats',
  USER_PREFERENCES: 'skinAI_preferences'
};

// Generate realistic scan data with Indian context
const generateRealisticScans = (): ScanResult[] => {
  const now = new Date();
  const scans: ScanResult[] = [];
  
  // Generate 8-12 scans over the last 30 days (less than 15)
  const numScans = Math.floor(Math.random() * 5) + 8; // 8-12 scans
  const scanDays = new Set<number>();
  
  // Generate random days for scans
  while (scanDays.size < numScans) {
    const randomDay = Math.floor(Math.random() * 30);
    scanDays.add(randomDay);
  }
  
  // Convert to array and sort
  const sortedDays = Array.from(scanDays).sort((a, b) => b - a);
  
  sortedDays.forEach((dayOffset, index) => {
    const scanDate = new Date(now);
    scanDate.setDate(scanDate.getDate() - dayOffset);
    
    const conditions = [
      'Acne', 'Blackheads', 'Whiteheads', 'Cysts', 'Papules', 'Pustules', 'Dark Spots', 'Pigmentation'
    ];
    
    const severities: ScanResult['severity'][] = ['Clear', 'Mild', 'Moderate', 'Severe'];
    // Weight the random selection to favor "Clear" scans (75%+ success rate)
    const severityWeights = [0.4, 0.3, 0.2, 0.1]; // 40% Clear, 30% Mild, 20% Moderate, 10% Severe
    const random = Math.random();
    let cumulativeWeight = 0;
    let severity: ScanResult['severity'] = 'Clear';
    
    for (let i = 0; i < severities.length; i++) {
      cumulativeWeight += severityWeights[i];
      if (random <= cumulativeWeight) {
        severity = severities[i];
        break;
      }
    }
    
    let detectedConditions: string[] = [];
    if (severity !== 'Clear') {
      const numConditions = Math.floor(Math.random() * 3) + 1;
      detectedConditions = conditions
        .sort(() => 0.5 - Math.random())
        .slice(0, numConditions);
    }
    
    const confidence = severity === 'Clear' 
      ? Math.floor(Math.random() * 8) + 92 // 92-99% for clear
      : severity === 'Mild'
      ? Math.floor(Math.random() * 10) + 80 // 80-89% for mild
      : severity === 'Moderate'
      ? Math.floor(Math.random() * 10) + 75 // 75-84% for moderate
      : Math.floor(Math.random() * 8) + 70; // 70-77% for severe
    
    // Indian time format (12-hour with AM/PM)
    const timeOptions = ['8:30 AM', '9:15 AM', '10:45 AM', '2:20 PM', '4:30 PM', '7:45 PM', '9:00 PM'];
    const time = timeOptions[Math.floor(Math.random() * timeOptions.length)];
    
    const notes = generateNotes(severity, detectedConditions);
    
    scans.push({
      id: `scan_${Date.now()}_${index}`,
      date: scanDate.toISOString().split('T')[0],
      time,
      conditions: detectedConditions,
      severity,
      confidence,
      imageUrl: '/placeholder.svg',
      notes,
      imageName: `skin_scan_${scanDate.toISOString().split('T')[0]}.jpg`,
      imageSize: Math.floor(Math.random() * 500) + 200 // 200-700 KB
    });
  });
  
  return scans.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

const generateNotes = (severity: string, conditions: string[]): string => {
  const notes = {
    Clear: [
      "Skin looks healthy and clear today - great skincare routine!",
      "No visible issues detected - skin is glowing",
      "Excellent skin condition - keep up the good work",
      "Skin appears well-maintained with proper care",
      "Clear and healthy skin - perfect for Indian weather",
      "Skin looks fresh and radiant today",
      "No acne or pigmentation issues detected"
    ],
    Mild: [
      "Minor skin concerns detected in T-zone area",
      "Slight breakouts noticed - common in humid weather",
      "Small acne spots - try using neem-based products",
      "Minor skin irritation - consider gentle cleansing",
      "Light pigmentation spots visible",
      "Few blackheads in nose area - normal for oily skin",
      "Minor skin issues - easily manageable"
    ],
    Moderate: [
      "Several skin issues detected - needs attention",
      "Moderate breakouts in multiple areas",
      "Noticeable acne and pigmentation concerns",
      "Multiple conditions identified - consider dermatologist visit",
      "Skin needs proper care routine",
      "Acne and dark spots visible - try Ayurvedic remedies",
      "Moderate skin concerns - consistent treatment needed"
    ],
    Severe: [
      "Significant skin issues detected - consult dermatologist",
      "Multiple severe conditions present - immediate care needed",
      "Serious acne and pigmentation - professional treatment recommended",
      "Severe skin concerns identified - visit skin specialist",
      "Immediate dermatological attention recommended",
      "Multiple skin problems - consider advanced treatment",
      "Severe acne and pigmentation - medical intervention needed"
    ]
  };
  
  const severityNotes = notes[severity as keyof typeof notes];
  return severityNotes[Math.floor(Math.random() * severityNotes.length)];
};

// Initialize with realistic data if no data exists
export const initializeStorage = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.SCANS)) {
    const realisticScans = generateRealisticScans();
    localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(realisticScans));
    
    // Calculate stats after generating scans
    const clearDays = realisticScans.filter(s => s.severity === 'Clear').length;
    const successRate = realisticScans.length > 0 ? Math.round((clearDays / realisticScans.length) * 100) : 0;
    
    // Debug log
    console.log('Generated scans:', realisticScans.length);
    console.log('Clear days:', clearDays);
    console.log('Success rate:', successRate + '%');
    
    const stats: UserStats = {
      totalScans: realisticScans.length,
      clearDays: clearDays,
      issuesDetected: realisticScans.filter(s => s.conditions.length > 0).length,
      improvement: Math.floor(Math.random() * 10) + 15, // 15-25% (higher improvement)
      streak: Math.floor(Math.random() * 5) + 3, // 3-7 days (better streak)
      memberSince: '2023-06-15'
    };
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  } else if (!localStorage.getItem(STORAGE_KEYS.STATS)) {
    // If scans exist but stats don't, calculate from existing scans
    const scans = getScans();
    const clearDays = scans.filter(s => s.severity === 'Clear').length;
    const successRate = scans.length > 0 ? Math.round((clearDays / scans.length) * 100) : 0;
    
    const stats: UserStats = {
      totalScans: scans.length,
      clearDays: clearDays,
      issuesDetected: scans.filter(s => s.conditions.length > 0).length,
      improvement: Math.floor(Math.random() * 10) + 15, // 15-25% (higher improvement)
      streak: Math.floor(Math.random() * 5) + 3, // 3-7 days (better streak)
      memberSince: '2023-06-15'
    };
    localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
  }
};

// Scan management functions
export const getScans = (): ScanResult[] => {
  const scans = localStorage.getItem(STORAGE_KEYS.SCANS);
  return scans ? JSON.parse(scans) : [];
};

export const addScan = (scan: Omit<ScanResult, 'id'>): void => {
  const scans = getScans();
  const newScan: ScanResult = {
    ...scan,
    id: `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };
  
  scans.unshift(newScan); // Add to beginning
  localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(scans));
  
  // Update stats
  updateStats();
};

export const deleteScan = (id: string): void => {
  const scans = getScans();
  const filteredScans = scans.filter(scan => scan.id !== id);
  localStorage.setItem(STORAGE_KEYS.SCANS, JSON.stringify(filteredScans));
  updateStats();
};

export const getStats = (): UserStats => {
  const stats = localStorage.getItem(STORAGE_KEYS.STATS);
  return stats ? JSON.parse(stats) : {
    totalScans: 0,
    clearDays: 0,
    issuesDetected: 0,
    improvement: 0,
    streak: 0,
    memberSince: new Date().toISOString().split('T')[0]
  };
};

const updateStats = (): void => {
  const scans = getScans();
  const clearDays = scans.filter(s => s.severity === 'Clear').length;
  const successRate = scans.length > 0 ? Math.round((clearDays / scans.length) * 100) : 0;
  
  const stats: UserStats = {
    totalScans: scans.length,
    clearDays: clearDays,
    issuesDetected: scans.filter(s => s.conditions.length > 0).length,
    improvement: Math.floor(Math.random() * 10) + 15, // 15-25% (higher improvement)
    streak: calculateStreak(scans),
    memberSince: '2023-06-15'
  };
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
};

// Force refresh stats to ensure they're calculated correctly
export const refreshStats = (): void => {
  updateStats();
};

// Debug function to clear and regenerate data
export const resetData = (): void => {
  localStorage.removeItem(STORAGE_KEYS.SCANS);
  localStorage.removeItem(STORAGE_KEYS.STATS);
  initializeStorage();
};

const calculateStreak = (scans: ScanResult[]): number => {
  if (scans.length === 0) return 0;
  
  const today = new Date();
  let streak = 0;
  
  for (let i = 0; i < 30; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateStr = checkDate.toISOString().split('T')[0];
    
    if (scans.some(scan => scan.date === dateStr)) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

// Get recent scans (last 7 days)
export const getRecentScans = (): ScanResult[] => {
  const scans = getScans();
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  
  return scans.filter(scan => new Date(scan.date) >= sevenDaysAgo);
};

// Get scans by severity
export const getScansBySeverity = (severity: string): ScanResult[] => {
  const scans = getScans();
  return severity === 'all' ? scans : scans.filter(scan => scan.severity.toLowerCase() === severity);
};

// Get monthly data for analytics
export const getMonthlyData = () => {
  const scans = getScans();
  const monthlyData: { [key: string]: { scans: number; clear: number; issues: number } } = {};
  
  scans.forEach(scan => {
    const month = scan.date.substring(0, 7); // YYYY-MM
    if (!monthlyData[month]) {
      monthlyData[month] = { scans: 0, clear: 0, issues: 0 };
    }
    
    monthlyData[month].scans++;
    if (scan.severity === 'Clear') {
      monthlyData[month].clear++;
    } else {
      monthlyData[month].issues++;
    }
  });
  
  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6) // Last 6 months
    .map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleDateString('en-IN', { month: 'short' }),
      ...data
    }));
};
