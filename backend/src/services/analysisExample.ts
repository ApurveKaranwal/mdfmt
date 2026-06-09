/**
 * Example/Test file showing the advanced analysis in action
 * Run this to see what analysis is performed on a repository
 */

import { performAdvancedAnalysis, ApiEndpoint, ExternalIntegration, ArchitectureComponent, ArchitecturePattern } from "./advancedAnalysis";
import { createRepositorySnapshot } from "./githubService";
import {
  buildAdvancedReadmePrompt,
  buildAdvancedReadmeSystemPrompt,
  buildArchitectureDocumentPrompt,
} from "./advancedPrompts";
import { initMLEngine } from "./mlEngine";

// Example: Test the advanced analysis on a real GitHub repo
async function testAdvancedAnalysis() {
  try {
    console.log("🔍 Starting advanced repository analysis...\n");

    // For testing, you would provide a real GitHub URL
    const testRepo = "https://github.com/expressjs/express";

    console.log(`📦 Cloning repository: ${testRepo}`);
    const repository = await createRepositorySnapshot(testRepo);

    console.log(`\n✅ Repository snapshot created:`);
    console.log(`   - Owner: ${repository.owner}`);
    console.log(`   - Repo: ${repository.repo}`);
    console.log(`   - Total files: ${repository.fileTree.length}`);
    console.log(`   - Analyzed files: ${repository.files.length}`);
    console.log(`   - Detected stack: ${repository.detectedStack.join(", ")}`);

    console.log("\n🔬 Initializing Local AI/ML Engine...");
    await initMLEngine();

    console.log("\n🔬 Performing advanced analysis...");
    const analysis = await performAdvancedAnalysis(repository);

    console.log("\n📡 API Endpoints Found:");
    analysis.apiEndpoints.slice(0, 10).forEach((endpoint: ApiEndpoint) => {
      console.log(`   ${endpoint.method.padEnd(6)} ${endpoint.path}`);
    });
    if (analysis.apiEndpoints.length > 10) {
      console.log(`   ... and ${analysis.apiEndpoints.length - 10} more`);
    }

    console.log("\n🔗 External Integrations Detected:");
    analysis.externalIntegrations.slice(0, 5).forEach((integration: ExternalIntegration) => {
      console.log(`   - ${integration.name} (${integration.type})`);
    });
    if (analysis.externalIntegrations.length > 5) {
      console.log(`   ... and ${analysis.externalIntegrations.length - 5} more`);
    }

    console.log("\n🏗️  Architecture Components:");
    analysis.architectureComponents.forEach((component: ArchitectureComponent) => {
      console.log(`   - ${component.name} (${component.technologies.join(", ")})`);
    });

    console.log("\n🔐 Authentication Methods:");
    analysis.authMethods.forEach((method: string) => {
      console.log(`   - ${method}`);
    });

    console.log("\n🗄️  Database Type:");
    console.log(`   ${analysis.databaseType || "Not detected"}`);

    console.log("\n✨ Core Features:");
    analysis.coreFeatures.slice(0, 8).forEach((feature: string) => {
      console.log(`   - ${feature}`);
    });

    console.log("\n🎨 Design Patterns:");
    analysis.designPatterns.forEach((pattern: string) => {
      console.log(`   - ${pattern}`);
    });

    console.log("\n🏛️  Architecture Patterns:");
    analysis.architecturePatterns.forEach((pattern: ArchitecturePattern) => {
      console.log(`   - ${pattern.pattern}: ${pattern.description}`);
    });

    console.log("\n📊 Analysis Summary:");
    console.log(`   - API Endpoints: ${analysis.apiEndpoints.length}`);
    console.log(`   - External Integrations: ${analysis.externalIntegrations.length}`);
    console.log(`   - Components: ${analysis.architectureComponents.length}`);
    console.log(`   - Data Models: ${analysis.dataModels.length}`);
    console.log(`   - Auth Methods: ${analysis.authMethods.length}`);
    console.log(`   - Core Features: ${analysis.coreFeatures.length}`);
    console.log(`   - Design Patterns: ${analysis.designPatterns.length}`);
    console.log(`   - Architecture Patterns: ${analysis.architecturePatterns.length}`);

    console.log("\n\n📝 Sample README Context (first 500 chars):");
    const readmeContext = buildAdvancedReadmePrompt(
      {
        projectName: "Express.js",
        githubUrl: testRepo,
        documentationDepth: "complete",
      },
      repository,
      analysis,
    );
    console.log(readmeContext.substring(0, 500) + "...");

    console.log("\n\n✅ Analysis complete!");
  } catch (error) {
    console.error("❌ Error during analysis:", error);
  }
}

// Example output of what the analysis reveals:
/*
Expected output structure:

🔍 Starting advanced repository analysis...

📦 Cloning repository: https://github.com/expressjs/express

✅ Repository snapshot created:
   - Owner: expressjs
   - Repo: express
   - Total files: 250
   - Analyzed files: 45
   - Detected stack: Node.js, JavaScript, TypeScript

🔬 Performing advanced analysis...

📡 API Endpoints Found:
   GET    /
   POST   /users
   GET    /users/:id
   PUT    /users/:id
   DELETE /users/:id
   ... and 15 more

🔗 External Integrations Detected:
   - GitHub API (http)
   - TypeScript (sdk)
   - Jest (testing)
   - Express Middleware (sdk)
   - Morgan (logging)

🏗️  Architecture Components:
   - API Routes (Express)
   - Middleware (Request Processing)
   - Controllers (Request Handlers)
   - Services (Business Logic)
   - Utilities (Helper Functions)

🔐 Authentication Methods:
   - JWT (JSON Web Tokens)
   - API Key Authentication

🗄️  Database Type:
   PostgreSQL (SQL)

✨ Core Features:
   - User Authentication
   - Authorization & Permissions
   - Logging
   - API Rate Limiting
   - Real-time Communication
   - Database Migrations
   - Testing Framework
   - CI/CD Pipeline

🎨 Design Patterns:
   - Async/Await
   - Error Handling
   - Dependency Injection
   - Promise-based Concurrency

🏛️  Architecture Patterns:
   - Middleware: Request/response processing pipeline
   - MVC/MVVM: Model-View-Controller or Model-View-ViewModel architecture

📊 Analysis Summary:
   - API Endpoints: 20
   - External Integrations: 8
   - Components: 5
   - Data Models: 3
   - Auth Methods: 2
   - Core Features: 8
   - Design Patterns: 4
   - Architecture Patterns: 2

✅ Analysis complete!
*/

// How the system works in the full pipeline:
/*
1. Repository is cloned from GitHub
2. Advanced analysis extracts:
   - API endpoints from route definitions
   - External services from dependencies and code
   - Architecture components from directory structure
   - Design patterns from code analysis
   - Database information from package files
   - Authentication methods from imports and code

3. Rich context is built from analysis data

4. Groq LLM receives the context and generates:
   - Comprehensive README with all details
   - Architecture documentation
   - API reference documentation
   - Setup guide with all integrations
   - Integration guide for external services

5. Generated documentation is returned to the user

6. User can revise and approve the documentation
*/

export { testAdvancedAnalysis };
