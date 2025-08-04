from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document

# Optional: use dotenv if needed
from dotenv import load_dotenv
load_dotenv()

CHROMA_PATH = "chroma"

docs = [
    Document(page_content="The Eiffel Tower is in Paris."),
    Document(page_content="Mount Everest is the tallest mountain."),
]

embedding = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
db = Chroma.from_documents(docs, embedding)
results = db.similarity_search("What is the highest mountain?")
print(results[0].page_content)
