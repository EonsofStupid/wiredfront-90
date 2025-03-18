import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { Toaster } from 'sonner';
import { ChatProvider } from './components/chat/ChatProvider';
import { DraggableChat } from './components/chat/DraggableChat';
import { ChatButton } from './components/chat/ChatButton';
import './App.css';

// Check if we're running on a mobile device
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <ChatProvider>
          {/* Main app content */}
          <div className="app-container">
            {/* Your routes and other components */}
          </div>
          
          {/* Chat components */}
          {!isMobile && (
            <>
              <DraggableChat />
              <ChatButton />
            </>
          )}
          
          <Toaster position="top-right" />
        </ChatProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
