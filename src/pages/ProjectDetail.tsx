import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { pdfStorage } from '../services/pdfStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons';
import './ProjectDetail.css';

// Initialize PDF storage
pdfStorage.init().catch(console.error);

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { portfolioData, loadFromLocalStorage } = useAdmin();
  
  const project = portfolioData.projects.find(p => p.id === Number(id));

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

  const getProjectLinks = (project: any) => {
    if (!project) {
      return { youtube: null, github: null, report: null };
    }
    
    if (project.links) {
      return {
        youtube: project.links.youtube || null,
        github: project.links.github || null,
        report: project.links.report || null
      };
    }
    
    return {
      youtube: null,
      github: null,
      report: null
    };
  };

  if (!project) {
    return (
      <div className="project-detail-notfound">
        <h2>Project not found</h2>
        <button onClick={() => navigate('/projects')} className="back-btn">Back to Projects</button>
      </div>
    );
  }

  const links = getProjectLinks(project);

  const handleDownloadReport = async (reportUrl: string, title: string) => {
    if (reportUrl) {
      // Extract the filename from the URL
      let fileName = '';
      
      // Check if it's a stored PDF in IndexedDB
      const pdfKey = reportUrl.replace('/pdf/', '');
      
      try {
        const storedPdf = await pdfStorage.getPDF(`pdf_${pdfKey}`);
        
        if (storedPdf) {
          // Convert base64 to blob and download
          try {
            // Extract the original filename (remove timestamp prefix)
            const originalName = pdfKey.replace(/^\d+_/, '');
            fileName = originalName;
            
            const byteCharacters = atob(storedPdf.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          } catch (error) {
            console.error('Error downloading report:', error);
            alert('Error downloading the report. Please try again.');
          }
        } else {
          // Try to fetch from public folder
          fetch(reportUrl)
            .then(response => {
              if (!response.ok) {
                throw new Error('Report not found');
              }
              return response.blob();
            })
            .then(blob => {
              fileName = reportUrl.split('/').pop() || `${title.replace(/\s+/g, '-')}-Report.pdf`;
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            })
            .catch(error => {
              console.error('Error downloading report:', error);
              alert('Report file not found. Please make sure the PDF file exists.');
            });
        }
      } catch (error) {
        console.error('Error accessing PDF storage:', error);
        alert('Error accessing the report. Please try again.');
      }
    } else {
      alert(`No report available for ${project.title}`);
    }
  };

  const isProject = (title: string) => {
    return project.title === title;
  };

  return (
    <div className="project-detail">
      <div className="container">
        <button onClick={() => navigate('/projects')} className="back-btn">
          ← Back to Projects
        </button>

        <div className="project-detail-content">
          <div className="project-detail-header">
            <h1 className="project-detail-title">{project.title}</h1>
            <div className="project-detail-meta">
              <span className="project-detail-year">{project.year}</span>
              <span className="project-detail-role">{project.role}</span>
            </div>
          </div>

          <div className="project-detail-body">
            <section className="detail-section">
              <h2>Description</h2>
              <p>{project.description}</p>
            </section>

            <section className="detail-section">
              <h2>Technologies Used</h2>
              <div className="detail-tech-list">
                {project.technologies.map((tech: string) => (
                  <span key={tech} className="detail-tech-tag">{tech}</span>
                ))}
              </div>
            </section>

            <section className="detail-section">
              <h2>Key Features</h2>
              <ul className="detail-features-list">
                {isProject("Heart Rate Sensor") && (
                  <>
                    <li>Real-time heart rate monitoring</li>
                    <li>Data visualization with charts</li>
                    <li>Historical data tracking</li>
                    <li>Alert system for abnormal readings</li>
                    <li>Blood pressure monitoring integration</li>
                    <li>Activity correlation analysis</li>
                    <li>Export health reports</li>
                    <li>User profile management</li>
                  </>
                )}
                {isProject("RouteMate") && (
                  <>
                    <li>Smart route optimization using real-time data</li>
                    <li>Real-time traffic updates and alternative routes</li>
                    <li>Voice navigation assistance</li>
                    <li>Offline maps support for seamless navigation</li>
                    <li>Favorite locations saving and quick access</li>
                    <li>Booking history and digital invoices</li>
                    <li>Admin dashboard for complete management</li>
                    <li>Estimated time of arrival (ETA) with live updates</li>
                    <li>Multiple transport mode options (car, bike, walking)</li>
                    <li>Price estimation and fare calculator</li>
                  </>
                )}
                {isProject("Real Estate Website") && (
                  <>
                    <li>Advanced property listing with multiple filters</li>
                    <li>Interactive map integration for property locations</li>
                    <li>Accessibility features for differently-abled users including voice commands</li>
                    <li>Agent contact system with membership plans</li>
                    <li>Saved searches and property alerts</li>
                    <li>Virtual property tours and 360° views</li>
                    <li>Mortgage calculator and financing options</li>
                    <li>Property comparison tool</li>
                    <li>User reviews and rating system</li>
                    <li>Document management for property transactions</li>
                  </>
                )}
                {isProject("Car Rental System") && (
                  <>
                    <li>Easy car booking and reservation system</li>
                    <li>Real-time vehicle availability checking</li>
                    <li>Secure user authentication and profile management</li>
                    <li>Multiple payment gateway integration</li>
                    <li>Complete booking history and digital invoices</li>
                    <li>Admin dashboard for fleet management</li>
                    <li>Vehicle tracking and GPS integration</li>
                    <li>Damage reporting and insurance management</li>
                    <li>Loyalty program and discount coupons</li>
                    <li>Automated email and SMS notifications</li>
                  </>
                )}
                {isProject("Multi-Agent Truck Logistics Simulator") && (
                  <>
                    <li>Built with Unity Game Engine for realistic 3D simulation</li>
                    <li>Hybrid pathfinding system switching between ACO and A* algorithms</li>
                    <li>10 waypoint nodes for complex navigation scenarios</li>
                    <li>10 package collection system with dynamic goal determination</li>
                    <li>Three autonomous trucks with independent decision making</li>
                    <li>Seamless algorithm transition from exploration to optimal return path</li>
                    <li>Real-time path recalculation and obstacle avoidance</li>
                    <li>Visual debugging tools for algorithm visualization</li>
                    <li>Pheromone trail visualization for ACO algorithm</li>
                    <li>Performance metrics and algorithm comparison dashboard</li>
                  </>
                )}
                {!isProject("Heart Rate Sensor") && 
                 !isProject("RouteMate") && 
                 !isProject("Real Estate Website") && 
                 !isProject("Car Rental System") && 
                 !isProject("Multi-Agent Truck Logistics Simulator") && (
                  <>
                    <li>Custom project with unique requirements</li>
                    <li>Implemented using latest technologies including {project.technologies.slice(0, 3).join(', ')}</li>
                    <li>Follows best practices and coding standards</li>
                    <li>Fully responsive and optimized for all devices</li>
                    <li>Secure authentication and authorization system</li>
                    <li>Database integration for persistent data storage</li>
                    <li>RESTful API architecture</li>
                    <li>Real-time data updates and synchronization</li>
                    <li>Comprehensive error handling and logging</li>
                    <li>Scalable architecture for future enhancements</li>
                  </>
                )}
              </ul>
            </section>

            {isProject("Multi-Agent Truck Logistics Simulator") && (
              <>
                <section className="detail-section">
                  <h2>Algorithm Implementation</h2>
                  <div className="algorithm-details">
                    <div className="algorithm-card">
                      <h3>Ant Colony Optimization (ACO)</h3>
                      <p>Initial phase algorithm used for exploration and package collection. Simulates ant pheromone trails to discover efficient collection routes across 10 waypoints.</p>
                      <ul>
                        <li>Pheromone evaporation and reinforcement learning</li>
                        <li>Probabilistic route selection based on pheromone intensity</li>
                        <li>Collective intelligence emergent behavior</li>
                      </ul>
                    </div>
                    <div className="algorithm-card">
                      <h3>A* Pathfinding Algorithm</h3>
                      <p>Activated after the last package is collected. Uses heuristic-based search to find the shortest path back to starting point.</p>
                      <ul>
                        <li>Manhattan distance heuristic for optimal pathfinding</li>
                        <li>Priority queue implementation for efficiency</li>
                        <li>Guaranteed shortest path return</li>
                      </ul>
                    </div>
                  </div>
                </section>

                <section className="detail-section">
                  <h2>Technical Architecture</h2>
                  <div className="tech-architecture">
                    <div className="arch-item">
                      <strong>Game Engine:</strong> Unity 2022 LTS with C# scripting
                    </div>
                    <div className="arch-item">
                      <strong>Pathfinding System:</strong> Custom implementation of ACO and A* algorithms
                    </div>
                    <div className="arch-item">
                      <strong>State Management:</strong> Finite state machine for algorithm switching
                    </div>
                    <div className="arch-item">
                      <strong>Visualization:</strong> Real-time debug visualization of paths and pheromone trails
                    </div>
                  </div>
                </section>

                <section className="detail-section">
                  <h2>Game Mechanics</h2>
                  <div className="game-mechanics">
                    <p><strong>Phase 1 - Exploration (ACO):</strong> Three trucks start from different waypoints and use ACO to efficiently collect all 10 packages scattered across the map.</p>
                    <p><strong>Phase 2 - Return (A*):</strong> Once the last package is collected, the system automatically switches to A* algorithm to calculate the optimal return path to the starting point.</p>
                    <p><strong>Multi-Agent Coordination:</strong> Trucks operate independently but share pheromone information, creating emergent collaborative behavior without direct communication.</p>
                  </div>
                </section>
              </>
            )}

            <section className="detail-section">
              <h2>Project Links</h2>
              <div className="project-links-container">
                {links.youtube && (
                  <a 
                    href={links.youtube} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-link-btn"
                  >
                    <FontAwesomeIcon icon={faYoutube} className="link-icon youtube-icon" />
                    <span>Watch Demo Video</span>
                  </a>
                )}
                {links.github && (
                  <a 
                    href={links.github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="project-link-btn"
                  >
                    <FontAwesomeIcon icon={faGithub} className="link-icon github-icon" />
                    <span>View GitHub Repository</span>
                  </a>
                )}
                {links.report && (
                  <button 
                    onClick={() => handleDownloadReport(links.report, project.title)} 
                    className="project-link-btn"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="link-icon report-icon">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                      <polyline points="7 10 12 15 17 10"/>
                      <line x1="12" y1="15" x2="12" y2="3"/>
                    </svg>
                    <span>Download Report (PDF)</span>
                  </button>
                )}
              </div>
            </section>

            <section className="detail-section">
              <h2>Additional Information</h2>
              <p>
                This project showcases expertise in {project.technologies.slice(0, 3).join(', ')} 
                and follows industry-standard best practices. For more information, please check the 
                {links.github ? " GitHub repository" : ""}
                {links.github && links.youtube ? " or " : ""}
                {links.youtube ? " demo video" : ""}
                {links.report ? " and detailed report" : ""}.
                {!links.github && !links.youtube && !links.report && " available resources above."}
              </p>
              {isProject("Multi-Agent Truck Logistics Simulator") && (
                <p className="unity-note">
                   <strong>Note:</strong> This project was developed using <strong>Unity Game Engine</strong> with custom C# scripts for all pathfinding algorithms. The simulation demonstrates advanced AI concepts in game development.
                </p>
              )}
              {isProject("RouteMate") && (
                <p className="tech-note">
                   <strong>Note:</strong> RouteMate uses real-time traffic data from multiple sources to provide the most accurate route suggestions. The system continuously learns from user feedback to improve route recommendations.
                </p>
              )}
              {isProject("Real Estate Website") && (
                <p className="tech-note">
                   <strong>Note:</strong> The voice command feature makes this platform accessible to users with visual impairments, demonstrating commitment to inclusive design and accessibility standards (WCAG 2.1 compliant).
                </p>
              )}
              {isProject("Car Rental System") && (
                <p className="tech-note">
                  🚙 <strong>Note:</strong> The system supports multiple payment methods including credit cards, digital wallets, and PayPal, with secure transaction processing and automatic receipt generation.
                </p>
              )}
              {isProject("Heart Rate Sensor") && (
                <p className="tech-note">
                   <strong>Note:</strong> This health monitoring system is designed for informational purposes and should not replace professional medical advice. Always consult with healthcare providers for medical concerns.
                </p>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;