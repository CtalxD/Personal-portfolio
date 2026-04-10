import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { Project } from '../types';
import './Projects.css';

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const { portfolioData, loadFromLocalStorage } = useAdmin();
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>(portfolioData.projects);

  // Update local projects when portfolioData changes
  useEffect(() => {
    setProjects(portfolioData.projects);
  }, [portfolioData.projects]);

  // Listen for real-time updates from admin panel
  useEffect(() => {
    const handleDataUpdate = (event: CustomEvent) => {
      loadFromLocalStorage();
      setProjects(event.detail.projects);
    };
    
    window.addEventListener('portfolioDataUpdated', handleDataUpdate as EventListener);
    
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'portfolio_admin_data' && e.newValue) {
        const newData = JSON.parse(e.newValue);
        setProjects(newData.projects);
        loadFromLocalStorage();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('portfolioDataUpdated', handleDataUpdate as EventListener);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadFromLocalStorage]);

  const handleViewDetails = () => {
    if (selectedProjectId) {
      navigate(`/project/${selectedProjectId}`);
      setSelectedProjectId('');
    }
  };

  const handleCardClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className="projects">
      <div className="container">
        <div className="projects-header fade-up">
          <h1 className="projects-title">Projects</h1>
          <p className="projects-subtitle">A selection of my recent work</p>
        </div>
        
        {/* Dropdown Menu for Project Details */}
        <div className="projects-dropdown-section fade-up">
          <div className="dropdown-container">
            <label className="dropdown-label">Quick View Project Details</label>
            <div className="dropdown-wrapper">
              <div className="custom-select-wrapper">
                <select 
                  className="project-dropdown"
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                >
                  <option value="">-- Select a project to view details --</option>
                  {projects.map((project: Project) => (
                    <option key={project.id} value={project.id}>
                      {project.title} ({project.year})
                    </option>
                  ))}
                </select>
                <div className="select-arrow">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>
              </div>
              <button 
                className="dropdown-view-btn" 
                onClick={handleViewDetails}
                disabled={!selectedProjectId}
              >
                View Details
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <div className="projects-list">
          {projects.map((project: Project, index: number) => (
            <div 
              key={project.id} 
              className="project-card fade-up" 
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => handleCardClick(project.id)}
            >
              <div className="project-card-header">
                <div className="project-card-year">{project.year}</div>
                <div className="project-card-role">{project.role}</div>
              </div>
              
              <h2 className="project-card-title">{project.title}</h2>
              <p className="project-card-description">{project.description}</p>
              
              <div className="project-card-tech">
                {project.technologies.slice(0, 5).map((tech: string) => (
                  <span key={tech} className="project-tech-tag">{tech}</span>
                ))}
                {project.technologies.length > 5 && (
                  <span className="project-tech-tag more-tag">+{project.technologies.length - 5}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;