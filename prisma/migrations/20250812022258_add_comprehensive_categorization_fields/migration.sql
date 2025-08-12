-- AlterTable
ALTER TABLE "mcq_questions" ADD COLUMN "companyType" TEXT;
ALTER TABLE "mcq_questions" ADD COLUMN "domain" TEXT;
ALTER TABLE "mcq_questions" ADD COLUMN "interviewType" TEXT;
ALTER TABLE "mcq_questions" ADD COLUMN "jobRole" TEXT;
ALTER TABLE "mcq_questions" ADD COLUMN "priority" TEXT;
ALTER TABLE "mcq_questions" ADD COLUMN "skillLevel" TEXT;
ALTER TABLE "mcq_questions" ADD COLUMN "status" TEXT;
ALTER TABLE "mcq_questions" ADD COLUMN "subject" TEXT;
ALTER TABLE "mcq_questions" ADD COLUMN "technologyStack" TEXT;
ALTER TABLE "mcq_questions" ADD COLUMN "tool" TEXT;
ALTER TABLE "mcq_questions" ADD COLUMN "topic" TEXT;

-- AlterTable
ALTER TABLE "problems" ADD COLUMN "companyType" TEXT;
ALTER TABLE "problems" ADD COLUMN "domain" TEXT;
ALTER TABLE "problems" ADD COLUMN "interviewType" TEXT;
ALTER TABLE "problems" ADD COLUMN "jobRole" TEXT;
ALTER TABLE "problems" ADD COLUMN "priority" TEXT;
ALTER TABLE "problems" ADD COLUMN "skillLevel" TEXT;
ALTER TABLE "problems" ADD COLUMN "status" TEXT;
ALTER TABLE "problems" ADD COLUMN "subject" TEXT;
ALTER TABLE "problems" ADD COLUMN "technologyStack" TEXT;
ALTER TABLE "problems" ADD COLUMN "tool" TEXT;
ALTER TABLE "problems" ADD COLUMN "topic" TEXT;
