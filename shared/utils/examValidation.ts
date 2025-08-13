import { ExamFormData } from "@/shared/types/exam";
import { EXAM_CONSTANTS } from "@/shared/config/examConfig";
import { STATIC_CONFIG } from "@/shared/config/dynamicConfig";
import { showNotification } from "./notifications";

export const validateExamForm = (data: ExamFormData): string[] => {
  const errors: string[] = [];

  // Title validation
  if (!data.title.trim()) {
    errors.push("Title is required");
  } else if (data.title.length < 5) {
    errors.push("Title must be at least 5 characters long");
  } else if (data.title.length > 100) {
    errors.push("Title must be less than 100 characters");
  }

  // Description validation
  if (!data.description.trim()) {
    errors.push("Description is required");
  } else if (data.description.length < 10) {
    errors.push("Description must be at least 10 characters long");
  } else if (data.description.length > 500) {
    errors.push("Description must be less than 500 characters");
  }

  // Duration validation
  if (
    data.duration < EXAM_CONSTANTS.MIN_DURATION ||
    data.duration > EXAM_CONSTANTS.MAX_DURATION
  ) {
    errors.push(
      `Duration must be between ${EXAM_CONSTANTS.MIN_DURATION}-${EXAM_CONSTANTS.MAX_DURATION} minutes`
    );
  }

  // Total questions validation
  if (
    data.totalQuestions < EXAM_CONSTANTS.MIN_QUESTIONS ||
    data.totalQuestions > EXAM_CONSTANTS.MAX_QUESTIONS
  ) {
    errors.push(
      `Total questions must be between ${EXAM_CONSTANTS.MIN_QUESTIONS}-${EXAM_CONSTANTS.MAX_QUESTIONS}`
    );
  }

  // Passing score validation
  if (data.passingScore < 0 || data.passingScore > 100) {
    errors.push("Passing score must be between 0-100%");
  }

  // Default question time validation
  if (data.defaultQuestionTime < STATIC_CONFIG.question.minTime || data.defaultQuestionTime > STATIC_CONFIG.question.maxTime) {
    errors.push(`Default question time must be between ${STATIC_CONFIG.question.minTime}-${STATIC_CONFIG.question.maxTime} seconds`);
  }

  // Category validation
  if (!data.category) {
    errors.push("Category is required");
  }

  // Difficulty validation
  if (!data.difficulty) {
    errors.push("Difficulty is required");
  }

  // Question types validation
  if (!data.questionTypes) {
    errors.push("Question types is required");
  }

  return errors;
};

export const validateTimerSettings = (data: ExamFormData): string[] => {
  const errors: string[] = [];

  if (!data.enableOverallTimer && !data.enableTimedQuestions) {
    errors.push("At least one timer type must be enabled");
  }

  if (data.enableOverallTimer && data.duration < 15) {
    errors.push("Overall timer requires minimum 15 minutes duration");
  }

  if (data.enableTimedQuestions && data.defaultQuestionTime < 30) {
    errors.push("Question timer requires minimum 30 seconds per question");
  }

  return errors;
};

export const showValidationErrors = (errors: string[]): void => {
  if (errors.length > 0) {
    const errorMessage = errors.join("\n");
    showNotification.error(
      `Please fix the following errors:\n\n${errorMessage}`
    );
  }
};
