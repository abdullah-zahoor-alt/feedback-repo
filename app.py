from flask import Flask, request, jsonify, render_template # type: ignore
import json, os
from datetime import datetime

app = Flask(__name__)
DATA_FILE = "data.json"

# Create empty JSON file if not exists
if not os.path.exists(DATA_FILE):
    with open(DATA_FILE, "w") as f:
        json.dump([], f)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/submit", methods=["POST"])
def submit():
    content = request.json
    sentence = content.get("sentence", "").strip()
    if sentence:
        with open(DATA_FILE, "r+") as f:
            data = json.load(f)
            data.append({
                "sentence": sentence,
                "timestamp": datetime.utcnow().isoformat()
            })
            f.seek(0)
            json.dump(data, f, indent=2)
    return jsonify({"status": "success"})

@app.route("/feedbacks")
def feedbacks():
    with open(DATA_FILE, "r") as f:
        data = json.load(f)
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True, port=5002)

# source venv/bin/activate
# python app.py       
