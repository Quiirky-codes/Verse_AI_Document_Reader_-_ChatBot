from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from dotenv import load_dotenv
import os

load_dotenv()

CHROMA_PATH = "chroma"


def main():
    query = input("Enter your query: ")
    db = Chroma(
        persist_directory=CHROMA_PATH,
        embedding_function=GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    )

    # Limit to only 1 most relevant result
    results = db.similarity_search(query, k=1)
    print(f"Found {len(results)} result{'s' if len(results) != 1 else ''}.")

    for i, result in enumerate(results):
        print(f"\nResult {i + 1}:")
        print(result.page_content)
        print(result.metadata)


if __name__ == "__main__":
    main()
