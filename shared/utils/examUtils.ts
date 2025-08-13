import { Exam } from "@prisma/client";

/**
 * Generates a unique title for exam duplication
 * @param originalTitle - The original exam title
 * @param existingTitles - Array of existing exam titles to check against
 * @returns A unique title
 */
export function generateUniqueExamTitle(
  originalTitle: string,
  existingTitles: string[]
): string {
  // Find how many copies already exist
  const copyPattern = new RegExp(
    `^${originalTitle.replace(
      /[.*+?^${}()|[\]\\]/g,
      "\\$&"
    )} \\(Copy(?: (\\d+))?\\)$`
  );
  let maxCopyNumber = 0;

  existingTitles.forEach((title) => {
    const match = title.match(copyPattern);
    if (match) {
      const copyNumber = match[1] ? parseInt(match[1]) : 1;
      maxCopyNumber = Math.max(maxCopyNumber, copyNumber);
    }
  });

  // Generate next copy number
  const nextCopyNumber = maxCopyNumber + 1;
  return `${originalTitle} (Copy ${nextCopyNumber})`;
}

/**
 * Prepares exam data for duplication with unique fields
 * @param originalExam - The original exam to duplicate
 * @param existingTitles - Array of existing exam titles
 * @returns Modified exam data ready for creation
 */
export function prepareExamForDuplication(
  originalExam: Exam,
  existingTitles: string[]
): Partial<Exam> {
  const uniqueTitle = generateUniqueExamTitle(
    originalExam.title,
    existingTitles
  );

  return {
    title: uniqueTitle,
    description: originalExam.description,
    duration: originalExam.duration,
    difficulty: originalExam.difficulty,
    category: originalExam.category,
    targetRole: originalExam.targetRole,
    questionTypes: originalExam.questionTypes,
    totalQuestions: 0, // Reset to 0 as questions will be added separately
    passingScore: originalExam.passingScore,
    enableTimedQuestions: originalExam.enableTimedQuestions,
    enableOverallTimer: originalExam.enableOverallTimer,
    defaultQuestionTime: originalExam.defaultQuestionTime,
    isActive: false, // Set to inactive by default for safety
    isPublic: false, // Set to private by default for safety
  };
}

/**
 * Validates exam data for uniqueness
 * @param examData - The exam data to validate
 * @param existingTitles - Array of existing exam titles
 * @returns Validation result with errors if any
 */
export function validateExamUniqueness(
  examData: Partial<Exam>,
  existingTitles: string[]
): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Check title uniqueness
  if (examData.title) {
    if (existingTitles.includes(examData.title)) {
      errors.push(`Title "${examData.title}" already exists.`);
    }
  } else {
    errors.push("Title is required.");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
