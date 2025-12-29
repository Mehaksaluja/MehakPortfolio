import React from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, Phone } from 'lucide-react';

const CallInProgressCard = ({ theme, isSpeaking, isCalling }) => {
  // Show calling state if call has started but assistant hasn't responded yet
  if (isCalling) {
    return (
      <div className={`flex flex-col items-center justify-center h-full w-full`}>
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 1.5,
            ease: "easeInOut"
          }}
          className={`rounded-full p-6 ${theme === 'dark' ? 'bg-orange-600' : 'bg-orange-400'}`}
        >
          <Phone className="text-white" size={48} />
        </motion.div>

        <h2 className={`mt-6 text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Calling...
        </h2>

        <p className={`mt-2 text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Connecting to AI Assistant...
        </p>
      </div>
    );
  }

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