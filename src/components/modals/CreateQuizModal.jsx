// src/components/quizzes/CreateQuizModal.js

import React, { useState, useRef } from "react";
import {
  X,
  Check,
  Bot,
  PenLine,
  PlusCircle,
  Info,
  Edit,
  Trash2,
  FileQuestion,
  Clock,
} from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext.jsx";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {
  manualCreateActivity,
  createActivityFromTemplate,
  createActivityFromPromt,
} from "../../store/admin/quizSlice.js";
import { useNavigate } from "react-router-dom";
import { useAppSettings } from "../../contexts/AppSettingsProvider.jsx";

const CreateQuizModal = ({ showModal, setShowModal }) => {
  const dispatch = useDispatch();
  const [quizCreationMethod, setQuizCreationMethod] = useState("ai"); // ai, template, manual
  const [quizPrompt, setQuizPrompt] = useState("");
  const [quizName, setQuizName] = useState("");
  const [quizFile, setQuizFile] = useState(null);
  const [quizTemplate, setQuizTemplate] = useState(null);
  const [quizGenerationStep, setQuizGenerationStep] = useState(1);
  const [generatingQuiz, setGeneratingQuiz] = useState(false);
  const [manualQuestions, setManualQuestions] = useState([]);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [apiResponse, setApiResponse] = useState(null);
  const [quizDifficulty, setQuizDifficulty] = useState("medium");
  const [quizNumQuestions, setQuizNumQuestions] = useState(10);
  const navigate = useNavigate();
  const quizFileInputRef = useRef(null);
  // const classId = localStorage.getItem("classId");
  const { colors } = useAppSettings();

  // Mapping of difficulty levels to numerical values for API
  const difficultyMapping = {
    easy: 3,
    medium: 6,
    hard: 9,
    mixed: 5,
  };

  const resetQuizForm = () => {
    setQuizName("");
    setQuizPrompt("");
    setQuizFile(null);
    setQuizTemplate(null);
    setQuizGenerationStep(1);
    setQuizCreationMethod("ai");
    setManualQuestions([]);
    setGeneratedQuestions([]);
    setGeneratingQuiz(false);
    setApiResponse(null);
    setQuizDifficulty("medium");
    setQuizNumQuestions(10);
  };

  // Process questions from the API response to match our UI format
  const processApiQuestions = (questions) => {
    return questions.map((question) => {
      // For MCQ questions, find the index of the correct answer
      let correctAnswerIndex = 0;
      if (question.type === "mcq") {
        correctAnswerIndex = question.options.findIndex(
          (option) => option === question.correctAnswer
        );
        // If not found, default to first option
        if (correctAnswerIndex === -1) correctAnswerIndex = 0;
      }

      return {
        text: question.text,
        type: question.type === "mcq" ? "multiple" : question.type,
        options: question.options || [],
        correctAnswer: correctAnswerIndex,
        originalId: question.id,
        time: question.time,
        points: question.points,
      };
    });
  };

  // Uses the prompt API to generate a quiz from AI
  const generateFromAI = () => {
    if (!quizPrompt || !quizName) return;

    setGeneratingQuiz(true);
    setUploadProgress(0);

    // Prepare prompt data
    const promptData = {
      prompt: quizPrompt,
      // classId: parseInt(classId),
      difficulty: difficultyMapping[quizDifficulty],
      language: "English",
      numOfQuestions: quizNumQuestions,
      quizName: quizName,
      type: ["MCQ"],
    };

    // Simulate progress while API call is happening
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 1, 95));
    }, 200);

    // Dispatch the API action
    dispatch(createActivityFromPromt(promptData))
      .unwrap()
      .then((response) => {
        clearInterval(progressInterval);
        setUploadProgress(100);

        // Store the complete API response
        setApiResponse(response);

        // Process the questions from the API response to match our UI format
        const processedQuestions = processApiQuestions(response.questions);
        setGeneratedQuestions(processedQuestions);

        setTimeout(() => {
          setGeneratingQuiz(false);
        }, 500);

        toast.success("AI quiz generated successfully!");
      })
      .catch((error) => {
        console.log(error);
        clearInterval(progressInterval);
        setGeneratingQuiz(false);
        toast.error(
          `Failed to generate AI quiz: ${error.message || "Unknown error"}`
        );
      });
  };

  // Uses the template API to generate a quiz from a template
  const generateFromTemplate = () => {
    if (!quizTemplate || !quizName) return;

    setGeneratingQuiz(true);
    setUploadProgress(0);

    // Prepare template data
    const templateData = {
      // classId: parseInt(classId),
      quizName: quizName,
      templateId: quizTemplate.id,
    };

    // Simulate progress while API call is happening
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 1, 95));
    }, 200);

    // Dispatch the API action
    dispatch(createActivityFromTemplate(templateData))
      .unwrap()
      .then((response) => {
        clearInterval(progressInterval);
        setUploadProgress(100);

        // Store the complete API response
        setApiResponse(response);

        // Process the questions from the API response to match our UI format
        const processedQuestions = processApiQuestions(response.questions);
        setGeneratedQuestions(processedQuestions);

        setTimeout(() => {
          setGeneratingQuiz(false);
        }, 500);

        toast.success("Template quiz generated successfully!");
      })
      .catch((error) => {
        clearInterval(progressInterval);
        setGeneratingQuiz(false);
        toast.error(
          `Failed to generate template quiz: ${
            error.message || "Unknown error"
          }`
        );
      });
  };

  const handleQuizFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File is too large. Maximum size is 5MB.");
        return;
      }
      setQuizFile(file);
    }
  };

  // Remove a question in manual mode
  const removeQuestion = (index) => {
    const updatedQuestions = [...manualQuestions];
    updatedQuestions.splice(index, 1);
    setManualQuestions(updatedQuestions);
  };

  // Update question text in manual mode
  const updateQuestionText = (index, text) => {
    const updatedQuestions = [...manualQuestions];
    updatedQuestions[index].text = text;
    setManualQuestions(updatedQuestions);
  };

  // Update question type in manual mode
  const updateQuestionType = (index, type) => {
    const updatedQuestions = [...manualQuestions];
    updatedQuestions[index].type = type;

    // Reset options and correct answer for the new type
    if (type === "multiple") {
      updatedQuestions[index].options = ["", ""];
      updatedQuestions[index].correctAnswer = 0;
    } else if (type === "truefalse") {
      updatedQuestions[index].options = [];
      updatedQuestions[index].correctAnswer = true;
    } else if (type === "shortanswer") {
      updatedQuestions[index].options = [];
      updatedQuestions[index].correctAnswer = "";
    }

    setManualQuestions(updatedQuestions);
  };

  // Update option in multiple choice question
  const updateOption = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...manualQuestions];
    updatedQuestions[questionIndex].options[optionIndex] = value;
    setManualQuestions(updatedQuestions);
  };

  // Add option to multiple choice question
  const addOption = (questionIndex) => {
    const updatedQuestions = [...manualQuestions];
    updatedQuestions[questionIndex].options.push("");
    setManualQuestions(updatedQuestions);
  };

  // Remove option from multiple choice question
  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...manualQuestions];
    updatedQuestions[questionIndex].options.splice(optionIndex, 1);
    // If removing the correct answer, reset to first option
    if (updatedQuestions[questionIndex].correctAnswer === optionIndex) {
      updatedQuestions[questionIndex].correctAnswer = 0;
    } else if (updatedQuestions[questionIndex].correctAnswer > optionIndex) {
      // Adjust the correctAnswer index if it's after the removed option
      updatedQuestions[questionIndex].correctAnswer--;
    }
    setManualQuestions(updatedQuestions);
  };

  // Update correct answer
  const updateCorrectAnswer = (questionIndex, value) => {
    const updatedQuestions = [...manualQuestions];
    updatedQuestions[questionIndex].correctAnswer = value;
    setManualQuestions(updatedQuestions);
  };

  const addNewQuestion = () => {
    setManualQuestions([
      ...manualQuestions,
      {
        text: "",
        type: "multiple",
        options: ["", ""],
        correctAnswer: 0,
      },
    ]);
  };

  const handleNext = () => {
    if (quizName) {
      if (quizCreationMethod === "manual") {
        const activityData = { quizName };
        dispatch(manualCreateActivity(activityData))
          .unwrap()
          .then((response) => {
            // navigate(`/quizconfig?id=${response?.id}`);
            toast.success("Quiz created successfully");
            resetQuizForm();
            setShowModal(false);
          })
          .catch((error) => {
            toast.error(`${error?.message || "Something went wrong"}`);
          });
      } else {
        setQuizGenerationStep(2);
      }
    }
  };

  // Handle quiz creation when finalizing in AI or template mode
  const handleFinalizeQuiz = () => {
    // For AI or Template method with API response
    if (
      (quizCreationMethod === "ai" || quizCreationMethod === "template") &&
      apiResponse
    ) {
    //   navigate(`/quizconfig?id=${apiResponse.id}`);
      resetQuizForm();
      setShowModal(false);
      toast.success(
        `${
          quizCreationMethod === "ai" ? "AI" : "Template"
        } quiz created successfully!`
      );
    }
  };

  // Quiz templates
  const quizTemplates = [
    {
      id: 1,
      name: "Mathematics Basics",
      questions: 10,
      type: "Multiple Choice",
      description:
        "A template covering fundamental mathematics concepts including algebra, geometry, and arithmetic.",
    },
    {
      id: 2,
      name: "Calculus Foundations",
      questions: 15,
      type: "Mixed",
      description:
        "Comprehensive template covering limits, derivatives, and integrals with multiple choice and short answer questions.",
    },
    {
      id: 3,
      name: "Linear Algebra Concepts",
      questions: 12,
      type: "Multiple Choice",
      description:
        "Template focusing on vectors, matrices, linear transformations, and eigenvalues.",
    },
    {
      id: 4,
      name: "Geometry Essentials",
      questions: 8,
      type: "True/False & Multiple Choice",
      description:
        "Basic template covering angles, shapes, theorems, and proofs in geometry.",
    },
    {
      id: 5,
      name: "Statistics Fundamentals",
      questions: 14,
      type: "Mixed",
      description:
        "Template covering probability, distributions, hypothesis testing, and data analysis.",
    },
  ];

  if (!showModal) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.75)" }}
    >
      <div
        className="w-full max-w-2xl rounded-lg shadow-lg overflow-hidden"
        style={{ backgroundColor: colors.cardBgAlt, maxHeight: "90vh" }}
      >
        {/* Modal Header */}
        <div
          className="flex justify-between items-center p-5 border-b"
          style={{ borderColor: colors.borderColor }}
        >
          <h3 className="text-lg font-medium" style={{ color: colors.primary }}>
            Create New Quiz
          </h3>
          <button
            onClick={() => {
              setShowModal(false);
              resetQuizForm();
            }}
            className="p-1 rounded-full hover:bg-opacity-20"
            style={{ backgroundColor: "rgba(187, 134, 252, 0.05)" }}
          >
            <X className="w-5 h-5" style={{ color: colors.text }} />
          </button>
        </div>

        {/* Modal Content */}
        <div
          className="p-5 overflow-y-auto"
          style={{ maxHeight: "calc(90vh - 130px)" }}
        >
          {quizGenerationStep === 1 && (
            <div>
              <p className="text-sm mb-5" style={{ color: colors.terColor }}>
                Choose how you want to create your quiz:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <button
                  className="flex flex-col items-center p-6 rounded-lg"
                  style={{
                    backgroundColor:
                      quizCreationMethod === "ai"
                        ? colors.navActiveBg
                        : colors.cardBg,
                    border: `1px solid ${
                      quizCreationMethod === "ai"
                        ? colors.primary
                        : colors.borderColor
                    }`,
                    color: colors.text,
                  }}
                  onClick={() => setQuizCreationMethod("ai")}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                    style={{
                      backgroundColor:
                        quizCreationMethod === "ai"
                          ? "rgba(187, 134, 252, 0.1)"
                          : "rgba(224, 224, 224, 0.05)",
                    }}
                  >
                    <Bot
                      className="w-6 h-6"
                      style={{
                        color:
                          quizCreationMethod === "ai"
                            ? colors.primary
                            : colors.terColor2,
                      }}
                    />
                  </div>
                  <span className="font-medium mb-1">AI Generated</span>
                  <span
                    className="text-xs text-center"
                    style={{ color: colors.terColor }}
                  >
                    Generate questions using AI from your content or prompt
                  </span>
                </button>

                <button
                  className="flex flex-col items-center p-6 rounded-lg"
                  style={{
                    backgroundColor:
                      quizCreationMethod === "template"
                        ? colors.navActiveBg
                        : colors.cardBg,
                    border: `1px solid ${
                      quizCreationMethod === "template"
                        ? colors.primary
                        : colors.borderColor
                    }`,
                    color: colors.text,
                  }}
                  onClick={() => setQuizCreationMethod("template")}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                    style={{
                      backgroundColor:
                        quizCreationMethod === "template"
                          ? "rgba(187, 134, 252, 0.1)"
                          : "rgba(224, 224, 224, 0.05)",
                    }}
                  >
                    <FileQuestion
                      className="w-6 h-6"
                      style={{
                        color:
                          quizCreationMethod === "template"
                            ? colors.primary
                            : colors.terColor2,
                      }}
                    />
                  </div>
                  <span className="font-medium mb-1">From Template</span>
                  <span
                    className="text-xs text-center"
                    style={{ color: colors.terColor }}
                  >
                    Use or modify an existing quiz template
                  </span>
                </button>

                <button
                  className="flex flex-col items-center p-6 rounded-lg"
                  style={{
                    backgroundColor:
                      quizCreationMethod === "manual"
                        ? colors.navActiveBg
                        : colors.cardBg,
                    border: `1px solid ${
                      quizCreationMethod === "manual"
                        ? colors.primary
                        : colors.borderColor
                    }`,
                    color: colors.text,
                  }}
                  onClick={() => setQuizCreationMethod("manual")}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-3"
                    style={{
                      backgroundColor:
                        quizCreationMethod === "manual"
                          ? "rgba(187, 134, 252, 0.1)"
                          : "rgba(224, 224, 224, 0.05)",
                    }}
                  >
                    <PenLine
                      className="w-6 h-6"
                      style={{
                        color:
                          quizCreationMethod === "manual"
                            ? colors.primary
                            : colors.terColor2,
                      }}
                    />
                  </div>
                  <span className="font-medium mb-1">Create Manually</span>
                  <span
                    className="text-xs text-center"
                    style={{ color: colors.terColor }}
                  >
                    Create and customize questions yourself
                  </span>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm mb-2"
                    style={{ color: colors.terColor }}
                  >
                    Quiz Name *
                  </label>
                  <input
                    type="text"
                    value={quizName}
                    onChange={(e) => setQuizName(e.target.value)}
                    placeholder="Enter a name for this quiz"
                    className="w-full p-3 rounded-lg"
                    style={{
                      backgroundColor: colors.inputBg,
                      border: `1px solid ${colors.borderColor}`,
                      color: colors.text,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {quizGenerationStep === 2 && quizCreationMethod === "ai" && (
            <div className="space-y-5">
              <div>
                <h4
                  className="text-base font-medium mb-3"
                  style={{ color: colors.text }}
                >
                  Generate Questions with AI
                </h4>

                <div className="flex flex-col space-y-4">
                  <div>
                    <label
                      className="block text-sm mb-2"
                      style={{ color: colors.terColor }}
                    >
                      Source Material
                    </label>
                    <div className="flex gap-4">
                      <button
                        className="flex-1 p-3 rounded-lg text-sm"
                        style={{
                          backgroundColor: !quizFile
                            ? colors.navActiveBg
                            : colors.cardBg,
                          border: `1px solid ${
                            !quizFile ? colors.primary : colors.borderColor
                          }`,
                          color: colors.text,
                        }}
                        onClick={() => setQuizFile(null)}
                      >
                        Prompt
                      </button>
                      {/* <button
                        className="flex-1 p-3 rounded-lg text-sm"
                        style={{
                          backgroundColor: quizFile
                            ? colors.navActiveBg
                            : colors.cardBg,
                          border: `1px solid ${
                            quizFile ? colors.primary : colors.borderColor
                          }`,
                          color: colors.text,
                        }}
                        onClick={() => quizFileInputRef.current.click()}
                      >
                        Upload Material
                      </button> */}
                      <input
                        type="file"
                        ref={quizFileInputRef}
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                        onChange={handleQuizFileChange}
                      />
                    </div>
                  </div>

                  {quizFile ? (
                    <div
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.borderColor}`,
                      }}
                    >
                      <div className="flex items-start">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                          style={{
                            backgroundColor: "rgba(187, 134, 252, 0.1)",
                          }}
                        >
                          <FileQuestion
                            className="w-5 h-5"
                            style={{ color: colors.primary }}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm" style={{ color: colors.text }}>
                            {quizFile.name}
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: colors.terColor2 }}
                          >
                            {(quizFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <button
                          className="p-1 rounded hover:bg-opacity-20"
                          style={{
                            backgroundColor: "rgba(187, 134, 252, 0.05)",
                          }}
                          onClick={() => setQuizFile(null)}
                        >
                          <X
                            className="w-4 h-4"
                            style={{ color: colors.terColor2 }}
                          />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.terColor }}
                      >
                        Topic or Prompt
                      </label>
                      <textarea
                        value={quizPrompt}
                        onChange={(e) => setQuizPrompt(e.target.value)}
                        placeholder="Describe the topic or content for which you want to generate questions..."
                        className="w-full p-3 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                          minHeight: "120px",
                          resize: "vertical",
                        }}
                      />
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.terColor }}
                      >
                        Number of Questions
                      </label>
                      <select
                        className="w-full p-3 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                        value={quizNumQuestions}
                        onChange={(e) =>
                          setQuizNumQuestions(parseInt(e.target.value, 10))
                        }
                      >
                        <option value="5">5 questions</option>
                        <option value="10">10 questions</option>
                        <option value="15">15 questions</option>
                        <option value="20">20 questions</option>
                      </select>
                    </div>

                    <div>
                      <label
                        className="block text-sm mb-2"
                        style={{ color: colors.terColor }}
                      >
                        Difficulty Level
                      </label>
                      <select
                        className="w-full p-3 rounded-lg"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                        value={quizDifficulty}
                        onChange={(e) => setQuizDifficulty(e.target.value)}
                      >
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                        <option value="mixed">Mixed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-sm mb-2"
                      style={{ color: colors.terColor }}
                    >
                      Question Types
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className="flex items-center p-3 rounded-lg"
                        style={{
                          backgroundColor: colors.cardBg,
                          border: `1px solid ${colors.borderColor}`,
                        }}
                      >
                        <input
                          type="checkbox"
                          id="multiple-choice"
                          defaultChecked
                          className="mr-2"
                        />
                        <label
                          htmlFor="multiple-choice"
                          style={{ color: colors.text }}
                        >
                          Multiple Choice
                        </label>
                      </div>
                      <div
                        className="flex items-center p-3 rounded-lg"
                        style={{
                          backgroundColor: colors.cardBg,
                          border: `1px solid ${colors.borderColor}`,
                        }}
                      >
                        <input
                          type="checkbox"
                          id="true-false"
                          defaultChecked
                          className="mr-2"
                        />
                        <label
                          htmlFor="true-false"
                          style={{ color: colors.text }}
                        >
                          True/False
                        </label>
                      </div>
                      <div
                        className="flex items-center p-3 rounded-lg"
                        style={{
                          backgroundColor: colors.cardBg,
                          border: `1px solid ${colors.borderColor}`,
                        }}
                      >
                        <input
                          type="checkbox"
                          id="short-answer"
                          className="mr-2"
                        />
                        <label
                          htmlFor="short-answer"
                          style={{ color: colors.text }}
                        >
                          Short Answer
                        </label>
                      </div>
                      <div
                        className="flex items-center p-3 rounded-lg"
                        style={{
                          backgroundColor: colors.cardBg,
                          border: `1px solid ${colors.borderColor}`,
                        }}
                      >
                        <input type="checkbox" id="matching" className="mr-2" />
                        <label
                          htmlFor="matching"
                          style={{ color: colors.text }}
                        >
                          Matching
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: "rgba(3, 218, 198, 0.1)",
                  border: `1px solid ${colors.accent}`,
                }}
              >
                <div className="flex items-start">
                  <Info
                    className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                    style={{ color: colors.accent }}
                  />
                  <p className="text-sm" style={{ color: colors.terColor }}>
                    The AI will generate questions based on your input. You'll
                    be able to review and edit the questions before finalizing
                    the quiz.
                  </p>
                </div>
              </div>
            </div>
          )}

          {quizGenerationStep === 2 && quizCreationMethod === "template" && (
            <div className="space-y-5">
              <h4
                className="text-base font-medium mb-3"
                style={{ color: colors.text }}
              >
                Select a Template
              </h4>

              <div
                className="grid grid-cols-1 gap-3 max-h-[400px] overflow-y-auto p-1"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: `${colors.primary} ${colors.cardBg}`,
                }}
              >
                {quizTemplates.map((template) => (
                  <button
                    key={template.id}
                    className="flex items-start p-4 rounded-lg text-left"
                    style={{
                      backgroundColor:
                        quizTemplate?.id === template.id
                          ? colors.navActiveBg
                          : colors.cardBg,
                      border: `1px solid ${
                        quizTemplate?.id === template.id
                          ? colors.primary
                          : colors.borderColor
                      }`,
                    }}
                    onClick={() => setQuizTemplate(template)}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center mr-3 flex-shrink-0"
                      style={{
                        backgroundColor: "rgba(187, 134, 252, 0.1)",
                      }}
                    >
                      <FileQuestion
                        className="w-5 h-5"
                        style={{ color: colors.primary }}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: colors.text }}>
                        {template.name}
                      </p>
                      <div className="flex items-center mt-1 mb-2">
                        <span
                          className="text-xs"
                          style={{ color: colors.terColor }}
                        >
                          {template.questions} questions
                        </span>
                        <span
                          className="mx-2"
                          style={{ color: colors.terColor5 }}
                        >
                          •
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: colors.terColor }}
                        >
                          {template.type}
                        </span>
                      </div>
                      <p
                        className="text-xs"
                        style={{ color: colors.terColor2 }}
                      >
                        {template.description}
                      </p>
                    </div>
                    <div className="ml-3 mt-1">
                      {quizTemplate?.id === template.id && (
                        <Check
                          className="w-5 h-5"
                          style={{ color: colors.primary }}
                        />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: "rgba(3, 218, 198, 0.1)",
                  border: `1px solid ${colors.accent}`,
                }}
              >
                <div className="flex items-start">
                  <Info
                    className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                    style={{ color: colors.accent }}
                  />
                  <p className="text-sm" style={{ color: colors.terColor }}>
                    You'll be able to customize the template questions in the
                    next step before finalizing the quiz.
                  </p>
                </div>
              </div>
            </div>
          )}

          {quizGenerationStep === 2 && quizCreationMethod === "manual" && (
            <div className="space-y-5">
              <h4
                className="text-base font-medium mb-3"
                style={{ color: colors.text }}
              >
                Create Questions Manually
              </h4>

              <div className="space-y-4 max-h-[400px] overflow-y-auto p-1">
                {manualQuestions.length > 0 ? (
                  manualQuestions.map((question, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg"
                      style={{
                        backgroundColor: colors.cardBg,
                        border: `1px solid ${colors.borderColor}`,
                      }}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h5
                          className="text-sm font-medium"
                          style={{ color: colors.primary }}
                        >
                          Question {index + 1}
                        </h5>
                        <button
                          className="p-1 rounded hover:bg-opacity-20"
                          style={{
                            backgroundColor: "rgba(187, 134, 252, 0.05)",
                          }}
                          onClick={() => removeQuestion(index)}
                        >
                          <Trash2
                            className="w-4 h-4"
                            style={{ color: colors.accentSecondary }}
                          />
                        </button>
                      </div>

                      <div className="mb-3">
                        <input
                          type="text"
                          value={question.text}
                          onChange={(e) =>
                            updateQuestionText(index, e.target.value)
                          }
                          placeholder="Enter your question"
                          className="w-full p-2 rounded-lg text-sm"
                          style={{
                            backgroundColor: colors.inputBg,
                            border: `1px solid ${colors.borderColor}`,
                            color: colors.text,
                          }}
                        />
                      </div>

                      <div className="mb-3">
                        <select
                          value={question.type}
                          onChange={(e) =>
                            updateQuestionType(index, e.target.value)
                          }
                          className="w-full p-2 rounded-lg text-sm"
                          style={{
                            backgroundColor: colors.inputBg,
                            border: `1px solid ${colors.borderColor}`,
                            color: colors.text,
                          }}
                        >
                          <option value="multiple">Multiple Choice</option>
                          <option value="truefalse">True/False</option>
                          <option value="shortanswer">Short Answer</option>
                        </select>
                      </div>

                      {question.type === "multiple" && (
                        <div className="space-y-2">
                          {question.options.map((option, optIndex) => (
                            <div key={optIndex} className="flex items-center">
                              <input
                                type="radio"
                                checked={question.correctAnswer === optIndex}
                                onChange={() =>
                                  updateCorrectAnswer(index, optIndex)
                                }
                                className="mr-2"
                              />
                              <input
                                type="text"
                                value={option}
                                onChange={(e) =>
                                  updateOption(index, optIndex, e.target.value)
                                }
                                placeholder={`Option ${optIndex + 1}`}
                                className="flex-1 p-2 rounded-lg text-sm"
                                style={{
                                  backgroundColor: colors.inputBg,
                                  border: `1px solid ${colors.borderColor}`,
                                  color: colors.text,
                                }}
                              />
                              {question.options.length > 2 && (
                                <button
                                  className="p-1 ml-2 rounded hover:bg-opacity-20"
                                  style={{
                                    backgroundColor:
                                      "rgba(187, 134, 252, 0.05)",
                                  }}
                                  onClick={() => removeOption(index, optIndex)}
                                >
                                  <X
                                    className="w-4 h-4"
                                    style={{
                                      color: colors.terColor2,
                                    }}
                                  />
                                </button>
                              )}
                            </div>
                          ))}

                          {question.options.length < 5 && (
                            <button
                              className="flex items-center text-sm"
                              style={{ color: colors.primary }}
                              onClick={() => addOption(index)}
                            >
                              <PlusCircle className="w-4 h-4 mr-1" />
                              Add Option
                            </button>
                          )}
                        </div>
                      )}

                      {question.type === "truefalse" && (
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <input
                              type="radio"
                              checked={question.correctAnswer === true}
                              onChange={() => updateCorrectAnswer(index, true)}
                              className="mr-2"
                            />
                            <span style={{ color: colors.text }}>True</span>
                          </div>
                          <div className="flex items-center">
                            <input
                              type="radio"
                              checked={question.correctAnswer === false}
                              onChange={() => updateCorrectAnswer(index, false)}
                              className="mr-2"
                            />
                            <span style={{ color: colors.text }}>False</span>
                          </div>
                        </div>
                      )}

                      {question.type === "shortanswer" && (
                        <div>
                          <label
                            className="block text-xs mb-1"
                            style={{ color: colors.terColor }}
                          >
                            Correct Answer
                          </label>
                          <input
                            type="text"
                            value={question.correctAnswer || ""}
                            onChange={(e) =>
                              updateCorrectAnswer(index, e.target.value)
                            }
                            placeholder="Enter the correct answer"
                            className="w-full p-2 rounded-lg text-sm"
                            style={{
                              backgroundColor: colors.inputBg,
                              border: `1px solid ${colors.borderColor}`,
                              color: colors.text,
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div
                    className="p-6 rounded-lg text-center"
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px dashed ${colors.borderColor}`,
                    }}
                  >
                    <FileQuestion
                      className="w-12 h-12 mx-auto mb-3"
                      style={{ color: colors.terColor4 }}
                    />
                    <p className="mb-2" style={{ color: colors.text }}>
                      No questions added yet
                    </p>
                    <p
                      className="text-sm mb-4"
                      style={{ color: colors.terColor }}
                    >
                      Click the button below to add your first question
                    </p>
                  </div>
                )}

                <button
                  className="flex items-center justify-center p-3 w-full rounded-lg text-sm"
                  style={{
                    backgroundColor: "rgba(187, 134, 252, 0.1)",
                    border: `1px dashed ${colors.primary}`,
                    color: colors.primary,
                  }}
                  onClick={addNewQuestion}
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add New Question
                </button>
              </div>
            </div>
          )}

          {quizGenerationStep === 3 && generatingQuiz && (
            <div className="text-center py-10">
              <div className="mb-6">
                <div
                  className="w-20 h-20 rounded-full mx-auto flex items-center justify-center"
                  style={{
                    background: `conic-gradient(${colors.primary} ${uploadProgress}%, transparent 0)`,
                    position: "relative",
                  }}
                >
                  <div
                    className="absolute inset-2 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: colors.cardBgAlt }}
                  >
                    <span style={{ color: colors.primary, fontWeight: "bold" }}>
                      {uploadProgress}%
                    </span>
                  </div>
                </div>
              </div>
              <h4
                className="text-lg font-medium mb-2"
                style={{ color: colors.primary }}
              >
                {quizCreationMethod === "template"
                  ? "Loading Template..."
                  : "Generating Quiz Questions..."}
              </h4>
              <p className="text-sm" style={{ color: colors.terColor }}>
                {quizCreationMethod === "template"
                  ? "Please wait while we set up your template"
                  : "Please wait while we create your questions"}
              </p>

              {quizCreationMethod === "ai" && (
                <div
                  className="mt-6 p-4 mx-auto max-w-md rounded-lg text-left"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <p
                    className="text-sm mb-2 font-medium"
                    style={{ color: colors.text }}
                  >
                    AI is thinking...
                  </p>
                  <p className="text-xs" style={{ color: colors.terColor }}>
                    Analyzing content, identifying key concepts, and creating
                    relevant questions for {quizName}.
                  </p>
                </div>
              )}

              {quizCreationMethod === "template" && (
                <div
                  className="mt-6 p-4 mx-auto max-w-md rounded-lg text-left"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <p
                    className="text-sm mb-2 font-medium"
                    style={{ color: colors.text }}
                  >
                    Loading template...
                  </p>
                  <p className="text-xs" style={{ color: colors.terColor }}>
                    Setting up "{quizTemplate?.name}" template with{" "}
                    {quizTemplate?.questions} questions
                  </p>
                </div>
              )}
            </div>
          )}

          {quizGenerationStep === 3 && !generatingQuiz && (
            <div className="space-y-5">
              <div className="flex justify-between items-center">
                <h4
                  className="text-base font-medium"
                  style={{ color: colors.text }}
                >
                  Review Generated Questions
                </h4>
                <button
                  className="flex items-center text-sm"
                  style={{ color: colors.primary }}
                >
                  <PlusCircle className="w-4 h-4 mr-1" />
                  Add Question
                </button>
              </div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto p-1">
                {generatedQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: colors.cardBg,
                      border: `1px solid ${colors.borderColor}`,
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h5
                        className="text-sm font-medium"
                        style={{ color: colors.primary }}
                      >
                        Question {index + 1}
                      </h5>
                      <div className="flex">
                        <button
                          className="p-1 rounded hover:bg-opacity-20 mr-1"
                          style={{
                            backgroundColor: "rgba(187, 134, 252, 0.05)",
                          }}
                        >
                          <Edit
                            className="w-4 h-4"
                            style={{ color: colors.accent }}
                          />
                        </button>
                        <button
                          className="p-1 rounded hover:bg-opacity-20"
                          style={{
                            backgroundColor: "rgba(187, 134, 252, 0.05)",
                          }}
                        >
                          <Trash2
                            className="w-4 h-4"
                            style={{ color: colors.accentSecondary }}
                          />
                        </button>
                      </div>
                    </div>

                    <p className="mb-3 text-sm" style={{ color: colors.text }}>
                      {question.text}
                    </p>

                    {question.type === "multiple" && (
                      <div className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className="flex items-center p-2 rounded-lg"
                            style={{
                              backgroundColor:
                                question.correctAnswer === optIndex
                                  ? "rgba(3, 218, 198, 0.1)"
                                  : "transparent",
                              border: `1px solid ${
                                question.correctAnswer === optIndex
                                  ? colors.accent
                                  : colors.borderColor
                              }`,
                            }}
                          >
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center mr-2"
                              style={{
                                backgroundColor:
                                  question.correctAnswer === optIndex
                                    ? colors.accent
                                    : "transparent",
                                border: `1px solid ${
                                  question.correctAnswer === optIndex
                                    ? colors.accent
                                    : colors.borderColor
                                }`,
                              }}
                            >
                              {question.correctAnswer === optIndex && (
                                <Check className="w-3 h-3 text-black" />
                              )}
                            </div>
                            <span
                              className="text-sm"
                              style={{
                                color:
                                  question.correctAnswer === optIndex
                                    ? colors.accent
                                    : colors.text,
                                fontWeight:
                                  question.correctAnswer === optIndex
                                    ? "medium"
                                    : "normal",
                              }}
                            >
                              {option}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {question.type === "truefalse" && (
                      <div className="flex space-x-4">
                        <div
                          className="flex items-center p-2 rounded-lg"
                          style={{
                            backgroundColor:
                              question.correctAnswer === true
                                ? "rgba(3, 218, 198, 0.1)"
                                : "transparent",
                            border: `1px solid ${
                              question.correctAnswer === true
                                ? colors.accent
                                : colors.borderColor
                            }`,
                          }}
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center mr-2"
                            style={{
                              backgroundColor:
                                question.correctAnswer === true
                                  ? colors.accent
                                  : "transparent",
                              border: `1px solid ${
                                question.correctAnswer === true
                                  ? colors.accent
                                  : colors.borderColor
                              }`,
                            }}
                          >
                            {question.correctAnswer === true && (
                              <Check className="w-3 h-3 text-black" />
                            )}
                          </div>
                          <span
                            style={{
                              color:
                                question.correctAnswer === true
                                  ? colors.accent
                                  : colors.text,
                              fontWeight:
                                question.correctAnswer === true
                                  ? "medium"
                                  : "normal",
                            }}
                          >
                            True
                          </span>
                        </div>

                        <div
                          className="flex items-center p-2 rounded-lg"
                          style={{
                            backgroundColor:
                              question.correctAnswer === false
                                ? "rgba(3, 218, 198, 0.1)"
                                : "transparent",
                            border: `1px solid ${
                              question.correctAnswer === false
                                ? colors.accent
                                : colors.borderColor
                            }`,
                          }}
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center mr-2"
                            style={{
                              backgroundColor:
                                question.correctAnswer === false
                                  ? colors.accent
                                  : "transparent",
                              border: `1px solid ${
                                question.correctAnswer === false
                                  ? colors.accent
                                  : colors.borderColor
                              }`,
                            }}
                          >
                            {question.correctAnswer === false && (
                              <Check className="w-3 h-3 text-black" />
                            )}
                          </div>
                          <span
                            style={{
                              color:
                                question.correctAnswer === false
                                  ? colors.accent
                                  : colors.text,
                              fontWeight:
                                question.correctAnswer === false
                                  ? "medium"
                                  : "normal",
                            }}
                          >
                            False
                          </span>
                        </div>
                      </div>
                    )}

                    {question.type === "shortanswer" && (
                      <div
                        className="p-2 rounded-lg"
                        style={{
                          backgroundColor: "rgba(3, 218, 198, 0.1)",
                          border: `1px solid ${colors.accent}`,
                        }}
                      >
                        <p
                          className="text-xs"
                          style={{ color: colors.terColor }}
                        >
                          Correct Answer:
                        </p>
                        <p
                          className="text-sm font-medium"
                          style={{ color: colors.accent }}
                        >
                          {question.correctAnswer}
                        </p>
                      </div>
                    )}

                    {/* Additional information for quiz questions with time/points */}
                    {question.time && (
                      <div className="mt-2 flex items-center">
                        <Clock
                          className="w-4 h-4 mr-1"
                          style={{ color: colors.terColor2 }}
                        />
                        <span
                          className="text-xs"
                          style={{ color: colors.terColor }}
                        >
                          {question.time} seconds
                        </span>
                        {question.points && (
                          <>
                            <span
                              className="mx-2"
                              style={{ color: colors.terColor5 }}
                            >
                              •
                            </span>
                            <span
                              className="text-xs"
                              style={{ color: colors.terColor }}
                            >
                              {question.points} points
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div
                className="p-4 rounded-lg"
                style={{
                  backgroundColor: "rgba(3, 218, 198, 0.1)",
                  border: `1px solid ${colors.accent}`,
                }}
              >
                <div className="flex items-start">
                  <Info
                    className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0"
                    style={{ color: colors.accent }}
                  />
                  <div>
                    <p
                      className="text-sm mb-1"
                      style={{ color: colors.terColor }}
                    >
                      Review and edit questions as needed. You can:
                    </p>
                    <ul
                      className="text-xs list-disc list-inside"
                      style={{ color: colors.terColor }}
                    >
                      <li>Edit question text and options</li>
                      <li>Change correct answers</li>
                      <li>Add or remove questions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {quizGenerationStep === 4 && (
            <div className="space-y-5">
              <div className="text-center py-6">
                <div
                  className="w-20 h-20 rounded-full mx-auto flex items-center justify-center mb-6"
                  style={{ backgroundColor: "rgba(3, 218, 198, 0.1)" }}
                >
                  <Check
                    className="w-12 h-12"
                    style={{ color: colors.accent }}
                  />
                </div>
                <h4
                  className="text-lg font-medium mb-2"
                  style={{ color: colors.accent }}
                >
                  Quiz Created Successfully!
                </h4>
                <p className="text-sm mb-6" style={{ color: colors.terColor }}>
                  Your quiz is now ready to be shared with your class
                </p>
              </div>

              <div className="space-y-4">
                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <h5
                    className="text-sm font-medium mb-3"
                    style={{ color: colors.primary }}
                  >
                    Quiz Details
                  </h5>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                    <div>
                      <p className="text-xs" style={{ color: colors.terColor }}>
                        Name:
                      </p>
                      <p className="text-sm" style={{ color: colors.text }}>
                        {apiResponse ? apiResponse.quiz_name : quizName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: colors.terColor }}>
                        Questions:
                      </p>
                      <p className="text-sm" style={{ color: colors.text }}>
                        {apiResponse
                          ? apiResponse.questions.length
                          : generatedQuestions.length}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: colors.terColor }}>
                        Creation Method:
                      </p>
                      <p className="text-sm" style={{ color: colors.text }}>
                        {quizCreationMethod === "ai"
                          ? "AI Generated"
                          : quizCreationMethod === "template"
                          ? "From Template"
                          : "Manually Created"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs" style={{ color: colors.terColor }}>
                        Status:
                      </p>
                      <p className="text-sm" style={{ color: colors.accent }}>
                        Ready to Publish
                      </p>
                    </div>
                  </div>
                </div>

                <div
                  className="p-4 rounded-lg"
                  style={{
                    backgroundColor: colors.cardBg,
                    border: `1px solid ${colors.borderColor}`,
                  }}
                >
                  <h5
                    className="text-sm font-medium mb-3"
                    style={{ color: colors.primary }}
                  >
                    Quiz Settings
                  </h5>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: colors.text }}>
                        Publish Now
                      </span>
                      <div className="relative inline-block w-10 h-6">
                        <input
                          type="checkbox"
                          className="opacity-0 w-0 h-0"
                          id="publish-toggle"
                          defaultChecked
                        />
                        <span
                          className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition-all duration-300"
                          style={{ backgroundColor: colors.accent }}
                        >
                          <span
                            className="absolute w-4 h-4 left-1 bottom-1 rounded-full transition-all duration-300 transform translate-x-4"
                            style={{ backgroundColor: colors.cardBg }}
                          ></span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: colors.text }}>
                        Time Limit
                      </span>
                      <div className="flex items-center">
                        <Clock
                          className="w-4 h-4 mr-2"
                          style={{ color: colors.terColor2 }}
                        />
                        <select
                          className="p-1 text-sm rounded"
                          style={{
                            backgroundColor: colors.inputBg,
                            border: `1px solid ${colors.borderColor}`,
                            color: colors.text,
                          }}
                          defaultValue="30"
                        >
                          <option value="none">No Limit</option>
                          <option value="15">15 Minutes</option>
                          <option value="30">30 Minutes</option>
                          <option value="45">45 Minutes</option>
                          <option value="60">60 Minutes</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm" style={{ color: colors.text }}>
                        Attempts Allowed
                      </span>
                      <select
                        className="p-1 text-sm rounded"
                        style={{
                          backgroundColor: colors.inputBg,
                          border: `1px solid ${colors.borderColor}`,
                          color: colors.text,
                        }}
                        defaultValue="2"
                      >
                        <option value="1">1 Attempt</option>
                        <option value="2">2 Attempts</option>
                        <option value="3">3 Attempts</option>
                        <option value="unlimited">Unlimited</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div
          className="flex justify-between p-5 border-t"
          style={{ borderColor: colors.borderColor }}
        >
          {quizGenerationStep > 1 && quizGenerationStep < 4 && (
            <button
              onClick={() => setQuizGenerationStep((prev) => prev - 1)}
              className="px-4 py-2 rounded-lg text-sm"
              style={{
                backgroundColor: "transparent",
                border: `1px solid ${colors.borderColor}`,
                color: colors.text,
              }}
              disabled={generatingQuiz}
            >
              Back
            </button>
          )}

          {quizGenerationStep === 1 && (
            <div className="flex ml-auto">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetQuizForm();
                }}
                className="px-4 py-2 mr-3 rounded-lg text-sm"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.text,
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.cardBg,
                  opacity: !quizName ? 0.6 : 1,
                  cursor: !quizName ? "not-allowed" : "pointer",
                }}
                disabled={!quizName}
                onClick={handleNext}
              >
                Next
              </button>
            </div>
          )}

          {quizGenerationStep === 2 && (
            <div className="flex ml-auto">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetQuizForm();
                }}
                className="px-4 py-2 mr-3 rounded-lg text-sm"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.text,
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.cardBg,
                  opacity:
                    quizCreationMethod === "ai" && !quizPrompt && !quizFile
                      ? 0.6
                      : quizCreationMethod === "template" && !quizTemplate
                      ? 0.6
                      : quizCreationMethod === "manual" &&
                        manualQuestions.length === 0
                      ? 0.6
                      : 1,
                  cursor:
                    quizCreationMethod === "ai" && !quizPrompt && !quizFile
                      ? "not-allowed"
                      : quizCreationMethod === "template" && !quizTemplate
                      ? "not-allowed"
                      : quizCreationMethod === "manual" &&
                        manualQuestions.length === 0
                      ? "not-allowed"
                      : "pointer",
                }}
                disabled={
                  (quizCreationMethod === "ai" && !quizPrompt && !quizFile) ||
                  (quizCreationMethod === "template" && !quizTemplate) ||
                  (quizCreationMethod === "manual" &&
                    manualQuestions.length === 0)
                }
                onClick={() => {
                  if (
                    (quizCreationMethod === "ai" && quizPrompt) ||
                    (quizCreationMethod === "template" && quizTemplate) ||
                    (quizCreationMethod === "manual" &&
                      manualQuestions.length > 0)
                  ) {
                    setQuizGenerationStep(3);
                    if (quizCreationMethod === "ai") {
                      generateFromAI();
                    } else if (quizCreationMethod === "template") {
                      generateFromTemplate();
                    }
                  }
                }}
              >
                {quizCreationMethod === "manual"
                  ? "Review Questions"
                  : "Generate Questions"}
              </button>
            </div>
          )}

          {quizGenerationStep === 3 && !generatingQuiz && (
            <div className="flex ml-auto">
              <button
                onClick={() => setQuizGenerationStep(4)}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: colors.primary,
                  color: colors.cardBg,
                }}
              >
                Finalize Quiz
              </button>
            </div>
          )}

          {quizGenerationStep === 4 && (
            <div className="flex ml-auto">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetQuizForm();
                }}
                className="px-4 py-2 mr-3 rounded-lg text-sm"
                style={{
                  backgroundColor: "transparent",
                  border: `1px solid ${colors.borderColor}`,
                  color: colors.text,
                }}
              >
                Close
              </button>
              <button
                onClick={handleFinalizeQuiz}
                className="px-4 py-2 rounded-lg text-sm font-medium"
                style={{
                  backgroundColor: colors.accent,
                  color: "#000",
                }}
              >
                Publish Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateQuizModal;
