import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Camera,
  Edit,
  Save,
  X,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Activity,
  Download,
  Trash2
} from "lucide-react";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Aditya",
    email: "aditya@gmail.com",
    phone: "+91 98765 43210",
    birthday: "2005-03-15",
    location: "Mumbai, Maharashtra",
    bio: "Passionate about skincare and maintaining healthy skin through technology. Love trying new Ayurvedic remedies!",
    avatar: "/placeholder.svg"
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: true,
      weekly: false,
      monthly: true
    },
    privacy: {
      dataSharing: false,
      analytics: true,
      publicProfile: false
    },
    scanning: {
      autoSave: true,
      highQuality: true,
      reminders: true
    }
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  const stats = {
    totalScans: 156,
    memberSince: "2023-06-15",
    streak: 12,
    achievements: 8
  };

  const achievements = [
    { name: "First Scan", description: "Completed your first skin analysis", earned: "2023-06-15", icon: Camera },
    { name: "Week Warrior", description: "Scanned for 7 consecutive days", earned: "2023-07-22", icon: Activity },
    { name: "Clear Skin", description: "Achieved 30 clear skin days", earned: "2023-09-10", icon: Shield },
    { name: "Data Analyst", description: "Exported your first analytics report", earned: "2023-11-05", icon: Download },
    { name: "Ayurvedic Explorer", description: "Tried 5 different natural remedies", earned: "2023-12-01", icon: Shield },
    { name: "Monsoon Master", description: "Maintained skin health during monsoon", earned: "2023-08-15", icon: Activity },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Profile</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Overview */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/50 overflow-hidden"
                  style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
              <CardContent className="p-6 text-center">
                <div className="relative inline-block mb-4">
                  <Avatar className="w-24 h-24 mx-auto">
                    <AvatarImage src={profileData.avatar} alt="Profile" />
                    <AvatarFallback className="text-2xl font-bold">
                      {profileData.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                    style={{ background: 'var(--gradient-primary)' }}
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>
                <h2 className="text-2xl font-bold text-foreground mb-2">{profileData.name}</h2>
                <p className="text-muted-foreground mb-4">{profileData.bio}</p>
                <div className="flex justify-center gap-2">
                  <Badge variant="outline">Premium Member</Badge>
                  <Badge variant="secondary">Verified</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border/50 overflow-hidden"
                  style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Scans</span>
                  <span className="font-semibold text-foreground">{stats.totalScans}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Streak</span>
                  <span className="font-semibold text-foreground">{stats.streak} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Member Since</span>
                  <span className="font-semibold text-foreground">
                    {new Date(stats.memberSince).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Achievements</span>
                  <span className="font-semibold text-foreground">{stats.achievements}</span>
                </div>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-border/50 overflow-hidden"
                  style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
              <CardHeader>
                <CardTitle className="text-lg">Recent Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {achievements.slice(0, 3).map((achievement, index) => {
                    const Icon = achievement.icon;
                    return (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-muted/30">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                             style={{ background: 'var(--gradient-primary)' }}>
                          <Icon className="w-5 h-5 text-primary-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-foreground text-sm">{achievement.name}</h4>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Earned {new Date(achievement.earned).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="personal" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 rounded-xl">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="privacy">Privacy</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <Card className="border-border/50 overflow-hidden"
                      style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <User className="w-5 h-5" />
                          Personal Information
                        </CardTitle>
                        <CardDescription>Update your personal details</CardDescription>
                      </div>
                      {!isEditing ? (
                        <Button onClick={() => setIsEditing(true)} variant="outline" className="rounded-xl">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button onClick={handleSave} className="rounded-xl"
                                  style={{ background: 'var(--gradient-primary)' }}>
                            <Save className="w-4 h-4 mr-2" />
                            Save
                          </Button>
                          <Button onClick={handleCancel} variant="outline" className="rounded-xl">
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                          disabled={!isEditing}
                          className="rounded-xl"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            disabled={!isEditing}
                            className="pl-10 rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                            disabled={!isEditing}
                            className="pl-10 rounded-xl"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthday">Birthday</Label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                          <Input
                            id="birthday"
                            type="date"
                            value={profileData.birthday}
                            onChange={(e) => setProfileData({...profileData, birthday: e.target.value})}
                            disabled={!isEditing}
                            className="pl-10 rounded-xl"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                          disabled={!isEditing}
                          className="pl-10 rounded-xl"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        disabled={!isEditing}
                        className="w-full min-h-[100px] px-3 py-2 border border-input rounded-xl bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notifications" className="space-y-6">
                <Card className="border-border/50 overflow-hidden"
                      style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bell className="w-5 h-5" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>Choose how you want to be notified</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">Receive updates via email</p>
                        </div>
                        <Switch
                          checked={preferences.notifications.email}
                          onCheckedChange={(checked) => 
                            setPreferences({
                              ...preferences,
                              notifications: {...preferences.notifications, email: checked}
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">Push Notifications</h4>
                          <p className="text-sm text-muted-foreground">Get notified on your device</p>
                        </div>
                        <Switch
                          checked={preferences.notifications.push}
                          onCheckedChange={(checked) => 
                            setPreferences({
                              ...preferences,
                              notifications: {...preferences.notifications, push: checked}
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">Weekly Reports</h4>
                          <p className="text-sm text-muted-foreground">Receive weekly skin health summaries</p>
                        </div>
                        <Switch
                          checked={preferences.notifications.weekly}
                          onCheckedChange={(checked) => 
                            setPreferences({
                              ...preferences,
                              notifications: {...preferences.notifications, weekly: checked}
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">Monthly Insights</h4>
                          <p className="text-sm text-muted-foreground">Get monthly analytics and trends</p>
                        </div>
                        <Switch
                          checked={preferences.notifications.monthly}
                          onCheckedChange={(checked) => 
                            setPreferences({
                              ...preferences,
                              notifications: {...preferences.notifications, monthly: checked}
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="privacy" className="space-y-6">
                <Card className="border-border/50 overflow-hidden"
                      style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Privacy Settings
                    </CardTitle>
                    <CardDescription>Control your data and privacy</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">Data Sharing</h4>
                          <p className="text-sm text-muted-foreground">Allow anonymized data for research</p>
                        </div>
                        <Switch
                          checked={preferences.privacy.dataSharing}
                          onCheckedChange={(checked) => 
                            setPreferences({
                              ...preferences,
                              privacy: {...preferences.privacy, dataSharing: checked}
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">Analytics</h4>
                          <p className="text-sm text-muted-foreground">Help improve the app with usage analytics</p>
                        </div>
                        <Switch
                          checked={preferences.privacy.analytics}
                          onCheckedChange={(checked) => 
                            setPreferences({
                              ...preferences,
                              privacy: {...preferences.privacy, analytics: checked}
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">Public Profile</h4>
                          <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                        </div>
                        <Switch
                          checked={preferences.privacy.publicProfile}
                          onCheckedChange={(checked) => 
                            setPreferences({
                              ...preferences,
                              privacy: {...preferences.privacy, publicProfile: checked}
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="space-y-6">
                <Card className="border-border/50 overflow-hidden"
                      style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5" />
                      Account Settings
                    </CardTitle>
                    <CardDescription>Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">Auto-save Scans</h4>
                          <p className="text-sm text-muted-foreground">Automatically save scan results</p>
                        </div>
                        <Switch
                          checked={preferences.scanning.autoSave}
                          onCheckedChange={(checked) => 
                            setPreferences({
                              ...preferences,
                              scanning: {...preferences.scanning, autoSave: checked}
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">High Quality Scans</h4>
                          <p className="text-sm text-muted-foreground">Use higher resolution for better accuracy</p>
                        </div>
                        <Switch
                          checked={preferences.scanning.highQuality}
                          onCheckedChange={(checked) => 
                            setPreferences({
                              ...preferences,
                              scanning: {...preferences.scanning, highQuality: checked}
                            })
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-foreground">Scan Reminders</h4>
                          <p className="text-sm text-muted-foreground">Get reminded to scan regularly</p>
                        </div>
                        <Switch
                          checked={preferences.scanning.reminders}
                          onCheckedChange={(checked) => 
                            setPreferences({
                              ...preferences,
                              scanning: {...preferences.scanning, reminders: checked}
                            })
                          }
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50 overflow-hidden border-destructive/20"
                      style={{ background: 'var(--gradient-glass)', backdropFilter: 'var(--blur-glass)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <Trash2 className="w-5 h-5" />
                      Danger Zone
                    </CardTitle>
                    <CardDescription>Irreversible actions</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-foreground">Delete Account</h4>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="destructive" className="rounded-xl">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
