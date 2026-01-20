import { useState } from "react";
import { api } from "../api/evolution";

export default function UploadPlanilha() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const enviar = async () => {
    if (!file) {

      alert("Selecione uma planilha para iniciar as mensagens. ");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      await api.post("/upload", formData);

      alert("Planilha enviada com sucesso, só aguardar!");
      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao enviar planilha :(");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Área de upload */}
      <label className="upload-box">
        <input
          key={file ? file.name : "empty"}   
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <span>
          {file ? file.name : "Clique ou arraste a planilha aqui"}
        </span>

        <small>
          {file
            ? `${(file.size / 1024).toFixed(2)} KB`
            : "Nenhum arquivo selecionado"}
        </small>
      </label>

      {/* Botões */}
      <div className="actions">
        <button
          className="btn-cancel"
          type="button"
          onClick={() => setFile(null)}
          disabled={loading}
        >
          Cancelar
        </button>

      <button
  className={`btn-primary ${loading ? "loading" : ""}`}
  type="button"
  onClick={enviar}
  disabled={loading}
>
  {loading ? (
    <>
      Enviando <span className="truck">🚚</span>
    </>
  ) : (
    <>
      Enviar <span className="truck">🚚</span>
    </>
  )}
</button>

      </div>
    </>
  );
}
