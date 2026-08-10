from langgraph.graph import StateGraph, START, END

from app.services.job_agent.state import JobAgentState

from app.services.job_agent.nodes import (
    parse_resume_node,
    parse_job_node,
    match_resume_node,
    tailor_resume_node,
    generate_cover_letter_node,
)

from app.services.job_agent.edges import (
    route_after_match,
    route_after_tailoring,
    route_after_cover_letter,
)


# ==========================================================
# Build Job Application Agent Graph
# ==========================================================

builder = StateGraph(JobAgentState)


# ==========================================================
# Nodes
# ==========================================================

builder.add_node(
    "parse_resume",
    parse_resume_node,
)

builder.add_node(
    "parse_job",
    parse_job_node,
)

builder.add_node(
    "match_resume",
    match_resume_node,
)

builder.add_node(
    "tailor_resume",
    tailor_resume_node,
)

builder.add_node(
    "generate_cover_letter",
    generate_cover_letter_node,
)


# ==========================================================
# START
# ==========================================================

builder.add_edge(
    START,
    "parse_resume",
)


# ==========================================================
# Resume Parsing
# ==========================================================

builder.add_edge(
    "parse_resume",
    "parse_job",
)


# ==========================================================
# Job Parsing
# ==========================================================

builder.add_edge(
    "parse_job",
    "match_resume",
)


# ==========================================================
# Match Routing
# ==========================================================

builder.add_conditional_edges(
    "match_resume",
    route_after_match,
    {
        "tailor_resume": "tailor_resume",
        "generate_cover_letter": "generate_cover_letter",
    },
)


# ==========================================================
# Resume Tailoring Validation / Retry
# ==========================================================

builder.add_conditional_edges(
    "tailor_resume",
    route_after_tailoring,
    {
        "retry_tailor_resume": "tailor_resume",
        "generate_cover_letter": "generate_cover_letter",
    },
)


# ==========================================================
# Cover Letter Validation / Retry
# ==========================================================

builder.add_conditional_edges(
    "generate_cover_letter",
    route_after_cover_letter,
    {
        "retry_cover_letter": "generate_cover_letter",
        "end": END,
    },
)


# ==========================================================
# Compile
# ==========================================================

job_agent_graph = builder.compile()


print(
    "\n========================================"
)

print(
    "JOB AGENT GRAPH COMPILED SUCCESSFULLY"
)

print(
    "========================================\n"
)