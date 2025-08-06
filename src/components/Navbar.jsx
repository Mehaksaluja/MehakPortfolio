import React, { useState, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { useTheme } from '../context/ThemeContext';

const BriefcaseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>;
const GridIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>;
const CodeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>;
const MailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>;

const Navbar = () => {
  const { theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "#experience", title: "Experience", icon: <BriefcaseIcon /> },
    { href: "#projects", title: "Projects", icon: <GridIcon /> },
    { href: "#skills", title: "Skills", icon: <CodeIcon /> },
    { href: "#contact", title: "Contact", icon: <MailIcon /> },
  ];

  const headerClasses = `fixed top-0 left-0 w-full p-5 z-50 flex items-center justify-between transition-all duration-300 ${scrolled
    ? (theme === 'dark' ? 'bg-[#1A1D1F]/80 backdrop-blur-md shadow-lg' : 'bg-white/80 backdrop-blur-md shadow-lg')
    : 'bg-transparent'
    }`;

  return (
    <>
      <header className={headerClasses}>
        <a href="#" className="text-2xl font-bold">Mehak Saluja</a>
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex space-x-12">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="group transition duration-300">
                {link.title}
                <span className={`block max-w-0 group-hover:max-w-full transition-all duration-500 h-0.5 ${theme === 'dark' ? 'bg-blue-400' : 'bg-black'}`}></span>
              </a>
            ))}
          </div>
          <ThemeToggle />
        </div>
      </header>

      <nav className={`md:hidden fixed bottom-0 left-0 w-full z-50`}>
        <div className={`mx-auto max-w-sm rounded-t-2xl border-t shadow-lg ${theme === 'dark' ? 'bg-[#1A1D1F]/70 backdrop-blur-lg border-gray-700' : 'bg-white/70 backdrop-blur-lg border-gray-200'}`}>
          <div className="flex justify-around items-center p-3">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-blue-400' : 'text-gray-600 hover:text-black'}`}
                aria-label={link.title}
              >
                {link.icon}
                <span className="text-xs mt-1">{link.title}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
};
export default Navbar;
