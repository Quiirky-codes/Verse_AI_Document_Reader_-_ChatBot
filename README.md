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

