#!/usr/bin/env python3
"""
SearchWizard V2 Local - Simplified Document Generator
Simple FastAPI backend with 2 endpoints: upload template, generate document
"""

import os
import json
import uuid
import base64
import io
from datetime import datetime
from typing import Optional
from pathlib import Path

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Simple AI client - try Anthropic first, then OpenAI
def get_ai_client():
    """Get available AI client"""
    anthropic_key = os.getenv("ANTHROPIC_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    
    if anthropic_key:
        import anthropic
        return anthropic.Anthropic(api_key=anthropic_key), "anthropic"
    elif openai_key:
        import openai
        return openai.OpenAI(api_key=openai_key), "openai"
    else:
        raise Exception("No AI API key found. Set ANTHROPIC_API_KEY or OPENAI_API_KEY")

# Initialize AI client
try:
    ai_client, ai_provider = get_ai_client()
    print(f"Initialized {ai_provider} client")
except Exception as e:
    print(f"Warning: {e}")
    ai_client, ai_provider = None, None

app = FastAPI(title="SearchWizard V2 Local", version="2.0.0")

# Enable CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Data storage paths
DATA_DIR = Path("../data")
TEMPLATES_FILE = DATA_DIR / "templates.json"
DOCUMENTS_FILE = DATA_DIR / "documents.json"
KNOWLEDGE_BASE_FILE = DATA_DIR / "knowledge_base.json"
UPLOADS_DIR = DATA_DIR / "uploads"

# Ensure data directory exists
DATA_DIR.mkdir(exist_ok=True)
UPLOADS_DIR.mkdir(exist_ok=True)

def load_json_data(file_path: Path) -> list:
    """Load JSON data from file, return empty list if file doesn't exist"""
    if file_path.exists():
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return []

def save_json_data(file_path: Path, data: list):
    """Save JSON data to file"""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

def convert_pdf_to_images(file_content: bytes) -> list:
    """Convert PDF to images for visual analysis"""
    try:
        from pdf2image import convert_from_bytes
        
        # Convert PDF to images
        images = convert_from_bytes(file_content, dpi=150, first_page=1, last_page=3)  # Only first 3 pages
        
        image_data = []
        for i, image in enumerate(images):
            # Convert to base64 for Claude vision
            img_buffer = io.BytesIO()
            image.save(img_buffer, format='PNG')
            img_base64 = base64.b64encode(img_buffer.getvalue()).decode()
            
            image_data.append({
                "page": i + 1,
                "base64": img_base64,
                "size": image.size
            })
            
        print(f"Converted PDF to {len(image_data)} images for visual analysis")
        return image_data
        
    except ImportError:
        print("pdf2image not available, skipping visual analysis")
        print("Install with: pip install pdf2image")
        return []
    except Exception as e:
        print(f"Error converting PDF to images: {str(e)}")
        print("Note: Visual analysis requires poppler. Install with: brew install poppler")
        return []

def analyze_document_style_from_text(content: str) -> dict:
    """Analyze document style clues from text content when visual analysis isn't available"""
    style_clues = {
        "color_scheme": {
            "background": "white",
            "text": "black", 
            "accents": "blue"
        },
        "typography": {
            "headings": "bold, larger fonts",
            "body": "standard text",
            "emphasis": "bold for important items"
        },
        "layout": {
            "structure": "standard document layout",
            "spacing": "normal margins and padding",
            "alignment": "left-aligned"
        },
        "visual_elements": {
            "borders": "minimal borders",
            "shapes": "simple boxes for organization",
            "emphasis": "bold text for highlights"
        },
        "overall_style": "Professional business document",
        "css_guidelines": "Clean, minimal design with good typography and spacing"
    }
    
    # Look for clues in the content
    if "estimate" in content.lower() or "cost" in content.lower() or "bill" in content.lower():
        style_clues["overall_style"] = "Professional invoice/estimate document"
        style_clues["color_scheme"]["accents"] = "green or blue for financial emphasis"
        style_clues["visual_elements"]["emphasis"] = "tables for cost breakdown, bold for totals"
    
    if "summary" in content.lower() or "total" in content.lower():
        style_clues["layout"]["structure"] = "sections with clear headings and summary tables"
    
    return style_clues

def analyze_visual_styling(images: list) -> dict:
    """Use Claude vision to analyze document visual styling"""
    if not images or not ai_client or ai_provider != "anthropic":
        return {"visual_analysis": "Visual analysis not available"}
    
    try:
        # Use the first page for visual analysis
        first_image = images[0]
        
        visual_prompt = """
Analyze this document's visual design and styling. Focus on:

1. **Color Scheme**: Background colors, text colors, accent colors
2. **Typography**: Font styles, sizes, headings vs body text
3. **Layout**: Margins, spacing, alignment, columns
4. **Visual Elements**: Borders, lines, shading, boxes
5. **Professional Style**: Overall aesthetic (modern, traditional, corporate, etc.)
6. **Branding Elements**: Any logos, special formatting, or distinctive design choices

Provide a detailed analysis that could be used to recreate the same visual style in HTML/CSS.

Respond with a JSON object:
{
  "color_scheme": {
    "background": "description of background colors",
    "text": "main text colors",
    "accents": "accent or highlight colors"
  },
  "typography": {
    "headings": "description of heading styles",
    "body": "description of body text",
    "emphasis": "bold, italic, or special text styling"
  },
  "layout": {
    "structure": "overall layout description",
    "spacing": "margins and padding patterns",
    "alignment": "text and element alignment"
  },
  "visual_elements": {
    "borders": "any borders or lines",
    "shapes": "boxes, backgrounds, or geometric elements",
    "emphasis": "how important items are highlighted"
  },
  "overall_style": "Professional aesthetic description",
  "css_guidelines": "Specific CSS recommendations to recreate this style"
}
"""

        # Make vision API call
        response = ai_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": visual_prompt
                        },
                        {
                            "type": "image",
                            "source": {
                                "type": "base64",
                                "media_type": "image/png",
                                "data": first_image["base64"]
                            }
                        }
                    ]
                }
            ]
        )
        
        visual_analysis = response.content[0].text
        print(f"Visual analysis completed: {visual_analysis[:200]}...")
        
        # Try to parse as JSON
        try:
            return json.loads(visual_analysis)
        except json.JSONDecodeError:
            return {"visual_analysis": visual_analysis}
            
    except Exception as e:
        print(f"Error in visual analysis: {str(e)}")
        return {"visual_analysis": f"Visual analysis failed: {str(e)}"}

def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """Extract text from uploaded file with better PDF handling"""
    if filename.lower().endswith('.pdf'):
        try:
            import PyPDF2
            import io
            
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            text_parts = []
            
            for page_num, page in enumerate(pdf_reader.pages):
                page_text = page.extract_text()
                if page_text.strip():
                    text_parts.append(f"--- Page {page_num + 1} ---\n{page_text}")
            
            if not text_parts:
                raise HTTPException(status_code=400, detail="No readable text found in PDF")
            
            full_text = "\n\n".join(text_parts)
            
            # Log extracted content length for debugging
            print(f"Extracted {len(full_text)} characters from PDF")
            print(f"First 500 chars: {full_text[:500]}...")
            
            return full_text.strip()
            
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error reading PDF: {str(e)}")
    else:
        # Assume text file
        try:
            content = file_content.decode('utf-8').strip()
            print(f"Extracted {len(content)} characters from text file")
            return content
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail="Unable to decode file as text")

def call_ai(prompt: str) -> str:
    """Make AI call with error handling"""
    if not ai_client:
        raise HTTPException(status_code=500, detail="No AI client available")
    
    try:
        if ai_provider == "anthropic":
            response = ai_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=4000,
                messages=[{"role": "user", "content": prompt}]
            )
            return response.content[0].text
        elif ai_provider == "openai":
            response = ai_client.chat.completions.create(
                model="gpt-4",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=4000
            )
            return response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI call failed: {str(e)}")

# API Models
class GenerateRequest(BaseModel):
    template_id: str
    requirements: str

class KnowledgeBaseItem(BaseModel):
    name: str
    content: str
    type: str  # "text", "company_info", "image", "document"
    category: str = "general"

class CompanyProfile(BaseModel):
    company_name: str
    address: str = ""
    phone: str = ""
    email: str = ""
    website: str = ""
    description: str = ""

def convert_html_to_pdf(html_content: str) -> bytes:
    """Convert HTML to PDF using weasyprint"""
    try:
        import weasyprint
        
        # Create PDF from HTML
        pdf_bytes = weasyprint.HTML(string=html_content).write_pdf()
        return pdf_bytes
        
    except ImportError:
        raise HTTPException(status_code=500, detail="WeasyPrint not available. Install with: pip install weasyprint")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF conversion failed: {str(e)}")

@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "ok", "message": "SearchWizard V2 Local is running"}

@app.get("/templates")
async def list_templates():
    """Get all available templates"""
    templates = load_json_data(TEMPLATES_FILE)
    return {"templates": templates}

@app.delete("/templates/{template_id}")
async def delete_template(template_id: str):
    """Delete a template by ID"""
    try:
        templates = load_json_data(TEMPLATES_FILE)
        
        # Find the template to delete
        template_to_delete = None
        remaining_templates = []
        
        for template in templates:
            if template["id"] == template_id:
                template_to_delete = template
            else:
                remaining_templates.append(template)
        
        if not template_to_delete:
            raise HTTPException(status_code=404, detail="Template not found")
        
        # Save the updated templates list
        save_json_data(TEMPLATES_FILE, remaining_templates)
        
        print(f"Deleted template: {template_to_delete['name']} (ID: {template_id})")
        
        return {
            "message": f"Template '{template_to_delete['name']}' deleted successfully",
            "deleted_template": {
                "id": template_to_delete["id"],
                "name": template_to_delete["name"]
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Template deletion failed: {str(e)}")

@app.post("/templates")
async def create_template(
    file: UploadFile = File(...),
    name: str = Form(...)
):
    """
    Upload a document and create a reusable template
    Single AI call analyzes structure and creates template prompt
    """
    try:
        # Read file content
        file_content = await file.read()
        
        # Extract text from file
        original_content = extract_text_from_file(file_content, file.filename)
        
        if not original_content.strip():
            raise HTTPException(status_code=400, detail="No text content found in file")
        
        # Convert PDF to images for visual analysis
        visual_data = {}
        if file.filename.lower().endswith('.pdf'):
            images = convert_pdf_to_images(file_content)
            if images:
                visual_data = analyze_visual_styling(images)
                print(f"Visual analysis result: {json.dumps(visual_data, indent=2)[:500]}...")
            else:
                # Fallback: analyze style from text content
                visual_data = analyze_document_style_from_text(original_content)
                print("Using text-based style analysis as fallback")
        else:
            # For non-PDF files, analyze style from text content
            visual_data = analyze_document_style_from_text(original_content)
            print("Using text-based style analysis for non-PDF file")
        
        # Single AI call to analyze structure and create template prompt
        visual_section = ""
        if visual_data and visual_data != {"visual_analysis": "Visual analysis not available"}:
            visual_section = f"""

VISUAL STYLING ANALYSIS:
{json.dumps(visual_data, indent=2)}

This visual analysis shows the document's color scheme, typography, layout, and styling elements that must be preserved in the template.
"""

        analysis_prompt = f"""
Analyze this EXACT document and create a precise template that captures its specific structure, formatting, and visual style.

DOCUMENT TEXT CONTENT:
{original_content}
{visual_section}

Your task is to create a template that will generate documents that closely match this EXACT document's:
1. Precise section structure and headings
2. Specific formatting patterns (tables, lists, layout)
3. Writing style and tone
4. Content organization and flow
5. Visual elements and styling (colors, typography, layout)

Respond with a JSON object containing:
{{
  "document_type": "Specific type based on this actual document",
  "structure_analysis": "Detailed analysis of this document's exact structure and sections",
  "style_notes": "Specific writing style and formatting observations from this document",
  "visual_styling": "Visual design elements including colors, typography, and layout from the visual analysis",
  "template_prompt": "A very detailed prompt that will recreate documents with the same structure, style, visual design, and format as this specific document"
}}

The template_prompt should be extremely specific and include:
- Exact section names and order from this document
- Specific formatting patterns (tables, headers, lists, etc.)
- The precise writing style and tone used
- Visual styling (background colors, text colors, typography, spacing)
- Layout and visual structure
- Any unique elements from this specific document

CRITICAL: The template must capture BOTH the content structure AND visual styling of THIS specific document.
"""

        ai_response = call_ai(analysis_prompt)
        
        print(f"AI Analysis Response: {ai_response[:500]}...")
        
        # Try to parse AI response as JSON
        try:
            template_data = json.loads(ai_response)
            print(f"Successfully parsed template data: {template_data.get('document_type', 'Unknown')}")
        except json.JSONDecodeError:
            print("Failed to parse JSON response, using fallback")
            # Fallback: create basic template data
            template_data = {
                "document_type": "Document Template",
                "structure_analysis": f"Document with {len(original_content)} characters of content",
                "style_notes": "Professional formatting",
                "visual_styling": json.dumps(visual_data) if visual_data else "No visual analysis available",
                "template_prompt": f"Create a document that follows the exact structure and style of this template:\n\n{original_content[:2000]}...\n\nMaintain the same headings, sections, formatting patterns, and overall layout. Apply visual styling: {json.dumps(visual_data) if visual_data else 'Standard professional styling'}."
            }
        
        # Create template record
        template = {
            "id": str(uuid.uuid4()),
            "name": name,
            "filename": file.filename,
            "document_type": template_data.get("document_type", "Unknown"),
            "original_content": original_content,
            "structure_analysis": template_data.get("structure_analysis", ""),
            "style_notes": template_data.get("style_notes", ""),
            "visual_styling": template_data.get("visual_styling", ""),
            "template_prompt": template_data.get("template_prompt", ""),
            "visual_data": visual_data,  # Store the full visual analysis
            "created_at": datetime.now().isoformat(),
            "usage_count": 0
        }
        
        # Save to storage
        templates = load_json_data(TEMPLATES_FILE)
        templates.append(template)
        save_json_data(TEMPLATES_FILE, templates)
        
        return {
            "template_id": template["id"],
            "name": template["name"],
            "document_type": template["document_type"],
            "message": "Template created successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Template creation failed: {str(e)}")

@app.post("/generate")
async def generate_document(request: GenerateRequest):
    """
    Generate a new document using a template and user requirements
    Single AI call combines template with requirements and knowledge base data
    """
    try:
        # Load template
        templates = load_json_data(TEMPLATES_FILE)
        template = next((t for t in templates if t["id"] == request.template_id), None)
        
        if not template:
            raise HTTPException(status_code=404, detail="Template not found")
        
        # Load knowledge base data
        kb_data = load_json_data(KNOWLEDGE_BASE_FILE)
        
        # Organize knowledge base data
        company_profile = None
        kb_text_items = []
        kb_files = []
        
        for item in kb_data:
            if item.get("type") == "company_profile":
                company_profile = item.get("content", {})
            elif item.get("type") in ["text", "contact", "terms", "description"]:
                kb_text_items.append(item)
            elif item.get("type") in ["image", "document"]:
                kb_files.append(item)
        
        # Build knowledge base context
        kb_context = ""
        
        if company_profile:
            kb_context += f"""
COMPANY INFORMATION:
Company Name: {company_profile.get('company_name', '')}
Address: {company_profile.get('address', '')}
Phone: {company_profile.get('phone', '')}
Email: {company_profile.get('email', '')}
Website: {company_profile.get('website', '')}
Description: {company_profile.get('description', '')}
"""
        
        if kb_text_items:
            kb_context += "\nAVAILABLE TEXT SNIPPETS:\n"
            for item in kb_text_items:
                kb_context += f"- {item['name']} ({item['type']}): {item['content']}\n"
        
        if kb_files:
            kb_context += "\nAVAILABLE FILES:\n"
            for item in kb_files:
                file_url = f"http://localhost:8000/knowledge-base/files/{item.get('stored_filename', '')}"
                kb_context += f"- {item['name']} ({item['type']}): {item.get('description', 'No description')} | URL: {file_url}\n"
        
        # Single AI call to generate document
        generation_prompt = f"""
You must create a document that EXACTLY follows this template structure and style:

TEMPLATE INSTRUCTIONS:
{template['template_prompt']}

ORIGINAL DOCUMENT ANALYSIS:
Document Type: {template.get('document_type', '')}
Structure: {template.get('structure_analysis', '')}
Style Notes: {template.get('style_notes', '')}
Visual Styling: {template.get('visual_styling', '')}

VISUAL DESIGN REQUIREMENTS:
{json.dumps(template.get('visual_data', {}), indent=2) if template.get('visual_data') else 'Apply professional styling'}

{kb_context}

USER REQUIREMENTS FOR NEW DOCUMENT:
{request.requirements}

CRITICAL INSTRUCTIONS:
1. Follow the EXACT structure and sections from the original template
2. Use the SAME formatting patterns (tables, headers, lists, etc.)
3. Maintain the SAME writing style and tone
4. Apply the EXACT visual styling from the visual analysis:
   - Use the same color scheme (background, text, accent colors)
   - Match the typography (font styles, sizes, hierarchy)
   - Replicate the layout and spacing patterns
   - Include any visual elements (borders, shapes, emphasis)
5. **AUTOMATICALLY INCLUDE RELEVANT KNOWLEDGE BASE DATA**:
   - Use company information (name, address, phone, email) wherever appropriate
   - Include relevant text snippets that match the document type
   - Reference available files/images when relevant (use the provided URLs)
   - DO NOT ask the user for information that's available in the knowledge base
6. Replace content with user requirements while keeping structure AND styling identical
7. Generate a complete HTML document optimized for PDF printing with:
   - Proper page sizing (8.5" x 11" or A4)
   - Page break controls for multi-page documents
   - Print-optimized CSS (@media print rules)
   - Headers and footers with page numbers
   - Margins suitable for printing
8. Include proper HTML structure (DOCTYPE, html, head, body)

IMPORTANT FOR PDF GENERATION:
- Use CSS @page rules for page setup
- Add page-break-before and page-break-after where appropriate
- Include print-specific styling
- Ensure content fits properly on standard paper sizes
- Add headers/footers that repeat on each page

KNOWLEDGE BASE INTEGRATION EXAMPLES:
- If generating an invoice/estimate, automatically include company name, address, and contact info in the header
- If generating a proposal, include company description and website
- For any business document, use the company phone/email for contact sections
- Include relevant logos using the provided file URLs where appropriate

The result should be a print-ready document that looks VISUALLY identical to the original and can be converted to PDF.

Return ONLY the complete HTML document with embedded print-optimized CSS styling, no explanations or additional text.
"""

        print(f"Generating document using template: {template['name']}")
        print(f"Template type: {template.get('document_type', 'Unknown')}")
        print(f"User requirements: {request.requirements[:200]}...")
        
        generated_content = call_ai(generation_prompt)
        
        print(f"Generated document length: {len(generated_content)} characters")
        print(f"Generated content preview: {generated_content[:300]}...")
        
        # Create document record
        document = {
            "id": str(uuid.uuid4()),
            "template_id": request.template_id,
            "template_name": template["name"],
            "requirements": request.requirements,
            "generated_content": generated_content,
            "created_at": datetime.now().isoformat()
        }
        
        # Save document
        documents = load_json_data(DOCUMENTS_FILE)
        documents.append(document)
        save_json_data(DOCUMENTS_FILE, documents)
        
        # Update template usage count
        for t in templates:
            if t["id"] == request.template_id:
                t["usage_count"] = t.get("usage_count", 0) + 1
                break
        save_json_data(TEMPLATES_FILE, templates)
        
        return {
            "document_id": document["id"],
            "content": generated_content,
            "message": "Document generated successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Document generation failed: {str(e)}")

@app.get("/documents")
async def list_documents():
    """Get all generated documents"""
    documents = load_json_data(DOCUMENTS_FILE)
    # Return metadata only, not full content
    return {
        "documents": [
            {
                "id": doc["id"],
                "template_name": doc.get("template_name", "Unknown"),
                "requirements": doc["requirements"][:100] + "..." if len(doc["requirements"]) > 100 else doc["requirements"],
                "created_at": doc["created_at"]
            }
            for doc in documents
        ]
    }

@app.get("/documents/{document_id}")
async def get_document(document_id: str):
    """Get full document content"""
    documents = load_json_data(DOCUMENTS_FILE)
    document = next((d for d in documents if d["id"] == document_id), None)
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found")
    
    return document

@app.get("/documents/{document_id}/pdf")
async def download_document_as_pdf(document_id: str):
    """Convert a document to PDF and download it"""
    try:
        # Get the document
        documents = load_json_data(DOCUMENTS_FILE)
        document = next((d for d in documents if d["id"] == document_id), None)
        
        if not document:
            raise HTTPException(status_code=404, detail="Document not found")
        
        # Convert HTML to PDF
        html_content = document["generated_content"]
        pdf_bytes = convert_html_to_pdf(html_content)
        
        # Generate filename
        template_name = document.get("template_name", "document")
        safe_name = "".join(c for c in template_name if c.isalnum() or c in (' ', '-', '_')).rstrip()
        filename = f"{safe_name}_{document_id[:8]}.pdf"
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

@app.post("/generate-pdf")
async def generate_document_as_pdf(request: GenerateRequest):
    """Generate a document and return it directly as PDF with knowledge base integration"""
    try:
        # First generate the HTML document (already includes knowledge base data)
        html_response = await generate_document(request)
        html_content = html_response["content"]
        
        # Convert to PDF
        pdf_bytes = convert_html_to_pdf(html_content)
        
        # Get template info for filename
        templates = load_json_data(TEMPLATES_FILE)
        template = next((t for t in templates if t["id"] == request.template_id), None)
        template_name = template["name"] if template else "document"
        
        safe_name = "".join(c for c in template_name if c.isalnum() or c in (' ', '-', '_')).rstrip()
        filename = f"{safe_name}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename={filename}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {str(e)}")

# Knowledge Base Endpoints
@app.get("/knowledge-base")
async def get_knowledge_base():
    """Get all knowledge base items"""
    kb_data = load_json_data(KNOWLEDGE_BASE_FILE)
    return {"knowledge_base": kb_data}

@app.post("/knowledge-base/company-profile")
async def save_company_profile(profile: CompanyProfile):
    """Save or update company profile"""
    try:
        kb_data = load_json_data(KNOWLEDGE_BASE_FILE)
        
        # Remove existing company profile
        kb_data = [item for item in kb_data if item.get("type") != "company_profile"]
        
        # Add new company profile
        company_item = {
            "id": str(uuid.uuid4()),
            "name": "Company Profile",
            "content": profile.dict(),
            "type": "company_profile",
            "category": "company",
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        kb_data.append(company_item)
        save_json_data(KNOWLEDGE_BASE_FILE, kb_data)
        
        return {"message": "Company profile saved successfully", "profile": company_item}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to save company profile: {str(e)}")

@app.post("/knowledge-base/upload")
async def upload_knowledge_base_file(
    file: UploadFile = File(...),
    name: str = Form(...),
    category: str = Form("general"),
    description: str = Form("")
):
    """Upload a file (logo, image, document) to knowledge base"""
    try:
        # Generate unique filename
        file_extension = file.filename.split('.')[-1] if '.' in file.filename else ''
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = UPLOADS_DIR / unique_filename
        
        # Save file
        file_content = await file.read()
        with open(file_path, 'wb') as f:
            f.write(file_content)
        
        # Determine file type
        file_type = "image" if file.content_type and file.content_type.startswith('image/') else "document"
        
        # Create knowledge base entry
        kb_item = {
            "id": str(uuid.uuid4()),
            "name": name,
            "original_filename": file.filename,
            "stored_filename": unique_filename,
            "file_path": str(file_path),
            "content_type": file.content_type,
            "type": file_type,
            "category": category,
            "description": description,
            "file_size": len(file_content),
            "created_at": datetime.now().isoformat()
        }
        
        # Add to knowledge base
        kb_data = load_json_data(KNOWLEDGE_BASE_FILE)
        kb_data.append(kb_item)
        save_json_data(KNOWLEDGE_BASE_FILE, kb_data)
        
        return {"message": f"File '{name}' uploaded successfully", "item": kb_item}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File upload failed: {str(e)}")

@app.post("/knowledge-base/text")
async def add_knowledge_base_text(item: KnowledgeBaseItem):
    """Add text-based knowledge base item"""
    try:
        kb_data = load_json_data(KNOWLEDGE_BASE_FILE)
        
        kb_item = {
            "id": str(uuid.uuid4()),
            "name": item.name,
            "content": item.content,
            "type": item.type,
            "category": item.category,
            "created_at": datetime.now().isoformat()
        }
        
        kb_data.append(kb_item)
        save_json_data(KNOWLEDGE_BASE_FILE, kb_data)
        
        return {"message": f"Knowledge base item '{item.name}' added successfully", "item": kb_item}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add knowledge base item: {str(e)}")

@app.delete("/knowledge-base/{item_id}")
async def delete_knowledge_base_item(item_id: str):
    """Delete a knowledge base item"""
    try:
        kb_data = load_json_data(KNOWLEDGE_BASE_FILE)
        
        # Find item to delete
        item_to_delete = None
        remaining_items = []
        
        for item in kb_data:
            if item["id"] == item_id:
                item_to_delete = item
                # Delete associated file if it exists
                if item.get("stored_filename"):
                    file_path = UPLOADS_DIR / item["stored_filename"]
                    if file_path.exists():
                        file_path.unlink()
            else:
                remaining_items.append(item)
        
        if not item_to_delete:
            raise HTTPException(status_code=404, detail="Knowledge base item not found")
        
        save_json_data(KNOWLEDGE_BASE_FILE, remaining_items)
        
        return {
            "message": f"Knowledge base item '{item_to_delete['name']}' deleted successfully",
            "deleted_item": {"id": item_to_delete["id"], "name": item_to_delete["name"]}
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Knowledge base item deletion failed: {str(e)}")

@app.get("/knowledge-base/files/{filename}")
async def get_knowledge_base_file(filename: str):
    """Serve uploaded files from knowledge base"""
    try:
        file_path = UPLOADS_DIR / filename
        if not file_path.exists():
            raise HTTPException(status_code=404, detail="File not found")
        
        # Get file info from knowledge base
        kb_data = load_json_data(KNOWLEDGE_BASE_FILE)
        file_info = next((item for item in kb_data if item.get("stored_filename") == filename), None)
        
        if not file_info:
            raise HTTPException(status_code=404, detail="File info not found")
        
        # Read and return file
        with open(file_path, 'rb') as f:
            file_content = f.read()
        
        return Response(
            content=file_content,
            media_type=file_info.get("content_type", "application/octet-stream"),
            headers={"Content-Disposition": f"inline; filename={file_info.get('original_filename', filename)}"}
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"File retrieval failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    print("Starting SearchWizard V2 Local backend...")
    print("Frontend should be served from: http://localhost:8080")
    print("API docs available at: http://localhost:8000/docs")
    print("PDF generation endpoints:")
    print("- GET /documents/{id}/pdf - Convert existing document to PDF")
    print("- POST /generate-pdf - Generate document directly as PDF")
    uvicorn.run(app, host="0.0.0.0", port=8000)