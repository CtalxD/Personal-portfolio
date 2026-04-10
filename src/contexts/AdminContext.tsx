import React, { createContext, useContext, useState, useEffect } from 'react';
import { portfolioData as initialData } from '../data/portfolioData';
import { PortfolioData, Project, Education, Message, WorkExperience } from '../types';

interface AdminContextType {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  portfolioData: PortfolioData;
  workStatus: 'open' | 'busy';
  messages: Message[];
  updateWorkStatus: (status: 'open' | 'busy') => void;
  updatePersonalInfo: (data: any) => void;
  addProject: (project: Project) => void;
  updateProject: (id: number, project: Project) => void;
  deleteProject: (id: number) => void;
  updateSkills: (skills: any) => void;
  addEducation: (education: Education) => void;
  updateEducation: (index: number, education: Education) => void;
  deleteEducation: (index: number) => void;
  addWorkExperience: (work: WorkExperience) => void;
  updateWorkExperience: (index: number, work: WorkExperience) => void;
  deleteWorkExperience: (index: number) => void;
  addMessage: (message: Omit<Message, 'id' | 'date' | 'read'>) => void;
  markMessageAsRead: (id: number) => void;
  deleteMessage: (id: number) => void;
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
  resetToDefault: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_SECRET = 'ctalxd123';
const STORAGE_KEY = 'portfolio_admin_data';
const WORK_STATUS_KEY = 'work_status';
const MESSAGES_KEY = 'portfolio_messages';

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [portfolioData, setPortfolioData] = useState<PortfolioData>(initialData);
  const [workStatus, setWorkStatus] = useState<'open' | 'busy'>('open');
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    loadFromLocalStorage();
    loadMessages();
    const savedStatus = localStorage.getItem(WORK_STATUS_KEY);
    if (savedStatus === 'open' || savedStatus === 'busy') {
      setWorkStatus(savedStatus);
    }
  }, []);

  const login = (password: string): boolean => {
    if (password === ADMIN_SECRET) {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_auth');
  };

  const loadMessages = () => {
    const savedMessages = localStorage.getItem(MESSAGES_KEY);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Failed to parse messages:', error);
        setMessages([]);
      }
    } else {
      setMessages([]);
    }
  };

  const saveMessages = (newMessages: Message[]) => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(newMessages));
  };

  const saveToLocalStorage = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolioData));
    saveMessages(messages);
    window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: portfolioData }));
    alert('Changes saved successfully!');
  };

  const loadFromLocalStorage = () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsedData = JSON.parse(saved);
      if (parsedData.education && Array.isArray(parsedData.education)) {
        parsedData.education = parsedData.education.map((edu: Education) => ({
          ...edu,
          grade: edu.grade || '',
          period: edu.period || ''
        }));
      }
      if (!parsedData.skills) {
        parsedData.skills = { technical: [], soft: [] };
      }
      if (!parsedData.skills.technical) {
        parsedData.skills.technical = [];
      }
      if (!parsedData.skills.soft) {
        parsedData.skills.soft = [];
      }
      if (!parsedData.workExperiences) {
        parsedData.workExperiences = [];
      }
      setPortfolioData(parsedData);
      window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: parsedData }));
    }
  };

  const resetToDefault = () => {
    if (window.confirm('Are you sure you want to reset to default data? This will lose all changes.')) {
      const defaultData = {
        ...initialData,
        education: initialData.education.map(edu => ({
          ...edu,
          grade: edu.grade || '',
          period: edu.period || ''
        })),
        skills: {
          technical: [...initialData.skills.technical],
          soft: [...initialData.skills.soft]
        },
        workExperiences: [...(initialData.workExperiences || [])]
      };
      setPortfolioData(defaultData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      setMessages([]);
      localStorage.removeItem(MESSAGES_KEY);
      window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: defaultData }));
      alert('Reset to default successfully!');
    }
  };

  const updateWorkStatus = (status: 'open' | 'busy') => {
    setWorkStatus(status);
    localStorage.setItem(WORK_STATUS_KEY, status);
    window.dispatchEvent(new CustomEvent('workStatusUpdated', { detail: status }));
  };

  const updatePersonalInfo = (data: any) => {
    setPortfolioData(prev => {
      const updatedData = {
        ...prev,
        personal: { ...prev.personal, ...data }
      };
      return updatedData;
    });
  };

  const addProject = (project: Project) => {
    const newId = Math.max(...portfolioData.projects.map(p => p.id), 0) + 1;
    const updatedData = {
      ...portfolioData,
      projects: [...portfolioData.projects, { ...project, id: newId }]
    };
    setPortfolioData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: updatedData }));
  };

  const updateProject = (id: number, updatedProject: Project) => {
    const updatedData = {
      ...portfolioData,
      projects: portfolioData.projects.map(p => p.id === id ? updatedProject : p)
    };
    setPortfolioData(updatedData);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
    window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: updatedData }));
  };

  const deleteProject = (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      const updatedData = {
        ...portfolioData,
        projects: portfolioData.projects.filter(p => p.id !== id)
      };
      setPortfolioData(updatedData);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: updatedData }));
    }
  };

  const updateSkills = (skills: any) => {
    setPortfolioData(prev => {
      const updatedData = {
        ...prev,
        skills: { 
          technical: skills.technical !== undefined ? [...skills.technical] : [...prev.skills.technical],
          soft: skills.soft !== undefined ? [...skills.soft] : [...prev.skills.soft]
        }
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: updatedData }));
      return updatedData;
    });
  };

  const addEducation = (education: Education) => {
    const educationWithFields = {
      ...education,
      id: education.id || Date.now(),
      grade: education.grade || '',
      period: education.period || ''
    };
    
    setPortfolioData(prev => {
      const updatedData = {
        ...prev,
        education: [...prev.education, educationWithFields]
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: updatedData }));
      return updatedData;
    });
  };

  const updateEducation = (index: number, education: Education) => {
    const educationWithFields = {
      ...education,
      grade: education.grade || '',
      period: education.period || ''
    };
    
    setPortfolioData(prev => {
      const updatedEducation = prev.education.map((e, i) => 
        i === index ? educationWithFields : e
      );
      const updatedData = {
        ...prev,
        education: updatedEducation
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: updatedData }));
      return updatedData;
    });
  };

  const deleteEducation = (index: number) => {
    if (window.confirm('Are you sure you want to delete this education entry?')) {
      setPortfolioData(prev => {
        const updatedData = {
          ...prev,
          education: prev.education.filter((_, i) => i !== index)
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
        window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: updatedData }));
        return updatedData;
      });
    }
  };

  const addWorkExperience = (work: WorkExperience) => {
    const workWithFields = {
      ...work,
      id: work.id || Date.now()
    };
    
    setPortfolioData(prev => {
      const updatedData = {
        ...prev,
        workExperiences: [...(prev.workExperiences || []), workWithFields]
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: updatedData }));
      return updatedData;
    });
  };

  const updateWorkExperience = (index: number, work: WorkExperience) => {
    setPortfolioData(prev => {
      const updatedWork = [...(prev.workExperiences || [])];
      updatedWork[index] = work;
      const updatedData = {
        ...prev,
        workExperiences: updatedWork
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
      window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: updatedData }));
      return updatedData;
    });
  };

  const deleteWorkExperience = (index: number) => {
    if (window.confirm('Are you sure you want to delete this work experience?')) {
      setPortfolioData(prev => {
        const updatedData = {
          ...prev,
          workExperiences: (prev.workExperiences || []).filter((_, i) => i !== index)
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
        window.dispatchEvent(new CustomEvent('portfolioDataUpdated', { detail: updatedData }));
        return updatedData;
      });
    }
  };

  const addMessage = (message: Omit<Message, 'id' | 'date' | 'read'>) => {
    const newMessage: Message = {
      ...message,
      id: Date.now(),
      date: new Date().toLocaleString(),
      read: false
    };
    
    const currentMessagesJson = localStorage.getItem(MESSAGES_KEY);
    let currentMessages: Message[] = [];
    
    if (currentMessagesJson) {
      try {
        currentMessages = JSON.parse(currentMessagesJson);
      } catch (error) {
        console.error('Failed to parse messages:', error);
        currentMessages = [];
      }
    }
    
    const isDuplicate = currentMessages.some(msg => 
      msg.name === newMessage.name && 
      msg.email === newMessage.email && 
      msg.message === newMessage.message &&
      Math.abs(new Date(msg.date).getTime() - new Date(newMessage.date).getTime()) < 60000
    );
    
    if (!isDuplicate) {
      const updatedMessages = [newMessage, ...currentMessages];
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(updatedMessages));
      setMessages(updatedMessages);
    }
  };

  const markMessageAsRead = (id: number) => {
    setMessages(prev => {
      const updatedMessages = prev.map(msg => 
        msg.id === id ? { ...msg, read: true } : msg
      );
      saveMessages(updatedMessages);
      return updatedMessages;
    });
  };

  const deleteMessage = (id: number) => {
    if (window.confirm('Are you sure you want to delete this message?')) {
      setMessages(prev => {
        const updatedMessages = prev.filter(msg => msg.id !== id);
        saveMessages(updatedMessages);
        return updatedMessages;
      });
    }
  };

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      login,
      logout,
      portfolioData,
      workStatus,
      messages,
      updateWorkStatus,
      updatePersonalInfo,
      addProject,
      updateProject,
      deleteProject,
      updateSkills,
      addEducation,
      updateEducation,
      deleteEducation,
      addWorkExperience,
      updateWorkExperience,
      deleteWorkExperience,
      addMessage,
      markMessageAsRead,
      deleteMessage,
      saveToLocalStorage,
      loadFromLocalStorage,
      resetToDefault
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider');
  }
  return context;
};