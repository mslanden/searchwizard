# SearchWizard V2 Local - Simplified Document Generator

A streamlined version demonstrating the simplified approach to AI document generation.

## Core Concept
"Smart Copy-Paste" - Upload a template document, provide requirements, get a new document in the same style.

## Architecture
- **Backend**: FastAPI with 2 simple endpoints
- **Frontend**: Basic HTML/JS interface  
- **Storage**: Local JSON files (no database needed for demo)
- **AI**: Single LLM call per operation

## Quick Start

### Backend
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### Frontend
```bash
cd frontend
python -m http.server 8080
```

Visit: http://localhost:8080

## Workflow
1. Upload template document (PDF/txt)
2. AI analyzes structure in one call
3. Enter requirements for new document
4. AI generates new document using template
5. Download result

## Why This Works
- Matches user mental model
- 10x simpler than multi-agent approach
- Faster development and debugging
- Better user experience