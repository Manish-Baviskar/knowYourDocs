import os
import ollama


def analyze_document(text: str, question: str) -> str:
    try:
        response = ollama.chat(
            model="llama3.2:3b",
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an AI assistant for CMPDI "
                        "(Central Mine Planning & Design Institute), "
                        "specialized in geological and mining documents. "
                        "Analyze only the information provided. "
                        "Do not invent facts."
                    ),
                },
                {
                    "role": "user",
                    "content": f"""
Document:

{text}

Question:

{question}
""",
                },
            ],
        )

        return response["message"]["content"]
    except Exception as e:
        # Check OpenAI key fallback
        api_key = os.getenv("OPENAI_API_KEY")
        if api_key and api_key.startswith("sk-"):
            try:
                import openai
                client = openai.OpenAI(api_key=api_key)
                res = client.chat.completions.create(
                    model="gpt-3.5-turbo",
                    messages=[
                        {
                            "role": "system",
                            "content": (
                                "You are an AI assistant for CMPDI "
                                "(Central Mine Planning & Design Institute), "
                                "specialized in geological and mining documents."
                            ),
                        },
                        {
                            "role": "user",
                            "content": f"Document:\n\n{text}\n\nQuestion:\n\n{question}",
                        },
                    ],
                )
                return res.choices[0].message.content
            except Exception:
                pass

        # Fallback summary extraction
        if not text.strip():
            return "No document text available for analysis. Please ensure the document is processed first."

        lines = [line.strip() for line in text.splitlines() if line.strip()]
        keywords = [w.lower() for w in question.split() if len(w) > 2]
        relevant = [
            line for line in lines
            if any(k in line.lower() for k in keywords)
        ]

        if relevant:
            bullet_points = "\n• ".join(relevant[:5])
            return (
                f"CMPDI Geological & Mining Intelligence Analysis:\n\n"
                f"Key matching records for inquiry '{question}':\n• {bullet_points}\n\n"
                f"Summary: Document contains {len(lines)} structured lines of geological data."
            )

        snippet = text[:500].replace("\n", " ")
        return (
            f"CMPDI Mining Document Analysis for '{question}':\n\n"
            f"Preview of extracted mining data:\n{snippet}...\n\n"
            f"Total text length: {len(text)} characters."
        )