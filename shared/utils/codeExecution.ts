// Simple code execution utility for MVP
// In production, this should be replaced with a proper sandboxed execution environment

export interface TestCase {
  input: string;
  output: string;
}

export interface TestResult {
  testCase: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  error?: string;
}

export function executeJavaScriptCode(code: string, testCases: TestCase[]): TestResult[] {
  const results: TestResult[] = [];
  
  try {
    // Create a safe execution context
    const safeEval = new Function('return ' + code)();
    
    // For MVP, we'll do basic validation
    // In production, this should be replaced with proper test case execution
    testCases.forEach((testCase, index) => {
      try {
        // Basic validation - in real implementation, you'd parse input and call the function
        const result: TestResult = {
          testCase: index + 1,
          input: testCase.input,
          expected: testCase.output,
          actual: 'Code executed successfully', // Placeholder
          passed: index === 0, // Mock: first test passes, others fail
        };
        
        results.push(result);
      } catch (error) {
        results.push({
          testCase: index + 1,
          input: testCase.input,
          expected: testCase.output,
          actual: 'Runtime error',
          passed: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    });
  } catch (error) {
    // If code compilation fails
    testCases.forEach((testCase, index) => {
      results.push({
        testCase: index + 1,
        input: testCase.input,
        expected: testCase.output,
        actual: 'Compilation error',
        passed: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    });
  }
  
  return results;
}

export function validateCode(code: string): { isValid: boolean; error?: string } {
  try {
    new Function(code);
    return { isValid: true };
  } catch (error) {
    return {
      isValid: false,
      error: error instanceof Error ? error.message : 'Invalid code',
    };
  }
}
