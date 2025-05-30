import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  createClass,
  resetStatus,
  updateClass,
} from "../../store/admin/classesSlice.js";
import { toast } from "react-toastify";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {useAppSettings} from "../../contexts/AppSettingsProvider.jsx";

const CreateClassModal = ({ showModal, setShowModal, classInfo }) => {
  const { colors } = useAppSettings();
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const { status, error } = useSelector((state) => state.adminClasses);
  const { user } = useSelector((state) => state.auth);
  // State for form fields
  const [newClassName, setNewClassName] = useState("");
  const [newClassField, setNewClassField] = useState("Mathematics");
  const [newClassDescription, setNewClassDescription] = useState("");
  const [selectedTheme, setSelectedTheme] = useState(0);
  const [classIcon, setClassIcon] = useState("📚");
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (classInfo?.id) {
      setNewClassName(classInfo?.course_name ?? "");
      setNewClassField(
        classInfo?.course_field
          ? classInfo?.course_field
              .split(" ")
              .map(
                (word) => word[0].toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ")
          : "Mathematics"
      );
      setNewClassDescription(classInfo?.description ?? "");
      setClassIcon(classInfo?.icon ?? "📚");
      setSelectedTheme(
        themeOptions?.findIndex(
          (theme) => theme?.colour === classInfo?.theme?.colour
        ) ?? 0
      );

      console.log(classInfo);
    }
  }, [showModal]);
  // Course field options for dropdown
  const courseFieldOptions = [
    "mathematics",
    "science",
    "computerScience",
    "history",
    "geography",
    "art",
    "music",
    "physicalEducation",
    "literature",
    "languageArts",
    "foreignLanguages",
    "philosophy",
    "economics",
    "businessStudies",
    "psychology",
    "sociology",
    "engineering",
    "biology",
    "chemistry",
    "physics",
    "other",
  ];

  // Theme options for class cards
  const themeOptions = [
    {
      name: "purpleSky",
      gradient: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
      colour: "purple",
    },
    {
      name: "warmSunset",
      gradient: "linear-gradient(135deg, #ff8a00 0%, #e52e71 100%)",
      colour: "orange",
    },
    {
      name: "greenMeadow",
      gradient: "linear-gradient(135deg, #38ef7d 0%, #11998e 100%)",
      colour: "green",
    },
    {
      name: "oceanBlue",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      colour: "blue",
    },
    {
      name: "cherryBlossom",
      gradient: "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)",
      colour: "pink",
    },
    {
      name: "autumn",
      gradient: "linear-gradient(135deg, #f46b45 0%, #eea849 100%)",
      colour: "red1",
    },
    {
      name: "midnight",
      gradient: "linear-gradient(135deg, #434343 0%, #000000 100%)",
      colour: "black",
    },
    {
      name: "fruity",
      gradient: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
      colour: "red2",
    },
  ];

  // Class icon options
  const iconOptions = [
    "📚",
    "🧮",
    "🔬",
    "🧠",
    "💻",
    "📝",
    "🌍",
    "🧪",
    "📊",
    "🔭",
    "🎨",
    "🏛️",
    "⚗️",
    "🔠",
  ];

  // Monitor status changes for success/error handling
  useEffect(() => {
    if (status === "succeeded" && isSubmitting) {
      toast.success("Class created successfully!");
      resetForm();
      setShowModal(false);
      setIsSubmitting(false);
    } else if (status === "failed" && isSubmitting) {
      toast.error(error || "Failed to create class. Please try again.");
      setIsSubmitting(false);
    }

    // Clean up function to reset status when component unmounts
    return () => {
      if (status !== "idle") {
        dispatch(resetStatus());
      }
    };
  }, [status, error, isSubmitting, dispatch, setShowModal]);

  const resetForm = () => {
    setNewClassName("");
    setNewClassField("Mathematics");
    setNewClassDescription("");
    setSelectedTheme(0);
    setClassIcon("📚");
    dispatch(resetStatus());
  };

  const handleSubmit = () => {
    // Get userId from localStorage
    const userId = localStorage.getItem("userId");
    if (!userId && !user?.id) {
      toast.error("User ID not found. Please log in again.");
      return;
    }

    // Prepare class data for API according to the required format
    const classData = {
      courseName: newClassName,
      courseField: newClassField.toUpperCase(),
      description: newClassDescription || "No description provided",
      licenseId: userId || user?.id,
      theme: {
        colour: themeOptions[selectedTheme].colour,
      },
      icon: classIcon,
    };

    // Set submitting state and dispatch create class action
    setIsSubmitting(true);
    if (classInfo?.id) {
      dispatch(updateClass({ classId: classInfo.id, userId, classData }));
    } else {
      dispatch(createClass(classData));
    }
  };

  // Close modal handler with form reset
  const handleCloseModal = () => {
    resetForm();
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
    >
      <div
        className="w-full max-w-xl rounded-lg shadow-lg overflow-hidden"
        style={{ backgroundColor: colors.cardBgAlt, maxHeight: "80vh" }}
      >
        {/* Modal Header */}
        <div
          className="flex justify-between items-center p-5 border-b"
          style={{ borderColor: colors.borderColor }}
        >
          <h3 className="text-lg font-medium" style={{ color: colors.primary }}>
            {classInfo?.id ? t("editClass") : t("createClass")}
          </h3>
          <button
            onClick={handleCloseModal}
            className="p-1 rounded-full hover:bg-opacity-20"
            style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}
          >
            <X className="w-5 h-5" style={{ color: colors.text }} />
          </button>
        </div>

        {/* Modal Content */}
        <div
          className="p-5 overflow-y-auto"
          style={{ maxHeight: "calc(80vh - 130px)" }}
        >
          <div className="space-y-4">
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: colors.terColor }}
              >
                {t("className")} *
              </label>
              <input
                type="text"
                value={newClassName}
                onChange={(e) => setNewClassName(e.target.value)}
                placeholder={t("enterClassName")}
                className="w-full p-3 rounded-lg"
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
                style={{ color: colors.terColor }}
              >
                {t("courseField")} *
              </label>
              <select
                value={newClassField}
                onChange={(e) => setNewClassField(e.target.value)}
                className="w-full p-3 rounded-lg appearance-none"
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
                {courseFieldOptions.map((field) => (
                  <option key={field} value={field}>
                    {t(field)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: colors.terColor }}
              >
                {t("description")}
              </label>
              <textarea
                value={newClassDescription}
                onChange={(e) => setNewClassDescription(e.target.value)}
                placeholder={t("briefDescription")}
                className="w-full p-3 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.text,
                  minHeight: "80px",
                  resize: "vertical",
                }}
              />
            </div>

            {/* Class Icon Selection */}
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: colors.terColor }}
              >
                {t("classIcon")}
              </label>
              <div
                className="grid grid-cols-7 gap-2 p-3 rounded-lg"
                style={{
                  backgroundColor: colors.inputBg,
                  border: `1px solid ${colors.borderColor}`,
                }}
              >
                {iconOptions.map((icon, index) => (
                  <button
                    key={index}
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl transition-all"
                    style={{
                      backgroundColor:
                        classIcon === icon
                          ? `${colors.primary}40`
                          : "transparent",
                      border:
                        classIcon === icon
                          ? `1px solid ${colors.primary}`
                          : `1px solid ${colors.borderColor}`,
                    }}
                    onClick={() => setClassIcon(icon)}
                    type="button"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Selection */}
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: colors.terColor }}
              >
                {t("classTheme")}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {themeOptions.map((theme, index) => (
                  <button
                    key={index}
                    className="relative overflow-hidden rounded-lg transition-all"
                    style={{
                      height: "60px",
                      border:
                        selectedTheme === index
                          ? `2px solid ${colors.primary}`
                          : `1px solid ${colors.borderColor}`,
                      background: theme.gradient,
                    }}
                    onClick={() => setSelectedTheme(index)}
                    type="button"
                  >
                    {selectedTheme === index && (
                      <div
                        className="absolute top-1 right-1 w-5 h-5 rounded-full flex items-center justify-center"
                        style={{
                          backgroundColor: "rgba(255, 255, 255, 0.9)",
                        }}
                      >
                        <Check className="w-3 h-3 text-black" />
                      </div>
                    )}
                    <div
                      className="absolute bottom-0 left-0 right-0 text-xs px-2 py-1 text-center font-medium"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.4)",
                        color: "#ffffff",
                      }}
                    >
                      {t(`${theme.name}`)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Class Preview */}
            <div>
              <label
                className="block text-sm mb-2"
                style={{ color: colors.terColor }}
              >
                {t("preview")}
              </label>
              <div
                className="rounded-lg overflow-hidden"
                style={{
                  border: `1px solid ${colors.borderColor}`,
                  backgroundColor: colors.cardBg,
                }}
              >
                {/* Header */}
                <div
                  className="h-24 p-4 relative"
                  style={{
                    background: themeOptions[selectedTheme]?.gradient,
                  }}
                >
                  {/* Decorative elements */}
                  <div
                    className="absolute -right-8 -top-8 w-24 h-24 rounded-full opacity-20"
                    style={{ background: "rgba(255, 255, 255, 0.3)" }}
                  ></div>
                  <div
                    className="absolute -left-4 -bottom-4 w-16 h-16 rounded-full opacity-20"
                    style={{ background: "rgba(255, 255, 255, 0.3)" }}
                  ></div>

                  <div className="flex justify-between items-start relative z-10">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-xl bg-white bg-opacity-20">
                      {classIcon}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white relative z-10 mt-2">
                    {newClassName || t("className")}
                  </h3>
                </div>

                {/* Card content preview */}
                <div className="p-3">
                  <div className="flex items-center mb-2">
                    <div
                      className="w-6 h-6 rounded-full mr-2 flex items-center justify-center text-white font-bold text-xs"
                      style={{
                        background: `linear-gradient(135deg, ${colors.accent} 0%, ${colors.accentLight} 100%)`,
                      }}
                    >
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <p style={{ color: colors.text, fontSize: "0.8rem" }}>
                      {user.name}
                    </p>
                  </div>

                  <p
                    className="text-xs line-clamp-1"
                    style={{ color: colors.terColor }}
                  >
                    {newClassDescription || t("descriptionPlaceholder")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className="flex justify-end p-5 border-t"
          style={{ borderColor: colors.borderColor }}
        >
          <button
            onClick={handleCloseModal}
            className={`px-4 py-2 ${
              i18n.language === "ar" ? "ml-3" : "mr-3"
            } rounded-lg text-sm`}
            style={{
              backgroundColor: "transparent",
              border: `1px solid ${colors.borderColor}`,
              color: colors.text,
            }}
            type="button"
          >
            {t("cancel")}
          </button>
          <button
            className="px-4 py-2 rounded-lg text-sm font-medium mb-2"
            style={{
              backgroundColor: colors.primary,
              color: colors.cardBg,
              opacity:
                !newClassName || !newClassField || isSubmitting ? 0.6 : 1,
              cursor:
                !newClassName || !newClassField || isSubmitting
                  ? "not-allowed"
                  : "pointer",
            }}
            disabled={!newClassName || !newClassField || isSubmitting}
            onClick={handleSubmit}
            type="button"
          >
            {classInfo?.id
              ? isSubmitting
                ? t("editing")
                : t("editClass")
              : isSubmitting
              ? t("creating")
              : t("createClass")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateClassModal;
