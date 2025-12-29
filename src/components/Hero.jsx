import React, { Suspense, useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Torus, MeshWobbleMaterial, Points, PointMaterial } from '@react-three/drei';
import { useTheme } from '../context/ThemeContext';
import { vapi, startAssistant, stopAssistant } from '../ai.js';

import CallInProgressCard from '../call/CallInProgressCard.jsx';

import * as THREE from 'three';

const Starfield = ({ theme }) => {
  const ref = useRef();
  const [sphere] = useMemo(() => {
    const count = 5000;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 40 + Math.random() * 60;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos((Math.random() * 2) - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = r * Math.cos(phi);
    }
    return [positions];
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 25;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={theme === 'dark' ? '#ffffff' : '#000000'}
          size={0.15}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
};

const Hero = () => {
  const { theme } = useTheme();
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
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
      setIsAssistantOpen(false);
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
    
    setIsAssistantOpen(true);
    setIsCalling(true); // Show calling state immediately
    setMessages([]);
    
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
      setIsAssistantOpen(false);
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
    setIsAssistantOpen(false);
    
    try {
      await stopAssistant();
    } catch (error) {
      console.error('Error stopping assistant:', error);
      // UI already closed above
    }
  };

  return (
    <>
      <div className={`relative w-full h-screen ${theme === 'dark' ? 'bg-[#1A1D1F]' : 'bg-white'}`}>
        <div className="absolute top-0 left-0 w-full h-full">
          <Canvas camera={{ position: [0, 0, 5] }}>
            <Suspense fallback={null}>
              <OrbitControls enableZoom={false} />
              <ambientLight intensity={0.5} />
              <pointLight position={[10, 10, 10]} />
              <Torus args={[2, 0.4, 64, 100]}>
                <MeshWobbleMaterial
                  color={theme === 'dark' ? "#3b82f6" : "#CCCCCC"}
                  factor={1}
                  speed={1}
                />
              </Torus>
              <Starfield theme={theme} />
            </Suspense>
          </Canvas>
        </div>

        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full text-center px-5">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Crafting Digital Experiences
          </h1>
          <p className={`mt-4 text-lg md:text-xl max-w-2xl ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>
            I'm Mehak Saluja, a passionate developer focused on building beautiful, functional, and user-centric web applications using AI.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              href="/assets/resume.pdf"
              download
              className={`px-8 py-3 font-bold rounded-full transition-all duration-300 transform hover:scale-105 ${theme === 'dark'
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-black text-white hover:bg-gray-800'
                }`}
            >
              Download Resume
            </a>
            <button
              onClick={handleStartAssistant}
              className={`px-8 py-3 font-bold rounded-full transition-all duration-300 transform hover:scale-105 ${theme === 'dark'
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-black hover:bg-gray-300'
                }`}
            >
              Ask AI Assistant
            </button>
          </div>
        </div>
      </div>

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
      
      {isAssistantOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-2xl w-full max-w-md mx-4 flex flex-col ${theme === 'dark' ? 'bg-[#1A1D1F]' : 'bg-white'}`}>
            <div className="p-4 flex justify-between items-center border-b border-gray-600">
              <h2 className="text-xl font-bold text-white">AI Assistant</h2>
              <button onClick={handleStopAssistant} className="text-2xl text-white hover:opacity-70">&times;</button>
            </div>

            <div className="p-6 flex-grow h-96 flex flex-col items-center justify-center">
              <CallInProgressCard theme={theme} isSpeaking={isSpeaking} isCalling={isCalling} />

              <button
                onClick={handleStopAssistant}
                className={`mt-6 px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300 transform hover:scale-105 ${theme === 'dark'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : 'bg-red-100 text-red-700 hover:bg-red-200'
                  }`}
              >
                End Call
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Hero;
