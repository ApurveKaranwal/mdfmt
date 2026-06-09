# Advanced AI/ML Model - Quick Start Guide

## What's New?

The README generation system has been completely rebuilt with advanced AI/ML capabilities. It now generates **in-depth, professional documentation** that includes:

- ✅ Complete API endpoint documentation
- ✅ External service integrations
- ✅ Architecture and design patterns
- ✅ Database models and schemas
- ✅ Authentication methods
- ✅ Setup guides with all dependencies
- ✅ Real code examples from your repo

## Installation & Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Get a Groq API Key
- Go to [console.groq.com](https://console.groq.com)
- Sign up and create an API key
- Keep it safe!

### 3. Set Environment Variables
```bash
# Create a .env file in the backend directory
echo "GROQ_API_KEY=your-groq-api-key-here" > .env
echo "GROQ_MODEL=mixtral-8x7b-32768" >> .env
```

### 4. Start the Server
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

## Using the System

### Via API

#### 1. Generate Documentation
```bash
curl -X POST http://localhost:5000/generate/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "My Project",
    "githubUrl": "https://github.com/owner/repo",
    "groqApiKey": "your-groq-api-key",
    "documentationDepth": "complete",
    "instructions": "Focus on API endpoints and integration guides"
  }'
```

**Parameters:**
- `projectName` (string): Name of your project
- `githubUrl` (string): URL to the GitHub repository
- `groqApiKey` (string): Your Groq API key
- `documentationDepth` (string): One of:
  - `"readme-only"` - Just the README
  - `"standard"` - README + Architecture doc
  - `"complete"` - README + All supplementary docs (recommended)
- `instructions` (string, optional): Special requirements for generation

#### 2. Check Job Status
```bash
curl http://localhost:5000/generate/jobs/job-id-here
```

Response:
```json
{
  "job": {
    "id": "job-123",
    "status": "generating",
    "createdAt": "2024-01-01T12:00:00Z",
    "updatedAt": "2024-01-01T12:05:00Z",
    "repository": {
      "owner": "owner",
      "repo": "repo",
      "githubUrl": "https://github.com/owner/repo"
    }
  }
}
```

Job statuses:
- `queued` - Waiting to start
- `scraping` - Cloning and analyzing repository
- `generating` - Creating documentation with AI
- `needs_review` - Ready for review and approval
- `revising` - Being revised based on feedback
- `approved` - Ready for export
- `failed` - Something went wrong

#### 3. Get Generated Documentation
```bash
curl http://localhost:5000/generate/jobs/job-id-here
```

When status is `needs_review`, the response includes:
```json
{
  "result": {
    "readme": "# Project Title\n\n...",
    "docs": [
      {
        "path": "docs/architecture.md",
        "title": "Architecture",
        "content": "# Architecture\n\n..."
      },
      {
        "path": "docs/api-reference.md",
        "title": "API Reference",
        "content": "# API Reference\n\n..."
      }
    ],
    "summary": "Generated in-depth README...",
    "creatorQuestions": [
      "Does this project have any specific deployment requirements?"
    ]
  }
}
```

#### 4. Revise Based on Feedback
```bash
curl -X POST http://localhost:5000/generate/jobs/job-id-here/revise \
  -H "Content-Type: application/json" \
  -d '{
    "feedback": "Add more details about database setup. Include Docker configuration examples."
  }'
```

#### 5. Approve and Finalize
```bash
curl -X POST http://localhost:5000/generate/jobs/job-id-here/approve \
  -H "Content-Type: application/json" \
  -d '{
    "approvedPaths": ["README.md", "docs/architecture.md", "docs/api-reference.md"]
  }'
```

## What Gets Analyzed

### API Endpoints
- Automatically detects routes from Express, FastAPI, etc.
- Extracts method, path, parameters, and response types
- Groups by endpoint prefix for organization

**Example:**
```
- GET /api/users - Retrieve all users
- POST /api/users - Create a new user
- GET /api/users/:id - Get user by ID
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user
```

### External Integrations
Detects and documents:
- Cloud services: AWS, Azure, Firebase, GCP
- Payment processors: Stripe, PayPal
- Communication: Slack, Discord, SendGrid
- Databases: MongoDB, PostgreSQL, Redis
- Authentication: Auth0, Firebase Auth, Passport.js
- AI/ML: OpenAI, Groq, Hugging Face
- And more!

### Architecture
Identifies:
- Core components (Services, Controllers, Models)
- Design patterns (MVC, Microservices, etc.)
- Data models and schemas
- Component dependencies
- Tech stack per layer

### Features
Detects:
- Authentication & Authorization
- Caching strategies
- Background jobs
- Real-time communication
- File uploads
- Search functionality
- Analytics
- Payment processing
- API rate limiting
- CI/CD pipelines

### Database
Identifies:
- Database type (MongoDB, PostgreSQL, etc.)
- ORM/ODM (Prisma, TypeORM, etc.)
- Migrations
- Schemas and models

### Authentication
Detects:
- JWT tokens
- OAuth 2.0
- Session-based auth
- API key authentication
- Firebase Authentication
- Passport.js

## Generated Documentation

### README.md
A comprehensive README including:
- Project overview
- Architecture description
- Complete tech stack
- All core features
- Quick start guide
- API endpoints
- Environment setup
- Contributing guidelines

### docs/architecture.md
Deep dive into system design:
- Component responsibilities
- Data flow
- Design patterns used
- Scalability considerations
- Security measures
- Deployment topology

### docs/api-reference.md
Complete API documentation:
- All endpoints with methods and paths
- Parameter documentation
- Request/response examples
- Authentication requirements
- Error handling

### docs/setup-guide.md
Step-by-step setup:
- Prerequisites
- Installation steps
- Environment configuration
- Dependency management
- First-time run instructions

### docs/integrations.md
External service integration guide:
- Each service setup
- Required credentials
- Configuration steps
- Common issues and solutions

## Examples

### Example 1: Simple Node.js Express API
```bash
curl -X POST http://localhost:5000/generate/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "User Management API",
    "githubUrl": "https://github.com/myorg/user-api",
    "groqApiKey": "gsk_...",
    "documentationDepth": "complete"
  }'
```

Generated documentation will include:
- Express API endpoints documentation
- Database schema (MongoDB/PostgreSQL)
- JWT authentication setup
- Docker configuration
- Environment variables guide

### Example 2: Full-Stack React + Node Project
```bash
curl -X POST http://localhost:5000/generate/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Task Management System",
    "githubUrl": "https://github.com/myorg/task-manager",
    "groqApiKey": "gsk_...",
    "documentationDepth": "complete",
    "instructions": "Emphasize the CI/CD pipeline and deployment process"
  }'
```

Generated documentation will include:
- Frontend setup and component structure
- Backend API documentation
- Database schema
- Authentication flow
- Deployment on Vercel/Heroku
- GitHub Actions CI/CD

### Example 3: Python FastAPI Project
```bash
curl -X POST http://localhost:5000/generate/jobs \
  -H "Content-Type: application/json" \
  -d '{
    "projectName": "Data Processing Pipeline",
    "githubUrl": "https://github.com/myorg/data-pipeline",
    "groqApiKey": "gsk_...",
    "documentationDepth": "complete"
  }'
```

Generated documentation will include:
- FastAPI endpoint documentation
- Database models (SQLAlchemy)
- Async/await patterns
- Background job queue setup
- Docker and deployment
- Integration with external APIs

## Best Practices

### 1. Provide Context
Add instructions for better results:
```json
{
  "instructions": "This is a microservice for user authentication. Focus on security measures, OAuth integration, and API rate limiting."
}
```

### 2. Use Complete Depth
For production projects, always use `"documentationDepth": "complete"`:
```json
{
  "documentationDepth": "complete"
}
```

### 3. Review Generated Docs
- Check for accuracy
- Verify all endpoints are documented
- Ensure integration guides are clear

### 4. Use Revision Feature
Iterate on the documentation:
```bash
# After reviewing, revise based on feedback
curl -X POST http://localhost:5000/generate/jobs/job-id/revise \
  -d '{"feedback": "Add examples for error responses"}'
```

### 5. Keep Project Clean
The analysis works better when:
- Dependencies are properly listed in package.json/requirements.txt
- Routes follow standard naming conventions
- Environment variables follow naming standards
- Database models are well-structured

## Troubleshooting

### API Key Not Working
```
Error: Invalid API key
```
- Verify your Groq API key is correct
- Check that the key is still active at console.groq.com
- Ensure the key has access to the API

### Repository Clone Fails
```
Error: Failed to clone repository
```
- Verify the GitHub URL is correct
- Ensure the repository is public
- For private repos, provide a GITHUB_TOKEN

### Generation Takes Too Long
- Large repositories (>1000 files) take longer
- Check server logs for progress
- Consider using `"documentationDepth": "standard"` for faster results

### Missing Endpoints in Documentation
- Ensure routes use standard framework patterns
- Check that route files are analyzed
- Verify HTTP method is explicit (GET, POST, etc.)

## Advanced Configuration

### Custom LLM Settings
In `backend/src/config.ts`:
```typescript
export const config = {
  groqModel: "mixtral-8x7b-32768", // or other Groq models
  // other config...
};
```

Available Groq models:
- `mixtral-8x7b-32768` (default, fast and accurate)
- `llama2-70b-4096` (larger model, more capable)

### Increase Analysis Depth
In `advancedAnalysis.ts`, increase limits:
```typescript
return endpoints.slice(0, 50); // Increase from 50
```

## API Limits

- **Max file size**: 100MB per repository
- **Max files analyzed**: 500 files
- **API endpoints detected**: up to 50
- **External integrations**: up to 20
- **Generation timeout**: 5 minutes

## Support

For issues or questions:
1. Check the main [README.md](../README.md)
2. Review [ADVANCED_MODEL_DOCUMENTATION.md](../ADVANCED_MODEL_DOCUMENTATION.md)
3. Check GitHub issues
4. Review Groq documentation at console.groq.com

---

**Happy documenting!** 🚀
