"""
Flask “MCP” server
──────────────────
• Serves note files from ./notes
• Proxies your request to Gemini 1.5‑Flash so the browser never hits Google directly
• Requires:  pip install flask flask-cors google-generativeai
• Set your Gemini key first, e.g.  export GEMINI_API_KEY="YOUR_KEY"
"""

import os
from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import google.generativeai as genai

# ---------- config ----------
NOTES_DIR = os.path.join(os.path.dirname(__file__), "notes")
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-1.5-flash")
# ----------------------------

app = Flask(__name__)
CORS(app)                              # allow same‑origin JS calls

@app.route("/notes", methods=["GET"])
def list_notes():
    """Return a JSON array of note filenames."""
    files = [
        f for f in os.listdir(NOTES_DIR)
        if os.path.isfile(os.path.join(NOTES_DIR, f))
    ]
    return jsonify(files)

@app.route("/notes/<path:filename>", methods=["GET"])
def get_note(filename):
    """Return the raw contents of a single note."""
    if ".." in filename or filename.startswith("/"):
        return jsonify({"error": "Invalid filename"}), 400
    return send_from_directory(NOTES_DIR, filename)

@app.route("/summarize", methods=["POST"])
def summarize():
    """Proxy → Gemini.  Body: { "content": "<note text>" }"""
    content = request.json.get("content", "")
    if not content:
        return jsonify({"error": "No content provided"}), 400

    try:
        resp = model.generate_content(
            f"Summarize the following note:\n\n{content}",
            generation_config={"max_output_tokens": 300, "temperature": 0.7},
        )
        return jsonify({"summary": resp.text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    print("Starting MCP server at http://localhost:5000")
    app.run(host="localhost", port=5000, debug=True)
