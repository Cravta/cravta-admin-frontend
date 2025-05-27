import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearError, login, selectAuthError } from "../../store/auth/authSlice.js";
import teach from "../../assets/login.png";
import {
  AlertCircle,
  ChevronLeft,
  Lock,
  Mail,
  Moon,
  Sun,
  Gamepad2,
} from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import ScreenLoader from "../../components/loader/ScreenLoader.jsx";
import LogoPreloader from "../../components/loader/LogoPreLoader.jsx";
import { useAppSettings } from "../../contexts/AppSettingsProvider";
import api from "../../api/axiosInstance.js";
import { toast } from "react-toastify";

const LoginPage = () => {
  const [rememberMe, setRememberMe] = useState(false);
  const { isDarkMode, toggleTheme, language, toggleLanguage } =
    useAppSettings();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  // Local state for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const attemptedLogin = useRef(false);

  // Get error from Redux state
  const authError = useSelector(selectAuthError);
  const { status } = useSelector((state) => state.auth);

  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const rememberedUser = async () => {
      try {
        const res = await api.post(
          "https://cravta.com/api/v1/auth/refresh-token",
          {},
          {
            withCredentials: true,
          }
        );
        console.log("Token refreshed");
        localStorage.setItem("token", res.data.token);

        if (res.data.token) {
          toast.info("Remembered User Logged In...");
        }
        navigate("/classroom");
      } catch (e) {
        console.log("Please Sign In");
      }
    };

    void rememberedUser();
  }, []);

  // Clear error when component unmounts or when inputs change
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Clear error when inputs change
  useEffect(() => {
    if (showError) {
      setShowError(false);
      dispatch(clearError());
    }
  }, [email, password, dispatch]);

  // Check and handle the login status when it changes
  useEffect(() => {
    // Only process after login has been attempted
    if (!attemptedLogin.current) return;

    if (status === "succeeded") {
      console.log("Login status succeeded");
      setShowError(false);
    } else if (status === "failed") {
      console.log("Login status failed");
      setShowError(true);
    }
  }, [status]);

  const joinAsGuest = () => {
    navigate("/guest/quiz/play");
  };

  // Theme colors
  const colors = isDarkMode
    ? {
        primary: "#bb86fc",
        secondary: "#3700b3",
        accent: "#03dac6",
        background: "#121212",
        cardBg: "#1e1e1e",
        cardBgAlt: "#2d2d2d",
        text: "#e0e0e0",
        textSecondary: "#a0a0a0",
        error: "#cf6679",
        border: "#333333",
      }
    : {
        primary: "#9575cd",
        secondary: "#5c6bc0",
        accent: "#ffab00",
        background: "#f5f5f5",
        cardBg: "#ffffff",
        cardBgAlt: "#f0f0f0",
        text: "#424242",
        textSecondary: "#757575",
        error: "#f44336",
        border: "#e0e0e0",
      };
  const handleSubmit = (e) => {
    e.preventDefault();

    // Set loading state
    setIsSubmitting(true);
    attemptedLogin.current = true;

    // Clear any previous errors
    dispatch(clearError());

    // Capture current values to prevent them from changing
    // Use dispatch without awaiting, but chain with then/catch
    dispatch(
      login({ email: email, password: password, rememberMe: rememberMe })
    )
      .then((result) => {
        // Try to unwrap the result (this throws an error if rejected)
        const data = unwrapResult(result);

        // Success - store data and navigate
        console.log("Login succeeded:", data);

        // Extract user data from various possible locations
        const userData = data?.data?.User || data?.User || data?.data || data;

        console.log(userData);
        // Store user ID
        if (userData?.id) {
          localStorage.setItem("userId", userData.id);
          localStorage.setItem("userName", userData.name);
        }

        // Store token
        const token = data?.token || data?.data?.token;
        if (token) {
          localStorage.setItem("token", token);
        }

        // Navigate based on user data completeness
        if (!userData || !userData.name) {
          navigate("/presign");
        } else if (!userData.user_type) {
          navigate("/iam");
        } else if (userData?.user_type === "administrator") {
          navigate("/admin");
        } else if (!userData.organization) {
          navigate("/newEnterprise");
        } else {
          navigate("/welcome");
        }
      })
      .catch((error) => {
        // Handle errors
        console.error("Login failed:", error);
        setShowError(true);
        setIsSubmitting(false);
      });
  };
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  // Reset form and errors
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setShowError(false);
    dispatch(clearError());
  };

  return (
    <div
      className="h-screen w-screen flex flex-col overflow-hidden"
      style={{ backgroundColor: colors.background }}
    >
      {/* Background subtle pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: isDarkMode
            ? "radial-gradient(#ffffff 1px, transparent 0)"
            : "radial-gradient(#000000 1px, transparent 0)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute w-64 h-64 rounded-full blur-3xl opacity-20"
          style={{
            background: "linear-gradient(45deg, #bb86fc, #3700b3)",
            top: "10%",
            left: "5%",
          }}
          animate={{
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
          style={{
            background: "linear-gradient(45deg, #03dac6, #3700b3)",
            bottom: "5%",
            right: "5%",
          }}
          animate={{
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Header */}
      <header className="py-4 px-6 relative z-10">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => navigate("/")}
              className="flex items-center mr-2 p-2 rounded-full hover:bg-opacity-20"
              style={{ backgroundColor: `${colors.primary}15` }}
            >
              <ChevronLeft
                className="w-5 h-5"
                style={{ color: colors.primary }}
              />
            </button>
            <LogoPreloader isDarkMode={isDarkMode} className="h-10" />
          </div>

          <div className="flex items-center space-x-4">
            <button
              className={`${
                i18n.language === "ar" ? "ml-4" : ""
              } flex items-center px-4 py-2 rounded-lg text-sm font-medium`}
              style={{
                backgroundColor: colors.accent,
                color: isDarkMode ? "#121212" : "#ffffff",
              }}
              onClick={() => {
                joinAsGuest();
              }}
            >
              <Gamepad2
                className={`w-4 h-4 ${language === "ar" ? "ml-2" : "mr-2"} `}
              />
              {t("joinAGame")}
            </button>

            <button
              className={`p-2 rounded-full transition-colors`}
              style={{ backgroundColor: `${colors.primary}15` }}
              onClick={toggleTheme}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5" style={{ color: colors.accent }} />
              ) : (
                <Moon className="w-5 h-5" style={{ color: colors.primary }} />
              )}
            </button>
            {/* Language Toggle Button */}
            <button
              onClick={toggleLanguage}
              className="relative group flex items-center justify-center p-1.5 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={
                i18n.language === "en"
                  ? "Switch to Arabic"
                  : "Switch to English"
              }
            >
              <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 text-white overflow-hidden shadow-sm hover:shadow transition-all transform group-hover:scale-110 duration-200">
                {i18n.language === "en" ? (
                  <span className="text-xs font-bold">عربي</span>
                ) : (
                  <span className="text-xs font-bold">EN</span>
                )}

                {/* Tiny planet effect */}
                <div className="absolute w-2 h-2 bg-yellow-300 rounded-full top-0.5 right-1 opacity-80"></div>
                <div className="absolute w-1 h-1 bg-green-300 rounded-full bottom-1 left-1.5 opacity-70"></div>
              </div>

              {/* Tooltip */}
              <div className="absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                {i18n.language === "en"
                  ? "Switch to Arabic"
                  : "Switch to English"}
              </div>

              {/* Little sparkle effect when hovered */}
              <div className="absolute top-0 right-0 w-1.5 h-1.5 bg-yellow-300 rounded-full opacity-0 group-hover:opacity-80 animate-ping"></div>
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="px-4 py-2  rounded-lg text-sm font-medium"
              style={{
                border: `1px solid ${colors.primary}`,
                color: colors.primary,
              }}
            >
              {t("signUp")}
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <motion.div
        className="flex-1 flex items-center justify-center px-6 relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div
          className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 rounded-2xl overflow-hidden shadow-xl"
          style={{ backgroundColor: colors.cardBg }}
        >
          {/* Left side - Form */}
          <motion.div className="p-8 md:p-10" variants={itemVariants}>
            <motion.div className="text-center mb-8" variants={itemVariants}>
              <motion.h1
                className="text-3xl font-bold mb-2"
                style={{ color: colors.primary }}
                animate={{
                  scale: [1, 1.02, 1],
                  transition: { duration: 2, repeat: Infinity },
                }}
              >
                {t("welcomeBack")}
              </motion.h1>
              <motion.p
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                {t("signInToContinueYourAccount")}
              </motion.p>
            </motion.div>

            <motion.form
              className="space-y-6"
              variants={containerVariants}
              onSubmit={handleSubmit}
            >
              {/* Email field */}
              <motion.div variants={itemVariants}>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: colors.text }}
                >
                  {t("emailAddress")}
                </label>
                <div
                  className="flex items-center rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: colors.cardBgAlt,
                    border: `1px solid ${
                      showError ? colors.error : colors.border
                    }`,
                  }}
                >
                  <div className="px-3">
                    <Mail
                      className="w-5 h-5"
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <input
                    type="email"
                    placeholder={t("enterYourEmail")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full py-3 px-2 text-sm"
                    style={{
                      backgroundColor: colors.cardBgAlt,
                      color: colors.text,
                      outline: "none",
                    }}
                    required
                  />
                </div>
              </motion.div>

              {/* Password field */}
              <motion.div variants={itemVariants}>
                <div className="flex justify-between items-center mb-2">
                  <label
                    className="block text-sm font-medium"
                    style={{ color: colors.text }}
                  >
                    {t("password")}
                  </label>
                  <button
                    type="button"
                    onClick={() => navigate("/forgot")}
                    className="text-xs font-medium hover:underline"
                    style={{ color: colors.primary }}
                  >
                    {t("forgotPassword")}
                  </button>
                </div>
                <div
                  className="flex items-center rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: colors.cardBgAlt,
                    border: `1px solid ${
                      showError ? colors.error : colors.border
                    }`,
                  }}
                >
                  <div className="px-3">
                    <Lock
                      className="w-5 h-5"
                      style={{ color: colors.primary }}
                    />
                  </div>
                  <input
                    type="password"
                    placeholder={t("enterYourPassword")}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full py-3 px-2 text-sm"
                    style={{
                      backgroundColor: colors.cardBgAlt,
                      color: colors.text,
                      outline: "none",
                    }}
                    required
                  />
                </div>
              </motion.div>

              {/* Error message */}
              {showError && authError && (
                <motion.div
                  className="flex items-center space-x-2 p-3 rounded-lg text-sm"
                  style={{
                    backgroundColor: `${colors.error}15`,
                    color: colors.error,
                    border: `1px solid ${colors.error}30`,
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>Invalid Email or Password</span>
                </motion.div>
              )}

              <motion.div
                className="flex items-center justify-between"
                variants={itemVariants}
              >
                <label
                  className="inline-flex items-center text-sm"
                  style={{ color: colors.text }}
                >
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className={`form-checkbox h-4 w-4 text-primary border-gray-300 rounded ${
                      i18n.language === "ar" ? "ml-2" : "mr-2"
                    }`}
                    style={{
                      accentColor: colors.primary, // ensures checkbox uses theme color
                    }}
                  />
                  {t("rememberMe")}
                </label>
              </motion.div>

              {/* Login button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-lg font-medium text-sm transition-all relative"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.cardBg,
                  opacity: isSubmitting || status === "loading" ? 0.7 : 1,
                }}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className={`animate-spin h-5 w-5 `}
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    <span
                      className={`${
                        i18n.translation === "ar" ? "mr-2" : "ml-2"
                      } `}
                    >
                      {t("signingIn")}...
                    </span>
                  </div>
                ) : (
                  <span>{t("signIn")}...</span>
                )}
              </motion.button>

              <motion.div
                className="text-center text-sm pt-2"
                style={{ color: colors.textSecondary }}
                variants={itemVariants}
              >
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="font-medium hover:underline"
                  style={{ color: colors.primary }}
                >
                  {t("signUp")}
                </button>
              </motion.div>
            </motion.form>
          </motion.div>

          {isSubmitting && <ScreenLoader />}

          {/* Right side - Image and text */}
          <div className="relative hidden md:block overflow-hidden">
            <div
              className="absolute inset-0 z-10"
              style={{
                background: `linear-gradient(135deg, ${colors.primary}90 0%, ${colors.secondary}90 100%)`,
                mixBlendMode: "multiply",
              }}
            />

            <img
              src={teach}
              alt="Teacher"
              className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Content */}
            <div className="absolute inset-x-0 bottom-0 z-20 p-10 text-white">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
              >
                <motion.h2
                  className="text-3xl font-bold mb-3"
                  animate={{
                    y: [0, -5, 0],
                    transition: {
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse",
                    },
                  }}
                >
                  {t("teachersLoveUs")}
                </motion.h2>
                <p className="text-lg">
                  <Trans
                    i18nKey={"joinOver200MillionEducatorsAndLearnersOnCravta"}
                  >
                    Your platform for transforming knowledge into
                    <br />
                    innovative interactive experiences.
                  </Trans>
                </p>

                <div className="mt-6 flex items-center space-x-2">
                  {[0, 1, 2, 3, 4].map((index) => (
                    <motion.div
                      key={index}
                      className="w-2 h-2 rounded-full bg-white"
                      initial={{ opacity: index === 0 ? 1 : 0.3 }}
                      animate={{
                        opacity: [0.3, 1, 0.3],
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        delay: index * 0.4,
                        repeat: Infinity,
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;