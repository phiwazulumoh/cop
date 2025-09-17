import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send } from 'lucide-react';
import { Badge } from './ui/badge';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  text: string;
  time: string;
  isOwn: boolean;
}

const mockConversations: Conversation[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    avatar: '',
    lastMessage: 'Thanks for the advice about the breech presentation!',
    time: '2 min',
    unread: 2,
    isOnline: true,
  },
  {
    id: '2',
    name: 'Maria Garcia',
    avatar: '',
    lastMessage: 'The water birth went perfectly',
    time: '1 hour',
    unread: 0,
    isOnline: false,
  },
  {
    id: '3',
    name: 'Dr. Emily Chen',
    avatar: '',
    lastMessage: 'Can you review this care plan?',
    time: '3 hours',
    unread: 1,
    isOnline: true,
  },
  {
    id: '4',
    name: 'Linda Martinez',
    avatar: '',
    lastMessage: 'Great presentation yesterday!',
    time: '1 day',
    unread: 0,
    isOnline: false,
  },
  {
    id: '5',
    name: 'Dr. Kate Wilson',
    avatar: '',
    lastMessage: 'See you at the conference',
    time: '2 days',
    unread: 0,
    isOnline: true,
  },
];

const mockMessages: { [key: string]: Message[] } = {
  '1': [
    { id: '1', text: 'Hi! I had a question about handling breech presentations', time: '10:30 AM', isOwn: false },
    { id: '2', text: 'Of course! What specific aspect would you like to discuss?', time: '10:32 AM', isOwn: true },
    { id: '3', text: 'The external cephalic version technique - any tips?', time: '10:35 AM', isOwn: false },
    { id: '4', text: 'Great question! I always ensure the mother is relaxed first. Music and breathing exercises help a lot.', time: '10:37 AM', isOwn: true },
    { id: '5', text: 'Also, the timing is crucial. I usually attempt it around 36-37 weeks.', time: '10:38 AM', isOwn: true },
    { id: '6', text: 'Thanks for the advice about the breech presentation!', time: '10:40 AM', isOwn: false },
  ],
  '2': [
    { id: '1', text: 'How did the water birth go today?', time: '9:00 AM', isOwn: true },
    { id: '2', text: 'The water birth went perfectly', time: '9:30 AM', isOwn: false },
  ],
  '3': [
    { id: '1', text: 'Can you review this care plan?', time: '8:00 AM', isOwn: false },
    { id: '2', text: 'Of course! Send it over', time: '8:05 AM', isOwn: true },
  ],
};

export function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<string>('1'); // Default to first conversation
  const [newMessage, setNewMessage] = useState('');
  const [conversations] = useState(mockConversations);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const conversation = conversations.find(c => c.id === selectedConversation);
  const messages = mockMessages[selectedConversation] || [];

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="text-center mb-8">
        <h1 className="mb-2">Direct Messages</h1>
        <p className="text-muted-foreground">Connect with fellow midwives</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
        {/* Conversations Sidebar */}
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <h3>Conversations</h3>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`flex items-center gap-3 p-4 border-b last:border-b-0 hover:bg-accent cursor-pointer transition-colors ${
                    selectedConversation === conv.id ? 'bg-accent' : ''
                  }`}
                  onClick={() => setSelectedConversation(conv.id)}
                >
                  <div className="relative">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={conv.avatar} />
                      <AvatarFallback>{conv.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    {conv.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium truncate">{conv.name}</p>
                      <span className="text-sm text-muted-foreground">{conv.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                  </div>
                  {conv.unread > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {conv.unread}
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={conversation?.avatar} />
                  <AvatarFallback>{conversation?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{conversation?.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {conversation?.isOnline ? 'Online' : 'Offline'}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                      message.isOwn
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs opacity-70 mt-1">{message.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}