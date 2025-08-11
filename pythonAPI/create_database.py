from langchain_community.document_loaders import (
    UnstructuredPDFLoader,
    TextLoader,
    UnstructuredWordDocumentLoader
)
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv
import os

load_dotenv()

DATA_PATH = "data/books"
CHROMA_PATH = "chroma"

def load_documents():
    documents = []

    for root, _, files in os.walk(DATA_PATH):
        for file in files:
            full_path = os.path.join(root, file)
            
            if file.endswith(".pdf"):
                loader = UnstructuredPDFLoader(full_path)
            elif file.endswith(".md") or file.endswith(".txt"):
                loader = TextLoader(full_path, encoding='utf-8')
            elif file.endswith(".docx"):
                loader = UnstructuredWordDocumentLoader(full_path)
            else:
                continue  # Unsupported file format
            
            docs = loader.load()
            documents.extend(docs)

    return documents

def main():
    print("Loading documents...")
    documents = load_documents()

    print("Splitting documents...")
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100
    )
    chunks = text_splitter.split_documents(documents)
    print(f"Split {len(documents)} documents into {len(chunks)} chunks.")

    print("Creating vector store...")
    db = Chroma.from_documents(
        chunks,
        embedding=GoogleGenerativeAIEmbeddings(model="models/embedding-001"),
        persist_directory=CHROMA_PATH,
    )

    db.persist()
    print(f"Saved {len(chunks)} chunks to Chroma.")

if __name__ == "__main__":
    main()
