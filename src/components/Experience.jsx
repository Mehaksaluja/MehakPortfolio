import React from 'react';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../context/ThemeContext';

const WorkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);
const EducationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
    <path d="M6 12v5c0 5 4 5 6 5s6-0 6-5v-5"></path>
  </svg>
);

const timelineData = [
  {
    type: 'Work',
    year: "July 2025 - Present",
    title: "Software Developer Intern",
    company: "Zentosys Solutions Private Limited",
    description: "Currently developing a TMS web portal and driver app to simplify logistics using MERN and Flutter. It features real-time tracking, admin controls, and secure driver authentication."
  },
  {
    type: 'Work',
    year: "June 2025 - August 2025",
    title: "Web Development Intern",
    company: "Insyble Tech Private Limited",
    description: "Worked on differnt projects using React.js, Node.js, and MongoDB. Gained experience in building responsive web applications and collaborating in an agile environment."
  },
  {
    type: 'education',
    year: "2023 - Present",
    title: "B.Tech in Computer Science and Engineering",
    institution: "Seth Jai Parkash Mukand Lal Institute of Engineering and Technology",
    details: "CGPA: 8.5 | Specialized in Web Development and Flutter App Development"
  },
  {
    type: 'education',
    year: "2022 - 2023",
    title: "Higher Secondary Education",
    institution: "DAV Public School, Radaur",
    details: "Percentage: 94.4% | Focused on Physics, Chemistry, and Mathematics."
  }
];

const ContentCard = ({ data, animationClass }) => {
  const { theme } = useTheme();
  return (
    <div className={`p-5 rounded-lg shadow-lg transform transition-all duration-700 ${animationClass} ${theme === 'dark' ? 'bg-[#1A1D1F]' : 'bg-gray-100'}`}>
      <div className="flex items-center space-x-3 mb-2">
        <div className={`${theme === 'dark' ? 'text-blue-400' : 'text-black'}`}>
          {data.type === 'work' ? <WorkIcon /> : <EducationIcon />}
        </div>
        <h3 className="text-xl font-bold">{data.title}</h3>
      </div>
      <p className={`mb-3 text-sm ${theme === 'dark' ? 'text-blue-300' : 'text-gray-600'}`}>
        {data.company || data.institution} | {data.year}
      </p>
      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-800'}`}>
        {data.description || data.details}
      </p>
    </div>
  );
};

const TimelineItem = ({ data, index }) => {
  const { theme } = useTheme();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });

  const isLeftDesktop = index % 2 === 0;
  const animationClass = inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10';

  return (
    <div ref={ref} className="mb-8 flex justify-between items-center w-full">
      <div className="hidden md:block w-5/12">
        {!isLeftDesktop && <ContentCard data={data} animationClass={animationClass} />}
      </div>

      <div className="z-10 flex items-center">
        <div className={`w-4 h-4 rounded-full transition-all duration-700 ${inView
          ? (theme === 'dark' ? 'bg-blue-500' : 'bg-black') + ' scale-125'
          : (theme === 'dark' ? 'bg-gray-600' : 'bg-gray-400')
          }`}></div>
      </div>

      <div className="w-full pl-8 md:pl-0 md:w-5/12">
        <div className="md:hidden">
          <ContentCard data={data} animationClass={animationClass} />
        </div>
        <div className="hidden md:block">
          {isLeftDesktop && <ContentCard data={data} animationClass={animationClass} />}
        </div>
      </div>
    </div>
  );
};

const Experience = () => {
  const { theme } = useTheme();
  return (
    <div id="experience" className={`py-20 px-5 ${theme === 'dark' ? 'bg-[#1A1D1F]' : 'bg-white'}`}>
      <div className="container mx-auto">
        <h2 className="text-4xl font-bold text-center mb-16">My Journey</h2>
        <div className="relative max-w-3xl mx-auto">
          <div className={`absolute left-2 md:left-1/2 md:transform md:-translate-x-1/2 w-0.5 h-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'}`}></div>
          {timelineData.map((data, index) => (
            <TimelineItem key={index} data={data} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Experience;
