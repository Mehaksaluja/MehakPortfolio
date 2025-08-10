// src/components/Contact.jsx
import React, { useRef, useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import emailjs from '@emailjs/browser';

// --- Icon Components for Social Links ---
const LinkedInIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>;
const GitHubIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 16 16" fill="currentColor"><path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" /></svg>;
const ThreadsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-2-9c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm-4 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm8 0c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2z" /></svg>;

const Contact = () => {
  const { theme } = useTheme();
  const form = useRef();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const sendEmail = (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);
    setSuccess(false);

    emailjs
      .sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        form.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      )
      .then(
        () => {
          setSuccess(true);
          setLoading(false);
          form.current.reset();
        },
        (error) => {
          setError(true);
          setLoading(false);
          console.log('FAILED...', error.text);
        },
      );
  };

  return (
    <div id="contact" className={`py-20 relative overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {theme === 'dark' && <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>}

      <div className="container mx-auto px-5 relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Get In Touch</h2>
          <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
            Have a project in mind or just want to connect? Feel free to send me a message.
          </p>
          <div className="flex justify-center space-x-6 mb-12">
            <a href="#" className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-black'}`}><LinkedInIcon /></a>
            <a href="#" className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-black'}`}><GitHubIcon /></a>
            <a href="#" className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-black'}`}><XIcon /></a>
            <a href="#" className={`transition-colors duration-300 ${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-black'}`}><ThreadsIcon /></a>
          </div>
        </div>

        <form
          ref={form}
          onSubmit={sendEmail}
          className={`max-w-2xl mx-auto space-y-6 bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg border ${theme === 'dark' ? 'border-gray-700' : 'bg-white/50 border-gray-200'}`}
        >
          <div>
            <label htmlFor="name" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Your Name</label>
            <input
              type="text"
              name="name"
              className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 transition-all ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600 focus:ring-blue-500' : 'bg-gray-100/50 border-gray-300 focus:ring-black'}`}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Your Email</label>
            <input
              type="email"
              name="email"
              className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 transition-all ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600 focus:ring-blue-500' : 'bg-gray-100/50 border-gray-300 focus:ring-black'}`}
              required
            />
          </div>
          <div>
            <label htmlFor="message" className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Message</label>
            <textarea
              name="message"
              rows="5"
              className={`w-full rounded-md border px-4 py-2 focus:outline-none focus:ring-2 transition-all ${theme === 'dark' ? 'bg-gray-700/50 border-gray-600 focus:ring-blue-500' : 'bg-gray-100/50 border-gray-300 focus:ring-black'}`}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className={`w-full px-8 py-3 font-bold rounded-full transition-all duration-300 transform hover:scale-105 ${theme === 'dark' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-black text-white hover:bg-gray-800'}`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
          {success && <p className="text-green-500 text-center">Message sent successfully!</p>}
          {error && <p className="text-red-500 text-center">Failed to send message. Please try again.</p>}
        </form>
      </div>
    </div>
  );
};

export default Contact;
