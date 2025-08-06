import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { FiExternalLink, FiGithub } from 'react-icons/fi';

const projects = [
  {
    title: "AI Based Portfolio",
    description: "A 3D portfolio that showcases my skills and projects, built with React Three Fiber and Tailwind CSS with AI integration as a personal assistant.",
    tags: ["VAPI API", "React JS", "Three.js", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
    liveUrl: "https://mehak-portfolio-pewi.vercel.app/",
    sourceUrl: "https://github.com/Mehaksaluja/Portfolio_Mehak"
  },
  {
    title: "Zenvo Ecommerce",
    description: "A detailed overview of the project, focusing on the problem it solves and the technologies used.",
    tags: ["MongoDB", "TailwindCSS", "Express", "React", "Node.js"],
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop",
    liveUrl: "https://zenvo-store.onrender.com/",
    sourceUrl: "https://github.com/Mehaksaluja/Zenvo-Ecommerce"
  },
  {
    title: "Style-Scout",
    description: "A flutter app that helps users find the best fashion for themselves by adding image of the products.",
    tags: ["Flutter", "GeminiAPI", "Firebase"],
    image: "https://images.unsplash.com/photo-1534665482403-a909d0d97c67?q=80&w=2070&auto=format&fit=crop",
    liveUrl: "https://github.com/Mehaksaluja/style_scout/releases/download/v1.0.0/app-release.apk",
    sourceUrl: "https://github.com/Mehaksaluja/style_scout"
  },
  {
    title: "Project Management System",
    description: "A project management system that allows users to create, manage, and track projects and tasks.",
    tags: ["React", "MongoDB", "Express", "Node.js", 'Tailwind CSS'],
    image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=2106&auto=format&fit=crop",
    liveUrl: "https://saas-app-7owr.onrender.com/",
    sourceUrl: "https://github.com/Mehaksaluja/SAAS_App"
  },
  {
    title: "Growth Magnet",
    description: "A social media Agency website that shows the services provided by the agency.",
    tags: ["React JS", "Tailwind CSS"],
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2070&auto=format&fit=crop",
    liveUrl: "https://growth-magnet.netlify.app/",
    sourceUrl: "https://github.com/Mehaksaluja/Growth-Magnet"
  },
  {
    title: "SkillSetGo",
    description: "A Job Portal that helps users find the best jobs for themselves by adding their skills and experience.",
    tags: ["Flutter", "Firebase", "Dart"],
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=2070&auto=format&fit=crop",
    liveUrl: "https://skillsetgomehak.vercel.app/",
    sourceUrl: "https://github.com/Mehaksaluja/SkillSetGo"
  }
];

const ProjectCard = ({ project }) => {
  const { theme } = useTheme();

  return (
    <div className={`rounded-2xl overflow-hidden group transform hover:-translate-y-2 transition-all duration-300 border ${theme === 'dark' ? 'bg-[#1F2325] border-[#2A2E30]' : 'bg-white border-gray-200'} shadow-lg`}>
      <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
      <div className="p-5">
        <h3 className="text-xl font-bold mb-2">{project.title}</h3>
        <p className={`text-sm leading-relaxed mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-6">
          {project.tags.map(tag => (
            <span key={tag} className={`text-xs font-medium px-3 py-1 rounded-full ${theme === 'dark' ? 'bg-[#2A2E30] text-[#43BAFF]' : 'bg-gray-100 text-gray-800'}`}>
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <a
            href={project.liveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${theme === 'dark' ? 'bg-[#43BAFF] text-black hover:bg-[#36A5E0]' : 'bg-black text-white hover:bg-gray-800'}`}
          >
            <FiExternalLink /> Live Demo
          </a>
          <a
            href={project.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200 ${theme === 'dark' ? 'bg-[#2A2E30] text-white hover:bg-[#3A3F42]' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            <FiGithub /> Source
          </a>
        </div>
      </div>
    </div>
  );
};

const Projects = () => {
  const { theme } = useTheme();
  const [showAll, setShowAll] = useState(false);
  const displayedProjects = showAll ? projects : projects.slice(0, 3);

  return (
    <section id="projects" className={`py-24 ${theme === 'dark' ? 'bg-[#1A1D1F]' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-5">
        <h2 className={`text-4xl font-bold text-center mb-16 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
          My Projects
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedProjects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>

        {!showAll && projects.length > 3 && (
          <div className="text-center mt-16">
            <button
              onClick={() => setShowAll(true)}
              className={`px-8 py-3 text-base font-bold rounded-full transform transition duration-300 hover:scale-105 shadow-md ${theme === 'dark' ? 'bg-gradient-to-r from-[#43BAFF] to-[#36A5E0] text-black' : 'bg-black text-white hover:bg-gray-800'}`}
            >
              View All Projects
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
