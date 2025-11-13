# Overview

Verse is an AI-powered chatbot that reads, understands, and answers questions from your documents. 
Built using Retrieval-Augmented Generation (RAG), it combines document embeddings with a powerful LLM (Gemini 1.5 Pro) to provide accurate and context-aware responses. 
The app features a clean, fast frontend built with React, Vite, and TailwindCSS.


# Features

* 📄 Upload and query documents interactively.

* 🧠 RAG-based retrieval with ChromaDB as the vector store.

* 🤖 Powered by Google Gemini 1.5 Pro Latest(via Gemini API).

* 💡 Tailored markdown and unstructured document support.

* ⚡ Lightweight, fast React frontend with Tailwind styling.

* 🔧 Local backend server using LangChain + Flask.


# Tech Stack

## Backend:

* Python, LangChain, ChromaDB

* Gemini 1.5 Pro (via Gemini API key)

* Conda + pip environment

## Frontend:

* React

* Vite

* Tailwind CSS


# Prerequisites

Make sure the following are installed:

* **Python 3.10+**

* **Node.js + npm**

* **Conda** (required to install onnxruntime properly for ChromaDB)

* A **Gemini API Key** (from Google AI Studio)


# Backend Setup

**1. Clone the Repository**

```
git clone https://github.com/Quiirky-codes/Verse_AI_Document_Reader_-_ChatBot.git
cd LangChain-Rag
```

**2. Install ONNXRuntime via Conda (important!)**

For MacOS:

```
conda install onnxruntime -c conda-forge
```

> This step is required before running `pip install -r requirements.txt` due to compatibility issues.

For Windows:

* Install Microsoft C++ Build Tools from [this link](https://visualstudio.microsoft.com/visual-cpp-build-tools/)

* Set the environment variable as instructed in the final step of installation.

**3. Install Python Dependencies**

```
pip install -r requirements.txt

pip install "unstructured[md]"
```

# Create the Document Database

To convert documents into embeddings and store them in ChromaDB:

```
python create_database.py
```

What this does:

* Reads all documents from the specified directory.

* Splits and embeds them using LangChain tools.

* Stores them in a persistent ChromaDB instance.

# Run the Backend API Server

Start your backend API server:

```
python api.py
```

This exposes endpoints to:

* Accept user queries.

* Retrieve relevant document chunks using ChromaDB.

* Send the final prompt to Gemini 1.5 Pro and return the response.

Make sure your environment variable `GEMINI_API_KEY` is set.
Create a `.env` file with:

```
GEMINI_API_KEY=your_actual_gemini_key_here
```

# Optional: Query from CLI
You can also test the backend using this command:
```
python query_data.py "How does Alice meet the Mad Hatter?"
```
This script:

* Uses the same RAG backend pipeline.

* Queries stored embeddings.

* Uses Gemini to generate an answer.


# Frontend Setup

**1. Navigate to the frontend folder**

```
cd verse-react-app
```

**2. Install frontend dependencies**

```
npm install
```

**3. Start the frontend server**

```
npm run dev
```
This starts a local development server for the React + Vite + Tailwind frontend. Make sure the backend `(api.py)` is running before using the chatbot interface.


# Environment Variables

You should create a .env file in your root folder with the following:

```
GEMINI_API_KEY=your_gemini_api_key_here
```

> Only the Gemini key is required (OpenAI key is NOT used).


# Example Queries

Try the following questions after uploading your document:

* “Summarize the main points of the second section.”

* “What are the legal terms defined in the document?”

* “Who is the author and what is their background?”

* “Give me a timeline of events based on this file.”

# Project Structure

```
LangChain-Rag/
│
├── create_database.py      # Converts documents to embeddings
├── query_data.py           # CLI test script for querying
├── api.py                  # Backend API using LangChain + Gemini
├── requirements.txt        # Python dependencies
├── verse-react-app/        # Frontend (React + Vite + Tailwind)
└── .env                    # Contains your Gemini API key

```

# LICENSE

MIT License

Copyright (c) 2025 Amith M Jain

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including, without limitation, the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGE, OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.




