import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send } from 'lucide-react';
import { Badge } from './ui/badge';
import { database, auth } from '../utils/firebase';
import { ref, onChildAdded, off } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getMessages, sendMessage, markMessageAsRead, getUnreadMessages, createChatRoom, getAllUsers, type ChatMessage, type User } from '../services/chatService';
import { format } from 'date-fns';

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  isOnline: boolean;
  userId: string;
}

export function Messages() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUserId, setCurrentUserId] = useState<string>('');
  const [showUserList, setShowUserList] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setCurrentUserId(userData.uid);
      console.log('🔍 Current user ID from localStorage:', userData.uid);
    } else {
      console.warn('⚠️ No user found in localStorage');
      setAuthError('Please log in to use Messages');
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      if (!currentUserId) {
        console.warn('⚠️ Skipping data load: no currentUserId');
        return;
      }

      try {
        const usersResponse = await getAllUsers();
        if ((usersResponse.status === 1 || usersResponse.status === 'SUCCESS') && usersResponse.data) {
          console.log('📊 Loaded all users:', usersResponse.data.length);
          setAllUsers(usersResponse.data);
          
          const userConversations: Conversation[] = usersResponse.data
            .filter(user => user.uid !== currentUserId) // Exclude current user
            .map(user => ({
              id: `potential_${user.uid}`,
              name: user.displayName || user.email.split('@')[0] || `User ${user.uid.substring(0, 8)}`,
              avatar: user.photoURL || '',
              lastMessage: 'Start a conversation',
              time: 'Available',
              unread: 0,
              isOnline: false,
              userId: user.uid,
            }));

          const unreadResponse = await getUnreadMessages();
          if ((unreadResponse.status === 1 || unreadResponse.status === 'SUCCESS') && unreadResponse.data) {
            const messageGroups = unreadResponse.data.reduce((acc, msg) => {
              const otherUserId = msg.senderId === currentUserId ? msg.receiverId : msg.senderId;
              if (!acc[otherUserId]) {
                acc[otherUserId] = [];
              }
              acc[otherUserId].push(msg);
              return acc;
            }, {} as { [key: string]: ChatMessage[] });

            const activeConversations: Conversation[] = [];
            for (const userId in messageGroups) {
              const messages = messageGroups[userId];
              const lastMessage = messages[messages.length - 1];
              const user = usersResponse.data.find(u => u.uid === userId);
              
              activeConversations.push({
                id: lastMessage.roomId,
                name: user?.displayName || user?.email.split('@')[0] || `User ${userId.substring(0, 8)}`,
                avatar: user?.photoURL || '',
                lastMessage: lastMessage.content,
                time: format(new Date(lastMessage.sentAt), 'p'),
                unread: messages.filter(m => !m.isRead && m.receiverId === currentUserId).length,
                isOnline: false,
                userId,
              });
            }

            const mergedConversations = [
              ...activeConversations,
              ...userConversations.filter(conv => !activeConversations.some(ac => ac.userId === conv.userId))
            ];
            
            setConversations(mergedConversations);
            if (mergedConversations.length > 0 && !selectedConversation) {
              setSelectedConversation(mergedConversations[0].id);
            }
          } else {
            setConversations(userConversations);
            if (userConversations.length > 0 && !selectedConversation) {
              setSelectedConversation(userConversations[0].id);
            }
          }
        } else {
          console.warn('⚠️ No users or invalid response:', usersResponse);
        }
      } catch (error: any) {
        console.error('💥 Error loading data:', error.message, error.stack);
        alert(`Failed to load users or conversations: ${error.message}`);
      }
    };

    loadData();
  }, [currentUserId]);

  useEffect(() => {
    if (!selectedConversation || !currentUserId) {
      console.warn('⚠️ Skipping listener setup: no conversation or user ID');
      return;
    }

    if (!database || !auth) {
      console.error('💥 Firebase database or auth not initialized');
      setAuthError('Firebase initialization failed. Please try again later.');
      return;
    }

    const authInstance = auth;
    let unsubscribeAuth: () => void;

    const checkAuth = new Promise<void>((resolve, reject) => {
      console.log('🔍 Checking authentication state...');
      unsubscribeAuth = onAuthStateChanged(authInstance, (user) => {
        if (user && user.uid === currentUserId) {
          console.log('✅ User authenticated:', user.uid);
          setAuthError(null);
          resolve();
        } else {
          console.error('🚫 User not authenticated or UID mismatch. Expected:', currentUserId);
          setAuthError('Please log in to use Messages');
          reject(new Error('User not authenticated or UID mismatch'));
        }
      }, (error) => {
        console.error('💥 Auth state error:', error.message,  error.stack);
        setAuthError('Authentication error: ' + error.message);
        reject(error);
      });
    });

    let listenerSet = false;
    const setupListener = async () => {
      try {
        await checkAuth;
        console.log('🔥 Setting up real-time listener for room:', selectedConversation);

        const messagesRef = ref(database, `chatRooms/${selectedConversation}/messages`);

        const loadMessages = async () => {
          if (selectedConversation.startsWith('potential_')) {
            console.log('ℹ️ Skipping message load for potential chat');
            return;
          }
          try {
            const response = await getMessages(selectedConversation);
            if ((response.status === 1 || response.status === 'SUCCESS') && response.data) {
              setMessages(response.data);
              console.log('✅ Loaded initial messages:', response.data.length);
            } else {
              console.warn('⚠️ No messages or invalid response:', response);
            }
          } catch (error: any) {
            console.error('💥 Error loading initial messages:', error.message, error.stack);
          }
        };

        await loadMessages();

        const handleNewMessage = (snapshot: any) => {
          try {
            const message = { ...snapshot.val(), id: snapshot.key } as ChatMessage;
            console.log('🔔 New message received:', message);
            
            setMessages(prev => {
              if (prev.some(m => m.id === message.id)) return prev;
              return [...prev, message];
            });

            if (message.receiverId === currentUserId && !message.isRead) {
              markMessageAsRead(selectedConversation!, message.id)
                .then(() => console.log('✅ Marked message as read:', message.id))
                .catch(error => console.error('💥 Error marking message as read:', error.message));
            }
          } catch (error: any) {
            console.error('💥 Error processing new message:', error.message, error.stack);
          }
        };

        if (!selectedConversation.startsWith('potential_')) {
          onChildAdded(messagesRef, handleNewMessage, (error) => {
            console.error('💥 Firebase listener error:', error.message,  error.stack);
          });
          listenerSet = true;
          console.log('✅ Real-time listener set up successfully');
        }
      } catch (error: any) {
        console.error('💥 Error setting up Firebase listener:', error.message, error.code, error.stack);
      }
    };

    setupListener();

    return () => {
      if (listenerSet && !selectedConversation.startsWith('potential_')) {
        console.log('🧹 Cleaning up real-time listener for room:', selectedConversation);
        try {
          const messagesRef = ref(database, `chatRooms/${selectedConversation}/messages`);
          off(messagesRef, 'child_added');
          console.log('✅ Listener cleaned up successfully');
        } catch (error: any) {
          console.error('💥 Error cleaning up Firebase listener:', error.message, error.code, error.stack);
        }
      }
      if (unsubscribeAuth) {
        console.log('🧹 Cleaning up auth listener');
        unsubscribeAuth();
      }
    };
  }, [selectedConversation, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleStartChat = async (user: User) => {
    try {
      console.log('🚀 Starting chat with user:', user.uid);
      
      const response = await createChatRoom(user.uid);
      if ((response.status === 1 || response.status === 'SUCCESS') && response.data) {
        const newRoom = response.data;
        
        setConversations(prev => {
          const existing = prev.find(c => c.userId === user.uid);
          if (existing && !existing.id.startsWith('potential_')) return prev;
          
          return [
            {
              id: newRoom.id,
              name: user.displayName || user.email.split('@')[0] || `User ${user.uid.substring(0, 8)}`,
              avatar: user.photoURL || '',
              lastMessage: 'New chat started',
              time: format(new Date(), 'p'),
              unread: 0,
              isOnline: false,
              userId: user.uid,
            },
            ...prev.filter(c => c.userId !== user.uid)
          ];
        });
        
        setSelectedConversation(newRoom.id);
        console.log('✅ Chat room created:', newRoom.id);
      }
    } catch (error: any) {
      console.error('💥 Error starting chat:', error.message, error.stack);
      alert(`Failed to start chat with ${user.displayName || user.email}: ${error.message}`);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const conversation = conversations.find(c => c.id === selectedConversation);
    if (!conversation || conversation.id.startsWith('potential_')) return;

    try {
      console.log('🚀 Sending message to:', conversation.userId);
      
      const response = await sendMessage(
        selectedConversation,
        conversation.userId,
        newMessage.trim()
      );

      if (response.status === 1 || response.status === 'SUCCESS') {
        console.log('✅ Message sent successfully');
        setNewMessage('');
      }
    } catch (error: any) {
      console.error('💥 Error sending message:', error.message, error.stack);
      alert(`Failed to send message: ${error.message}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const conversation = conversations.find(c => c.id === selectedConversation);

  if (authError) {
    return (
      <div className="max-w-6xl mx-auto pb-24">
        <div className="text-center mb-8">
          <h1 className="mb-2">Direct Messages</h1>
          <p className="text-red-500">{authError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-24">
      <div className="text-center mb-8">
        <h1 className="mb-2">Direct Messages</h1>
        <p className="text-muted-foreground">Connect with fellow midwives</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[600px]">
        <div className="lg:col-span-4">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <h3>{showUserList ? 'All Users' : 'Conversations'}</h3>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowUserList(!showUserList)}
                >
                  {showUserList ? 'My Chats' : 'All Users'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto">
              {(showUserList ? conversations : conversations.filter(c => !c.id.startsWith('potential_'))).map((conv) => {
                const isPotential = conv.id.startsWith('potential_');
                return (
                  <div
                    key={conv.id}
                    className={`flex items-center gap-3 p-4 border-b last:border-b-0 hover:bg-accent cursor-pointer transition-colors ${
                      selectedConversation === conv.id ? 'bg-accent' : ''
                    }`}
                    onClick={() => {
                      if (isPotential) {
                        const user = allUsers.find(u => u.uid === conv.userId);
                        if (user) handleStartChat(user);
                      } else {
                        setSelectedConversation(conv.id);
                      }
                    }}
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
                      <p className="text-sm text-muted-foreground truncate">
                        {isPotential ? 'Click to start chat' : conv.lastMessage}
                      </p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {conv.unread}
                      </Badge>
                    )}
                    {isPotential && (
                      <Badge variant="outline" className="text-xs">
                        New
                      </Badge>
                    )}
                  </div>
                );
              })}
              {conversations.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No users found. Be the first to invite others!
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-8">
          <Card className="h-full flex flex-col">
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={conversation?.avatar} />
                  <AvatarFallback>{conversation?.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium">{conversation?.name || 'Select a conversation'}</p>
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
                  className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                      message.senderId === currentUserId
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{format(new Date(message.sentAt), 'p')}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>
            
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1"
                  disabled={!selectedConversation || selectedConversation.startsWith('potential_')}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || !selectedConversation || selectedConversation.startsWith('potential_')}
                >
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