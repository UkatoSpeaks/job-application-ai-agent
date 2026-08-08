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
# Edges
# ==========================================================

builder.add_edge(
    START,
    "parse_resume",
)

builder.add_edge(
    "parse_resume",
    "parse_job",
)

builder.add_edge(
    "parse_job",
    "match_resume",
)


# ==========================================================
# Conditional Routing
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
# Tailor → Cover Letter
# ==========================================================

builder.add_edge(
    "tailor_resume",
    "generate_cover_letter",
)


# ==========================================================
# End
# ==========================================================

builder.add_edge(
    "generate_cover_letter",
    END,
)


# ==========================================================
# Compile
# ==========================================================

job_agent_graph = builder.compile()