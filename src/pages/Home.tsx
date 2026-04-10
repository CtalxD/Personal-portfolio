import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAdmin } from '../contexts/AdminContext';
import './Home.css';

const Home: React.FC = () => {
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

  // Animation variants for sequential reveal
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Each child appears 0.2s after the previous
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const }, // Fixed: added 'as const'
    },
  };

  // Intersection Observer hook to trigger animation when in view
  const { ref, inView } = useInView({
    triggerOnce: true, // Animation plays only once
    threshold: 0.2,    // Triggers when 20% of the component is visible
  });

  return (
    <div className="home">
      <div className="container">
        <motion.div
          ref={ref}
          className="home-content"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <motion.div variants={itemVariants} className="home-greeting">
            <span className="home-greeting-line">Hi, I'm</span>
            <h1 className="home-name">{portfolioData.personal.name}</h1>
          </motion.div>
          
          <motion.h2 variants={itemVariants} className="home-title">
            {portfolioData.personal.title}
          </motion.h2>
          
          <motion.p variants={itemVariants} className="home-bio">
            {portfolioData.personal.bio}
          </motion.p>
          
          <motion.div variants={itemVariants} className="home-buttons">
            <Link to="/projects" className="home-btn-primary">
              View my work
            </Link>
            <Link to="/contact" className="home-btn-secondary">
              Get in touch
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;