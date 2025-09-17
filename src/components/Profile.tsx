import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Switch } from './ui/switch';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  Edit, 
  MapPin, 
  Calendar, 
  Award, 
  MessageCircle, 
  Heart, 
  Users, 
  Settings, 
  Bell,
  Shield,
  Globe,
  Camera
} from 'lucide-react';


interface UserStats {
  postsCreated: number;
  commentsReceived: number;
  likesReceived: number;
  connectionsCount: number;
  yearsExperience: number;
}

const mockUserStats: UserStats = {
  postsCreated: 47,
  commentsReceived: 234,
  likesReceived: 892,
  connectionsCount: 156,
  yearsExperience: 8,
};

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);
  
  const [userData, setUserData] = useState({
    name: 'Dr. Sarah Johnson',
    title: 'Certified Nurse Midwife',
    location: 'San Francisco, CA',
    joinDate: 'March 2019',
    bio: 'Passionate midwife with 8+ years of experience in women\'s health. Dedicated to providing compassionate, evidence-based care and supporting families through their birthing journey.',
    specialties: ['Water Birth', 'High-Risk Pregnancies', 'Prenatal Education', 'Postpartum Care'],
    certifications: ['CNM', 'BLS', 'NRP', 'ACLS'],
  });

  const handleSaveProfile = () => {
    setIsEditing(false);
    // In a real app, this would save to the backend
  };

  const StatCard = ({ icon: Icon, label, value, color = "text-primary" }: {
    icon: React.ElementType;
    label: string;
    value: number;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-4 text-center">
        <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
        <p className="font-medium text-lg">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-4xl mx-auto pb-24 space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center md:items-start">
              <div className="relative">
                <Avatar className="w-24 h-24">
                  <AvatarImage src="https://images.unsplash.com/photo-1676552055618-22ec8cde399a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBoZWFsdGhjYXJlJTIwd29ya2VyJTIwcG9ydHJhaXR8ZW58MXx8fHwxNzU1ODQ5NjU5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <Button 
                  size="sm" 
                  className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={userData.name} 
                      onChange={(e) => setUserData({...userData, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input 
                      id="title" 
                      value={userData.title} 
                      onChange={(e) => setUserData({...userData, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      value={userData.location} 
                      onChange={(e) => setUserData({...userData, location: e.target.value})}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile}>Save Changes</Button>
                    <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h1>{userData.name}</h1>
                      <p className="text-muted-foreground">{userData.title}</p>
                    </div>
                    <Button variant="outline" onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4" />
                      {userData.location}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      Joined {userData.joinDate}
                    </div>
                  </div>
                  
                  <p className="text-sm mb-4">{userData.bio}</p>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-sm mb-2">Specialties</p>
                      <div className="flex flex-wrap gap-2">
                        {userData.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary">{specialty}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="font-medium text-sm mb-2">Certifications</p>
                      <div className="flex flex-wrap gap-2">
                        {userData.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline" className="gap-1">
                            <Award className="w-3 h-3" />
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div>
        <h2 className="mb-4">Activity Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            icon={MessageCircle} 
            label="Posts Created" 
            value={mockUserStats.postsCreated} 
          />
          <StatCard 
            icon={Heart} 
            label="Likes Received" 
            value={mockUserStats.likesReceived} 
            color="text-red-500"
          />
          <StatCard 
            icon={Users} 
            label="Connections" 
            value={mockUserStats.connectionsCount} 
            color="text-blue-500"
          />
          <StatCard 
            icon={Award} 
            label="Years Experience" 
            value={mockUserStats.yearsExperience} 
            color="text-green-500"
          />
        </div>
      </div>

      {/* Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            <h3>Settings & Preferences</h3>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Receive notifications for messages and mentions</p>
              </div>
            </div>
            <Switch checked={notifications} onCheckedChange={setNotifications} />
          </div>

  

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Public Profile</p>
                <p className="text-sm text-muted-foreground">Allow others to find and view your profile</p>
              </div>
            </div>
            <Switch checked={publicProfile} onCheckedChange={setPublicProfile} />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Language</p>
                <p className="text-sm text-muted-foreground">Choose your preferred language</p>
              </div>
            </div>
            <Button variant="outline" size="sm">English</Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3>Recent Activity</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
              <MessageCircle className="w-5 h-5 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm">Posted "Managing Labor Pain Naturally"</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
              <Heart className="w-5 h-5 text-red-500" />
              <div className="flex-1">
                <p className="text-sm">Received 15 likes on your water birth story</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
              <Users className="w-5 h-5 text-green-500" />
              <div className="flex-1">
                <p className="text-sm">Connected with Dr. Maria Garcia</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}