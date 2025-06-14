'use client';
import { useState, useEffect } from 'react';
import { 
  XMarkIcon, 
  ShieldCheckIcon, 
  CogIcon,
  InformationCircleIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always required
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      setShowBanner(true);
    } else {
      // Load saved preferences
      const savedPreferences = JSON.parse(cookieConsent);
      setPreferences(savedPreferences);
      // Initialize tracking based on preferences
      initializeTracking(savedPreferences);
    }
  }, []);

  const initializeTracking = (prefs) => {
    // Initialize Google Analytics if analytics is enabled
    if (prefs.analytics && typeof window !== 'undefined') {
      // Add your Google Analytics initialization here
      console.log('Analytics tracking enabled');
    }
    
    // Initialize marketing tools if marketing is enabled
    if (prefs.marketing && typeof window !== 'undefined') {
      // Add your marketing tracking here (Facebook Pixel, etc.)
      console.log('Marketing tracking enabled');
    }
    
    // Initialize functional cookies if enabled
    if (prefs.functional && typeof window !== 'undefined') {
      // Add functional tracking here
      console.log('Functional cookies enabled');
    }
  };

  const handleAcceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    setPreferences(allAccepted);
    localStorage.setItem('cookieConsent', JSON.stringify(allAccepted));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    initializeTracking(allAccepted);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleAcceptSelected = () => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    initializeTracking(preferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const handleRejectAll = () => {
    const necessaryOnly = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    setPreferences(necessaryOnly);
    localStorage.setItem('cookieConsent', JSON.stringify(necessaryOnly));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  };

  const handlePreferenceChange = (type) => {
    if (type === 'necessary') return; // Cannot disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Main Cookie Banner */}
      {!showSettings && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl">
          <div className="max-w-7xl mx-auto p-6">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <ShieldCheckIcon className="w-6 h-6 text-blue-600 mt-0.5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      We value your privacy
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. 
                      By clicking "Accept All", you consent to our use of cookies. You can manage your preferences or learn more in our 
                      <a href="/privacy-policy" className="text-blue-600 hover:text-blue-700 underline ml-1">
                        Privacy Policy
                      </a>.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                <button
                  onClick={() => setShowSettings(true)}
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  <CogIcon className="w-4 h-4 mr-2" />
                  Customize
                </button>
                
                <button
                  onClick={handleRejectAll}
                  className="flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  Reject All
                </button>
                
                <button
                  onClick={handleAcceptAll}
                  className="flex items-center justify-center px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  <CheckIcon className="w-4 h-4 mr-2" />
                  Accept All
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
              onClick={() => setShowSettings(false)}
            ></div>

            {/* Modal */}
            <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Cookie Preferences
                </h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <p className="text-gray-600">
                  Manage your cookie preferences below. You can enable or disable different types of cookies. 
                  Note that disabling some types of cookies may impact your experience on our website.
                </p>

                {/* Necessary Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Necessary Cookies
                      </h4>
                      <p className="text-sm text-gray-600">
                        These cookies are essential for the website to function properly. They enable core functionality 
                        such as security, network management, and accessibility.
                      </p>
                    </div>
                    <div className="ml-4">
                      <div className="w-12 h-6 bg-blue-600 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Analytics Cookies
                      </h4>
                      <p className="text-sm text-gray-600">
                        These cookies help us understand how visitors interact with our website by collecting 
                        and reporting information anonymously.
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handlePreferenceChange('analytics')}
                        className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                          preferences.analytics ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 shadow-sm ${
                          preferences.analytics ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Marketing Cookies
                      </h4>
                      <p className="text-sm text-gray-600">
                        These cookies are used to track visitors across websites to display relevant 
                        advertisements and measure the effectiveness of our marketing campaigns.
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handlePreferenceChange('marketing')}
                        className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                          preferences.marketing ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 shadow-sm ${
                          preferences.marketing ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        Functional Cookies
                      </h4>
                      <p className="text-sm text-gray-600">
                        These cookies enable enhanced functionality and personalization, such as remembering 
                        your preferences and settings.
                      </p>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => handlePreferenceChange('functional')}
                        className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${
                          preferences.functional ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform duration-200 shadow-sm ${
                          preferences.functional ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mt-8">
                <button
                  onClick={handleRejectAll}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                >
                  Reject All
                </button>
                
                <button
                  onClick={handleAcceptSelected}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Save Preferences
                </button>
                
                <button
                  onClick={handleAcceptAll}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                >
                  Accept All
                </button>
              </div>

              {/* Info */}
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-2">
                  <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Need more information?</p>
                    <p>
                      You can change your cookie preferences at any time by clicking the "Cookie Settings" 
                      link in our footer or by visiting our 
                      <a href="/privacy-policy" className="underline hover:no-underline ml-1">
                        Privacy Policy
                      </a>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
