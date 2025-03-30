"""
Extractor Agent: Responsible for parsing input documents and extracting job-related information.
"""
from typing import Dict, Any
from langchain.chains import create_extraction_chain
from langchain.document_loaders import PyPDFLoader
from langchain.schema import BaseLanguageModel

class ExtractorAgent:
    """Agent that extracts job information from input documents."""
    
    def __init__(self, llm: BaseLanguageModel):
        """Initialize with LLM."""
        self.llm = llm
        
    def _load_document(self, file_path: str) -> str:
        """Load and extract text from input document."""
        if file_path.endswith('.pdf'):
            loader = PyPDFLoader(file_path)
            documents = loader.load()
            return "\n".join([doc.page_content for doc in documents])
        # Can add support for more document types here
        else:
            with open(file_path, 'r') as f:
                return f.read()
    
    def _extract_information(self, text: str) -> Dict[str, Any]:
        """Extract job-related information from text."""
        # Define the schema for extraction
        schema = {
            "properties": {
                "job_title": {"type": "string", "description": "The title of the job position"},
                "company_name": {"type": "string", "description": "The name of the company offering the job"},
                "responsibilities": {"type": "array", "items": {"type": "string"}, "description": "List of job responsibilities"},
                "qualifications": {"type": "array", "items": {"type": "string"}, "description": "List of qualifications required for the job"},
                "salary_range": {"type": "string", "description": "The salary range for the position, if available"},
                "location": {"type": "string", "description": "Job location or remote status"},
                "benefits": {"type": "array", "items": {"type": "string"}, "description": "List of benefits offered"},
            },
            "required": ["job_title", "responsibilities", "qualifications"]
        }
        
        # Create extraction chain
        extraction_chain = create_extraction_chain(schema, self.llm)
        
        # Extract information from text
        result = extraction_chain.invoke(text)
        
        # Get the first (and only) result
        if result and len(result) > 0:
            return result[0]
        return {}
    
    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Process document and extract job information."""
        input_path = state["input_path"]
        print(f"Extracting information from: {input_path}")
        
        # Load document
        text = self._load_document(input_path)
        
        # Extract information
        extracted_info = self._extract_information(text)
        
        # Update state with extracted information
        state["extracted_info"] = extracted_info
        
        # Return updated state
        return state
