from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from whatsapp_bot import enviar_mensagens

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route("/upload", methods=["POST"])
def upload_planilha():
    if "file" not in request.files:
        return jsonify({"erro": "Arquivo não enviado"}), 400

    file = request.files["file"]
    caminho = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(caminho)

    enviar_mensagens(caminho)

    return jsonify({"status": "Mensagens enviadas com sucesso"})

if __name__ == "__main__":
    app.run(
        port=3001,
        debug=False,
        use_reloader=False
    )
