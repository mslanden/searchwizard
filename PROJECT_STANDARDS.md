# Search Wizard Project Standards

## Table of Contents
1. [Data Flow Standards](#data-flow-standards)
2. [Naming Conventions](#naming-conventions)
3. [API Standards](#api-standards)
4. [Type Definitions](#type-definitions)
5. [Component Architecture](#component-architecture)
6. [File Organization](#file-organization)
7. [Error Handling](#error-handling)
8. [Documentation Standards](#documentation-standards)
9. [Testing Standards](#testing-standards)
10. [Security Standards](#security-standards)

## Data Flow Standards

### Principle: Single Source of Truth
Data should flow unidirectionally with consistent property names throughout the pipeline.

### Data Pipeline
```
User Input → Component → Hook → API Layer → Backend → Database
                ↓                    ↓
            Validation          Transformation
```

### Field Naming Consistency

#### Frontend (JavaScript/TypeScript)
```javascript
{
  sourceUrl: string,      // URLs from external sources
  fileUrl: string,        // URLs to stored files
  textContent: string,    // Raw text content
  processedContent: string, // Processed/parsed content
  inputType: 'file' | 'url' | 'text',
  artifactType: string,
  fileName: string,
  fileSize: number,
  filePath: string
}
```

#### Database (PostgreSQL)
```sql
source_url         -- URLs from external sources
file_url           -- URLs to stored files  
text_content       -- Raw text content
processed_content  -- Processed/parsed content
input_type         -- 'file' | 'url' | 'text'
artifact_type      -- Category of artifact
file_name          -- Original file name
file_size          -- Size in bytes
file_path          -- Storage path
```

### Data Transformation Rules

1. **Frontend → API**: Transform at the API layer, not in components
2. **API → Database**: Use utility functions for camelCase ↔ snake_case
3. **Database → Frontend**: Transform at the API response level

Example transformation utility:
```javascript
// utils/transformers.js
export const toSnakeCase = (obj) => {
  // Implementation
};

export const toCamelCase = (obj) => {
  // Implementation
};
```

## Naming Conventions

### JavaScript/TypeScript Files

#### Variables and Functions
```javascript
// ✅ Good
const userId = '123';
const getUserById = (id) => {};
const isValidEmail = (email) => {};

// ❌ Bad
const user_id = '123';
const get_user_by_id = (id) => {};
const ValidEmail = (email) => {};
```

#### React Components
```javascript
// ✅ Good
const UserProfile = () => {};
const ArtifactUploadPopup = () => {};

// ❌ Bad
const userProfile = () => {};
const artifact_upload_popup = () => {};
```

#### Constants
```javascript
// ✅ Good
const MAX_FILE_SIZE = 50 * 1024 * 1024;
const API_ENDPOINTS = {
  USERS: '/api/users',
  PROJECTS: '/api/projects'
};

// ❌ Bad
const maxFileSize = 50 * 1024 * 1024;
const ApiEndpoints = {};
```

### File Names

```
// React Components
UserProfile.jsx
ArtifactUploadPopup.jsx

// Hooks
useArtifactUpload.js
useProjectData.js

// Utilities
validation.js
transformers.js

// API Modules
projectApi.js
artifactApi.js

// Styles
UserProfile.module.css
globals.css
```

## API Standards

### Request Structure

All API requests should follow this structure:

```javascript
{
  // Required
  action: 'create' | 'update' | 'delete' | 'fetch',
  resource: 'artifact' | 'project' | 'user',
  
  // Optional
  data: {},
  params: {},
  metadata: {
    timestamp: Date.now(),
    version: '1.0'
  }
}
```

### Response Structure

```javascript
// Success Response
{
  success: true,
  data: {},
  metadata: {
    timestamp: Date.now(),
    count: 1
  }
}

// Error Response
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'User-friendly error message',
    details: {}, // Optional debug info
    field: 'email' // For field-specific errors
  }
}
```

### Artifact Upload API Contract

```javascript
// Request
{
  projectId: string,
  artifactData: {
    name: string,
    description?: string,
    inputType: 'file' | 'url' | 'text',
    artifactType: 'company' | 'role' | 'process' | 'candidate',
    
    // Input-specific fields
    file?: File,           // For inputType: 'file'
    sourceUrl?: string,    // For inputType: 'url'
    textContent?: string,  // For inputType: 'text'
  }
}

// Response
{
  success: true,
  data: {
    id: string,
    name: string,
    fileUrl?: string,
    sourceUrl?: string,
    processedContent?: string,
    inputType: string,
    artifactType: string,
    createdAt: string
  }
}
```

## Type Definitions

### Central Type Definitions

All shared types should be defined in `types/` directory:

```typescript
// types/artifact.ts
export interface Artifact {
  id: string;
  name: string;
  description?: string;
  inputType: 'file' | 'url' | 'text';
  artifactType: 'company' | 'role' | 'process' | 'candidate';
  fileUrl?: string;
  sourceUrl?: string;
  textContent?: string;
  processedContent?: string;
  fileSize?: number;
  filePath?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArtifactUploadData {
  name: string;
  description?: string;
  inputType: 'file' | 'url' | 'text';
  artifactType: string;
  file?: File;
  sourceUrl?: string;
  textContent?: string;
}
```

### Validation Functions

```javascript
// utils/validation/artifact.js
export const validateArtifactUpload = (data) => {
  const errors = {};
  
  if (!data.name) errors.name = 'Name is required';
  
  switch (data.inputType) {
    case 'file':
      if (!data.file) errors.file = 'File is required';
      break;
    case 'url':
      if (!data.sourceUrl) errors.sourceUrl = 'URL is required';
      if (!isValidUrl(data.sourceUrl)) errors.sourceUrl = 'Invalid URL format';
      break;
    case 'text':
      if (!data.textContent) errors.textContent = 'Text content is required';
      break;
  }
  
  return errors;
};
```

## Component Architecture

### Component Structure

```
components/
├── common/           # Shared, reusable components
│   ├── Button.jsx
│   └── Modal.jsx
├── features/         # Feature-specific components
│   ├── artifacts/
│   │   ├── ArtifactList.jsx
│   │   └── ArtifactUpload.jsx
│   └── projects/
│       ├── ProjectCard.jsx
│       └── ProjectHeader.jsx
├── layouts/          # Layout components
│   ├── Header.jsx
│   └── Footer.jsx
└── popups/          # Modal/popup components
    └── ArtifactUploadPopup.jsx
```

### Hook Structure

```javascript
// Standard hook template
export default function useResourceName(initialData) {
  // State declarations
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Handler functions
  const handleAction = useCallback(() => {
    // Implementation
  }, [dependencies]);
  
  // Return consistent interface
  return {
    // State
    data,
    loading,
    error,
    
    // Actions
    handleAction,
    setData,
    
    // Computed values
    isValid: !error && data
  };
}
```

## File Organization

### Frontend Structure
```
frontend/
├── src/
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # External libraries and APIs
│   │   ├── api/         # API layer modules
│   │   └── supabase.js  # Supabase client
│   ├── types/           # TypeScript type definitions
│   ├── utils/           # Utility functions
│   │   ├── validation/  # Validation utilities
│   │   ├── transformers/ # Data transformation
│   │   └── helpers/     # General helpers
│   └── styles/          # Global styles
```

### Backend Structure
```
backend/
├── api.py               # Main FastAPI application
├── agents/              # AI agent modules
├── utils/               # Utility functions
├── models/              # Data models
└── config/              # Configuration
```

## Error Handling

### Error Categories

```javascript
// utils/errors.js
export const ErrorCodes = {
  // Validation Errors (400s)
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Authentication/Authorization (401/403)
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // Resource Errors (404)
  NOT_FOUND: 'NOT_FOUND',
  
  // Server Errors (500s)
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  EXTERNAL_SERVICE_ERROR: 'EXTERNAL_SERVICE_ERROR'
};
```

### Error Handling Pattern

```javascript
// API layer
try {
  const result = await someOperation();
  return { success: true, data: result };
} catch (error) {
  console.error(`[${new Date().toISOString()}] Error in someOperation:`, error);
  
  // Categorize error
  if (error.code === 'PGRST116') {
    throw new AppError(ErrorCodes.NOT_FOUND, 'Resource not found');
  }
  
  // Default error
  throw new AppError(ErrorCodes.INTERNAL_ERROR, 'An unexpected error occurred');
}
```

## Documentation Standards

### Component Documentation

```javascript
/**
 * ArtifactUploadPopup - Modal for uploading artifacts to a project
 * 
 * @component
 * @param {Object} props
 * @param {string} props.type - Type of artifact ('company' | 'role' | 'process' | 'candidate')
 * @param {Function} props.onClose - Callback when popup is closed
 * @param {Function} props.onUpload - Callback when upload is successful
 * 
 * @example
 * <ArtifactUploadPopup 
 *   type="company"
 *   onClose={() => setIsOpen(false)}
 *   onUpload={handleArtifactUpload}
 * />
 */
```

### Function Documentation

```javascript
/**
 * Validates and processes artifact upload data
 * 
 * @param {ArtifactUploadData} data - The artifact data to validate
 * @returns {Object} Validation result with errors object
 * @throws {ValidationError} When required fields are missing
 */
```

### API Documentation

```javascript
/**
 * POST /api/artifacts
 * Creates a new artifact in the system
 * 
 * Request Body:
 * {
 *   projectId: string,
 *   artifactData: ArtifactUploadData
 * }
 * 
 * Response:
 * 200: { success: true, data: Artifact }
 * 400: { success: false, error: ErrorObject }
 * 401: { success: false, error: 'Unauthorized' }
 */
```

## Testing Standards

### Test File Organization

```
__tests__/
├── unit/           # Unit tests
├── integration/    # Integration tests
├── e2e/           # End-to-end tests
└── fixtures/      # Test data and mocks
```

### Test Naming Convention

```javascript
describe('ArtifactUpload', () => {
  describe('validation', () => {
    it('should require a name field', () => {});
    it('should validate URL format for URL input type', () => {});
  });
  
  describe('file upload', () => {
    it('should upload file successfully', () => {});
    it('should handle upload errors gracefully', () => {});
  });
});
```

### Mock Data Pattern

```javascript
// __tests__/fixtures/artifacts.js
export const mockArtifact = {
  id: 'test-id-123',
  name: 'Test Artifact',
  inputType: 'file',
  artifactType: 'company',
  fileUrl: 'https://example.com/file.pdf'
};

export const createMockArtifact = (overrides = {}) => ({
  ...mockArtifact,
  ...overrides
});
```

## Security Standards

### Input Validation
- Always validate on both client and server
- Sanitize user input before storage
- Use parameterized queries for database operations

### File Upload Security
```javascript
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'text/plain',
  'text/markdown',
  'image/png',
  'image/jpeg',
  'audio/mpeg'
];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

const validateFile = (file) => {
  if (!ALLOWED_FILE_TYPES.includes(file.type)) {
    throw new Error('File type not allowed');
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size exceeds limit');
  }
};
```

### API Security
- Use authentication tokens for all API requests
- Implement rate limiting
- Log all API access for audit trails
- Never expose sensitive data in error messages

## Migration Guidelines

### Adding New Features
1. Define types in `types/` directory
2. Create API contract documentation
3. Implement with consistent naming
4. Add comprehensive error handling
5. Write tests before deployment

### Refactoring Existing Code
1. Identify inconsistencies with standards
2. Create migration plan
3. Update in phases:
   - Update types
   - Standardize naming
   - Add validation
   - Improve error handling
4. Test thoroughly
5. Update documentation

## Future Recommendations

### Short Term (1-3 months)
1. **Complete TypeScript Migration**: Convert remaining JS files to TS
2. **API Versioning**: Implement `/api/v1/` structure
3. **Centralized Error Handling**: Create error boundary components
4. **Automated Testing**: Set up CI/CD with test requirements

### Medium Term (3-6 months)
1. **Design System**: Create component library with Storybook
2. **Performance Monitoring**: Implement analytics and monitoring
3. **API Documentation**: Generate OpenAPI/Swagger docs
4. **State Management**: Evaluate need for Redux/Zustand

### Long Term (6+ months)
1. **Microservices Architecture**: Split backend into services
2. **GraphQL Migration**: Consider GraphQL for complex queries
3. **Internationalization**: Add multi-language support
4. **Accessibility Audit**: Ensure WCAG compliance

## Enforcement

### Code Review Checklist
- [ ] Follows naming conventions
- [ ] Includes proper TypeScript types
- [ ] Has error handling
- [ ] Includes documentation
- [ ] Passes all tests
- [ ] No console.logs in production code
- [ ] Consistent with existing patterns

### Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run test",
      "pre-push": "npm run build"
    }
  }
}
```

---

*Last Updated: January 2025*
*Version: 1.0.0*