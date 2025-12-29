import React, { useState, useEffect, useRef } from 'react';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Contact from './components/Contact';

import { vapi, startAssistant, stopAssistant } from './ai.js';

import AssistantSpeechIndicator from './call/AssistantSpeechIndicator.jsx';
import ActiveCallDetails from './call/ActiveCallDetails.jsx';

function App() {
  return (
    <ThemeProvider>
      <MainContent />
    </ThemeProvider>
  );
}

const MainContent = () => {
  const { theme } = useTheme();
  const [isAssistantActive, setIsAssistantActive] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [messages, setMessages] = useState([]);
  const callingSoundRef = useRef(null);
  const audioLoadedRef = useRef(false);
  const callCancelledRef = useRef(false);

  useEffect(() => {
    const onMessage = (message) => setMessages((prev) => [...prev, message]);
    const onSpeechStart = () => {
      setIsSpeaking(true);
      setIsCalling(false); // Assistant has responded, stop calling state
      // Stop the calling sound
      if (callingSoundRef.current) {
        callingSoundRef.current.pause();
        callingSoundRef.current.currentTime = 0;
      }
    };
    const onSpeechEnd = () => setIsSpeaking(false);
    const onCallEnd = () => {
      setIsAssistantActive(false);
      setIsCalling(false);
      // Stop the calling sound when call ends
      if (callingSoundRef.current) {
        callingSoundRef.current.pause();
        callingSoundRef.current.currentTime = 0;
      }
    };
    const onCallStart = () => {
      // Call has actually started (after our 5 second delay)
      // Keep the calling state and sound until assistant responds
      // The sound is already playing from handleStartAssistant
    };

    vapi.on('message', onMessage);
    vapi.on('call-start', onCallStart);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('call-end', onCallEnd);

    return () => {
      vapi.off('message', onMessage);
      vapi.off('call-start', onCallStart);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('call-end', onCallEnd);
      // Clean up sound when component unmounts
      if (callingSoundRef.current) {
        callingSoundRef.current.pause();
        callingSoundRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleStartAssistant = async () => {
    // Reset cancellation flag
    callCancelledRef.current = false;
    
    setMessages([]);
    setIsCalling(true); // Show calling state immediately
    setIsAssistantActive(true);
    
    // Wait a tiny bit for the audio element to mount, then play sound
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // Start playing the calling sound immediately
    if (callingSoundRef.current) {
      try {
        // Ensure audio is loaded
        if (!audioLoadedRef.current) {
          callingSoundRef.current.load();
          audioLoadedRef.current = true;
        }
        
        callingSoundRef.current.loop = true;
        callingSoundRef.current.volume = 0.7; // Set volume
        
        // Try to play
        const playPromise = callingSoundRef.current.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          console.log('✅ Calling sound started playing');
        }
      } catch (err) {
        console.error('❌ Could not play calling sound:', err);
        // If autoplay is blocked, try to play anyway (user just clicked)
        if (err.name === 'NotAllowedError') {
          console.warn('Autoplay blocked, retrying...');
          try {
            // Retry once more
            await callingSoundRef.current.play();
            console.log('✅ Calling sound started on retry');
          } catch (retryErr) {
            console.error('❌ Still blocked:', retryErr);
          }
        }
      }
    } else {
      console.warn('⚠️ Audio element not found');
    }
    
    // Wait minimum 5 seconds before starting the actual call
    // Check if cancelled during wait
    for (let i = 0; i < 50; i++) {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (callCancelledRef.current) {
        console.log('Call cancelled during wait');
        return;
      }
    }
    
    // Check again before starting call
    if (callCancelledRef.current) {
      console.log('Call cancelled before starting');
      return;
    }
    
    // Now start the assistant call
    try {
      await startAssistant('Guest', 'User', 'guest@example.com', '1234567890');
    } catch (error) {
      console.error('Error starting assistant:', error);
      // If call fails, stop the sound and close
      if (callingSoundRef.current) {
        callingSoundRef.current.pause();
        callingSoundRef.current.currentTime = 0;
      }
      setIsCalling(false);
      setIsAssistantActive(false);
    }
  };

  const handleStopAssistant = async () => {
    // Cancel any pending call
    callCancelledRef.current = true;
    
    // Immediately stop the calling sound
    if (callingSoundRef.current) {
      callingSoundRef.current.pause();
      callingSoundRef.current.currentTime = 0;
    }
    
    // Reset calling state immediately
    setIsCalling(false);
    
    // Close UI immediately
    setIsAssistantActive(false);
    
    try {
      await stopAssistant();
    } catch (error) {
      console.error('Error stopping assistant:', error);
      // UI already closed above
    }
  };

  return (
    <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'} min-h-screen font-sans transition-colors duration-500`}>
      <Navbar />
      <Hero
        startAssistant={handleStartAssistant}
        stopAssistant={handleStopAssistant}
        isAssistantActive={isAssistantActive}
      />
      <Experience />
      <Projects />
      <Skills />
      <Contact />

      {/* Hidden audio element for calling sound - always mounted */}
      <audio
        ref={callingSoundRef}
        src="/assets/calling-sound.mp3"
        preload="auto"
        style={{ display: 'none' }}
        onLoadedData={() => {
          console.log('Audio file loaded');
          audioLoadedRef.current = true;
        }}
        onError={(e) => {
          console.error('Audio load error:', e);
        }}
      />
      
      {isAssistantActive && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-2xl w-full max-w-md mx-4 flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-bold">AI Assistant</h2>
              <button onClick={handleStopAssistant} className="text-2xl hover:opacity-70">&times;</button>
            </div>
            <div className="p-6 flex-grow h-96 flex flex-col">
              <ActiveCallDetails messages={messages} />
              <AssistantSpeechIndicator isSpeaking={isSpeaking} isCalling={isCalling} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;