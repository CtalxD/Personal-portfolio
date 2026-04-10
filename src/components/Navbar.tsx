import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [pillStyle, setPillStyle] = useState({ left: 0, width: 0 });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [workStatus, setWorkStatus] = useState<'open' | 'busy'>('open');
  const navRef = useRef<HTMLDivElement>(null);
  const navItemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  
  // Secret admin trigger states - completely hidden
  const [clickCount, setClickCount] = useState(0);
  const [clickTimer, setClickTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  const navItems = [
    { path: '/', name: 'Home' },
    { path: '/work', name: 'Work' },
    { path: '/projects', name: 'Projects' },
    { path: '/about', name: 'About' },
    { path: '/contact', name: 'Contact' },
  ];

  // Load work status from localStorage
  useEffect(() => {
    const savedStatus = localStorage.getItem('work_status');
    if (savedStatus === 'open' || savedStatus === 'busy') {
      setWorkStatus(savedStatus);
    }
  }, []);

  // Listen for work status changes from admin panel
  useEffect(() => {
    const handleWorkStatusUpdate = (e: Event) => {
      const customEvent = e as CustomEvent;
      setWorkStatus(customEvent.detail);
    };
    
    window.addEventListener('workStatusUpdated', handleWorkStatusUpdate);
    
    return () => {
      window.removeEventListener('workStatusUpdated', handleWorkStatusUpdate);
    };
  }, []);

  useEffect(() => {
    const updatePillPosition = () => {
      const activeIndex = navItems.findIndex(item => item.path === location.pathname);
      const activeElement = navItemsRef.current[activeIndex];
      const container = navRef.current;
      
      if (activeElement && container) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        
        setPillStyle({
          left: elementRect.left - containerRect.left,
          width: elementRect.width
        });
      }
    };

    updatePillPosition();
    window.addEventListener('resize', updatePillPosition);
    return () => window.removeEventListener('resize', updatePillPosition);
  }, [location.pathname]);

  const setItemRef = (index: number) => (el: HTMLAnchorElement | null) => {
    navItemsRef.current[index] = el;
  };

  const getStatusColor = () => {
    return workStatus === 'open' ? '#4ade80' : '#ef4444';
  };

  const getStatusText = () => {
    return workStatus === 'open' ? 'Open to work' : 'Busy working';
  };

  // Secret admin trigger handler - NO VISUAL FEEDBACK
  const handleNameClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    // Clear previous timer
    if (clickTimer) {
      clearTimeout(clickTimer);
    }
    
    // Set timer to reset clicks after 1.5 seconds of inactivity
    const timer = setTimeout(() => {
      setClickCount(0);
    }, 1500);
    
    setClickTimer(timer);
    
    // If 11 clicks detected, navigate to admin (completely silent)
    if (newCount === 11) {
      setClickCount(0);
      if (clickTimer) clearTimeout(clickTimer);
      navigate('/admin');
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link 
          to="/" 
          className="navbar-logo"
          onClick={handleNameClick}
          style={{ cursor: 'pointer' }}
        >
          <span 
            className="logo-dot" 
            style={{ 
              background: getStatusColor(),
              boxShadow: `0 0 8px ${getStatusColor()}`
            }}
          />
          Sital Aryal
        </Link>

        <div className="nav-center" ref={navRef}>
          <span className="active-pill" style={{ left: pillStyle.left, width: pillStyle.width }} />
          {navItems.map((item, index) => (
            <Link
              key={item.path}
              to={item.path}
              ref={setItemRef(index)}
              className={`nl ${location.pathname === item.path ? 'nl-active' : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div className="nav-right">
          <div className="status-selector">
            <div 
              className="status-display"
              style={{ borderColor: getStatusColor() }}
            >
              <span 
                className="status-dot" 
                style={{ background: getStatusColor() }}
              />
              <span className="status-text">{getStatusText()}</span>
            </div>
          </div>
          <Link to="/contact" className="nav-cta">Let's talk</Link>
        </div>

        <button
          className={`hamburger ${isMobileOpen ? 'open' : ''}`}
          onClick={() => setIsMobileOpen(!isMobileOpen)}
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`mobile-menu ${isMobileOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`mobile-link ${location.pathname === item.path ? 'mobile-link-active' : ''}`}
            onClick={() => setIsMobileOpen(false)}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;