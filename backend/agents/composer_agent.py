"""
Composer Agent: Responsible for generating the job posting in Markdown format.
"""
import os
from typing import Dict, Any
from langchain.schema import BaseLanguageModel
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain

class ComposerAgent:
    """Agent that composes job postings based on extracted information."""
    
    def __init__(self, llm: BaseLanguageModel):
        """Initialize with LLM."""
        self.llm = llm
        self._setup_chain()
    
    def _setup_chain(self):
        """Set up the LLM chain for job posting generation."""
        prompt_template = """
        You are a professional job posting writer. Create a clear, professional job posting using the information provided.
        Format the job posting in Markdown format with appropriate sections and formatting.
        
        ## Job Information:
        - Job Title: {job_title}
        - Company: {company_name}
        - Location: {location}
        - Salary Range: {salary_range}
        
        ## Responsibilities:
        {responsibilities}
        
        ## Qualifications:
        {qualifications}
        
        ## Benefits:
        {benefits}
        
        Make the job posting engaging, professional, and thorough. If any information is missing, create suitable content
        based on similar job roles, but keep it general and realistic.
        
        Return ONLY the Markdown formatted job posting, starting with a level 1 heading for the job title.
        """
        
        self.prompt = ChatPromptTemplate.from_template(prompt_template)
        self.chain = LLMChain(llm=self.llm, prompt=self.prompt)
    
    def _format_list_items(self, items):
        """Format a list of items as a string for the prompt."""
        if not items:
            return "Not specified"
        return "\n".join([f"- {item}" for item in items])
    
    def _save_job_posting(self, content: str, output_dir: str) -> str:
        """Save the job posting content to a Markdown file."""
        # Create a filename based on the job title (if available in the content)
        lines = content.split('\n')
        if lines and lines[0].startswith('# '):
            filename = lines[0][2:].replace(' ', '_').lower() + '.md'
        else:
            filename = 'job_posting.md'
        
        output_path = os.path.join(output_dir, filename)
        
        with open(output_path, 'w') as f:
            f.write(content)
        
        return output_path
    
    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Generate job posting from extracted information."""
        extracted_info = state.get("extracted_info", {})
        output_dir = state.get("output_dir", "output")
        
        print("Composing job posting...")
        
        # Prepare the input for the chain
        chain_input = {
            "job_title": extracted_info.get("job_title", "Job Position"),
            "company_name": extracted_info.get("company_name", "Company"),
            "location": extracted_info.get("location", "Location not specified"),
            "salary_range": extracted_info.get("salary_range", "Salary not specified"),
            "responsibilities": self._format_list_items(extracted_info.get("responsibilities", [])),
            "qualifications": self._format_list_items(extracted_info.get("qualifications", [])),
            "benefits": self._format_list_items(extracted_info.get("benefits", []))
        }
        
        # Generate job posting
        job_posting = self.chain.invoke(chain_input)
        
        # Get the content from the LLMChain response
        job_posting_content = job_posting["text"]
        
        # Save to file
        output_path = self._save_job_posting(job_posting_content, output_dir)
        
        # Update state
        state["job_posting"] = job_posting_content
        state["output_path"] = output_path
        
        return state
