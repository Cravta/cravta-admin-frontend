import { createContext, useState, useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";

// Light theme color palette
const lightColors = {
  primary: "#9575cd",
  secondary: "#5c6bc0",
  accent: "#ffab00",
  accentLight: "#fff8e1",
  accentSecondary: "#f57c00",
  text: "#424242",
  lightText: "#f5f5f5",
  background: "#f5f5f5",
  cardBg: "#ffffff",
  cardBgAlt: "#f9f9f9",
  borderColor: "#e0e0e0",
  sidebarBg: "#ffffff",
  navActiveBg: "rgba(149, 117, 205, 0.1)",
  inputBg: "#f5f5f5",
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  chartColors: ["#9575cd", "#ffab00", "#f57c00", "#26a69a", "#7986cb"],
  terColor: "rgba(33, 33, 33, 0.7)",
  terColor2: "rgba(33, 33, 33, 0.5)",
  terColor3: "rgba(33, 33, 33, 0.1)",
  terColor4: "rgba(33, 33, 33, 0.2)",
  terColor5: "rgba(33, 33, 33, 0.3)",
};

// Dark theme color palette
const darkColors = {
  primary: "#bb86fc",
  secondary: "#3700b3",
  accent: "#03dac6",
  accentLight: "#018786",
  accentSecondary: "#cf6679",
  text: "#e0e0e0",
  lightText: "#ffffff",
  background: "#121212",
  cardBg: "#1e1e1e",
  cardBgAlt: "#2d2d2d",
  borderColor: "#333333",
  sidebarBg: "#1a1a1a",
  navActiveBg: "rgba(187, 134, 252, 0.12)",
  inputBg: "#2d2d2d",
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  chartColors: ["#bb86fc", "#03dac6", "#cf6679", "#64ffda", "#b39ddb"],
  terColor: "rgba(224, 224, 224, 0.7)",
  terColor2: "rgba(224, 224, 224, 0.5)",
  terColor3: "rgba(224, 224, 224, 0.1)",
  terColor4: "rgba(224, 224, 224, 0.2)",
  terColor5: "rgba(224, 224, 224, 0.3)",
};

const AppSettingsContext = createContext({
  isDarkMode: false,
  toggleTheme: () => {},
  language: 'en',
  toggleLanguage: () => {},
  colors: {},
});

export const AppSettingsProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return (
        saved === "dark" ||
        (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)
    );
  });

  const { i18n } = useTranslation();
  const colors = isDarkMode ? darkColors : lightColors;

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "en" : "en";
    i18n.changeLanguage(newLang);
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark-theme");
      root.classList.remove("light-theme");
      document.body.style.backgroundColor = darkColors.background;
      document.body.style.color = darkColors.text;
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.add("light-theme");
      root.classList.remove("dark-theme");
      document.body.style.backgroundColor = lightColors.background;
      document.body.style.color = lightColors.text;
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  useEffect(() => {
    document.documentElement.setAttribute(
        "dir",
        i18n.language === "ar" ? "ltr" : "ltr"
    );
  }, [i18n.language]);

  return (
      <AppSettingsContext.Provider
          value={{
            isDarkMode,
            toggleTheme,
            language: i18n.language,
            toggleLanguage,
            colors, // make colors available to components
          }}
      >
        {children}
      </AppSettingsContext.Provider>
  );
};

export const useAppSettings = () => {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used within an AppSettingsProvider");
  }
  return context;
};
