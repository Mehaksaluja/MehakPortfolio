import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall } from 'lucide-react';

const CallInProgressCard = ({ theme, isSpeaking }) => {
  return (
    <div className={`flex flex-col items-center justify-center h-full w-full`}>
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className={`rounded-full p-6 ${theme === 'dark' ? 'bg-blue-600' : 'bg-blue-400'}`}
      >
        <PhoneCall className="text-white" size={48} />
      </motion.div>

      <h2 className={`mt-6 text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
        {isSpeaking ? 'Assistant is speaking...' : 'Call in Progress'}
      </h2>

      <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
        Feel free to ask anything.
      </p>
    </div>
  );
};

export default CallInProgressCard;