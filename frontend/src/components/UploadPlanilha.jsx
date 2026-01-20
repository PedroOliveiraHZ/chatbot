import { useState } from "react";
import { api } from "../api/evolution";

export default function UploadPlanilha() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const enviar = async () => {
    if (!file) {
      alert("Selecione ou arraste uma planilha para iniciar.");
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

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files[0];
    if (!droppedFile) return;

    if (!droppedFile.name.endsWith(".xlsx")) {
      alert("Apenas arquivos .xlsx são permitidos");
      return;
    }

    setFile(droppedFile);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      {/* Área de upload com drag & drop */}
      <label
        className={`upload-box ${dragActive ? "drag-active" : ""}`}
        onDragEnter={() => setDragActive(true)}
        onDragOver={handleDrag}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
      >
        <input
          key={file ? file.name : "empty"}
          type="file"
          accept=".xlsx"
          disabled={loading}
          onChange={(e) => setFile(e.target.files[0])}
        />

        <span>
          {dragActive
            ? "Solte o arquivo aqui"
            : file
            ? file.name
            : "Clique ou arraste a planilha aqui"}
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
