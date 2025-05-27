import React, { createContext, useState, useContext, useEffect } from "react";

// Colors for light mode
const lightColors = {
  primary: "#9575cd", // Light purple
  secondary: "#5c6bc0", // Indigo
  accent: "#ffab00", // Amber
  accentLight: "#fff8e1", // Light amber
  accentSecondary: "#f57c00", // Dark amber for warnings and errors
  text: "#424242", // Dark gray text
  lightText: "#f5f5f5", // Light text
  background: "#f5f5f5", // Light gray background
  cardBg: "#ffffff", // White card background
  cardBgAlt: "#f9f9f9", // Slightly darker white for alternate cards
  borderColor: "#e0e0e0", // Light border
  sidebarBg: "#ffffff", // White sidebar
  navActiveBg: "rgba(149, 117, 205, 0.1)", // Light purple active state
  inputBg: "#f5f5f5", // Light input background
  success: "#4caf50", // Success green
  warning: "#ff9800", // Warning orange
  error: "#f44336", // Error red
  chartColors: [
    "#9575cd", // Primary
    "#ffab00", // Accent
    "#f57c00", // Accent Secondary
    "#26a69a", // Teal
    "#7986cb", // Indigo
  ],
  terColor: "rgba(33, 33, 33, 0.7)",
  terColor2: "rgba(33, 33, 33, 0.5)",
  terColor3: "rgba(33, 33, 33, 0.1)",
  terColor4: "rgba(33, 33, 33, 0.2)",
  terColor5: "rgba(33, 33, 33, 0.3)",
};

// Colors for dark mode
const darkColors = {
  primary: "#bb86fc", // Light purple
  secondary: "#3700b3", // Dark purple
  accent: "#03dac6", // Teal
  accentLight: "#018786", // Dark teal
  accentSecondary: "#cf6679", // Pink/red for warnings and errors
  text: "#e0e0e0", // Light gray text
  lightText: "#ffffff", // White text
  background: "#121212", // Very dark gray
  cardBg: "#1e1e1e", // Dark card background
  cardBgAlt: "#2d2d2d", // Slightly lighter card
  borderColor: "#333333", // Dark border
  sidebarBg: "#1a1a1a", // Dark sidebar
  navActiveBg: "rgba(187, 134, 252, 0.12)", // Very subtle purple active state
  inputBg: "#2d2d2d", // Dark input background
  success: "#4caf50", // Success green
  warning: "#ff9800", // Warning orange
  error: "#f44336", // Error red
  chartColors: [
    "#bb86fc", // Primary
    "#03dac6", // Accent
    "#cf6679", // Accent Secondary
    "#64ffda", // Light Teal
    "#b39ddb", // Light Purple
  ],

  terColor: "rgba(224, 224, 224, 0.7)",
  terColor2: "rgba(224, 224, 224, 0.5)",
  terColor3: "rgba(224, 224, 224, 0.1)",
  terColor4: "rgba(224, 224, 224, 0.2)",
  terColor5: "rgba(224, 224, 224, 0.3)",
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const colors = darkMode ? darkColors : lightColors;

  // Apply dark mode class to body element
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
      document.body.style.backgroundColor = darkColors.background;
      document.body.style.color = darkColors.text;
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
      document.body.style.backgroundColor = lightColors.background;
      document.body.style.color = lightColors.text;
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
