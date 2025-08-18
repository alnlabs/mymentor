import { useState, useCallback } from "react";
import { ExamFormData, DropdownType } from "@/shared/types/exam";
import { EXAM_CONSTANTS } from "@/shared/config/examConfig";
import {
  validateExamForm,
  validateTimerSettings,
  showValidationErrors,
} from "@/shared/utils/examValidation";
import {
  LANGUAGE_TEMPLATES,
  REASONING_TEMPLATES,
} from "@/shared/data/examTemplates";
import { showNotification } from "@/shared/utils/notifications";

const initialFormData: ExamFormData = {
  title: "",
  description: "",
  duration: 60,
  difficulty: "Medium",
  category: "Programming",
  targetRole: "",
  questionTypes: "Mixed",
  totalQuestions: 15,
  passingScore: 60,
  defaultQuestionTime: EXAM_CONSTANTS.DEFAULT_QUESTION_TIME,
  enableTimedQuestions: false,
  enableOverallTimer: true,
  isActive: true,
  isPublic: true,
};

export const useExamForm = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<ExamFormData>(initialFormData);
  const [lastUsedDropdown, setLastUsedDropdown] = useState<string>("");
  const [dropdownType, setDropdownType] = useState<DropdownType>("programming");
  const [selectedOption, setSelectedOption] = useState<string>("");

  const handleInputChange = useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
      >
    ) => {
      const { name, value, type } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
      }));
    },
    []
  );

  const handleAutoFillWithLanguage = useCallback(
    (language: string, count?: number) => {
      const template = LANGUAGE_TEMPLATES[language];
      if (template) {
        const titleSuffix = count ? ` (${count})` : "";
        setFormData({
          title: template.title + titleSuffix,
          description: template.description,
          duration: template.duration,
          difficulty: template.difficulty,
          category: template.category,
          targetRole: template.targetRole,
          questionTypes: template.questionTypes,
          totalQuestions: template.totalQuestions,
          passingScore: template.passingScore,
          defaultQuestionTime: template.defaultQuestionTime,
          enableTimedQuestions: false,
          enableOverallTimer: true,
          isActive: true,
          isPublic: true,
        });

        showNotification.success(
          `Form auto-filled with ${language} assessment template!\n\nYou can now customize the settings or create the exam as-is.`
        );
      }
    },
    []
  );

  const handleAutoFillWithReasoning = useCallback(
    (reasoningType: string, count?: number) => {
      const template = REASONING_TEMPLATES[reasoningType];
      if (template) {
        const titleSuffix = count ? ` (${count})` : "";
        setFormData({
          title: template.title + titleSuffix,
          description: template.description,
          duration: template.duration,
          difficulty: template.difficulty,
          category: template.category,
          targetRole: template.targetRole,
          questionTypes: template.questionTypes,
          totalQuestions: template.totalQuestions,
          passingScore: template.passingScore,
          defaultQuestionTime: template.defaultQuestionTime,
          enableTimedQuestions: false,
          enableOverallTimer: true,
          isActive: true,
          isPublic: true,
        });

        showNotification.success(
          `Form auto-filled with ${reasoningType} assessment template!\n\nYou can now customize the settings or create the exam as-is.`
        );
      }
    },
    []
  );

  const handleAutoFillForm = useCallback(() => {
    const randomTemplate =
      Object.values(LANGUAGE_TEMPLATES)[
        Math.floor(Math.random() * Object.keys(LANGUAGE_TEMPLATES).length)
      ];

    setFormData({
      title: randomTemplate.title,
      description: randomTemplate.description,
      duration: randomTemplate.duration,
      difficulty: randomTemplate.difficulty,
      category: randomTemplate.category,
      targetRole: randomTemplate.targetRole,
      questionTypes: randomTemplate.questionTypes,
      totalQuestions: randomTemplate.totalQuestions,
      passingScore: randomTemplate.passingScore,
      defaultQuestionTime: randomTemplate.defaultQuestionTime,
      enableTimedQuestions: false,
      enableOverallTimer: true,
      isActive: true,
      isPublic: true,
    });

    showNotification.success(
      `Form auto-filled with "${randomTemplate.title}" template!\n\nYou can now customize the settings or create the exam as-is.`
    );
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent, selectedQuestions?: any[]) => {
      e.preventDefault();

      // Validate form
      const formErrors = validateExamForm(formData);
      const timerErrors = validateTimerSettings(formData);
      const allErrors = [...formErrors, ...timerErrors];

      if (allErrors.length > 0) {
        showValidationErrors(allErrors);
        return;
      }

      setLoading(true);

      try {
        // Determine language based on title or target role
        let languages: string[] = [];
        if (formData.title.toLowerCase().includes("java")) {
          languages = ["Java"];
        } else if (
          formData.title.toLowerCase().includes("javascript") ||
          formData.title.toLowerCase().includes("js")
        ) {
          languages = ["Javascript"];
        } else if (formData.title.toLowerCase().includes("python")) {
          languages = ["Python"];
        } else if (formData.title.toLowerCase().includes("react")) {
          languages = ["Javascript"];
        } else if (formData.title.toLowerCase().includes("node")) {
          languages = ["Javascript"];
        } else if (formData.title.toLowerCase().includes("frontend")) {
          languages = ["Javascript"];
        } else if (formData.title.toLowerCase().includes("backend")) {
          languages = ["Java", "Python"];
        }

        // Prepare auto-generation options based on form data
        const autoGenerateOptions = {
          questionCount: formData.totalQuestions,
          mcqPercentage:
            formData.questionTypes === "MCQ"
              ? 100
              : formData.questionTypes === "Coding"
              ? 0
              : 70,
          codingPercentage:
            formData.questionTypes === "Coding"
              ? 100
              : formData.questionTypes === "MCQ"
              ? 0
              : 20,
          aptitudePercentage:
            formData.questionTypes === "Aptitude"
              ? 100
              : formData.questionTypes === "MCQ" ||
                formData.questionTypes === "Coding"
              ? 0
              : 10,
          difficultyDistribution: {
            easy:
              formData.difficulty === "Easy"
                ? 60
                : formData.difficulty === "Hard"
                ? 20
                : 40,
            medium:
              formData.difficulty === "Medium"
                ? 60
                : formData.difficulty === "Easy"
                ? 30
                : 40,
            hard:
              formData.difficulty === "Hard"
                ? 60
                : formData.difficulty === "Easy"
                ? 10
                : 20,
          },
          categories: [formData.category],
          subjects: formData.targetRole ? [formData.targetRole] : ["General"],
          languages: languages,
          includeNonTechnical:
            formData.questionTypes === "Aptitude" ||
            formData.questionTypes === "Mixed",
          nonTechnicalPercentage:
            formData.questionTypes === "Aptitude"
              ? 100
              : formData.questionTypes === "Mixed"
              ? 30
              : 0,
        };

        const examData = {
          ...formData,
          autoGenerate: selectedQuestions && selectedQuestions.length > 0 ? false : true,
          autoGenerateOptions,
          selectedQuestions: selectedQuestions || [],
        };

        const response = await fetch("/api/exams", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(examData),
        });

        const result = await response.json();

        if (result.success) {
          showNotification.success(
            `Exam created successfully with ${formData.totalQuestions} auto-generated questions!`
          );
          window.location.href = "/admin/exams";
        } else {
          showNotification.error(result.error || "Failed to create exam");
        }
      } catch (error) {
        console.error("Error creating exam:", error);
        showNotification.error("Failed to create exam");
      } finally {
        setLoading(false);
      }
    },
    [formData]
  );

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setSelectedOption("");
    setLastUsedDropdown("");
  }, []);

  const saveAsDraft = useCallback(() => {
    setFormData((prev) => ({ ...prev, isActive: false }));
    showNotification.success("Exam saved as draft (inactive)");
  }, []);

  return {
    formData,
    loading,
    dropdownType,
    selectedOption,
    lastUsedDropdown,
    handleInputChange,
    handleAutoFillWithLanguage,
    handleAutoFillWithReasoning,
    handleAutoFillForm,
    handleSubmit,
    resetForm,
    saveAsDraft,
    setDropdownType,
    setSelectedOption,
    setLastUsedDropdown,
  };
};
