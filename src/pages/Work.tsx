import React, { useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import './Work.css';

const Work: React.FC = () => {
  const { portfolioData, loadFromLocalStorage } = useAdmin();
  const workExperiences = portfolioData.workExperiences || [];

  // Default work items that are always shown
  const defaultWorkItems = [
    {
      number: "01",
      title: "Frontend Development",
      description: "Building responsive web and mobile applications using React and React Native. Focus on clean, maintainable code and optimal performance."
    },
    {
      number: "02",
      title: "UI/UX Design",
      description: "Creating intuitive interfaces in Figma with a focus on user research, wireframing, prototyping, and accessibility standards."
    },
    {
      number: "03",
      title: "Team Collaboration",
      description: "Experience as Business Analyst and Team Lead. Managing projects using Agile methodology, Jira, and effective communication."
    }
  ];

  // Listen for real-time updates from admin panel
  useEffect(() => {
    const handleDataUpdate = () => {
      loadFromLocalStorage();
    };
    
    window.addEventListener('portfolioDataUpdated', handleDataUpdate);
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolio_admin_data') {
        loadFromLocalStorage();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('portfolioDataUpdated', handleDataUpdate);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadFromLocalStorage]);

  return (
    <div className="work">
      <div className="container">
        <div className="work-header fade-up">
          <h1 className="work-title">How I Work</h1>
          <p className="work-subtitle">My approach to building digital products</p>
        </div>
        
        {/* Default Work Cards - Always Displayed */}
        <div className="work-grid">
          {defaultWorkItems.map((item, index) => (
            <div key={index} className="work-card fade-up" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="work-card-number">{item.number}</div>
              <h2 className="work-card-title">{item.title}</h2>
              <p className="work-card-description">{item.description}</p>
            </div>
          ))}
        </div>

        {/* Additional Work Experiences from Admin Dashboard - Displayed Below */}
        {workExperiences.length > 0 && (
          <>
            <div className="work-separator fade-up">
              <div className="separator-line"></div>
              <span className="separator-text">Work Experience</span>
              <div className="separator-line"></div>
            </div>
            
            <div className="work-grid additional-work">
              {workExperiences.map((item, index) => (
                <div key={item.id || index} className="work-card fade-up" style={{ animationDelay: `${(index + 3) * 0.1}s` }}>
                  <div className="work-card-company">{item.company}</div>
                  <div className="work-card-role">{item.role}</div>
                  {item.year && <div className="work-card-year">{item.year}</div>}
                  <p className="work-card-description">{item.description}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Work;