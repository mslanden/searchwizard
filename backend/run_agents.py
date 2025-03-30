#!/usr/bin/env python3
"""
Main script to run the AI agent system for job posting creation.
"""
import os
import argparse
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from agents.extractor_agent import ExtractorAgent
from agents.composer_agent import ComposerAgent
from agents.review_agent import ReviewAgent
from langgraph.graph import StateGraph, END

# Load environment variables
load_dotenv()

def parse_arguments():
    """Parse command line arguments."""
    parser = argparse.ArgumentParser(description="AI Agent System for Job Posting Creation")
    parser.add_argument("--input", required=True, help="Path to input document(s)")
    parser.add_argument("--output", default="output", help="Directory to save output files")
    parser.add_argument("--model", default="gpt-3.5-turbo", help="LLM model to use")
    return parser.parse_args()

def setup_agents(model_name):
    """Initialize the agents with the specified LLM."""
    llm = ChatOpenAI(model=model_name)
    extractor = ExtractorAgent(llm=llm)
    composer = ComposerAgent(llm=llm)
    reviewer = ReviewAgent(llm=llm)
    return extractor, composer, reviewer

def build_workflow(extractor, composer, reviewer):
    """Build the LangGraph workflow for the agent system."""
    # Define the state schema
    workflow = StateGraph(name="JobPostingWorkflow")
    
    # Add nodes
    workflow.add_node("extract", extractor.process)
    workflow.add_node("compose", composer.process)
    workflow.add_node("review", reviewer.process)
    
    # Define the edges
    workflow.add_edge("extract", "compose")
    
    # Conditional edge from review: if approved, end; if not, back to compose
    workflow.add_conditional_edges(
        "review",
        lambda state: "end" if state["approved"] else "compose",
        {
            "end": END,
            "compose": "compose"
        }
    )
    
    # Set the entry point
    workflow.set_entry_point("extract")
    
    return workflow.compile()

def ensure_output_dir(output_dir):
    """Create output directory if it doesn't exist."""
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

def main():
    """Main execution function."""
    args = parse_arguments()
    
    # Ensure output directory exists
    ensure_output_dir(args.output)
    
    # Initialize agents
    extractor, composer, reviewer = setup_agents(args.model)
    
    # Build workflow
    workflow = build_workflow(extractor, composer, reviewer)
    
    # Execute workflow
    result = workflow.invoke({
        "input_path": args.input,
        "output_dir": args.output,
        "approved": False  # Initial state
    })
    
    print(f"Job posting creation {'completed successfully' if result['approved'] else 'failed'}")
    if result["approved"]:
        print(f"Job posting saved to: {result['output_path']}")

if __name__ == "__main__":
    main()
