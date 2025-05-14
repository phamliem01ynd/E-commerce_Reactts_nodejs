import { createContext, ReactNode, useEffect, useState } from "react";
import vi from "../../shares/language/vi.json";
import en from "../../shares/language/en.json";

interface TranslateWrapperProps {
  children: ReactNode;
}

interface TranslateContentType {
  isLanguage: string;
  translates: typeof vi;
  toggleLanguage?: () => void;
}

const translateDefault: TranslateContentType = {
  isLanguage: "VI",
  translates: vi,
};

export const TranslateService =
  createContext<TranslateContentType>(translateDefault);

export const TranslateWrapper = ({ children }: TranslateWrapperProps) => {
  const saveLanguage = localStorage.getItem('language') as 'VI' | 'ENG' | null;
  const [isLanguage, setIsLanguage] = useState<string>(saveLanguage || "VI");
  const translates = isLanguage === "VI" ? vi : en;


  useEffect(() => {
    localStorage.setItem('language', isLanguage)
  }, [isLanguage])

  const toggleLanguage = () => {
    setIsLanguage((item) => (item === "VI" ? "ENG" : "VI"));
  };

  return (
    <TranslateService.Provider
      value={{ isLanguage, translates, toggleLanguage }}
    >
      {children}
    </TranslateService.Provider>
  );
};
