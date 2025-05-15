
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

export type Language = 'english' | 'japanese' | 'portuguese' | 'french' | 'german' | 'italian';

interface LanguageContextType {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  notificationTime: string;
  setNotificationTime: (time: string) => void;
  quizRemindersEnabled: boolean;
  toggleQuizReminders: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('english');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notificationTime, setNotificationTime] = useState<string>('09:00');
  const [quizRemindersEnabled, setQuizRemindersEnabled] = useState<boolean>(true);

  // Load settings from localStorage on initial render
  useEffect(() => {
    const storedSettings = localStorage.getItem('wordlySettings');
    if (storedSettings) {
      try {
        const parsedSettings = JSON.parse(storedSettings);
        setCurrentLanguage(parsedSettings.language || 'english');
        setTheme(parsedSettings.theme || 'light');
        setNotificationTime(parsedSettings.notificationTime || '09:00');
        setQuizRemindersEnabled(parsedSettings.quizRemindersEnabled !== false);
      } catch (error) {
        console.error('Error parsing stored settings:', error);
      }
    }

    // Apply theme to document
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    const settings = {
      language: currentLanguage,
      theme,
      notificationTime,
      quizRemindersEnabled
    };
    localStorage.setItem('wordlySettings', JSON.stringify(settings));
    
    // Apply theme changes
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [currentLanguage, theme, notificationTime, quizRemindersEnabled]);

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const toggleQuizReminders = () => {
    setQuizRemindersEnabled(prev => !prev);
  };

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      theme,
      toggleTheme,
      notificationTime,
      setNotificationTime,
      quizRemindersEnabled,
      toggleQuizReminders
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
