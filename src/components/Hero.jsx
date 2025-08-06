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
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const onMessage = (message) => setMessages((prev) => [...prev, message]);
    const onSpeechStart = () => setIsSpeaking(true);
    const onSpeechEnd = () => setIsSpeaking(false);
    const onCallEnd = () => setIsAssistantOpen(false);

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
    setIsAssistantOpen(true);
    setMessages([]);
    startAssistant('Guest', 'User', 'guest@example.com', '1234567890');
  };

  const handleStopAssistant = () => {
    stopAssistant();
    setIsAssistantOpen(false);
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
              href="/resume.pdf"
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

      {isAssistantOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className={`rounded-lg shadow-2xl w-full max-w-md mx-4 flex flex-col ${theme === 'dark' ? 'bg-[#1A1D1F]' : 'bg-white'}`}>
            <div className="p-4 flex justify-between items-center border-b border-gray-600">
              <h2 className="text-xl font-bold text-white">AI Assistant</h2>
              <button onClick={handleStopAssistant} className="text-2xl text-white hover:opacity-70">&times;</button>
            </div>

            <div className="p-6 flex-grow h-96 flex flex-col items-center justify-center">
              <CallInProgressCard theme={theme} isSpeaking={isSpeaking} />

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
