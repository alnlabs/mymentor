-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_exams" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "difficulty" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "targetRole" TEXT,
    "questionTypes" TEXT NOT NULL,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "passingScore" INTEGER NOT NULL DEFAULT 60,
    "enableTimedQuestions" BOOLEAN NOT NULL DEFAULT false,
    "enableOverallTimer" BOOLEAN NOT NULL DEFAULT true,
    "defaultQuestionTime" INTEGER NOT NULL DEFAULT 120,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_exams" ("category", "createdAt", "description", "difficulty", "duration", "id", "isActive", "isPublic", "passingScore", "questionTypes", "targetRole", "title", "totalQuestions", "updatedAt") SELECT "category", "createdAt", "description", "difficulty", "duration", "id", "isActive", "isPublic", "passingScore", "questionTypes", "targetRole", "title", "totalQuestions", "updatedAt" FROM "exams";
DROP TABLE "exams";
ALTER TABLE "new_exams" RENAME TO "exams";
CREATE UNIQUE INDEX "exams_title_key" ON "exams"("title");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
