'use client';
import { useState, useEffect, createContext, useContext } from 'react';

const CookieContext = createContext();

export const useCookieConsent = () => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error('useCookieConsent must be used within a CookieProvider');
  }
  return context;
};

export const CookieProvider = ({ children }) => {
  const [cookieConsent, setCookieConsent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load cookie consent from localStorage on mount
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      setCookieConsent(JSON.parse(savedConsent));
    }
    setIsLoading(false);
  }, []);

  const updateCookieConsent = (preferences) => {
    setCookieConsent(preferences);
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
  };

  const hasConsent = (type) => {
    return cookieConsent && cookieConsent[type] === true;
  };

  const trackEvent = (eventName, eventData = {}) => {
    // Only track if analytics consent is given
    if (hasConsent('analytics') && typeof window !== 'undefined') {
      // Google Analytics tracking
      if (window.gtag) {
        window.gtag('event', eventName, eventData);
      }
      
      // Custom analytics tracking
      console.log('Analytics Event:', eventName, eventData);
    }
  };

  const trackPageView = (page) => {
    if (hasConsent('analytics') && typeof window !== 'undefined') {
      // Google Analytics page view
      if (window.gtag) {
        window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
          page_path: page,
        });
      }
      
      console.log('Page View:', page);
    }
  };

  const setMarketingCookie = (name, value, days = 30) => {
    if (hasConsent('marketing') && typeof window !== 'undefined') {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }
  };

  const setFunctionalCookie = (name, value, days = 30) => {
    if (hasConsent('functional') && typeof window !== 'undefined') {
      const expires = new Date();
      expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
      document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }
  };

  const value = {
    cookieConsent,
    isLoading,
    updateCookieConsent,
    hasConsent,
    trackEvent,
    trackPageView,
    setMarketingCookie,
    setFunctionalCookie,
  };

  return (
    <CookieContext.Provider value={value}>
      {children}
    </CookieContext.Provider>
  );
};
