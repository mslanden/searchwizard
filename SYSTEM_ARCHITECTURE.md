# Search Wizard - System Architecture Diagram

## High-Level Architecture Overview

```mermaid
graph TB
    subgraph "Frontend (Next.js 15 + React 19)"
        UI[User Interface]
        Auth[Authentication Layer]
        API_CLIENT[API Client]
        STATE[State Management]
    end

    subgraph "Backend (Python FastAPI)"
        API[FastAPI Server]
        AGENTS[Multi-Agent System]
        PARSER[Document Parser]
        CACHE[Cache Service]
    end

    subgraph "Database & Storage (Supabase)"
        DB[(PostgreSQL)]
        STORAGE[File Storage]
        RLS[Row Level Security]
    end

    subgraph "External Services"
        CLAUDE[Claude 4 Sonnet]
        LLAMAPARSE[LlamaParse API]
        REDIS[(Redis Cache)]
    end

    UI --> Auth
    Auth --> API_CLIENT
    API_CLIENT --> API
    
    API --> AGENTS
    API --> PARSER
    API --> CACHE
    
    AGENTS --> CLAUDE
    PARSER --> LLAMAPARSE
    CACHE --> REDIS
    
    API --> DB
    API --> STORAGE
    DB --> RLS
```

## Detailed Data Flow

### 1. User Authentication & Project Management

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Supabase
    participant RLS

    User->>Frontend: Login/Register
    Frontend->>Supabase: Auth Request
    Supabase->>RLS: Check User Roles
    RLS-->>Supabase: Role Validation
    Supabase-->>Frontend: Auth Token + User Data
    Frontend-->>User: Dashboard with Projects
```

### 2. Golden Examples System

```mermaid
graph LR
    subgraph "Golden Examples Scope"
        USER_EXAMPLES["User's Own Examples"]
        GLOBAL_EXAMPLES["Global Templates"]
        COMBINED["Combined View"]
    end

    subgraph "RLS Policies"
        POLICY1["user_id = auth.uid()"]
        POLICY2["is_global = true"]
        OR_LOGIC["OR Logic"]
    end

    subgraph "Database Query"
        QUERY["SELECT * FROM golden_examples<br/>WHERE user_id = ? OR is_global = true"]
    end

    USER_EXAMPLES --> OR_LOGIC
    GLOBAL_EXAMPLES --> OR_LOGIC
    POLICY1 --> OR_LOGIC
    POLICY2 --> OR_LOGIC
    OR_LOGIC --> QUERY
    QUERY --> COMBINED
```

### 3. Document Generation Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Railway_API
    participant StructureAgent
    participant WriterAgent
    participant Claude4
    participant LlamaParse
    participant Supabase

    User->>Frontend: Upload Documents + Requirements
    Frontend->>Railway_API: POST /generate-document
    
    alt Document Parsing Needed
        Railway_API->>LlamaParse: Parse uploaded documents
        LlamaParse-->>Railway_API: Extracted content
    end
    
    Railway_API->>StructureAgent: Analyze document structure
    StructureAgent->>Claude4: Structure analysis prompt
    Claude4-->>StructureAgent: Document structure template
    StructureAgent-->>Railway_API: Structured template
    
    Railway_API->>WriterAgent: Generate document with template
    WriterAgent->>Claude4: Document generation prompt
    Claude4-->>WriterAgent: Generated HTML document
    WriterAgent-->>Railway_API: Final document
    
    Railway_API->>Supabase: Save document to storage
    Railway_API-->>Frontend: Document URL + metadata
    Frontend-->>User: Display generated document
```

## Component Architecture Details

### 1. Frontend Architecture (Next.js)

```mermaid
graph TB
    subgraph "Pages & Routing"
        DASHBOARD[Dashboard /]
        PROJECTS[Projects /projects/[id]]
        AUTH_PAGES[Auth Pages /login /register]
        ADMIN[Admin /admin]
    end

    subgraph "Components"
        PROJECT_CARD[ProjectCard]
        ARTIFACT_UPLOAD[ArtifactUpload]
        DOCUMENT_GEN[DocumentGeneration]
        GOLDEN_POPUP[GoldenExamplesPopup]
    end

    subgraph "State Management"
        AUTH_CONTEXT[AuthContext]
        ERROR_CONTEXT[ErrorContext]
        THEME_CONTEXT[ThemeContext]
    end

    subgraph "API Layer"
        PROJECT_API[projectApi.js]
        STORAGE_API[storageApi.js]
        SUPABASE_CLIENT[supabase.js]
    end

    DASHBOARD --> PROJECT_CARD
    PROJECTS --> ARTIFACT_UPLOAD
    PROJECTS --> DOCUMENT_GEN
    PROJECTS --> GOLDEN_POPUP
    
    PROJECT_CARD --> AUTH_CONTEXT
    ARTIFACT_UPLOAD --> PROJECT_API
    DOCUMENT_GEN --> STORAGE_API
    GOLDEN_POPUP --> SUPABASE_CLIENT
```

### 2. Backend Architecture (FastAPI)

```mermaid
graph TB
    subgraph "API Endpoints"
        HEALTH[/health]
        GENERATE[/generate-document]
        ANALYZE[/analyze-structure]
        PROCESS[/process-content]
    end

    subgraph "Multi-Agent System"
        STRUCTURE[StructureAgent]
        WRITER[WriterAgent]
        KB_SUPPORT[KB Support]
    end

    subgraph "Services"
        LLAMAPARSE_CLIENT[LlamaParseClient]
        DOC_PARSER[DocumentParserService]
        CACHE_SERVICE[CacheService]
    end

    subgraph "Agent Wrappers"
        ANTHROPIC[AnthropicAgent]
        OPENAI[OpenAIAgent]
        GEMINI[GeminiAgent]
    end

    GENERATE --> STRUCTURE
    GENERATE --> WRITER
    ANALYZE --> STRUCTURE
    PROCESS --> DOC_PARSER

    STRUCTURE --> ANTHROPIC
    WRITER --> ANTHROPIC
    DOC_PARSER --> LLAMAPARSE_CLIENT
    LLAMAPARSE_CLIENT --> CACHE_SERVICE
```

### 3. Database Schema (Supabase)

```mermaid
erDiagram
    users ||--o{ projects : owns
    users ||--o{ user_roles : has
    users ||--o{ golden_examples : creates
    projects ||--o{ artifacts : contains
    projects ||--o{ project_outputs : generates
    
    users {
        uuid id PK
        string email
        timestamp created_at
    }
    
    user_roles {
        uuid id PK
        uuid user_id FK
        string role
        boolean is_active
    }
    
    projects {
        uuid id PK
        uuid user_id FK
        string title
        string client
        date date
        integer artifact_count
        timestamp created_at
    }
    
    artifacts {
        uuid id PK
        uuid project_id FK
        uuid user_id FK
        string name
        string artifact_type
        string input_type
        text processed_content
        string file_url
        string file_path
    }
    
    golden_examples {
        uuid id PK
        uuid user_id FK
        string name
        string description
        string example_type
        boolean is_global
        string file_url
        jsonb structure_json
        timestamp date_added
    }
    
    project_outputs {
        uuid id PK
        uuid project_id FK
        string name
        string output_type
        string file_url
        timestamp created_at
    }
```

## Security Architecture

### Row Level Security (RLS) Policies

```mermaid
graph TB
    subgraph "RLS Policy Flow"
        REQUEST["Incoming Request"]
        AUTH_CHECK["auth.uid() Check"]
        POLICY_EVAL["Policy Evaluation"]
        DATA_ACCESS["Data Access Granted/Denied"]
    end

    subgraph "Golden Examples Policies"
        USER_POLICY["user_id = auth.uid()"]
        GLOBAL_POLICY["is_global = true"]
        ADMIN_POLICY["is_admin_user(auth.uid())"]
    end

    REQUEST --> AUTH_CHECK
    AUTH_CHECK --> POLICY_EVAL
    POLICY_EVAL --> USER_POLICY
    POLICY_EVAL --> GLOBAL_POLICY
    POLICY_EVAL --> ADMIN_POLICY
    USER_POLICY --> DATA_ACCESS
    GLOBAL_POLICY --> DATA_ACCESS
    ADMIN_POLICY --> DATA_ACCESS
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Production Environment"
        VERCEL[Vercel Frontend]
        RAILWAY[Railway Backend]
        SUPABASE[Supabase Database]
    end

    subgraph "Development Environment"
        LOCAL_FRONTEND[localhost:3000]
        LOCAL_BACKEND[localhost:8000]
        LOCAL_DB[Local Supabase]
    end

    subgraph "External APIs"
        ANTHROPIC_API[Anthropic Claude 4]
        LLAMAPARSE_API[LlamaParse]
        REDIS_CLOUD[Redis Cloud]
    end

    VERCEL --> RAILWAY
    RAILWAY --> SUPABASE
    RAILWAY --> ANTHROPIC_API
    RAILWAY --> LLAMAPARSE_API
    RAILWAY --> REDIS_CLOUD

    LOCAL_FRONTEND --> LOCAL_BACKEND
    LOCAL_BACKEND --> LOCAL_DB
```

## Document Processing Pipeline

```mermaid
graph TB
    subgraph "Input Processing"
        UPLOAD[File Upload]
        URL_INPUT[URL Input]
        TEXT_INPUT[Text Input]
    end

    subgraph "Intelligence Router"
        COMPLEXITY[Complexity Analysis]
        PARSER_SELECTION[Parser Selection]
    end

    subgraph "Processing Options"
        LLAMAPARSE[LlamaParse Premium]
        PYMUPDF[PyMuPDF Basic]
        LEGACY[Legacy Parser]
    end

    subgraph "Caching Layer"
        REDIS_CACHE[Redis Cache]
        MEMORY_CACHE[Memory Fallback]
        FILE_HASH[File Hash Key]
    end

    subgraph "Output"
        PARSED_CONTENT[Parsed Content]
        METADATA[Processing Metadata]
        QUALITY_SCORE[Quality Score]
    end

    UPLOAD --> COMPLEXITY
    URL_INPUT --> COMPLEXITY
    TEXT_INPUT --> COMPLEXITY

    COMPLEXITY --> PARSER_SELECTION
    PARSER_SELECTION --> LLAMAPARSE
    PARSER_SELECTION --> PYMUPDF
    PARSER_SELECTION --> LEGACY

    LLAMAPARSE --> FILE_HASH
    PYMUPDF --> FILE_HASH
    LEGACY --> FILE_HASH

    FILE_HASH --> REDIS_CACHE
    REDIS_CACHE --> MEMORY_CACHE

    REDIS_CACHE --> PARSED_CONTENT
    MEMORY_CACHE --> PARSED_CONTENT
    PARSED_CONTENT --> METADATA
    METADATA --> QUALITY_SCORE
```

## Key Features Summary

### ✅ Multi-Agent AI System
- **StructureAgent**: Analyzes documents to extract structural patterns
- **WriterAgent**: Generates new documents using Claude 4 Sonnet
- **Knowledge Base Support**: Enhances prompts with domain knowledge

### ✅ Advanced Document Processing
- **LlamaParse Integration**: 95%+ accuracy OCR and table extraction
- **Intelligent Routing**: Automatic parser selection based on complexity
- **Caching System**: Redis-based with memory fallback for performance

### ✅ User-Scoped Golden Examples
- **Personal Templates**: Users can create and manage their own templates
- **Global Access**: Templates are accessible across all user's projects
- **Security**: RLS policies ensure users only see their own + global templates

### ✅ Production-Ready Deployment
- **Frontend**: Vercel (Next.js 15 + React 19)
- **Backend**: Railway (Python FastAPI + Claude 4)
- **Database**: Supabase (PostgreSQL + Storage)
- **Caching**: Redis for optimal performance

### ✅ Security & Authentication
- **Row Level Security**: Database-level access control
- **Admin System**: Role-based permissions and user management
- **Secure File Upload**: Validated uploads with proper storage