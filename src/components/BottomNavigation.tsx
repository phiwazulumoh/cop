
import { MessageSquare, Users, Bot, Video,  User } from 'lucide-react';
import { Button } from './ui/button';

interface BottomNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function BottomNavigation({ activeTab, setActiveTab }: BottomNavigationProps) {
  const navItems = [
    { id: 'forum', icon: MessageSquare, label: 'Forum' },
    { id: 'messages', icon: Users, label: 'Messages' },
    { id: 'chatbot', icon: Bot, label: 'Chatbot' },
    { id: 'media', icon: Video, label: 'Media Library' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-card border border-border rounded-full px-6 py-3 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activeTab === item.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center gap-1 h-auto py-2 px-3 rounded-full"
            >
              <item.icon className="w-4 h-4" />
              <span className="text-xs">{item.label}</span>
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}