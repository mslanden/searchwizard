/**
 * API Route: /api/analyze-structure
 * 
 * Analyzes a document with the StructureAgent to extract its structure
 */

import { createClient } from '@supabase/supabase-js';
import path from 'path';
import fs from 'fs';
import os from 'os';
import https from 'https';
import { StructureAgent } from '../../backend/agents/structure_agent';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get user from auth cookie
    const { user } = await supabase.auth.api.getUserByCookie(req);
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { documentId, fileName, fileUrl } = req.body;

    if (!documentId || !fileUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Download the file to a temporary location
    const tempDir = path.join(os.tmpdir(), 'search-wizard-documents');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const tempFilePath = path.join(tempDir, fileName);
    
    // Download the file
    await downloadFile(fileUrl, tempFilePath);

    // Setup which API provider to use based on available keys
    // Try them in order: OpenAI, Anthropic, Gemini
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
      return res.status(500).json({ error: 'No API key found for any supported LLM provider' });
    }

    // Initialize the StructureAgent
    const structureAgent = new StructureAgent(framework, apiKey);
    
    // Store the file in the proper directory for the agent to access
    const agentDocsDir = path.join(process.cwd(), 'backend', 'documents');
    if (!fs.existsSync(agentDocsDir)) {
      fs.mkdirSync(agentDocsDir, { recursive: true });
    }
    
    const agentFilePath = path.join(agentDocsDir, fileName);
    fs.copyFileSync(tempFilePath, agentFilePath);
    
    // Analyze the document structure
    const structure = await structureAgent.analyze_structure([fileName]);
    
    // Clean up temporary files
    try {
      fs.unlinkSync(tempFilePath);
      fs.unlinkSync(agentFilePath);
    } catch (cleanupError) {
      console.error('Error cleaning up temp files:', cleanupError);
    }
    
    // Return the structure
    return res.status(200).json({ success: true, structure });
    
  } catch (error) {
    console.error('Error analyzing document structure:', error);
    return res.status(500).json({ error: 'Error analyzing document structure', details: error.message });
  }
}

// Helper function to download a file
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);
    
    https.get(url, (response) => {
      response.pipe(file);
      
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(destination, () => {}); // Delete the file if there's an error
      reject(err);
    });
  });
}
