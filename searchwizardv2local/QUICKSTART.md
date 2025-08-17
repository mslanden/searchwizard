# SearchWizard V2 Local - Quick Start

## Option A: Simple Demo (No Dependencies)

### 1. Start Backend (Zero setup!)
```bash
cd searchwizardv2local/backend
python simple_server.py
```

This uses only Python built-ins with mock AI responses for demonstration.

## Option B: Full Version (With Real AI)

### 1. Fix Dependencies
```bash
cd searchwizardv2local
python -m venv venv
source venv/bin/activate  # macOS/Linux
# OR: venv\Scripts\activate  # Windows

cd backend
pip install fastapi uvicorn python-multipart PyPDF2 python-dotenv openai anthropic
```

### 2. Set API Key
```bash
cd ..
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY or OPENAI_API_KEY
```

### 3. Start Backend
```bash
cd backend
python main.py
```

### Start Frontend
```bash
# In a new terminal
cd frontend
python -m http.server 8080
```

### Open Browser
Visit: http://localhost:8080

## 3. Use (1 minute)

1. **Upload Template**: Drag a PDF or text file
2. **Name Template**: Give it a descriptive name
3. **Create Template**: Click to analyze with AI
4. **Select Template**: Click on it in the grid
5. **Enter Requirements**: What you want in your new document
6. **Generate**: Click to create your document
7. **Download**: Get the HTML file

## Example Workflow

**Template**: Upload a job description PDF
**Requirements**: 
```
- Company: TechCorp Inc.
- Position: Senior Python Developer  
- Location: Remote
- Salary: $120k-150k
- Requirements: 5+ years Python, Django, PostgreSQL
```

**Result**: Professional job description following the template's structure and style.

## Why This Works Better

- **Simple**: 2 API calls total vs 10+ in complex version
- **Fast**: 30 seconds from upload to result
- **Intuitive**: Matches how people think about document creation
- **Reliable**: Fewer moving parts = fewer failure points
- **Maintainable**: 200 lines of code vs 2000+

## Architecture

- **Backend**: FastAPI with 2 endpoints (`/templates`, `/generate`)
- **Storage**: Local JSON files (easily replaceable with DB)
- **AI**: Single LLM call per operation
- **Frontend**: Vanilla HTML/JS (no framework complexity)

This demonstrates the core value without the complexity.