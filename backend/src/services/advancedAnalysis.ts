import type { RepositorySnapshot, RepositoryFile } from "../types";
import { extractKeywords, predictEndpointDescription } from "./mlEngine";

// ================================================================================
// ADVANCED REPOSITORY ANALYSIS - FOR GENERATING IN-DEPTH DOCUMENTATION
// ================================================================================

export interface ApiEndpoint {
  method: string;
  path: string;
  description: string;
  parameters?: string[];
  requestBody?: string;
  responseType?: string;
  authentication?: string;
  sourceFile?: string;
}

export interface ExternalIntegration {
  name: string;
  type: "http" | "sdk" | "webhook" | "database" | "cloud-service" | "authentication" | "payment" | "other";
  description: string;
  environmentVariables?: string[];
  endpoints?: string[];
  documentation?: string;
  sourceFiles?: string[];
}

export interface ArchitectureComponent {
  name: string;
  purpose: string;
  technologies: string[];
  files: string[];
  dependencies: string[];
  exportedSignatures?: string[];
  isCore: boolean;
}

export interface ArchitecturePattern {
  pattern: string;
  description: string;
  examples: string[];
}

export interface DataModel {
  name: string;
  fields: string[];
  description?: string;
  sourceFile?: string;
}

export interface AdvancedAnalysis {
  coreFeatures: string[];
  projectSummary?: string;
  architecturePatterns: ArchitecturePattern[];
  architectureComponents: ArchitectureComponent[];
  databaseType?: string;
  dataModels: DataModel[];
  authMethods: string[];
  designPatterns: string[];
  externalIntegrations: ExternalIntegration[];
  apiEndpoints: ApiEndpoint[];
}

/**
 * Perform advanced analysis to extract API endpoints, integrations, and architecture
 */
export async function performAdvancedAnalysis(repository: RepositorySnapshot, projectName: string = "Project"): Promise<AdvancedAnalysis> {
  const [designPatterns, coreFeatures] = await Promise.all([
     detectDesignPatterns(repository),
     extractCoreFeatures(repository)
  ]);

  const databaseType = detectDatabaseType(repository);
  
  const contextText = [...coreFeatures, ...repository.detectedStack, databaseType || ""].join(". ");
  const projectSummary = `**${projectName}** is an advanced application leveraging modern scalable design patterns.`;

  return {
    apiEndpoints: extractApiEndpoints(repository),
    externalIntegrations: detectExternalIntegrations(repository),
    architectureComponents: identifyArchitectureComponents(repository),
    architecturePatterns: detectArchitecturePatterns(repository),
    dataModels: extractDataModels(repository),
    authMethods: detectAuthenticationMethods(repository),
    databaseType,
    coreFeatures,
    designPatterns,
    projectSummary,
  };
}

import { parseAstForFile } from "./astParser";

/**
 * Identify major architecture components (e.g., frontend app, backend server, database)
 */
function identifyArchitectureComponents(repository: RepositorySnapshot): ArchitectureComponent[] {
  const components: ArchitectureComponent[] = [];
  const contentPaths = repository.files.map((f) => f.path);

  // Analyze TS/JS files via AST
  const astResults = new Map<string, string[]>();
  for (const file of repository.files) {
    if (file.path.endsWith(".ts") || file.path.endsWith(".tsx") || file.path.endsWith(".js") || file.path.endsWith(".jsx")) {
      const ast = parseAstForFile(file.content, file.path);
      if (ast.exportedFunctions.length > 0 || ast.exportedClasses.length > 0) {
        astResults.set(file.path, [...ast.exportedClasses, ...ast.exportedFunctions]);
      }
    }
  }

  // 1. Frontend Detection
  const hasFrontend = contentPaths.some(
    (p) => p.includes("src/App.") || p.includes("pages/") || p.includes("components/") || p.includes("app/layout.")
  );
  if (hasFrontend) {
    const exportedSig = [];
    for (const [p, sigs] of astResults.entries()) {
      if (p.includes("src/") || p.includes("components/")) exportedSig.push(...sigs.slice(0, 5));
    }
    
    components.push({
      name: "Client UI / Consumer",
      purpose: "Frontend application layer responsible for user interface and client-side logic",
      technologies: ["React", "HTML/CSS"],
      files: ["src/App.tsx", "pages/"],
      dependencies: [],
      exportedSignatures: exportedSig.slice(0, 10),
      isCore: true,
    });
  }

  // 2. Backend API Detection
  const hasBackend = contentPaths.some(
    (p) => p.includes("server.") || p.includes("app.") || p.includes("routes/") || p.includes("controllers/")
  );
  if (hasBackend || repository.detectedStack.includes("Express") || repository.detectedStack.includes("Hono")) {
    const exportedSig = [];
    for (const [p, sigs] of astResults.entries()) {
      if (p.includes("server") || p.includes("routes") || p.includes("controllers")) exportedSig.push(...sigs.slice(0, 5));
    }

    components.push({
      name: "API Controller & Router",
      purpose: "Server-side routing, request handling, and middleware validations",
      technologies: ["Express", "Node.js"],
      files: ["server.ts", "routes/"],
      dependencies: [],
      exportedSignatures: exportedSig.slice(0, 10),
      isCore: true,
    });
  }

  // 3. Database / ORM Detection
  if (repository.detectedStack.includes("Prisma") || repository.detectedStack.includes("Mongoose")) {
    components.push({
      name: "Database / Storage engine",
      purpose: "Persistent data storage and entity relationship mapping",
      technologies: ["PostgreSQL", "MongoDB", "Prisma ORM"],
      files: ["prisma/schema.prisma"],
      dependencies: [],
      isCore: true,
    });
  }

  // 4. Core Business Logic (Services)
  const hasServices = contentPaths.some((p) => p.includes("services/") || p.includes("lib/") || p.includes("utils/"));
  if (hasServices) {
    const exportedSig = [];
    for (const [p, sigs] of astResults.entries()) {
      if (p.includes("services") || p.includes("lib") || p.includes("utils")) exportedSig.push(...sigs.slice(0, 5));
    }

    components.push({
      name: "Core Business Services & Logic Layer",
      purpose: "Domain-specific logic, external integrations, and heavy processing",
      technologies: ["TypeScript", "Node.js"],
      files: ["services/"],
      dependencies: [],
      exportedSignatures: exportedSig.slice(0, 10),
      isCore: true,
    });
  }
  return components;
}

/**
 * Extract API endpoints from route files and main application code across multiple frameworks
 */
function extractApiEndpoints(repository: RepositorySnapshot): ApiEndpoint[] {
  const endpoints: ApiEndpoint[] = [];
  
  for (const file of repository.files) {
    const content = file.content;
    const pathLower = file.path.toLowerCase();

    // 1. Express.js / Node.js
    if (pathLower.endsWith(".ts") || pathLower.endsWith(".js") || pathLower.endsWith(".tsx") || pathLower.endsWith(".jsx")) {
      const expressMatches = [
        ...content.matchAll(/(?:router|app|api|server)\.(get|post|put|delete|patch|options|head)\s*\(\s*['"](\/[^'"]*)['"]/gi),
      ];
      for (const match of expressMatches) {
        const method = match[1].toUpperCase();
        const path = match[2];
        const description = inferDescriptionBeforeIndex(content, match.index ?? 0, `${method} ${path}`, path, method);
        endpoints.push({ method, path, description, sourceFile: file.path });
      }

      // NestJS route decorators: @Get('path'), @Post('path'), @Controller('prefix')
      const controllerMatch = content.match(/@Controller\s*\(\s*['"]([^'"]*)['"]/i);
      const prefix = controllerMatch ? `/${controllerMatch[1]}`.replace(/\/+/g, "/") : "";
      const nestMatches = [
        ...content.matchAll(/@(Get|Post|Put|Delete|Patch)\s*\(\s*['"]([^'"]*)['"]/gi),
      ];
      for (const match of nestMatches) {
        const method = match[1].toUpperCase();
        const routePath = `${prefix}/${match[2]}`.replace(/\/+/g, "/");
        const description = inferDescriptionBeforeIndex(content, match.index ?? 0, `NestJS ${method} ${routePath}`, routePath, method);
        endpoints.push({ method, path: routePath, description, sourceFile: file.path });
      }
    }

    // 2. Python (FastAPI, Flask, Django)
    if (pathLower.endsWith(".py")) {
      // FastAPI/Flask route decorators: @app.get("/path"), @router.post("/path"), @blueprint.route("/path", methods=["GET"])
      const pyMatches = [
        ...content.matchAll(/@(?:app|router|api|blueprint)\.(get|post|put|delete|patch)\s*\(\s*['"](\/[^'"]*)['"]/gi),
      ];
      for (const match of pyMatches) {
        const method = match[1].toUpperCase();
        const path = match[2];
        const description = inferDescriptionBeforeIndex(content, match.index ?? 0, `${method} ${path}`, path, method);
        endpoints.push({ method, path, description, sourceFile: file.path });
      }

      // Django path/re_path: path('api/v1/users/', views.UserList.as_view())
      const djangoMatches = [
        ...content.matchAll(/path\s*\(\s*['"]([^'"]*)['"]\s*,\s*([^,)]+)/g),
      ];
      for (const match of djangoMatches) {
        const path = `/${match[1]}`.replace(/\/+/g, "/");
        const handler = match[2].trim();
        endpoints.push({
          method: "ROUTE",
          path,
          description: `Django endpoint handled by ${handler}`,
          sourceFile: file.path,
        });
      }
    }

    // 3. Go (Gin, Fiber, Chi, Echo)
    if (pathLower.endsWith(".go")) {
      const goMatches = [
        ...content.matchAll(/(?:\w+)\.(GET|POST|PUT|DELETE|PATCH|OPTIONS)\s*\(\s*['"](\/[^'"]*)['"]/g),
      ];
      for (const match of goMatches) {
        const method = match[1].toUpperCase();
        const path = match[2];
        endpoints.push({
          method,
          path,
          description: `Go ${method} endpoint`,
          sourceFile: file.path,
        });
      }
    }

    // 4. PHP (Laravel / Symfony)
    if (pathLower.endsWith(".php")) {
      const phpMatches = [
        ...content.matchAll(/Route::(get|post|put|delete|patch|any)\s*\(\s*['"]([^'"]*)['"]/gi),
      ];
      for (const match of phpMatches) {
        const method = match[1].toUpperCase();
        const path = `/${match[2]}`.replace(/\/+/g, "/");
        endpoints.push({
          method,
          path,
          description: `Laravel ${method} endpoint`,
          sourceFile: file.path,
        });
      }
    }

    // 5. Java (Spring Boot)
    if (pathLower.endsWith(".java")) {
      const springMatches = [
        ...content.matchAll(/@(Get|Post|Put|Delete|Patch)Mapping\s*\(\s*(?:value\s*=\s*)?['"]([^'"]*)['"]/gi),
      ];
      for (const match of springMatches) {
        const method = `${match[1].toUpperCase()} (Spring)`;
        const path = match[2];
        endpoints.push({
          method,
          path,
          description: `Spring Boot ${method} mapping`,
          sourceFile: file.path,
        });
      }
    }
  }

  // De-duplicate endpoints
  const uniqueEndpoints: ApiEndpoint[] = [];
  const seen = new Set<string>();
  for (const ep of endpoints) {
    const key = `${ep.method}:${ep.path}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueEndpoints.push(ep);
    }
  }

  return uniqueEndpoints.slice(0, 50);
}

function inferDescriptionBeforeIndex(content: string, index: number, fallback: string, path: string = "", method: string = ""): string {
  const beforeMatch = content.substring(Math.max(0, index - 300), index);
  const commentMatch = beforeMatch.match(/\/\/\s*(.+?)(?:\n|$)|\/\*\s*([\s\S]*?)\*\//);
  if (commentMatch) {
    const doc = (commentMatch[1] || commentMatch[2] || "").trim();
    if (doc && !doc.startsWith("*") && !doc.startsWith("@")) {
      return doc.slice(0, 150);
    }
  }
  
  // Use AI/ML Engine to predict endpoint description based on path heuristics if no comment found
  return predictEndpointDescription(path, method, fallback);
}

/**
 * Detect external API integrations and services
 */
function detectExternalIntegrations(repository: RepositorySnapshot): ExternalIntegration[] {
  const integrations: Map<string, ExternalIntegration> = new Map();
  const content = repository.files.map((f) => f.content).join("\n");
  const manifest = repository.packageManifests[0] as Record<string, any> | undefined;
  const dependencies = manifest?.dependencies ? Object.keys(manifest.dependencies) : [];

  // SDK detection patterns
  const sdkPatterns = [
    { name: "OpenAI API", keywords: ["openai", "langchain"], type: "sdk" as const, desc: "AI / Large Language Model integration via OpenAI SDK" },
    { name: "Anthropic API", keywords: ["anthropic", "@anthropic-ai"], type: "sdk" as const, desc: "AI / Large Language Model integration via Anthropic SDK" },
    { name: "Groq Cloud API", keywords: ["groq-sdk", "groq"], type: "sdk" as const, desc: "AI Inference acceleration using Groq Cloud SDK" },
    { name: "AWS SDK", keywords: ["aws-sdk", "@aws-sdk", "boto3"], type: "cloud-service" as const, desc: "AWS Cloud Infrastructure integration (S3, DynamoDB, Cognito, etc.)" },
    { name: "Firebase Service", keywords: ["firebase", "firebase-admin"], type: "cloud-service" as const, desc: "Firebase Backend-as-a-Service integration" },
    { name: "Stripe Gateway", keywords: ["stripe", "@stripe/stripe-js"], type: "payment" as const, desc: "Payment processing and billing integration" },
    { name: "GitHub Integration", keywords: ["octokit", "github"], type: "http" as const, desc: "GitHub Platform API integrations" },
    { name: "Discord API", keywords: ["discord.js", "discord-api"], type: "webhook" as const, desc: "Discord BOT or webhook notifications" },
    { name: "Slack SDK", keywords: ["@slack/web-api", "slack"], type: "webhook" as const, desc: "Slack notifications and bot operations" },
    { name: "MongoDB Client", keywords: ["mongodb", "mongoose"], type: "database" as const, desc: "MongoDB NoSQL database interaction" },
    { name: "PostgreSQL Client", keywords: ["postgresql", "pg", "prisma", "sequelize"], type: "database" as const, desc: "PostgreSQL relational database connection" },
    { name: "Redis Cache", keywords: ["redis", "ioredis"], type: "database" as const, desc: "Redis key-value store cache/session management" },
    { name: "JWT Authentication", keywords: ["jsonwebtoken", "jwt", "pyjwt"], type: "authentication" as const, desc: "Secure Token-based authentication" },
    { name: "OAuth 2.0 Integration", keywords: ["passport", "oauth2", "auth0", "next-auth"], type: "authentication" as const, desc: "External Identity provider or OAuth authentication flow" },
    { name: "Twilio API", keywords: ["twilio"], type: "http" as const, desc: "SMS or voice communications dispatch" },
    { name: "SendGrid Email", keywords: ["sendgrid", "@sendgrid/mail"], type: "http" as const, desc: "Transactional email service dispatch" },
  ];

  // Check dependencies
  for (const pattern of sdkPatterns) {
    const found = dependencies.some((dep) => pattern.keywords.some((kw) => dep.toLowerCase().includes(kw.toLowerCase())));

    if (found) {
      integrations.set(pattern.name, {
        name: pattern.name,
        type: pattern.type,
        description: pattern.desc,
        sourceFiles: [],
      });
    }
  }

  // Detect environment variables for integrations
  const envVarPatterns = [
    { keyword: "API_KEY", name: "External API Integration" },
    { keyword: "TOKEN", name: "Authentication Token API" },
    { keyword: "SECRET", name: "Secret Configuration Store" },
    { keyword: "DATABASE_URL", name: "Database Endpoint Connection" },
    { keyword: "WEBHOOK", name: "Webhook Dispatcher" },
  ];

  const envVars = detectEnvVars(repository);
  for (const envVar of envVars) {
    for (const pattern of envVarPatterns) {
      if (envVar.includes(pattern.keyword)) {
        const key = `${pattern.name}: ${envVar}`;
        if (!integrations.has(key)) {
          integrations.set(key, {
            name: envVar,
            type: "other",
            description: `Environment configuration variable used for authentication and service loading`,
            environmentVariables: [envVar],
          });
        }
      }
    }
  }

  // Detect HTTP calls for external APIs
  const httpPatterns = [
    ...content.matchAll(/fetch\s*\(\s*['"](https?:\/\/[^'"]+)['"]/gi),
    ...content.matchAll(/axios\.(get|post|put|delete)\s*\(\s*['"](https?:\/\/[^'"]+)['"]/gi),
  ];

  const urlSet = new Set<string>();
  for (const match of httpPatterns) {
    const url = match[match.length - 1];
    if (url && !url.includes("localhost") && !url.includes("127.0.0.1")) {
      urlSet.add(url);
    }
  }

  // Convert URLs to integration entries
  for (const url of urlSet) {
    try {
      const hostname = new URL(url).hostname;
      const key = `External API: ${hostname}`;
      if (!integrations.has(key)) {
        integrations.set(key, {
          name: hostname,
          type: "http",
          description: `HTTP outbound API integration with ${hostname}`,
          endpoints: [url],
        });
      }
    } catch {
      // Ignore invalid URLs
    }
  }

  return Array.from(integrations.values()).slice(0, 20);
}



/**
 * Detect architecture patterns used in the codebase
 */
function detectArchitecturePatterns(repository: RepositorySnapshot): ArchitecturePattern[] {
  const patterns: ArchitecturePattern[] = [];
  const content = repository.files.map((f) => f.content).join("\n").toLowerCase();

  const patternMatches = [
    {
      pattern: "Model-View-Controller (MVC)",
      keywords: ["controllers", "models", "views"],
      description: "Classical separation of concerns between data model, user views, and controller mapping request handlers",
    },
    {
      pattern: "Service-Oriented / Domain Logic Separation",
      keywords: ["service", "business logic", "domain"],
      description: "Business operations are extracted into independent service classes/functions, separating API contracts from execution logic",
    },
    {
      pattern: "Dependency Injection / Service Locator",
      keywords: ["inject", "container", "provider", "@injectable"],
      description: "Dynamic injection of dependencies to increase testability and loose coupling of components",
    },
    {
      pattern: "Repository / DAO Pattern",
      keywords: ["repository", "dao", "data access", "queries"],
      description: "Abstraction over raw SQL queries or ORM functions using classes that represent collections of domain entities",
    },
    {
      pattern: "Factory Pattern",
      keywords: ["factory", "createinstance", "buildinstance"],
      description: "Centralized initialization and creation logic for complex objects and configurations",
    },
    {
      pattern: "Observer / Pub-Sub Pattern",
      keywords: ["event", "listener", "emit", "subscribe", "publish", "subject"],
      description: "Asynchronous communication based on event dispatching and listening, facilitating decoupled workflow steps",
    },
    {
      pattern: "Pipeline / Middleware Pattern",
      keywords: ["middleware", "interceptor", "next()", "filter"],
      description: "Linear chained interceptor execution pipeline allowing authentication, logging, and validation filters on inputs",
    },
  ];

  for (const match of patternMatches) {
    const found = match.keywords.some((kw) => content.includes(kw));
    if (found) {
      patterns.push({
        pattern: match.pattern,
        description: match.description,
        examples: match.keywords.slice(0, 3),
      });
    }
  }

  return patterns;
}

/**
 * Extract data models and database schemas
 */
function extractDataModels(repository: RepositorySnapshot): DataModel[] {
  const models: DataModel[] = [];
  const modelFiles = repository.files.filter((f) => /models?\/|schema|entity/i.test(f.path));

  for (const file of modelFiles.slice(0, 10)) {
    // Extract class/interface definitions
    const classMatches = [
      ...file.content.matchAll(/(?:class|interface|type)\s+([A-Z][a-zA-Z0-9]*)\s*[{<\{]/g),
      ...file.content.matchAll(/model\s+([A-Z][a-zA-Z0-9]*)\s*\{/g), // Prisma models
    ];

    for (const match of classMatches) {
      const name = match[1];
      // Extract fields
      const classBody = file.content.substring(match.index! + match[0].length, match.index! + match[0].length + 500);
      const fieldMatches = [...classBody.matchAll(/\s*(\w+)\s*(?::|@|type|string|int|datetime)/gi)];
      const fields = [...new Set(fieldMatches.slice(0, 8).map((m) => m[1]))];

      models.push({
        name,
        fields,
        sourceFile: file.path,
      });
    }
  }

  return models.slice(0, 15);
}

/**
 * Detect authentication methods used
 */
function detectAuthenticationMethods(repository: RepositorySnapshot): string[] {
  const methods: Set<string> = new Set();
  const content = repository.files.map((f) => f.content).join("\n").toLowerCase();
  const manifest = repository.packageManifests[0] as Record<string, any> | undefined;
  const dependencies = manifest?.dependencies ? Object.keys(manifest.dependencies) : [];

  if (dependencies.some((d) => /jwt|jsonwebtoken|pyjwt/.test(d.toLowerCase()))) methods.add("JWT (JSON Web Tokens)");
  if (dependencies.some((d) => /passport/.test(d.toLowerCase()))) methods.add("Passport.js Session & OAuth Strategies");
  if (dependencies.some((d) => /oauth|keycloak|auth0/.test(d.toLowerCase()))) methods.add("OAuth 2.0 / OpenID Connect");
  if (dependencies.some((d) => /firebase/.test(d.toLowerCase()))) methods.add("Firebase Authentication Services");
  if (dependencies.some((d) => /next-auth|nextauth/.test(d.toLowerCase()))) methods.add("NextAuth.js Social Auth");
  if (dependencies.some((d) => /bcrypt|argon2/.test(d.toLowerCase()))) methods.add("Cryptographic Password Hashing (bcrypt/argon2)");

  if (content.includes("bearer token") || content.includes("headers.authorization")) methods.add("Bearer Token Authentication");
  if (content.includes("session") || content.includes("cookie-parser")) methods.add("Session-based Cookie Authentication");
  if (content.includes("api key") || content.includes("apikey")) methods.add("API Key Authorization");

  return Array.from(methods);
}

/**
 * Detect database type and ORM
 */
function detectDatabaseType(repository: RepositorySnapshot): string | undefined {
  const manifest = repository.packageManifests[0] as Record<string, any> | undefined;
  const dependencies = manifest?.dependencies ? Object.keys(manifest.dependencies).join(" ").toLowerCase() : "";
  const devDependencies = manifest?.devDependencies ? Object.keys(manifest.devDependencies).join(" ").toLowerCase() : "";
  const allDeps = dependencies + " " + devDependencies;

  const fileTreeStr = repository.fileTree.join(" ").toLowerCase();

  if (allDeps.includes("prisma") || fileTreeStr.includes("prisma")) return "PostgreSQL/MySQL database mapped via Prisma ORM";
  if (allDeps.includes("mongoose") || allDeps.includes("mongodb")) return "MongoDB Database (via Mongoose ODM)";
  if (allDeps.includes("pg ") || allDeps.includes("sequelize")) return "PostgreSQL Relational Database (via Sequelize ORM)";
  if (allDeps.includes("mysql2") || allDeps.includes("typeorm")) return "MySQL Relational Database (via TypeORM)";
  if (allDeps.includes("sqlite3")) return "SQLite Embedded Database (local file storage)";
  if (allDeps.includes("redis") || allDeps.includes("ioredis")) return "Redis Key-Value Cache Store";
  if (allDeps.includes("firebase")) return "Firebase Cloud Firestore Database";

  return undefined;
}

/**
 * Extract core features from the codebase
 */
async function extractCoreFeatures(repository: RepositorySnapshot): Promise<string[]> {
  const features: Set<string> = new Set();
  const fileContent = repository.files.map((f) => f.path + " " + f.content).join(" ").toLowerCase();

  const featurePatterns = [
    { pattern: /authentication|auth|login|signup|register|jwt|passport/, feature: "Secure User Authentication (JWT/Session)" },
    { pattern: /authorization|roles|permissions|rbac|admin/, feature: "Role-Based Access Control (RBAC)" },
    { pattern: /cache|redis|memcached/, feature: "Performance Caching Layer" },
    { pattern: /queue|job|background|bullmq|celery/, feature: "Asynchronous Background Jobs & Tasks Queues" },
    { pattern: /websocket|socket\.io|real-time|ws\./, feature: "WebSockets Real-time Communication" },
    { pattern: /file.*upload|upload.*file|multer|s3|cloudinary/, feature: "Cloud File Upload & Asset Storage" },
    { pattern: /search|elasticsearch|algolia|fuse/, feature: "Intelligent Text Search Engine" },
    { pattern: /notification|email|mail|sendgrid|twilio/, feature: "Email & SMS Notifications dispatch service" },
    { pattern: /analytics|tracking|mixpanel|ga\./, feature: "User Action Analytics & Logging System" },
    { pattern: /payment|stripe|paypal|charge|invoice/, feature: "Subscription Billing & Stripe Payment Processing" },
    { pattern: /api.*rate|throttle|limit|express-rate-limit/, feature: "API Rate Limiting & Protection" },
    { pattern: /database.*migration|migrate|prisma migrate/, feature: "Database Schema Migrations Engine" },
    { pattern: /logging|logger|winston|pino|morgan/, feature: "Structured Diagnostic Logging" },
    { pattern: /testing|test|spec|jest|mocha|vitest/, feature: "Automated Unit and Integration Testing Suite" },
    { pattern: /ci|cd|github.*actions|pipeline|travis/, feature: "GitHub Actions Continuous Integration (CI/CD) Pipeline" },
    { pattern: /docker|dockerfile|docker-compose/, feature: "Dockerized Container deployment configuration" },
  ];

  for (const { pattern, feature } of featurePatterns) {
    if (pattern.test(fileContent)) {
      features.add(feature);
    }
  }

  // Use AIML NLP TF-IDF to find additional core feature keywords from the README or top files
  const topText = repository.files.slice(0, 5).map(f => f.content).join("\n");
  const aiKeywords = extractKeywords(topText, 4);
  if (aiKeywords.length > 0) {
    features.add(`Topics involving ${aiKeywords.join(", ")}`);
  }

  // Fallback default features if none detected
  if (features.size === 0) {
    features.add("RESTful Web API services");
    features.add("Modular Architecture Component pattern");
    features.add("Local environment automated setups configuration");
  }

  return Array.from(features);
}

/**
 * Detect design patterns in use
 */
async function detectDesignPatterns(repository: RepositorySnapshot): Promise<string[]> {
  const patterns: Set<string> = new Set();
  const content = repository.files.map((f) => f.content).join("\n");

  if (/singleton|instance\s*=\s*null|static\s+getinstance/i.test(content)) patterns.add("Singleton Pattern");
  if (/abstract\s+class|extends\s+[A-Z]/i.test(content)) patterns.add("Abstract Classes / Polymorphism");
  if (/interface\s+[A-Z][a-zA-Z0-9]*\s*\{/i.test(content)) patterns.add("Interface Segregation Principle");
  if (/try\s*\{[\s\S]*?\}\s*catch\s*\{/i.test(content)) patterns.add("Robust Error Propagation Handling");
  if (/async\s+function|const\s+\w+\s*=\s*async/i.test(content)) patterns.add("Asynchronous Task Execution Pattern (Async/Await)");
  if (/Promise\.all|Promise\.race/i.test(content)) patterns.add("Concurrent Thread/Promise Execution Pool");
  if (/curry|pipe|compose|function\s+\w+\s*\(\s*\)\s*\{\s*return\s+function/i.test(content)) patterns.add("Functional Composition Patterns");
  if (/decorator|@[\w]+/i.test(content)) patterns.add("Decorator Annotations Pattern");
  if (/class\s+\w+\s*extends/i.test(content)) patterns.add("Class-based Inheritance");
  if (/mixin|composition\s*over\s*inheritance/i.test(content)) patterns.add("Component Composition");



  return Array.from(patterns).slice(0, 10);
}

/**
 * Helper: Detect environment variables
 */
function detectEnvVars(repository: RepositorySnapshot): string[] {
  const envVars: Set<string> = new Set();

  for (const file of repository.files) {
    if (/\.env|config/i.test(file.path)) {
      const matches = file.content.matchAll(/^([A-Z_][A-Z0-9_]*)\s*=/gm);
      for (const match of matches) {
        envVars.add(match[1]);
      }
    }

    // Process.env and import.meta.env
    const processEnvMatches = file.content.matchAll(/process\.env\.([A-Z_][A-Z0-9_]*)/g);
    for (const match of processEnvMatches) {
      envVars.add(match[1]);
    }
    const importMetaEnvMatches = file.content.matchAll(/import\.meta\.env\.([A-Z_][A-Z0-9_]*)/g);
    for (const match of importMetaEnvMatches) {
      envVars.add(match[1]);
    }
  }

  return Array.from(envVars).sort();
}
