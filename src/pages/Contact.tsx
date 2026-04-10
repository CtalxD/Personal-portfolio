import React, { useEffect, useState, useRef } from 'react';
import { useAdmin } from '../contexts/AdminContext';
import './Contact.css';

const Contact: React.FC = () => {
  const { portfolioData, loadFromLocalStorage, addMessage } = useAdmin();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const statusTimeoutRef = useRef<number | null>(null);

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
      if (statusTimeoutRef.current) {
        clearTimeout(statusTimeoutRef.current);
      }
    };
  }, [loadFromLocalStorage]);

  const validateForm = () => {
    const newErrors = {
      name: '',
      email: '',
      message: ''
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const resetForm = () => {
    // Reset all form fields
    setFormData({
      name: '',
      email: '',
      message: ''
    });
    // Clear all errors
    setErrors({
      name: '',
      email: '',
      message: ''
    });
    // Reset submitting state
    setIsSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) {
      return;
    }
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      try {
        // Send message to admin dashboard
        addMessage({
          name: formData.name,
          email: formData.email,
          message: formData.message
        });
        
        // Show success message
        setSubmitStatus({
          type: 'success',
          message: '✓ Message sent successfully! I will get back to you soon.'
        });
        
        // Reset form immediately after successful submission
        resetForm();
        
        // Clear status message after 2 seconds and ensure form is ready for next submission
        if (statusTimeoutRef.current) {
          clearTimeout(statusTimeoutRef.current);
        }
        
        statusTimeoutRef.current = window.setTimeout(() => {
          setSubmitStatus(null);
          // Ensure submitting state is false after message disappears
          setIsSubmitting(false);
        }, 2000);
        
      } catch (error) {
        console.error('Error sending message:', error);
        setSubmitStatus({
          type: 'error',
          message: '✗ Failed to send message. Please try again.'
        });
        
        // Reset submitting state after error
        statusTimeoutRef.current = window.setTimeout(() => {
          setSubmitStatus(null);
          setIsSubmitting(false);
        }, 2000);
      }
    }
  };

  return (
    <div className="contact">
      <div className="container">
        <div className="contact-header fade-up">
          <h1 className="contact-title">Contact</h1>
          <p className="contact-subtitle">Get in touch</p>
        </div>
        
        <div className="contact-grid">
          <div className="contact-info fade-up" style={{ animationDelay: '0.1s' }}>
            {/* Email - only show if exists */}
            {portfolioData.personal?.email && portfolioData.personal.email.trim() !== '' && (
              <div className="contact-info-item">
                <h3 className="contact-info-label">Email</h3>
                <a href={`mailto:${portfolioData.personal.email}`} className="contact-info-value">
                  {portfolioData.personal.email}
                </a>
              </div>
            )}
            
            {/* Phone - only show if exists */}
            {portfolioData.personal?.phone && portfolioData.personal.phone.trim() !== '' && (
              <div className="contact-info-item">
                <h3 className="contact-info-label">Phone</h3>
                <span className="contact-info-value">{portfolioData.personal.phone}</span>
              </div>
            )}
            
            {/* Location - only show if exists */}
            {portfolioData.personal?.location && portfolioData.personal.location.trim() !== '' && (
              <div className="contact-info-item">
                <h3 className="contact-info-label">Location</h3>
                <span className="contact-info-value">{portfolioData.personal.location}</span>
              </div>
            )}
            
            {/* Social links - only show if at least one exists */}
            {(portfolioData.personal?.github || portfolioData.personal?.linkedin) && (
              <div className="contact-info-item">
                <h3 className="contact-info-label">Social</h3>
                <div className="contact-social">
                  {portfolioData.personal.github && portfolioData.personal.github.trim() !== '' && (
                    <a href={portfolioData.personal.github} target="_blank" rel="noopener noreferrer" className="contact-social-link">
                      GitHub
                    </a>
                  )}
                  {portfolioData.personal.linkedin && portfolioData.personal.linkedin.trim() !== '' && (
                    <a href={portfolioData.personal.linkedin} target="_blank" rel="noopener noreferrer" className="contact-social-link">
                      LinkedIn
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="contact-form-container fade-up" style={{ animationDelay: '0.2s' }}>
            {submitStatus && (
              <div className={`contact-submit-status ${submitStatus.type}`}>
                {submitStatus.message}
              </div>
            )}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="contact-form-group">
                <input 
                  type="text" 
                  name="name"
                  placeholder="Your Name *" 
                  className={`contact-input ${errors.name ? 'error' : ''}`}
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <span className="contact-error">{errors.name}</span>}
              </div>
              <div className="contact-form-group">
                <input 
                  type="email" 
                  name="email"
                  placeholder="Your Email *" 
                  className={`contact-input ${errors.email ? 'error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <span className="contact-error">{errors.email}</span>}
              </div>
              <div className="contact-form-group">
                <textarea 
                  name="message"
                  rows={5} 
                  placeholder="Your Message *" 
                  className={`contact-textarea ${errors.message ? 'error' : ''}`}
                  value={formData.message}
                  onChange={handleChange}
                ></textarea>
                {errors.message && <span className="contact-error">{errors.message}</span>}
              </div>
              <button 
                type="submit" 
                className="contact-submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;