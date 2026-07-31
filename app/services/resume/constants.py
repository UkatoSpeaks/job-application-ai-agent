import re

TECH_STACK = {
    "Python",
    "Java",
    "JavaScript",
    "TypeScript",
    "C++",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "Express.js",
    "FastAPI",
    "Flask",
    "Django",
    "MongoDB",
    "PostgreSQL",
    "MySQL",
    "Redis",
    "Firebase",
    "Firestore",
    "Docker",
    "Kubernetes",
    "AWS",
    "Azure",
    "GCP",
    "Git",
    "GitHub",
    "LangChain",
    "LangGraph",
    "CrewAI",
    "OpenAI",
    "Mistral",
    "TensorFlow",
    "PyTorch",
}

ROLE_KEYWORDS = {
    "engineer",
    "developer",
    "intern",
    "analyst",
    "consultant",
    "manager",
    "lead",
    "architect",
    "researcher",
    "designer",
    "specialist",
    "associate",
    "software",
    "frontend",
    "backend",
    "full-stack",
    "full stack",
    "devops",
    "data scientist",
    "machine learning",
    "ai",
}

LOCATION_KEYWORDS = {
    "remote",
    "hybrid",
    "on-site",
    "onsite",
    "work from home",
}

MONTH_PATTERN = (
    r"(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|"
    r"May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|"
    r"Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)"
)

DATE_PATTERN = re.compile(
    rf"""
    ^
    (
        {MONTH_PATTERN}\s+\d{{4}}
        |
        \d{{4}}
    )
    \s*[–-]\s*
    (
        {MONTH_PATTERN}\s+\d{{4}}
        |
        \d{{4}}
        |
        Present
        |
        Current
    )
    $
    """,
    re.IGNORECASE | re.VERBOSE,
)