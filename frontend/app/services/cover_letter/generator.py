import json

from pydantic import ValidationError

from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI

from app.core.config import settings

from app.schemas.resume import ParsedResume
from app.schemas.cover_letter import CoverLetterResponse

from app.services.cover_letter.prompt import (
    SYSTEM_PROMPT,
    USER_PROMPT,
)


class CoverLetterGenerator:

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", SYSTEM_PROMPT),
            ("human", USER_PROMPT),
        ]
    )

    @classmethod
    def generate(
        cls,
        resume: ParsedResume,
        job_description: str,
        tone: str = "professional",
        validation_feedback: str = "",
    ) -> CoverLetterResponse:

        print("\n========================================")
        print("GENERATING COVER LETTER")
        print("========================================")
        print(f"Tone: {tone}")

        if validation_feedback:
            print("\nPrevious validation feedback:")
            print(validation_feedback)

        llm = ChatMistralAI(
            api_key=settings.MISTRAL_API_KEY,
            model=settings.MODEL_NAME,
            temperature=0,
        )

        messages = cls.prompt.format_messages(
            resume=resume.model_dump_json(indent=2),
            job_description=job_description,
            tone=tone,
            validation_feedback=validation_feedback,
        )

        try:

            print("\nInvoking Mistral...\n")

            response = llm.invoke(messages)

            print("========== RAW RESPONSE ==========")
            print(response.content)
            print("==================================\n")

            content = response.content.strip()

            # ---------------------------------
            # Remove markdown code fences
            # ---------------------------------

            if content.startswith("```json"):
                content = (
                    content.replace("```json", "")
                    .replace("```", "")
                    .strip()
                )

            elif content.startswith("```"):
                content = (
                    content.replace("```", "")
                    .strip()
                )

            # ---------------------------------
            # Parse JSON
            # ---------------------------------

            data = json.loads(content)

            print("========== PARSED JSON ==========")
            print(
                json.dumps(
                    data,
                    indent=2,
                )
            )
            print("=================================\n")

            # ---------------------------------
            # Validate Pydantic schema
            # ---------------------------------

            result = CoverLetterResponse.model_validate(
                data
            )

            print("========== SUCCESS ==========")
            print(result)
            print("=============================\n")

            return result

        except json.JSONDecodeError as e:

            print("\n========== JSON ERROR ==========")
            print(e)
            print("\nRaw content:")
            print(content)
            print("===============================\n")

            raise

        except ValidationError as e:

            print("\n======= VALIDATION ERROR =======")
            print(e)

            if "data" in locals():
                print(
                    json.dumps(
                        data,
                        indent=2,
                    )
                )

            print("===============================\n")

            raise

        except Exception as e:

            print("\n========== LLM ERROR ==========")
            print(type(e))
            print(e)
            print("===============================\n")

            raise