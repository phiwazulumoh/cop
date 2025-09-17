import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Send, Bot } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';

interface ChatMessage {
  id: string;
  text: string;
  time: string;
  isBot: boolean;
}

const botResponses = [
  "Based on current best practices, I'd recommend monitoring the mother's vital signs every 15 minutes during active labor.",
  "For managing labor pain naturally, consider suggesting position changes, breathing exercises, and hydrotherapy.",
  "The normal fetal heart rate during labor is typically between 110-160 beats per minute. Variations may indicate fetal distress.",
  "Encourage skin-to-skin contact immediately after birth to promote bonding and regulate the baby's temperature.",
  "Signs of postpartum hemorrhage include excessive bleeding (>500ml for vaginal birth), falling blood pressure, and increasing pulse rate.",
  "For breech presentations, external cephalic version can be attempted after 36 weeks if there are no contraindications.",
];

export function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI midwifery assistant. I can help answer questions about labor, delivery, postpartum care, and midwifery best practices. How can I assist you today?',
      time: '9:00 AM',
      isBot: true,
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isBot: false,
      };

      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');
      setIsTyping(true);

      // Simulate bot response
      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          text: botResponses[Math.floor(Math.random() * botResponses.length)],
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isBot: true,
        };
        setMessages(prev => [...prev, botMessage]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const quickQuestions = [
    "Normal labor progression stages",
    "Managing postpartum complications",
    "Fetal heart rate monitoring",
    "Natural pain relief methods",
  ];

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="text-center mb-8">
        <h1 className="mb-2">Chatbot</h1>
        <p className="text-muted-foreground">Get instant answers to your questions</p>
      </div>

      <Card className="h-[600px] flex flex-col">
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary text-primary-foreground">
                <Bot className="w-4 h-4" />
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">Chatbot</p>
              <p className="text-xs text-muted-foreground">Always available to help</p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`max-w-[80%] px-4 py-2 rounded-lg ${
                  message.isBot
                    ? 'bg-muted'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p className="text-xs opacity-70 mt-1">{message.time}</p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted px-4 py-2 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </CardContent>

        <div className="p-4 border-t space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setNewMessage(question)}
                className="text-xs"
              >
                {question}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Input
              placeholder="Ask about midwifery practices..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Button onClick={handleSendMessage} disabled={!newMessage.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}