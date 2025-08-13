const fs = require("fs");
const path = require("path");

// Function to recursively find all JSON files
function findJsonFiles(dir) {
  const files = [];
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
}

// Function to add difficulty to questions
function addDifficultyToQuestions(filePath) {
  try {
    const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const fileName = path.basename(filePath);

    // Skip metadata files
    if (fileName.includes("metadata") || !content.concepts) {
      console.log(`Skipping metadata file: ${fileName}`);
      return;
    }

    console.log(`Processing: ${fileName}`);

    let modified = false;

    // Process each concept
    content.concepts.forEach((concept) => {
      const conceptDifficulty = concept.difficulty || "intermediate";

      // Add difficulty to questions
      if (concept.questions && Array.isArray(concept.questions)) {
        concept.questions.forEach((question) => {
          if (!question.difficulty) {
            question.difficulty = conceptDifficulty;
            modified = true;
          }
        });
      }

      // Add difficulty to problems
      if (concept.problems && Array.isArray(concept.problems)) {
        concept.problems.forEach((problem) => {
          if (!problem.difficulty) {
            problem.difficulty = conceptDifficulty;
            modified = true;
          }
        });
      }
    });

    // Write back to file if modified
    if (modified) {
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
      console.log(`✅ Updated: ${fileName}`);
    } else {
      console.log(`⏭️  No changes needed: ${fileName}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

// Main execution
const seedsDir = path.join(process.cwd(), "data", "seeds");
const seedFiles = findJsonFiles(seedsDir);

console.log(`Found ${seedFiles.length} seed files to process...\n`);

seedFiles.forEach((filePath) => {
  addDifficultyToQuestions(filePath);
});

console.log("\n🎉 Difficulty addition completed!");
