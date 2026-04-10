import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../contexts/AdminContext';
import { pdfStorage } from '../services/pdfStorage';
import { Education } from '../types';
import './AdminDashboard.css';

// Initialize PDF storage
pdfStorage.init().catch(console.error);

const AdminDashboard: React.FC = () => {
  const { 
    portfolioData, 
    logout, 
    saveToLocalStorage,
    resetToDefault,
    updatePersonalInfo,
    updateSkills,
    addProject,
    deleteProject,
    updateProject,
    workStatus,
    updateWorkStatus,
    addEducation,
    deleteEducation,
    updateEducation,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
    messages,
    markMessageAsRead,
    deleteMessage
  } = useAdmin();
  
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('personal');
  const [editingProject, setEditingProject] = useState<any>(null);
  const [editingEducation, setEditingEducation] = useState<{ education: Education; index: number } | null>(null);
  const [editingWork, setEditingWork] = useState<{ work: any; index: number } | null>(null);
  const [saveMessage, setSaveMessage] = useState('');

  useEffect(() => {
    document.body.classList.add('admin-mode');
    return () => {
      document.body.classList.remove('admin-mode');
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSave = () => {
    saveToLocalStorage();
    setSaveMessage('Changes saved successfully!');
    setTimeout(() => setSaveMessage(''), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to default data? This will lose all changes.')) {
      resetToDefault();
      setSaveMessage('Reset to default successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    }
  };

  const unreadCount = messages.filter(msg => !msg.read).length;

  return (
    <div className="admin-dashboard">
      <div className="admin-navbar">
        <div className="admin-nav-content">
          <h1 className="admin-logo">Portfolio Administration</h1>
          <div className="admin-nav-actions">
            {saveMessage && <div className="save-message">{saveMessage}</div>}
            <button onClick={handleSave} className="admin-save-btn">
              Save Changes
            </button>
            <button onClick={handleReset} className="admin-reset-btn">
              Reset to Default
            </button>
            <button onClick={handleLogout} className="admin-logout-btn">
              Exit Admin
            </button>
          </div>
        </div>
      </div>

      <div className="admin-container">
        <div className="admin-sidebar">
          <button 
            className={`admin-tab ${activeTab === 'personal' ? 'active' : ''}`}
            onClick={() => setActiveTab('personal')}
          >
            Personal Information
          </button>
          <button 
            className={`admin-tab ${activeTab === 'workstatus' ? 'active' : ''}`}
            onClick={() => setActiveTab('workstatus')}
          >
            Work Status
          </button>
          <button 
            className={`admin-tab ${activeTab === 'work' ? 'active' : ''}`}
            onClick={() => setActiveTab('work')}
          >
            Work Experience
          </button>
          <button 
            className={`admin-tab ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            Projects
          </button>
          <button 
            className={`admin-tab ${activeTab === 'skills' ? 'active' : ''}`}
            onClick={() => setActiveTab('skills')}
          >
            Skills
          </button>
          <button 
            className={`admin-tab ${activeTab === 'education' ? 'active' : ''}`}
            onClick={() => setActiveTab('education')}
          >
            Education
          </button>
          <button 
            className={`admin-tab ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            Messages {unreadCount > 0 && <span className="message-badge">{unreadCount}</span>}
          </button>
        </div>

        <div className="admin-content">
          {activeTab === 'personal' && (
            <PersonalInfoEditor 
              data={portfolioData.personal} 
              onUpdate={updatePersonalInfo} 
            />
          )}
          
          {activeTab === 'workstatus' && (
            <WorkStatusEditor 
              workStatus={workStatus}
              onUpdate={updateWorkStatus}
            />
          )}
          
          {activeTab === 'work' && (
            <WorkExperienceEditor 
              workExperiences={portfolioData.workExperiences || []}
              onAdd={addWorkExperience}
              onDelete={deleteWorkExperience}
              onEdit={(work, index) => setEditingWork({ work, index })}
            />
          )}
          
          {activeTab === 'projects' && (
            <ProjectsEditor 
              projects={portfolioData.projects}
              onAdd={addProject}
              onDelete={deleteProject}
              onEdit={setEditingProject}
            />
          )}
          
          {activeTab === 'skills' && (
            <SkillsEditor 
              skills={portfolioData.skills}
              onUpdate={updateSkills}
            />
          )}
          
          {activeTab === 'education' && (
            <EducationEditor 
              education={portfolioData.education}
              onAdd={addEducation}
              onDelete={deleteEducation}
              onEdit={(education, index) => setEditingEducation({ education, index })}
            />
          )}
          
          {activeTab === 'messages' && (
            <MessagesEditor 
              messages={messages}
              onMarkAsRead={markMessageAsRead}
              onDelete={deleteMessage}
            />
          )}
        </div>
      </div>

      {editingProject && (
        <ProjectModal 
          project={editingProject}
          onClose={() => setEditingProject(null)}
          onUpdate={updateProject}
        />
      )}

      {editingEducation && (
        <EducationModal 
          education={editingEducation.education}
          index={editingEducation.index}
          onClose={() => setEditingEducation(null)}
          onUpdate={updateEducation}
        />
      )}

      {editingWork && (
        <WorkModal 
          work={editingWork.work}
          index={editingWork.index}
          onClose={() => setEditingWork(null)}
          onUpdate={updateWorkExperience}
        />
      )}
    </div>
  );
};

const PersonalInfoEditor: React.FC<{ data: any; onUpdate: (data: any) => void }> = ({ data, onUpdate }) => {
  const [formData, setFormData] = useState(data);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    onUpdate({ [name]: value });
  };

  return (
    <div className="editor-section">
      <h2>Personal Information</h2>
      <div className="editor-form">
        <div className="form-group">
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Professional Title</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={formData.location} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Phone Number</label>
          <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Biography</label>
          <textarea name="bio" rows={4} value={formData.bio} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>LinkedIn URL</label>
          <input type="url" name="linkedin" value={formData.linkedin} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>GitHub URL</label>
          <input type="url" name="github" value={formData.github} onChange={handleChange} />
        </div>
      </div>
    </div>
  );
};

const WorkStatusEditor: React.FC<{ workStatus: 'open' | 'busy'; onUpdate: (status: 'open' | 'busy') => void }> = ({ workStatus, onUpdate }) => {
  const [localStatus, setLocalStatus] = useState(workStatus);

  const handleStatusChange = (status: 'open' | 'busy') => {
    setLocalStatus(status);
    onUpdate(status);
  };

  return (
    <div className="editor-section">
      <h2>Work Status</h2>
      <p className="status-description">This status appears next to your name in the navigation bar. Choose the option that best represents your current availability.</p>
      
      <div className="work-status-options">
        <button
          className={`status-option ${localStatus === 'open' ? 'active' : ''}`}
          onClick={() => handleStatusChange('open')}
        >
          <div className="status-option-dot open"></div>
          <div className="status-option-content">
            <h3>Open to work</h3>
            <p>Shows a green indicator with "Open to work" - Let employers know you're available for opportunities</p>
          </div>
        </button>
        
        <button
          className={`status-option ${localStatus === 'busy' ? 'active' : ''}`}
          onClick={() => handleStatusChange('busy')}
        >
          <div className="status-option-dot busy"></div>
          <div className="status-option-content">
            <h3>Busy working</h3>
            <p>Shows a red indicator with "Busy working" - Let visitors know you're currently occupied</p>
          </div>
        </button>
      </div>
      
      <div className="status-preview">
        <h3>Preview</h3>
        <div className="preview-container">
          <div className={`preview-badge ${localStatus}`}>
            <span className="preview-dot"></span>
            <span className="preview-text">{localStatus === 'open' ? 'Open to work' : 'Busy working'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkExperienceEditor: React.FC<{ 
  workExperiences: any[]; 
  onAdd: (work: any) => void; 
  onDelete: (index: number) => void; 
  onEdit: (work: any, index: number) => void 
}> = ({ workExperiences, onAdd, onDelete, onEdit }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newWork, setNewWork] = useState({
    company: '',
    role: '',
    year: '',
    description: ''
  });

  const handleAdd = () => {
    if (newWork.company && newWork.role && newWork.description) {
      onAdd({
        ...newWork,
        id: Date.now()
      });
      setNewWork({
        company: '',
        role: '',
        year: '',
        description: ''
      });
      setShowAddForm(false);
      alert('Work experience added successfully! Click "Save Changes" to persist.');
    } else {
      alert('Please fill in company, role, and description.');
    }
  };

  return (
    <div className="editor-section">
      <div className="section-header">
        <h2>Work Experience</h2>
        <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
          Add Work Experience
        </button>
      </div>

      {showAddForm && (
        <div className="add-form">
          <input 
            type="text" 
            placeholder="Company Name *" 
            value={newWork.company}
            onChange={(e) => setNewWork({ ...newWork, company: e.target.value })}
          />
          <input 
            type="text" 
            placeholder="Role / Position *" 
            value={newWork.role}
            onChange={(e) => setNewWork({ ...newWork, role: e.target.value })}
          />
          <input 
            type="text" 
            placeholder="Year / Period (e.g., 2023 - Present)" 
            value={newWork.year}
            onChange={(e) => setNewWork({ ...newWork, year: e.target.value })}
          />
          <textarea 
            placeholder="Description *" 
            rows={4}
            value={newWork.description}
            onChange={(e) => setNewWork({ ...newWork, description: e.target.value })}
          />
          <button onClick={handleAdd} className="save-btn">Save Work Experience</button>
        </div>
      )}

      <div className="work-list">
        {workExperiences.map((work: any, index: number) => (
          <div key={work.id || index} className="work-item">
            <div className="work-info">
              <div className="work-company">{work.company}</div>
              <div className="work-role">{work.role}</div>
              {work.year && <div className="work-year">{work.year}</div>}
              <p className="work-description">{work.description}</p>
            </div>
            <div className="work-actions">
              <button onClick={() => onEdit(work, index)} className="edit-btn">Edit</button>
              <button onClick={() => onDelete(index)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ProjectsEditor: React.FC<{ projects: any[]; onAdd: any; onDelete: any; onEdit: any }> = ({ 
  projects, onAdd, onDelete, onEdit 
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    role: '',
    year: new Date().getFullYear().toString(),
    description: '',
    technologies: [] as string[],
    links: {
      youtube: '',
      github: '',
      report: ''
    }
  });

  const [technologiesInput, setTechnologiesInput] = useState('');
  const [youtubeLink, setYoutubeLink] = useState('');
  const [githubLink, setGithubLink] = useState('');
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportFileName, setReportFileName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  const handleAdd = async () => {
    if (newProject.title && newProject.description) {
      const links: any = {};
      if (youtubeLink) links.youtube = youtubeLink;
      if (githubLink) links.github = githubLink;
      
      if (reportFile) {
        setUploadStatus('Processing PDF...');
        
        const uniqueFilename = `${Date.now()}_${reportFile.name}`;
        const reportPath = `/pdf/${uniqueFilename}`;
        links.report = reportPath;
        
        const reader = new FileReader();
        reader.onload = async function(e) {
          const pdfData = e.target?.result as string;
          try {
            await pdfStorage.savePDF(`pdf_${uniqueFilename}`, pdfData);
            setUploadStatus('PDF ready!');
            setTimeout(() => setUploadStatus(''), 2000);
          } catch (error) {
            console.error('Failed to save PDF:', error);
            setUploadStatus('Failed to save PDF!');
            setTimeout(() => setUploadStatus(''), 2000);
          }
        };
        reader.readAsDataURL(reportFile);
      }
      
      onAdd({
        ...newProject,
        id: Date.now(),
        technologies: technologiesInput.split(',').map((tech: string) => tech.trim()).filter((tech: string) => tech),
        links: links
      });
      
      setNewProject({
        title: '',
        role: '',
        year: new Date().getFullYear().toString(),
        description: '',
        technologies: [],
        links: { youtube: '', github: '', report: '' }
      });
      setTechnologiesInput('');
      setYoutubeLink('');
      setGithubLink('');
      setReportFile(null);
      setReportFileName('');
      setShowAddForm(false);
      alert('Project added successfully! Click "Save Changes" to persist.');
    } else {
      alert('Please fill in at least the title and description.');
    }
  };

  const handleReportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setReportFile(file);
        setReportFileName(file.name);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleRemoveReport = () => {
    setReportFile(null);
    setReportFileName('');
    const fileInput = document.getElementById('report-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  return (
    <div className="editor-section">
      <div className="section-header">
        <h2>Projects</h2>
        <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
          Add New Project
        </button>
      </div>

      {showAddForm && (
        <div className="add-form">
          <input 
            type="text" 
            placeholder="Project Title *" 
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
          />
          <input 
            type="text" 
            placeholder="Your Role *" 
            value={newProject.role}
            onChange={(e) => setNewProject({ ...newProject, role: e.target.value })}
          />
          <input 
            type="text" 
            placeholder="Year" 
            value={newProject.year}
            onChange={(e) => setNewProject({ ...newProject, year: e.target.value })}
          />
          <textarea 
            placeholder="Project Description *" 
            rows={4}
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
          />
          <input 
            type="text" 
            placeholder="Technologies (comma separated)" 
            value={technologiesInput}
            onChange={(e) => setTechnologiesInput(e.target.value)}
          />
          
          <div className="link-input-group">
            <label className="link-label youtube-label">
              <svg className="link-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube Video Link
            </label>
            <input 
              type="url" 
              placeholder="https://youtube.com/watch?v=..." 
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
            />
            <small>Paste your YouTube video URL here</small>
          </div>
          
          <div className="link-input-group">
            <label className="link-label github-label">
              <svg className="link-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.698.83.578C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub Repository Link
            </label>
            <input 
              type="url" 
              placeholder="https://github.com/username/repo" 
              value={githubLink}
              onChange={(e) => setGithubLink(e.target.value)}
            />
            <small>Paste your GitHub repository URL here</small>
          </div>
          
          <div className="link-input-group">
            <label className="link-label report-label">
              <svg className="link-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h12V9h-5V4H6zm10 10v2H8v-2h8zm0-4v2H8v-2h8z"/>
              </svg>
              Project Report (PDF)
            </label>
            <div className="file-upload-area">
              <input 
                type="file" 
                accept=".pdf"
                id="report-upload"
                onChange={handleReportFileChange}
                style={{ display: 'none' }}
              />
              <button 
                className="file-upload-btn"
                onClick={() => document.getElementById('report-upload')?.click()}
              >
                Choose PDF File
              </button>
              {reportFileName && (
                <>
                  <span className="file-name">{reportFileName}</span>
                  <button 
                    className="file-remove-btn"
                    onClick={handleRemoveReport}
                    title="Remove file"
                  >
                    ×
                  </button>
                </>
              )}
            </div>
            {uploadStatus && <div className="upload-status">{uploadStatus}</div>}
            <small>Upload a PDF report for this project. The file will be available for download on the project page.</small>
          </div>
          
          <button onClick={handleAdd} className="save-btn">Add Project</button>
        </div>
      )}

      <div className="projects-list-admin">
        {projects.map((project: any) => (
          <div key={project.id} className="project-item-admin">
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.description.substring(0, 100)}...</p>
              <div className="project-tech">
                {project.technologies.slice(0, 3).map((tech: string) => (
                  <span key={tech} className="tech-badge">{tech}</span>
                ))}
              </div>
              <div className="project-links-preview">
                {project.links?.youtube && (
                  <span className="link-badge youtube">
                    <svg className="badge-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    YouTube
                  </span>
                )}
                {project.links?.github && (
                  <span className="link-badge github">
                    <svg className="badge-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.698.83.578C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
                    </svg>
                    GitHub
                  </span>
                )}
                {project.links?.report && (
                  <span className="link-badge report">
                    <svg className="badge-icon" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h12V9h-5V4H6zm10 10v2H8v-2h8zm0-4v2H8v-2h8z"/>
                    </svg>
                    Report
                  </span>
                )}
              </div>
            </div>
            <div className="project-actions">
              <button onClick={() => onEdit(project)} className="edit-btn">Edit</button>
              <button onClick={() => onDelete(project.id)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SkillsEditor: React.FC<{ skills: any; onUpdate: any }> = ({ skills, onUpdate }) => {
  const [technicalSkill, setTechnicalSkill] = useState('');
  const [softSkill, setSoftSkill] = useState('');

  const addTechnicalSkill = () => {
    if (technicalSkill && !skills.technical.includes(technicalSkill)) {
      const updatedTechnical = [...skills.technical, technicalSkill];
      onUpdate({ technical: updatedTechnical });
      setTechnicalSkill('');
    }
  };

  const removeTechnicalSkill = (skill: string) => {
    const updatedTechnical = skills.technical.filter((s: string) => s !== skill);
    onUpdate({ technical: updatedTechnical });
  };

  const addSoftSkill = () => {
    if (softSkill && !skills.soft.includes(softSkill)) {
      const updatedSoft = [...skills.soft, softSkill];
      onUpdate({ soft: updatedSoft });
      setSoftSkill('');
    }
  };

  const removeSoftSkill = (skill: string) => {
    const updatedSoft = skills.soft.filter((s: string) => s !== skill);
    onUpdate({ soft: updatedSoft });
  };

  return (
    <div className="editor-section">
      <h2>Skills</h2>
      
      <div className="skills-editor">
        <div className="skill-group">
          <h3>Technical Skills</h3>
          <div className="skill-tags">
            {skills.technical.map((skill: string) => (
              <span key={skill} className="skill-tag">
                {skill}
                <button onClick={() => removeTechnicalSkill(skill)}>×</button>
              </span>
            ))}
          </div>
          <div className="add-skill">
            <input 
              type="text" 
              placeholder="Add technical skill" 
              value={technicalSkill}
              onChange={(e) => setTechnicalSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTechnicalSkill()}
            />
            <button onClick={addTechnicalSkill}>Add</button>
          </div>
        </div>

        <div className="skill-group">
          <h3>Soft Skills</h3>
          <div className="skill-tags">
            {skills.soft.map((skill: string) => (
              <span key={skill} className="skill-tag">
                {skill}
                <button onClick={() => removeSoftSkill(skill)}>×</button>
              </span>
            ))}
          </div>
          <div className="add-skill">
            <input 
              type="text" 
              placeholder="Add soft skill" 
              value={softSkill}
              onChange={(e) => setSoftSkill(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addSoftSkill()}
            />
            <button onClick={addSoftSkill}>Add</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const EducationEditor: React.FC<{ 
  education: Education[]; 
  onAdd: (education: Education) => void; 
  onDelete: (index: number) => void; 
  onEdit: (education: Education, index: number) => void 
}> = ({ education, onAdd, onDelete, onEdit }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEducation, setNewEducation] = useState<Education>({
    degree: '',
    institution: '',
    period: '',
    grade: ''
  });

  const handleAdd = () => {
    if (newEducation.degree && newEducation.institution) {
      const educationToAdd = {
        ...newEducation,
        id: Date.now(),
        grade: newEducation.grade || '',
        period: newEducation.period || ''
      };
      onAdd(educationToAdd);
      setNewEducation({ degree: '', institution: '', period: '', grade: '' });
      setShowAddForm(false);
      alert('Education added successfully! Click "Save Changes" to persist.');
    } else {
      alert('Please fill in at least the degree and institution.');
    }
  };

  return (
    <div className="editor-section">
      <div className="section-header">
        <h2>Education</h2>
        <button className="add-btn" onClick={() => setShowAddForm(!showAddForm)}>
          Add Education
        </button>
      </div>

      {showAddForm && (
        <div className="add-form">
          <input 
            type="text" 
            placeholder="Degree *" 
            value={newEducation.degree}
            onChange={(e) => setNewEducation({ ...newEducation, degree: e.target.value })}
          />
          <input 
            type="text" 
            placeholder="Institution *" 
            value={newEducation.institution}
            onChange={(e) => setNewEducation({ ...newEducation, institution: e.target.value })}
          />
          <input 
            type="text" 
            placeholder="Period (e.g., 2022-2025)" 
            value={newEducation.period || ''}
            onChange={(e) => setNewEducation({ ...newEducation, period: e.target.value })}
          />
          <input 
            type="text" 
            placeholder="Grade/CGPA (optional, e.g., 3.8/4.0 or A+)" 
            value={newEducation.grade || ''}
            onChange={(e) => setNewEducation({ ...newEducation, grade: e.target.value })}
          />
          <button onClick={handleAdd} className="save-btn">Save Education</button>
        </div>
      )}

      <div className="education-list">
        {education.map((edu: Education, index: number) => (
          <div key={edu.id || index} className="education-item">
            <div className="education-info">
              <h3>{edu.degree}</h3>
              <p>{edu.institution}</p>
              {edu.period && edu.period.trim() !== '' && (
                <small className="education-period">{edu.period}</small>
              )}
              {edu.grade && edu.grade.trim() !== '' && (
                <div className="education-grade">Grade: {edu.grade}</div>
              )}
            </div>
            <div className="education-actions">
              <button onClick={() => onEdit(edu, index)} className="edit-btn">Edit</button>
              <button onClick={() => onDelete(index)} className="delete-btn">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MessagesEditor: React.FC<{ 
  messages: any[]; 
  onMarkAsRead: (id: number) => void; 
  onDelete: (id: number) => void 
}> = ({ messages, onMarkAsRead, onDelete }) => {
  return (
    <div className="editor-section">
      <div className="section-header">
        <h2>Contact Messages</h2>
        <div className="message-stats">
          Total: {messages.length} | Unread: {messages.filter(m => !m.read).length}
        </div>
      </div>
      
      {messages.length === 0 ? (
        <div className="no-messages">
          <svg className="no-messages-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
          </svg>
          <p>No messages yet</p>
          <span>Messages from the contact form will appear here</span>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`message-card ${!message.read ? 'unread' : ''}`}
              onClick={() => !message.read && onMarkAsRead(message.id)}
            >
              <div className="message-card-header">
                <div className="message-sender-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {!message.read && (
                      <div className="unread-indicator-wrapper">
                        <span className="unread-badge">Unread</span>
                      </div>
                    )}
                    <strong className="message-sender-name">{message.name}</strong>
                  </div>
                  <span className="message-sender-email">{message.email}</span>
                </div>
                <div className="message-card-actions">
                  <span className="message-date">{message.date}</span>
                  <button 
                    className="delete-message-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(message.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="message-card-body">
                <p>{message.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const ProjectModal: React.FC<{ project: any; onClose: () => void; onUpdate: any }> = ({ project, onClose, onUpdate }) => {
  const [editedProject, setEditedProject] = useState(project);
  const [technologiesInput, setTechnologiesInput] = useState(project.technologies.join(', '));
  const [youtubeLink, setYoutubeLink] = useState(project.links?.youtube || '');
  const [githubLink, setGithubLink] = useState(project.links?.github || '');
  const [reportLink, setReportLink] = useState(project.links?.report || '');
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [reportFileName, setReportFileName] = useState('');
  const [uploadStatus, setUploadStatus] = useState('');

  const handleReportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type === 'application/pdf') {
        setReportFile(file);
        setReportFileName(file.name);
      } else {
        alert('Please upload a PDF file');
      }
    }
  };

  const handleRemoveReport = () => {
    setReportFile(null);
    setReportFileName('');
    setUploadStatus('');
    const fileInput = document.getElementById('edit-report-upload') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const handleSave = async () => {
    const links: any = {};
    if (youtubeLink) links.youtube = youtubeLink;
    if (githubLink) links.github = githubLink;
    
    if (reportFile) {
      setUploadStatus('Processing PDF...');
      
      const uniqueFilename = `${Date.now()}_${reportFile.name}`;
      const reportPath = `/pdf/${uniqueFilename}`;
      links.report = reportPath;
      
      const reader = new FileReader();
      reader.onload = async function(e) {
        const pdfData = e.target?.result as string;
        try {
          await pdfStorage.savePDF(`pdf_${uniqueFilename}`, pdfData);
          setUploadStatus('PDF ready!');
          setTimeout(() => setUploadStatus(''), 2000);
        } catch (error) {
          console.error('Failed to save PDF:', error);
          setUploadStatus('Failed to save PDF!');
          setTimeout(() => setUploadStatus(''), 2000);
        }
      };
      reader.readAsDataURL(reportFile);
    } else if (reportLink) {
      links.report = reportLink;
    }
    
    setTimeout(() => {
      onUpdate(project.id, {
        ...editedProject,
        technologies: technologiesInput.split(',').map((tech: string) => tech.trim()).filter((tech: string) => tech),
        links: links
      });
      onClose();
    }, 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Project</h2>
        <input 
          type="text" 
          placeholder="Title" 
          value={editedProject.title}
          onChange={(e) => setEditedProject({ ...editedProject, title: e.target.value })}
        />
        <input 
          type="text" 
          placeholder="Role" 
          value={editedProject.role}
          onChange={(e) => setEditedProject({ ...editedProject, role: e.target.value })}
        />
        <input 
          type="text" 
          placeholder="Year" 
          value={editedProject.year}
          onChange={(e) => setEditedProject({ ...editedProject, year: e.target.value })}
        />
        <textarea 
          placeholder="Description" 
          rows={4}
          value={editedProject.description}
          onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
        />
        <input 
          type="text" 
          placeholder="Technologies (comma separated)" 
          value={technologiesInput}
          onChange={(e) => setTechnologiesInput(e.target.value)}
        />
        
        <div className="link-input-group">
          <label className="link-label youtube-label">
            <svg className="link-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
            </svg>
            YouTube Video Link
          </label>
          <input 
            type="url" 
            placeholder="https://youtube.com/watch?v=..." 
            value={youtubeLink}
            onChange={(e) => setYoutubeLink(e.target.value)}
          />
        </div>
        
        <div className="link-input-group">
          <label className="link-label github-label">
            <svg className="link-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.58 0-.287-.01-1.05-.015-2.06-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.082-.73.082-.73 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.468-2.38 1.235-3.22-.123-.3-.535-1.52.117-3.16 0 0 1.008-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.29-1.552 3.297-1.23 3.297-1.23.653 1.64.24 2.86.118 3.16.768.84 1.233 1.91 1.233 3.22 0 4.61-2.804 5.62-5.476 5.92.43.37.824 1.102.824 2.22 0 1.602-.015 2.894-.015 3.287 0 .322.216.698.83.578C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            GitHub Repository Link
          </label>
          <input 
            type="url" 
            placeholder="https://github.com/username/repo" 
            value={githubLink}
            onChange={(e) => setGithubLink(e.target.value)}
          />
        </div>
        
        <div className="link-input-group">
          <label className="link-label report-label">
            <svg className="link-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 2h8l6 6v12a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm0 2v16h12V9h-5V4H6zm10 10v2H8v-2h8zm0-4v2H8v-2h8z"/>
            </svg>
            Project Report (PDF)
          </label>
          
          {reportLink && !reportFile && (
            <div className="existing-report">
              <span className="existing-report-label">Current Report:</span>
              <span className="existing-report-name">{reportLink.split('/').pop()}</span>
              <button 
                className="remove-existing-report"
                onClick={() => {
                  setReportLink('');
                  setReportFileName('');
                }}
                title="Remove existing report"
              >
                ×
              </button>
            </div>
          )}
          
          <div className="file-upload-area">
            <input 
              type="file" 
              accept=".pdf"
              id="edit-report-upload"
              onChange={handleReportFileChange}
              style={{ display: 'none' }}
            />
            <button 
              className="file-upload-btn"
              onClick={() => document.getElementById('edit-report-upload')?.click()}
            >
              {reportFile ? 'Change PDF File' : 'Upload New PDF'}
            </button>
            {reportFileName && (
              <>
                <span className="file-name">{reportFileName}</span>
                <button 
                  className="file-remove-btn"
                  onClick={handleRemoveReport}
                  title="Remove file"
                >
                  ×
                </button>
              </>
            )}
          </div>
          {uploadStatus && <div className="upload-status">{uploadStatus}</div>}
          <small>Upload a PDF report. The file will be available for download on the project page.</small>
        </div>
        
        <div className="modal-actions">
          <button onClick={handleSave} className="save-btn">Save Changes</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const EducationModal: React.FC<{ 
  education: Education; 
  index: number;
  onClose: () => void; 
  onUpdate: (index: number, education: Education) => void 
}> = ({ education, index, onClose, onUpdate }) => {
  const [editedEducation, setEditedEducation] = useState<Education>({
    ...education,
    grade: education.grade || '',
    period: education.period || ''
  });

  const handleSave = () => {
    onUpdate(index, editedEducation);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Education</h2>
        <input 
          type="text" 
          placeholder="Degree" 
          value={editedEducation.degree}
          onChange={(e) => setEditedEducation({ ...editedEducation, degree: e.target.value })}
        />
        <input 
          type="text" 
          placeholder="Institution" 
          value={editedEducation.institution}
          onChange={(e) => setEditedEducation({ ...editedEducation, institution: e.target.value })}
        />
        <input 
          type="text" 
          placeholder="Period (e.g., 2022-2025)" 
          value={editedEducation.period || ''}
          onChange={(e) => setEditedEducation({ ...editedEducation, period: e.target.value })}
        />
        <input 
          type="text" 
          placeholder="Grade/CGPA (optional, e.g., 3.8/4.0 or A+)" 
          value={editedEducation.grade || ''}
          onChange={(e) => setEditedEducation({ ...editedEducation, grade: e.target.value })}
        />
        <div className="modal-actions">
          <button onClick={handleSave} className="save-btn">Save Changes</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

const WorkModal: React.FC<{ 
  work: any; 
  index: number;
  onClose: () => void; 
  onUpdate: (index: number, work: any) => void 
}> = ({ work, index, onClose, onUpdate }) => {
  const [editedWork, setEditedWork] = useState(work);

  const handleSave = () => {
    if (editedWork.company && editedWork.role && editedWork.description) {
      onUpdate(index, editedWork);
      onClose();
    } else {
      alert('Please fill in company, role, and description.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Work Experience</h2>
        <input 
          type="text" 
          placeholder="Company Name *" 
          value={editedWork.company}
          onChange={(e) => setEditedWork({ ...editedWork, company: e.target.value })}
        />
        <input 
          type="text" 
          placeholder="Role / Position *" 
          value={editedWork.role}
          onChange={(e) => setEditedWork({ ...editedWork, role: e.target.value })}
        />
        <input 
          type="text" 
          placeholder="Year / Period" 
          value={editedWork.year || ''}
          onChange={(e) => setEditedWork({ ...editedWork, year: e.target.value })}
        />
        <textarea 
          placeholder="Description *" 
          rows={4}
          value={editedWork.description}
          onChange={(e) => setEditedWork({ ...editedWork, description: e.target.value })}
        />
        <div className="modal-actions">
          <button onClick={handleSave} className="save-btn">Save Changes</button>
          <button onClick={onClose} className="cancel-btn">Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;