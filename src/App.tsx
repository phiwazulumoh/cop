import { useState } from 'react';
import { BottomNavigation } from './components/BottomNavigation';
import { Forum } from './components/Forum';
import { Messages } from './components/Messages';
import { Chatbot } from './components/Chatbot';
import { MediaLibrary } from './components/MediaLibrary';
import { Profile } from './components/Profile';
import Home from './components/Home';
import { AuthForms } from './components/AuthForms';

function App() {
  const [activeTab, setActiveTab] = useState('forum');
  const [currentView, setCurrentView] = useState<'home' | 'auth' | 'main'>('home');
  const [isSignUp, setIsSignUp] = useState(false); // Track if AuthForms should show sign-up or sign-in

  // Handle navigation to AuthForms
  const handleNavigateToAuth = (signUp: boolean) => {
    setIsSignUp(signUp);
    setCurrentView('auth');
  };

  // Handle successful form submission
  const handleAuthSubmit = () => {
    setCurrentView('main');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'forum':
        return <Forum />;
      case 'messages':
        return <Messages />;
      case 'chatbot':
        return <Chatbot />;
      case 'media':
        return <MediaLibrary />;
      case 'profile':
        return <Profile />;
      default:
        return <Forum />;
    }
  };

  return (
    <div className="min-h-screen">
      {currentView === 'home' && (
        <Home
          onSignIn={() => handleNavigateToAuth(false)}
          onJoinCommunity={() => handleNavigateToAuth(true)}
        />
      )}
      {currentView === 'auth' && (
        <AuthForms isSignUp={isSignUp} onSubmit={handleAuthSubmit} />
      )}
      {currentView === 'main' && (
        <>
          <div className="container mx-auto px-4 py-8">
            {renderContent()}
          </div>
          <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      )}
    </div>
  );
}

export default App;