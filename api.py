import os
from flask import Flask, request, jsonify, render_template
from werkzeug.utils import secure_filename
from flask_cors import CORS
from langchain_community.document_loaders import TextLoader, PyPDFLoader, UnstructuredWordDocumentLoader
from langchain_community.vectorstores import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain.chains.summarize import load_summarize_chain
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain.text_splitter import RecursiveCharacterTextSplitter
from dotenv import load_dotenv

app = Flask(__name__, static_url_path='/static', static_folder='static', template_folder='templates')
CORS(app)
load_dotenv()

UPLOAD_FOLDER = "uploads"
CHROMA_PATH = "chroma"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(CHROMA_PATH, exist_ok=True)

db = None
all_docs = []

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def upload():
    global db, all_docs
    if "document" not in request.files:
        return jsonify({"error": "No document uploaded"}), 400

    file = request.files["document"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    ext = file.filename.rsplit(".", 1)[1].lower()
    filepath = os.path.join(UPLOAD_FOLDER, secure_filename(file.filename))
    file.save(filepath)

    # Choose the appropriate loader
    if ext == "pdf":
        loader = PyPDFLoader(filepath)
    elif ext == "txt":
        loader = TextLoader(filepath)
    elif ext == "docx":
        loader = UnstructuredWordDocumentLoader(filepath)
    else:
        return jsonify({"error": "Unsupported file format"}), 400

    documents = loader.load()
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    all_docs = splitter.split_documents(documents)

    embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")
    db = Chroma.from_documents(all_docs, embedding=embeddings, persist_directory=CHROMA_PATH)
    db.persist()

    return jsonify({"message": "Document uploaded and indexed successfully."})


@app.route("/ask", methods=["POST"])
def ask():
    global db
    query = request.json.get("query")
    if not db:
        return jsonify({"error": "No document indexed yet."}), 400

    retriever = db.as_retriever(search_kwargs={"k": 1})
    relevant_docs = retriever.get_relevant_documents(query)

    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", temperature=0.3)
    response = llm.predict(f"Answer this based on the document:\n\nQuestion: {query}\n\nContext:\n{relevant_docs[0].page_content}")

    return jsonify({"answer": response})


@app.route("/summary", methods=["POST"])
def summarize():
    global all_docs
    if not all_docs:
        return jsonify({"error": "No document uploaded."}), 400

    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", temperature=0.3)
    chain = load_summarize_chain(llm, chain_type="stuff")
    summary = chain.run(all_docs)
    return jsonify({"summary": summary})


@app.route("/section_summary", methods=["POST"])
def section_summary():
    global all_docs
    if not all_docs:
        return jsonify({"error": "No document uploaded."}), 400

    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", temperature=0.3)
    results = []
    for i, section in enumerate(all_docs[:5]):
        chain = load_summarize_chain(llm, chain_type="stuff")
        result = chain.run([section])
        results.append(f"Section {i + 1}:\n{result}")
    return jsonify({"sections": results})


@app.route("/generate_faqs", methods=["POST"])
def generate_faqs():
    global all_docs
    if not all_docs:
        return jsonify({"error": "No document uploaded."}), 400

    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", temperature=0.3)
    context = "\n".join([doc.page_content for doc in all_docs[:3]])
    prompt = PromptTemplate(
        input_variables=["context"],
        template="""
From the content below, generate 5 FAQs with answers.

Content:
{context}

Output format:
Q1: ...
A1: ...
Q2: ...
A2: ...
(and so on)
"""
    )
    chain = LLMChain(llm=llm, prompt=prompt)
    faqs = chain.run({"context": context})
    return jsonify({"faqs": faqs})

# ✨ NEW FEATURE ENDPOINT
@app.route("/extract", methods=["POST"])
def extract():
    global all_docs
    if not all_docs:
        return jsonify({"error": "No document uploaded."}), 400

    llm = ChatGoogleGenerativeAI(model="gemini-1.5-pro-latest", temperature=0.2)
    # Use the full document context for a comprehensive extraction
    context = "\n".join([doc.page_content for doc in all_docs])
    
    prompt = PromptTemplate(
        input_variables=["context"],
        template="""
From the content below, extract the key entities and main keywords.

Content:
{context}

Output the result in the following format, keeping each list on a new line and using markdown for bolding:
**Entities:**
- **People:** [List of people]
- **Organizations:** [List of organizations]
- **Locations:** [List of locations]

**Keywords:**
- [List of 5-7 key terms or topics]
"""
    )
    chain = LLMChain(llm=llm, prompt=prompt)
    extraction_result = chain.run({"context": context})
    return jsonify({"extraction": extraction_result})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)