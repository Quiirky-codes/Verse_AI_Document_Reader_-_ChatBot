import streamlit as st
from langchain_community.document_loaders import (
    TextLoader,
    PyPDFLoader,
    UnstructuredWordDocumentLoader
)
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA, LLMChain
from langchain.chains.summarize import load_summarize_chain
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from dotenv import load_dotenv
import os
import tempfile

load_dotenv()
CHROMA_PATH = "chroma"
st.set_page_config(page_title="Gemini Chat with Docs", layout="wide")

st.title("\U0001F4C4 Gemini Chat with Your Documents")
chat_history = []

db = None
all_docs = []

# File Upload
uploaded_file = st.file_uploader("Upload a document (.pdf, .txt, .docx)", type=["pdf", "txt", "docx"])

if uploaded_file:
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{uploaded_file.name.split('.')[-1]}") as tmp_file:
        tmp_file.write(uploaded_file.read())
        tmp_path = tmp_file.name

    # Choose loader based on file type
    ext = uploaded_file.name.split('.')[-1].lower()
    if ext == "pdf":
        loader = PyPDFLoader(tmp_path)
    elif ext == "txt":
        loader = TextLoader(tmp_path)
    elif ext == "docx":
        loader = UnstructuredWordDocumentLoader(tmp_path)
    else:
        st.error("Unsupported file format")
        st.stop()

    documents = loader.load()
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    all_docs = text_splitter.split_documents(documents)

    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    db = Chroma.from_documents(all_docs, embedding=embeddings, persist_directory=CHROMA_PATH)
    db.persist()
    st.success("Document uploaded and indexed!")

    # Ask Questions
    st.subheader("Ask a question about the document:")
    query = st.text_input("Enter your question")

    if query:
        retriever = db.as_retriever(search_kwargs={"k": 1})
        relevant_docs = retriever.get_relevant_documents(query)

        llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro", temperature=0.3)
        qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=db.as_retriever(search_kwargs={"k": 1}), chain_type="stuff")
        answer = qa_chain.run(query)

        st.markdown(f"### \U0001F916 Answer:\n{answer}")
        chat_history.append((query, answer))

    # Show Chat History
    if chat_history:
        st.subheader("\U0001F4AC Chat History")
        for q, a in chat_history:
            st.markdown(f"**Q:** {q}")
            st.markdown(f"**A:** {a}")

    st.markdown("---")
    st.subheader("\U0001F4DD Advanced Document Tools")

    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", temperature=0.3)

    # One-Click Summary
    if st.button("✨ Summarize Entire Document"):
        summary_chain = load_summarize_chain(llm, chain_type="stuff")
        full_summary = summary_chain.run(all_docs)
        st.markdown(f"#### \U0001F4CB Document Summary:\n{full_summary}")

    # Section-wise Summary
    if st.button("📑 Section-wise Summarization"):
        st.info("Generating section-wise summaries...")
        for i, section in enumerate(all_docs[:10]):  # limit for performance
            section_summary_chain = load_summarize_chain(llm, chain_type="stuff")
            section_summary = section_summary_chain.run([section])
            st.markdown(f"##### Section {i + 1}\n{section_summary}")

    # FAQ Generator
    if st.button("❓ Generate FAQs from Document"):
        faq_prompt = PromptTemplate(
            input_variables=["context"],
            template="""
You are a helpful assistant. Given the following content, generate 5 FAQs (with answers).

Content:
{context}

Format:
Q1: ...\nA1: ...\nQ2: ...\nA2: ... (and so on)
"""
        )
        faq_chain = LLMChain(llm=llm, prompt=faq_prompt)
        context_text = "\n".join([doc.page_content for doc in all_docs[:5]])  # use top sections only
        faqs = faq_chain.run(context=context_text)
        st.markdown(f"#### 📚 Generated FAQs:\n{faqs}")
