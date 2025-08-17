#!/usr/bin/env python3
"""
API Server for Search Wizard

This FastAPI server exposes endpoints for document generation and other backend functionality.
"""

import os
import json
import sys
import datetime
import requests
import base64
import io
import anthropic
from typing import Optional, Dict, List, Any
import uuid
from fastapi import FastAPI, HTTPException, Body, File, UploadFile, Form, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from dotenv import load_dotenv
from pdf2image import convert_from_bytes
from supabase import create_client, Client

# Add the parent directory to sys.path to allow imports
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load environment variables for API keys
load_dotenv()

# Print environment variables for debugging
print("Environment variables loaded:")
print(f"PORT: {os.environ.get('PORT', 'Not set (will use default)')}")
print(f"NEXT_PUBLIC_SUPABASE_URL: {'Set' if os.environ.get('NEXT_PUBLIC_SUPABASE_URL') else 'Not set'}")
print(f"NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY: {'Set' if os.environ.get('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY') else 'Not set'}")
print(f"ANTHROPIC_API_KEY: {'Set' if os.environ.get('ANTHROPIC_API_KEY') else 'Not set'}")

# Import our utility functions
from utils import extract_text_from_pdf

# Initialize FastAPI app
app = FastAPI(title="Search Wizard API", 
              description="API for document generation and other backend functionality",
              version="1.0.0")

# Health check endpoint
@app.get("/health")
async def health_check():
    """Health check endpoint to verify the API is running"""
    return {"status": "ok", "message": "API is running"}

# Mount static files directory
app.mount("/static", StaticFiles(directory="static"), name="static")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://searchwizard.ai",
        "https://www.searchwizard.ai",
        "https://search-wizard-smoky.vercel.app",
        "http://localhost:3000",
        "http://localhost:3001"  # Alternative local port
    ],  # Allow production domain, Vercel preview, and local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Template creation endpoint (V2 approach)
@app.post("/api/templates")
async def create_template(
    file: UploadFile = File(...),
    name: str = Form(...),
    user_id: str = Form(...)
):
    """Create a new template using V2 approach with Claude Vision analysis"""
    try:
        import base64
        import io
        from pdf2image import convert_from_bytes
        import anthropic
        from supabase import create_client
        
        # Initialize Supabase
        supabase_url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
        supabase_key = os.environ.get('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY')
        if not supabase_url or not supabase_key:
            raise HTTPException(status_code=500, detail="Supabase configuration missing")
        
        supabase = create_client(supabase_url, supabase_key)
        
        # Read file content
        file_content = await file.read()
        
        # Extract text content
        print(f"File content type: {file.content_type}")
        print(f"File size: {len(file_content)} bytes")
        
        original_content = ""
        if file.content_type == "application/pdf":
            print("Extracting PDF content...")
            original_content = extract_text_from_pdf(file_content)
            print(f"PDF extraction result length: {len(original_content) if original_content else 0}")
        else:
            # For text files
            print("Decoding text file...")
            try:
                original_content = file_content.decode('utf-8')
                print(f"Text decode result length: {len(original_content)}")
            except Exception as e:
                print(f"Text decoding failed: {str(e)}")
                # Try with different encodings
                try:
                    original_content = file_content.decode('latin-1')
                    print(f"Latin-1 decode result length: {len(original_content)}")
                except Exception as e2:
                    print(f"Latin-1 decoding also failed: {str(e2)}")
                    original_content = ""
        
        print(f"Final content length: {len(original_content) if original_content else 0}")
        if original_content:
            print(f"Content preview: {original_content[:200]}...")
        
        # For very short content (likely image-based PDF), we'll proceed with visual analysis
        content_too_short = not original_content or len(original_content) < 50
        if content_too_short:
            print("Warning: Very little text extracted. This may be an image-based document.")
            # Set a placeholder that indicates we're relying on visual analysis
            if file.content_type == "application/pdf":
                original_content = "[Image-based PDF document - content extracted via visual analysis]"
            else:
                raise HTTPException(status_code=400, detail="Could not extract meaningful content from file")
        
        # Initialize Anthropic client for all template creation
        anthropic_api_key = os.environ.get('ANTHROPIC_API_KEY')
        print(f"Anthropic API key present: {'Yes' if anthropic_api_key else 'No'}")
        
        if not anthropic_api_key:
            raise HTTPException(status_code=500, detail="Anthropic API key not configured. Please set ANTHROPIC_API_KEY environment variable.")
        
        try:
            anthropic_client = anthropic.Anthropic(api_key=anthropic_api_key)
            print("Anthropic client initialized successfully")
        except Exception as e:
            print(f"Failed to initialize Anthropic client: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Failed to initialize Anthropic client: {str(e)}")
        
        # Convert PDF to images for Claude Vision (if PDF)
        visual_data = {}
        if file.content_type == "application/pdf":
            try:
                # Convert PDF to images
                images = convert_from_bytes(file_content, first_page=1, last_page=3)  # First 3 pages
                
                # Prepare images for Claude Vision
                image_data = []
                for i, image in enumerate(images[:2]):  # Use first 2 pages
                    buffer = io.BytesIO()
                    image.save(buffer, format='PNG')
                    buffer.seek(0)
                    image_b64 = base64.b64encode(buffer.getvalue()).decode()
                    image_data.append(image_b64)
                
                visual_prompt = """Analyze this document's visual design and styling. Extract:
1. Color scheme (background, text, accent colors)
2. Typography (fonts, sizes, hierarchy)
3. Layout patterns (margins, spacing, alignment)
4. Visual elements (borders, tables, formatting)
5. Professional style (modern, traditional, corporate)

Return as JSON with keys: colors, typography, layout, elements, overall_style, css_guidelines"""

                # Create message content with images
                message_content = [{"type": "text", "text": visual_prompt}]
                for img_b64 in image_data:
                    message_content.append({
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/png",
                            "data": img_b64
                        }
                    })
                
                vision_response = anthropic_client.messages.create(
                    model="claude-sonnet-4-20250514",
                    max_tokens=2000,
                    messages=[{
                        "role": "user", 
                        "content": message_content
                    }]
                )
                
                # Try to parse visual analysis as JSON
                try:
                    visual_data = json.loads(vision_response.content[0].text)
                except:
                    visual_data = {"analysis": vision_response.content[0].text}
                    
            except Exception as e:
                print(f"Visual analysis failed: {str(e)}")
                visual_data = {"error": "Visual analysis not available"}
        
        # Create comprehensive template prompt using single AI call
        is_image_based = "[Image-based PDF document" in original_content
        
        if is_image_based and visual_data and "error" not in visual_data:
            # Emphasize visual analysis for image-based documents
            template_creation_prompt = f"""Analyze this document using the visual styling data and create a comprehensive template.

DOCUMENT TYPE: Image-based PDF (visual analysis available)

VISUAL STYLING DATA:
{json.dumps(visual_data, indent=2)}

EXTRACTED TEXT (limited due to image-based format):
{original_content}

Based primarily on the VISUAL STYLING DATA, create a detailed template that includes:
1. Document layout and visual structure 
2. Typography and formatting patterns
3. Color scheme and design elements
4. Section organization and spacing
5. Professional presentation style

The template should generate documents that match the visual style and structure by combining with:
- Company information (name, address, contact details)
- Role/position specific content  
- Candidate information
- Process requirements
- User's specific requirements

Focus on recreating the visual presentation and professional formatting of the original document.

Return ONLY the template prompt text that will be used for document generation."""
        else:
            # Standard prompt for text-based documents
            template_creation_prompt = f"""Analyze this document and create a comprehensive template for generating similar documents.

DOCUMENT CONTENT:
{original_content[:3000]}...

VISUAL STYLING DATA:
{json.dumps(visual_data, indent=2)}

Create a detailed template prompt that includes:
1. Document structure and sections
2. Writing style and tone
3. Visual formatting requirements
4. Content organization patterns
5. Professional standards

The template should allow generating similar documents by combining it with:
- Company information (name, address, contact details)
- Role/position specific content
- Candidate information
- Process requirements
- User's specific requirements

Return ONLY the template prompt text that will be used for document generation."""

        # Generate template prompt
        print("Creating template prompt...")
        try:
            template_response = anthropic_client.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=3000,
                messages=[{
                    "role": "user",
                    "content": template_creation_prompt
                }]
            )
            
            template_prompt = template_response.content[0].text
            print(f"Template prompt created successfully, length: {len(template_prompt)}")
            
            if not template_prompt or len(template_prompt) < 50:
                raise Exception("Template prompt too short or empty")
                
        except Exception as e:
            print(f"Template prompt creation failed: {str(e)}")
            # Fallback to a basic template
            document_type = "document"
            if "resume" in name.lower() or "cv" in name.lower():
                document_type = "resume"
            elif "cover" in name.lower() or "letter" in name.lower():
                document_type = "cover_letter"
            elif "job" in name.lower() or "role" in name.lower():
                document_type = "job_description"
                
            template_prompt = f"""Generate a {document_type} document similar to the uploaded example.

STRUCTURE: Follow the same section organization and flow as the original document.
TONE: Maintain a professional and appropriate tone for this document type.
FORMATTING: Use clear headings, proper spacing, and professional layout.
CONTENT: Incorporate the provided company information, role details, and specific requirements.

Original document content preview:
{original_content[:500]}...

Adapt this structure and style to create new documents with the provided context."""
        
        # Upload file to Supabase storage for viewing later
        file_extension = os.path.splitext(file.filename)[1]
        storage_filename = f"{user_id}/{name}_{datetime.datetime.now().isoformat()}{file_extension}"
        
        try:
            storage_response = supabase.storage.from_("golden-examples").upload(
                storage_filename, file_content, {"content-type": file.content_type}
            )
            
            # Get signed URL for private bucket (24 hour expiry)
            signed_url_response = supabase.storage.from_("golden-examples").create_signed_url(storage_filename, 86400)
            original_file_url = signed_url_response.get('signedURL') if signed_url_response else None
            
        except Exception as e:
            print(f"File upload failed: {str(e)}")
            original_file_url = None
        
        # Determine document type
        document_type = "document"
        if "resume" in name.lower() or "cv" in name.lower():
            document_type = "resume"
        elif "cover" in name.lower() or "letter" in name.lower():
            document_type = "cover_letter"
        elif "job" in name.lower() or "role" in name.lower():
            document_type = "job_description"
        
        # Save template to database
        template_data = {
            "id": str(uuid.uuid4()),  # Generate UUID for the template
            "name": name,
            "user_id": user_id,
            "document_type": document_type,
            "file_type": file.content_type,
            "original_content": original_content[:1000] if original_content else "",  # Limit content size
            "template_prompt": template_prompt,
            "visual_data": visual_data,
            "original_file_url": original_file_url,
            "file_size": len(file_content),
            "usage_count": 0,
            "is_global": False,
            "version": 2,  # Mark as v2 template
            "date_added": datetime.datetime.utcnow().isoformat()
        }
        
        result = supabase.table('golden_examples').insert(template_data).execute()
        
        print(f"Template saved successfully:")
        print(f"- ID: {result.data[0]['id']}")
        print(f"- Template prompt length: {len(template_prompt)}")
        print(f"- Visual data keys: {list(visual_data.keys())}")
        print(f"- Template prompt preview: {template_prompt[:100]}...")
        
        return {
            "success": True,
            "template_id": result.data[0]["id"],
            "message": "Template created successfully",
            "visual_analysis_available": len(visual_data) > 1
        }
        
    except Exception as e:
        print(f"Template creation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating template: {str(e)}")

# Template listing endpoint
@app.get("/api/templates")
async def list_templates(user_id: str = Query(...)):
    """List all templates for a user"""
    try:
        from supabase import create_client
        
        # Initialize Supabase
        supabase_url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
        supabase_key = os.environ.get('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY')
        if not supabase_url or not supabase_key:
            raise HTTPException(status_code=500, detail="Supabase configuration missing")
        
        supabase = create_client(supabase_url, supabase_key)
        
        # Get user's templates + global templates
        response = supabase.table('golden_examples').select(
            'id, name, document_type, file_type, original_file_url, usage_count, date_added, visual_data, template_prompt, version'
        ).or_(f'user_id.eq.{user_id},is_global.eq.true').order('date_added', desc=True).execute()
        
        return {"templates": response.data}
        
    except Exception as e:
        print(f"Template listing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error listing templates: {str(e)}")

# Template deletion endpoint
@app.delete("/api/templates/{template_id}")
async def delete_template(template_id: str, user_id: str = Query(...)):
    """Delete a template"""
    try:
        from supabase import create_client
        
        # Initialize Supabase
        supabase_url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
        supabase_key = os.environ.get('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY')
        if not supabase_url or not supabase_key:
            raise HTTPException(status_code=500, detail="Supabase configuration missing")
        
        supabase = create_client(supabase_url, supabase_key)
        
        # Verify ownership and delete
        response = supabase.table('golden_examples').delete().eq('id', template_id).eq('user_id', user_id).execute()
        
        if not response.data:
            raise HTTPException(status_code=404, detail="Template not found or access denied")
        
        return {"success": True, "message": "Template deleted successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Template deletion error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error deleting template: {str(e)}")

# V2 Document generation endpoint using templates + artifacts
@app.post("/api/generate-document")
async def generate_document_v2(
    template_id: str = Body(...),
    project_id: str = Body(...),
    user_id: str = Body(...),
    user_requirements: str = Body(default="")
):
    """Generate document using V2 approach: template + project artifacts"""
    try:
        import anthropic
        from supabase import create_client
        
        # Initialize clients
        supabase_url = os.environ.get('NEXT_PUBLIC_SUPABASE_URL')
        supabase_key = os.environ.get('NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY')
        if not supabase_url or not supabase_key:
            raise HTTPException(status_code=500, detail="Supabase configuration missing")
        
        supabase = create_client(supabase_url, supabase_key)
        anthropic_client = anthropic.Anthropic(api_key=os.environ.get('ANTHROPIC_API_KEY'))
        
        # Get template
        template_response = supabase.table('golden_examples').select('*').eq('id', template_id).single().execute()
        if not template_response.data:
            raise HTTPException(status_code=404, detail="Template not found")
        
        template = template_response.data
        
        # Get project artifacts
        artifacts_response = supabase.table('artifacts').select('*').eq('project_id', project_id).execute()
        artifacts = artifacts_response.data or []
        
        # Organize artifacts by type
        company_artifacts = [a for a in artifacts if a.get('artifact_type') == 'company']
        role_artifacts = [a for a in artifacts if a.get('artifact_type') == 'role']
        
        # Get candidates and interviewers for additional context
        candidates_response = supabase.table('candidates').select('*').eq('project_id', project_id).execute()
        candidates = candidates_response.data or []
        
        interviewers_response = supabase.table('interviewers').select('*').eq('project_id', project_id).execute()
        interviewers = interviewers_response.data or []
        
        # Build context from artifacts
        def extract_artifact_content(artifact):
            content = artifact.get('processed_content') or artifact.get('description', '')
            if not content and artifact.get('file_url'):
                # Try to fetch content from file if needed
                try:
                    import requests
                    response = requests.get(artifact['file_url'])
                    if response.status_code == 200:
                        if 'pdf' in response.headers.get('Content-Type', ''):
                            content = extract_text_from_pdf(response.content)
                        else:
                            content = response.text
                except:
                    content = f"[File: {artifact.get('name', 'Unknown')}]"
            return content
        
        # Compile context
        company_context = ""
        if company_artifacts:
            company_context = "\n\n".join([
                f"**{a.get('name', 'Company Document')}**:\n{extract_artifact_content(a)[:1000]}"
                for a in company_artifacts[:3]  # Limit to first 3
            ])
        
        role_context = ""
        if role_artifacts:
            role_context = "\n\n".join([
                f"**{a.get('name', 'Role Document')}**:\n{extract_artifact_content(a)[:1000]}"
                for a in role_artifacts[:3]  # Limit to first 3
            ])
        
        candidate_context = ""
        if candidates:
            candidate_context = "\n\n".join([
                f"**{c.get('name', 'Candidate')}** ({c.get('role', 'Position')}): {c.get('company', 'Company')}"
                for c in candidates[:5]  # Limit to first 5
            ])
        
        process_context = ""
        if interviewers:
            process_context = "\n\n".join([
                f"**{i.get('name', 'Interviewer')}** ({i.get('position', 'Position')})"
                for i in interviewers[:3]  # Limit to first 3
            ])
        
        # Create comprehensive generation prompt
        generation_prompt = f"""
You must create a document that EXACTLY follows this template structure and style:

TEMPLATE INSTRUCTIONS:
{template.get('template_prompt', '')}

COMPANY CONTEXT:
{company_context}

ROLE/POSITION CONTEXT:
{role_context}

CANDIDATE INFORMATION:
{candidate_context}

PROCESS/INTERVIEWER INFORMATION:
{process_context}

VISUAL STYLING REQUIREMENTS:
{json.dumps(template.get('visual_data', {}), indent=2)}

USER SPECIFIC REQUIREMENTS:
{user_requirements}

CRITICAL INSTRUCTIONS:
1. Follow the EXACT structure and sections from the template
2. Use the SAME formatting patterns (tables, headers, lists, etc.)
3. Maintain the SAME writing style and tone from the template
4. Apply the visual styling from the template and visual analysis
5. Automatically include relevant company/role/candidate information where appropriate
6. Replace placeholder content with the provided context while keeping structure identical
7. Generate a complete HTML document optimized for PDF printing with:
   - Proper page sizing (8.5" x 11" or A4)
   - Page break controls for multi-page documents
   - Print-optimized CSS (@media print rules)
   - Headers and footers if needed
   - Margins suitable for printing (1 inch margins)
8. Include proper HTML structure (DOCTYPE, html, head, body)

IMPORTANT FOR PDF GENERATION:
- Use CSS @page rules for page setup: @page {{ size: A4; margin: 1in; }}
- Add page-break-before and page-break-after where appropriate
- Include print-specific styling in <style> tags
- Ensure content fits properly on standard paper sizes
- Use proper CSS for headers/footers that repeat on each page
- Include fonts that work well in PDF (Arial, Times, etc.)

PDF-OPTIMIZED CSS REQUIREMENTS:
- Add @media print rules for print-specific styling
- Use page-break-inside: avoid; for content that shouldn't split
- Add proper margins and padding for print
- Ensure colors and styling work in PDF format

CRITICAL OUTPUT REQUIREMENT:
Return ONLY the complete HTML document with embedded CSS styling. 
DO NOT include any explanations, notes, or additional text.
DO NOT add any text before or after the HTML.
The response must start with <!DOCTYPE html> and end with </html>
NO OTHER TEXT ALLOWED.
"""
        
        # Generate document
        response = anthropic_client.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            messages=[{
                "role": "user",
                "content": generation_prompt
            }]
        )
        
        generated_content = response.content[0].text
        
        # Update template usage count
        supabase.table('golden_examples').update({
            'usage_count': template.get('usage_count', 0) + 1
        }).eq('id', template_id).execute()
        
        return {
            "success": True,
            "html_content": generated_content,
            "template_used": template.get('name', ''),
            "document_type": template.get('document_type', 'document'),
            "timestamp": datetime.datetime.now().isoformat()
        }
        
    except Exception as e:
        print(f"Document generation error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating document: {str(e)}")