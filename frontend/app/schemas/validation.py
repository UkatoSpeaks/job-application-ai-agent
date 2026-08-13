from typing import Literal
from pydantic import BaseModel, Field


class ValidationIssue(BaseModel):
    field: str
    severity: Literal["error", "warning", "info"]
    message: str


class ValidationResult(BaseModel):
    valid: bool = True

    errors: list[ValidationIssue] = Field(default_factory=list)
    warnings: list[ValidationIssue] = Field(default_factory=list)
    info: list[ValidationIssue] = Field(default_factory=list)


print("========== VALIDATION MODEL ==========")
print(ValidationIssue.model_fields)
print("======================================")