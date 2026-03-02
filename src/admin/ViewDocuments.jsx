/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

const folders = ["aadhar", "license", "PAN", "passport", "register"];

function ViewDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Fetch documents (safe with useCallback)
  const fetchDocuments = useCallback(async () => {
    setLoading(true);

    try {
      let allDocs = [];

      for (let folder of folders) {
        const { data, error } = await supabase.storage
          .from("documents") // ✅ bucket
          .list(folder);

        if (error) {
          console.error("List error:", error);
          continue;
        }

        for (let file of data) {
          const path = `${folder}/${file.name}`;

          const { data: urlData } =
            await supabase.storage
              .from("documents")
              .createSignedUrl(path, 3600);

          if (!urlData) continue;

          allDocs.push({
            name: file.name,
            folder,
            url: urlData.signedUrl,
            path,
          });
        }
      }

      setDocuments(allDocs);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }, []);

  // Load once
  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  // Delete
  const deleteDoc = async (doc) => {
    if (!window.confirm("Delete this file?")) return;

    const { error } = await supabase.storage
      .from("documents")
      .remove([doc.path]);

    if (error) {
      alert("Delete failed");
      return;
    }

    fetchDocuments();
  };

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <h2>My Documents</h2>

        <button onClick={() => navigate(-1)}>
          ⬅ Back
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : documents.length === 0 ? (
        <p>No documents found</p>
      ) : (
        <div style={styles.grid}>

          {documents.map((doc) => (
            <div key={doc.path} style={styles.card}>

              <b>{doc.folder}</b>

              <p>{doc.name}</p>

              <img src={doc.url} style={styles.img} />

              <div style={styles.actions}>

                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>

                <button
                  onClick={() => deleteDoc(doc)}
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>
      )}

    </div>
  );
}

export default ViewDocuments;

const styles = {
  container: {
    padding: "30px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "#fff",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, 250px)",
    gap: "20px",
  },

  card: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "10px",
  },

  img: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
  },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "10px",
  },
};