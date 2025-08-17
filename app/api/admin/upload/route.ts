import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/database";
import { ApiResponse } from "@/shared/types/common";

// Generate unique ID based on title/question
function generateId(text: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .substring(0, 50) + // Limit length
    "-" +
    Date.now().toString().slice(-6)
  ); // Add timestamp
}

// Check for duplicate content (considering language)
async function checkDuplicateContent(
  type: string,
  content: string,
  language?: string
): Promise<boolean> {
  if (type === "problems") {
    const existing = await prisma.problem.findFirst({
      where: {
        title: {
          equals: content,
        },
        tool: language || undefined, // Only consider duplicate if same language
      },
    });
    return !!existing;
  } else if (type === "mcq") {
    const existing = await prisma.mCQQuestion.findFirst({
      where: {
        question: {
          equals: content,
        },
        tool: language || undefined, // Only consider duplicate if same language
      },
    });
    return !!existing;
  }
  return false;
}

// Parse CSV content
function parseCSV(csvContent: string, type: "problems" | "mcq"): any[] {
  const lines = csvContent.trim().split("\n");

  // Find the header line (first non-comment line)
  let headerLineIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim().startsWith("#")) {
      headerLineIndex = i;
      break;
    }
  }

  const headers = lines[headerLineIndex]
    .split(",")
    .map((h) => h.trim().replace(/"/g, ""));
  const data: any[] = [];

  for (let i = headerLineIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    // Handle quoted values with commas
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim().replace(/^"|"$/g, ""));
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^"|"$/g, ""));

    const row: any = {};
    headers.forEach((header, index) => {
      if (values[index] !== undefined) {
        row[header] = values[index];
      }
    });

    // Transform data based on type
    if (type === "problems") {
      data.push({
        title: row.title || "",
        description: row.description || "",
        difficulty: row.difficulty || "easy",
        category: row.category || "",
        subject: row.subject || "",
        topic: row.topic || "",
        tool: row.tool || "",
        technologyStack: row.technologyStack || "",
        domain: row.domain || "",
        skillLevel: row.skillLevel || "beginner",
        jobRole: row.jobRole || "",
        companyType: row.companyType || "",
        interviewType: row.interviewType || "",
        testCases: row.testCases || "",
        solution: row.solution || "",
        hints: row.hints || "",
        tags: row.tags || "",
        companies: row.companies || "",
        priority: row.priority || "medium",
        status: row.status || "draft",
      });
    } else if (type === "mcq") {
      // Parse options from semicolon-separated string
      const options = row.options
        ? row.options.split(";").map((opt: string) => opt.trim())
        : ["", "", "", ""];
      data.push({
        question: row.question || "",
        options: options,
        correctAnswer: parseInt(row.correctAnswer) || 0,
        explanation: row.explanation || "",
        category: row.category || "",
        subject: row.subject || "",
        topic: row.topic || "",
        tool: row.tool || "",
        technologyStack: row.technologyStack || "",
        domain: row.domain || "",
        skillLevel: row.skillLevel || "beginner",
        jobRole: row.jobRole || "",
        companyType: row.companyType || "",
        interviewType: row.interviewType || "",
        difficulty: row.difficulty || "easy",
        tags: row.tags || "",
        companies: row.companies || "",
        priority: row.priority || "medium",
        status: row.status || "draft",
      });
    }
  }

  return data;
}

// Parse Excel content (basic implementation - can be enhanced with proper Excel library)
function parseExcel(excelContent: string, type: "problems" | "mcq"): any[] {
  // For now, treat Excel as CSV with tab separation
  // In a real implementation, you'd use a library like 'xlsx' or 'exceljs'
  const lines = excelContent.trim().split("\n");

  // Find the header line (first non-comment line)
  let headerLineIndex = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i].trim().startsWith("#")) {
      headerLineIndex = i;
      break;
    }
  }

  const headers = lines[headerLineIndex]
    .split("\t")
    .map((h) => h.trim().replace(/"/g, ""));
  const data: any[] = [];

  for (let i = headerLineIndex + 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim()) continue;

    const values = line.split("\t").map((v) => v.trim().replace(/"/g, ""));
    const row: any = {};
    headers.forEach((header, index) => {
      if (values[index] !== undefined) {
        row[header] = values[index];
      }
    });

    // Transform data based on type
    if (type === "problems") {
      data.push({
        title: row.title || "",
        description: row.description || "",
        difficulty: row.difficulty || "easy",
        category: row.category || "",
        subject: row.subject || "",
        topic: row.topic || "",
        tool: row.tool || "",
        technologyStack: row.technologyStack || "",
        domain: row.domain || "",
        skillLevel: row.skillLevel || "beginner",
        jobRole: row.jobRole || "",
        companyType: row.companyType || "",
        interviewType: row.interviewType || "",
        testCases: row.testCases || "",
        solution: row.solution || "",
        hints: row.hints || "",
        tags: row.tags || "",
        companies: row.companies || "",
        priority: row.priority || "medium",
        status: row.status || "draft",
      });
    } else if (type === "mcq") {
      const options = row.options
        ? row.options.split(";").map((opt: string) => opt.trim())
        : ["", "", "", ""];
      data.push({
        question: row.question || "",
        options: options,
        correctAnswer: parseInt(row.correctAnswer) || 0,
        explanation: row.explanation || "",
        category: row.category || "",
        subject: row.subject || "",
        topic: row.topic || "",
        tool: row.tool || "",
        technologyStack: row.technologyStack || "",
        domain: row.domain || "",
        skillLevel: row.skillLevel || "beginner",
        jobRole: row.jobRole || "",
        companyType: row.companyType || "",
        interviewType: row.interviewType || "",
        difficulty: row.difficulty || "easy",
        tags: row.tags || "",
        companies: row.companies || "",
        priority: row.priority || "medium",
        status: row.status || "draft",
      });
    }
  }

  return data;
}

// Validate data structure
function validateData(
  data: any[],
  type: "problems" | "mcq"
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!Array.isArray(data)) {
    errors.push("Data must be an array");
    return { valid: false, errors };
  }

  data.forEach((item, index) => {
    if (type === "problems") {
      if (!item.title || item.title.trim() === "") {
        errors.push(`Row ${index + 1}: Title is required`);
      }
      if (!item.description || item.description.trim() === "") {
        errors.push(`Row ${index + 1}: Description is required`);
      }
      if (!item.category || item.category.trim() === "") {
        errors.push(`Row ${index + 1}: Category is required`);
      }
      if (!["easy", "medium", "hard"].includes(item.difficulty)) {
        errors.push(
          `Row ${index + 1}: Difficulty must be easy, medium, or hard`
        );
      }
    } else if (type === "mcq") {
      if (!item.question || item.question.trim() === "") {
        errors.push(`Row ${index + 1}: Question is required`);
      }
      if (!Array.isArray(item.options) || item.options.length < 2) {
        errors.push(`Row ${index + 1}: At least 2 options are required`);
      }
      if (
        typeof item.correctAnswer !== "number" ||
        item.correctAnswer < 0 ||
        item.correctAnswer >= item.options.length
      ) {
        errors.push(
          `Row ${index + 1}: Correct answer must be a valid option index`
        );
      }
      if (!item.category || item.category.trim() === "") {
        errors.push(`Row ${index + 1}: Category is required`);
      }
      if (!["easy", "medium", "hard"].includes(item.difficulty)) {
        errors.push(
          `Row ${index + 1}: Difficulty must be easy, medium, or hard`
        );
      }
    }
  });

  return { valid: errors.length === 0, errors };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data, fileContent, fileType } = body;

    if (!type || (type !== "problems" && type !== "mcq")) {
      const response: ApiResponse = {
        success: false,
        error: 'Invalid type. Use "problems" or "mcq"',
      };
      return NextResponse.json(response, { status: 400 });
    }

    let processedData: any[] = [];
    let validationErrors: string[] = [];

    // Handle different upload types
    if (fileContent && fileType) {
      // File upload processing
      try {
        switch (fileType.toLowerCase()) {
          case "csv":
            processedData = parseCSV(fileContent, type);
            break;
          case "excel":
          case "xlsx":
          case "xls":
            processedData = parseExcel(fileContent, type);
            break;
          case "json":
            processedData = JSON.parse(fileContent);
            break;
          default:
            const response: ApiResponse = {
              success: false,
              error: "Unsupported file type. Use CSV, Excel, or JSON",
            };
            return NextResponse.json(response, { status: 400 });
        }

        // Validate processed data
        const validation = validateData(processedData, type);
        if (!validation.valid) {
          const response: ApiResponse = {
            success: false,
            error: "Data validation failed",
            data: { errors: validation.errors },
          };
          return NextResponse.json(response, { status: 400 });
        }
      } catch (error: any) {
        const response: ApiResponse = {
          success: false,
          error: `File processing failed: ${error.message}`,
        };
        return NextResponse.json(response, { status: 400 });
      }
    } else if (data && Array.isArray(data)) {
      // Direct JSON data
      processedData = data;

      // Validate data
      const validation = validateData(processedData, type);
      if (!validation.valid) {
        const response: ApiResponse = {
          success: false,
          error: "Data validation failed",
          data: { errors: validation.errors },
        };
        return NextResponse.json(response, { status: 400 });
      }
    } else {
      const response: ApiResponse = {
        success: false,
        error:
          "Invalid data format. Provide either data array or fileContent with fileType",
      };
      return NextResponse.json(response, { status: 400 });
    }

    let imported = 0;
    let skipped = 0;
    let errors: string[] = [];
    let duplicates: string[] = [];

    if (type === "problems") {
      for (const problem of processedData) {
        try {
          // Check for duplicate title (same language only)
          const isDuplicate = await checkDuplicateContent(
            "problems",
            problem.title,
            problem.tool
          );

          if (isDuplicate) {
            duplicates.push(`Problem "${problem.title}" already exists`);
            skipped++;
            continue;
          }

          // Generate unique ID if not provided
          const problemId = problem.id || generateId(problem.title);

          await prisma.problem.create({
            data: {
              id: problemId,
              title: problem.title,
              description: problem.description,
              difficulty: problem.difficulty,
              category: problem.category,
              testCases: problem.testCases,
              solution: problem.solution,
              hints: problem.hints,
              tags: problem.tags,
              companies: problem.companies,
              isActive: true,
            },
          });
          imported++;
        } catch (error: any) {
          errors.push(
            `Failed to import problem "${problem.title}": ${error.message}`
          );
        }
      }
    } else if (type === "mcq") {
      console.log(
        `Processing ${processedData.length} MCQ questions for import`
      );

      for (const question of processedData) {
        try {
          console.log(
            `Processing question: ${question.question.substring(0, 50)}...`
          );

          // Check for duplicate question (same language only)
          const isDuplicate = await checkDuplicateContent(
            "mcq",
            question.question,
            question.tool
          );

          if (isDuplicate) {
            console.log(
              `Skipping duplicate: ${question.question.substring(0, 50)}...`
            );
            duplicates.push(
              `MCQ "${question.question.substring(0, 50)}..." already exists`
            );
            skipped++;
            continue;
          }

          // Generate unique ID if not provided
          const questionId = question.id || generateId(question.question);

          await prisma.mCQQuestion.create({
            data: {
              id: questionId,
              question: question.question,
              options: JSON.stringify(question.options),
              correctAnswer: question.correctAnswer,
              explanation: question.explanation,
              category: question.category,
              difficulty: question.difficulty,
              tags: question.tags,
              companies: question.companies,
              isActive: true,
            },
          });
          imported++;
          console.log(
            `Successfully imported question ${imported}: ${question.question.substring(
              0,
              50
            )}...`
          );
        } catch (error: any) {
          console.error(`Error importing question: ${error.message}`);
          errors.push(
            `Failed to import MCQ "${question.question}": ${error.message}`
          );
        }
      }
    }

    const response: ApiResponse = {
      success: true,
      data: {
        imported,
        skipped,
        errors,
        duplicates,
        type,
        totalProcessed: processedData.length,
      },
      message: `Import completed: ${imported} imported, ${skipped} skipped (duplicates), ${errors.length} errors`,
    };

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Upload error:", error);
    const response: ApiResponse = {
      success: false,
      error: "Failed to upload data",
    };
    return NextResponse.json(response, { status: 500 });
  }
}
