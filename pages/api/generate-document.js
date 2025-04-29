import { createClient } from '@supabase/supabase-js';
import path from 'path';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify user authentication
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { documentType, structure, userInput = '' } = req.body;

    if (!documentType || !structure) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Generate document using writer agent
    const htmlDocument = await generateDocument(documentType, structure, userInput);
    
    return res.status(200).json({ html: htmlDocument });
  } catch (error) {
    console.error('Error in generate-document API:', error);
    return res.status(500).json({ error: 'Failed to generate document' });
  }
}

/**
 * Generate document using writer agent
 */
async function generateDocument(documentType, structure, userInput) {
  try {
    // Import writer agent dynamically to avoid server-side issues
    const { WriterAgent } = await import('../../backend/agents/writer_agent');
    
    // Get API key from environment variables - try in order of preference (OpenAI first)
    let apiKey = process.env.OPENAI_API_KEY;
    let framework = "openai";
    
    if (!apiKey) {
      apiKey = process.env.ANTHROPIC_API_KEY;
      framework = "anthropic";
    }
    
    if (!apiKey) {
      apiKey = process.env.GEMINI_API_KEY;
      framework = "gemini";
    }
    
    if (!apiKey) {
      throw new Error("No API key found in environment variables");
    }
    
    // Initialize writer agent
    const writerAgent = new WriterAgent(framework, apiKey);
    
    // Update system prompt to generate HTML for PDF
    writerAgent.update_system_prompt(`
    You are an expert document writer with expertise in creating professional documents.
    Your task is to create new documents based on the structure provided and the user's specifications.
    
    Follow these guidelines:
    1. Create a new document that follows the provided structure template.
    2. Ensure the content is clear, concise, and professionally written.
    3. Maintain the appropriate level of formality based on the document type.
    4. Include all necessary sections and details typically found in this type of document.
    5. Create the content in HTML format designed for PDF output.
    6. Use appropriate HTML and CSS to create a professional PDF document.
    7. Design the document with proper page layout for A4 paper size.
    8. Use appropriate fonts, spacing, and margins for professional documents.
    9. Include placeholders for images where appropriate.
    10. Format tables, lists, and other elements professionally.
    
    Your HTML should include:
    - Proper CSS styling for a professional document
    - Page breaks where appropriate using CSS
    - Header and footer elements
    - Proper typography with font sizes and weights
    - Balanced whitespace and margins
    
    Your output should be ONLY the HTML document - no explanations or other text.
    `);
    
    // Generate document with structure
    const htmlDocument = await writerAgent.create_document_with_structure(userInput, structure);
    
    // Add CSS for PDF styling
    const styledHtml = addPdfStyling(htmlDocument, documentType);
    
    return styledHtml;
  } catch (error) {
    console.error('Error generating document:', error);
    throw error;
  }
}

/**
 * Add PDF-specific styling to HTML document
 */
function addPdfStyling(html, documentType) {
  // Add CSS for PDF styling
  const pdfCss = `
    <style>
      @page {
        size: A4;
        margin: 2cm;
      }
      body {
        font-family: 'Arial', 'Helvetica', sans-serif;
        line-height: 1.5;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .page {
        page-break-after: always;
        position: relative;
        padding: 20px;
      }
      .page:last-child {
        page-break-after: avoid;
      }
      h1 {
        font-size: 24pt;
        color: #2c3e50;
        margin-bottom: 20px;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
      }
      h2 {
        font-size: 18pt;
        color: #3498db;
        margin-top: 20px;
        margin-bottom: 10px;
      }
      h3 {
        font-size: 14pt;
        color: #2980b9;
        margin-top: 15px;
        margin-bottom: 5px;
      }
      p {
        margin-bottom: 10px;
        text-align: justify;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin: 15px 0;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      .header {
        text-align: center;
        margin-bottom: 30px;
      }
      .footer {
        position: fixed;
        bottom: 0;
        width: 100%;
        text-align: center;
        font-size: 9pt;
        color: #777;
        border-top: 1px solid #eee;
        padding-top: 5px;
      }
      .image-placeholder {
        background-color: #f5f5f5;
        border: 1px dashed #ccc;
        padding: 20px;
        text-align: center;
        margin: 15px 0;
        min-height: 100px;
      }
      ul, ol {
        margin-left: 20px;
        margin-bottom: 10px;
      }
      .document-title {
        font-size: 28pt;
        font-weight: bold;
        text-align: center;
        margin-top: 100px;
        margin-bottom: 10px;
        color: #2c3e50;
      }
      .document-subtitle {
        font-size: 16pt;
        text-align: center;
        margin-bottom: 100px;
        color: #7f8c8d;
      }
      .page-number {
        position: absolute;
        bottom: 20px;
        right: 20px;
        font-size: 9pt;
        color: #777;
      }
      .date {
        position: absolute;
        bottom: 20px;
        left: 20px;
        font-size: 9pt;
        color: #777;
      }
    </style>
  `;
  
  // Add document type-specific styling
  let typeSpecificCss = '';
  switch (documentType) {
    case 'Role Specification':
      typeSpecificCss = `
        <style>
          h1 { color: #3498db; }
          .header { background-color: #f8f9fa; padding: 15px; }
        </style>
      `;
      break;
    case 'Candidate Brief':
      typeSpecificCss = `
        <style>
          h1 { color: #27ae60; }
          .header { background-color: #f0f8f1; padding: 15px; }
        </style>
      `;
      break;
    case 'Company Overview':
      typeSpecificCss = `
        <style>
          h1 { color: #e74c3c; }
          .header { background-color: #fdf2f0; padding: 15px; }
        </style>
      `;
      break;
    case 'Interview Guide':
      typeSpecificCss = `
        <style>
          h1 { color: #9b59b6; }
          .header { background-color: #f5f0f7; padding: 15px; }
        </style>
      `;
      break;
    case 'Candidate Report':
      typeSpecificCss = `
        <style>
          h1 { color: #f39c12; }
          .header { background-color: #fef9e7; padding: 15px; }
        </style>
      `;
      break;
    default:
      break;
  }
  
  // Add header, footer, and current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Check if the HTML already has a head section
  if (html.includes('<head>')) {
    // Insert CSS into existing head
    html = html.replace('</head>', `${pdfCss}${typeSpecificCss}</head>`);
  } else {
    // Add head with CSS
    html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${documentType}</title>
  ${pdfCss}
  ${typeSpecificCss}
</head>
<body>
  ${html}
</body>
</html>`;
  }
  
  // Add page numbers and date script
  const pageScript = `
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      // Add page numbers and date to each page
      const pages = document.querySelectorAll('.page');
      pages.forEach((page, index) => {
        const pageNumber = document.createElement('div');
        pageNumber.className = 'page-number';
        pageNumber.textContent = 'Page ' + (index + 1) + ' of ' + pages.length;
        page.appendChild(pageNumber);
        
        const dateElement = document.createElement('div');
        dateElement.className = 'date';
        dateElement.textContent = '${currentDate}';
        page.appendChild(dateElement);
      });
    });
  </script>
  `;
  
  // Add script before closing body tag
  if (html.includes('</body>')) {
    html = html.replace('</body>', `${pageScript}</body>`);
  } else {
    html += pageScript;
  }
  
  return html;
}
