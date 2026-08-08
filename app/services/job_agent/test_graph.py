from app.services.job_agent.graph import job_agent_graph
from app.services.resume.extractor import ResumeExtractor

RESUME_TEXT =  "uploads/Anurag_Chaudhary_Resume (1).pdf"


JOB_DESCRIPTION = """
Software Engineer Intern

We are looking for a Software Engineer Intern with experience in
Python, FastAPI, React, Next.js, Node.js, PostgreSQL, MongoDB,
Docker, Git, LangChain, LangGraph, RAG, and AI applications.

Responsibilities:
- Build REST APIs using FastAPI and Python.
- Develop frontend applications using React and Next.js.
- Build backend services using Node.js.
- Work with PostgreSQL and MongoDB.
- Build RAG pipelines.
- Work with LangChain and LangGraph.
- Write clean and maintainable code.
"""


def main():

    print("\n========================================")
    print("STARTING JOB AGENT GRAPH")
    print("========================================")

    initial_state = {
        "resume_text": RESUME_TEXT,
        "job_description_text": JOB_DESCRIPTION,
    }

    result = job_agent_graph.invoke(
        initial_state
    )

    print("\n========================================")
    print("GRAPH EXECUTION COMPLETE")
    print("========================================")

    print("\nSimilarity:")
    print(result.get("similarity"))

    print("\nMatch:")
    print(result.get("match"))

    print("\nTailored Resume:")
    print(result.get("tailored_resume"))

    print("\nCover Letter:")
    print(result.get("cover_letter"))

    print("\n========================================")


if __name__ == "__main__":
    main()