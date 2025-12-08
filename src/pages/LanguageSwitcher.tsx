import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../app/features/languageSlice';
import { RootState } from '../app/store';

const LanguageSwitcher: React.FC = () => {
  const dispatch = useDispatch();
  const currentLanguage = useSelector((state: RootState) => state.language.language);

  const handleLanguageChange = (language: 'ar' | 'en' | 'fr') => {
    dispatch(setLanguage(language));
  };

  return (
    <div>
      <button className="but_Primry m-7" onClick={() => handleLanguageChange('en')} disabled={currentLanguage === 'en'}>
        English
      </button>
      <button className="but_Primry m-7" onClick={() => handleLanguageChange('ar')} disabled={currentLanguage === 'ar'}>
        عربي
      </button>
      <button className="but_Primry m-7" onClick={() => handleLanguageChange('fr')} disabled={currentLanguage === 'fr'}>
        Français
      </button>
    </div>
  );
};

export default LanguageSwitcher;
