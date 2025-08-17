# Installation Fix for Dependency Conflicts

The system has dependency conflicts with other installed packages. Here's how to fix it:

## Option 1: Use Virtual Environment (Recommended)

```bash
# Create virtual environment
cd searchwizardv2local
python -m venv venv

# Activate it
source venv/bin/activate  # On macOS/Linux
# OR on Windows: venv\Scripts\activate

# Install dependencies
cd backend
pip install fastapi uvicorn python-multipart PyPDF2 python-dotenv openai anthropic

# Run the backend
python main.py
```

## Option 2: Force Install (if you want to keep existing packages)

```bash
cd searchwizardv2local/backend

# Install with force reinstall
pip install --force-reinstall fastapi uvicorn python-multipart

# Run
python main.py
```

## Option 3: Minimal Install (if still having issues)

```bash
# Just install what we absolutely need
pip install fastapi uvicorn python-multipart

# Edit main.py to remove anthropic/openai imports temporarily
# Use mock responses for testing the interface
```

## Set Your API Key

```bash
# Copy and edit the env file
cd searchwizardv2local
cp .env.example .env
# Edit .env file and add your ANTHROPIC_API_KEY or OPENAI_API_KEY
```

## Test It Works

```bash
# Backend (should show "Starting SearchWizard V2 Local backend...")
cd backend
python main.py

# Frontend (new terminal)
cd ../frontend
python -m http.server 8080

# Visit: http://localhost:8080
```

The virtual environment approach will avoid conflicts with your existing aider-chat and other packages.