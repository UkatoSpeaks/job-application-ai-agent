import json

from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI
from pydantic import ValidationError

from app.core.config import settings
from app.schemas.resume import ParsedResume
from app.schemas.tailor import ResumeTailorResponse

from app.services.resume_tailor.prompt import (
    SYSTEM_PROMPT,
    USER_PROMPT,
)


class ResumeTailor:

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", SYSTEM_PROMPT),
            ("human", USER_PROMPT),
        ]
    )

    @classmethod
    def tailor(
        cls,
        resume: ParsedResume,
        job_description: str,
    ) -> ResumeTailorResponse:

        llm = ChatMistralAI(
            api_key=settings.MISTRAL_API_KEY,
            model=settings.MODEL_NAME,
            temperature=0,
        )

        messages = cls.prompt.format_messages(
            resume=resume.model_dump_json(indent=2),
            job_description=job_description,
        )

        print("\n========== SENDING TO MISTRAL ==========\n")

        response = llm.invoke(messages)

        print("\n========== RAW RESPONSE ==========")
        print(response.content)
        print("==================================\n")

        content = response.content.strip()

        if content.startswith("```json"):
            content = (
                content.replace("```json", "")
                .replace("```", "")
                .strip()
            )

        elif content.startswith("```"):
            content = (
                content.replace("```", "")
                .replace("```", "")
                .strip()
            )

        try:

            data = json.loads(content)

            print("\n========== LLM JSON ==========")
            print(json.dumps(data, indent=2))
            print("================================\n")

            return ResumeTailorResponse.model_validate(
                data
            )

        except json.JSONDecodeError as e:

            print("\n========== JSON ERROR ==========")
            print(e)
            print(content)
            raise

        except ValidationError as e:

            print("\n====== VALIDATION ERROR ======")
            print(e)
            print("\nReturned JSON:")
            print(json.dumps(data, indent=2))
            raise

        except Exception as e:

            print("\n========== UNKNOWN ERROR ==========")
            print(type(e))
            print(e)
            raise