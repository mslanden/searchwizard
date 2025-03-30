"""
Review Agent: Responsible for evaluating and approving the job posting.
"""
from typing import Dict, Any
from langchain.schema import BaseLanguageModel
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain

class ReviewAgent:
    """Agent that reviews job postings for quality and completeness."""
    
    def __init__(self, llm: BaseLanguageModel):
        """Initialize with LLM."""
        self.llm = llm
        self._setup_chain()
    
    def _setup_chain(self):
        """Set up the LLM chain for job posting review."""
        prompt_template = """
        You are a professional job posting reviewer. Your task is to evaluate the job posting below and determine if it's ready to be published or needs revision.
        
        ## Job Posting:
        {job_posting}
        
        Analyze the job posting for the following criteria:
        1. Clarity: Is the job posting clear and easy to understand?
        2. Completeness: Does it include all necessary information (job title, responsibilities, qualifications)?
        3. Professionalism: Is the language professional and appropriate?
        4. Formatting: Is the Markdown formatting correct?
        5. Engagement: Is the content engaging and likely to attract candidates?
        
        Provide your evaluation and specify whether the job posting is APPROVED or NEEDS REVISION.
        If it needs revision, provide specific feedback for improvement.
        
        Begin your response with either "APPROVED" or "NEEDS REVISION" on the first line, followed by your detailed evaluation.
        """
        
        self.prompt = ChatPromptTemplate.from_template(prompt_template)
        self.chain = LLMChain(llm=self.llm, prompt=self.prompt)
    
    def process(self, state: Dict[str, Any]) -> Dict[str, Any]:
        """Review job posting and decide if it's ready or needs revision."""
        job_posting = state.get("job_posting", "")
        
        print("Reviewing job posting...")
        
        # Prepare input for the chain
        chain_input = {
            "job_posting": job_posting
        }
        
        # Get review
        review_result = self.chain.invoke(chain_input)
        review_text = review_result["text"]
        
        # Check if approved based on the first line of the review
        is_approved = review_text.strip().startswith("APPROVED")
        
        # Update state
        state["review"] = review_text
        state["approved"] = is_approved
        
        if is_approved:
            print("Job posting approved!")
        else:
            print("Job posting needs revision. Sending back to composer.")
        
        return state
