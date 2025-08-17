# 🌱 Seeds API Guide

## Overview

The `/api/admin/seeds` endpoint allows you to manage seed data for the interview platform. It can list available seeds and add new content to the database.

## Endpoints

### GET `/api/admin/seeds`

Lists all available seed files and their concepts.

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "language": "JavaScript",
      "concepts": [
        {
          "name": "Advanced ES6+ Features",
          "difficulty": "hard",
          "questionCount": 3,
          "type": "mcq",
          "inDatabase": false
        }
      ]
    }
  ]
}
```

### POST `/api/admin/seeds`

Adds specific concepts to the database.

**Request:**

```json
{
  "concepts": ["Advanced ES6+ Features", "Functional Programming"]
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "addedQuestions": 7,
    "addedProblems": 0,
    "processedFiles": ["javascript-advanced.json"],
    "message": "Added 7 questions and 0 problems to database from 1 file(s)"
  }
}
```

## Why You Might See 0 Added Items

### ✅ **Normal Behavior**

The API returns `addedQuestions: 0` and `addedProblems: 0` when:

1. **Items Already Exist**: The questions/problems are already in the database
2. **Duplicate Prevention**: The API uses `create()` which fails on duplicates
3. **Data Integrity**: This prevents accidental duplicates

### 🔍 **How to Check What's Available**

1. **List all concepts:**

   ```bash
   curl http://localhost:4700/api/admin/seeds | jq '.data[].concepts[].name'
   ```

2. **Check specific language:**

   ```bash
   curl http://localhost:4700/api/admin/seeds | jq '.data[] | select(.language == "JavaScript") | .concepts[].name'
   ```

3. **See what's in database:**
   ```bash
   curl http://localhost:4700/api/problems | jq '.data | length'
   curl http://localhost:4700/api/mcq | jq '.data | length'
   ```

### 🆕 **Adding New Content**

To add new content, create new seed files or use concepts that don't exist yet:

1. **Create new seed file** (like `javascript-advanced.json`)
2. **Add new concepts** to existing files
3. **Use the API** to add the new concepts

### 📊 **Current Data Status**

- **Problems**: 13 coding problems
- **MCQ Questions**: 122 questions
- **Languages**: Java, JavaScript, Python
- **Categories**: Arrays, Strings, Algorithms, Data Structures, etc.

### 🛠️ **Example: Adding New Content**

```bash
# Add new advanced JavaScript concepts
curl -X POST http://localhost:4700/api/admin/seeds \
  -H "Content-Type: application/json" \
  -d '{"concepts": ["Advanced ES6+ Features", "Functional Programming"]}'

# Add new advanced problems
curl -X POST http://localhost:4700/api/admin/seeds \
  -H "Content-Type: application/json" \
  -d '{"concepts": ["Advanced Algorithms", "Event System"]}'
```

### 🔄 **Resetting Data**

If you want to start fresh:

```bash
# Reset database
npx prisma migrate reset --force

# Re-seed with all data
node scripts/seed.js
```

### 📝 **Seed File Format**

```json
{
  "language": "JavaScript",
  "category": "JavaScript",
  "concepts": [
    {
      "name": "Concept Name",
      "difficulty": "medium",
      "questions": [
        {
          "question": "What is...?",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A",
          "explanation": "Explanation here",
          "tags": ["tag1", "tag2"],
          "companies": ["Google", "Facebook"]
        }
      ],
      "problems": [
        {
          "title": "Problem Title",
          "description": "Problem description",
          "testCases": [...],
          "solution": "Solution code",
          "hints": ["Hint 1", "Hint 2"]
        }
      ]
    }
  ]
}
```

## Troubleshooting

### ❌ **Common Issues**

1. **"Concepts not found"**: Check concept names match exactly
2. **"0 added items"**: Items already exist in database
3. **"File not found"**: Check file path and format

### ✅ **Success Indicators**

- `addedQuestions > 0` or `addedProblems > 0`
- `processedFiles` array contains expected files
- No error messages in response

### 🔧 **Debug Steps**

1. Check available concepts: `GET /api/admin/seeds`
2. Verify concept names match exactly
3. Check if items already exist in database
4. Review seed file format and structure
