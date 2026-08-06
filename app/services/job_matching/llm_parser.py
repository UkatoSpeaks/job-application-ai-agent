import json

from pydantic import ValidationError

from langchain_core.prompts import ChatPromptTemplate
from langchain_mistralai import ChatMistralAI

from app.core.config import settings
from app.schemas.job_description import JobDescription

from app.services.job_matching.prompt import (
    SYSTEM_PROMPT,
    USER_PROMPT,
)


class JobDescriptionLLMParser:

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", SYSTEM_PROMPT),
            ("human", USER_PROMPT),
        ]
    )

    @classmethod
    def parse(
        cls,
        job_description: str,
    ) -> JobDescription:

        print("\n===================================")
        print("ENTERED LLM PARSER")
        print("===================================")

        print("API KEY EXISTS :", bool(settings.MISTRAL_API_KEY))
        print("MODEL :", settings.MODEL_NAME)

        if not settings.MISTRAL_API_KEY:
            raise ValueError(
                "Missing Mistral API Key."
            )

        llm = ChatMistralAI(
            api_key=settings.MISTRAL_API_KEY,
            model=settings.MODEL_NAME,
            temperature=0,
        )

        messages = cls.prompt.format_messages(
            job_description=job_description
        )

        try:

            print("\nCalling Mistral...\n")

            response = llm.invoke(messages)

            print("\nRAW RESPONSE")
            print(response)

            print("\nCONTENT")
            print(response.content)

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
                    .strip()
                )

            print("\nCLEAN JSON")
            print(content)

            data = json.loads(content)

            print("\nDICT")
            print(data)

            job = JobDescription.model_validate(
                data
            )

            print("\nVALIDATED")
            print(job)

            return job

        except json.JSONDecodeError as e:

            print("\nJSON ERROR")
            print(e)
            raise

        except ValidationError as e:

            print("\nVALIDATION ERROR")
            print(e)
            raise

        except Exception as e:

            print("\nLLM ERROR")
            print(type(e))
            print(e)
            raise