/*
  Warnings:

  - A unique constraint covering the columns `[question,tool]` on the table `mcq_questions` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,tool]` on the table `problems` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."mcq_questions_question_key";

-- DropIndex
DROP INDEX "public"."problems_title_key";

-- CreateIndex
CREATE UNIQUE INDEX "mcq_questions_question_tool_key" ON "public"."mcq_questions"("question", "tool");

-- CreateIndex
CREATE UNIQUE INDEX "problems_title_tool_key" ON "public"."problems"("title", "tool");
