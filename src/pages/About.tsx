import React, { useEffect } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import { Education } from '../types';
import './About.css';

const About: React.FC = () => {
  const { portfolioData, loadFromLocalStorage } = useAdmin();

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
    <div className="about">
      <div className="container">
        <div className="about-header fade-up">
          <h1 className="about-title">About</h1>
          <p className="about-subtitle">Get to know me</p>
        </div>
        
        <div className="about-grid">
          {portfolioData.personal.bio && (
            <div className="about-section fade-up" style={{ animationDelay: '0.1s' }}>
              <h2 className="about-section-title">Profile</h2>
              <p className="about-section-content">{portfolioData.personal.bio}</p>
            </div>
          )}
          
          {portfolioData.education && portfolioData.education.length > 0 && (
            <div className="about-section fade-up" style={{ animationDelay: '0.2s' }}>
              <h2 className="about-section-title">Education</h2>
              {portfolioData.education.map((edu: Education, index: number) => (
                <div key={edu.id || index} className="about-education">
                  <h3 className="about-education-degree">{edu.degree}</h3>
                  <p className="about-education-institution">{edu.institution}</p>
                  {edu.period && edu.period.trim() !== '' && (
                    <p className="about-education-period">{edu.period}</p>
                  )}
                  {edu.grade && edu.grade.trim() !== '' && (
                    <div className="about-education-grade">Grade: {edu.grade}</div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {portfolioData.skills.technical && portfolioData.skills.technical.length > 0 && (
            <div className="about-section fade-up" style={{ animationDelay: '0.3s' }}>
              <h2 className="about-section-title">Technical Skills</h2>
              <div className="about-skills-list">
                {portfolioData.skills.technical.map((skill: string) => (
                  <span key={skill} className="about-skill">{skill}</span>
                ))}
              </div>
            </div>
          )}
          
          {portfolioData.skills.soft && portfolioData.skills.soft.length > 0 && (
            <div className="about-section fade-up" style={{ animationDelay: '0.4s' }}>
              <h2 className="about-section-title">Soft Skills</h2>
              <div className="about-skills-list">
                {portfolioData.skills.soft.map((skill: string) => (
                  <span key={skill} className="about-skill">{skill}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default About;