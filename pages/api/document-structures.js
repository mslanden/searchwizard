import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Path to example documents
const EXAMPLE_DOCS_DIR = path.join(process.cwd(), 'backend', 'Example-docs');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Verify user authentication
    const { user } = await supabase.auth.getUser();
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Get all document structures from example documents
    const structures = await getDocumentStructures();
    
    return res.status(200).json({ structures });
  } catch (error) {
    console.error('Error in document-structures API:', error);
    return res.status(500).json({ error: 'Failed to retrieve document structures' });
  }
}

/**
 * Get document structures from example documents
 */
async function getDocumentStructures() {
  try {
    // Check if Example-docs directory exists
    if (!fs.existsSync(EXAMPLE_DOCS_DIR)) {
      console.error(`Example-docs directory not found at ${EXAMPLE_DOCS_DIR}`);
      return {};
    }

    // Get all subdirectories (document types)
    const documentTypes = fs.readdirSync(EXAMPLE_DOCS_DIR)
      .filter(item => fs.statSync(path.join(EXAMPLE_DOCS_DIR, item)).isDirectory());

    // Process each document type
    const structures = {};
    for (const docType of documentTypes) {
      // Get first example file for this document type
      const docTypePath = path.join(EXAMPLE_DOCS_DIR, docType);
      const exampleFiles = fs.readdirSync(docTypePath)
        .filter(file => {
          const filePath = path.join(docTypePath, file);
          return fs.statSync(filePath).isFile() && 
                 (file.endsWith('.pdf') || file.endsWith('.docx') || file.endsWith('.txt'));
        });

      if (exampleFiles.length > 0) {
        // Analyze document structure using structure agent
        const structure = await analyzeDocumentStructure(docType, path.join(docTypePath, exampleFiles[0]));
        structures[docType] = structure;
      }
    }

    return structures;
  } catch (error) {
    console.error('Error getting document structures:', error);
    return {};
  }
}

/**
 * Analyze document structure using structure agent
 */
async function analyzeDocumentStructure(documentType, filePath) {
  try {
    // Import structure agent dynamically to avoid server-side issues
    const { StructureAgent } = await import('../../backend/agents/structure_agent');
    
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
    
    // Initialize structure agent
    const structureAgent = new StructureAgent(framework, apiKey);
    
    // Analyze document structure
    const structure = await structureAgent.analyze_structure([filePath]);
    
    return {
      document_type: documentType,
      ...structure
    };
  } catch (error) {
    console.error(`Error analyzing document structure for ${documentType}:`, error);
    
    // Return a basic structure if analysis fails
    return {
      document_type: documentType,
      sections: [
        {
          name: "Introduction",
          description: "Introduction section",
          content_guidelines: "Introduce the document"
        },
        {
          name: "Main Content",
          description: "Main content section",
          content_guidelines: "Provide the main content"
        },
        {
          name: "Conclusion",
          description: "Conclusion section",
          content_guidelines: "Conclude the document"
        }
      ],
      formatting: {
        preferred_style: "professional",
        tone: "formal"
      }
    };
  }
}
