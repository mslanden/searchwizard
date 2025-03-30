# AI Agent System for Automated Job Posting Creation

## Overview
This AI system automates the creation of job postings through a multi-step agent process using LangChain and LangGraph. The system consists of several specialized agents:

1. **Sub-node Agents**: Extract relevant information from provided documents.
2. **Composer/Writer Agents**: Generate a job posting in Markdown format.
3. **Review Agent**: Validates the job posting and either approves it or sends it back for revision.

For initial testing, the system will be run via the Command Line Interface (CLI).

---

## System Architecture
### **1. Sub-node Agents (Information Extractors)**
- These agents parse input documents and extract relevant data such as:
  - Job title
  - Responsibilities
  - Qualifications
  - Salary range (if available)
  - Company details
- Uses LangChain’s document loaders and text extraction tools.
- Outputs structured data in JSON format.

### **2. Composer/Writer Agents**
- Receives structured data from the Sub-node Agents.
- Formats the extracted data into a structured job posting.
- Outputs a Markdown (`.md`) file.
- Uses LLMs (via LangChain) to enhance and refine writing quality.

### **3. Review Agent**
- Evaluates the Markdown job posting for correctness, clarity, and completeness.
- If the content is valid, the job posting is saved.
- If issues are found, the document is sent back to the responsible agent for revision.
- Uses predefined validation rules and potentially another LLM for semantic analysis.

---

## **Workflow**
1. **Document Input:** User provides job-related documents.
2. **Information Extraction:** Sub-node Agents extract relevant information.
3. **Content Generation:** Composer Agents create a job posting in Markdown.
4. **Review Process:** Review Agent evaluates the content.
   - If approved, the posting is saved.
   - If not, it is sent back for correction.
5. **Finalization:** Once validated, the job posting is stored.

---

## **Implementation Details**
### **Technologies Used**
- **LangChain**: For managing LLM interactions and text processing.
- **LangGraph**: For orchestrating multi-agent workflows.
- **Python**: Core programming language.
- **CLI**: Used for testing and execution.

### **Example Execution (CLI-Based)**
```bash
python run_agents.py --input documents/job_description.pdf
```

### **Sample Output (Job Posting in Markdown)**
```md
# Software Engineer (Backend)

## Responsibilities
- Design, develop, and maintain backend services.
- Optimize performance and scalability.

## Qualifications
- 3+ years of experience in backend development.
- Proficiency in Python and Django.
```

---

## **Next Steps**
1. Implement initial versions of each agent.
2. Integrate LangGraph for workflow automation.
3. Test using CLI before deploying into a web-based or API-based system.
4. Refine LLM responses to enhance job posting quality.

This guide provides the foundational structure for your AI agent system. Let me know if you need further refinements!

