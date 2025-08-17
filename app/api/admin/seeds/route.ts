import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

// GET - List all available seeds
export async function GET(request: NextRequest) {
  try {
    const seedsDir = path.join(process.cwd(), "data", "seeds");

    // Recursively find all JSON files in the seeds directory and subdirectories
    const findJsonFiles = (dir: string): string[] => {
      const files: string[] = [];
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          files.push(...findJsonFiles(fullPath));
        } else if (item.isFile() && item.name.endsWith(".json")) {
          files.push(fullPath);
        }
      }

      return files;
    };

    const seedFiles = findJsonFiles(seedsDir);

    console.log("Found seed files:", seedFiles);

    // Group seeds by language
    const languageGroups: { [key: string]: any[] } = {};

    for (const filePath of seedFiles) {
      try {
        const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
        const fileName = path.basename(filePath);

        // Skip metadata files
        if (fileName.includes("metadata") || !content.concepts) {
          console.log(`Skipping file: ${fileName} (metadata or no concepts)`);
          continue;
        }

        console.log(
          `Processing file: ${fileName} with ${
            content.concepts?.length || 0
          } concepts`
        );

        // Check which questions/problems are already in DB
        const existingQuestions = await prisma.mCQQuestion.findMany({
          where: { category: content.category },
          select: { question: true },
        });

        const existingProblems = await prisma.problem.findMany({
          where: { category: content.category },
          select: { title: true },
        });

        const seedData = {
          file: fileName,
          category: content.category,
          language: content.language,
          concepts: content.concepts.map((concept: any) => {
            // Ensure questions and problems are arrays
            const conceptQuestions = Array.isArray(concept.questions)
              ? concept.questions
              : [];
            const conceptProblems = Array.isArray(concept.problems)
              ? concept.problems
              : [];

            // Check if ALL questions from this concept exist in DB
            const allQuestionsInDB =
              conceptQuestions.length > 0
                ? conceptQuestions.every((q: any) =>
                    existingQuestions.some((eq) => eq.question === q.question)
                  )
                : true;

            // Check if ALL problems from this concept exist in DB
            const allProblemsInDB =
              conceptProblems.length > 0
                ? conceptProblems.every((p: any) =>
                    existingProblems.some((ep) => ep.title === p.title)
                  )
                : true;

            return {
              name: concept.name || "Unknown Concept",
              difficulty: concept.difficulty || "intermediate",
              questionCount: conceptQuestions.length + conceptProblems.length,
              type: conceptQuestions.length > 0 ? "mcq" : "problem",
              inDatabase: allQuestionsInDB && allProblemsInDB,
              questionsInDB: conceptQuestions.filter((q: any) =>
                existingQuestions.some((eq) => eq.question === q.question)
              ).length,
              problemsInDB: conceptProblems.filter((p: any) =>
                existingProblems.some((ep) => ep.title === p.title)
              ).length,
              questions: conceptQuestions,
              problems: conceptProblems,
            };
          }),
          totalQuestions: content.concepts.reduce(
            (sum: number, concept: any) =>
              sum +
              (concept.questions?.length || concept.problems?.length || 0),
            0
          ),
          inDatabaseCount: content.concepts.reduce(
            (sum: number, concept: any) => {
              const conceptQuestions = Array.isArray(concept.questions)
                ? concept.questions
                : [];
              const conceptProblems = Array.isArray(concept.problems)
                ? concept.problems
                : [];

              const questionsInDB = conceptQuestions.filter((q: any) =>
                existingQuestions.some((eq) => eq.question === q.question)
              ).length;
              const problemsInDB = conceptProblems.filter((p: any) =>
                existingProblems.some((ep) => ep.title === p.title)
              ).length;

              return sum + questionsInDB + problemsInDB;
            },
            0
          ),
        };

        // Group by language
        if (!languageGroups[content.language]) {
          languageGroups[content.language] = [];
        }
        languageGroups[content.language].push(seedData);
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
        continue;
      }
    }

    // Combine seeds by language
    const seeds = Object.keys(languageGroups).map((language) => {
      const languageSeeds = languageGroups[language];

      // Combine all concepts from all files for this language, deduplicating by name
      const allConcepts = languageSeeds.flatMap((seed) => seed.concepts);
      const uniqueConcepts = allConcepts.filter(
        (concept, index, self) =>
          index === self.findIndex((c) => c.name === concept.name)
      );

      // Calculate totals
      const totalQuestions = languageSeeds.reduce(
        (sum, seed) => sum + seed.totalQuestions,
        0
      );
      const totalInDB = languageSeeds.reduce(
        (sum, seed) => sum + seed.inDatabaseCount,
        0
      );

      // Get unique files
      const files = languageSeeds.map((seed) => seed.file).join(", ");

      return {
        file: files,
        category: languageSeeds.map((seed) => seed.category).join(", "),
        language: language,
        concepts: uniqueConcepts,
        totalQuestions: totalQuestions,
        inDatabaseCount: totalInDB,
      };
    });

    return NextResponse.json({
      success: true,
      data: seeds,
    });
  } catch (error: any) {
    console.error("Error fetching seeds:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch seeds" },
      { status: 500 }
    );
  }
}

// POST - Add seeds to database
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { concepts } = body;

    if (!concepts || !Array.isArray(concepts)) {
      return NextResponse.json(
        { success: false, error: "Concepts array is required" },
        { status: 400 }
      );
    }

    // Find the seed file that contains these concepts
    const seedsDir = path.join(process.cwd(), "data", "seeds");

    // Recursively find all JSON files
    const findJsonFiles = (dir: string): string[] => {
      const files: string[] = [];
      const items = fs.readdirSync(dir, { withFileTypes: true });

      for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
          files.push(...findJsonFiles(fullPath));
        } else if (item.isFile() && item.name.endsWith(".json")) {
          files.push(fullPath);
        }
      }

      return files;
    };

    const seedFiles = findJsonFiles(seedsDir);

    console.log(seedFiles, "seedFiles");

    // Process concepts from multiple files
    const conceptMap = new Map(); // Map to store concepts by name
    const processedFiles = [];

    for (const filePath of seedFiles) {
      try {
        const currentContent = JSON.parse(fs.readFileSync(filePath, "utf8"));

        // Skip metadata files
        if (
          path.basename(filePath).includes("metadata") ||
          !currentContent.concepts
        ) {
          continue;
        }

        // Check if this file contains any of the requested concepts
        const conceptNames = currentContent.concepts.map((c: any) => c.name);
        const matchingConcepts = concepts.filter((concept) =>
          conceptNames.includes(concept)
        );

        if (matchingConcepts.length > 0) {
          // Store concepts from this file
          for (const concept of currentContent.concepts) {
            if (concepts.includes(concept.name)) {
              // Only overwrite if the new concept has more questions or if it's the first one
              const existingConcept = conceptMap.get(concept.name);
              const existingQuestionCount =
                existingConcept?.questions?.length || 0;
              const newQuestionCount = concept.questions?.length || 0;

              if (
                !existingConcept ||
                newQuestionCount > existingQuestionCount
              ) {
                conceptMap.set(concept.name, {
                  ...concept,
                  sourceFile: path.basename(filePath),
                  category: currentContent.category,
                  language: currentContent.language,
                });
              }
            }
          }
          processedFiles.push(path.basename(filePath));
        }
      } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
        continue;
      }
    }

    // Check if we found all requested concepts
    const foundConcepts = Array.from(conceptMap.keys());
    const missingConcepts = concepts.filter(
      (concept) => !foundConcepts.includes(concept)
    );

    if (missingConcepts.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Could not find concepts: ${missingConcepts.join(", ")}`,
        },
        { status: 404 }
      );
    }

    const addedQuestions = [];
    const addedProblems = [];

    for (const conceptName of concepts) {
      const concept = conceptMap.get(conceptName);
      if (!concept) {
        continue;
      }

      if (concept.questions && Array.isArray(concept.questions)) {
        // Add MCQ questions
        for (const question of concept.questions) {
          try {
            // Handle different MCQ data formats
            let options, correctAnswerIndex;

            if (Array.isArray(question.options)) {
              // Java format: options is array, correctAnswer is string
              options = question.options;
              const correctAnswer = question.correctAnswer;
              correctAnswerIndex = options.findIndex(
                (option: string) => option === correctAnswer
              );
              if (correctAnswerIndex === -1) {
                correctAnswerIndex = 0;
              }
            } else if (typeof question.options === "string") {
              // JavaScript/Python format: options is JSON string, correctAnswer is index
              try {
                options = JSON.parse(question.options);
                correctAnswerIndex = question.correctAnswer || 0;
              } catch (e) {
                console.error(
                  `Error parsing options for question: ${question.question}`
                );
                options = [];
                correctAnswerIndex = 0;
              }
            } else {
              options = [];
              correctAnswerIndex = 0;
            }

            const added = await prisma.mCQQuestion.create({
              data: {
                question: question.question,
                options: JSON.stringify(options),
                correctAnswer: correctAnswerIndex,
                explanation: question.explanation,
                category: concept.category,
                difficulty: concept.difficulty,
                tags: JSON.stringify(question.tags || []),
                companies: JSON.stringify(question.companies || []),
              },
            });
            addedQuestions.push(added);
          } catch (error: any) {
            if (error.code === "P2002") {
              console.log(
                `Question ${question.question} already exists, skipping...`
              );
            } else {
              console.error(`Error adding question: ${error.message}`, error);
              throw error;
            }
          }
        }
      }

      if (concept.problems && Array.isArray(concept.problems)) {
        // Add coding problems
        for (const problem of concept.problems) {
          try {
            const added = await prisma.problem.create({
              data: {
                title: problem.title,
                description: problem.description,
                difficulty: concept.difficulty,
                category: concept.category,
                testCases: JSON.stringify(problem.testCases || []),
                solution: problem.solution,
                hints: JSON.stringify(problem.hints || []),
                tags: JSON.stringify(problem.tags || []),
                companies: JSON.stringify(problem.companies || []),
              },
            });
            addedProblems.push(added);
          } catch (error: any) {
            if (error.code === "P2002") {
              console.log(`Problem ${problem.id} already exists, skipping...`);
            } else {
              throw error;
            }
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        addedQuestions: addedQuestions.length,
        addedProblems: addedProblems.length,
        processedFiles: processedFiles,
        message: `Added ${addedQuestions.length} questions and ${addedProblems.length} problems to database from ${processedFiles.length} file(s)`,
      },
    });
  } catch (error: any) {
    console.error("Error adding seeds:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add seeds" },
      { status: 500 }
    );
  }
}

// DELETE - Remove seeds from database
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const type = searchParams.get("type"); // 'mcq' or 'problem'

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Category is required" },
        { status: 400 }
      );
    }

    let deletedCount = 0;

    if (type === "mcq" || !type) {
      const deletedQuestions = await prisma.mCQQuestion.deleteMany({
        where: { category },
      });
      deletedCount += deletedQuestions.count;
    }

    if (type === "problem" || !type) {
      const deletedProblems = await prisma.problem.deleteMany({
        where: { category },
      });
      deletedCount += deletedProblems.count;
    }

    return NextResponse.json({
      success: true,
      data: {
        deletedCount,
        message: `Deleted ${deletedCount} items from database`,
      },
    });
  } catch (error: any) {
    console.error("Error removing seeds:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove seeds" },
      { status: 500 }
    );
  }
}
