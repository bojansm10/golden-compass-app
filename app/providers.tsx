'use client';

import { createContext, useContext, useState } from 'react';

const LanguageContext = createContext({
  language: 'en',
  setLanguage: (lang: string) => {},
  t: (key: string) => key,
});

import commonEn from '../public/locales/en/common.json';
import commonMk from '../public/locales/mk/common.json';

const translations = {
  en: commonEn,
  mk: commonMk,
};

export function Providers({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState('en');

  const t = (key: string) => {
    const keys = key.split(':');
    const namespace = keys[0];
    const actualKey = keys[1] || keys[0];
    const keyPath = actualKey.split('.');
    
    let value: any = translations[language as keyof typeof translations];
    for (const k of keyPath) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);