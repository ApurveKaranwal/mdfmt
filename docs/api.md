# 📡 mdfmt API Reference

This document covers all the endpoints currently supported by the mdfmt backend Express service. All endpoints are grouped under the `/api/build-ai` prefix.

![API Banner](https://placehold.co/1000x200/0f172a/10b981?text=mdfmt+API+Reference)

---

## 🤖 AI Documentation Agent Endpoints

### 1. `POST /api/build-ai/jobs`
Initializes a new documentation generation job by cloning the specified repository.

**Request Body:**
```json
{
  "repoUrl": "https://github.com/user/repo",
  "depth": "standard" // 'readme-only', 'standard', 'complete'
}
```

**Response:**
```json
{
  "jobId": "uuid-string",
  "status": "queued",
  "message": "Job created successfully"
}
```

### 2. `GET /api/build-ai/jobs/:id`
Polls the current status of an AI generation job. Since LLM generation and git clones can take up to a minute, the frontend continually polls this endpoint.

**Response:**
```json
{
  "id": "uuid-string",
  "status": "generating", // queued | scraping | generating | needs_review | completed | failed
  "progress": 45,
  "files": [
    {
      "path": "README.md",
      "content": "# Generated content...",
      "status": "pending_review"
    }
  ]
}
```

### 3. `POST /api/build-ai/jobs/:id/revise`
Sends feedback to the LLM to revise a specific file's generated content.

**Request Body:**
```json
{
  "filePath": "architecture.md",
  "feedback": "Make the tone more professional and include the Postgres schema."
}
```

### 4. `POST /api/build-ai/jobs/:id/approve`
Approves the current drafts of the files and finalizes the job status to `completed`.

---

## 🔀 Diagram Studio Endpoints

### 5. `POST /api/build-ai/diagram`
Takes natural language input and returns properly formatted Mermaid.js syntax.

**Request Body:**
```json
{
  "prompt": "Show a user authenticating via OAuth, getting a JWT, and hitting an Express API."
}
```

**Response:**
```json
{
  "mermaid": "graph TD\n    A[User] -->|Login| B(OAuth Provider)\n    B -->|Return JWT| A\n    A -->|Access Resource| C[Express API]"
}
```
*Note: The backend specifically prompts the LLM to omit markdown code block wrappings (e.g., \`\`\`mermaid) to ensure strict parsing compatibility.*
