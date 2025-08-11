# Admin Panel Guide

## How to Upload Content

### 1. Access Admin Panel
- Sign in with Google
- Click "Admin" button in the header
- Or visit `/admin` directly

### 2. Choose Content Type
- **Problems**: Coding problems with test cases
- **MCQ**: Multiple choice questions

### 3. Prepare JSON Data

#### Problem Format (No ID needed!):
```json
{
  "title": "Problem Title",
  "description": "Detailed problem description",
  "difficulty": "easy|medium|hard",
  "category": "arrays|strings|algorithms|etc",
  "testCases": "[{\"input\": \"[1,2,3]\", \"output\": \"6\"}]",
  "solution": "Solution explanation",
  "hints": "[\"Hint 1\", \"Hint 2\"]",
  "tags": "[\"arrays\", \"hash-table\"]",
  "companies": "[\"Google\", \"Amazon\"]"
}
```

#### MCQ Format (No ID needed!):
```json
{
  "question": "What is the question?",
  "options": "[\"Option A\", \"Option B\", \"Option C\", \"Option D\"]",
  "correctAnswer": 1,
  "explanation": "Why this is correct",
  "category": "algorithms|data-structures",
  "difficulty": "easy|medium|hard",
  "tags": "[\"binary-search\", \"complexity\"]",
  "companies": "[\"Google\", \"Amazon\"]"
}
```

### 4. Upload Steps
1. Select content type (Problems or MCQ)
2. Click "Load Template" to see example format
3. Copy and modify the template
4. Paste your JSON data
5. Click "Upload"

### 5. Auto-Generated IDs
- **No ID required!** - System generates unique IDs automatically
- **Based on title/question** - Creates readable, unique identifiers
- **Timestamp added** - Ensures uniqueness even with similar titles
- **Format**: `title-name-123456` (title + timestamp)

## Tips for Good Content

### Problems:
- Write clear, concise descriptions
- Include multiple test cases
- Provide helpful hints
- Use appropriate difficulty levels
- Tag with relevant categories

### MCQ Questions:
- Make questions clear and unambiguous
- Ensure only one correct answer
- Provide helpful explanations
- Use realistic difficulty levels
- Tag with relevant topics

## Common Issues

### JSON Format Errors:
- Check for missing commas
- Escape quotes properly
- Validate JSON before uploading

### Missing Fields:
- All required fields must be present
- Use correct data types
- Follow the template format

### Auto-Generated IDs:
- IDs are created from title/question
- Format: lowercase, hyphens, no special chars
- Timestamp ensures uniqueness
- No need to worry about duplicates

## Example Auto-Generated IDs

### Problems:
- Title: "Two Sum" → ID: `two-sum-123456`
- Title: "Reverse String" → ID: `reverse-string-789012`

### MCQ:
- Question: "What is binary search?" → ID: `what-is-binary-search-345678`
- Question: "Stack vs Queue" → ID: `stack-vs-queue-901234`
