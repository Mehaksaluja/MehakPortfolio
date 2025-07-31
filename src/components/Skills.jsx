import React from 'react';
import { useTheme } from '../context/ThemeContext';

const skillsData = [
  {
    category: "Web Development",
    skills: ["React", "Next.js", "JavaScript", "HTML5", "CSS3", "TailwindCSS", "Shadcn/UI", "Node.js", "Express", "Python", "C++"]
  },
  {
    category: "Databases",
    skills: ["MongoDB", "PostgreSQL", "SQL", "Firebase"]
  },
  {
    category: "AI & Data Science",
    skills: ["OpenAI API", "Numpy", "Pandas", "Seaborn", "Matplotlib", "Data Analysis"]
  },
  {
    category: "DevOps & Tools",
    skills: ["Git", "GitHub", "GitLab", "AWS", "Vite"]
  }
];

const Skills = () => {
  const { theme } = useTheme();

  return (
    <div id="skills" className={`py-20 ${theme === 'dark' ? 'bg-[#1A1D1F]' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-5">
        <h2 className="text-4xl font-bold text-center mb-16">Technologies I Use</h2>

        <div className="max-w-4xl mx-auto space-y-12">
          {skillsData.map((group, index) => (
            <div
              key={index}
              className="text-center"
            >
              <h3 className={`text-2xl font-semibold mb-6 ${theme === 'dark' ? 'text-[#43BAFF]' : 'text-black'}`}>{group.category}</h3>
              <div className="flex flex-wrap justify-center gap-4">
                {group.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className={`text-sm font-medium px-4 py-2 rounded-full border transition-all duration-300 cursor-default ${theme === 'dark'
                    ? 'bg-[#23272A] text-white border-[#2E3438] hover:bg-[#43BAFF] hover:text-black'
                    : 'bg-white text-gray-800 border-gray-200 hover:bg-black hover:text-white'
                    }`}>
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
