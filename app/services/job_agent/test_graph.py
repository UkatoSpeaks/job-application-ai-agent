from app.services.job_agent.graph import job_agent_graph
from app.services.resume.extractor import ResumeExtractor


def main():

    print("\n========================================")
    print("STARTING JOB AGENT GRAPH")
    print("========================================")

    resume_path = "uploads/Anurag_Chaudhary_Resume (1).pdf"

    resume_text = ResumeExtractor.extract_text(
        resume_path
    )

    job_description = """
Senior Java Backend Engineer

We are looking for an experienced backend engineer with strong
production experience in Java and Spring Boot.

Requirements:
- Java
- Spring Boot
- Hibernate
- Kafka
- Redis
- AWS
- Kubernetes
- Microservices
- Terraform
- Jenkins
- CI/CD
- Elasticsearch
- System Design
- Distributed Systems

Responsibilities:
- Design distributed backend services.
- Build high-throughput microservices.
- Work with Kafka and Elasticsearch.
- Deploy services on AWS.
- Design scalable distributed systems.
- Implement CI/CD pipelines.
- Monitor production systems.
"""

    initial_state = {
        "resume_text": resume_text,
        "job_description_text": job_description,
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