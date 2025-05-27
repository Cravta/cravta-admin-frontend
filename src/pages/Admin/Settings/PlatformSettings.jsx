import React, { useState } from "react";
import {
  Settings,
  Sliders,
  Database,
  Brain,
  Mail,
  Lock,
  Save,
  Info,
  CheckCircle,
  RefreshCw,
  Copy,
  Eye,
  EyeOff,
  Edit,
  //   Toggle,
  Globe,
  Clock,
  Upload,
  FileType,
  AlertTriangle,
  BellRing,
} from "lucide-react";
import { useTheme } from "../../../contexts/ThemeContext";

const PlatformSettings = () => {
  const { colors } = useTheme();
  const [activeSection, setActiveSection] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Example feature flags state
  const [featureFlags, setFeatureFlags] = useState({
    aiQuizGeneration: true,
    aiFlashcards: true,
    studentPersonalStudy: true,
    contentUpload: true,
    userInvitations: true,
    classInvitations: true,
  });

  // Handle toggling feature flags
  const handleFeatureFlagToggle = (flag) => {
    setFeatureFlags({
      ...featureFlags,
      [flag]: !featureFlags[flag],
    });
  };

  // Handle save settings
  const handleSaveSettings = () => {
    setIsSaving(true);

    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);

      // Hide success message after a delay
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1500);
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // Could show a toast notification here
  };

  return (
    <div className="p-6 overflow-auto">
      <div className="mb-6">
        <h2
          className="text-xl font-medium mb-2"
          style={{ color: colors.primary }}
        >
          Platform Settings
        </h2>
        <p className="text-sm" style={{ color: colors.textMuted }}>
          Configure global settings for the Cravta platform
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div
          className="md:w-64 flex-shrink-0 rounded-lg overflow-hidden"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          <div
            className="p-4 border-b font-medium"
            style={{
              borderColor: colors.borderColor,
              color: colors.text,
            }}
          >
            Settings
          </div>

          <div className="p-2">
            <button
              className="flex items-center w-full text-left px-3 py-2 rounded-lg mb-1"
              style={{
                backgroundColor:
                  activeSection === "general"
                    ? colors.navActiveBg
                    : "transparent",
                color:
                  activeSection === "general" ? colors.primary : colors.text,
              }}
              onClick={() => setActiveSection("general")}
            >
              <Settings
                className="w-4 h-4 mr-3"
                style={{
                  color:
                    activeSection === "general"
                      ? colors.primary
                      : colors.textMuted,
                }}
              />
              General Settings
            </button>

            <button
              className="flex items-center w-full text-left px-3 py-2 rounded-lg mb-1"
              style={{
                backgroundColor:
                  activeSection === "features"
                    ? colors.navActiveBg
                    : "transparent",
                color:
                  activeSection === "features" ? colors.primary : colors.text,
              }}
              onClick={() => setActiveSection("features")}
            >
              {/* <Toggle
                className="w-4 h-4 mr-3"
                style={{
                  color:
                    activeSection === "features"
                      ? colors.primary
                      : colors.textMuted,
                }}
              /> */}
              Feature Flags
            </button>

            <button
              className="flex items-center w-full text-left px-3 py-2 rounded-lg mb-1"
              style={{
                backgroundColor:
                  activeSection === "content"
                    ? colors.navActiveBg
                    : "transparent",
                color:
                  activeSection === "content" ? colors.primary : colors.text,
              }}
              onClick={() => setActiveSection("content")}
            >
              <Database
                className="w-4 h-4 mr-3"
                style={{
                  color:
                    activeSection === "content"
                      ? colors.primary
                      : colors.textMuted,
                }}
              />
              Content Settings
            </button>

            <button
              className="flex items-center w-full text-left px-3 py-2 rounded-lg mb-1"
              style={{
                backgroundColor:
                  activeSection === "ai" ? colors.navActiveBg : "transparent",
                color: activeSection === "ai" ? colors.primary : colors.text,
              }}
              onClick={() => setActiveSection("ai")}
            >
              <Brain
                className="w-4 h-4 mr-3"
                style={{
                  color:
                    activeSection === "ai" ? colors.primary : colors.textMuted,
                }}
              />
              AI Configuration
            </button>

            <button
              className="flex items-center w-full text-left px-3 py-2 rounded-lg mb-1"
              style={{
                backgroundColor:
                  activeSection === "email"
                    ? colors.navActiveBg
                    : "transparent",
                color: activeSection === "email" ? colors.primary : colors.text,
              }}
              onClick={() => setActiveSection("email")}
            >
              <Mail
                className="w-4 h-4 mr-3"
                style={{
                  color:
                    activeSection === "email"
                      ? colors.primary
                      : colors.textMuted,
                }}
              />
              Email Settings
            </button>

            <button
              className="flex items-center w-full text-left px-3 py-2 rounded-lg mb-1"
              style={{
                backgroundColor:
                  activeSection === "security"
                    ? colors.navActiveBg
                    : "transparent",
                color:
                  activeSection === "security" ? colors.primary : colors.text,
              }}
              onClick={() => setActiveSection("security")}
            >
              <Lock
                className="w-4 h-4 mr-3"
                style={{
                  color:
                    activeSection === "security"
                      ? colors.primary
                      : colors.textMuted,
                }}
              />
              Security Settings
            </button>

            <button
              className="flex items-center w-full text-left px-3 py-2 rounded-lg mb-1"
              style={{
                backgroundColor:
                  activeSection === "notifications"
                    ? colors.navActiveBg
                    : "transparent",
                color:
                  activeSection === "notifications"
                    ? colors.primary
                    : colors.text,
              }}
              onClick={() => setActiveSection("notifications")}
            >
              <BellRing
                className="w-4 h-4 mr-3"
                style={{
                  color:
                    activeSection === "notifications"
                      ? colors.primary
                      : colors.textMuted,
                }}
              />
              Notification Settings
            </button>
          </div>
        </div>

        {/* Settings Content */}
        <div
          className="flex-1 rounded-lg"
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.borderColor}`,
          }}
        >
          {/* General Settings */}
          {activeSection === "general" && (
            <div className="p-6">
              <h3
                className="text-lg font-medium mb-4"
                style={{ color: colors.text }}
              >
                General Settings
              </h3>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Platform Name */}
                  <div>
                    <label
                      className="block text-sm mb-2"
                      style={{ color: colors.textMuted }}
                    >
                      Platform Name
                    </label>
                    <input
                      type="text"
                      defaultValue="Cravta Learning Platform"
                      className="w-full p-2 rounded-lg"
                      style={{
                        backgroundColor: colors.inputBg,
                        border: `1px solid ${colors.borderColor}`,
                        color: colors.text,
                      }}
                    />
                  </div>

                  {/* Environment */}
                  <div>
                    <label
                      className="block text-sm mb-2"
                      style={{ color: colors.textMuted }}
                    >
                      Environment
                    </label>
                    <select
                      className="w-full p-2 rounded-lg appearance-none"
                      style={{
                        backgroundColor: colors.inputBg,
                        border: `1px solid ${colors.borderColor}`,
                        color: colors.text,
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='%23e0e0e0' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 10px center",
                        paddingRight: "30px",
                      }}
                    >
                      <option value="production">Production</option>
                      <option value="staging">Staging</option>
                      <option value="development">Development</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Default Language */}
                  <div>
                    <label
                      className="block text-sm mb-2"
                      style={{ color: colors.textMuted }}
                    >
                      Default Language
                    </label>
                    <div className="flex items-center">
                      <Globe
                        className="w-4 h-4 mr-2"
                        style={{ color: colors.textMuted }}
                      />
                      <select
                        className="flex-1 p-2 rounded-lg appearance-none"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='%23e0e0e0' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 10px center",
                          paddingRight: "30px",
                        }}
                      >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                        <option value="zh">Chinese</option>
                        <option value="ja">Japanese</option>
                        <option value="ar">Arabic</option>
                      </select>
                    </div>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label
                      className="block text-sm mb-2"
                      style={{ color: colors.textMuted }}
                    >
                      Default Timezone
                    </label>
                    <div className="flex items-center">
                      <Clock
                        className="w-4 h-4 mr-2"
                        style={{ color: colors.textMuted }}
                      />
                      <select
                        className="flex-1 p-2 rounded-lg appearance-none"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                          backgroundImage:
                            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='%23e0e0e0' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "right 10px center",
                          paddingRight: "30px",
                        }}
                      >
                        <option value="UTC">
                          UTC (Coordinated Universal Time)
                        </option>
                        <option value="EST">EST (Eastern Standard Time)</option>
                        <option value="CST">CST (Central Standard Time)</option>
                        <option value="MST">
                          MST (Mountain Standard Time)
                        </option>
                        <option value="PST">PST (Pacific Standard Time)</option>
                        <option value="GMT">GMT (Greenwich Mean Time)</option>
                        <option value="IST">IST (India Standard Time)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Admin Contact Email */}
                  <div>
                    <label
                      className="block text-sm mb-2"
                      style={{ color: colors.textMuted }}
                    >
                      Admin Contact Email
                    </label>
                    <input
                      type="email"
                      defaultValue="admin@cravta.com"
                      className="w-full p-2 rounded-lg"
                      style={{
                        backgroundColor: colors.inputBg,
                        border: `1px solid ${colors.borderColor}`,
                        color: colors.text,
                      }}
                    />
                  </div>

                  {/* Support Contact */}
                  <div>
                    <label
                      className="block text-sm mb-2"
                      style={{ color: colors.textMuted }}
                    >
                      Support Contact Email
                    </label>
                    <input
                      type="email"
                      defaultValue="support@cravta.com"
                      className="w-full p-2 rounded-lg"
                      style={{
                        backgroundColor: colors.inputBg,
                        border: `1px solid ${colors.borderColor}`,
                        color: colors.text,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: colors.textMuted }}
                  >
                    Platform Description
                  </label>
                  <textarea
                    defaultValue="Cravta is an intelligent learning platform designed to help students learn faster and teachers teach better through AI-powered tools and analytics."
                    className="w-full p-2 rounded-lg"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                      minHeight: "80px",
                      resize: "vertical",
                    }}
                  ></textarea>
                </div>

                <div
                  className="p-4 rounded-lg flex items-start"
                  style={{
                    backgroundColor: `${colors.primary}10`,
                    border: `1px solid ${colors.primary}30`,
                  }}
                >
                  <Info
                    className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
                    style={{ color: colors.primary }}
                  />
                  <div>
                    <p className="text-sm" style={{ color: colors.text }}>
                      These settings control the basic configuration of your
                      Cravta platform instance. Changes to the platform name and
                      branding will be visible to all users.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Feature Flags */}
          {activeSection === "features" && (
            <div className="p-6">
              <h3
                className="text-lg font-medium mb-4"
                style={{ color: colors.text }}
              >
                Feature Flags
              </h3>

              <div
                className="p-4 rounded-lg mb-6"
                style={{
                  backgroundColor: `${colors.accent}10`,
                  border: `1px solid ${colors.accent}30`,
                }}
              >
                <div className="flex items-start">
                  <Info
                    className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
                    style={{ color: colors.accent }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: colors.text }}
                    >
                      Feature Management
                    </p>
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      Toggle features on/off platform-wide. Disabling a feature
                      will make it unavailable to all users. Use caution when
                      disabling features that users may be actively using.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {/* AI-Based Features */}
                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: colors.cardBgAlt,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    AI-Based Features
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p style={{ color: colors.text }}>AI Quiz Generation</p>
                        <p
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Allow users to generate quizzes using AI
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={featureFlags.aiQuizGeneration}
                          onChange={() =>
                            handleFeatureFlagToggle("aiQuizGeneration")
                          }
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer ${
                            featureFlags.aiQuizGeneration
                              ? "bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white"
                              : "bg-gray-700"
                          } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                          style={{
                            backgroundColor: featureFlags.aiQuizGeneration
                              ? colors.primary
                              : colors.borderColor,
                          }}
                        ></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p style={{ color: colors.text }}>AI Flashcards</p>
                        <p
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Allow users to generate flashcards using AI
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={featureFlags.aiFlashcards}
                          onChange={() =>
                            handleFeatureFlagToggle("aiFlashcards")
                          }
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer ${
                            featureFlags.aiFlashcards
                              ? "bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white"
                              : "bg-gray-700"
                          } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                          style={{
                            backgroundColor: featureFlags.aiFlashcards
                              ? colors.primary
                              : colors.borderColor,
                          }}
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Content Features */}
                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: colors.cardBgAlt,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    Content Features
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p style={{ color: colors.text }}>
                          Student Personal Study
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Allow students to create personal study materials
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={featureFlags.studentPersonalStudy}
                          onChange={() =>
                            handleFeatureFlagToggle("studentPersonalStudy")
                          }
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer ${
                            featureFlags.studentPersonalStudy
                              ? "bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white"
                              : "bg-gray-700"
                          } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                          style={{
                            backgroundColor: featureFlags.studentPersonalStudy
                              ? colors.primary
                              : colors.borderColor,
                          }}
                        ></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p style={{ color: colors.text }}>Content Upload</p>
                        <p
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Allow users to upload content files
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={featureFlags.contentUpload}
                          onChange={() =>
                            handleFeatureFlagToggle("contentUpload")
                          }
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer ${
                            featureFlags.contentUpload
                              ? "bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white"
                              : "bg-gray-700"
                          } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                          style={{
                            backgroundColor: featureFlags.contentUpload
                              ? colors.primary
                              : colors.borderColor,
                          }}
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* User Management Features */}
                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: colors.cardBgAlt,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    User Management Features
                  </h4>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p style={{ color: colors.text }}>User Invitations</p>
                        <p
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Allow teachers to invite users directly
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={featureFlags.userInvitations}
                          onChange={() =>
                            handleFeatureFlagToggle("userInvitations")
                          }
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer ${
                            featureFlags.userInvitations
                              ? "bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white"
                              : "bg-gray-700"
                          } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                          style={{
                            backgroundColor: featureFlags.userInvitations
                              ? colors.primary
                              : colors.borderColor,
                          }}
                        ></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p style={{ color: colors.text }}>Class Invitations</p>
                        <p
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Allow students to join classes via invitation
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={featureFlags.classInvitations}
                          onChange={() =>
                            handleFeatureFlagToggle("classInvitations")
                          }
                        />
                        <div
                          className={`w-11 h-6 rounded-full peer ${
                            featureFlags.classInvitations
                              ? "bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white"
                              : "bg-gray-700"
                          } after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all`}
                          style={{
                            backgroundColor: featureFlags.classInvitations
                              ? colors.primary
                              : colors.borderColor,
                          }}
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div
                  className="p-4 rounded-lg flex items-start"
                  style={{
                    backgroundColor: `${colors.warning}10`,
                    border: `1px solid ${colors.warning}30`,
                  }}
                >
                  <AlertTriangle
                    className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
                    style={{ color: colors.warning }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: colors.text }}
                    >
                      Warning: Feature Flag Changes
                    </p>
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      Disabling features may interrupt workflows for current
                      users. Consider sending a notification before making
                      changes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Content Settings */}
          {activeSection === "content" && (
            <div className="p-6">
              <h3
                className="text-lg font-medium mb-4"
                style={{ color: colors.text }}
              >
                Content Settings
              </h3>

              <div className="space-y-6">
                {/* Storage Limits */}
                <div>
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    Storage Limits
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        Maximum Storage Per Teacher (MB)
                      </label>
                      <input
                        type="number"
                        defaultValue="500"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        Maximum Storage Per Student (MB)
                      </label>
                      <input
                        type="number"
                        defaultValue="100"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* File Upload Settings */}
                <div>
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    File Upload Settings
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        Maximum File Size (MB)
                      </label>
                      <input
                        type="number"
                        defaultValue="25"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        Maximum Files Per Upload
                      </label>
                      <input
                        type="number"
                        defaultValue="10"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Allowed File Types */}
                <div>
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    Allowed File Types
                  </h4>

                  <div
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: colors.cardBgAlt,
                      border: `1px solid ${colors.borderColor}`,
                    }}
                  >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="file-pdf"
                          className="mr-2"
                          defaultChecked
                        />
                        <label
                          htmlFor="file-pdf"
                          style={{ color: colors.text }}
                        >
                          PDF (.pdf)
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="file-doc"
                          className="mr-2"
                          defaultChecked
                        />
                        <label
                          htmlFor="file-doc"
                          style={{ color: colors.text }}
                        >
                          Word (.doc, .docx)
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="file-ppt"
                          className="mr-2"
                          defaultChecked
                        />
                        <label
                          htmlFor="file-ppt"
                          style={{ color: colors.text }}
                        >
                          PowerPoint (.ppt, .pptx)
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="file-xls"
                          className="mr-2"
                          defaultChecked
                        />
                        <label
                          htmlFor="file-xls"
                          style={{ color: colors.text }}
                        >
                          Excel (.xls, .xlsx)
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="file-img"
                          className="mr-2"
                          defaultChecked
                        />
                        <label
                          htmlFor="file-img"
                          style={{ color: colors.text }}
                        >
                          Images (.jpg, .png, .gif)
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="file-audio"
                          className="mr-2"
                          defaultChecked
                        />
                        <label
                          htmlFor="file-audio"
                          style={{ color: colors.text }}
                        >
                          Audio (.mp3, .wav)
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="file-video"
                          className="mr-2"
                          defaultChecked
                        />
                        <label
                          htmlFor="file-video"
                          style={{ color: colors.text }}
                        >
                          Video (.mp4, .mov)
                        </label>
                      </div>

                      <div className="flex items-center">
                        <input type="checkbox" id="file-zip" className="mr-2" />
                        <label
                          htmlFor="file-zip"
                          style={{ color: colors.text }}
                        >
                          Archives (.zip, .rar)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Moderation */}
                <div>
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    Content Moderation
                  </h4>

                  <div
                    className="flex items-center justify-between p-4 rounded-lg"
                    style={{ backgroundColor: colors.cardBgAlt }}
                  >
                    <div>
                      <p style={{ color: colors.text }}>
                        Enable Content Moderation
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: colors.textMuted }}
                      >
                        Scan uploaded content for inappropriate material
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div
                        className="w-11 h-6 rounded-full peer bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                        style={{
                          backgroundColor: colors.primary,
                        }}
                      ></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* AI Configuration */}
          {activeSection === "ai" && (
            <div className="p-6">
              <h3
                className="text-lg font-medium mb-4"
                style={{ color: colors.text }}
              >
                AI Configuration
              </h3>

              <div
                className="p-4 rounded-lg mb-6"
                style={{
                  backgroundColor: `${colors.accent}10`,
                  border: `1px solid ${colors.accent}30`,
                }}
              >
                <div className="flex items-start">
                  <Info
                    className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
                    style={{ color: colors.accent }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: colors.text }}
                    >
                      AI Service Configuration
                    </p>
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      Configure connections to AI services for quiz generation
                      and other intelligent features. API keys are encrypted
                      when stored and only decrypted when needed for API calls.
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {/* AI Provider */}
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: colors.textMuted }}
                  >
                    AI Provider
                  </label>
                  <select
                    className="w-full p-2 rounded-lg appearance-none"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                      backgroundImage:
                        "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='%23e0e0e0' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 10px center",
                      paddingRight: "30px",
                    }}
                  >
                    <option value="openai">OpenAI</option>
                    <option value="gpt4">GPT-4</option>
                    <option value="azure">Azure OpenAI</option>
                    <option value="anthropic">Anthropic Claude</option>
                    <option value="huggingface">Hugging Face</option>
                  </select>
                </div>

                {/* API Key Management */}
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: colors.textMuted }}
                  >
                    API Key
                  </label>
                  <div className="flex">
                    <div className="relative flex-1">
                      <input
                        type={showApiKey ? "text" : "password"}
                        defaultValue="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        className="w-full p-2 rounded-l-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          borderRight: "none",
                          color: colors.text,
                        }}
                      />
                      <button
                        onClick={() => setShowApiKey(!showApiKey)}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2"
                        style={{ color: colors.textMuted }}
                      >
                        {showApiKey ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <button
                      className="px-3 py-2 rounded-r-lg"
                      style={{
                        backgroundColor: colors.cardBgAlt,
                        border: `1px solid ${colors.borderColor}`,
                        borderLeft: "none",
                        color: colors.text,
                      }}
                      onClick={() =>
                        handleCopyToClipboard(
                          "sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                        )
                      }
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* AI Model Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label
                      className="block text-sm mb-2"
                      style={{ color: colors.textMuted }}
                    >
                      Default AI Model
                    </label>
                    <select
                      className="w-full p-2 rounded-lg appearance-none"
                      style={{
                        backgroundColor: colors.inputBg,
                        border: `1px solid ${colors.borderColor}`,
                        color: colors.text,
                        backgroundImage:
                          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24' stroke='%23e0e0e0' stroke-width='2' fill='none' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "right 10px center",
                        paddingRight: "30px",
                      }}
                    >
                      <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                      <option value="gpt-4">GPT-4</option>
                      <option value="gpt-4-turbo">GPT-4 Turbo</option>
                      <option value="claude-2">Claude 2</option>
                      <option value="llama-2">Llama 2</option>
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-sm mb-2"
                      style={{ color: colors.textMuted }}
                    >
                      Temperature
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="1"
                      step="0.1"
                      defaultValue="0.7"
                      className="w-full p-2 rounded-lg"
                      style={{
                        backgroundColor: colors.inputBg,
                        border: `1px solid ${colors.borderColor}`,
                        color: colors.text,
                      }}
                    />
                    <p
                      className="text-xs mt-1"
                      style={{ color: colors.textMuted }}
                    >
                      Controls randomness (0 = deterministic, 1 = creative)
                    </p>
                  </div>
                </div>

                {/* Usage Limits */}
                <div>
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    Usage Limits
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        Quota Per Teacher (requests/day)
                      </label>
                      <input
                        type="number"
                        defaultValue="50"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        Quota Per Student (requests/day)
                      </label>
                      <input
                        type="number"
                        defaultValue="20"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Content Filtering */}
                <div
                  className="flex items-center justify-between p-4 rounded-lg"
                  style={{ backgroundColor: colors.cardBgAlt }}
                >
                  <div>
                    <p style={{ color: colors.text }}>Content Filtering</p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>
                      Apply strict content filtering to AI-generated content
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      defaultChecked
                    />
                    <div
                      className="w-11 h-6 rounded-full peer bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                      style={{
                        backgroundColor: colors.primary,
                      }}
                    ></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeSection === "email" && (
            <div className="p-6">
              <h3
                className="text-lg font-medium mb-4"
                style={{ color: colors.text }}
              >
                Email Settings
              </h3>

              <div className="space-y-6">
                {/* SMTP Configuration */}
                <div>
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    SMTP Configuration
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        SMTP Server
                      </label>
                      <input
                        type="text"
                        defaultValue="smtp.example.com"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        SMTP Port
                      </label>
                      <input
                        type="number"
                        defaultValue="587"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        SMTP Username
                      </label>
                      <input
                        type="text"
                        defaultValue="noreply@cravta.com"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        SMTP Password
                      </label>
                      <div className="relative">
                        <input
                          type={showApiKey ? "text" : "password"}
                          defaultValue="********"
                          className="w-full p-2 rounded-lg pr-10"
                          style={{
                            backgroundColor: colors.inputBg,
                            border: `1px solid ${colors.borderColor}`,
                            color: colors.text,
                          }}
                        />
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="absolute right-2 top-1/2 transform -translate-y-1/2"
                          style={{ color: colors.textMuted }}
                        >
                          {showApiKey ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="enable-ssl"
                      className="mr-2"
                      defaultChecked
                    />
                    <label htmlFor="enable-ssl" style={{ color: colors.text }}>
                      Enable SSL/TLS
                    </label>
                  </div>
                </div>

                {/* Email Sender Configuration */}
                <div>
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    Email Sender Configuration
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        From Email
                      </label>
                      <input
                        type="email"
                        defaultValue="notifications@cravta.com"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        From Name
                      </label>
                      <input
                        type="text"
                        defaultValue="Cravta Learning Platform"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Email Template Settings */}
                <div>
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    Email Templates
                  </h4>

                  <div
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: colors.cardBgAlt,
                      border: `1px solid ${colors.borderColor}`,
                    }}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p style={{ color: colors.text }}>Welcome Email</p>
                          <p
                            className="text-xs"
                            style={{ color: colors.textMuted }}
                          >
                            Sent when a new user registers
                          </p>
                        </div>
                        <button
                          className="px-3 py-1 rounded text-sm"
                          style={{
                            backgroundColor: colors.inputBg,
                            border: `1px solid ${colors.borderColor}`,
                            color: colors.text,
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p style={{ color: colors.text }}>Password Reset</p>
                          <p
                            className="text-xs"
                            style={{ color: colors.textMuted }}
                          >
                            Sent when a user requests a password reset
                          </p>
                        </div>
                        <button
                          className="px-3 py-1 rounded text-sm"
                          style={{
                            backgroundColor: colors.inputBg,
                            border: `1px solid ${colors.borderColor}`,
                            color: colors.text,
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p style={{ color: colors.text }}>Class Invitation</p>
                          <p
                            className="text-xs"
                            style={{ color: colors.textMuted }}
                          >
                            Sent when a user is invited to a class
                          </p>
                        </div>
                        <button
                          className="px-3 py-1 rounded text-sm"
                          style={{
                            backgroundColor: colors.inputBg,
                            border: `1px solid ${colors.borderColor}`,
                            color: colors.text,
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        <div>
                          <p style={{ color: colors.text }}>
                            Quiz Notification
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: colors.textMuted }}
                          >
                            Sent when a new quiz is available
                          </p>
                        </div>
                        <button
                          className="px-3 py-1 rounded text-sm"
                          style={{
                            backgroundColor: colors.inputBg,
                            border: `1px solid ${colors.borderColor}`,
                            color: colors.text,
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Test Email */}
                <div>
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    Test Email Configuration
                  </h4>

                  <div className="flex">
                    <input
                      type="email"
                      placeholder="Enter email address"
                      className="flex-1 p-2 rounded-l-lg"
                      style={{
                        backgroundColor: colors.inputBg,
                        border: `1px solid ${colors.borderColor}`,
                        borderRight: "none",
                        color: colors.text,
                      }}
                    />
                    <button
                      className="px-4 py-2 rounded-r-lg"
                      style={{
                        backgroundColor: colors.primary,
                        color: colors.lightText,
                      }}
                    >
                      Send Test Email
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeSection === "security" && (
            <div className="p-6">
              <h3
                className="text-lg font-medium mb-4"
                style={{ color: colors.text }}
              >
                Security Settings
              </h3>

              <div className="space-y-6">
                {/* Password Policy */}
                <div>
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    Password Policy
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        Minimum Password Length
                      </label>
                      <input
                        type="number"
                        defaultValue="8"
                        min="6"
                        max="24"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        Password Expiry (days, 0 for never)
                      </label>
                      <input
                        type="number"
                        defaultValue="90"
                        min="0"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                    </div>
                  </div>

                  <div
                    className="mt-4 space-y-2 p-4 rounded-lg"
                    style={{
                      backgroundColor: colors.cardBgAlt,
                      border: `1px solid ${colors.borderColor}`,
                    }}
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="req-uppercase"
                        className="mr-2"
                        defaultChecked
                      />
                      <label
                        htmlFor="req-uppercase"
                        style={{ color: colors.text }}
                      >
                        Require uppercase letters
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="req-lowercase"
                        className="mr-2"
                        defaultChecked
                      />
                      <label
                        htmlFor="req-lowercase"
                        style={{ color: colors.text }}
                      >
                        Require lowercase letters
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="req-numbers"
                        className="mr-2"
                        defaultChecked
                      />
                      <label
                        htmlFor="req-numbers"
                        style={{ color: colors.text }}
                      >
                        Require numbers
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="req-special"
                        className="mr-2"
                        defaultChecked
                      />
                      <label
                        htmlFor="req-special"
                        style={{ color: colors.text }}
                      >
                        Require special characters
                      </label>
                    </div>
                  </div>
                </div>

                {/* Session Security */}
                <div>
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    Session Security
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        Session Timeout (minutes, 0 for never)
                      </label>
                      <input
                        type="number"
                        defaultValue="60"
                        min="0"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        Max Login Attempts
                      </label>
                      <input
                        type="number"
                        defaultValue="5"
                        min="1"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center mt-4">
                    <input
                      type="checkbox"
                      id="enforce-https"
                      className="mr-2"
                      defaultChecked
                    />
                    <label
                      htmlFor="enforce-https"
                      style={{ color: colors.text }}
                    >
                      Enforce HTTPS
                    </label>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div>
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    Two-Factor Authentication
                  </h4>

                  <div className="space-y-3">
                    <div
                      className="flex items-center justify-between p-4 rounded-lg"
                      style={{ backgroundColor: colors.cardBgAlt }}
                    >
                      <div>
                        <p style={{ color: colors.text }}>
                          Enable 2FA for Administrators
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Require two-factor authentication for admin accounts
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div
                          className="w-11 h-6 rounded-full peer bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                          style={{
                            backgroundColor: colors.primary,
                          }}
                        ></div>
                      </label>
                    </div>

                    <div
                      className="flex items-center justify-between p-4 rounded-lg"
                      style={{ backgroundColor: colors.cardBgAlt }}
                    >
                      <div>
                        <p style={{ color: colors.text }}>
                          Allow 2FA for Teachers
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Allow teachers to enable two-factor authentication
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div
                          className="w-11 h-6 rounded-full peer bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                          style={{
                            backgroundColor: colors.primary,
                          }}
                        ></div>
                      </label>
                    </div>

                    <div
                      className="flex items-center justify-between p-4 rounded-lg"
                      style={{ backgroundColor: colors.cardBgAlt }}
                    >
                      <div>
                        <p style={{ color: colors.text }}>
                          Allow 2FA for Students
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Allow students to enable two-factor authentication
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div
                          className="w-11 h-6 rounded-full peer bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                          style={{
                            backgroundColor: colors.borderColor,
                          }}
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Security Warning */}
                <div
                  className="p-4 rounded-lg flex items-start"
                  style={{
                    backgroundColor: `${colors.warning}10`,
                    border: `1px solid ${colors.warning}30`,
                  }}
                >
                  <AlertTriangle
                    className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5"
                    style={{ color: colors.warning }}
                  />
                  <div>
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: colors.text }}
                    >
                      Security Best Practices
                    </p>
                    <p className="text-sm" style={{ color: colors.textMuted }}>
                      Regularly review your security settings and update
                      credentials. Keep API keys and passwords secure, and
                      ensure sensitive data is encrypted both in transit and at
                      rest.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeSection === "notifications" && (
            <div className="p-6">
              <h3
                className="text-lg font-medium mb-4"
                style={{ color: colors.text }}
              >
                Notification Settings
              </h3>

              <div className="space-y-6">
                {/* System Notifications */}
                <div>
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    System Notifications
                  </h4>

                  <div className="space-y-3">
                    <div
                      className="flex items-center justify-between p-4 rounded-lg"
                      style={{ backgroundColor: colors.cardBgAlt }}
                    >
                      <div>
                        <p style={{ color: colors.text }}>
                          User Registration Alerts
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Notify admins when new users register
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div
                          className="w-11 h-6 rounded-full peer bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                          style={{
                            backgroundColor: colors.primary,
                          }}
                        ></div>
                      </label>
                    </div>

                    <div
                      className="flex items-center justify-between p-4 rounded-lg"
                      style={{ backgroundColor: colors.cardBgAlt }}
                    >
                      <div>
                        <p style={{ color: colors.text }}>
                          Class Creation Alerts
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Notify admins when new classes are created
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div
                          className="w-11 h-6 rounded-full peer bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                          style={{
                            backgroundColor: colors.primary,
                          }}
                        ></div>
                      </label>
                    </div>

                    <div
                      className="flex items-center justify-between p-4 rounded-lg"
                      style={{ backgroundColor: colors.cardBgAlt }}
                    >
                      <div>
                        <p style={{ color: colors.text }}>Security Alerts</p>
                        <p
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Notify admins about suspicious activities
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div
                          className="w-11 h-6 rounded-full peer bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                          style={{
                            backgroundColor: colors.primary,
                          }}
                        ></div>
                      </label>
                    </div>

                    <div
                      className="flex items-center justify-between p-4 rounded-lg"
                      style={{ backgroundColor: colors.cardBgAlt }}
                    >
                      <div>
                        <p style={{ color: colors.text }}>
                          System Health Alerts
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Send alerts about system performance issues
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div
                          className="w-11 h-6 rounded-full peer bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                          style={{
                            backgroundColor: colors.primary,
                          }}
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Email Notification Settings */}
                <div>
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    Email Notification Settings
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        Daily Digest Time
                      </label>
                      <input
                        type="time"
                        defaultValue="06:00"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                    </div>

                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.textMuted }}
                      >
                        Admin Email Recipients
                      </label>
                      <input
                        type="text"
                        defaultValue="admin@cravta.com, ops@cravta.com"
                        className="w-full p-2 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                      />
                      <p
                        className="text-xs mt-1"
                        style={{ color: colors.textMuted }}
                      >
                        Separate multiple emails with commas
                      </p>
                    </div>
                  </div>
                </div>

                {/* In-App Notification Settings */}
                <div>
                  <h4
                    className="font-medium mb-3"
                    style={{ color: colors.text }}
                  >
                    In-App Notifications
                  </h4>

                  <div className="space-y-3">
                    <div
                      className="flex items-center justify-between p-4 rounded-lg"
                      style={{ backgroundColor: colors.cardBgAlt }}
                    >
                      <div>
                        <p style={{ color: colors.text }}>
                          Class Announcement Notifications
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Show notifications for new class announcements
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div
                          className="w-11 h-6 rounded-full peer bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                          style={{
                            backgroundColor: colors.primary,
                          }}
                        ></div>
                      </label>
                    </div>

                    <div
                      className="flex items-center justify-between p-4 rounded-lg"
                      style={{ backgroundColor: colors.cardBgAlt }}
                    >
                      <div>
                        <p style={{ color: colors.text }}>
                          New Material Notifications
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Show notifications for new uploaded materials
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div
                          className="w-11 h-6 rounded-full peer bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                          style={{
                            backgroundColor: colors.primary,
                          }}
                        ></div>
                      </label>
                    </div>

                    <div
                      className="flex items-center justify-between p-4 rounded-lg"
                      style={{ backgroundColor: colors.cardBgAlt }}
                    >
                      <div>
                        <p style={{ color: colors.text }}>
                          Quiz Reminder Notifications
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Send reminders for upcoming quizzes
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div
                          className="w-11 h-6 rounded-full peer bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"
                          style={{
                            backgroundColor: colors.primary,
                          }}
                        ></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div
            className="p-4 border-t flex justify-end items-center"
            style={{ borderColor: colors.borderColor }}
          >
            {saveSuccess && (
              <div
                className="mr-4 flex items-center px-3 py-1 rounded"
                style={{
                  backgroundColor: `${colors.success}20`,
                  color: colors.success,
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Settings saved successfully
              </div>
            )}

            <button
              className="px-4 py-2 rounded-lg flex items-center"
              style={{
                backgroundColor: colors.primary,
                color: colors.lightText,
              }}
              onClick={handleSaveSettings}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlatformSettings;
