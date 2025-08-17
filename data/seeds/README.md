# Seed Data Directory

This directory contains seed data for the MyMentor application.

## Structure

- `java/` - Java programming questions and problems
- `javascript/` - JavaScript programming questions and problems
- `python/` - Python programming questions and problems
- `metadata/` - Metadata files for organizing seed data

## Adding New Seed Data

1. Create JSON files in the appropriate language directory
2. Follow the established schema for questions/problems
3. Update metadata files as needed
4. Use the admin interface to import new data

## File Formats

- MCQ questions: `{question, options, correctAnswer, explanation, category, difficulty}`
- Problems: `{title, description, difficulty, category, testCases, solution, hints}`
- Metadata: `{name, description, concepts, categories}`
