// src/App.jsx
import React, { useState, useEffect } from 'react';
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
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const onMessage = (message) => setMessages((prev) => [...prev, message]);
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onCallEnd = () => setIsAssistantActive(false);

    vapi.on('message', onMessage);
    vapi.on('speech-start', onSpeechStart);
    vapi.on('speech-end', onSpeechEnd);
    vapi.on('call-end', onCallEnd);

    return () => {
      vapi.off('message', onMessage);
      vapi.off('speech-start', onSpeechStart);
      vapi.off('speech-end', onSpeechEnd);
      vapi.off('call-end', onCallEnd);
    };
  }, []);

  const handleStartAssistant = () => {
    setMessages([]);
    setIsAssistantActive(true);
    startAssistant('Guest', 'User', 'guest@example.com', '1234567890');
  };

  const handleStopAssistant = () => {
    stopAssistant();
    setIsAssistantActive(false);
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

      {isAssistantActive && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-2xl w-full max-w-md mx-4 flex flex-col ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="p-4 flex justify-between items-center border-b">
              <h2 className="text-xl font-bold">AI Assistant</h2>
              <button onClick={handleStopAssistant} className="text-2xl hover:opacity-70">&times;</button>
            </div>
            <div className="p-6 flex-grow h-96 flex flex-col">
              <ActiveCallDetails messages={messages} />
              <AssistantSpeechIndicator isSpeaking={isSpeaking} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;