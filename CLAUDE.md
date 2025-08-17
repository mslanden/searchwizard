# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important: Project Standards
**ALWAYS refer to PROJECT_STANDARDS.md for coding standards, naming conventions, and architectural patterns before making any changes to the codebase.**

## Project Overview

Search Wizard is a full-stack application for AI-powered document generation using a multi-agent system. It consists of:
- **Frontend**: Next.js 15+ with React 19, Tailwind CSS, and Supabase for auth/database
- **Backend**: Python FastAPI server with AI agents for document structure analysis and generation

## Common Development Commands

### Frontend (Next.js)
```bash
cd frontend
npm install                # Install dependencies
npm run dev               # Start development server (http://localhost:3000)
npm run build             # Build for production
npm run lint              # Run ESLint
```

### Backend (Python/FastAPI)
```bash
cd backend
pip install -r requirements.txt    # Install dependencies
python api.py                      # Start API server (http://localhost:8000)
uvicorn api:app --reload          # Alternative with auto-reload
```

### Environment Variables Required
Frontend `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Backend `.env`:
```
OPENAI_API_KEY=your-api-key
ANTHROPIC_API_KEY=your-api-key
GEMINI_API_KEY=your-api-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## High-Level Architecture

### Multi-Agent AI System
The backend uses a sophisticated multi-agent architecture for document generation:

1. **StructureAgent** (`backend/agents/structure_agent.py`): Analyzes example documents to extract structural patterns and create templates
2. **WriterAgent** (`backend/agents/writer_agent.py`): Generates new documents based on extracted structures and user requirements
3. **Knowledge Base Support** (`backend/agents/kb_support.py`): Enhances prompts with domain knowledge from the knowledge base

Agent wrappers support multiple LLM providers:
- OpenAI (`backend/agent_wrapper/openai.py`)
- Anthropic (`backend/agent_wrapper/anthropic.py`)
- Google Gemini (`backend/agent_wrapper/gemini.py`)

### Frontend Architecture
- **Authentication**: Managed via Supabase with admin approval workflow
- **Project Management**: Users create projects with artifacts (documents, URLs, text)
- **Document Generation**: Frontend calls backend API to generate documents using the AI agents
- **Role-Based Access**: Admin users can approve registrations and manage users

### Database Schema (Supabase)
Key tables:
- `projects`: User projects with metadata
- `user_roles`: Permission management (user/admin roles)
- `pending_user_approvals`: Registration approval queue
- `admin_activity_log`: Audit trail for admin actions

### API Integration
The frontend communicates with the backend API through endpoints:
- `/analyze-structure`: Extract document structure from uploaded files
- `/generate-document`: Generate new documents using AI agents
- `/list-example-docs`: List available example documents

### Security Features
- Row Level Security (RLS) policies on all database tables
- Admin approval required for new user registrations
- Secure file upload with validation
- API key management for multiple LLM providers

## Important Files to Understand

### Backend Core Logic
- `backend/api.py`: Main FastAPI server with all endpoints
- `backend/agents/document_generator.py`: Orchestrates the multi-agent document generation process
- `backend/utils.py`: Utility functions for PDF extraction and processing

### Frontend Key Components
- `frontend/src/lib/supabase.js`: Supabase client and project API functions
- `frontend/src/contexts/AuthContext.js`: Authentication state management
- `frontend/src/app/projects/[id]/page.js`: Main project management interface

### Configuration
- `backend/requirements.txt`: Python dependencies
- `frontend/package.json`: Node.js dependencies and scripts

## Standards Compliance

When making any changes to this codebase:
1. **ALWAYS** consult `PROJECT_STANDARDS.md` first
2. Follow the defined naming conventions (camelCase for JS, snake_case for DB)
3. Use consistent data flow patterns (see Data Flow Standards in PROJECT_STANDARDS.md)
4. Maintain type consistency across all layers
5. Handle errors according to the defined patterns
6. Document changes according to Documentation Standards

### Key Standards to Remember:
- **Data Fields**: Use consistent names throughout the pipeline (e.g., `sourceUrl` not `url` for external URLs)
- **Validation**: Validate at both client and server layers
- **Error Handling**: Use standardized error codes and response formats
- **Testing**: Write tests for new features before deployment
- **Documentation**: Include JSDoc comments for all public functions and components

# important-instruction-reminders
1. Always follow PROJECT_STANDARDS.md for all code changes
2. Maintain consistency in naming: camelCase for JS/TS, snake_case for database
3. Never skip validation or error handling
4. Do what has been asked; nothing more, nothing less
5. NEVER create files unless they're absolutely necessary for achieving your goal
6. ALWAYS prefer editing an existing file to creating a new one
7. NEVER proactively create documentation files (*.md) or README files unless explicitly requested