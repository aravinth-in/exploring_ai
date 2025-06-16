# MCP Server

A minimal, extensible server that exposes your local data and tools to LLMs (like Claude or Gemini) using a standard interface. This allows LLMs to read, summarize, and even modify your files or trigger actions—without hard-coding logic for every tool or API.

---

## 🚦 What is MCP?

**MCP** stands for **Model Control Protocol** (or "Multi-Channel Proxy" in some contexts). It's a simple pattern:  
- **MCP Server:** Exposes a tool, API, or data source (like your notes folder) via HTTP endpoints.
- **MCP Client:** The LLM runtime (e.g., Claude Desktop, or your own script) that connects to MCP servers and invokes their capabilities.

**Why?**  
Traditionally, integrating LLMs with tools (like Notion, GitHub, or your filesystem) required custom code for each model and tool. MCP standardizes this, so any LLM that understands MCP can use any MCP server, and you can mix and match tools easily.

---

## 🧠 Example: How MCP Works

Suppose you want your LLM to summarize your notes and send an email:

> "Summarize all my notes about project X and email my team the summary."

**How it works:**
1. **LLM (Claude, Gemini, etc.)** receives your prompt.
2. It decides to:
    - Call an MCP file server to access your notes.
    - Use an MCP tool server to summarize the notes.
    - Use an MCP email server to send the summary.
3. Each MCP server returns structured results.
4. The LLM combines the results and confirms:  
   ✅ "Email sent with the summary of Project X."

---

## 🚀 How to Run This MCP Server

This repo includes a simple MCP server using Flask that:
- Serves note files from `./notes`
- Proxies requests to Gemini 1.5-Flash (so your API key stays secret)
- Lets LLMs (or you) summarize notes via HTTP

### 1. Install dependencies

```sh
pip install flask flask-cors google-generativeai
```

### 2. Set your Gemini API key

```sh
export GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### 3. Start the server

```sh
python mcp_server.py
```

You should see:
```
Starting MCP server at http://localhost:5000
```

---

## 🖥️ Demo

1. **List notes:**  
   Visit [http://localhost:5000/notes](http://localhost:5000/notes) to see available notes.

2. **Get a note:**  
   ```
   GET /notes/note1.txt
   ```

3. **Summarize a note:**  
   Send a POST request to `/summarize` with JSON:
   ```json
   {
     "filename": "note1.txt"
   }
   ```
   The server will use Gemini to summarize the note and return the summary.

4. **Sample server output:**
   ```
   * Restarting with stat
   Starting MCP server at http://localhost:5000
   * Debugger is active!
   127.0.0.1 - - [16/Jun/2025 23:31:09] "GET /notes HTTP/1.1" 200 -
   127.0.0.1 - - [16/Jun/2025 23:31:09] "GET /notes/note1.txt HTTP/1.1" 304 -
   127.0.0.1 - - [16/Jun/2025 23:31:12] "POST /summarize HTTP/1.1" 200 -
   ```

---

## 📝 Key Concepts

| Concept | Clarification |
| ------- | ------------- |
| **MCP Server** | Exposes a specific tool, API, or data source to the LLM via HTTP endpoints |
| **MCP Client** | The LLM runtime (e.g., Claude Desktop) that connects to MCP servers and invokes their capabilities |
| **LLM Autonomy** | The LLM chooses which MCP endpoints to call based on prompt and available tools |
| **Context Extension** | MCP lets the LLM dynamically fetch or update context (files, APIs) as needed |
| **Read/Write** | The LLM can read from or write to files, databases, or trigger actions via MCP servers |

---

## ⚡ Why Use MCP?

- **No more hard-coding for every tool or model**
- **Mix and match tools easily**
- **Keep your API keys and data private**
- **Let LLMs automate real workflows**

---

## 📂 Directory Structure

```
testing_mcp/
├── mcp_server.py      # The MCP Flask server
├── notes/             # Folder containing your note files
└── README.md          # This file
```

---

## 🛡️ Security Note

- **Never expose your API keys publicly.**
- This server is for local/demo use. For production, add authentication and HTTPS.

---