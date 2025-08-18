#!/usr/bin/env node

/**
 * MyMentor Feature Testing Script
 *
 * This script helps validate core features of the interview platform
 * by checking API endpoints, database connections, and basic functionality.
 */

const https = require("https");
const http = require("http");

// Configuration
const BASE_URL = process.env.TEST_BASE_URL || "http://localhost:4700";
const TEST_TIMEOUT = 10000; // 10 seconds

// Colors for console output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0,
  details: [],
};

// Utility functions
function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name, status, details = "") {
  const icon = status === "PASS" ? "✅" : "❌";
  const color = status === "PASS" ? "green" : "red";
  log(`${icon} ${name}: ${status}`, color);
  if (details) {
    log(`   ${details}`, "yellow");
  }

  testResults.total++;
  if (status === "PASS") {
    testResults.passed++;
  } else {
    testResults.failed++;
  }

  testResults.details.push({ name, status, details });
}

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === "https:";
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: options.headers || {},
      timeout: TEST_TIMEOUT,
    };

    const req = client.request(requestOptions, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data: data,
        });
      });
    });

    req.on("error", (error) => {
      reject(error);
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });

    if (options.body) {
      req.write(options.body);
    }

    req.end();
  });
}

// Test functions
async function testServerHealth() {
  try {
    const response = await makeRequest(`${BASE_URL}/`);
    if (response.statusCode === 200) {
      logTest("Server Health Check", "PASS", `Status: ${response.statusCode}`);
    } else {
      logTest(
        "Server Health Check",
        "FAIL",
        `Expected 200, got ${response.statusCode}`
      );
    }
  } catch (error) {
    logTest("Server Health Check", "FAIL", error.message);
  }
}

async function testAPIEndpoints() {
  const endpoints = [
    { path: "/api/auth/me", name: "Auth API" },
    { path: "/api/problems", name: "Problems API" },
    { path: "/api/mcq", name: "MCQ API" },
    { path: "/api/exams", name: "Exams API" },
    { path: "/api/interviews", name: "Interviews API" },
    { path: "/api/feedback", name: "Feedback API" },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await makeRequest(`${BASE_URL}${endpoint.path}`);
      if (response.statusCode === 200 || response.statusCode === 401) {
        logTest(`${endpoint.name}`, "PASS", `Status: ${response.statusCode}`);
      } else {
        logTest(
          `${endpoint.name}`,
          "FAIL",
          `Expected 200/401, got ${response.statusCode}`
        );
      }
    } catch (error) {
      logTest(`${endpoint.name}`, "FAIL", error.message);
    }
  }
}

async function testPageRoutes() {
  const routes = [
    { path: "/", name: "Homepage" },
    { path: "/login", name: "Login Page" },
    { path: "/student", name: "Student Page" },
    { path: "/student/dashboard", name: "Student Dashboard" },
    { path: "/problems", name: "Problems Page" },
    { path: "/mcq", name: "MCQ Page" },
    { path: "/admin", name: "Admin Page" },
  ];

  for (const route of routes) {
    try {
      const response = await makeRequest(`${BASE_URL}${route.path}`);
      if (response.statusCode === 200) {
        logTest(
          `${route.name} Route`,
          "PASS",
          `Status: ${response.statusCode}`
        );
      } else {
        logTest(
          `${route.name} Route`,
          "FAIL",
          `Expected 200, got ${response.statusCode}`
        );
      }
    } catch (error) {
      logTest(`${route.name} Route`, "FAIL", error.message);
    }
  }
}

async function testErrorBoundaries() {
  try {
    const response = await makeRequest(`${BASE_URL}/api/error-reporting`);
    if (response.statusCode === 405) {
      // Method not allowed for GET
      logTest(
        "Error Reporting API",
        "PASS",
        "Endpoint exists (GET not allowed)"
      );
    } else {
      logTest(
        "Error Reporting API",
        "FAIL",
        `Unexpected status: ${response.statusCode}`
      );
    }
  } catch (error) {
    logTest("Error Reporting API", "FAIL", error.message);
  }
}

async function testDatabaseConnection() {
  try {
    const response = await makeRequest(`${BASE_URL}/api/test-db`);
    if (response.statusCode === 200) {
      const data = JSON.parse(response.data);
      if (data.success) {
        logTest("Database Connection", "PASS", "Database is accessible");
      } else {
        logTest(
          "Database Connection",
          "FAIL",
          data.error || "Database test failed"
        );
      }
    } else {
      logTest("Database Connection", "FAIL", `Status: ${response.statusCode}`);
    }
  } catch (error) {
    logTest("Database Connection", "FAIL", error.message);
  }
}

async function testBuildStatus() {
  try {
    // Check if build artifacts exist
    const fs = require("fs");
    const path = require("path");

    const buildDir = path.join(process.cwd(), ".next");
    if (fs.existsSync(buildDir)) {
      logTest("Build Status", "PASS", "Build artifacts found");
    } else {
      logTest("Build Status", "FAIL", "Build artifacts not found");
    }
  } catch (error) {
    logTest("Build Status", "FAIL", error.message);
  }
}

// Main test execution
async function runTests() {
  log("\n🚀 Starting MyMentor Feature Tests...\n", "bright");

  log("📋 Test Categories:", "cyan");
  log("1. Server Health Check", "blue");
  log("2. API Endpoints", "blue");
  log("3. Page Routes", "blue");
  log("4. Error Boundaries", "blue");
  log("5. Database Connection", "blue");
  log("6. Build Status", "blue");

  log("\n🔍 Running Tests...\n", "cyan");

  // Run tests
  await testServerHealth();
  await testAPIEndpoints();
  await testPageRoutes();
  await testErrorBoundaries();
  await testDatabaseConnection();
  await testBuildStatus();

  // Summary
  log("\n📊 Test Summary:", "bright");
  log(`Total Tests: ${testResults.total}`, "cyan");
  log(`Passed: ${testResults.passed}`, "green");
  log(`Failed: ${testResults.failed}`, "red");

  const successRate = ((testResults.passed / testResults.total) * 100).toFixed(
    1
  );
  log(`Success Rate: ${successRate}%`, successRate >= 80 ? "green" : "yellow");

  if (testResults.failed > 0) {
    log("\n❌ Failed Tests:", "red");
    testResults.details
      .filter((test) => test.status === "FAIL")
      .forEach((test) => {
        log(`   - ${test.name}: ${test.details}`, "yellow");
      });
  }

  log("\n✨ Test execution completed!", "bright");

  // Exit with appropriate code
  process.exit(testResults.failed > 0 ? 1 : 0);
}

// Handle command line arguments
const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  log("\nMyMentor Feature Testing Script", "bright");
  log("\nUsage:", "cyan");
  log("  node scripts/test-features.js [options]", "blue");
  log("\nOptions:", "cyan");
  log("  --help, -h     Show this help message", "blue");
  log(
    "  --url <url>    Set base URL for testing (default: http://localhost:4700)",
    "blue"
  );
  log("\nExamples:", "cyan");
  log("  node scripts/test-features.js", "blue");
  log(
    "  node scripts/test-features.js --url https://mymentor.example.com",
    "blue"
  );
  process.exit(0);
}

// Parse custom URL
const urlIndex = args.indexOf("--url");
if (urlIndex !== -1 && args[urlIndex + 1]) {
  process.env.TEST_BASE_URL = args[urlIndex + 1];
}

// Run tests
runTests().catch((error) => {
  log(`\n💥 Test execution failed: ${error.message}`, "red");
  process.exit(1);
});
